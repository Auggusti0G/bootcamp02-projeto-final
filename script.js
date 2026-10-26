const campoBusca = document.getElementById("campo-busca");
const botaoBuscar = document.getElementById("botao-buscar");
const botaoAleatorio = document.getElementById("botao-aleatorio");
const botaoFavoritos = document.getElementById("botao-favoritos");
const areaResultado = document.getElementById("resultado");

// =============================================================
// Persistência real: tabela "favoritos" no Supabase (PostgreSQL)
// SUPABASE_URL e SUPABASE_ANON_KEY vêm do config.js
// =============================================================
const clienteSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Guarda na memória os números já favoritados, para pintar a estrela sem ir ao banco toda hora
let numerosFavoritos = new Set();

// LISTAR (SELECT): busca todos os favoritos, do mais antigo para o mais novo
async function obterFavoritos() {
  const { data, error } = await clienteSupabase
    .from("favoritos")
    .select("numero, nome, imagem")
    .order("criado_em", { ascending: true });

  if (error) {
    console.error("Erro ao listar favoritos:", error);
    throw error;
  }
  numerosFavoritos = new Set(data.map(f => f.numero));
  return data;
}

// CRIAR (INSERT): salva um Pokémon nos favoritos
async function adicionarFavorito(pokemon) {
  const { error } = await clienteSupabase
    .from("favoritos")
    .insert({ numero: pokemon.numero, nome: pokemon.nome, imagem: pokemon.imagem });

  if (error) {
    // 23505 = violação da restrição UNIQUE da coluna "numero"
    if (error.code === "23505") {
      mostrarAviso("Este Pokémon já está nos seus favoritos!");
      numerosFavoritos.add(pokemon.numero);
      return;
    }
    throw error;
  }
  numerosFavoritos.add(pokemon.numero);
  mostrarAviso(`${formatarNome(pokemon.nome)} foi adicionado aos favoritos!`);
}

// EXCLUIR (DELETE): remove um Pokémon dos favoritos pelo número
async function excluirFavorito(numero) {
  const { error } = await clienteSupabase
    .from("favoritos")
    .delete()
    .eq("numero", numero);

  if (error) throw error;
  numerosFavoritos.delete(numero);
}

function eFavorito(numero) {
  return numerosFavoritos.has(numero);
}

// Clique na estrela do card: favorita ou desfavorita
async function alternarFavorito(pokemon) {
  try {
    if (eFavorito(pokemon.numero)) {
      await excluirFavorito(pokemon.numero);
      mostrarAviso(`${formatarNome(pokemon.nome)} saiu dos favoritos.`);
    } else {
      await adicionarFavorito(pokemon);
    }
  } catch (erro) {
    console.error(erro);
    mostrarAviso("Não foi possível falar com o banco de dados. Tente novamente.");
  }

  const btnStar = document.getElementById("btn-star");
  if (btnStar) {
    btnStar.innerText = eFavorito(pokemon.numero) ? "⭐" : "☆";
  }
}

// Mensagem temporária no canto da tela
function mostrarAviso(mensagem) {
  const aviso = document.createElement("div");
  aviso.textContent = mensagem;
  aviso.style.cssText =
    "position:fixed;bottom:24px;left:50%;transform:translateX(-50%);" +
    "background:#1e293b;color:#f8fafc;padding:12px 20px;border-radius:10px;" +
    "box-shadow:0 4px 12px rgba(0,0,0,.4);font-family:Poppins,sans-serif;z-index:1000;";
  document.body.appendChild(aviso);
  setTimeout(() => aviso.remove(), 3000);
}

// Função auxiliar para buscar a tradução da habilidade para PT-BR
async function obterHabilidadeTraduzida(urlHabilidade) {
  try {
    const res = await fetch(urlHabilidade);
    if (!res.ok) return null;
    const data = await res.json();
    
    // Procura a tradução em português nas 'names' da API
    const nomePt = data.names.find(n => n.language.name === "pt" || n.language.name === "es");
    return nomePt ? nomePt.name : data.name;
  } catch {
    return null;
  }
}

