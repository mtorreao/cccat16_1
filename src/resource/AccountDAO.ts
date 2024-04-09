import pgPromise from "pg-promise";


export default class AccountDAO {
    pgp = pgPromise();

    async createAccount(input: any): Promise<void> {
        const connection = this.openConnection();
        try {
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
                )`,
                [input.accountId, input.name, input.email, input.cpf, input.carPlate, !!input.isPassenger, !!input.isDriver]);
        } finally {
            await connection.$pool.end();
        }
    }

    async findAccountByEmail(email: string): Promise<any> {
        const connection = this.openConnection();
        try {
            return await connection.oneOrNone("select * from cccat16.account where email = $1", [email]);
        } finally {
            await connection.$pool.end();
        }
    }

    async findAccountById(accountId: string): Promise<any> {
        const connection = this.openConnection();
        try {
            return await connection.oneOrNone("select * from cccat16.account where account_id = $1", [accountId]);
        } finally {
            await connection.$pool.end();
        }
    }

    private openConnection() {
        return this.pgp("postgres://postgres:example@localhost:5432/app");
    }
}



