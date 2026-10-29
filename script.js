/* ==========================================================================
   MEU BAIRRO — script.js (VERSÃO DEMONSTRATIVA)
   Mesmo código do site real. A única diferença é que API_BASE aponta para a
   API simulada do demo-api.js (dados em localStorage, sem backend).
   O loader já está no index.html (window.esconderLoader).
   ========================================================================== */

/* ---------- Ícones ---------- */
const ICONS = {
  pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  'check-circle': '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  'user-round': '<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>',
  camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z"/><circle cx="12" cy="13" r="3"/>',
  buraco: '<circle cx="12" cy="12" r="9"/><path d="M12 3v5M7 8l2.5 2.5M17 8l-2.5 2.5M5 12h4"/>',
  lixo: '<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14Z"/><path d="M10 11v6M14 11v6"/>',
  iluminacao: '<path d="M9 18h6M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.4 1 2.3h6c0-.9.4-1.8 1-2.3A7 7 0 0 0 12 2Z"/>',
  alagamento: '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7Z"/>',
  outro: '<path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4M12 17h.01"/>',
  plus: '<path d="M5 12h14M12 5v14"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/>',
  home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><path d="M9 22V12h6v10"/>',
  'arrow-left': '<path d="m12 19-7-7 7-7M19 12H5"/>',
  'arrow-right': '<path d="M5 12h14M12 5l7 7-7 7"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  trash: '<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14Z"/><path d="M10 11v6M14 11v6"/>',
  'rotate-ccw': '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>'
};

function icon(name, size = 18){
  const body = ICONS[name] || ICONS.outro;
  return '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size +
         '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + body + '</svg>';
}

/* ---------- Categorias e constantes ---------- */
const CATEGORIES = {
  'Buraco':     { slug: 'buraco',     icon: 'buraco' },
  'Lixo':       { slug: 'lixo',       icon: 'lixo' },
  'Iluminação': { slug: 'iluminacao', icon: 'iluminacao' },
  'Alagamento': { slug: 'alagamento', icon: 'alagamento' },
  'Outro':      { slug: 'outro',      icon: 'outro' }
};

// Protótipo demonstrativo: as chamadas são tratadas localmente pelo demo-api.js (nenhuma rede).
const API_BASE = 'demo://meu-bairro/api';
const BAIRROS = [
  'Adrianópolis',
  'Aleixo',
  'Alvorada',
  'Armando Mendes',
  'Betânia',
  'Cachoeirinha',
  'Centro',
  'Chapada',
  'Cidade de Deus',
  'Cidade Nova',
  'Colônia Antônio Aleixo',
  'Colônia Oliveira Machado',
  'Compensa',
  'Coroado',
  'Crespo',
  'Da Paz',
  'Distrito Industrial I',
  'Distrito Industrial II',
  'Dom Pedro',
  'Educandos',
  'Flores',
  'Gilberto Mestrinho',
  'Glória',
  'Japiim',
  'Jorge Teixeira',
  'Lago Azul',
  'Lírio do Vale',
  'Mauazinho',
  'Monte das Oliveiras',
  'Nossa Senhora das Graças',
  'Nova Cidade',
  'Nova Esperança',
  'Novo Aleixo',
  'Petrópolis',
  'Planalto',
  'Ponta Negra',
  'Praça 14 de Janeiro',
  'Presidente Vargas',
  'Puraquequara',
  'Raiz',
  'Redenção',
  'Santa Etelvina',
  'Santa Luzia',
  'Santo Agostinho',
  'Santo Antônio',
  'São Francisco',
  'São Geraldo',
  'São Jorge',
  'São José Operário',
  'São Lázaro',
  'São Raimundo',
  'Tancredo Neves',
  'Tarumã',
  'Tarumã-Açu',
  'Vila Buriti',
  'Zumbi dos Palmares',
  'Aparecida',
  'Morro da Liberdade',
  'Vila da Prata',
  'Colônia Santo Antônio'
];
const MAX_FOTOS = 3;
const HOME_RECENTES = 4;

/* ---------- Estado ---------- */
let state = {
  currentUser: null,
  filters: { q: '', bairro: '', categoria: '', status: '' },
  pendingPhotos: [],          // [{ file, src }]
  pendingConfirmId: null
};

let occurrences = [];
let myOccurrences = [];
let confirmationState = {};
let categoriasAPI = [];

/* ===================== BLOCO A — constantes e estado ===================== */
const TTL_NAVEGACAO = 60 * 1000;      // navegar: só atualiza se os dados têm mais de 60 s
const TTL_VOLTAR_ABA = 2 * 60 * 1000; // voltar para a aba: só se passaram mais de 2 min

let ultimaTentativaOcorrencias = 0;   // também evita martelar o servidor se ele estiver fora
let ocorrenciasEmCarga = null;
let minhasEmCarga = null;
let ultimaCargaMinhas = 0;
let ultimaCargaMinhasUser = null;
let repinturaTimer = null;

const fotosCache = new Map();         // id -> [urls]
const fotosEmCarga = new Map();       // id -> Promise (evita pedir a mesma foto 2x)
const fotosSemResultado = new Map();  // id -> quando veio vazio/erro (não insiste por 60 s)
let fotosObserver = null;



let galeriaIdx = 0;
let lb = { fotos: [], i: 0, titulo: '' };


/* ==========================================================================
   API — carregamento de dados (inalterado, exceto fotos múltiplas)
   ========================================================================== */
function formatarData(data) {
  if (!data) return '';
  const valor = String(data).split('T')[0];
  const partes = valor.split('-');
  return partes.length === 3 ? `${partes[2]}/${partes[1]}/${partes[0]}` : valor;
}

function formatarDataHora(data) {
  if (!data) return '';
  const valor = String(data);
  const partes = valor.split('T');
  const dataFormatada = formatarData(partes[0]);
  const hora = partes[1] ? partes[1].slice(0, 5) : '';
  return dataFormatada + (hora ? ' às ' + hora : '');
}

function adaptarOcorrencia(o) {
  const categoria = o.category || o.categoria || {};
  const usuario = o.user || o.usuario || {};
  const statusBackend = String(o.status || '').toUpperCase();
  const fotoUnica = o.foto || o.imagemUrl || null;

  return {
    id: Number(o.id),
    title: o.titulo || '',
    description: o.descricao || '',
    bairro: o.bairro || '',
    rua: o.rua || '',
    cep: o.cep || '',
    complemento: o.complemento || '',
    endereco: o.endereco || '',
    responsavelResolucao: o.responsavel_resolucao || o.responsavelResolucao || '',
    dataResolucao: o.dataResolucao || null,
    categoria: categoria.nome || 'Outro',
    categoryId: categoria.id != null ? Number(categoria.id) : Number(o.categoryId || 0),
    data: formatarData(o.dataRegistro || o.data),
    status: statusBackend === 'RESOLVIDO' ? 'Resolvido' : 'Aberto',
    statusBackend: statusBackend || 'PENDENTE',
    confirmations: Number(o.confirmations ?? o.confirmacoes ?? 0),
    author: usuario.nome || o.author || 'Morador',
    authorId: usuario.id != null ? String(usuario.id) : String(o.userId ?? o.usuarioId ?? ''),
    foto: fotoUnica,
    fotos: fotoUnica ? [fotoUnica] : []
  };
}

function listaDaResposta(dados) {
  if (Array.isArray(dados)) return dados;
  if (Array.isArray(dados?.content)) return dados.content;
  return [];
}

async function jsonOpcional(resposta) {
  const texto = await resposta.text();
  return texto ? JSON.parse(texto) : null;
}

/* ===================== BLOCO B — carga de dados ===================== */
function aplicarFotos(o, urls) {
  if (urls && urls.length) { o.fotos = urls; o.foto = urls[0]; }
  return o;
}

// Busca as fotos de UMA ocorrência uma única vez. Falha => null (tenta de novo depois).
function buscarFotos(id) {
  if (fotosCache.has(id)) return Promise.resolve(fotosCache.get(id));

  const t = fotosSemResultado.get(id);
  if (t && Date.now() - t < 60000) return Promise.resolve([]);

  if (fotosEmCarga.has(id)) return fotosEmCarga.get(id);

  const promessa = (async () => {
    try {
      const resposta = await fetch(`${API_BASE}/occurrences/${id}/images`, { cache: 'no-store' });
      if (!resposta.ok) { fotosSemResultado.set(id, Date.now()); return []; }
      const imagens = await resposta.json();
      const urls = Array.isArray(imagens) ? imagens.map(i => i.imageUrl).filter(Boolean) : [];
      if (urls.length) { fotosCache.set(id, urls); fotosSemResultado.delete(id); }
      else fotosSemResultado.set(id, Date.now());
      return urls;
    } catch (erro) {
      console.error(`Erro ao carregar fotos da ocorrência ${id}:`, erro);
      fotosSemResultado.set(id, Date.now());
      return [];
    } finally {
      fotosEmCarga.delete(id);
    }
  })();

  fotosEmCarga.set(id, promessa);
  return promessa;
}

// Mantém o nome e o formato antigos (usado por "Minhas ocorrências" e pela sessão).
async function carregarFotosOcorrencia(ocorrencia) {
  if (fotosCache.has(ocorrencia.id)) return aplicarFotos(ocorrencia, fotosCache.get(ocorrencia.id));
  const urls = await buscarFotos(ocorrencia.id);
  return aplicarFotos(ocorrencia, urls);
}

// Coloca as fotos na memória e direto no cartão/galeria, sem redesenhar a tela.
function aplicarFotosNaTela(id, urls) {
  [occurrences, myOccurrences].forEach(lista => {
    const alvo = lista.find(x => x.id === id);
    if (alvo) aplicarFotos(alvo, urls);
  });

  const o = getOccurrence(id);
  if (!o) return;

  document.querySelectorAll('.occ[data-id="' + id + '"] .occ-media').forEach(m => {
    m.innerHTML = photoFor(o);
  });

  const rota = parseRoute();
  if (rota[0] === 'ocorrencia' && Number(rota[1]) === id) {
    const caixa = document.getElementById('lightbox');
    if (caixa && caixa.classList.contains('show')) return;
    const atual = document.querySelector('.det-main')?.firstElementChild;
    if (atual && (atual.classList.contains('gallery') || atual.classList.contains('detail-media'))) {
      atual.outerHTML = galleryHtml(o);
    }
  }
}

function carregarFotoDe(id) {
  const o = getOccurrence(id);
  if (!o) return;                       // também evita pedir fotos de ID inexistente

  const emCache = fotosCache.get(id);
  if (emCache) {
    if (fotosDe(o).length !== emCache.length) aplicarFotosNaTela(id, emCache);
    return;
  }
  buscarFotos(id).then(urls => { if (urls && urls.length) aplicarFotosNaTela(id, urls); });
}


// Só busca a foto dos cartões que entram na tela (com 200 px de folga).
function observarCartoes() {
  const cartoes = document.querySelectorAll('.occ[data-id]');
  if (!cartoes.length) return;

  if (!('IntersectionObserver' in window)) {
    cartoes.forEach(c => carregarFotoDe(Number(c.dataset.id)));
    return;
  }

  if (fotosObserver) fotosObserver.disconnect();
  fotosObserver = new IntersectionObserver(entradas => {
    entradas.forEach(e => {
      if (!e.isIntersecting) return;
      fotosObserver.unobserve(e.target);
      carregarFotoDe(Number(e.target.dataset.id));
    });
  }, { rootMargin: '200px' });

  cartoes.forEach(c => fotosObserver.observe(c));
}


// Carga FORÇADA (inicialização e depois de criar/editar/excluir/mudar status).
// Se já existe uma consulta em andamento, espera ela terminar antes de buscar de novo.
async function carregarOcorrencias(render = true) {
  while (ocorrenciasEmCarga) await ocorrenciasEmCarga.catch(() => {});

  ocorrenciasEmCarga = (async () => {
    ultimaTentativaOcorrencias = Date.now();
    try {
      const resposta = await fetch(`${API_BASE}/occurrences`, { cache: 'no-store' });
      if (!resposta.ok) {
        const detalhe = await resposta.text();
        throw new Error(`HTTP ${resposta.status}: ${detalhe}`);
      }

      const dados = await jsonOpcional(resposta);
      occurrences = listaDaResposta(dados)
        .map(adaptarOcorrencia)
        .map(o => aplicarFotos(o, fotosCache.get(o.id)));

      
      if (render) renderView(...parseRoute());
      return true;
    } catch (erro) {
      console.error('Erro ao carregar ocorrências:', erro);
      return false;
    } finally {
      ocorrenciasEmCarga = null;
    }
  })();

  return ocorrenciasEmCarga;
}

// Assinatura simples: só repinta a tela se algo visível mudou.
function assinatura(lista) {
  return JSON.stringify(lista.map(o => [
    o.id, o.title, o.description, o.status, o.bairro, o.rua, o.categoria, fotosDe(o).length
  ]));
}

// Atualiza SÓ se os dados estiverem velhos. Nunca duplica consulta em andamento.
async function atualizarOcorrenciasSeNecessario(limite = TTL_NAVEGACAO) {
  if (document.visibilityState !== 'visible') return false;
  if (ocorrenciasEmCarga) return false;
  if (Date.now() - ultimaTentativaOcorrencias < limite) return false;

  const antes = assinatura(occurrences);
  const chave = parseRoute().join('/');

  const ok = await carregarOcorrencias(false);
  if (!ok) return false;

  if (assinatura(occurrences) !== antes && parseRoute().join('/') === chave) repintarTela(false);
  return true;
}

