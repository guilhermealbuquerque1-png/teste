# Meu Bairro — Protótipo demonstrativo

Versão independente do **Meu Bairro** para apresentações acadêmicas. É o mesmo
site (mesmas telas, textos, cores e componentes), mas **sem backend**: não usa
a API Java/Spring Boot, o Render nem o MySQL. Todos os dados são fictícios e
ficam guardados apenas no navegador (`localStorage`).

> O projeto original não foi alterado. Esta pasta é uma cópia independente.

## Como executar

**Opção 1 — direto no navegador:** dê dois cliques em `index.html`.

**Opção 2 — servidor local (recomendado para testar como será publicado):**

```bash
cd meu-bairro-demo
python3 -m http.server 8000      # ou: npx serve .
# abra http://localhost:8000
```

Não há instalação, build nem variáveis de ambiente.

## Como usar na apresentação

- Conta de teste (já criada): **demo@meubairro.example** · senha **demo123**.
  Ela é dona de duas ocorrências (Ponta Negra e Alvorada), então "Minhas
  ocorrências", editar, resolver, reabrir e excluir já têm o que mostrar.
- Também é possível **criar uma conta nova** (nome, e-mail e senha de 6+ caracteres).
- Funcionam: página inicial, lista com pesquisa e filtros (bairro, categoria,
  status), detalhes com galeria e zoom, registrar e editar ocorrência com fotos
  (até 3), confirmar e remover confirmação, marcar como resolvida (com
  responsável e data), reabrir, excluir, login, cadastro e sair.
- Os dados continuam depois de atualizar a página.

## Restaurar os dados demonstrativos

Qualquer uma das formas abaixo volta tudo ao estado inicial (10 ocorrências,
contas de exemplo, sem sessão):

1. Botão **Restaurar dados** na faixa verde no topo do site (pede confirmação).
2. No console do navegador: `MeuBairroDemo.reset()` e depois recarregue a página.
3. Limpando os dados do site nas configurações do navegador.

Se os dados ficarem corrompidos por qualquer motivo, o protótipo recria os
dados iniciais sozinho ao carregar.

## Como publicar (hospedagem estática, para QR Code)

Não há nada a compilar: publique **o conteúdo desta pasta** como está. As rotas
usam `#` e os caminhos são relativos, então funciona na raiz do domínio ou em
subpasta (ex.: GitHub Pages em `usuario.github.io/repositorio/`).

- **Netlify Drop:** arraste a pasta em <https://app.netlify.com/drop>.
- **GitHub Pages:** envie os arquivos para um repositório e ative Pages
  (Settings → Pages → branch `main`, pasta `/root`).
- **Vercel / Cloudflare Pages:** importe a pasta como projeto estático, sem comando de build.

Depois de publicar, gere o QR Code a partir do endereço **https** final em
qualquer gerador de QR Code.

## Estrutura

```
index.html        página (faixa e aviso de protótipo, carrega os scripts)
style.css         estilos originais + bloco "19" da faixa de protótipo
script.js         código original do site (ver "O que mudou")
demo-api.js       API simulada: substitui o backend usando localStorage
images/           logo, banner e imagem do loader (originais)
images/demo/      4 ilustrações dos registros de exemplo (SVG, offline)
```

## O que mudou em relação ao site original

- **`demo-api.js` (novo):** responde às mesmas rotas, status HTTP e formatos de
  JSON do backend (`/categories`, `/occurrences`, `/occurrences/mine`,
  `/occurrences/{id}`, `/status`, `/images`, `/confirmations`, `/users/login`,
  `/users/register`). Valida os campos e devolve os mesmos erros que o `script.js`
  já sabia tratar (401, 403, 409, 400...). Ele intercepta o `fetch` das chamadas
  `demo://...`; nenhuma requisição de dados sai do navegador.
- **`script.js`:** `API_BASE` agora é `demo://meu-bairro/api` (antes apontava para
  o Render); removidas as mensagens do loader que falavam em "servidor
  acordando"; e uma pequena correção (abaixo). O restante é idêntico.
- **`index.html`:** título, faixa "Protótipo demonstrativo" com conta de teste e
  botão de restaurar, aviso no rodapé e a tag do `demo-api.js`.
- **`style.css`:** apenas acrescentado o bloco 19 (faixa do protótipo). Nenhuma
  regra original foi alterada.

