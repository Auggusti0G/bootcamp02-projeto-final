// =============================================================
// utils.js — funções puras da Pokédex
// "Puras" = recebem um valor e devolvem outro, sem mexer na tela,
// sem chamar API e sem banco. Por isso são fáceis de testar com Jest.
// O mesmo arquivo roda no navegador (index.html) e no Node (testes).
// =============================================================

// Aceita só nome ou número válidos para a PokeAPI (letras, números e hífen).
// Exemplos válidos: "pikachu", "25", "mr-mime". Inválidos: "", "   ", "pika chu", "<script>".
function validarEntrada(termo) {
  if (termo === null || termo === undefined) return false;
  const texto = String(termo).trim();
  if (texto === "") return false;
  return /^[a-zA-Z0-9-]+$/.test(texto);
}

// "pikachu" -> "Pikachu" | "MEWTWO" -> "Mewtwo"
function formatarNome(nome) {
  if (!nome) return "";
  const texto = String(nome).trim().toLowerCase();
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

// 25 -> "025" | 150 -> "150"
function formatarId(id) {
  return String(id).padStart(3, "0");
}

// A PokeAPI devolve altura em decímetros: 4 -> "0.4" (metros)
function converterAltura(decimetros) {
  return (Number(decimetros) / 10).toFixed(1);
}

// A PokeAPI devolve peso em hectogramas: 60 -> "6.0" (quilos)
function converterPeso(hectogramas) {
  return (Number(hectogramas) / 10).toFixed(1);
}

// Sorteia um número de 1 até "maximo" (151 = primeira geração).
// "aleatorio" pode ser trocado nos testes para o resultado ser previsível.
function sortearId(maximo = 151, aleatorio = Math.random) {
  return Math.floor(aleatorio() * maximo) + 1;
}

// Exporta para o Jest (Node). No navegador "module" não existe e esta parte é ignorada.
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    validarEntrada,
    formatarNome,
    formatarId,
    converterAltura,
    converterPeso,
    sortearId,
  };
}
