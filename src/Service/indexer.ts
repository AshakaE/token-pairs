import { AppDataSource } from '../Database/data-source'
import { TokenPair } from '../Database/entities/tokenPair.entity'

export class StoreTokenPair {
    constructor() {}

    public async storeTokenPairs() {
        const tokenPairRepository = AppDataSource.getRepository(TokenPair)
        try {
            // const check = await tokenPairRepository.findBy({ id: '' })
            console.log(1)
        } catch (err) {
            console.log(err)
        }
    }

    public async getPairs(): Promise<[]> {
        
        return []
    }
}