// "Minhas ocorrências": mesma ideia, por usuário.
function marcarMinhasCarregadas() {
  ultimaCargaMinhas = Date.now();
  ultimaCargaMinhasUser = state.currentUser ? state.currentUser.id : null;
}

async function minhasSeNecessario(limite = TTL_NAVEGACAO) {
  if (!state.currentUser) return false;
  if (minhasEmCarga) return minhasEmCarga;

  const fresco = ultimaCargaMinhasUser === state.currentUser.id &&
                 Date.now() - ultimaCargaMinhas < limite;
  if (fresco) return true;

  minhasEmCarga = carregarMinhasOcorrencias(false).finally(() => { minhasEmCarga = null; });
  return minhasEmCarga;
}


/* ---------- Repintura pontual (não perde o que o usuário está fazendo) ---------- */
function agendarRepintura() {
  clearTimeout(repinturaTimer);
  repinturaTimer = setTimeout(() => repintarTela(true), 250);
}

// parcial = true  -> só chegaram fotos novas (no detalhe troca apenas a galeria)
// parcial = false -> os dados mudaram (redesenha a tela)
function repintarTela(parcial) {
  const rota = parseRoute();
  const pagina = rota[0] || 'home';

  const caixa = document.getElementById('lightbox');
  if (caixa && caixa.classList.contains('show')) return;

  const ativo = document.activeElement;
  const digitando = ativo && /^(INPUT|TEXTAREA|SELECT)$/.test(ativo.tagName);

  if (pagina === 'ocorrencias') {
    renderListGrid();                       // só a grade; filtros e busca continuam como estão
  } else if (pagina === 'home' || pagina === 'minhas') {
    if (!digitando) renderView(...rota);
  } else if (pagina === 'ocorrencia') {
    const o = getOccurrence(rota[1]);
    const principal = document.querySelector('.det-main');
    if (parcial && o && principal && principal.firstElementChild) {
      principal.firstElementChild.outerHTML = galleryHtml(o);
    } else if (!parcial) {
      renderView(...rota);                  // 1 requisição (contagem de confirmações)
    }
  }
}


async function carregarMinhasOcorrencias(render = true) {
  const token = localStorage.getItem('token');

  if (!token || !state.currentUser) {
    if (parseRoute()[0] === 'minhas' || parseRoute()[0] === 'editar') {
      toast('Faça login para ver suas ocorrências.', 'info');
      go('/login');
    }
    return false;
  }

  try {
    const resposta = await fetch(`${API_BASE}/occurrences/mine`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!resposta.ok) {
      const detalhe = await resposta.text();
      console.error('Erro ao carregar minhas ocorrências:', resposta.status, detalhe);
      if (resposta.status === 401) {
        logout();
      } else if (resposta.status === 403) {
        toast('Você não tem permissão para acessar esta lista.', 'info');
      } else {
        toast('Não foi possível carregar suas ocorrências.', 'info');
      }
      return false;
    }

    myOccurrences = await Promise.all(
      listaDaResposta(await jsonOpcional(resposta)).map(adaptarOcorrencia).map(o => aplicarFotos(o, fotosCache.get(o.id)))
    );
    marcarMinhasCarregadas();
    if (render && parseRoute()[0] === 'minhas') renderView('minhas');
    return true;
  } catch (erro) {
    console.error('Erro ao carregar minhas ocorrências:', erro);
    toast('Falha ao conectar com o servidor.', 'info');
    return false;
  }
}



async function restaurarSessao() {
  const token = localStorage.getItem('token');
  const usuarioSalvo = localStorage.getItem('currentUser');

  // Não ter uma sessão salva não deve bloquear a página pública.
  if (!token || !usuarioSalvo) {
    state.currentUser = null;
    myOccurrences = [];
    return true;
  }

  try {
    const usuario = JSON.parse(usuarioSalvo);

    if (!usuario || !(usuario.name || usuario.nome || usuario.email)) {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      state.currentUser = null;
      myOccurrences = [];
      return true;
    }

    state.currentUser = {
      ...usuario,
      id: usuario.id == null ? '' : String(usuario.id),
      name: String(usuario.name || usuario.nome || usuario.email || 'Morador')
    };

    const resposta = await fetch(`${API_BASE}/occurrences/mine`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      cache: 'no-store'
    });

    if (resposta.status === 401) {
      // Token inválido ou expirado: encerra a sessão local.
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');

      state.currentUser = null;
      myOccurrences = [];
      return true;
    }

    if (resposta.status === 403) {
      // Sem permissão para a lista pessoal: mantém o site público funcionando.
      console.warn('A API negou acesso às ocorrências pessoais (403).');
      myOccurrences = [];
      return true;
    }

    if (!resposta.ok) {
      console.warn(
        `Não foi possível carregar as ocorrências pessoais: HTTP ${resposta.status}`
      );
      myOccurrences = [];
      return true;
    }

    const dados = await jsonOpcional(resposta);

    myOccurrences = await Promise.all(
      listaDaResposta(dados)
        .map(adaptarOcorrencia)
        .map(o => aplicarFotos(o, fotosCache.get(o.id)))
    );

    marcarMinhasCarregadas();

    return true;
  } catch (erro) {
    console.error('Falha ao restaurar a sessão:', erro);
    myOccurrences = [];

    // Uma falha de sessão não deve impedir a inicialização pública.
    return true;
  }
}


async function carregarCategorias() {
  try {
    const resposta = await fetch(`${API_BASE}/categories`);
    if (!resposta.ok) throw new Error(`Erro HTTP ${resposta.status}`);

    const dados = await jsonOpcional(resposta);
    categoriasAPI = (Array.isArray(dados) ? dados : dados?.content || [])
      .map(c => ({ id: c.id, nome: c.nome }));
    return categoriasAPI;
  } catch (erro) {
    console.error('Erro ao carregar categorias:', erro);
    return null;
  }
}

function chaveConfirmacaoUsuario(id) {
  const usuarioId = state.currentUser?.id || 'anonimo';
  return 'meuBairro:confirmacao:' + usuarioId + ':' + Number(id);
}

function usuarioJaConfirmou(id) {
  return Boolean(state.currentUser && localStorage.getItem(chaveConfirmacaoUsuario(id)) === 'true');
}

async function carregarConfirmacoes(id) {
  const occurrenceId = Number(id);
  if (!Number.isInteger(occurrenceId) || occurrenceId <= 0) return null;

  try {
    const resposta = await fetch(
      `${API_BASE}/occurrences/${occurrenceId}/confirmations/count`,
      { cache: 'no-store' }
    );
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);

    const dados = await jsonOpcional(resposta);
    confirmationState[occurrenceId] = {
      ...confirmationState[occurrenceId],
      total: Number(dados?.totalConfirmations ?? 0),
      confirmedByMe: usuarioJaConfirmou(occurrenceId)
    };

    const texto = icon('check-circle', 16) + ' ' +
  esc(confirmText(confirmationState[occurrenceId].total));

// Atualiza o contador na tela de detalhes
const elemento = document.getElementById(`confirmation-count-${occurrenceId}`);
if (elemento) {
  elemento.innerHTML = texto;
}

// Atualiza o contador nos cards
document.querySelectorAll(`[data-confirmation-count="${occurrenceId}"]`)
  .forEach(card => {
    card.innerHTML = texto;
  });

    return confirmationState[occurrenceId];
  } catch (erro) {
    console.error('Erro ao carregar confirmações:', erro);
    return null;
  }
}

async function carregarConfirmacoesDosCartoes() {
  const cards = document.querySelectorAll('.occ[data-id]');

  await Promise.all(
    [...cards].map(card => carregarConfirmacoes(card.dataset.id))
  );
}

async function confirmar(id) {
  const occurrenceId = Number(id);
  const token = localStorage.getItem('token');

  if (!state.currentUser || !token) return solicitarLoginParaConfirmar(occurrenceId);

  try {
    const resposta = await fetch(`${API_BASE}/occurrences/${occurrenceId}/confirmations`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });

    if (resposta.status === 401) {
      toast('Sua sessão expirou. Entre novamente.', 'info');
      logout();
      return false;
    }
    if (resposta.status === 403) {
      localStorage.setItem(chaveConfirmacaoUsuario(occurrenceId), 'true');
      confirmationState[occurrenceId] = { ...confirmationState[occurrenceId], confirmedByMe: true };
      toast('Você já confirmou esta ocorrência.', 'info');
      await carregarConfirmacoes(occurrenceId);
      renderView('ocorrencia', occurrenceId, true);
      return false;
    }
    if (resposta.status === 409) {
      toast('Você já confirmou esta ocorrência.', 'info');
      await carregarConfirmacoes(occurrenceId);
      renderView('ocorrencia', occurrenceId, true);
      return false;
    }
    if (!resposta.ok) {
      const detalhe = await resposta.text();
      console.error('Erro ao confirmar ocorrência:', resposta.status, detalhe);
      toast('Não foi possível confirmar a ocorrência.', 'info');
      return false;
    }

    localStorage.setItem(chaveConfirmacaoUsuario(occurrenceId), 'true');
    confirmationState[occurrenceId] = { ...confirmationState[occurrenceId], confirmedByMe: true };
    await carregarConfirmacoes(occurrenceId);
    toast('Ocorrência confirmada com sucesso!');
    renderView('ocorrencia', occurrenceId, true);
    return true;
  } catch (erro) {
    console.error('Falha ao confirmar ocorrência:', erro);
    toast('Não foi possível conectar ao servidor.', 'info');
    return false;
  }
}


/* ==========================================================================
   Helpers
   ========================================================================== */
