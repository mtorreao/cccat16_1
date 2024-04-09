import axios, { AxiosError } from "axios";

axios.defaults.validateStatus = function () {
	return true;
}

axios.defaults.timeout = 100000;

test("Deve criar uma conta para o passageiro", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
	const output = await axios.post("http://localhost:3000/signup", input);
	expect(output.status).toBe(200);
	expect(output.data).toHaveProperty("accountId");
	const output2 = await axios.get(`http://localhost:3000/${output.data.accountId}`);
	expect(output2.status).toBe(200);
	expect(output2.data).toMatchObject({
		name: input.name,
		email: input.email,
		cpf: input.cpf,
		is_passenger: true,
		is_driver: false
	});
});

test("Deve retornar UnprocessableEntity quando o nome for inválido", async function () {
	const input = {
		name: "",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
	const response = await axios.post("http://localhost:3000/signup", input);
	expect(response.status).toBe(422);
	expect(response.data).toBe(-3)
});

test("Deve retornar 'Invalid cpf' quando o cpf for inválido", async function () {
	const input = {
		name: "Abc def",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "",
		isPassenger: true
	};
	const response = await axios.post("http://localhost:3000/signup", input);
	expect(response?.status).toBe(422);
	expect(response?.data).toBe(-1)
});

test("Deve retornar 'Invalid email' quando o email for inválido", async function () {
	const input = {
		name: "Abc def",
		email: '',
		cpf: "87748248800",
		isPassenger: true
	};
	const response = await axios.post("http://localhost:3000/signup", input);
	expect(response?.status).toBe(422);
	expect(response?.data).toBe(-2)
});

test("Deve retornar 'Invalid car plate' quando o for um motorista e a placa do carro for inválida", async function () {
	const input = {
		name: "Abc def",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isDriver: true,
		carPlate: ''
	};
	const response = await axios.post("http://localhost:3000/signup", input);
	expect(response?.status).toBe(422);
	expect(response?.data).toBe(-5)
});

test("Deve retornar 'Email already exists' quando tentar criar um usuário que já tem email cadastrado", async function () {
	const input = {
		name: "Abc def",
		email: `alex@a.com`,
		cpf: "87748248800",
	};
	const response = await axios.post("http://localhost:3000/signup", input);
	expect(response?.status).toBe(422);
	expect(response?.data).toBe(-4)
});

