import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Player {
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  name: string
  @Column()
  score: number
}