function esc(s){ return String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function confirmText(n){ return n + ' ' + (n === 1 ? 'confirmação' : 'confirmações'); }
function truncate(s, n = 120){ s = String(s || ''); return s.length > n ? s.slice(0, n).trim() + '…' : s; }
function slug(s){ return String(s).toLowerCase().normalize('NFD').replace(/[^\w]/g, ''); }

function go(path){ location.hash = path; }

function savePostAuthRoute(path){
  const match = String(path || '').match(/^#?\/?ocorrencia\/(\d+)$/);
  if (match) sessionStorage.setItem('meuBairro:returnTo', '/ocorrencia/' + match[1]);
  else sessionStorage.removeItem('meuBairro:returnTo');
}

function takePostAuthRoute(){
  const path = sessionStorage.getItem('meuBairro:returnTo');
  sessionStorage.removeItem('meuBairro:returnTo');
  return path && /^\/ocorrencia\/\d+$/.test(path) ? path : '/';
}

function toast(msg, type = 'success'){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show ' + type;
  clearTimeout(t._t);
  t._t = setTimeout(() => { t.className = 'toast'; }, 2600);
}

function toggleMenu(){
  const header = document.getElementById('header');
  const button = header.querySelector('.menu-btn');
  const isOpen = header.classList.toggle('open');
  if (button) button.setAttribute('aria-expanded', String(isOpen));
}

function closeMenu(){
  document.getElementById('header').classList.remove('open');
}

function toggleUserMenu(e){
  if (e) e.stopPropagation();
  const m = document.querySelector('.user-menu');
  if (!m) return;
  const aberto = m.classList.toggle('open');
  const b = m.querySelector('.user-menu-btn');
  if (b) b.setAttribute('aria-expanded', String(aberto));
}

function getOccurrence(id){
  const numericId = Number(id);
  return occurrences.find(o => o.id === numericId) || myOccurrences.find(o => o.id === numericId);
}

function isMyOccurrence(id){
  return Boolean(state.currentUser && myOccurrences.some(o => Number(o.id) === Number(id)));
}

function requireAuth(){
  if (!state.currentUser || !localStorage.getItem('token')) {
    toast('Faça login para continuar.', 'info');
    go('/login');
    return false;
  }
  return true;
}

// Botão com estado "carregando" (a API no Render pode demorar)
function botaoOcupado(form, ocupado, textoOcupado){
  const b = form && form.querySelector('button[type="submit"]');
  if (!b) return;
  if (ocupado) {
    b.dataset.txt = b.innerHTML;
    b.disabled = true;
    b.textContent = textoOcupado;
  } else {
    b.disabled = false;
    if (b.dataset.txt) b.innerHTML = b.dataset.txt;
  }
}


/* ==========================================================================
   Fotos, galeria e lightbox
   ========================================================================== */
function fotosDe(o){
  if (Array.isArray(o.fotos) && o.fotos.length) return o.fotos;
  return o.foto ? [o.foto] : [];
}

function photoFor(o, size){
  const s = size || 34;
  const fotos = fotosDe(o);
  if (fotos.length) {
    const contador = (!size && fotos.length > 1)
      ? '<span class="photo-count">' + icon('image', 13) + ' ' + fotos.length + '</span>' : '';
    return '<img src="' + esc(fotos[0]) + '" alt="' + esc(o.title) + '" loading="lazy">' + contador;
  }
  const c = CATEGORIES[o.categoria] || CATEGORIES['Outro'];
  return '<div class="photo-ph">' + icon(c.icon, s) + '<span>' + esc(o.categoria) + '</span></div>';
}

function galleryHtml(o){
  const fotos = fotosDe(o);
  if (!fotos.length) return '<div class="detail-media">' + photoFor(o, 72) + '</div>';

  galeriaIdx = 0;
  const thumbs = fotos.length > 1
    ? '<div class="gallery-thumbs">' + fotos.map((f, i) =>
        '<button type="button" class="gallery-thumb' + (i === 0 ? ' active' : '') + '" onclick="selecionarFoto(' + i + ')" aria-label="Ver foto ' + (i + 1) + '">' +
        '<img src="' + esc(f) + '" alt="Foto ' + (i + 1) + ' de ' + esc(o.title) + '"></button>').join('') + '</div>'
    : '';

  return '<div class="gallery" data-id="' + o.id + '">' +
    '<button type="button" class="gallery-main" onclick="abrirLightbox(' + o.id + ')" aria-label="Ampliar foto">' +
      '<img src="' + esc(fotos[0]) + '" alt="' + esc(o.title) + '">' +
      (fotos.length > 1 ? '<span class="gallery-counter">1 / ' + fotos.length + '</span>' : '') +
      '<span class="gallery-zoom">' + icon('search', 14) + ' Ampliar</span>' +
    '</button>' + thumbs + '</div>';
}

function selecionarFoto(i){
  const g = document.querySelector('.gallery');
  if (!g) return;
  const fotos = fotosDe(getOccurrence(g.dataset.id));
  galeriaIdx = i;
  g.querySelector('.gallery-main img').src = fotos[i];
  g.querySelectorAll('.gallery-thumb').forEach((t, k) => t.classList.toggle('active', k === i));
  const c = g.querySelector('.gallery-counter');
  if (c) c.textContent = (i + 1) + ' / ' + fotos.length;
}

function abrirLightbox(id, i){
  const o = getOccurrence(id);
  const fotos = o ? fotosDe(o) : [];
  if (!fotos.length) return;

  lb = { fotos, i: i == null ? galeriaIdx : i, titulo: o.title };
  let el = document.getElementById('lightbox');
  if (!el) {
    el = document.createElement('div');
    el.id = 'lightbox';
    el.className = 'lightbox';
    el.addEventListener('click', e => { if (e.target === el) fecharLightbox(); });
    document.body.appendChild(el);
  }
  desenharLightbox();
  el.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function desenharLightbox(){
  const el = document.getElementById('lightbox');
  const n = lb.fotos.length;
  el.innerHTML =
    '<button type="button" class="lb-close" onclick="fecharLightbox()" aria-label="Fechar">' + icon('x', 22) + '</button>' +
    (n > 1
      ? '<button type="button" class="lb-nav lb-prev" onclick="moverLightbox(-1)" aria-label="Anterior">' + icon('arrow-left', 22) + '</button>' +
        '<button type="button" class="lb-nav lb-next" onclick="moverLightbox(1)" aria-label="Próxima">' + icon('arrow-right', 22) + '</button>'
      : '') +
    '<figure class="lb-fig"><div class="lb-stage"><img src="' + esc(lb.fotos[lb.i]) + '" alt="' + esc(lb.titulo) + '" onclick="zoomLightbox(event)"></div>' +
    '<figcaption>' + esc(lb.titulo) + (n > 1 ? ' · ' + (lb.i + 1) + '/' + n : '') + ' — clique na foto para dar zoom</figcaption></figure>';
}

function moverLightbox(d){
  const n = lb.fotos.length;
  lb.i = (lb.i + d + n) % n;
  desenharLightbox();
}

function zoomLightbox(e){
  const img = e.currentTarget;
  const r = img.getBoundingClientRect();
  img.style.transformOrigin = ((e.clientX - r.left) / r.width * 100) + '% ' + ((e.clientY - r.top) / r.height * 100) + '%';
  img.classList.toggle('zoomed');
}

function fecharLightbox(){
  const el = document.getElementById('lightbox');
  if (el) el.classList.remove('show');
  document.body.style.overflow = '';
}


/* ==========================================================================
   Selos e card
   ========================================================================== */
function catBadge(cat){
  const c = CATEGORIES[cat] || CATEGORIES['Outro'];
  return '<span class="badge cat-' + c.slug + '">' + icon(c.icon, 14) + ' ' + esc(cat) + '</span>';
}

function statusBadge(status){
  return '<span class="badge status-' + slug(status) + '">' +
    (status === 'Resolvido' ? icon('check-circle', 14) + ' ' : '') + esc(status) + '</span>';
}

function occCard(o, acoes){
  const aberto = o.status === 'Aberto';
  return '<article class="occ' + (acoes ? ' occ--actions' : '') + '" data-id="' + o.id + '">' +
    '<div class="occ-media">' + photoFor(o) + '</div>' +
    '<div class="occ-main">' +
      '<h3 class="occ-title"><a href="#/ocorrencia/' + o.id + '">' + esc(o.title) + '</a></h3>' +
      '<p class="occ-desc">' + esc(truncate(o.description, 110)) + '</p>' +
    '</div>' +
    '<div class="occ-foot">' +
      '<span class="occ-loc">' + icon('pin', 16) + '<b>' + esc(o.bairro) + '</b></span>' +
      '<span class="occ-date">' + icon('clock', 15) + esc(o.data) + '</span>' +
      '<span class="badge" data-confirmation-count="' + o.id + '">' +
      icon('check-circle', 15) + ' 0 confirmações</span>' +
      '<span class="occ-status ' + (aberto ? 'is-open' : 'is-done') + '">' + esc(o.status) + '</span>' +
    '</div>' +
    (acoes ? '<div class="occ-actions">' + acoes + '</div>' : '') +
  '</article>';
}

function occurrenceCard(o){ return occCard(o); }



/* ==========================================================================
   Cabeçalho
   ========================================================================== */

function renderHeader(){
  const h = document.getElementById('header');
  const u = state.currentUser;
  const name = parseRoute()[0] || 'home';

  const link = (label, route, key, ico) =>
    '<a href="#' + route + '" class="nav-link ' +
    ((name === key || (key === 'ocorrencias' && name === 'ocorrencia')) ? 'active' : '') + '">' +
    icon(ico, 18) + label + '</a>';

  let navLinks = link('Início', '/', 'home', 'home') +
                 link('Ocorrências', '/ocorrencias', 'ocorrencias', 'search');
  if (u) navLinks += link('Minhas ocorrências', '/minhas', 'minhas', 'user');
  if (u) navLinks += link('Minha conta', '/conta', 'conta', 'user');

  const btnRegistrar = '<button class="btn btn-primary" onclick="go(\'/registrar\')">' + icon('plus', 16) + ' Registrar ocorrência</button>';

  const auth = !u
    ? '<button class="btn btn-ghost" onclick="go(\'/login\')">Entrar</button>' + btnRegistrar
    : '<span class="user-chip"><span class="avatar">' + icon('user-round', 20) + '</span>' +
        '<span class="user-name">Olá, ' + esc(u.name) + '</span></span>' +
      '<div class="user-menu">' +
        '<button type="button" class="user-menu-btn" onclick="toggleUserMenu(event)" aria-label="Abrir menu da conta" aria-haspopup="true" aria-expanded="false">' + icon('menu', 22) + '</button>' +
        '<div class="user-menu-panel">' +
          '<button class="btn btn-primary" onclick="closeUserMenu();go(\'/registrar\')">' + icon('plus', 16) + ' Registrar ocorrência</button>' +
          '<button class="btn btn-ghost" onclick="closeUserMenu();logout()">' + icon('logout', 16) + ' Sair da conta</button>' +
        '</div>' +
      '</div>';

  h.className = '';
  h.innerHTML =
    '<div class="header-inner">' +
      '<a class="logo" href="#/" onclick="closeMenu()"><span class="logo-mark">' + icon('pin', 24) + '</span><span>Meu Bairro</span></a>' +
      '<nav class="nav" onclick="closeMenu()">' + navLinks + '</nav>' +
      '<div class="auth-actions">' + auth + '</div>' +
      '<button class="menu-btn" onclick="toggleMenu()" aria-label="Abrir menu" aria-expanded="false">' + icon('menu', 22) + '</button>' +
    '</div>';
}

function closeUserMenu(){
  const m = document.querySelector('.user-menu');
  if (!m) return;
  m.classList.remove('open');
  const b = m.querySelector('.user-menu-btn');
  if (b) b.setAttribute('aria-expanded', 'false');
}

document.addEventListener('click', e => {
  if (!e.target.closest('.user-menu')) closeUserMenu();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeUserMenu();
});

/* ==========================================================================
   Telas: Home, Lista, Detalhes
   ========================================================================== */
function homeView(){
  const recentes = occurrences.slice().sort((a, b) => b.id - a.id).slice(0, HOME_RECENTES);
  return (
    '<div class="hero">' +
      '<div class="hero-inner container">' +
        '<h1>Problemas do seu bairro, visíveis para a comunidade</h1>' +
        '<p>Registre problemas urbanos e encontre ocorrências próximas ao seu bairro.</p>' +
        '<div class="hero-actions">' +
          '<button class="btn btn-primary btn-lg" onclick="go(\'/ocorrencias\')">' + icon('eye', 18) + ' Ver ocorrências</button>' +
          '<button class="btn btn-ghost btn-lg" onclick="go(\'/registrar\')">' + icon('plus', 18) + ' Registrar ocorrência</button>' +
        '</div>' +
      '</div>' +
    '</div>' +

    '<section class="container home-recent">' +
      '<div class="section-head"><h2>Ocorrências recentes</h2>' +
        '<a class="link-arrow" href="#/ocorrencias">Ver todas ' + icon('arrow-right', 16) + '</a></div>' +
      '<div class="grid">' + recentes.map(occurrenceCard).join('') + '</div>' +
    '</section>' +

    '<section class="container home-steps">' +
      '<div class="section-head"><h2>Como funciona</h2></div>' +
      '<div class="steps">' +
        '<div class="step"><div class="ico">' + icon('plus', 24) + '</div><h3>1. Registre</h3><p>Crie uma ocorrência informando o bairro, a rua e o problema encontrado.</p></div>' +
        '<div class="step"><div class="ico">' + icon('check', 24) + '</div><h3>2. Confirme</h3><p>Se você viu o mesmo problema, confirme para dar mais visibilidade.</p></div>' +
        '<div class="step"><div class="ico">' + icon('check-circle', 24) + '</div><h3>3. Acompanhe</h3><p>Acompanhe o status e marque como resolvido quando o problema for atendido.</p></div>' +
      '</div>' +
    '</section>'
  );
}

/* ---------- Paginação das listas (RF06): 10 ocorrências por página ---------- */
const OCORRENCIAS_POR_PAGINA = 10;   // só aparecem páginas quando há mais de 10 ocorrências
let paginaLista = 1;                 // página atual de "Ocorrências"
let paginaMinhas = 1;                // página atual de "Minhas ocorrências"
let assinaturaFiltrosLista = '';

function listaPaginasVisiveis(atual, total){
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const nums = [...new Set([1, total, atual - 1, atual, atual + 1])]
    .filter(n => n >= 1 && n <= total).sort((a, b) => a - b);
  const saida = [];
  nums.forEach((n, i) => { if (i && n - nums[i - 1] > 1) saida.push('…'); saida.push(n); });
  return saida;
}

// acao = nome da função chamada ao clicar (recebe o número da página)
function paginacaoHtml(atual, total, acao){
  if (total <= 1) return '';
  const numeros = listaPaginasVisiveis(atual, total).map(p => p === '…'
    ? '<span class="page-ellipsis" aria-hidden="true">…</span>'
    : '<button type="button" class="page-btn' + (p === atual ? ' active' : '') + '" onclick="' + acao + '(' + p + ')" aria-label="Página ' + p + '"' +
      (p === atual ? ' aria-current="page"' : '') + '>' + p + '</button>').join('');
  return (
    '<button type="button" class="page-btn page-nav" onclick="' + acao + '(' + (atual - 1) + ')"' + (atual === 1 ? ' disabled' : '') + '>' + icon('arrow-left', 14) + ' Anterior</button>' +
    '<div class="page-numbers">' + numeros + '</div>' +
    '<button type="button" class="page-btn page-nav" onclick="' + acao + '(' + (atual + 1) + ')"' + (atual === total ? ' disabled' : '') + '>Próxima ' + icon('arrow-right', 14) + '</button>' +
    '<p class="page-info">Página ' + atual + ' de ' + total + '</p>'
  );
}

function irParaPagina(n){
  paginaLista = Math.max(1, Number(n) || 1);
  renderListGrid();
  window.scrollTo(0, 0);
}

function irParaPaginaMinhas(n){
  paginaMinhas = Math.max(1, Number(n) || 1);
  renderView('minhas');
  window.scrollTo(0, 0);
}

function listView(){
  const f = state.filters;
  const bairroOpts = BAIRROS.map(b => '<option value="' + esc(b) + '"' + (f.bairro === b ? ' selected' : '') + '>' + esc(b) + '</option>').join('');
  const catOpts = categoriasAPI.map(c => '<option value="' + esc(c.nome) + '"' + (f.categoria === c.nome ? ' selected' : '') + '>' + esc(c.nome) + '</option>').join('');
  const statusOpts = ['', 'Aberto', 'Resolvido'].map(s =>
    '<option value="' + s + '"' + (f.status === s ? ' selected' : '') + '>' + (s === '' ? 'Todos os status' : s) + '</option>').join('');

  return (
    '<section style="padding-top:32px">' +
      '<div class="section-head"><h1>Ocorrências</h1></div>' +
      '<div class="filters">' +
        '<input class="search" id="f-q" type="text" placeholder="Pesquisar ocorrência…" value="' + esc(f.q) + '" oninput="applyFilters()">' +
        '<select id="f-bairro" onchange="applyFilters()"><option value="">Todos os bairros</option>' + bairroOpts + '</select>' +
        '<select id="f-categoria" onchange="applyFilters()"><option value="">Todas as categorias</option>' + catOpts + '</select>' +
        '<select id="f-status" onchange="applyFilters()">' + statusOpts + '</select>' +
        '<button class="btn btn-ghost" onclick="clearFilters()">Limpar</button>' +
      '</div>' +
      '<div class="result-count" id="result-count"></div>' +
      '<div class="grid" id="list-grid"></div>' +
      '<nav class="pagination" id="list-pagination" aria-label="Paginação das ocorrências"></nav>' +
    '</section>'
  );
}

function applyFilters(){
  state.filters.q = document.getElementById('f-q').value.trim().toLowerCase();
  state.filters.bairro = document.getElementById('f-bairro').value;
  state.filters.categoria = document.getElementById('f-categoria').value;
  state.filters.status = document.getElementById('f-status').value;
  renderListGrid();
}

function clearFilters(){
  state.filters = { q: '', bairro: '', categoria: '', status: '' };
  ['f-q', 'f-bairro', 'f-categoria', 'f-status'].forEach(id => { document.getElementById(id).value = ''; });
  renderListGrid();
}

function renderListGrid(){
  const f = state.filters;
  let list = occurrences.slice().sort((a, b) => b.id - a.id);

  if (f.q) {
    list = list.filter(o =>
      o.title.toLowerCase().includes(f.q) ||
      o.description.toLowerCase().includes(f.q) ||
      o.rua.toLowerCase().includes(f.q) ||
      o.bairro.toLowerCase().includes(f.q));
  }
  if (f.bairro) list = list.filter(o => o.bairro === f.bairro);
  if (f.categoria) list = list.filter(o => o.categoria === f.categoria);
  if (f.status) list = list.filter(o => o.status === f.status);

  document.getElementById('result-count').textContent =
    list.length + (list.length === 1 ? ' ocorrência encontrada' : ' ocorrências encontradas');

  // Paginação: volta para a página 1 quando a pesquisa ou os filtros mudam
  const assinaturaFiltros = JSON.stringify(f);
  if (assinaturaFiltros !== assinaturaFiltrosLista) { assinaturaFiltrosLista = assinaturaFiltros; paginaLista = 1; }
  const totalPaginas = Math.max(1, Math.ceil(list.length / OCORRENCIAS_POR_PAGINA));
  if (paginaLista > totalPaginas) paginaLista = totalPaginas;
  const inicioPagina = (paginaLista - 1) * OCORRENCIAS_POR_PAGINA;
  const paginaAtual = list.slice(inicioPagina, inicioPagina + OCORRENCIAS_POR_PAGINA);

  document.getElementById('list-grid').innerHTML = list.length === 0
    ? '<div class="empty" style="grid-column:1/-1">' + icon('search', 40) +
      '<h3>Nenhuma ocorrência encontrada</h3><p>Tente ajustar os filtros de busca.</p></div>'
        : paginaAtual.map(occurrenceCard).join('');
  const navPaginas = document.getElementById('list-pagination');
  if (navPaginas) navPaginas.innerHTML = paginacaoHtml(paginaLista, totalPaginas, 'irParaPagina');
  observarCartoes();
  carregarConfirmacoesDosCartoes();
}

function detailView(id){
  const o = getOccurrence(id);
  if (!o) {
    return '<section style="padding-top:40px"><div class="empty">' + icon('outro', 40) +
      '<h3>Ocorrência não encontrada</h3><p>Esta ocorrência não existe ou foi removida.</p>' +
      '<button class="btn btn-primary" onclick="go(\'/ocorrencias\')">Ver ocorrências</button></div></section>';
  }

  const isAuthor = isMyOccurrence(o.id);
  const autenticado = Boolean(state.currentUser && localStorage.getItem('token'));
  const total = confirmationState[o.id]?.total ?? o.confirmations ?? 0;
  const jaConfirmou = confirmationState[o.id]?.confirmedByMe ?? usuarioJaConfirmou(o.id);

  const confirmBox =
    '<div class="det-card det-ask">' +
      '<h3>Você também viu isso?</h3>' +
      '<p class="muted">Confirmar ajuda a dar visibilidade ao problema.</p>' +
      '<p class="det-count" id="confirmation-count-' + o.id + '">' + icon('check-circle', 16) + ' ' + esc(confirmText(total)) + '</p>' +
      (autenticado
        ? (jaConfirmou
          ? '<button class="btn btn-ghost btn-block" onclick="desconfirmar(' + o.id + ')">' + icon('rotate-ccw', 16) + ' Remover confirmação</button>'
          : '<button class="btn btn-outline btn-block" onclick="confirmar(' + o.id + ')">' + icon('check-circle', 16) + ' Confirmar ocorrência</button>')
        : '<button class="btn btn-outline btn-block" onclick="solicitarLoginParaConfirmar(' + o.id + ')">Entrar para confirmar</button>') +
    '</div>';

  let ownerArea = '';
  if (isAuthor) {
    const statusBtn = o.status === 'Aberto'
      ? '<button class="btn btn-outline btn-block" onclick="resolver(' + o.id + ', true)">' + icon('check-circle', 16) + ' Marcar como resolvida</button>'
      : '<button class="btn btn-outline btn-block" onclick="reabrir(' + o.id + ', true)">' + icon('rotate-ccw', 16) + ' Reabrir ocorrência</button>';
    ownerArea =
      '<div class="det-card det-owner">' +
        '<h3>Sua ocorrência</h3>' +
        '<div class="det-actions">' +
          statusBtn +
          '<button class="btn btn-outline btn-block" onclick="go(\'/editar/' + o.id + '\')">' + icon('edit', 16) + ' Editar</button>' +
          '<button class="btn btn-danger-outline btn-block" onclick="pedirExclusao(' + o.id + ')">' + icon('trash', 16) + ' Excluir</button>' +
        '</div>' +
      '</div>';
  }

  return (
    '<div class="detail-wrap" style="padding-top:24px">' +
      '<a class="back-link" href="#/ocorrencias">' + icon('arrow-left', 16) + ' Voltar para ocorrências</a>' +

      '<div class="det-head">' +
        '<div class="detail-badges">' + catBadge(o.categoria) + statusBadge(o.status) + '</div>' +
        '<h1 class="det-title">' + esc(o.title) + '</h1>' +
        '<p class="det-addr">' + icon('pin', 16) + ' ' + esc(o.rua) + ', ' + esc(o.bairro) + '</p>' +
      '</div>' +

      '<div class="det-layout">' +
        '<div class="det-main">' +
          galleryHtml(o) +
          '<h2 class="det-sub">Descrição</h2>' +
          '<p class="detail-desc">' + esc(o.description) + '</p>' +
        '</div>' +
        '<aside class="det-side">' +
          '<div class="det-card">' +
            '<h3>Informações</h3>' +
            '<dl class="det-list">' +
              '<div><dt>Bairro</dt><dd>' + esc(o.bairro) + '</dd></div>' +
              '<div><dt>Rua</dt><dd>' + esc(o.rua) + '</dd></div>' +
              (o.cep ? '<div><dt>CEP</dt><dd>' + esc(o.cep) + '</dd></div>' : '') +
              (o.complemento ? '<div><dt>Complemento</dt><dd>' + esc(o.complemento) + '</dd></div>' : '') +
              '<div><dt>Registrada em</dt><dd>' + esc(o.data) + '</dd></div>' +
              '<div><dt>Situação</dt><dd>' + esc(o.status) + '</dd></div>' +
              (o.statusBackend === 'RESOLVIDO' ? '<div><dt>Resolvida em</dt><dd>' + esc(formatarData(o.dataResolucao)) + '</dd></div><div><dt>Responsável pela resolução</dt><dd>' + esc(o.responsavelResolucao || 'Não informado') + '</dd></div>' : '') +
            '</dl>' +
          '</div>' +
          confirmBox +
          ownerArea +
        '</aside>' +
      '</div>' +
    '</div>'
  );
}


/* ==========================================================================
   Ações: login p/ confirmar, status, exclusão
   ========================================================================== */
function solicitarLoginParaConfirmar(id){
  const occurrenceId = Number(id);
  if (!Number.isInteger(occurrenceId) || occurrenceId <= 0) return false;
  state.pendingConfirmId = occurrenceId;
  savePostAuthRoute('/ocorrencia/' + occurrenceId);
  toast('Entre na sua conta para confirmar esta ocorrência.', 'info');
  go('/login');
  return false;
}

async function desconfirmar(id){
  const occurrenceId = Number(id);
  const token = localStorage.getItem('token');
  if (!Number.isInteger(occurrenceId) || occurrenceId <= 0) return false;
  if (!requireAuth() || !token) return false;

  try {
    const resposta = await fetch(`${API_BASE}/occurrences/${occurrenceId}/confirmations`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });

    if (resposta.status === 401) {
      toast('Sua sessão expirou. Entre novamente.', 'info');
      logout();
      return false;
    }
    if (!resposta.ok) {
      const detalhe = await resposta.text();
      console.error('Erro ao remover confirmação:', resposta.status, detalhe);
      toast(resposta.status === 404
        ? 'Você ainda não confirmou esta ocorrência.'
        : 'Não foi possível remover sua confirmação.', 'info');
      return false;
    }

    localStorage.removeItem(chaveConfirmacaoUsuario(occurrenceId));
    confirmationState[occurrenceId] = { ...confirmationState[occurrenceId], confirmedByMe: false };
    await carregarConfirmacoes(occurrenceId);
    toast('Sua confirmação foi removida.');
    renderView('ocorrencia', occurrenceId, true);
    return true;
  } catch (erro) {
    console.error('Falha ao remover confirmação:', erro);
    toast('Não foi possível conectar ao servidor.', 'info');
    return false;
  }
}


function abrirModalResolucao() {
  return new Promise(resolve => {
    const anterior = document.getElementById('modal-resolucao-personalizado');
    if (anterior) anterior.remove();

    const overlay = document.createElement('div');
    overlay.id = 'modal-resolucao-personalizado';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:10000;background:rgba(10,20,16,.68);display:flex;align-items:center;justify-content:center;padding:18px;';
    overlay.innerHTML = `
      <section role="dialog" aria-modal="true" aria-labelledby="resolucao-titulo" style="width:min(100%,520px);max-height:90vh;overflow:auto;background:var(--white,#fff);color:var(--ink,#1d2b24);border-radius:16px;padding:26px;box-shadow:0 18px 60px rgba(0,0,0,.28)">
        <h2 id="resolucao-titulo" style="margin:0 0 8px;font-size:1.45rem">Registrar resolução</h2>
        <p style="margin:0 0 20px;color:var(--muted,#4f5f56)">Selecione quem resolveu o problema e informe a data da resolução.</p>
        <form id="form-resolucao">
          <div class="field">
            <label for="resolucao-responsavel">Quem resolveu? *</label>
            <select id="resolucao-responsavel" required>
              <option value="" selected disabled>Selecione o responsável</option>
              <option value="Prefeitura de Manaus">Prefeitura de Manaus</option>
              <option value="Governo do Estado do Amazonas">Governo do Estado do Amazonas</option>
              <option value="Governo Federal">Governo Federal</option>
              <option value="Concessionária de serviço público">Concessionária de serviço público</option>
              <option value="Empresa prestadora de serviço">Empresa prestadora de serviço</option>
              <option value="Moradores da comunidade">Moradores da comunidade</option>
            </select>
          </div>
          <div class="field">
            <label for="resolucao-data">Data da resolução *</label>
            <input id="resolucao-data" type="date" required>
            <p class="hint">Informe a data em que o problema foi resolvido.</p>
          </div>
          <div style="display:flex;justify-content:flex-end;gap:10px;flex-wrap:wrap;margin-top:22px">
            <button type="button" class="btn btn-ghost" id="resolucao-cancelar">Cancelar</button>
            <button type="submit" class="btn btn-primary">Confirmar resolução</button>
          </div>
        </form>
      </section>`;
    document.body.appendChild(overlay);

    const select = overlay.querySelector('#resolucao-responsavel');
    const dataInput = overlay.querySelector('#resolucao-data');
    const agora = new Date();
    const pad = n => String(n).padStart(2, '0');
    const hoje = `${agora.getFullYear()}-${pad(agora.getMonth()+1)}-${pad(agora.getDate())}`;
    dataInput.max = hoje;

    let finalizado = false;
    const fechar = valor => {
      if (finalizado) return;
      finalizado = true;
      overlay.remove();
      resolve(valor);
    };
    overlay.querySelector('#resolucao-cancelar').addEventListener('click', () => fechar(null));
    overlay.addEventListener('click', e => { if (e.target === overlay) fechar(null); });
    overlay.querySelector('#form-resolucao').addEventListener('submit', e => {
      e.preventDefault();
      if (!select.value) { select.reportValidity(); return; }
      if (!dataInput.value) { dataInput.reportValidity(); return; }
      if (dataInput.value > dataInput.max) {
        toast('A data da resolução não pode estar no futuro.', 'info');
        dataInput.focus();
        return;
      }
      // A API recebe LocalDateTime, mas a interface pede e exibe somente a data.
      fechar({ dataResolucao: dataInput.value + 'T00:00:00', responsavelResolucao: select.value });
    });
    select.focus();
  });
}

async function atualizarStatus(id, status, fromDetail){
  const token = localStorage.getItem('token');
  if (!requireAuth() || !token) return;
  if (!isMyOccurrence(id)) {
    toast('Você só pode alterar suas próprias ocorrências.', 'info');
    return;
  }

  let dataResolucao = null;
  let responsavelResolucao = null;
  if (status === 'RESOLVIDO') {
    const dadosResolucao = await abrirModalResolucao();
    if (!dadosResolucao) {
      toast('A resolução foi cancelada.', 'info');
      return;
    }
    dataResolucao = dadosResolucao.dataResolucao;
    responsavelResolucao = dadosResolucao.responsavelResolucao;
  }

  try {
    const resposta = await fetch(`${API_BASE}/occurrences/${Number(id)}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(status === 'RESOLVIDO' ? { status, dataResolucao, responsavelResolucao } : { status })
    });

    if (!resposta.ok) {
      const detalhe = await resposta.text();
      console.error('Erro ao alterar status:', resposta.status, detalhe);
      if (resposta.status === 401) logout();
      else toast(resposta.status === 403
        ? 'Você não tem permissão para alterar esta ocorrência.'
        : 'Não foi possível alterar o status.', 'info');
      return;
    }

    const texto = await resposta.text();
    if (texto) {
      try {
        const atualizada = adaptarOcorrencia(JSON.parse(texto));
        occurrences = occurrences.map(o => o.id === atualizada.id ? atualizada : o);
        myOccurrences = myOccurrences.map(o => o.id === atualizada.id ? atualizada : o);
      } catch (erro) {
        console.warn('Resposta de status não pôde ser interpretada; recarregando listas.', erro);
      }
    }

    await Promise.all([carregarOcorrencias(false), carregarMinhasOcorrencias(false)]);
    toast(status === 'RESOLVIDO' ? 'Ocorrência marcada como resolvida.' : 'Ocorrência reaberta.');
    if (fromDetail) renderView('ocorrencia', id);
    else renderView('minhas');
  } catch (erro) {
    console.error('Falha ao alterar status:', erro);
    toast('Falha ao conectar com o servidor.', 'info');
  }
}

function resolver(id, fromDetail){
  const o = getOccurrence(id);
  if (!o || o.statusBackend === 'RESOLVIDO') return;
  return atualizarStatus(id, 'RESOLVIDO', fromDetail);
}

function reabrir(id, fromDetail){
  const o = getOccurrence(id);
  if (!o || o.statusBackend === 'PENDENTE') return;
  return atualizarStatus(id, 'PENDENTE', fromDetail);
}

function pedirExclusao(id){
  const o = getOccurrence(id);
  if (!o || !isMyOccurrence(id)) {
    toast('Você só pode excluir suas próprias ocorrências.', 'info');
    return;
  }
  document.getElementById('modal-text').textContent =
    'A ocorrência "' + o.title + '" será removida permanentemente. Esta ação não pode ser desfeita.';
  document.getElementById('modal').classList.add('show');
  document.getElementById('modal')._id = id;
}

function closeConfirm(){
  document.getElementById('modal').classList.remove('show');
}

async function modalYes(){
  const id = Number(document.getElementById('modal')._id);
  const token = localStorage.getItem('token');

  if (!token || !state.currentUser) {
    toast('Faça login para excluir uma ocorrência.', 'info');
    closeConfirm();
    go('/login');
    return;
  }
  if (!isMyOccurrence(id)) {
    toast('Você só pode excluir suas próprias ocorrências.', 'info');
    closeConfirm();
    return;
  }

  try {
    const resposta = await fetch(`${API_BASE}/occurrences/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!resposta.ok) {
      const erro = await resposta.text();
      console.error('Erro ao excluir ocorrência:', resposta.status, erro);
      if (resposta.status === 401) {
        closeConfirm();
        logout();
      } else if (resposta.status === 403) {
        toast('Você não tem permissão para excluir esta ocorrência.', 'info');
      } else {
        toast('Não foi possível excluir a ocorrência.', 'info');
      }
      return;
    }

    occurrences = occurrences.filter(o => Number(o.id) !== id);
    myOccurrences = myOccurrences.filter(o => Number(o.id) !== id);
    fotosCache.delete(id);
    closeConfirm();
    toast('Ocorrência excluída.');
    await carregarOcorrencias(false);
    if (state.currentUser && localStorage.getItem('token')) await carregarMinhasOcorrencias(false);

    const rota = parseRoute();
    if (rota[0] === 'ocorrencia' && Number(rota[1]) === id) go('/minhas');
    else renderView(...rota);
  } catch (erro) {
    console.error('Erro ao excluir ocorrência:', erro);
    toast('Falha ao conectar com o servidor.', 'info');
  }
}


/* ==========================================================================
   Login e Cadastro (tela do protótipo, mensagens e API do site real)
   ========================================================================== */
function loginView(){
  return (
    '<section style="padding-top:44px"><div class="form-card">' +
      '<h1>Entrar no Meu Bairro</h1>' +
      '<p class="sub">Acesse sua conta para registrar e confirmar ocorrências.</p>' +
      '<form id="login-form" onsubmit="return login(event)">' +
        '<div class="field"><label>Email</label><input type="email" id="login-email" placeholder="voce@email.com" oninput="atualizarBloqueioLogin()" required></div>' +
        '<div class="field"><label>Senha</label><input type="password" id="login-senha" placeholder="Sua senha" required></div>' +
        '<div class="login-lock" id="login-bloqueio" role="alert" hidden></div>' +
        '<button type="submit" class="btn btn-primary btn-block btn-lg">Entrar</button>' +
      '</form>' +
      '<p class="form-link">Ainda não tem conta? <a href="#/cadastro">Criar conta</a></p>' +
    '</div></section>'
  );
}

async function autenticar(email, senha){
  const resposta = await fetch(`${API_BASE}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha })
  });
  const dados = await jsonOpcional(resposta) || {};

  if (!resposta.ok) {
    const mensagem = dados.message || dados.mensagem || dados.error || 'E-mail ou senha inválidos.';
    const falha = new Error(mensagem);
    if (resposta.status === 429) falha.espera = Number(dados.retryAfterSeconds) || 0;   // RF05
    throw falha;
  }

  const token = dados.token || dados.accessToken;
  if (!token) {
    console.error('Resposta da API de login sem token JWT:', dados);
    throw new Error('O login não retornou um token JWT.');
  }

  const usuario = dados.user || dados.usuario || dados;
  state.currentUser = {
    id: String(usuario.id ?? ''),
    name: String(usuario.nome || usuario.name || usuario.email || email.split('@')[0]),
    email: usuario.email || email
  };
  localStorage.setItem('token', token);
  localStorage.setItem('currentUser', JSON.stringify(state.currentUser));

  await carregarMinhasOcorrencias(false);
  if (!state.currentUser || !localStorage.getItem('token')) {
    throw new Error('A API rejeitou a sessão. Entre novamente.');
  }
  return true;
}

async function login(e) {
  e.preventDefault();
  const form = e.target;
  const email = document.getElementById('login-email').value.trim();
  const senha = document.getElementById('login-senha').value;

  botaoOcupado(form, true, 'Entrando…');
  try {
    await autenticar(email, senha);
    toast('Login realizado com sucesso!');
    go(takePostAuthRoute());
  } catch (erro) {
    console.error('Erro ao realizar login:', erro);
    toast(erro.message || 'Não foi possível conectar ao servidor.', 'info');
    botaoOcupado(form, false);
    if (erro.espera > 0) mostrarBloqueioLogin(erro.espera, email);
  }
  return false;
}

/* ---------- Bloqueio temporário de login (RF05) ---------- */
let bloqueioLogin = null;          // { email, ate }  (ate = momento em que o bloqueio termina)
let timerBloqueioLogin = null;

function formatarEspera(segundos){
  const m = Math.floor(segundos / 60), s = segundos % 60;
  return m + ' min ' + String(s).padStart(2, '0') + ' s';
}

function mostrarBloqueioLogin(segundos, email){
  bloqueioLogin = { email: String(email || '').trim().toLowerCase(), ate: Date.now() + segundos * 1000 };
  atualizarBloqueioLogin();
  clearInterval(timerBloqueioLogin);
  timerBloqueioLogin = setInterval(atualizarBloqueioLogin, 1000);
}

// Atualiza o aviso com a contagem regressiva e habilita/desabilita o botão "Entrar"
function atualizarBloqueioLogin(){
  const aviso = document.getElementById('login-bloqueio');
  const campo = document.getElementById('login-email');
  const botao = document.querySelector('#login-form button[type="submit"]');
  if (!aviso || !campo || !botao) { clearInterval(timerBloqueioLogin); return; }   // saiu da tela de login
  if (!bloqueioLogin) { aviso.hidden = true; return; }

  const restante = Math.ceil((bloqueioLogin.ate - Date.now()) / 1000);
  if (restante <= 0) {
    clearInterval(timerBloqueioLogin);
    bloqueioLogin = null;
    botao.disabled = false;
    aviso.hidden = false;
    aviso.textContent = 'O tempo de espera terminou. Você já pode tentar entrar novamente.';
    return;
  }

  // O bloqueio vale para o e-mail informado; se a pessoa trocar o e-mail, o botão volta a funcionar
  if (campo.value.trim().toLowerCase() === bloqueioLogin.email) {
    aviso.hidden = false;
    aviso.textContent = 'Login temporariamente bloqueado após 5 tentativas inválidas seguidas. Tente novamente em ' + formatarEspera(restante) + '.';
    botao.disabled = true;
  } else {
    aviso.hidden = true;
    botao.disabled = false;
  }
}

function cadastroView(){
  return (
    '<section style="padding-top:44px"><div class="form-card">' +
      '<h1>Criar sua conta</h1>' +
      '<p class="sub">Preencha seus dados para participar da comunidade.</p>' +
      '<form onsubmit="return cadastro(event)">' +
        '<div class="field"><label for="cad-nome">Nome</label><input type="text" id="cad-nome" name="nome" placeholder="Seu nome completo" autocomplete="name" maxlength="100" required aria-describedby="cad-nome-ajuda">' +
          '<p class="password-help" id="cad-nome-ajuda">Use apenas letras (com acentos), números e espaços. Não são permitidos caracteres especiais.</p></div>' +
        '<div class="field"><label for="cad-email">E-mail</label><input type="email" id="cad-email" name="email" placeholder="voce@email.com" autocomplete="email" required></div>' +
        '<div class="field"><label for="cad-senha">Senha</label>' +
          '<div class="password-control"><input type="password" id="cad-senha" name="senha" placeholder="Crie uma senha" autocomplete="new-password" minlength="8" required aria-describedby="cad-senha-ajuda" oninput="atualizarForcaSenha()">' +
          '<button type="button" class="password-toggle" onclick="alternarVisibilidadeSenha(\'cad-senha\', this)" aria-label="Mostrar senha">Mostrar</button></div>' +
          '<div class="password-strength" id="cad-forca" data-nivel="" aria-live="polite">' +
            '<div class="strength-bar"><span id="cad-forca-barra"></span></div>' +
            '<p class="strength-label" id="cad-forca-texto">Força da senha: digite uma senha</p>' +
          '</div>' +
          '<ul class="password-rules" id="cad-regras" aria-label="Requisitos da senha">' +
            '<li data-regra="tamanho">Mínimo de 8 caracteres</li>' +
            '<li data-regra="maiuscula">Uma letra maiúscula</li>' +
            '<li data-regra="minuscula">Uma letra minúscula</li>' +
            '<li data-regra="numero">Um número</li>' +
            '<li data-regra="especial">Um caractere especial (ex.: ! @ # $ %)</li>' +
          '</ul>' +
        '</div>' +
        '<div class="field"><label for="cad-senha2">Confirmar senha</label>' +
          '<div class="password-control"><input type="password" id="cad-senha2" name="confirmarSenha" placeholder="Digite a senha novamente" autocomplete="new-password" minlength="8" required aria-describedby="cad-senha2-ajuda" oninput="atualizarConfirmacaoSenha()">' +
          '<button type="button" class="password-toggle" onclick="alternarVisibilidadeSenha(\'cad-senha2\', this)" aria-label="Mostrar confirmação de senha">Mostrar</button></div>' +
          '<p class="password-help" id="cad-senha2-ajuda" aria-live="polite"></p>' +
        '</div>' +
        '<button type="submit" class="btn btn-primary btn-block btn-lg">Criar conta</button>' +
      '</form>' +
      '<p class="form-link">Já tem conta? <a href="#/login">Entrar</a></p>' +
    '</div></section>'
  );
}

function alternarVisibilidadeSenha(id, botao){
  const campo = document.getElementById(id);
  if (!campo) return;
  const mostrar = campo.type === 'password';
  campo.type = mostrar ? 'text' : 'password';
  botao.textContent = mostrar ? 'Ocultar' : 'Mostrar';
  botao.setAttribute('aria-label', mostrar ? 'Ocultar senha' : 'Mostrar senha');
}

(function () {
  const app = document.getElementById('app');
  if (!app) return;

  function melhorar() {
    app.querySelectorAll('input[type="password"]').forEach(inp => {
      if (inp.dataset.toggleReady) return;
      if (inp.closest('.password-control')) return;
      if (inp.parentElement && inp.parentElement.querySelector('.password-toggle')) return;
      inp.dataset.toggleReady = '1';

      const wrap = document.createElement('div');
      wrap.className = 'password-control';
      inp.parentNode.insertBefore(wrap, inp);
      wrap.appendChild(inp);

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'password-toggle';
      btn.textContent = 'Mostrar';
      btn.setAttribute('aria-label', 'Mostrar senha');
      btn.setAttribute('aria-pressed', 'false');
      btn.addEventListener('click', () => {
        const visivel = inp.type === 'password';
        inp.type = visivel ? 'text' : 'password';
        btn.textContent = visivel ? 'Ocultar' : 'Mostrar';
        btn.setAttribute('aria-label', visivel ? 'Ocultar senha' : 'Mostrar senha');
        btn.setAttribute('aria-pressed', String(visivel));
      });
      wrap.appendChild(btn);
    });
  }

  new MutationObserver(melhorar).observe(app, { childList: true, subtree: true });
  melhorar();
})();

/* ---------- Cadastro: regras do relatório (RF01 a RF03) ---------- */
const NOME_RE = /^[\p{L}\p{M}\p{N} ]+$/u;                 // letras (com acentos), números e espaços
const EMAIL_CADASTRO_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function avaliarSenha(senha){
  return {
    tamanho:   senha.length >= 8,
    maiuscula: /\p{Lu}/u.test(senha),
    minuscula: /\p{Ll}/u.test(senha),
    numero:    /[0-9]/.test(senha),
    especial:  /[^\p{L}\p{M}\p{N}\s]/u.test(senha)
  };
}

// Barra e lista de requisitos atualizadas enquanto a pessoa digita
function atualizarForcaSenha(){
  const campo = document.getElementById('cad-senha');
  const caixa = document.getElementById('cad-forca');
  if (!campo || !caixa) return;

  const senha = campo.value;
  const regras = avaliarSenha(senha);
  const atendidas = Object.keys(regras).filter(k => regras[k]).length;

  document.querySelectorAll('#cad-regras li').forEach(li => {
    li.classList.toggle('ok', Boolean(regras[li.dataset.regra]));
  });

  let nivel = '', texto = 'Força da senha: digite uma senha', largura = 0;
  if (senha) {
    largura = Math.round((atendidas / 5) * 100);
    if (atendidas <= 2)      { nivel = 'fraca'; texto = 'Força da senha: fraca'; }
    else if (atendidas <= 4) { nivel = 'media'; texto = 'Força da senha: média'; }
    else                     { nivel = 'forte'; texto = 'Força da senha: forte'; }
  }
  caixa.dataset.nivel = nivel;
  document.getElementById('cad-forca-barra').style.width = largura + '%';
  document.getElementById('cad-forca-texto').textContent = texto;

  atualizarConfirmacaoSenha();
}

function atualizarConfirmacaoSenha(){
  const a = document.getElementById('cad-senha');
  const b = document.getElementById('cad-senha2');
  const msg = document.getElementById('cad-senha2-ajuda');
  if (!a || !b || !msg) return;
  if (!b.value) { msg.textContent = ''; msg.className = 'password-help'; return; }
  const iguais = a.value === b.value;
  msg.textContent = iguais ? 'As senhas coincidem.' : 'As senhas ainda não coincidem.';
  msg.className = 'password-help ' + (iguais ? 'ok' : 'erro');
}

async function cadastro(e) {
  e.preventDefault();
  const form = e.target;

  const nome = document.getElementById('cad-nome').value.trim();
  const email = document.getElementById('cad-email').value.trim();
  const senha = document.getElementById('cad-senha').value;
  const senha2 = document.getElementById('cad-senha2').value;

  if (!nome || !NOME_RE.test(nome)) {
    toast('O nome deve conter apenas letras, números e espaços, sem caracteres especiais.', 'info');
    document.getElementById('cad-nome').focus();
    return false;
  }

  if (!EMAIL_CADASTRO_RE.test(email)) {
    toast('Informe um e-mail válido.', 'info');
    document.getElementById('cad-email').focus();
    return false;
  }

  const regrasSenha = avaliarSenha(senha);
  if (!regrasSenha.tamanho || !regrasSenha.maiuscula || !regrasSenha.minuscula || !regrasSenha.numero || !regrasSenha.especial) {
    toast('A senha deve ter no mínimo 8 caracteres, com letra maiúscula, letra minúscula, número e caractere especial.', 'info');
    document.getElementById('cad-senha').focus();
    return false;
  }

  if (/\s/.test(senha)) {
    toast('A senha não pode conter espaços.', 'info');
    document.getElementById('cad-senha').focus();
    return false;
  }

  if (senha !== senha2) {
    toast('As senhas não coincidem.', 'info');
    document.getElementById('cad-senha2').focus();
    return false;
  }

  let contaCriada = false;
  botaoOcupado(form, true, 'Criando conta…');
  try {
    const resposta = await fetch(`${API_BASE}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, senha })
    });

    if (!resposta.ok) {
      const texto = await resposta.text();
      let mensagem = texto;
      try {
        const erroApi = texto ? JSON.parse(texto) : null;
        mensagem = erroApi?.message || erroApi?.mensagem || erroApi?.error || texto;
      } catch (_) {}
      console.error('Erro no cadastro:', resposta.status, texto);
      toast(mensagem || 'Não foi possível criar a conta. Verifique os dados informados.', 'info');
      botaoOcupado(form, false);
      return false;
    }

    contaCriada = true;
    await autenticar(email, senha);
    toast('Conta criada e login realizado com sucesso!');
    go(takePostAuthRoute());
  } catch (erro) {
    console.error('Erro no cadastro ou login automático:', erro);
    if (contaCriada) {
      toast('Conta criada, mas o login automático falhou. Entre com seus dados.', 'info');
      go('/login');
    } else {
      toast(erro.message || 'Não foi possível conectar ao servidor.', 'info');
      botaoOcupado(form, false);
    }
  }
  return false;
}

