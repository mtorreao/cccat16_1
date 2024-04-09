import axios from "axios";
import 'dotenv/config';

axios.defaults.validateStatus = function () {
	return true;
}

const BASE_URL =`http://localhost:${process.env.PORT || 3000}`;

test("Deve criar uma conta para o passageiro", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
	const output = await axios.post(`${BASE_URL}/signup`, input);
	expect(output.status).toBe(200);
	expect(output.data).toHaveProperty("accountId");
	const output2 = await axios.get(`${BASE_URL}/${output.data.accountId}`);
	expect(output2.status).toBe(200);
	expect(output2.data).toMatchObject({
		name: input.name,
		email: input.email,
		cpf: input.cpf,
		is_passenger: true,
		is_driver: false
	});
});

test("Deve criar uma conta para o motorista", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: false,
		isDriver: true,
		carPlate: "ABC1234"
	};
	const output = await axios.post(`${BASE_URL}/signup`, input);
	expect(output.status).toBe(200);
	expect(output.data).toHaveProperty("accountId");
	const output2 = await axios.get(`${BASE_URL}/${output.data.accountId}`);
	expect(output2.status).toBe(200);
	expect(output2.data).toMatchObject({
		name: input.name,
		email: input.email,
		cpf: input.cpf,
		car_plate: input.carPlate,
		is_passenger: false,
		is_driver: true
	});
});

test("Deve retornar 'Invalid cpf' quando o cpf for inválido", async function () {
	const input = {
		name: "Abc def",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "",
		isPassenger: true
	};
	const response = await axios.post(`${BASE_URL}/signup`, input);
	expect(response?.status).toBe(422);
	expect(response?.data?.code).toBe(-1)
});

test("Deve retornar 'Invalid email' quando o email for inválido", async function () {
	const input = {
		name: "Abc def",
		email: '',
		cpf: "87748248800",
		isPassenger: true
	};
	const response = await axios.post(`${BASE_URL}/signup`, input);
	expect(response?.status).toBe(422);
	expect(response?.data?.code).toBe(-2)
});

test("Deve retornar 'Invalid name' quando o nome for inválido", async function () {
	const input = {
		name: "",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
	const response = await axios.post(`${BASE_URL}/signup`, input);
	expect(response.status).toBe(422);
	expect(response.data?.code).toBe(-3)
});

test("Deve retornar 'Email already exists' quando tentar criar um usuário que já tem email cadastrado", async function () {
	const input = {
		name: "Abc def",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
	await axios.post(`${BASE_URL}/signup`, input);
	const response = await axios.post(`${BASE_URL}/signup`, input);
	expect(response?.status).toBe(422);
	expect(response?.data?.code).toBe(-4)
});


test("Deve retornar 'Invalid car plate' quando o for um motorista e a placa do carro for inválida", async function () {
	const input = {
		name: "Abc def",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isDriver: true,
		carPlate: ''
	};
	const response = await axios.post(`${BASE_URL}/signup`, input);
	expect(response?.status).toBe(422);
	expect(response?.data?.code).toBe(-5)
});

test("Deve retornar 'Account not found' quando não existir um uma conta que esteja sendo buscada", async function () {
	const accountId = crypto.randomUUID();
	const response = await axios.get(`${BASE_URL}/${accountId}`);
	expect(response?.status).toBe(404);
	expect(response?.data).toBe('Account not found')
});

test("Deve retornar uma conta quando for buscada por id", async function () {
	const input = {
		name: "Abc def",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
	const signupResponse = await axios.post(`${BASE_URL}/signup`, input);
	const getByIdResponse = await axios.get(`${BASE_URL}/${signupResponse.data.accountId}`);
	expect(getByIdResponse?.status).toBe(200);
	expect(getByIdResponse?.data).toMatchObject({
		name: input.name,
		email: input.email,
		cpf: input.cpf,
		is_passenger: true,
		is_driver: false
	});
});


