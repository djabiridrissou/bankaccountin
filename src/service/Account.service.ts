import { Repository } from "typeorm";
import * as XLSX from 'xlsx';
import { AppDataSource } from "../data-source";
import { Account } from "../entity/Account.entity";

export class AccountService {

    private readonly repository: Repository<Account>

    constructor() {
        this.repository = AppDataSource.getRepository(Account)
    }

    public async loadById(id: number) {
        return await this.repository.createQueryBuilder("account")
            .where("account.id = :id", { id: id })
            .getOne();
    }


    public async loadAll() {
        return await this.repository.createQueryBuilder("h2h")
            .getMany();
    }

    private async createAccount(account: Account): Promise<Account> {
        const accountExist = await this.repository.createQueryBuilder("account")
            .where("account.name = :name", { name: account.name })
            .andWhere("account.owner = :owner", { time: account.owner })
            .andWhere("account.created_at = :created_at", { created_at: account.created_at })
            .andWhere("account.bank = :bank", { bank: account.bank})
            .getOne();

        if (accountExist) {
            throw new Error("Unable to create account, account already exist");
        }
        return await this.repository.save(account);
    }

    public async createAccountFromXLSX(filePath: string): Promise<Account[]> {

        const workbook = XLSX.readFile(filePath);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(worksheet, { raw: true });
        let accountCreated: Account[] = [];

        let row: any;
        for (row of rows) {
            try {

                const account = new Account();

                const created_at = new Date();

                account.name = row.name;
                account.bank = row.bank;
                account.owner = row.owner;
                account.created_at = created_at;

                const data = await this.createAccount(account);
                accountCreated.push(data);
            } catch (error) {
                console.log(error);
            }
        }
        return accountCreated;
    }
}