**Correção no `script.js`:** ao editar uma ocorrência, as fotos removidas ou
adicionadas só apareciam depois de recarregar a página, porque o cache de fotos
em memória não era invalidado. Foram adicionadas duas linhas em `salvarEdicao`
para limpar o cache daquela ocorrência. Esse comportamento já existia no código
original (não depende do backend).

## Limitações conhecidas

- **Cada navegador/dispositivo tem seus próprios dados.** Quem abrir pelo QR
  Code vê os 10 registros iniciais e o que cadastrar fica só no próprio
  aparelho; não há sincronização entre pessoas.
- **Fotos:** são reduzidas (máx. 1280 px, JPEG) para caber no `localStorage`
  (~5 MB). Se o espaço acabar, o protótipo avisa que a foto não foi enviada em
  vez de fingir sucesso; use "Restaurar dados" para liberar espaço.
- **Senhas:** guardadas só como um hash simples de demonstração. Isso **não é
  segurança real**; não use senhas verdadeiras.
- **Fonte Inter:** continua sendo carregada do Google Fonts (único recurso
  externo, só visual). Sem internet o site usa a fonte padrão do sistema e
  continua funcionando.
- Registros, contas, fotos e confirmações são **fictícios** e não representam
  denúncias reais ou verificadas.


## Atualização do cadastro (protótipo)

A tela de cadastro foi ajustada para seguir as regras de senha descritas no relatório: mínimo de 8 caracteres, pelo menos uma letra e um número, sem espaços; caracteres especiais são permitidos. A confirmação de senha é validada antes do envio, e os campos de senha têm controles para mostrar ou ocultar o conteúdo. O protótipo também valida o formato do e-mail e impede o cadastro de um endereço já utilizado.

**Limitação:** por ser uma demonstração local, esta atualização não envia e-mails reais para verificação de endereço nem implementa o fluxo de recuperação de senha por token. Esses recursos devem ser conectados ao backend para serem considerados funcionais.


## Atualização 2 — Cadastro (RF01 a RF03) e exclusão de conta (RF15 e RF16)

Esta atualização apenas **acrescenta** funcionalidades; as telas e fluxos anteriores continuam iguais.
A regra de senha desta seção **substitui** a descrita em "Atualização do cadastro" acima, para ficar igual ao relatório.

**Cadastro (RF01 a RF03)**
- **Nome:** aceita letras (inclusive acentuadas), números e espaços; caracteres especiais são recusados.
- **E-mail:** formato válido e único (e-mail já usado é recusado, sem diferenciar maiúsculas/minúsculas).
- **Senha:** mínimo de 8 caracteres, com ao menos uma letra maiúscula, uma minúscula, um número e um caractere especial; não pode ter espaços.
- **Força da senha:** barra colorida (fraca / média / forte) e lista de requisitos que vai marcando conforme a pessoa digita.
- **Confirmação de senha:** aviso na hora se as senhas coincidem ou não, e validação antes do envio.
- Mostrar/ocultar senha continua nos dois campos. As mesmas regras também são validadas na API simulada.
- Contas antigas (inclusive a de teste `demo123`) continuam entrando normalmente: a regra vale apenas para novos cadastros.

**Exclusão definitiva da conta (RF15 e RF16)**
- Nova tela **Minha conta** (`#/conta`), com link no cabeçalho para quem está logado.
- Em "Excluir conta definitivamente", é preciso abrir a confirmação e digitar **EXCLUIR** para habilitar o botão.
- Ao confirmar, a API simulada (`DELETE /users/me`) remove: a conta, todas as ocorrências criadas por ela, as fotos dessas ocorrências, as confirmações recebidas por elas e as confirmações que a pessoa fez em outras ocorrências.
- Em seguida a sessão é encerrada, o usuário volta ao início e aparece uma mensagem informando o resultado.
- Para recuperar as ocorrências de exemplo que forem apagadas (por exemplo, ao excluir a conta de teste), use **Restaurar dados**.

**Limitação:** continua sem envio de e-mail de verificação e sem recuperação de senha por token (precisam do backend real).

Arquivos alterados: `script.js`, `demo-api.js` e `style.css` (novo bloco "20"). `index.html` não mudou.


## Atualização 3 — Bloqueio temporário de login (RF05)

Novo requisito do relatório: após **cinco tentativas consecutivas** com credenciais inválidas, o login é bloqueado por **15 minutos**, e o usuário é informado do tempo de espera. (No relatório atualizado a numeração dos requisitos mudou: cadastro = RF01 a RF03, login = RF04, exclusão de conta = RF15 e RF16.)

