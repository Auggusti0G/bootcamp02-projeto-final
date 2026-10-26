const {
  validarEntrada,
  formatarNome,
  formatarId,
  converterAltura,
  converterPeso,
  sortearId,
} = require("./utils");

describe("validarEntrada", () => {
  test("rejeita entrada vazia ou só com espaços", () => {
    expect(validarEntrada("")).toBe(false);
    expect(validarEntrada("   ")).toBe(false);
    expect(validarEntrada(null)).toBe(false);
  });

  test("aceita nome ou número válidos", () => {
    expect(validarEntrada("pikachu")).toBe(true);
    expect(validarEntrada("25")).toBe(true);
    expect(validarEntrada("mr-mime")).toBe(true);
  });

  test("rejeita caracteres especiais", () => {
    expect(validarEntrada("pika chu")).toBe(false);
    expect(validarEntrada("<script>")).toBe(false);
  });
});

describe("formatação", () => {
  test("formata nome com inicial maiúscula", () => {
    expect(formatarNome("pikachu")).toBe("Pikachu");
    expect(formatarNome("MEWTWO")).toBe("Mewtwo");
  });

  test("formata id com 3 dígitos", () => {
    expect(formatarId(25)).toBe("025");
    expect(formatarId(150)).toBe("150");
  });

  test("converte altura (dm) e peso (hg) da PokeAPI", () => {
    expect(converterAltura(4)).toBe("0.4");
    expect(converterPeso(60)).toBe("6.0");
  });
});

describe("sortearId", () => {
  test("fica sempre entre 1 e 151", () => {
    expect(sortearId(151, () => 0)).toBe(1);
    expect(sortearId(151, () => 0.9999)).toBe(151);
  });
});

describe("teste de fogo", () => {
  test("formata o nome do Bulbasaur", () => {
    expect(formatarNome("bulbasaur")).toBe("Bulbasaur");
  });
});