function logout(){
  state.currentUser = null;
  myOccurrences = [];
  localStorage.removeItem('token');
  localStorage.removeItem('currentUser');
  closeMenu();
  toast('Você saiu da sua conta.', 'info');
  if (parseRoute()[0] === 'home') renderView('home');
  else go('/');
}


/* ==========================================================================
   Registrar e Editar
   ========================================================================== */
function fotosFormHtml(){
  const f = state.pendingPhotos;
  const itens = f.map((p, i) =>
    '<div class="photo-preview"><img src="' + p.src + '" alt="Prévia ' + (i + 1) + '">' +
    '<button type="button" class="remove" onclick="removePhoto(' + i + ')" aria-label="Remover foto">' + icon('x', 16) + '</button>' +
    '<span class="photo-num">' + (i + 1) + '</span></div>').join('');

  const add = f.length < MAX_FOTOS
    ? '<label class="upload-zone">' + icon('camera', 28) + '<br>Adicionar fotos (opcional)<br>' +
      '<small>Até ' + MAX_FOTOS + ' imagens · JPG, PNG ou WebP · máx. 5 MB cada</small>' +
      '<input type="file" accept="image/jpeg,image/png,image/webp" multiple style="display:none" onchange="previewPhoto(this)"></label>'
    : '';

  return (f.length ? '<div class="photo-grid">' + itens + '</div>' : '') + add +
    '<p class="hint">' + f.length + ' de ' + MAX_FOTOS + ' fotos</p>';
}

