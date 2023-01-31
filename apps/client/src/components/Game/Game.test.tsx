/* eslint-disable @typescript-eslint/no-extra-semi */
import '@testing-library/jest-dom'
import { render, fireEvent } from '@testing-library/react'
import { useNavigate } from 'react-router-dom'
import { Game } from './Game'
import { useGameContext } from '../../hooks/game'
import { Card, Player } from '../../types'
import { usePlayersContext } from '../../hooks/players'

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}))

jest.mock('../../hooks/game', () => ({
  useGameContext: jest.fn(),
}))

jest.mock('../../hooks/players', () => ({
  usePlayersContext: jest.fn(),
}))

function initMock({
  cards = [
    { id: '1', emoji: '🐶', isClone: false },
    { id: '2', emoji: '🐱', isClone: false },
    { id: '3', emoji: '🐭', isClone: false },
    { id: '4', emoji: '🐹', isClone: false },
  ],
  players = [
    { id: 1, name: 'Player 1', matches: {} },
    { id: 2, name: 'Player 2', matches: {} },
  ],
  navigate = jest.fn(),
  isCardVisible = jest.fn(),
  handleCardClick = jest.fn(),
  startNewGame = jest.fn(),
  isGameOver = false,
  currentPlayerIndex = 0,
  turns = 0,
}: {
  navigate?: jest.Mock
  cards?: Card[]
  isCardVisible?: jest.Mock
  handleCardClick?: jest.Mock
  startNewGame?: jest.Mock
  players?: Player[]
  isGameOver?: boolean
  currentPlayerIndex?: number
  turns?: number
}) {
  ;(useGameContext as jest.Mock).mockReturnValue({
    cards,
    isGameOver,
    isCardVisible,
    turns,
    handleCardClick,
    startNewGame,
  })
  ;(usePlayersContext as jest.Mock).mockReturnValue({
    players,
    currentPlayerIndex,
  })
  ;(useNavigate as jest.Mock).mockReturnValue(navigate)
}

describe('Game', () => {
  beforeEach(() => {
    initMock({})
  })

  it('should render all cards', () => {
    const { getAllByTestId } = render(<Game />)
    const cards = getAllByTestId('card')

    expect(cards.length).toBe(4)
    expect(cards[0]).toHaveTextContent('🐶')
    expect(cards[1]).toHaveTextContent('🐱')
    expect(cards[2]).toHaveTextContent('🐭')
    expect(cards[3]).toHaveTextContent('🐹')
  })

  it('should call handleCardClick when a card is clicked', () => {
    const handleCardClick = jest.fn()
    initMock({ handleCardClick })
    const { getAllByTestId } = render(<Game />)
    const cards = getAllByTestId('card')

    fireEvent.click(cards[0])

    expect(handleCardClick).toHaveBeenCalledWith({
      emoji: '🐶',
      id: '1',
      isClone: false,
    })
  })

  it('should show the current player and when in multiplayer mode', () => {
    const { getByText } = render(<Game />)

    expect(getByText('Current player: Player 1')).toBeInTheDocument()
  })

  it('should show the score table when in multi player mode', () => {
    initMock({
      players: [
        { id: 1, name: 'Player 1', matches: { '🦄': true, '🐶': true } },
        { id: 2, name: 'Player 2', matches: { '🦕': true } },
      ],
    })

    const { getByText } = render(<Game />)

    expect(getByText('Score')).toBeInTheDocument()
    expect(getByText('Player 1')).toBeInTheDocument()
    expect(getByText('2')).toBeInTheDocument()
    expect(getByText('Player 2')).toBeInTheDocument()
    expect(getByText('1')).toBeInTheDocument()
  })

  it('should show the game over message when the game is over', () => {
    initMock({ isGameOver: true })
    const { getByText } = render(<Game />)
    expect(getByText('Game Over!')).toBeInTheDocument()
  })

  it('should show the turns when in single player mode', async () => {
    initMock({ players: [{ id: 1, name: 'Player 1', matches: {} }], turns: 5 })

    const { getByText } = render(<Game />)
    const turnText = getByText('Turns: 5')

    expect(turnText).toBeInTheDocument()
  })

  it('should call startNewGame when the new game button is clicked', async () => {
    const startNewGameMock = jest.fn()
    initMock({
      isGameOver: true,
      startNewGame: startNewGameMock,
    })

    const { getByText } = render(<Game />)
    const startNewGameButton = getByText('Start new game')
    fireEvent.click(startNewGameButton)

    expect(startNewGameMock).toHaveBeenCalledTimes(1)
  })
})
