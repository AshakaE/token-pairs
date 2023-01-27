import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class TokenPair {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column()
    pair: string

    @Column()
    token0: string

    @Column()
    token1: string

    @Column()
    publishTime: number
}
