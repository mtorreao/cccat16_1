import AccountDAO from "../../resource/AccountDAO";
import { ValidationError } from "../error/ValidationError";
import validateCarPlate from "../validator/validateCarPlate";
import { validateCpf } from "../validator/validateCpf";
import validateEmail from "../validator/validateEmail";
import validateName from "../validator/validateName";

export default class CreateAccount {
    constructor(readonly accountDao: AccountDAO) {}
    async execute(input: any): Promise<{ accountId: string }> {
        this.validate(input);
        await this.validadeIfEmailAlreadyExists(input.email);
        const accountId = crypto.randomUUID();
        await this.accountDao.createAccount({ accountId, ...input });
        return { accountId };
    }

    private validate({ email, name, cpf, carPlate, isDriver, isPassenger }: { email: string, name: string, cpf: string, carPlate: string, isDriver: boolean, isPassenger: boolean }) {
        if (!validateEmail(email)) {
            throw new ValidationError("Invalid email", -2);
        }
        if (!validateName(name)) {
            throw new ValidationError("Invalid name", -3);
        }
        if (!validateCpf(cpf)) {
            throw new ValidationError("Invalid cpf", -1);
        }
        if (isDriver && !validateCarPlate(carPlate)) {
            throw new ValidationError("Invalid car plate", -5);
        }
        if (!isDriver && !isPassenger) {
            throw new ValidationError("IsPassenger is required", -6);
        }
    }

    private async validadeIfEmailAlreadyExists(email: string): Promise<void> {
        const account = await this.accountDao.findAccountByEmail(email);
        if (account) {
            throw new ValidationError("Email already exists", -4);
        }
    }

}