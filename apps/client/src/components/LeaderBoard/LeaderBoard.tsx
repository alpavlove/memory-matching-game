import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTopPlayers } from '../../hooks/api'
import { useGameContext } from '../../hooks/game'

export function LeaderBoard() {
  const players = useTopPlayers()
  const { startNewGame } = useGameContext()
  const navigate = useNavigate()

  const onStartNewGame = () => {
    startNewGame()
    navigate('/game')
  }

  return (
    <div className="flex flex-col items-center bg-gray-200 h-full">
      <h1 className="text-2xl font-bold text-center my-4">Leaderboard</h1>

      <table className="table-auto text-lg">
        <thead>
          <tr>
            <th className="text-left p-2">Rank</th>
            <th className="text-left p-2">Name</th>
            <th className="text-right p-2">Turns</th>
          </tr>
        </thead>

        <tbody>
          {players.map((player, index) => (
            <tr key={player.id}>
              <td className="text-left p-2">{index + 1}</td>
              <td className="text-left p-2">{player.name}</td>
              <td className="text-right p-2">{player.score}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-center mt-4">
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          onClick={onStartNewGame}
        >
          Start new game
        </button>
      </div>
    </div>
  )
}
