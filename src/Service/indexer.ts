import { AppDataSource } from './../Database/data-source';
import { TokenPair } from '../Database/entities/tokenPair.entity'
import { GraphService, Pair } from './graph'

const WAIT_DB_INDEX = 3000
const WAIT_REQUEST = 1000 * 60 * 30

export class IndexService {
    graphService: GraphService

    constructor() {
        this.graphService = new GraphService()
    }

    async initiateService(): Promise<void> {
        const unxitime = await this.getLastPublishedTime()
        const pairs = await this.graphService.getPairs(unxitime)
        return this.storeTokenPairs(pairs, true)
    }

    async getLastPublishedTime(): Promise<string> {
        const tokenPairRepository = AppDataSource.getRepository(TokenPair)

        const lastTokenPair = await tokenPairRepository.find({
            order: {
                created: 'DESC',
            },
            take: 1,
        })

        const newTime = Math.floor(new Date().getTime() / 1000) - 86400
        const t = lastTokenPair[0]?.publishTime
            ? lastTokenPair[0]?.publishTime
            : `${newTime}`
        return t
    }

    async storeTokenPairs(pairs: Pair[], loop: boolean): Promise<void> {
        let unxitime: string

        if (pairs.length === 0) {
            await new Promise((r) => setTimeout(r, WAIT_REQUEST))
            console.log(`🦄 Checking for new swaps`)
            unxitime = await this.getLastPublishedTime()
            const newPairs = await this.graphService.getPairs(unxitime)
            await this.storeTokenPairs(newPairs, true)
        }
        try {
            for (const pair of pairs) {
                await this.dbStore(pair)
                await new Promise((r) => setTimeout(r, WAIT_DB_INDEX))
                console.log(`Storing pair ${pair.id} 🔗`)
            }
        } catch (err) {
            console.log(err)
        }
        if (loop) {
            unxitime = await this.getLastPublishedTime()
            const newPairs = await this.graphService.getPairs(unxitime)
            await this.storeTokenPairs(newPairs, true)
        }
    }

    async dbStore(pair: Pair): Promise<void> {
        const tokenPairRepository = AppDataSource.getRepository(TokenPair)
        const newPair = tokenPairRepository.create({
            pair: pair.id,
            token0: pair.token0.id,
            token1: pair.token1.id,
            publishTime: pair.createdAtTimestamp,
        })
        await tokenPairRepository.save(newPair)
    }
}
