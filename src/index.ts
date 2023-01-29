import express from 'express'
import dotenv from 'dotenv'
import { IndexService } from './Service/indexer'
import { AppDataSource } from './Database/data-source'

dotenv.config()

const app = express()
const port: number = process.env.PORT as unknown as number || 3000

const indexer = new IndexService()

app.listen(port, async (): Promise<void> => {
    await AppDataSource.initialize()
        .then(() => {
            console.log('DB connection established')
        })
        .catch((error) => console.log(error))

    indexer.initiateService()
    console.log(`Server listening on port ${port}`)
})