function atualizarFotos(){
  const box = document.getElementById('fotos-campo');
  if (box) box.innerHTML = fotosFormHtml();
}

let fotosEdicao = [];
let fotosRemovidasEdicao = [];

async function carregarFotosEdicao(id) {
  fotosEdicao = [];
  fotosRemovidasEdicao = [];
  state.pendingPhotos = [];

  const campo = document.getElementById('fotos-edicao-campo');
  if (!campo) return;

  try {
    const resposta = await fetch(
      `${API_BASE}/occurrences/${id}/images`
    );

    if (!resposta.ok) {
      throw new Error('Não foi possível carregar as fotos.');
    }

    fotosEdicao = await resposta.json();
    renderizarFotosEdicao();
  } catch (erro) {
    console.error(erro);
    campo.innerHTML =
      '<p class="hint">Não foi possível carregar as fotos existentes.</p>';
  }
}

function renderizarFotosEdicao() {
  const campo = document.getElementById('fotos-edicao-campo');
  if (!campo) return;

  const total = fotosEdicao.length + state.pendingPhotos.length;

  const existentes = fotosEdicao.map((foto, i) =>
    '<div class="photo-preview">' +
      '<img src="' + esc(foto.imageUrl) + '" alt="Foto existente">' +
      '<button type="button" class="remove" ' +
        'onclick="removerFotoExistenteEdicao(' + i + ')" ' +
        'aria-label="Remover foto">' + icon('x', 16) + '</button>' +
    '</div>'
  ).join('');

  const novas = state.pendingPhotos.map((foto, i) =>
    '<div class="photo-preview">' +
      '<img src="' + foto.src + '" alt="Nova foto">' +
      '<button type="button" class="remove" ' +
        'onclick="removerNovaFotoEdicao(' + i + ')" ' +
        'aria-label="Remover foto">' + icon('x', 16) + '</button>' +
    '</div>'
  ).join('');

  const adicionar = total < MAX_FOTOS
    ? '<label class="upload-zone">' +
        icon('camera', 28) +
        '<br>Adicionar fotos (opcional)<br>' +
        '<small>JPG, PNG ou WebP · máx. 5 MB cada</small>' +
        '<input type="file" accept="image/jpeg,image/png,image/webp" ' +
          'multiple style="display:none" onchange="previewFotoEdicao(this)">' +
      '</label>'
    : '';

  campo.innerHTML =
    (existentes + novas
      ? '<div class="photo-grid">' + existentes + novas + '</div>'
      : '') +
    adicionar +
    '<p class="hint">' + total + ' de ' + MAX_FOTOS + ' fotos</p>';
}

