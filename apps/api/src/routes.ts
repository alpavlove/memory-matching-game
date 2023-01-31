import { getAllPlayersAction } from './actions/get-all-players.action'
import { getTopPlayersAction } from './actions/get-top-players.action'
import { postPlayerAction } from './actions/post-player.action'

export const appRoutes = [
  {
    path: '/players',
    method: 'get',
    action: getAllPlayersAction,
  },
  {
    path: '/players/top',
    method: 'get',
    action: getTopPlayersAction,
  },
  {
    path: '/players',
    method: 'post',
    action: postPlayerAction,
  },
]