- Tentativas 1 a 4 inválidas: a mensagem continua a mesma ("E-mail ou senha inválidos.").
- Na 5ª tentativa inválida seguida, o login daquele e-mail é bloqueado por 15 minutos. Durante o bloqueio, **até a senha correta é recusada**.
- A tela de login mostra um aviso com **contagem regressiva** ("Tente novamente em 14 min 32 s"), e o botão **Entrar** fica desabilitado enquanto o e-mail bloqueado estiver no campo. Se a pessoa trocar o e-mail, o botão volta a funcionar (o bloqueio é por e-mail).
- Um login válido zera a contagem; passados os 15 minutos, a contagem recomeça do zero.
- A API simulada responde com **HTTP 429** e o campo `retryAfterSeconds`.
- O estado do bloqueio fica no `localStorage` (sobrevive a atualizar a página). **Restaurar dados** também limpa os bloqueios.

**Para a apresentação:** para não esperar 15 minutos, rode no console do navegador `MeuBairroDemo.liberarLogin()`.

**Limitação:** por ser uma demonstração local, o bloqueio vale apenas neste navegador; no sistema real ele deve ser aplicado no servidor.

Arquivos alterados nesta atualização: `script.js`, `demo-api.js` e `style.css` (novo bloco "21"). `index.html` não mudou.


## Atualização 4 — Páginas nas listas, intervalo entre registros (RF10) e novo avatar

No relatório atual a numeração é: cadastro = RF01 a RF03, login = RF04 e RF05, listagem = RF06, registro de ocorrência = RF10 e RF11, exclusão de conta = RF16 e RF17.

**Listas em páginas (RF06) — 10 por página**
- As telas **Ocorrências** (com pesquisa e filtros) e **Minhas ocorrências** passam a ser divididas em páginas quando há **mais de 10 ocorrências**: botões **Anterior / Próxima**, números de página e "Página X de Y". Com 10 ou menos, nada aparece e a tela fica como antes.
- Em **Ocorrências**, a pesquisa e os filtros valem para todas as ocorrências; ao mudá-los a lista volta para a página 1. O contador "N ocorrências encontradas" continua mostrando o total.
- Para mudar o tamanho da página, altere a constante `OCORRENCIAS_POR_PAGINA` em `script.js`.
- **Para a apresentação:** como o protótipo começa com 4 ocorrências, rode no console `MeuBairroDemo.gerarExemplos(12)` e recarregue a página para ver as páginas nas duas listas (a conta de teste fica com mais de 10). **Restaurar dados** remove esses exemplos.

**Intervalo mínimo entre registros (RF10)**
- Depois de registrar uma ocorrência, o mesmo usuário precisa esperar **60 segundos** para registrar outra. Antes disso a API simulada recusa o pedido (HTTP 429, campo `retryAfterSeconds`).
- Em **Registrar ocorrência** aparece um aviso com o tempo restante em contagem regressiva; o botão **Publicar** fica desabilitado e o que foi preenchido é mantido.
- Vale por usuário e só conta registros aceitos (formulário inválido não consome o intervalo). Editar, resolver e excluir não são afetados.
- **Para a apresentação:** para não esperar, rode no console `MeuBairroDemo.liberarRegistro()`. **Restaurar dados** também zera o intervalo.

**Avatar do usuário**
- No cabeçalho, a letra inicial foi trocada pelo ícone padrão de usuário (`user-round`), em silhueta branca sobre o mesmo círculo dourado. Mudança apenas visual: sem upload de foto e sem alteração na API.

**Correção de ids (necessária para criar ocorrências)**
- O contador de ids começava em 1, mas as 4 ocorrências de exemplo já usam os ids 1 a 4. Por isso a primeira ocorrência nova recebia um id repetido: abria a ocorrência errada e não podia ser editada. Agora o id novo nunca repete um id existente (`proximoIdOcorrencia` em `demo-api.js`). Dados já salvos com ids repetidos no navegador são corrigidos com **Restaurar dados**.

**Limitação:** o intervalo de 60 s vale apenas neste navegador; no sistema real deve ser aplicado no servidor.

Arquivos alterados nesta atualização: `script.js`, `demo-api.js` e `style.css` (novos blocos "24" e "25"). `index.html` não mudou.