function removerFotoExistenteEdicao(indice) {
  const foto = fotosEdicao[indice];
  if (!foto) return;

  fotosRemovidasEdicao.push(foto.id);
  fotosEdicao.splice(indice, 1);
  renderizarFotosEdicao();
}

function removerNovaFotoEdicao(indice) {
  state.pendingPhotos.splice(indice, 1);
  renderizarFotosEdicao();
}

async function previewFotoEdicao(input) {
  const arquivos = Array.from(input.files || []);
  input.value = '';

  const vagas = MAX_FOTOS - fotosEdicao.length - state.pendingPhotos.length;

  if (arquivos.length > vagas) {
    toast('Máximo de ' + MAX_FOTOS + ' fotos por ocorrência.', 'info');
  }

  for (const file of arquivos.slice(0, vagas)) {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast('Selecione uma imagem JPG, PNG ou WebP.', 'info');
      continue;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast('A imagem deve ter no máximo 5 MB.', 'info');
      continue;
    }

    try {
      state.pendingPhotos.push({
        file,
        src: await lerComoDataUrl(file)
      });
    } catch (_) {
      toast('Não foi possível carregar a imagem.', 'info');
    }
  }

  renderizarFotosEdicao();
}

function lerComoDataUrl(file){
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = ev => resolve(ev.target.result);
    r.onerror = () => reject(new Error('leitura falhou'));
    r.readAsDataURL(file);
  });
}

async function previewPhoto(input){
  const arquivos = Array.from(input.files || []);
  input.value = '';
  const vagas = MAX_FOTOS - state.pendingPhotos.length;
  if (arquivos.length > vagas) toast('Máximo de ' + MAX_FOTOS + ' fotos por ocorrência.', 'info');

  for (const file of arquivos.slice(0, vagas)) {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast('Selecione uma imagem JPG, PNG ou WebP.', 'info');
      continue;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast('A imagem deve ter no máximo 5 MB.', 'info');
      continue;
    }
    try { state.pendingPhotos.push({ file, src: await lerComoDataUrl(file) }); }
    catch (_) { toast('Não foi possível carregar a imagem.', 'info'); }
  }
  atualizarFotos(); // não apaga o texto já digitado
}

function removePhoto(i){
  state.pendingPhotos.splice(i, 1);
  atualizarFotos();
}

