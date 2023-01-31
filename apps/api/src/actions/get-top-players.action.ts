import { Request, Response } from 'express'
import { playerRepository } from '../repositories/player.repository'

export async function getTopPlayersAction(request: Request, response: Response) {
  const data = await playerRepository
    .createQueryBuilder('player')
    .orderBy('player.score', 'ASC')
    .take(10)
    .getMany()

  response.send({ data })
}
