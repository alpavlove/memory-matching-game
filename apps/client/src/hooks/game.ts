import { useCallback, useEffect, useState } from 'react'
import constate from 'constate'
import { Card, Player } from '../types'
import { cards } from '../cards'
import { getCardKey, jsConfetti, prepareCardsForGame, shuffleArray } from '../utils'
import { usePlayersContext } from './players'
import { usePostPlayer } from './api'
import { useNavigate } from 'react-router-dom'

export function useIsCardVisible(selectedCards: Record<string, Card>, players: Player[]) {
  return useCallback(
    (card: Card) => {
      const cardIsSelected = !!selectedCards[`${getCardKey(card)}`]
      const cardIsMatched = players.some((player) => player.matches[card.id])
      return cardIsSelected || cardIsMatched
    },
    [selectedCards, players],
  )
}

export function useGame() {
  const [currentGameCards, setCurrentGameCards] = useState<Card[]>(() =>
    prepareCardsForGame(shuffleArray(cards).slice(0, 8)),
  )
  const [selectedCards, setSelectedCards] = useState<Record<string, Card>>({})
  const [isGameOver, setIsGameOver] = useState(false)
  const [turns, setTurns] = useState(0)
  const { mutate: postPlayer } = usePostPlayer()
  const navigate = useNavigate()

  const { players, addPlayerMatch, nextPlayer, resetPlayersMatches, setCurrentPlayerIndex } =
    usePlayersContext()

  const handleCardClick = (clickedCard: Card) => {
    if (Object.keys(selectedCards).length >= 2) {
      return
    }

    // if there is only one player and the user selects the first card, increment the turns
    if (players.length === 1 && Object.keys(selectedCards).length === 0) {
      setTurns((turns) => turns + 1)
    }

    const updatedSelectedCards = { ...selectedCards, [`${getCardKey(clickedCard)}`]: clickedCard }

    setSelectedCards(updatedSelectedCards)

    if (Object.keys(updatedSelectedCards).length === 2) {
      const firstSelectedCard = selectedCards[Object.keys(selectedCards)[0]]
      // if there is a match, add the cards to the player's matches
      if (
        firstSelectedCard.id === clickedCard.id &&
        firstSelectedCard.isClone !== clickedCard.isClone
      ) {
        addPlayerMatch(clickedCard)
      } else {
        // if there is no match, change the player
        nextPlayer()
      }

      // clear the selected cards after 750ms
      setTimeout(() => setSelectedCards({}), 750)
    }
  }

  const startNewGame = useCallback(() => {
    setCurrentGameCards(prepareCardsForGame(shuffleArray(cards).slice(0, 8)))
    resetPlayersMatches()
    setCurrentPlayerIndex(0)
    setSelectedCards({})
    setIsGameOver(false)
    setTurns(0)
  }, [resetPlayersMatches, setCurrentPlayerIndex])

  useEffect(() => {
    // Check if all cards have been matched and the set the game is over
    if (
      currentGameCards.length !==
      players.reduce((accumulator, player) => accumulator + Object.keys(player.matches).length, 0) *
        2
    ) {
      return
    }

    setIsGameOver(true)
    setTimeout(() => {
      jsConfetti.addConfetti({
        emojis: currentGameCards.filter((card) => !card.isClone).map((card) => card.emoji),
        emojiSize: 100,
        confettiNumber: 75,
      })
    }, 1000)

    if (players.length === 1) {
      setTimeout(async () => {
        await postPlayer(players[0].name, turns)
        startNewGame()
        navigate('/leaderboard')
      }, 5000)
    }
  }, [currentGameCards, navigate, players, postPlayer, startNewGame, turns])

  return {
    cards: currentGameCards,
    isGameOver,
    isCardVisible: useIsCardVisible(selectedCards, players),
    selectedCards,
    turns,
    handleCardClick,
    startNewGame,
  }
}

export const [GameProvider, useGameContext] = constate(useGame)
