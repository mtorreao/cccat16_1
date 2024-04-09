import AccountDAO from "../../resource/AccountDAO";


export default class GetAccountById {
    constructor(readonly accountDao: AccountDAO) { }

    async execute(accountId: string): Promise<any> {
        return await this.accountDao.findAccountById(accountId);
    }
}