async function buscarPokemon(termo) {
  // Validação (utils.js): bloqueia entrada vazia ou com caracteres inválidos antes de chamar a API
  if (!validarEntrada(termo)) {
    areaResultado.innerHTML = `
      <div class="error-card">
        <div class="error-icon">⚠️</div>
        <h3>Entrada inválida!</h3>
        <p>Use apenas letras, números ou hífen (ex: pikachu, 25, mr-mime).</p>
      </div>
    `;
    return;
  }

  // Exibe o estado visual de carregamento (Spinner)
  areaResultado.innerHTML = `
    <div class="loading-state">
      <div class="spinner"></div>
      <p style="color: #94a3b8; font-size: 0.9rem;">Buscando na Pokédex...</p>
    </div>
  `;

  try {
    // Garante que o termo seja formatado como texto minúsculo sem espaços
    const termoTratado = String(termo).toLowerCase().trim();
    const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${termoTratado}`);

    if (!resposta.ok) {
      throw new Error("Pokémon não encontrado");
    }

    const dados = await resposta.json();

    // Extração das informações básicas
    const nome = dados.name;
    const id = formatarId(dados.id);
    const imagem = dados.sprites.other['official-artwork'].front_default || dados.sprites.front_default;
    const tipos = dados.types.map(t => `<span class="type-badge">${t.type.name}</span>`).join('');
    const altura = converterAltura(dados.height);
    const peso = converterPeso(dados.weight);

    // Tradução da habilidade
    let habilidadeNome = 'N/A';
    if (dados.abilities.length > 0) {
      const habObj = dados.abilities[0];
      const traduzida = await obterHabilidadeTraduzida(habObj.ability.url);
      habilidadeNome = traduzida || habObj.ability.name;
    }

    const pokemonAtual = { numero: dados.id, nome, imagem };
    const jaEhFavorito = eFavorito(dados.id);

    // Renderização dos dados no DOM
    areaResultado.innerHTML = `
      <div class="pokemon-card">
        <button id="btn-star" class="btn-fav-card" title="Favoritar">${jaEhFavorito ? "⭐" : "☆"}</button>
        <span class="pokemon-id">#${id}</span>
        <img src="${imagem}" alt="${nome}" class="pokemon-img">
        <h2 class="pokemon-name">${formatarNome(nome)}</h2>
        <div class="types-container">${tipos}</div>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-label">Altura</span>
            <span class="stat-value">${altura} m</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Peso</span>
            <span class="stat-value">${peso} kg</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Habilidade</span>
            <span class="stat-value">${habilidadeNome}</span>
          </div>
        </div>
      </div>
    `;

    // Evento de clique para favoritar pelo card
    document.getElementById("btn-star").addEventListener("click", () => {
      alternarFavorito(pokemonAtual);
    });

    // Atualiza o valor do campo de entrada com o nome/número consultado
    campoBusca.value = dados.name;

  } catch (erro) {
    areaResultado.innerHTML = `
      <div class="error-card">
        <div class="error-icon">👾</div>
        <h3>Pokémon não encontrado!</h3>
        <p>Não encontramos nenhum resultado para "<strong>${termo}</strong>". Verifique se o nome ou número digitado está correto.</p>
      </div>
    `;
  }
}

// Renderiza a lista de favoritos (vinda do Supabase) no container do resultado
async function exibirFavoritos() {
  areaResultado.innerHTML = `
    <div class="loading-state">
      <div class="spinner"></div>
      <p style="color: #94a3b8; font-size: 0.9rem;">Carregando favoritos...</p>
    </div>
  `;

  let favoritos;
  try {
    favoritos = await obterFavoritos();
  } catch {
    areaResultado.innerHTML = `
      <div class="error-card">
        <div class="error-icon">⚠️</div>
        <h3>Erro ao carregar favoritos</h3>
        <p>Não foi possível conectar ao banco de dados.</p>
      </div>
    `;
    return;
  }

  if (favoritos.length === 0) {
    areaResultado.innerHTML = `
      <section class="favoritos">
        <h2>Meus Favoritos</h2>
        <div class="placeholder-state">
          <p>Você ainda não tem nenhum Pokémon salvo nos favoritos.</p>
        </div>
      </section>
    `;
    return;
  }

  const itensHTML = favoritos.map(f => `
    <div class="item-favorito" onclick="buscarPokemon('${f.nome}')">
      <div class="item-favorito-info">
        <img src="${f.imagem}" alt="${f.nome}" class="item-favorito-img">
        <span class="item-favorito-nome">${formatarNome(f.nome)} (#${formatarId(f.numero)})</span>
      </div>
      <button class="btn-remover-fav" onclick="event.stopPropagation(); removerFavorito(${f.numero})" title="Remover">✕</button>
    </div>
  `).join("");

  areaResultado.innerHTML = `
    <section class="favoritos">
      <h2>Meus Favoritos</h2>
      <div id="lista-favoritos">
        ${itensHTML}
      </div>
    </section>
  `;
}

// Botão ✕ da lista: exclui no banco e redesenha a lista
window.removerFavorito = async function (numero) {
  try {
    await excluirFavorito(numero);
    mostrarAviso("Pokémon removido dos favoritos.");
  } catch (erro) {
    console.error(erro);
    mostrarAviso("Não foi possível remover. Tente novamente.");
  }
  exibirFavoritos();
};

// Disparar busca manual ao clicar no ícone de busca
botaoBuscar.addEventListener("click", () => {
  const termo = campoBusca.value;
  buscarPokemon(termo);
});

// Disparar busca aleatória (Sorteia um ID de 1 a 151 para garantia total de retorno válido na API)
botaoAleatorio.addEventListener("click", () => {
  const idAleatorio = sortearId(151);
  buscarPokemon(idAleatorio);
});

// Disparar exibição de favoritos ao clicar no botão Meus Favoritos
botaoFavoritos.addEventListener("click", () => {
  exibirFavoritos();
});

// Disparar busca ao pressionar "Enter" no teclado
campoBusca.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    botaoBuscar.click();
  }
});

// Ao abrir a página, carrega os números favoritados para as estrelas já aparecerem certas
obterFavoritos().catch(() => {});
