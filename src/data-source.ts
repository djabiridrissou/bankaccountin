import "reflect-metadata"
import { DataSource } from "typeorm"
import Env from "./conf/config"
import { AccountSchema } from "./entity/Account.entity"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: Env.host,
    port: Env.port,
    username: Env.username,
    password: Env.password,
    database: Env.database,
    synchronize: true,
    logging: true,
    entities: [AccountSchema],
    migrations: [],
    subscribers: [],
})