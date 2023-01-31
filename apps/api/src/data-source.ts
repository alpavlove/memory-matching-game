import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { Player } from './entities/player.entity'

export const appDataSource = new DataSource({
  type: 'sqlite',
  database: './db.sqlite',
  entities: [Player],
  synchronize: true,
})
