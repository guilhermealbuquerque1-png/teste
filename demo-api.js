/* ==========================================================================
   MEU BAIRRO — demo-api.js (PROTÓTIPO DEMONSTRATIVO)

   Substitui o backend (Spring Boot / MySQL / Render) por uma API simulada
   que roda 100% no navegador, com os dados guardados em localStorage.

   Como funciona: o script.js continua chamando fetch(`${API_BASE}/...`) como
   no site real, mas API_BASE agora é "demo://meu-bairro/api". Este arquivo
   intercepta essas chamadas e responde com os mesmos caminhos, status HTTP e
   formatos de JSON do backend original. Nenhuma requisição sai do navegador.

   Carregue ESTE arquivo ANTES do script.js.

   Observações:
   - Contas, senhas e ocorrências existem apenas neste navegador. A "senha" é
     guardada só como um hash simples de demonstração (NÃO é segurança real).
   - Fotos enviadas são reduzidas (máx. 1280 px, JPEG) para caber no localStorage.
   - Para voltar ao estado inicial: MeuBairroDemo.restaurar() (botão da faixa
     superior) ou MeuBairroDemo.reset() (sem confirmação).
   ========================================================================== */
(function () {
  'use strict';

  var API_PREFIX = 'demo://meu-bairro/api';
  var KEY_DB = 'meuBairro:demo:db';
  var KEY_IMG = 'meuBairro:demo:images';
  var KEY_VER = 'meuBairro:demo:version';
  var VERSION = '14';
  var LATENCIA_MS = 80;               // só para os estados "Entrando…/Publicando…" aparecerem
  var MAX_FOTOS = 3;
  var MAX_BYTES = 5 * 1024 * 1024;
  var TIPOS_FOTO = ['image/jpeg', 'image/png', 'image/webp'];
  var MAX_TENTATIVAS_LOGIN = 5;                 // RF05: tentativas inválidas consecutivas
  var BLOQUEIO_LOGIN_MS = 15 * 60 * 1000;       // RF05: 15 minutos de bloqueio
  var INTERVALO_REGISTRO_MS = 60 * 1000;        // RF10: intervalo mínimo entre registros do mesmo usuário

  /* ------------------------------------------------------------------------
     Utilidades
     ------------------------------------------------------------------------ */
  function pad(n) { return String(n).padStart(2, '0'); }

  // Data/hora local no formato que o backend devolve (LocalDateTime, sem fuso).
  function agoraIso() {
    var d = new Date();
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) +
           'T' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
  }

  function hojeData() { return agoraIso().slice(0, 10); }

  function formatarEspera(segundos) {
    var m = Math.floor(segundos / 60), s = segundos % 60;
    return m + ' min ' + pad(s) + ' s';
  }

  // Hash simples e síncrono (cyrb53) — apenas para não deixar a senha em texto puro.
  function hashSenha(texto) {
    var h1 = 0xdeadbeef, h2 = 0x41c6ce57, s = 'meu-bairro-demo:' + texto;
    for (var i = 0, ch; i < s.length; i++) {
      ch = s.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
  }

  function resposta(status, corpo) {
    return new Response(JSON.stringify(corpo), {
      status: status,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  function semCorpo(status) { return new Response(null, { status: status }); }
  function erro(status, mensagem) { return resposta(status, { message: mensagem }); }

  function esperar(ms) { return new Promise(function (ok) { setTimeout(ok, ms); }); }

  function lerJson(init) {
    try { return init && init.body ? JSON.parse(init.body) : {}; }
    catch (_) { return null; }
  }

  /* ------------------------------------------------------------------------
     Dados iniciais (todos fictícios)
     ------------------------------------------------------------------------ */
var CATEGORIAS = [
  { id: 1, nome: 'Vias e pavimentação' },
  { id: 2, nome: 'Drenagem e alagamento' },
  { id: 3, nome: 'Iluminação pública' },
  { id: 4, nome: 'Lixo e limpeza urbana' },
  { id: 5, nome: 'Água e esgoto' },
  { id: 6, nome: 'Calçadas e acessibilidade' },
  { id: 7, nome: 'Outro' }
];


  function dadosIniciais() {
    var usuarios = [
      { id: 1, nome: 'João', email: 'demo@meubairro.example', senhaHash: hashSenha('Demo@123') },
      { id: 2, nome: 'Ana ',   email: 'ana@meubairro.example',   senhaHash: null },
      { id: 3, nome: 'Carlos ', email: 'carlos@meubairro.example', senhaHash: null },
      { id: 4, nome: 'Joana ',  email: 'joana@meubairro.example',  senhaHash: null }
    ];

    // id crescente = data crescente (a home mostra as 4 maiores)
    var o = function (id, titulo, descricao, bairro, rua, cep, complemento, categoryId, userId, data, confs, extra) {
      var r = {
        id: id, titulo: titulo, descricao: descricao, bairro: bairro, rua: rua, cep: cep,
        complemento: complemento, endereco: rua + ', ' + bairro, categoryId: categoryId,
        userId: userId, status: 'PENDENTE', dataRegistro: data, dataResolucao: null,
        responsavelResolucao: null, _confs: confs
      };
      if (extra) for (var k in extra) r[k] = extra[k];
      return r;
    };

    var ocorrencias = [
        o(1, 'Extravasamento de água em via pública',
        'Um grande extravasamento de água na avenida Umberto Calderaro Filho. A situação causa transtornos à circulação de veículos e pedestres. A Prefeitura notificou a concessionária para que adote providências.',
        'Adrianópolis', 'Avenida Umberto Calderaro Filho','', 'esquina com a Rua Fortaleza',
         2, 3, '2026-10-16T16:23:00', 12),


      o(2, 'rompimento de tubulação, fuga de material e formação de cratera',
        'Prefeitura iniciou a recuperação da rede de drenagem e a substituição do tubo danificado. A recomposição do meio-fio e da sarjeta ainda seria realizada após essa etapa.',
        'Redenção', 'Rua Poranga', '69047-210', 'Em frente a uma residência, no trecho afetado pela cratera', 2, 1, '2026-09-25T16:20:00', 15,
        {status: 'RESOLVIDO', dataResolucao: '2026-10-14T00:00:00', responsavelResolucao: 'Prefeitura de Manaus' } ),

        o(3, 'Buracos e cratera com risco de acidentes',
        'Buracos no asfalto e pontos de alagamento que dificultam a circulação de pedestres e veículos, intervenções anteriores não resolveram definitivamente o problema, tivemos que improvisar o preenchimento de buracos com pedras.',
        'Tarumã', 'Avenida Praia do Futuro', '69041-400', 'Trecho com buracos e cratera em frente a uma residência', 1, 1, '2026-10-05T18:30:00', 9), 
  
        o(4, 'Bueiro entupido com lixo e água parada',
        'O bueiro está tomado por lixo e a água da chuva não escoa. A rua alaga e a água parada acumula mosquitos.',
        'Educandos', 'Rua do Porto', '69000-000', 'Ao lado da escadaria', 4, 4, '2026-10-08T11:10:00', 4)
    ];

    var confirmacoes = [];
    ocorrencias.forEach(function (oc) {
      for (var i = 1; i <= oc._confs; i++) {
        confirmacoes.push({ occurrenceId: oc.id, userId: 1000 + i });   // moradores fictícios
      }
      delete oc._confs;
    });

    return {
      categories: CATEGORIAS,
      users: usuarios,
      occurrences: ocorrencias,
      confirmations: confirmacoes,
      sessions: {},                                // token -> userId
      seq: { user: 5, occurrence: 1 }
    };
  }

  function imagensIniciais() {
    var img = function (id, nome) { return { id: id, imageUrl: 'images/demo/' + nome + '.jpeg' }; };
    return {
      seq: 100,
      byOccurrence: {
         '1':  [img(1, 'alagamento')],
         '2':  [img(1, 'buraco-2'), img(1, 'buraco-3')],
         '3':  [img(3, 'buraco-1')],
         '4':  [img(4, 'lixo')],
      }
    };
  }


  /* ------------------------------------------------------------------------
     Persistência (localStorage)
     ------------------------------------------------------------------------ */
  function gravar(chave, valor) {
    localStorage.setItem(chave, JSON.stringify(valor));   // pode lançar QuotaExceededError
  }

  function semear() {
    gravar(KEY_DB, dadosIniciais());
    gravar(KEY_IMG, imagensIniciais());
    localStorage.setItem(KEY_VER, VERSION);
  }

  function garantirDados() {
    var ok = localStorage.getItem(KEY_VER) === VERSION &&
             localStorage.getItem(KEY_DB) && localStorage.getItem(KEY_IMG);
    if (!ok) semear();
  }

  function lerBanco() {
    try { return JSON.parse(localStorage.getItem(KEY_DB)); }
    catch (_) { semear(); return JSON.parse(localStorage.getItem(KEY_DB)); }
  }
  function lerImagens() {
    try { return JSON.parse(localStorage.getItem(KEY_IMG)); }
    catch (_) { semear(); return JSON.parse(localStorage.getItem(KEY_IMG)); }
  }

  /* ------------------------------------------------------------------------
     Conversão para o formato JSON do backend
     ------------------------------------------------------------------------ */
  function totalConfirmacoes(db, id) {
    return db.confirmations.filter(function (c) { return c.occurrenceId === id; }).length;
  }

  function paraDto(db, o) {
    var cat = db.categories.find(function (c) { return c.id === o.categoryId; }) || { id: 5, nome: 'Outro' };
    var usr = db.users.find(function (u) { return u.id === o.userId; });
    return {
      id: o.id, titulo: o.titulo, descricao: o.descricao,
      bairro: o.bairro, rua: o.rua, cep: o.cep, complemento: o.complemento, endereco: o.endereco,
      status: o.status, dataRegistro: o.dataRegistro,
      dataResolucao: o.dataResolucao, responsavelResolucao: o.responsavelResolucao,
      category: { id: cat.id, nome: cat.nome },
      user: { id: o.userId, nome: usr ? usr.nome : 'Morador' },
      confirmations: totalConfirmacoes(db, o.id)
    };
  }

  /* ------------------------------------------------------------------------
     Autenticação (token simulado)
     ------------------------------------------------------------------------ */
  function cabecalho(init, nome) {
    var h = init && init.headers;
    if (!h) return '';
    if (typeof h.get === 'function') return h.get(nome) || '';
    return h[nome] || h[nome.toLowerCase()] || '';
  }

  function usuarioDoToken(db, init) {
    var m = /^Bearer\s+(\S+)$/.exec(cabecalho(init, 'Authorization'));
    if (!m) return null;
    var id = db.sessions[m[1]];
    if (id == null) return null;
    return db.users.find(function (u) { return u.id === id; }) || null;
  }

  /* ------------------------------------------------------------------------
     Fotos: reduz a imagem antes de guardar (o localStorage tem ~5 MB)
     ------------------------------------------------------------------------ */
  function reduzirImagem(arquivo) {
    return new Promise(function (resolve, reject) {
      var url = URL.createObjectURL(arquivo);
      var img = new Image();
      img.onload = function () {
        var max = 1280;
        var esc = Math.min(1, max / Math.max(img.width, img.height));
        var w = Math.max(1, Math.round(img.width * esc));
        var h = Math.max(1, Math.round(img.height * esc));
        var canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL('image/jpeg', 0.78));
      };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('imagem inválida')); };
      img.src = url;
    });
  }

  /* ------------------------------------------------------------------------
     Rotas
     ------------------------------------------------------------------------ */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var CEP_RE = /^\d{5}-?\d{3}$/;
  var NOME_RE = /^[\p{L}\p{M}\p{N} ]+$/u;   // letras (com acentos), números e espaços

  function validarOcorrencia(db, d) {
    if (!d) return 'Corpo da requisição inválido.';
    var titulo = String(d.titulo || '').trim();
    var descricao = String(d.descricao || '').trim();
    var bairro = String(d.bairro || '').trim();
    var rua = String(d.rua || '').trim();
    var cep = String(d.cep || '').trim();
    var cat = Number(d.categoryId);
    if (!titulo || !descricao || !bairro || !rua) return 'Preencha todos os campos obrigatórios.';
    if (titulo.length > 150) return 'O título deve ter no máximo 150 caracteres.';
    if (descricao.length > 2000) return 'A descrição deve ter no máximo 2000 caracteres.';
    if (cep && !CEP_RE.test(cep)) return 'CEP inválido. Use o formato 00000-000.';
    if (!db.categories.some(function (c) { return c.id === cat; })) return 'Categoria inválida.';
    return null;
  }

  function aplicarCampos(o, d) {
    o.titulo = String(d.titulo).trim();
    o.descricao = String(d.descricao).trim();
    o.bairro = String(d.bairro).trim();
    o.rua = String(d.rua).trim();
    o.cep = String(d.cep || '').trim();
    o.complemento = String(d.complemento || '').trim();
    o.endereco = o.rua + ', ' + o.bairro;
    o.categoryId = Number(d.categoryId);
  }

  // Gera o próximo id de ocorrência sem nunca repetir um id já existente
  function proximoIdOcorrencia(db) {
    var maior = db.occurrences.reduce(function (m, o) { return o.id > m ? o.id : m; }, 0);
    var id = Math.max(db.seq.occurrence, maior + 1);
    db.seq.occurrence = id + 1;
    return id;
  }

  async function rotear(caminho, metodo, init) {
    var db = lerBanco();
    var m;

    /* ---- categorias ---- */
    if (caminho === '/categories' && metodo === 'GET') return resposta(200, db.categories);

    /* ---- usuários ---- */
    if (caminho === '/users/register' && metodo === 'POST') {
      var d = lerJson(init);
      if (!d) return erro(400, 'Corpo da requisição inválido.');
      var nome = String(d.nome || '').trim(), email = String(d.email || '').trim().toLowerCase(), senha = String(d.senha || '');
      if (!nome || !email || !senha) return erro(400, 'Preencha nome, e-mail e senha.');
      if (!EMAIL_RE.test(email)) return erro(400, 'Informe um e-mail válido.');
      if (nome.length > 100 || !NOME_RE.test(nome)) {
        return erro(400, 'O nome deve conter apenas letras, números e espaços, sem caracteres especiais.');
      }
      if (senha.length < 8 || !/\p{Lu}/u.test(senha) || !/\p{Ll}/u.test(senha) || !/[0-9]/.test(senha) ||
          !/[^\p{L}\p{M}\p{N}\s]/u.test(senha) || /\s/.test(senha)) {
        return erro(400, 'A senha deve ter no mínimo 8 caracteres, com letra maiúscula, letra minúscula, número e caractere especial, sem espaços.');
      }
      if (db.users.some(function (u) { return u.email.toLowerCase() === email; })) {
        return erro(409, 'Este e-mail já está cadastrado.');
      }
      var novo = { id: db.seq.user++, nome: nome, email: email, senhaHash: hashSenha(senha) };
      db.users.push(novo);
      gravar(KEY_DB, db);
      return resposta(201, { id: novo.id, nome: novo.nome, email: novo.email });
    }

    if (caminho === '/users/login' && metodo === 'POST') {
      var dl = lerJson(init) || {};
      var em = String(dl.email || '').trim().toLowerCase();
      var usr = db.users.find(function (u) { return u.email.toLowerCase() === em; });

      /* RF05: bloqueio temporário após 5 tentativas consecutivas inválidas (por e-mail) */
      var agoraMs = Date.now();
      db.tentativasLogin = db.tentativasLogin || {};
      var reg = db.tentativasLogin[em] || { falhas: 0, bloqueadoAte: 0 };
      if (reg.bloqueadoAte && reg.bloqueadoAte > agoraMs) {
        var restante = Math.ceil((reg.bloqueadoAte - agoraMs) / 1000);
        return resposta(429, {
          message: 'Login temporariamente bloqueado por excesso de tentativas. Tente novamente em ' + formatarEspera(restante) + '.',
          retryAfterSeconds: restante
        });
      }
      if (reg.bloqueadoAte) reg = { falhas: 0, bloqueadoAte: 0 };   // o bloqueio terminou: recomeça a contagem

      if (!usr || !usr.senhaHash || usr.senhaHash !== hashSenha(String(dl.senha || ''))) {
        reg.falhas++;
        if (reg.falhas >= MAX_TENTATIVAS_LOGIN) {
          reg.bloqueadoAte = agoraMs + BLOQUEIO_LOGIN_MS;
          db.tentativasLogin[em] = reg;
          gravar(KEY_DB, db);
          return resposta(429, {
            message: 'Você excedeu ' + MAX_TENTATIVAS_LOGIN + ' tentativas inválidas. O login foi bloqueado por ' +
                     (BLOQUEIO_LOGIN_MS / 60000) + ' minutos.',
            retryAfterSeconds: BLOQUEIO_LOGIN_MS / 1000
          });
        }
        db.tentativasLogin[em] = reg;
        gravar(KEY_DB, db);
        return erro(401, 'E-mail ou senha inválidos.');
      }
      delete db.tentativasLogin[em];                                 // login válido zera a contagem
      var token = 'demo-' + usr.id + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
      db.sessions[token] = usr.id;
      gravar(KEY_DB, db);
      return resposta(200, { token: token, user: { id: usr.id, nome: usr.nome, email: usr.email } });
    }

    /* ---- exclusão definitiva da própria conta (RF15) ---- */
    if (caminho === '/users/me' && metodo === 'DELETE') {
      var conta = usuarioDoToken(db, init);
      if (!conta) return erro(401, 'Sessão inválida ou expirada.');
      var idsRemovidos = db.occurrences
        .filter(function (o) { return o.userId === conta.id; })
        .map(function (o) { return o.id; });
      db.occurrences = db.occurrences.filter(function (o) { return o.userId !== conta.id; });
      db.confirmations = db.confirmations.filter(function (c) {
        return c.userId !== conta.id && idsRemovidos.indexOf(c.occurrenceId) === -1;
      });
      db.users = db.users.filter(function (u) { return u.id !== conta.id; });
      if (db.ultimoRegistro) delete db.ultimoRegistro[conta.id];
      Object.keys(db.sessions).forEach(function (t) { if (db.sessions[t] === conta.id) delete db.sessions[t]; });
      gravar(KEY_DB, db);
      try {
        var imgsConta = lerImagens();
        idsRemovidos.forEach(function (oid) { delete imgsConta.byOccurrence[String(oid)]; });
        gravar(KEY_IMG, imgsConta);
      } catch (_) { /* ignora */ }
      return semCorpo(204);
    }

    /* ---- ocorrências: lista, minhas, criar ---- */
    if (caminho === '/occurrences' && metodo === 'GET') {
      return resposta(200, db.occurrences.map(function (o) { return paraDto(db, o); }));
    }

    if (caminho === '/occurrences/mine' && metodo === 'GET') {
      var eu = usuarioDoToken(db, init);
      if (!eu) return erro(401, 'Sessão inválida ou expirada.');
      return resposta(200, db.occurrences
        .filter(function (o) { return o.userId === eu.id; })
        .map(function (o) { return paraDto(db, o); }));
    }

    if (caminho === '/occurrences' && metodo === 'POST') {
      var autor = usuarioDoToken(db, init);
      if (!autor) return erro(401, 'Sessão inválida ou expirada.');
      var dc = lerJson(init);
      var msg = validarOcorrencia(db, dc);
      if (msg) return erro(400, msg);

      /* RF10: intervalo mínimo de 60 s entre registros do mesmo usuário */
      db.ultimoRegistro = db.ultimoRegistro || {};
      var agoraReg = Date.now();
      var ultimoReg = db.ultimoRegistro[autor.id] || 0;
      if (ultimoReg && agoraReg - ultimoReg < INTERVALO_REGISTRO_MS) {
        var falta = Math.ceil((INTERVALO_REGISTRO_MS - (agoraReg - ultimoReg)) / 1000);
        return resposta(429, {
          message: 'Você registrou uma ocorrência há pouco tempo. Aguarde ' + falta + (falta === 1 ? ' segundo' : ' segundos') + ' para registrar outra.',
          retryAfterSeconds: falta
        });
      }
      var nova = { id: proximoIdOcorrencia(db), userId: autor.id, status: 'PENDENTE',
                   dataRegistro: agoraIso(), dataResolucao: null, responsavelResolucao: null };
      aplicarCampos(nova, dc);
      db.occurrences.push(nova);
      db.ultimoRegistro[autor.id] = agoraReg;
      gravar(KEY_DB, db);
      return resposta(201, paraDto(db, nova));
    }

    /* ---- rotas com id ---- */
    m = /^\/occurrences\/(\d+)(?:\/(.*))?$/.exec(caminho);
    if (!m) return erro(404, 'Recurso não encontrado.');
    var id = Number(m[1]);
    var sub = m[2] || '';
    var oc = db.occurrences.find(function (o) { return o.id === id; });

    // detalhe / editar / excluir
    if (sub === '') {
      if (!oc) return erro(404, 'Ocorrência não encontrada.');
      if (metodo === 'GET') return resposta(200, paraDto(db, oc));

      var dono = usuarioDoToken(db, init);
      if (!dono) return erro(401, 'Sessão inválida ou expirada.');
      if (oc.userId !== dono.id) return erro(403, 'Você não tem permissão para alterar esta ocorrência.');

      if (metodo === 'PUT') {
        var de = lerJson(init);
        var me = validarOcorrencia(db, de);
        if (me) return erro(400, me);
        aplicarCampos(oc, de);
        gravar(KEY_DB, db);
        return resposta(200, paraDto(db, oc));
      }

      if (metodo === 'DELETE') {
        db.occurrences = db.occurrences.filter(function (o) { return o.id !== id; });
        db.confirmations = db.confirmations.filter(function (c) { return c.occurrenceId !== id; });
        gravar(KEY_DB, db);
        var imgsDel = lerImagens();
        delete imgsDel.byOccurrence[String(id)];
        try { gravar(KEY_IMG, imgsDel); } catch (_) { /* ignora */ }
        return semCorpo(204);
      }
    }

    // status
    if (sub === 'status' && metodo === 'PATCH') {
      if (!oc) return erro(404, 'Ocorrência não encontrada.');
      var dono2 = usuarioDoToken(db, init);
      if (!dono2) return erro(401, 'Sessão inválida ou expirada.');
      if (oc.userId !== dono2.id) return erro(403, 'Você não tem permissão para alterar esta ocorrência.');
      var ds = lerJson(init) || {};
      var st = String(ds.status || '').toUpperCase();
      if (st === 'RESOLVIDO') {
        var dataRes = String(ds.dataResolucao || '').slice(0, 10);
        var resp = String(ds.responsavelResolucao || '').trim();
        if (!dataRes || !resp) return erro(400, 'Informe quem resolveu e a data da resolução.');
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dataRes)) return erro(400, 'Data da resolução inválida.');
        if (dataRes > hojeData()) return erro(400, 'A data da resolução não pode estar no futuro.');
        oc.status = 'RESOLVIDO';
        oc.dataResolucao = dataRes + 'T00:00:00';
        oc.responsavelResolucao = resp;
      } else if (st === 'PENDENTE') {
        oc.status = 'PENDENTE';
        oc.dataResolucao = null;
        oc.responsavelResolucao = null;
      } else {
        return erro(400, 'Status inválido.');
      }
      gravar(KEY_DB, db);
      return resposta(200, paraDto(db, oc));
    }

    // fotos
    var mi = /^images(?:\/(\d+))?$/.exec(sub);
    if (mi) {
      if (!oc) return erro(404, 'Ocorrência não encontrada.');
      var imgs = lerImagens();
      var chave = String(id);
      var lista = imgs.byOccurrence[chave] || [];

      if (metodo === 'GET' && !mi[1]) return resposta(200, lista);

      var dono3 = usuarioDoToken(db, init);
      if (!dono3) return erro(401, 'Sessão inválida ou expirada.');
      if (oc.userId !== dono3.id) return erro(403, 'Você não tem permissão para alterar as fotos desta ocorrência.');

      if (metodo === 'POST' && !mi[1]) {
        var form = init && init.body;
        var arquivos = form && typeof form.getAll === 'function' ? form.getAll('files') : [];
        arquivos = arquivos.filter(function (f) { return f && typeof f === 'object' && 'size' in f; });
        if (!arquivos.length) return erro(400, 'Nenhuma imagem enviada.');
        if (lista.length + arquivos.length > MAX_FOTOS) return erro(400, 'Máximo de ' + MAX_FOTOS + ' fotos por ocorrência.');
        for (var i = 0; i < arquivos.length; i++) {
          if (TIPOS_FOTO.indexOf(arquivos[i].type) === -1) return erro(415, 'Envie imagens JPG, PNG ou WebP.');
          if (arquivos[i].size > MAX_BYTES) return erro(413, 'A imagem deve ter no máximo 5 MB.');
        }
        var novas = [];
        try {
          for (var j = 0; j < arquivos.length; j++) {
            novas.push({ id: imgs.seq++, imageUrl: await reduzirImagem(arquivos[j]) });
          }
        } catch (_) { return erro(400, 'Não foi possível processar a imagem.'); }
        imgs.byOccurrence[chave] = lista.concat(novas);
        try { gravar(KEY_IMG, imgs); }
        catch (_) { return erro(507, 'O armazenamento local do navegador está cheio. Restaure os dados demonstrativos ou use fotos menores.'); }
        return resposta(201, novas);
      }

      if (metodo === 'DELETE' && mi[1]) {
        var fotoId = Number(mi[1]);
        if (!lista.some(function (f) { return f.id === fotoId; })) return erro(404, 'Foto não encontrada.');
        imgs.byOccurrence[chave] = lista.filter(function (f) { return f.id !== fotoId; });
        gravar(KEY_IMG, imgs);
        return semCorpo(204);
      }
    }

    // confirmações
    if (sub === 'confirmations/count' && metodo === 'GET') {
      if (!oc) return erro(404, 'Ocorrência não encontrada.');
      return resposta(200, { totalConfirmations: totalConfirmacoes(db, id) });
    }

    if (sub === 'confirmations') {
      if (!oc) return erro(404, 'Ocorrência não encontrada.');
      var quem = usuarioDoToken(db, init);
      if (!quem) return erro(401, 'Sessão inválida ou expirada.');
      var ja = db.confirmations.some(function (c) { return c.occurrenceId === id && c.userId === quem.id; });

      if (metodo === 'POST') {
        if (ja) return erro(409, 'Você já confirmou esta ocorrência.');
        db.confirmations.push({ occurrenceId: id, userId: quem.id });
        gravar(KEY_DB, db);
        return resposta(201, { totalConfirmations: totalConfirmacoes(db, id) });
      }
      if (metodo === 'DELETE') {
        if (!ja) return erro(404, 'Você ainda não confirmou esta ocorrência.');
        db.confirmations = db.confirmations.filter(function (c) { return !(c.occurrenceId === id && c.userId === quem.id); });
        gravar(KEY_DB, db);
        return semCorpo(204);
      }
    }

    return erro(404, 'Recurso não encontrado.');
  }

  async function tratar(caminho, metodo, init) {
    await esperar(LATENCIA_MS);
    try {
      return await rotear(caminho.split('?')[0], metodo, init);
    } catch (e) {
      console.error('[demo-api] erro em ' + metodo + ' ' + caminho, e);
      var cheio = e && (e.name === 'QuotaExceededError' || e.code === 22);
      return erro(cheio ? 507 : 500, cheio
        ? 'O armazenamento local do navegador está cheio. Restaure os dados demonstrativos.'
        : 'Erro interno da API simulada.');
    }
  }

  /* ------------------------------------------------------------------------
     Intercepta fetch: só chamadas para "demo://" são tratadas aqui.
     ------------------------------------------------------------------------ */
  var fetchNativo = typeof window.fetch === 'function' ? window.fetch.bind(window) : null;

  window.fetch = function (entrada, init) {
    var url = typeof entrada === 'string' ? entrada : (entrada && entrada.url) || '';
    if (url.indexOf(API_PREFIX) === 0) {
      return tratar(url.slice(API_PREFIX.length), String((init && init.method) || 'GET').toUpperCase(), init || {});
    }
    return fetchNativo ? fetchNativo(entrada, init) : Promise.reject(new TypeError('fetch indisponível'));
  };

  /* ------------------------------------------------------------------------
     Reinício dos dados demonstrativos
     ------------------------------------------------------------------------ */
  function reset() {
    [KEY_DB, KEY_IMG, KEY_VER, 'token', 'currentUser'].forEach(function (k) { localStorage.removeItem(k); });
    Object.keys(localStorage)
      .filter(function (k) { return k.indexOf('meuBairro:confirmacao:') === 0; })   // marcas locais do script.js
      .forEach(function (k) { localStorage.removeItem(k); });
    try { sessionStorage.removeItem('meuBairro:returnTo'); } catch (_) { /* ignora */ }
  }

  // Libera todos os logins bloqueados (RF05) sem esperar os 15 minutos. Uso: MeuBairroDemo.liberarLogin()
  function liberarLogin() {
    var db = lerBanco();
    db.tentativasLogin = {};
    gravar(KEY_DB, db);
  }

  // Zera o intervalo de 60 s entre registros (RF10) sem esperar. Uso: MeuBairroDemo.liberarRegistro()
  function liberarRegistro() {
    var db = lerBanco();
    db.ultimoRegistro = {};
    gravar(KEY_DB, db);
  }

  // Cria ocorrências fictícias para mostrar a paginação (mais de 10). Uso: MeuBairroDemo.gerarExemplos(12) e recarregue a página.
  // A maior parte fica na conta de teste (id 1), para "Minhas ocorrências" também ter páginas.
  function gerarExemplos(qtd) {
    qtd = Math.max(1, Math.min(60, Number(qtd) || 12));
    var db = lerBanco();
    var bairros = ['Centro', 'Aleixo', 'Alvorada', 'Cachoeirinha', 'Educandos', 'Tarumã'];
    var titulos = ['Buraco na via', 'Lâmpada queimada', 'Lixo acumulado', 'Bueiro entupido', 'Calçada danificada', 'Água parada'];
    var donos = [1, 1, 1, 2, 1, 1, 1, 3, 1, 1, 1, 4];   // a maior parte fica na conta de teste
    for (var i = 0; i < qtd; i++) {
      var o = { id: proximoIdOcorrencia(db), userId: donos[i % donos.length], status: 'PENDENTE',
                dataRegistro: agoraIso(), dataResolucao: null, responsavelResolucao: null };
      aplicarCampos(o, {
        titulo: titulos[i % titulos.length] + ' (exemplo ' + (i + 1) + ')',
        descricao: 'Ocorrência fictícia criada para demonstrar a paginação.',
        bairro: bairros[i % bairros.length], rua: 'Rua Exemplo ' + (i + 1), cep: '', complemento: '',
        categoryId: (i % 6) + 1
      });
      db.occurrences.push(o);
    }
    gravar(KEY_DB, db);
    return qtd + ' ocorrências de exemplo criadas. Recarregue a página.';
  }

  window.MeuBairroDemo = {
    reset: reset,
    liberarLogin: liberarLogin,
    liberarRegistro: liberarRegistro,
    gerarExemplos: gerarExemplos,
    restaurar: function () {
      var ok = window.confirm('Restaurar os dados demonstrativos?\n\nTudo o que foi cadastrado neste navegador (contas, ocorrências, fotos e confirmações) será apagado e a sessão será encerrada.');
      if (!ok) return;
      reset();
      location.hash = '#/';
      location.reload();
    }
  };

  try { garantirDados(); }
  catch (e) { console.error('[demo-api] não foi possível preparar o armazenamento local:', e); }
})();
