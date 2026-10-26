# 🎮 Pokédex Explorer & Team Builder — Projeto Final (Etapa 03)

**Bootcamp II · Etapa 03 · Desafio final em grupo**

Aplicação web colaborativa que consulta Pokémon em tempo real pela **PokeAPI** e salva a equipe de favoritos em um banco **PostgreSQL (Supabase)**, desenvolvida com fluxo profissional: branches, Pull Requests revisadas, `main` protegida e testes automatizados no **GitHub Actions**.

---

## 🔗 Links Oficiais da Entrega

| Item | Link |
| --- | --- |
| 📁 Repositório no GitHub | https://github.com/Auggusti0G/bootcamp02-projeto-final |
| 🐳 Imagem no Docker Hub | https://hub.docker.com/r/rafaelaugusto01/bootcamp02-projeto-final |
| 🔀 Pull Requests do time | https://github.com/Auggusti0G/bootcamp02-projeto-final/pulls?q=is%3Apr |
| ⚙️ Execuções do CI (Actions) | https://github.com/Auggusti0G/bootcamp02-projeto-final/actions |
| 📦 Projeto Github Pages | https://auggusti0g.github.io/bootcamp02-projeto-final/ |

---

## 👥 1. Integrantes

| Nome | Matrícula | Usuário GitHub | Funcionalidade (código) | PR principal |
| --- | --- | --- | --- | --- |
| Rafael Augusto Santana Gil | 22508717 | [@Auggusti0G](https://github.com/Auggusti0G) | Testes automatizados (Jest), GitHub Actions e Docker Hub | [#1](https://github.com/Auggusti0G/bootcamp02-projeto-final/pull/1) |
| Maria Júlia de Carvalho Costa | 22408994 | [@majuccostaa](https://github.com/majuccostaa) | Persistência real no Supabase (criar, listar e excluir favoritos) | [#3](https://github.com/Auggusti0G/bootcamp02-projeto-final/pull/3) |

### 🔀 Histórico de Pull Requests

| PR | Branch | Autor | Revisor | O que entregou |
| --- | --- | --- | --- | --- |
| [#1](https://github.com/Auggusti0G/bootcamp02-projeto-final/pull/1) | `feature/testes-ci` | Rafael | Maria Júlia | Funções puras em `utils.js`, testes com Jest e workflow do GitHub Actions |
| [#2](https://github.com/Auggusti0G/bootcamp02-projeto-final/pull/2) | `test/teste-de-fogo` | Maria Júlia | Rafael | Teste de fogo: teste quebrado de propósito, merge bloqueado pelo CI e depois corrigido |
| [#3](https://github.com/Auggusti0G/bootcamp02-projeto-final/pull/3) | `feature/favoritos-supabase` | Maria Júlia | Rafael | Favoritos salvos no Supabase: criar, listar e excluir |
| [#4](https://github.com/Auggusti0G/bootcamp02-projeto-final/pull/4) | `docs/pr-rafael` | Rafael | Maria Júlia | Link da PR principal do Rafael na tabela de integrantes |
| [#5](https://github.com/Auggusti0G/bootcamp02-projeto-final/pull/5) | `docs/pr-maju` | Maria Júlia | Rafael | Link da PR principal da Maria Júlia e resolução do conflito de merge |
| [#6](https://github.com/Auggusti0G/bootcamp02-projeto-final/pull/6) | `docs/readme-final` | Rafael | Maria Júlia | README final da entrega |

**Padrão de nomes de branch:** `feature/<nome>` para funcionalidades, `test/<nome>` para testes e `docs/<nome>` para documentação.

---

## 📝 2. Sobre a Aplicação

O **Pokédex Explorer & Team Builder** é uma aplicação web feita com HTML, CSS e JavaScript puro. O usuário pesquisa um Pokémon pelo nome ou número (ou sorteia um com o botão **Aleatório**) e vê:

- Nome e número na Pokédex.
- Arte oficial.
- Tipos elementares.
- Altura e peso.
- Habilidade principal traduzida.

Clicando na estrela (⭐) do cartão, o Pokémon entra na equipe de favoritos, que fica salva no banco de dados e continua lá mesmo depois de fechar ou recarregar a página.

### 🌐 API externa consumida — PokeAPI

- **[PokeAPI](https://pokeapi.co/docs/v2)**, API pública e gratuita, sem chave.
- `https://pokeapi.co/api/v2/pokemon/{nome-ou-numero}`: dados do Pokémon.
- `https://pokeapi.co/api/v2/ability/{id}`: nome da habilidade em português.

### 💾 Banco de dados — Supabase (PostgreSQL)

Os favoritos ficam na tabela `favoritos` do **[Supabase](https://supabase.com/)**, um PostgreSQL gerenciado na nuvem.

| Coluna | Tipo | Regra |
| --- | --- | --- |
| `id` | `bigint` | Chave primária gerada automaticamente |
| `criado_em` | `timestamptz` | Padrão `now()` |
| `numero` | `integer` | Número do Pokémon na Pokédex, `UNIQUE` |
| `nome` | `text` | Nome do Pokémon |
| `imagem` | `text` | URL da arte oficial |

| Operação | Como o usuário faz | Comando no banco |
| --- | --- | --- |
| **Criar** | Clica na ☆ do cartão | `INSERT` |
| **Listar** | Clica em **Meus Favoritos** | `SELECT` ordenado por `criado_em` |
| **Excluir** | Clica no ✕ da lista ou de novo na ⭐ | `DELETE` pelo `numero` |

Se o Pokémon já estiver salvo, o PostgreSQL devolve o erro `23505` (violação do `UNIQUE`) e a tela mostra *"Este Pokémon já está nos seus favoritos!"*.

**Segurança (RLS):** a tabela usa Row Level Security, com permissões de `SELECT`, `INSERT` e `DELETE` para a role `anon`. Como a aplicação não tem login, todos os visitantes compartilham a mesma lista de favoritos. O `config.js` contém apenas a URL e a chave **pública** (publishable) do projeto.

### 🛠️ Tecnologias

| Camada | Tecnologia |
| --- | --- |
| Interface | HTML, CSS e JavaScript puro |
| Banco de dados | Supabase (PostgreSQL) via `supabase-js` v2 (CDN) |
| API externa | PokeAPI |
| Testes | Jest |
| Integração contínua | GitHub Actions |
| Contêiner | Docker com Nginx Alpine |

---

## 📂 Estrutura de Arquivos

```text
bootcamp02-projeto-final/
├── .github/workflows/ci.yml   # GitHub Actions: roda npm test em cada PR e push na main
├── evidencias/
│   ├── evidencias.pdf         # Todos os prints com a explicação de cada um
│   ├── main-protegida.png     # Ruleset proteger-main ativo
│   ├── pr-bloqueada.png       # PR bloqueada pelo CI
│   ├── erro-jest.png          # Log do teste que falhou no GitHub Actions
│   └── conflito.png           # Conflito de merge na PR #5
├── .dockerignore              # Deixa fora da imagem: testes, node_modules, .github, README
├── .gitignore                 # Não envia node_modules ao GitHub
├── config.js                  # URL e chave pública do Supabase
├── docker-compose.yml         # Sobe a aplicação com um comando (porta 8080)
├── dockerfile                 # Imagem Nginx Alpine servindo os arquivos estáticos
├── index.html                 # Estrutura da página
├── style.css                  # Visual em dark mode, responsivo
├── script.js                  # Tela, chamadas à PokeAPI e favoritos no Supabase
├── utils.js                   # Funções puras (validação, formatação, conversões, sorteio)
├── utils.test.js              # Testes automatizados com Jest
├── package.json               # Define o comando npm test
├── package-lock.json          # Versões exatas das dependências
└── README.md                  # Este documento
```

---

## 🚀 3. Como Executar

### 🐳 Opção A — Docker (recomendada para avaliação)

```bash
docker run -d -p 8080:80 --name pokedex-final rafaelaugusto01/bootcamp02-projeto-final:1.0
```

Depois, acesse: 👉 http://localhost:8080/

**O que esse comando faz?**

- `-d`: executa o contêiner em segundo plano.
- `-p 8080:80`: liga a porta 80 do contêiner à porta 8080 da máquina.
- `--name pokedex-final`: dá um nome ao contêiner.
- `rafaelaugusto01/bootcamp02-projeto-final:1.0`: imagem e versão publicadas no Docker Hub.

**Variáveis de ambiente:** nenhuma é necessária. A URL e a chave pública do Supabase já estão no `config.js` dentro da imagem.

**Tags publicadas:** `1.0` (versão da entrega) e `latest` (mesma versão).

> Se a porta 8080 estiver ocupada, troque o primeiro número: `-p 8090:80` e acesse http://localhost:8090/. Para parar e remover o contêiner: `docker rm -f pokedex-final`.

### 🧩 Opção B — Docker Compose (a partir do código)

```bash
git clone https://github.com/Auggusti0G/bootcamp02-projeto-final.git
cd bootcamp02-projeto-final
docker compose up -d --build
```

Acesse http://localhost:8080/. Para parar: `docker compose down`.

### 💻 Opção C — Local, sem Docker

```bash
git clone https://github.com/Auggusti0G/bootcamp02-projeto-final.git
cd bootcamp02-projeto-final
```

Abra o `index.html` no navegador, ou use a extensão **Live Server** do VS Code (botão direito no `index.html` → *Open with Live Server*).

---

## 🧪 4. Como Rodar os Testes

Pré-requisito: Node.js 20 ou superior.

```bash
npm install
npm test
```

Resultado esperado: `Tests: 8 passed, 8 total`.

| Grupo | O que é testado |
| --- | --- |
| `validarEntrada` | Rejeita busca vazia ou só com espaços |
| `validarEntrada` | Aceita nome ou número válidos (`pikachu`, `25`, `mr-mime`) |
| `validarEntrada` | Rejeita caracteres especiais (`pika chu`, `<script>`) |
| `formatarNome` | `pikachu` → `Pikachu` e `MEWTWO` → `Mewtwo` |
| `formatarId` | `25` → `025` |
| `converterAltura` / `converterPeso` | Converte as unidades da PokeAPI (dm → m, hg → kg) |
| `sortearId` | O sorteio fica sempre entre 1 e 151 |
| Teste de fogo | `bulbasaur` → `Bulbasaur` |

### ⚙️ Integração contínua — GitHub Actions

O workflow `.github/workflows/ci.yml` roda em **toda Pull Request para a `main`** e em **todo push na `main`**: baixa o código, instala o Node.js 20, roda `npm install` e `npm test`.

### 🔒 Proteção da `main`

Ruleset `proteger-main` ativo, sem exceções (nem o dono do repositório pode pular as regras):

- **Require a pull request before merging**, com **1 aprovação** obrigatória de outro membro.
- **Require status checks to pass**, com o check **`testes`** do GitHub Actions obrigatório.
- **Block force pushes** e **Restrict deletions**.

Resultado: código só entra na `main` por PR aprovada por um colega e com os testes verdes.

---

## 🎯 5. Evidências

Todos os prints, com a explicação de cada um, também estão no PDF [evidencias/evidencias.pdf](evidencias/evidencias.pdf).

### 🔒 Branch `main` protegida

O ruleset `proteger-main` está ativo na `main`, com 3 regras: PR com 1 aprovação, check `testes` obrigatório e bloqueio de force push e exclusão.

![Ruleset proteger-main ativo](evidencias/main-protegida.png)

### ❌ PR bloqueada pelo CI (teste de fogo)

Na PR [#2](https://github.com/Auggusti0G/bootcamp02-projeto-final/pull/2), adicionamos de propósito um teste com o resultado esperado errado (`formatarNome("bulbasaur")` esperando `"bulbasaur"` em vez de `"Bulbasaur"`). O GitHub Actions falhou, o check obrigatório `testes` ficou vermelho e o merge foi bloqueado. Depois corrigimos o teste na mesma branch, o check ficou verde e a PR foi aprovada e mesclada.

![PR bloqueada pelo CI](evidencias/pr-bloqueada.png)

O log do GitHub Actions mostra o motivo da falha: `Expected: "bulbasaur"`, `Received: "Bulbasaur"` e `Tests: 1 failed, 7 passed, 8 total`.

![Log do Jest no GitHub Actions](evidencias/erro-jest.png)

### 🔀 Conflito de merge resolvido

**O que aconteceu:** as PRs [#4](https://github.com/Auggusti0G/bootcamp02-projeto-final/pull/4) e [#5](https://github.com/Auggusti0G/bootcamp02-projeto-final/pull/5) foram abertas ao mesmo tempo, e as duas alteravam a tabela de integrantes do `README.md`. Cada integrante preencheu o link da sua PR principal na própria linha, e as duas linhas ficam uma embaixo da outra.

**Por que deu conflito:** depois do merge da #4, a `main` passou a ter a linha do Rafael preenchida. A branch `docs/pr-maju` tinha a versão antiga dessa linha e a linha da Maria Júlia alterada. Como as mudanças estavam em linhas vizinhas, o Git não conseguiu juntar sozinho e marcou o conflito.

**Como resolvemos:** a Maria Júlia usou o botão **Resolve conflicts** da PR #5. No editor do GitHub, mantivemos as duas linhas preenchidas (`#1` na do Rafael e `#3` na dela), apagamos os marcadores `<<<<<<<`, `=======` e `>>>>>>>` e confirmamos com **Mark as resolved → Commit merge**. O CI rodou de novo, o Rafael revisou e aprovou, e a PR foi mesclada.

**O que aprendemos:** quando duas pessoas mexem no mesmo trecho de um arquivo ao mesmo tempo, o Git não escolhe sozinho qual versão vale. A decisão é do time, e por isso a revisão em dupla é importante.

![Conflito de merge na PR #5](evidencias/conflito.png)

---

## 📌 Considerações Finais

O **Pokédex Explorer & Team Builder — Projeto Final** evoluiu a aplicação das Etapas 01 e 02 para um fluxo de trabalho em equipe: cada funcionalidade nasceu em uma branch própria, passou por Pull Request revisada por um colega e só entrou na `main` com os testes aprovados pelo GitHub Actions e para achar os prints das evidencias basta ir na pasta de evidencias que tem um pdf com tudo de evidencias e todos os prints explicados.

A aplicação consome a PokeAPI, salva os favoritos em PostgreSQL (Supabase) com criar, listar e excluir, e está publicada no Docker Hub, pronta para rodar com um único comando.
