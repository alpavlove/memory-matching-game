import { appDataSource } from '../data-source'
import { Player } from '../entities/player.entity'

export const playerRepository = appDataSource.getRepository(Player)
