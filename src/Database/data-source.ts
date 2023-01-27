import { DataSource } from 'typeorm'
import dotenv from 'dotenv'
import { TokenPair } from './entities/tokenPair.entity'
dotenv.config()


export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: 5432,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE_NAME,
    synchronize: true,
    logging: true,
    entities: [TokenPair],
    subscribers: [],
    migrations: [],
})
