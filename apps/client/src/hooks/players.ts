import { useCallback, useState } from 'react'
import { Card, Player } from '../types'
import constate from 'constate'

function useCurrentPlayerIndex(numberOfPlayers: number) {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)

  function nextPlayer() {
    setCurrentPlayerIndex(currentPlayerIndex === numberOfPlayers - 1 ? 0 : currentPlayerIndex + 1)
  }

  return { currentPlayerIndex, nextPlayer, setCurrentPlayerIndex }
}

export function usePlayers() {
  const [players, setPlayers] = useState<Player[]>([{ id: 1, name: '', matches: {} }])
  const { currentPlayerIndex, setCurrentPlayerIndex, nextPlayer } = useCurrentPlayerIndex(
    players.length,
  )

  function addPlayer() {
    setPlayers((currentPlayers) => [
      ...currentPlayers,
      { id: currentPlayers.length + 1, name: '', matches: {} },
    ])
  }

  function removePlayer(id: number) {
    setPlayers((currentPlayers) => currentPlayers.filter((player) => player.id !== id))
  }

  function setPlayerName(newName: string, playerId: number) {
    setPlayers((currentPlayers) => {
      const playerIndex = currentPlayers.findIndex((player) => player.id === playerId)

      return [
        ...currentPlayers.slice(0, playerIndex),
        { ...currentPlayers[playerIndex], name: newName },
        ...currentPlayers.slice(playerIndex + 1),
      ]
    })
  }

  function addPlayerMatch(card: Card) {
    setPlayers(
      players.map((player, index) =>
        index === currentPlayerIndex
          ? { ...player, matches: { ...player.matches, [card.id]: true } }
          : player,
      ),
    )
  }

  const resetPlayersMatches = useCallback(() => {
    setPlayers(players.map((player) => ({ ...player, matches: {} })))
  }, [players])

  return {
    players,
    addPlayer,
    removePlayer,
    setPlayerName,
    addPlayerMatch,
    currentPlayerIndex,
    setCurrentPlayerIndex,
    nextPlayer,
    resetPlayersMatches,
  }
}

export const [PlayersProvider, usePlayersContext] = constate(usePlayers)
