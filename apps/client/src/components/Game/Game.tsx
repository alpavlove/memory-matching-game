import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameContext } from '../../hooks/game'
import { Card } from '../Card/Card'
import { getCardKey } from '../../utils'
import { usePlayersContext } from '../../hooks/players'

export function Game() {
  const navigate = useNavigate()
  const { cards, isGameOver, isCardVisible, turns, handleCardClick, startNewGame } =
    useGameContext()
  const { players, currentPlayerIndex } = usePlayersContext()

  const isMultiplayer = players.length > 1

  useEffect(() => {
    if (players.length === 1 && players[0].name === '') {
      navigate('/', { replace: true })
    }
  }, [navigate, players])

  return (
    <div className="flex flex-col items-center bg-gray-200 h-full">
      <h1 className="text-2xl font-bold text-center my-4">Memory Matching Game</h1>

      <div className="grid grid-cols-4 grid-rows-4 gap-2">
        {cards.map((card) => (
          <Card
            key={getCardKey(card)}
            emoji={card.emoji}
            isVisible={isCardVisible(card)}
            isGameOver={isGameOver}
            handleCardClick={() => handleCardClick(card)}
          />
        ))}
      </div>

      <div className="text-center my-4">
        <p className="text-lg font-bold mb-2">
          {isMultiplayer ? (
            <>Current player: {players[currentPlayerIndex].name}</>
          ) : (
            <>Turns: {turns}</>
          )}
        </p>

        {isMultiplayer && (
          <table className="table-auto text-lg">
            <thead>
              <tr>
                <th className="text-left p-2">Score</th>
                <th className="text-left p-2"></th>
              </tr>
            </thead>

            <tbody>
              {players.map((player) => (
                <tr key={player.id}>
                  <td className="text-left">{player.name}</td>
                  <td>{Object.keys(player.matches).length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {isGameOver && isMultiplayer && (
          <div className="text-center mt-4">
            <p className="text-xl font-bold mb-2">Game Over!</p>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
              onClick={startNewGame}
            >
              Start new game
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