function registrarView(){
  const bairroOpts = BAIRROS.map(b => '<option value="' + esc(b) + '">' + esc(b) + '</option>').join('');
  const catOpts = categoriasAPI.map(c => '<option value="' + esc(c.id) + '">' + esc(c.nome) + '</option>').join('');
  return (
    '<section style="padding-top:32px"><div class="form-card wide">' +
      '<h1>Registrar ocorrência</h1>' +
      '<p class="sub">Descreva o problema encontrado no seu bairro.</p>' +
      '<form id="registro-form" onsubmit="return publicar(event)">' +
        '<div class="field"><label>Título</label><input type="text" id="oc-titulo" placeholder="Ex.: Buraco na Rua das Flores" required></div>' +
        '<div class="field"><label>Descrição</label><textarea id="oc-descricao" placeholder="Descreva o problema com detalhes…" required></textarea></div>' +
        '<div class="form-row">' +
          '<div class="field"><label>Bairro</label><select id="oc-bairro" required><option value="" disabled selected>Selecione o bairro</option>' + bairroOpts + '</select></div>' +
          '<div class="field"><label>Rua</label><input type="text" id="oc-rua" placeholder="Ex.: Rua das Flores" required></div>' +
        '</div>' +
        '<div class="form-row">' +
          '<div class="field"><label>CEP</label><input type="text" id="oc-cep" inputmode="numeric" maxlength="9" placeholder="00000-000"></div>' +
          '<div class="field"><label>Complemento</label><input type="text" id="oc-complemento" placeholder="Ex.: próximo à praça"></div>' +
        '</div>' +
        '<div class="field"><label>Categoria</label><select id="oc-categoria" required>' +
          '<option value="" disabled selected>Selecione a categoria</option>' + catOpts + '</select></div>' +
        '<div class="field"><label>Fotos (até ' + MAX_FOTOS + ')</label><div id="fotos-campo">' + fotosFormHtml() + '</div></div>' +
        '<div class="login-lock" id="registro-espera" role="alert" hidden></div>' +
        '<button type="submit" class="btn btn-primary btn-block btn-lg">' + icon('plus', 18) + ' Publicar ocorrência</button>' +
      '</form>' +
    '</div></section>'
  );
}

async function publicar(e) {
  e.preventDefault();
  if (!requireAuth()) return false;
  const form = e.target;

  const titulo = document.getElementById('oc-titulo').value.trim();
  const descricao = document.getElementById('oc-descricao').value.trim();
  const bairro = document.getElementById('oc-bairro').value.trim();
  const rua = document.getElementById('oc-rua').value.trim();
  const cep = document.getElementById('oc-cep').value.trim();
  const complemento = document.getElementById('oc-complemento').value.trim();
  const categoryId = Number(document.getElementById('oc-categoria').value);

  if (!titulo || !descricao || !bairro || !rua || !categoryId) {
    toast('Preencha todos os campos obrigatórios.', 'info');
    return false;
  }

  const token = localStorage.getItem('token');
  botaoOcupado(form, true, 'Publicando…');

  try {
    // 1. Criar a ocorrência
    const resposta = await fetch(`${API_BASE}/occurrences`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ titulo, descricao, bairro, rua, cep, complemento, endereco: `${rua}, ${bairro}`, categoryId })
    });

    if (!resposta.ok) {
      const erro = await resposta.text();
      console.error('Erro ao publicar:', resposta.status, erro);
      if (resposta.status === 429) {                       // RF10: intervalo mínimo entre registros
        let espera = 0, mensagem = '';
        try { const d = JSON.parse(erro); espera = Number(d.retryAfterSeconds) || 0; mensagem = d.message || ''; } catch (_) {}
        toast(mensagem || 'Aguarde um instante para registrar outra ocorrência.', 'info');
        botaoOcupado(form, false);
        if (espera > 0) mostrarEsperaRegistro(espera);
        return false;
      }
      toast('Não foi possível publicar a ocorrência.', 'info');
      botaoOcupado(form, false);
      return false;
    }

    const criada = await resposta.json();
    if (!criada?.id) {
      console.error('A API não retornou o ID da ocorrência:', criada);
      toast('Ocorrência criada, mas não foi possível identificar seu ID.', 'info');
      botaoOcupado(form, false);
      return false;
    }

    // 2. Enviar as fotos, se houver
    let fotoFalhou = false;
    if (state.pendingPhotos.length) {
      const formData = new FormData();
      state.pendingPhotos.forEach(p => formData.append('files', p.file));

      const respostaFoto = await fetch(`${API_BASE}/occurrences/${criada.id}/images`, {
        method: 'POST',
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: formData
      });

      if (!respostaFoto.ok) {
        const erroFoto = await respostaFoto.text();
        console.error('Ocorrência criada, mas houve erro no upload da foto:', respostaFoto.status, erroFoto);
        fotoFalhou = true;
      }
    }

    // 3. Limpar e atualizar
    state.pendingPhotos = [];
    await carregarOcorrencias(false);
    if (state.currentUser && localStorage.getItem('token')) await carregarMinhasOcorrencias(false);

    if (fotoFalhou) toast('Ocorrência criada, mas a foto não foi enviada. Consulte o console.', 'info');
    else toast('Ocorrência registrada com sucesso!');

    go('/ocorrencia/' + criada.id);
  } catch (erro) {
    console.error('Erro ao publicar ocorrência ou enviar foto:', erro);
    toast('Não foi possível concluir a publicação. Confira o console.', 'info');
    botaoOcupado(form, false);
  }
  return false;
}

/* ---------- Intervalo mínimo entre registros de ocorrência (RF10) ---------- */
let esperaRegistroAte = 0;
let timerEsperaRegistro = null;

function mostrarEsperaRegistro(segundos){
  esperaRegistroAte = Date.now() + segundos * 1000;
  atualizarEsperaRegistro();
  clearInterval(timerEsperaRegistro);
  timerEsperaRegistro = setInterval(atualizarEsperaRegistro, 1000);
}

// Aviso com contagem regressiva; o botão "Publicar" fica desabilitado até o fim da espera
function atualizarEsperaRegistro(){
  const aviso = document.getElementById('registro-espera');
  const botao = document.querySelector('#registro-form button[type="submit"]');
  if (!aviso || !botao) { clearInterval(timerEsperaRegistro); return; }   // saiu da tela de registro
  const restante = Math.ceil((esperaRegistroAte - Date.now()) / 1000);
  aviso.hidden = false;
  if (restante <= 0) {
    clearInterval(timerEsperaRegistro);
    botao.disabled = false;
    aviso.textContent = 'Você já pode registrar uma nova ocorrência.';
    return;
  }
  botao.disabled = true;
  aviso.textContent = 'Você registrou uma ocorrência há pouco tempo. Aguarde ' + restante + (restante === 1 ? ' segundo' : ' segundos') + ' para registrar outra.';
}

function editarView(id){
  const o = myOccurrences.find(item => Number(item.id) === Number(id));
  if (!o) {
    return '<section style="padding-top:40px"><div class="empty">' + icon('outro', 40) +
      '<h3>Ocorrência não encontrada</h3><p>Você só pode editar ocorrências da sua conta.</p>' +
      '<button class="btn btn-primary" onclick="go(\'/minhas\')">Voltar para minhas ocorrências</button></div></section>';
  }

  const categoryOptions = categoriasAPI.map(c =>
    '<option value="' + Number(c.id) + '"' + (Number(c.id) === Number(o.categoryId) ? ' selected' : '') + '>' + esc(c.nome) + '</option>'
  ).join('');
  const bairroOpts = BAIRROS.map(b => '<option value="' + esc(b) + '">' + esc(b) + '</option>').join('');

  return '<section style="padding-top:32px"><div class="form-card wide">' +
    '<h1>Editar ocorrência</h1>' +
    '<p class="sub">Atualize os dados da ocorrência registrada por você.</p>' +
    '<form onsubmit="return salvarEdicao(event, ' + Number(o.id) + ')">' +
      '<div class="field"><label>Título</label><input type="text" id="edit-titulo" value="' + esc(o.title) + '" required></div>' +
      '<div class="field"><label>Descrição</label><textarea id="edit-descricao" required>' + esc(o.description) + '</textarea></div>' +
      '<div class="form-row">' +
        '<div class="field"><label>Bairro</label><select id="edit-bairro" required><option value="" disabled' + (o.bairro ? '' : ' selected') + '>Selecione o bairro</option>' + BAIRROS.map(b => '<option value="' + esc(b) + '"' + (b === o.bairro ? ' selected' : '') + '>' + esc(b) + '</option>').join('') + '</select></div>' +
        '<div class="field"><label>Rua</label><input type="text" id="edit-rua" value="' + esc(o.rua) + '" required></div>' +
      '</div>' +
      '<div class="form-row">' +
        '<div class="field"><label>CEP</label><input type="text" id="edit-cep" inputmode="numeric" maxlength="9" value="' + esc(o.cep) + '" placeholder="00000-000"></div>' +
        '<div class="field"><label>Complemento</label><input type="text" id="edit-complemento" value="' + esc(o.complemento) + '" placeholder="Ex.: próximo à praça"></div>' +
      '</div>' +
      '<div class="field"><label>Categoria</label><select id="edit-categoria" required><option value="" disabled' + (o.categoryId ? '' : ' selected') + '>Selecione a categoria</option>' + categoryOptions + '</select></div>' +
      '<div class="field"><label>Fotos (até ' + MAX_FOTOS + ')</label>' +
      '<div id="fotos-edicao-campo"><p class="hint">Carregando fotos...</p></div></div>' +
      '<button type="submit" class="btn btn-primary btn-block btn-lg">Salvar alterações</button>' +
      '<button type="button" class="btn btn-ghost btn-block" onclick="go(\'/minhas\')">Cancelar</button>' +
    '</form>' +
  '</div></section>';
}


async function salvarEdicao(e, id) {
  e.preventDefault();

  if (!requireAuth()) return false;

  if (!isMyOccurrence(id)) {
    toast('Você só pode editar suas próprias ocorrências.', 'info');
    go('/minhas');
    return false;
  }

  const titulo = document.getElementById('edit-titulo').value.trim();
  const descricao = document.getElementById('edit-descricao').value.trim();
  const bairro = document.getElementById('edit-bairro').value.trim();
  const rua = document.getElementById('edit-rua').value.trim();
  const cep = document.getElementById('edit-cep').value.trim();
  const complemento = document.getElementById('edit-complemento').value.trim();
  const categoryId = Number(document.getElementById('edit-categoria').value);

  if (!titulo || !descricao || !bairro || !rua ||
      !Number.isInteger(categoryId) || categoryId <= 0) {
    toast('Preencha todos os campos obrigatórios.', 'info');
    return false;
  }

  const token = localStorage.getItem('token');
  const form = e.target;
  botaoOcupado(form, true, 'Salvando...');

  try {
    // 1. Atualizar os dados da ocorrência
    const resposta = await fetch(`${API_BASE}/occurrences/${Number(id)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        titulo,
        descricao,
        bairro,
        rua,
        cep,
        complemento,
        endereco: `${rua}, ${bairro}`,
        categoryId
      })
    });

    if (!resposta.ok) {
      const detalhe = await resposta.text();
      console.error('Erro ao editar ocorrência:', resposta.status, detalhe);

      if (resposta.status === 401) {
        logout();
      } else if (resposta.status === 403) {
        toast('Você não tem permissão para editar esta ocorrência.', 'info');
      } else {
        toast('Não foi possível salvar as alterações.', 'info');
      }

      botaoOcupado(form, false);
      return false;
    }

    // 2. Remover as fotos existentes selecionadas para exclusão
    for (const fotoId of fotosRemovidasEdicao) {
      const respostaFoto = await fetch(
        `${API_BASE}/occurrences/${Number(id)}/images/${fotoId}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (!respostaFoto.ok) {
        throw new Error('Não foi possível remover uma foto existente.');
      }
    }

    // 3. Enviar as novas fotos
    if (state.pendingPhotos.length > 0) {
      const formData = new FormData();

      state.pendingPhotos.forEach(foto => {
        formData.append('files', foto.file);
      });

      const respostaFoto = await fetch(
        `${API_BASE}/occurrences/${Number(id)}/images`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData
        }
      );

      if (!respostaFoto.ok) {
        throw new Error('Não foi possível enviar as novas fotos.');
      }
    }

    // 4. Limpar os dados temporários e atualizar as telas
    // (correção: invalida o cache de fotos desta ocorrência, senão fotos removidas/adicionadas só apareciam após recarregar)
    fotosCache.delete(Number(id));
    fotosSemResultado.delete(Number(id));
    state.pendingPhotos = [];
    fotosEdicao = [];
    fotosRemovidasEdicao = [];

    await Promise.all([
      carregarOcorrencias(false),
      carregarMinhasOcorrencias(false)
    ]);

    toast('Ocorrência atualizada com sucesso.');
    go('/ocorrencia/' + Number(id));

  } catch (erro) {
    console.error('Falha ao editar ocorrência ou atualizar fotos:', erro);
    toast(erro.message || 'Falha ao conectar com o servidor.', 'info');
    botaoOcupado(form, false);
  }

  return false;
}


/* ==========================================================================
   Minhas ocorrências e 404
   ========================================================================== */
