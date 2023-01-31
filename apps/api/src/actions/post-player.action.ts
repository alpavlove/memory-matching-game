import { Request, Response } from 'express'
import { playerRepository } from '../repositories/player.repository'
import { Player } from '../entities/player.entity'

export async function postPlayerAction(request: Request, response: Response) {
  const { name, score } = request.body

  const player = new Player()
  player.name = name
  player.score = score

  const data = await playerRepository.save(player)

  response.send({ data })
}
