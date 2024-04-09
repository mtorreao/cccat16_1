import validateName from "../../../src/application/validator/validateName";

test("Deve retornar true para um nome válido", function () {
	const name = "John Doe";
	const result = validateName(name);
	expect(result).toBe(true);
});

test("Deve retornar false para um nome inválido", function () {
	const name = "123";
	const result = validateName(name);
	expect(result).toBe(false);
});