function minhasView(){
  const mine = myOccurrences.slice().sort((a, b) => b.id - a.id);

  if (mine.length === 0) {
    return '<section style="padding-top:40px"><div class="section-head"><h1>Minhas ocorrências</h1></div>' +
      '<div class="empty">' + icon('pin', 40) +
      '<h3>Você ainda não registrou ocorrências</h3><p>Registre o primeiro problema do seu bairro.</p>' +
      '<button class="btn btn-primary" onclick="go(\'/registrar\')">' + icon('plus', 16) + ' Registrar ocorrência</button></div></section>';
  }

  const totalPaginasMinhas = Math.max(1, Math.ceil(mine.length / OCORRENCIAS_POR_PAGINA));
  if (paginaMinhas > totalPaginasMinhas) paginaMinhas = totalPaginasMinhas;
  const minhasDaPagina = mine.slice((paginaMinhas - 1) * OCORRENCIAS_POR_PAGINA, paginaMinhas * OCORRENCIAS_POR_PAGINA);

  const cards = minhasDaPagina.map(o => {
    const statusBtn = o.status === 'Aberto'
      ? '<button class="btn btn-outline btn-sm" onclick="resolver(' + o.id + ', false)">' + icon('check-circle', 14) + ' Resolvido</button>'
      : '<button class="btn btn-ghost btn-sm" onclick="reabrir(' + o.id + ', false)">' + icon('rotate-ccw', 14) + ' Reabrir</button>';
    const acoes = statusBtn +
      '<button class="btn btn-outline btn-sm" onclick="go(\'/editar/' + o.id + '\')">' + icon('edit', 14) + ' Editar</button>' +
      '<button class="btn btn-danger-outline btn-sm" onclick="pedirExclusao(' + o.id + ')">' + icon('trash', 14) + ' Excluir</button>';
    return occCard(o, acoes);
  }).join('');

  return (
    '<section style="padding-top:32px">' +
      '<div class="section-head"><h1>Minhas ocorrências</h1></div>' +
      '<p class="result-count">' + mine.length +
        (mine.length === 1 ? ' ocorrência registrada por você' : ' ocorrências registradas por você') + '</p>' +
      '<div class="grid">' + cards + '</div>' +
      '<nav class="pagination" aria-label="Paginação das minhas ocorrências">' + paginacaoHtml(paginaMinhas, totalPaginasMinhas, 'irParaPaginaMinhas') + '</nav>' +
    '</section>'
  );
}

/* ==========================================================================
   Minha conta e exclusão definitiva da conta (RF15 e RF16)
   ========================================================================== */
function contaView(){
  const u = state.currentUser || {};
  const qtd = myOccurrences.length;
  const aviso = qtd > 0
    ? ' Você tem <b>' + qtd + (qtd === 1 ? ' ocorrência registrada' : ' ocorrências registradas') + '</b> que ' + (qtd === 1 ? 'será excluída' : 'serão excluídas') + '.'
    : '';

  return (
    '<section style="padding-top:44px"><div class="form-card wide">' +
      '<h1>Minha conta</h1>' +
      '<p class="sub">Dados da sua conta no Meu Bairro.</p>' +
      '<dl class="account-info">' +
        '<div><dt>Nome</dt><dd>' + esc(u.name) + '</dd></div>' +
        '<div><dt>E-mail</dt><dd>' + esc(u.email) + '</dd></div>' +
      '</dl>' +
      '<div class="danger-zone">' +
        '<h2>Excluir conta definitivamente</h2>' +
        '<p>Ao excluir sua conta, serão removidos permanentemente seus dados pessoais, todas as ocorrências criadas por você (com as fotos), as confirmações relacionadas a elas e as confirmações que você fez em outras ocorrências.' + aviso + ' Esta ação não pode ser desfeita.</p>' +
        '<button type="button" class="btn btn-danger-outline" id="conta-excluir-abrir" onclick="abrirExclusaoConta()">' + icon('trash', 16) + ' Excluir minha conta</button>' +
        '<form id="conta-excluir-form" onsubmit="return excluirConta(event)" hidden>' +
          '<div class="field"><label for="conta-confirmacao">Para confirmar, digite <b>EXCLUIR</b></label>' +
            '<input type="text" id="conta-confirmacao" autocomplete="off" autocapitalize="characters" spellcheck="false" oninput="validarConfirmacaoExclusao()"></div>' +
          '<div class="danger-actions">' +
            '<button type="button" class="btn btn-ghost" onclick="cancelarExclusaoConta()">Cancelar</button>' +
            '<button type="submit" class="btn btn-danger" id="conta-excluir-confirmar" disabled>Excluir definitivamente</button>' +
          '</div>' +
        '</form>' +
      '</div>' +
    '</div></section>'
  );
}

function abrirExclusaoConta(){
  document.getElementById('conta-excluir-abrir').hidden = true;
  document.getElementById('conta-excluir-form').hidden = false;
  document.getElementById('conta-confirmacao').focus();
}

function cancelarExclusaoConta(){
  const campo = document.getElementById('conta-confirmacao');
  if (campo) campo.value = '';
  validarConfirmacaoExclusao();
  document.getElementById('conta-excluir-form').hidden = true;
  document.getElementById('conta-excluir-abrir').hidden = false;
}

function validarConfirmacaoExclusao(){
  const campo = document.getElementById('conta-confirmacao');
  const botao = document.getElementById('conta-excluir-confirmar');
  if (!campo || !botao) return;
  botao.disabled = campo.value.trim().toUpperCase() !== 'EXCLUIR';
}

async function excluirConta(e){
  e.preventDefault();
  const form = e.target;
  const token = localStorage.getItem('token');

  if (!token || !state.currentUser) {
    toast('Faça login para continuar.', 'info');
    go('/login');
    return false;
  }

  const campo = document.getElementById('conta-confirmacao');
  if (!campo || campo.value.trim().toUpperCase() !== 'EXCLUIR') {
    toast('Digite EXCLUIR para confirmar a exclusão da conta.', 'info');
    return false;
  }

  const usuarioId = String(state.currentUser.id);
  const idsMinhas = myOccurrences.map(o => Number(o.id));

  botaoOcupado(form, true, 'Excluindo…');
  try {
    const resposta = await fetch(`${API_BASE}/users/me`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!resposta.ok) {
      const detalhe = await resposta.text();
      console.error('Erro ao excluir conta:', resposta.status, detalhe);
      if (resposta.status === 401) {
        logout();
      } else {
        toast('Não foi possível excluir a conta. Tente novamente.', 'info');
        botaoOcupado(form, false);
      }
      return false;
    }

    // Limpa o que ficou guardado no navegador sobre esta conta
    Object.keys(localStorage)
      .filter(k => k.indexOf('meuBairro:confirmacao:' + usuarioId + ':') === 0)
      .forEach(k => localStorage.removeItem(k));
    idsMinhas.forEach(id => { fotosCache.delete(id); fotosSemResultado.delete(id); });
    confirmationState = {};

    // Encerra a sessão (RF13)
    state.currentUser = null;
    myOccurrences = [];
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    closeMenu();

    await carregarOcorrencias(false);

    const aviso = 'Sua conta foi excluída com sucesso. Seus dados, ocorrências, fotos e confirmações foram removidos.';
    toast(aviso, 'success');
    const t = document.getElementById('toast');
    clearTimeout(t._t);
    t._t = setTimeout(() => { t.className = 'toast'; }, 6000);

    if (parseRoute()[0] === 'home') renderView('home');
    else go('/');
  } catch (erro) {
    console.error('Erro ao excluir conta:', erro);
    toast('Falha ao concluir a exclusão da conta.', 'info');
    botaoOcupado(form, false);
  }
  return false;
}


function notFoundView(){
  return '<section style="padding-top:40px"><div class="empty">' + icon('outro', 40) +
    '<h3>Página não encontrada</h3><p>O endereço acessado não existe.</p>' +
    '<button class="btn btn-primary" onclick="go(\'/\')">Voltar ao início</button></div></section>';
}


/* ==========================================================================
   Roteador e inicialização
   ========================================================================== */
function parseRoute(){
  const h = location.hash.replace(/^#/, '');
  if (!h || h === '/') return ['home'];
  return h.split('/').filter(Boolean);
}

function renderView(name = 'home', id, semConfirmacoes){
  let html;
  switch (name) {
    case 'home':        html = homeView(); break;
    case 'ocorrencias': html = listView(); break;
    case 'ocorrencia':  html = detailView(id); break;
    case 'login':       html = loginView(); break;
    case 'cadastro':    html = cadastroView(); break;
    case 'registrar':   if (!requireAuth()) return; html = registrarView(); break;
    case 'editar':      if (!requireAuth()) return; html = editarView(id); break;
    case 'minhas':      if (!requireAuth()) return; html = minhasView(); break;
    case 'conta':       if (!requireAuth()) return; html = contaView(); break;
    default:            html = notFoundView();
  }
  document.getElementById('app').innerHTML = html;
  renderHeader();
  if (name === 'ocorrencias') {
  renderListGrid();
  carregarConfirmacoesDosCartoes();
} else {
  observarCartoes();
  if (name !== 'ocorrencia') {
    carregarConfirmacoesDosCartoes();
  }
}                          // Home e Minhas
  if (name === 'ocorrencia') {
    if (!semConfirmacoes) carregarConfirmacoes(id);
    carregarFotoDe(Number(id));
  }
  if (name === 'editar') {
  carregarFotosEdicao(Number(id));
}

}


/* ===================== BLOCO C — roteador ===================== */
async function router() {
  const rota = parseRoute();
  const pagina = rota[0] || 'home';
  const chave = rota.join('/');

  // Páginas privadas: só consulta /mine se os dados estiverem velhos.
  if (pagina === 'minhas' || pagina === 'editar') {
    if (!requireAuth()) return;
    const carregou = await minhasSeNecessario();
    if (!carregou && !state.currentUser) return;
    if (parseRoute().join('/') !== chave) return;
  }

  // Mostra NA HORA o que já está em memória.
  renderView(...rota);
  window.scrollTo(0, 0);

  // Se os dados públicos estiverem velhos, atualiza em segundo plano.
  if (['home', 'ocorrencias', 'ocorrencia'].includes(pagina)) {
    atualizarOcorrenciasSeNecessario(TTL_NAVEGACAO);
  }
}



window.addEventListener('hashchange', () => {
  closeMenu();
  fecharLightbox();
  router();
});

document.addEventListener('keydown', e => {
  const box = document.getElementById('lightbox');
  const aberto = box && box.classList.contains('show');
  if (e.key === 'Escape') {
    if (aberto) fecharLightbox();
    closeConfirm();
  } else if (aberto && lb.fotos.length > 1) {
    if (e.key === 'ArrowLeft') moverLightbox(-1);
    if (e.key === 'ArrowRight') moverLightbox(1);
  }
});



/* ===================== BLOCO D — voltar para a aba ===================== */
// Sem timer. Só roda quando o usuário volta para a aba, e só consulta se os dados têm > 2 min.
async function atualizarAoVoltar() {
  if (document.visibilityState !== 'visible') return;

  const rota = parseRoute();
  const pagina = rota[0] || 'home';
  if (!['home', 'ocorrencias', 'ocorrencia', 'minhas'].includes(pagina)) return;

  await atualizarOcorrenciasSeNecessario(TTL_VOLTAR_ABA);

  if (pagina === 'minhas' && state.currentUser && parseRoute().join('/') === rota.join('/')) {
    const antes = assinatura(myOccurrences);
    const ok = await minhasSeNecessario(TTL_VOLTAR_ABA);
    if (ok && assinatura(myOccurrences) !== antes && parseRoute().join('/') === rota.join('/')) {
      repintarTela(false);
    }
  }
}

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') atualizarAoVoltar();
});

let tentativaInicial = 0;

async function iniciarAplicacao(){
  const tentativa = ++tentativaInicial;
  const retry = document.getElementById('loader-retry');
  if (retry) retry.onclick = iniciarAplicacao;

  const msg = (texto, erro) => window.atualizarLoader && window.atualizarLoader(texto, erro);

  msg('Carregando dados demonstrativos…');

  // Mensagens que aparecem conforme a demora
  const timers = []; // demonstração: não há servidor para "acordar"
  const pararTimers = () => timers.forEach(clearTimeout);

  // Quando 2 das 3 cargas terminam, avisa que está quase pronto
  let concluidas = 0;
  const acompanhar = promessa => promessa.then(r => {
    if (++concluidas === 2 && tentativa === tentativaInicial) {
      pararTimers();
      msg('Quase pronto, finalizando…');
    }
    return r;
  });

  

  try {
    const [categorias, sessaoRestaurada, ocorrenciasCarregadas] = await Promise.all([
      acompanhar(carregarCategorias()),
      acompanhar(restaurarSessao()),
      acompanhar(carregarOcorrencias(false))
    ]);

    pararTimers();
    if (tentativa !== tentativaInicial) return;
    if (categorias === null || !sessaoRestaurada || !ocorrenciasCarregadas) {
      throw new Error('Não foi possível concluir o carregamento dos dados necessários.');
    }

    msg('Tudo pronto! Abrindo o Meu Bairro…');
    renderView(...parseRoute());
    window.scrollTo(0, 0);
    if (window.esconderLoader) await window.esconderLoader();
  } catch (erro) {
    pararTimers();
    console.error('Erro ao iniciar o Meu Bairro:', erro);
    if (tentativa !== tentativaInicial) return;
    msg('Não foi possível carregar os dados demonstrativos. Tente novamente ou restaure os dados pela faixa no topo.', true);
  }
}




window.addEventListener('DOMContentLoaded', iniciarAplicacao);
