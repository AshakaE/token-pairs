import { AppDataSource } from '../Database/data-source'
import { TokenPair } from '../Database/entities/tokenPair.entity'
import { request, gql } from 'graphql-request'

export interface Pairs {
    id: string
    token0: {
        id: string
    }
    token1: {
        id: string
    }
    createdAtTimestamp: string
}

const query = gql`
    query ($unixtime: String) {
        pairs(
            orderDirection: asc
            orderBy: createdAtTimestamp
            where: { createdAtTimestamp_gt: $unixtime }
        ) {
            id
            token0 {
                id
            }
            token1 {
                id
            }
            createdAtTimestamp
        }
    }
`

export class StoreTokenPair {
    url: string
    constructor() {
        this.url = process.env.REQUEST_URL
    }

    public async storeTokenPairs(pairs: Pairs[], loop: boolean): Promise<void> {
        const tokenPairRepository = AppDataSource.getRepository(TokenPair)
        if (pairs.length === 0) {
            await new Promise((r) => setTimeout(r, 10000))
            console.log(`Checking for new swaps`)
            const c = await this.getPairs()
            await this.storeTokenPairs(c, true)
        }
        try {
            for (const pair of pairs) {
                const newPair = tokenPairRepository.create({
                    pair: pair.id,
                    token0: pair.token0.id,
                    token1: pair.token1.id,
                    publishTime: pair.createdAtTimestamp,
                })
                await tokenPairRepository.save(newPair)
                await new Promise((r) => setTimeout(r, 2000))
                console.log(`Storing pair ${pair.id}`)
            }
        } catch (err) {
            console.log(err)
        }
        if(loop){
            const c = await this.getPairs()
            await this.storeTokenPairs(c, true)
        }
    }

    public async getPairs(): Promise<any> {
        const unixtime = await this.getLastPublishedTime()
        let response: any
        try {
            response = await request(this.url, query, { unixtime })
            console.log(response)
        } catch (err: any) {
            console.error('Request to graph error!', err.message)
        }

        return response?.pairs
    }

    public async getLastPublishedTime(): Promise<string | undefined> {
        const tokenPairRepository = AppDataSource.getRepository(TokenPair)

        const lastTokenPair = await tokenPairRepository.find({
            order: {
                created: 'DESC',
            },
            take: 1,
        })

        // const existTime = await this.getLastPublishedTime()
        const newTime = Math.floor(new Date().getTime() / 1000) - 86400
        // return existTime || `${newTime}`
        const t = lastTokenPair[0]?.publishTime
            ? lastTokenPair[0]?.publishTime
            : `${newTime}`
        return t
    }

    // public async getTime(): Promise<string> {
    //     const existTime = await this.getLastPublishedTime()
    //     const newTime = Math.floor(new Date().getTime() / 1000) - 86400
    //     return existTime || `${newTime}`
    // }

    public async dbstore(): Promise<any> {
        const pairs  = await this.getPairs()
        return this.storeTokenPairs(pairs, true)
    }
}
