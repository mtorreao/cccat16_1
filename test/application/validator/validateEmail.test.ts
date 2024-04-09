import validateEmail from "../../../src/application/validator/validateEmail";

test("Deve retornar true para um email válido", function () {
	const email = "test@example.com";
	const isValid = validateEmail(email);
	expect(isValid).toBe(true);
});

test("Deve retornar false para um email inválido", function () {
	const email = "invalidemail";
	const isValid = validateEmail(email);
	expect(isValid).toBe(false);
});

test("Deve retornar false para um email sem o domínio", function () {
	const email = "test@";
	const isValid = validateEmail(email);
	expect(isValid).toBe(false);
});

test("Deve retornar false para um email sem o nome de usuário", function () {
	const email = "@example.com";
	const isValid = validateEmail(email);
	expect(isValid).toBe(false);
});