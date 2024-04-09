import 'dotenv/config';
import express from "express";
import { ValidationError } from '../application/error/ValidationError';
import CreateAccount from '../application/usecase/CreateAccount';
import AccountDAO from '../resource/AccountDAO';
import GetAccountById from '../application/usecase/GetAccountById';
const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
	try {
		const dao = new AccountDAO();
		const createAccount = new CreateAccount(dao);
		const account = await createAccount.execute(req.body);
		res.json({
			accountId: account.accountId
		});
	} catch (err) {
		if (err instanceof ValidationError) {
			res.status(422).json({
				message: err.message,
				code: err.code
			});
		} else {
			throw err;
		}
	}
});

app.get("/:id", async function (req, res) {
	const dao = new AccountDAO();
	const getAccountById = new GetAccountById(dao);
	const account = await getAccountById.execute(req.params.id);
	if (!account) {
		res.status(404).send("Account not found");
		return;
	}
	res.status(200).json(account);
});

app.listen(process.env.PORT || 3000, function () {
	console.log(`Server listening on port ${process.env.PORT || 3000}!`);
});
