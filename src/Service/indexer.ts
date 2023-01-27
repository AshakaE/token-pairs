import { AppDataSource } from '../Database/data-source'
import { TokenPair } from '../Database/entities/tokenPair.entity'
import { request, gql } from 'graphql-request'

export type Pairs = {
    id: string
    token0: {
        id: string
    }
    token1: {
        id: string
    }
}

const query = gql`
    query ($unixtime: String) {
        pairs(
            orderDirection: asc
            orderBy: createdAtTimestamp
            where: {
                createdAtTimestamp_gt: $unixtime
            }
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

    public async storeTokenPairs() {
        try {
            const pairs =  await this.getPairs()
            console.log(pairs)
            // const check = await tokenPairRepository.findBy({ id: '' })
            console.log(1)
        } catch (err) {
            console.log(err)
        }
    }

    public async getPairs(): Promise<[Pairs]> {
        const unixtime = await this.getLastPublishedTime()
        let response: [Pairs]
        try {
            response = await request(this.url, query, { unixtime })
        } catch (err: any) {
            console.error('Request to graph error!', err.message)
        }
        return response
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
        const t = lastTokenPair[0]?.publishTime ? lastTokenPair[0]?.publishTime : `${newTime}`
        return t
    }

    // public async getTime(): Promise<string> {
    //     const existTime = await this.getLastPublishedTime()
    //     const newTime = Math.floor(new Date().getTime() / 1000) - 86400
    //     return existTime || `${newTime}`
    // }
}
