import crypto from "crypto";
import express from "express";
import pgp from "pg-promise";
import { validate } from "./validators/validateCpf";
import pg from "pg-promise/typescript/pg-subset";
import validateName from "./validators/validateName";
import validateEmail from "./validators/validateEmail";
import { UnprocessableEntityError } from "./UnprocessableEntityError";
import validateCarPlate from "./validators/validateCarPlate";
const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
	const connection = pgp()("postgres://postgres:example@localhost:5432/app");
	try {
		validateBody(req.body)
		await validadeIfEmailAlreadyExists(req.body.email, connection);
		const { accountId } = await createAccount(req.body, connection);
		res.json({
			accountId
		});
	} catch (err) {
		if (err instanceof UnprocessableEntityError) {
			res.status(422).send(err.code.toString());
		} else {
			throw err;
		}
	} finally {
		await connection.$pool.end();
	}
});

app.get("/:id", async function (req, res) {
	const connection = pgp()("postgres://postgres:example@localhost:5432/app");
	try {
		const account = await connection.oneOrNone("select * from cccat16.account where account_id = $1", [req.params.id]);
		if (!account) {
			res.status(404).send("Account not found");
			return;
		}

		res.status(200).json(account);
	} finally {
		await connection.$pool.end();
	}
});

async function createAccount(input: { name: string, email: string, cpf: string, carPlate: string, isPassenger: boolean, isDriver: boolean }, connection: pgp.IDatabase<{}, pg.IClient>): Promise<{ accountId: string }> {
	const id = crypto.randomUUID();
	await connection.query(`
	insert into cccat16.account 
	(
		account_id, 
		name, 
		email, 
		cpf, 
		car_plate, 
		is_passenger, 
		is_driver
	) 
	values 
	(
		$1, 
		$2, 
		$3, 
		$4, 
		$5, 
		$6, 
		$7
	)`, [id, input.name, input.email, input.cpf, input.carPlate, !!input.isPassenger, !!input.isDriver]);

	return {
		accountId: id
	}
}

function validateBody({ email, name, cpf, carPlate, isDriver }: { email: string, name: string, cpf: string, carPlate: string, isDriver: boolean }) {
	if (!validateEmail(email)) {
		throw new UnprocessableEntityError("Invalid email", -2);
	}
	if (!validateName(name)) {
		throw new UnprocessableEntityError("Invalid name", -3);
	}
	if (!validate(cpf)) {
		throw new UnprocessableEntityError("Invalid cpf", -1);
	}
	if (isDriver && !validateCarPlate(carPlate)) {
		throw new UnprocessableEntityError("Invalid car plate", -5);
	}
}

async function validadeIfEmailAlreadyExists(email: string, connection: pgp.IDatabase<{}, pg.IClient>): Promise<void> {
	const result = await connection.oneOrNone("select count(account_id) from cccat16.account where email = $1", [email]);
	if (result.count > 0) {
		throw new UnprocessableEntityError("Email already exists", -4);
	}
}

app.listen(3000);
