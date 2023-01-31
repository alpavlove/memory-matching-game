import React from 'react'
import { useNavigate } from 'react-router-dom'
import classNames from 'classnames'
import { usePlayersContext } from '../../hooks/players'

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 50 50"
      className="w-auto h-full fill-white relative left-[-14px]"
    >
      <path d="M 21 2 C 19.354545 2 18 3.3545455 18 5 L 18 7 L 10.154297 7 A 1.0001 1.0001 0 0 0 9.984375 6.9863281 A 1.0001 1.0001 0 0 0 9.8398438 7 L 8 7 A 1.0001 1.0001 0 1 0 8 9 L 9 9 L 9 45 C 9 46.645455 10.354545 48 12 48 L 38 48 C 39.645455 48 41 46.645455 41 45 L 41 9 L 42 9 A 1.0001 1.0001 0 1 0 42 7 L 40.167969 7 A 1.0001 1.0001 0 0 0 39.841797 7 L 32 7 L 32 5 C 32 3.3545455 30.645455 2 29 2 L 21 2 z M 21 4 L 29 4 C 29.554545 4 30 4.4454545 30 5 L 30 7 L 20 7 L 20 5 C 20 4.4454545 20.445455 4 21 4 z M 11 9 L 18.832031 9 A 1.0001 1.0001 0 0 0 19.158203 9 L 30.832031 9 A 1.0001 1.0001 0 0 0 31.158203 9 L 39 9 L 39 45 C 39 45.554545 38.554545 46 38 46 L 12 46 C 11.445455 46 11 45.554545 11 45 L 11 9 z M 18.984375 13.986328 A 1.0001 1.0001 0 0 0 18 15 L 18 40 A 1.0001 1.0001 0 1 0 20 40 L 20 15 A 1.0001 1.0001 0 0 0 18.984375 13.986328 z M 24.984375 13.986328 A 1.0001 1.0001 0 0 0 24 15 L 24 40 A 1.0001 1.0001 0 1 0 26 40 L 26 15 A 1.0001 1.0001 0 0 0 24.984375 13.986328 z M 30.984375 13.986328 A 1.0001 1.0001 0 0 0 30 15 L 30 40 A 1.0001 1.0001 0 1 0 32 40 L 32 15 A 1.0001 1.0001 0 0 0 30.984375 13.986328 z" />
    </svg>
  )
}

export function SignUp() {
  const navigate = useNavigate()
  const { players, setPlayerName, addPlayer, removePlayer } = usePlayersContext()
  const [validationErrors, setValidationErrors] = React.useState<number[]>([])

  function startGame() {
    const namesWithValidationError = players
      .filter((player) => player.name.trim() === '')
      .map((player) => player.id)
    setValidationErrors(namesWithValidationError)

    if (namesWithValidationError.length > 0) {
      return
    }

    navigate('/game')
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold text-center my-4">Welcome to the Memory Matching Game</h1>

      <div className="max-w-md min-w-max bg-white p-6 rounded-lg shadow-md">
        {players.map((player, index) => (
          <div key={player.id}>
            <label htmlFor="playerName" className="block text-gray-700 font-medium mb-1">
              Enter the player name
            </label>
            <div className="flex justify-between">
              <input
                type="text"
                id="playerName"
                value={player.name}
                onChange={(e) => setPlayerName(e.target.value, player.id)}
                className={classNames('border border-gray-400 p-2 rounded-lg w-4/5', {
                  'border-red-500': validationErrors.includes(player.id),
                })}
              />
              {index > 0 && (
                <button
                  type="button"
                  className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                  onClick={() => removePlayer(player.id)}
                >
                  <TrashIcon />
                </button>
              )}
            </div>
          </div>
        ))}
        <div className="flex justify-between">
          <button
            type="button"
            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 mt-3"
            onClick={addPlayer}
          >
            Add a player
          </button>

          <button
            type="button"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 mt-3"
            onClick={startGame}
          >
            Start
          </button>
        </div>
      </div>
    </div>
  )
}
