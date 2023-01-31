import { Request, Response } from 'express'
import { playerRepository } from '../repositories/player.repository'

export async function getAllPlayersAction(request: Request, response: Response) {
  const data = await playerRepository.find()
  response.send({ data })
}
