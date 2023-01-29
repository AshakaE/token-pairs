import { request, gql } from 'graphql-request'

export interface Pair {
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

export class GraphService {
    url: string
    constructor() {
        this.url = process.env.REQUEST_URL
    }

     async getPairs(unixtime: string): Promise<[Pair]> {
        let response: { pairs: [Pair] }
        try {
            response = await request(this.url, query, { unixtime })
        } catch (err: any) {
            console.error('Request to graph error!', err.message)
        }

        return response?.pairs
    }
}
