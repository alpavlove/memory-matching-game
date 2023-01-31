/* eslint-disable @typescript-eslint/no-empty-function, @typescript-eslint/no-extra-semi */
import { renderHook, act } from '@testing-library/react-hooks'
import { RenderHookResult } from '@testing-library/react'
import { cards } from '../cards'
import { useIsCardVisible, useGame } from './game'
import { jsConfetti, prepareCardsForGame } from '../utils'
import { Card } from '../types'
import { usePlayersContext } from './players'
import { useNavigate } from 'react-router-dom'

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(() => jest.fn()),
}))

jest.mock('./utils', () => ({
  ...jest.requireActual('./utils'),
  // turn off the shuffle function to make the tests predictable
  prepareCardsForGame: jest.fn((cards: Card[]) => [
    ...cards,
    ...cards.map((card) => ({ ...card, isClone: true })),
  ]),
  jsConfetti: { addConfetti: jest.fn() },
}))

jest.mock('./api', () => ({
  usePostPlayer: jest.fn(() => ({ mutate: jest.fn() })),
}))

jest.mock('./players', () => ({
  usePlayersContext: jest.fn(),
}))

describe('useIsCardVisible', () => {
  it('should return true if the card is selected', () => {
    const selectedCards = { '1': { id: '1', emoji: '1', isClone: false } }
    const players = [{ id: 1, name: 'Player 1', matches: { '1': true } }]
    const { result } = renderHook(() => useIsCardVisible(selectedCards, players))
    expect(result.current(selectedCards['1'])).toBe(true)
  })

  it('should return true if the card is matched', () => {
    const selectedCards = {}
    const players = [{ id: 1, name: 'Player 1', matches: { '1': true } }]
    const { result } = renderHook(() => useIsCardVisible(selectedCards, players))
    expect(result.current({ id: '1', emoji: '1', isClone: false })).toBe(true)
  })

  it('should return false if the card is not selected nor matched', () => {
    const selectedCards = { '1': { id: '1', emoji: '1', isClone: false } }
    const players = [{ id: 1, name: 'Player 1', matches: { '2': true } }]
    const { result } = renderHook(() => useIsCardVisible(selectedCards, players))
    expect(result.current({ id: '3', emoji: '3', isClone: false })).toBe(false)
  })
})

function initMock({
  players = [{ id: 1, name: '', matches: {} }],
  addPlayerMatch = jest.fn(),
  nextPlayer = jest.fn(),
  setCurrentPlayerIndex = jest.fn(),
  resetPlayersMatches = jest.fn(),
}) {
  ;(usePlayersContext as jest.Mock).mockReturnValue({
    players,
    addPlayerMatch,
    nextPlayer,
    setCurrentPlayerIndex,
    resetPlayersMatches,
  })
}

describe('useGame', () => {
  let result: RenderHookResult<ReturnType<typeof useGame>, void>['result']

  beforeEach(() => {
    jest.clearAllMocks()
    initMock({})

    jest.useFakeTimers()
    result = renderHook(() => useGame()).result
  })

  it('should start with an empty selectedCards state', () => {
    expect(result.current.selectedCards).toEqual({})
  })

  it('should handle card clicks correctly', () => {
    const addPlayerMatch = jest.fn()
    initMock({ addPlayerMatch })
    const card = { id: 'Bear', emoji: '🐻', isClone: false }
    act(() => result.current.handleCardClick(card))
    expect(result.current.selectedCards).toEqual({ Bear: card })

    act(() => result.current.handleCardClick({ ...card, isClone: true }))
    expect(result.current.selectedCards).toEqual({
      'Bear': card,
      'Bear-clone': { ...card, isClone: true },
    })
    expect(addPlayerMatch).toHaveBeenCalledTimes(1)
    expect(addPlayerMatch).toHaveBeenCalledWith({ ...card, isClone: true })

    act(() => {
      jest.runOnlyPendingTimers()
    })

    expect(result.current.selectedCards).toEqual({})
  })

  it('should change player if cards do not match', () => {
    const nextPlayer = jest.fn()
    initMock({
      players: [
        { id: 1, name: '1', matches: {} },
        { id: 2, name: '2', matches: {} },
      ],
      nextPlayer,
    })

    act(() => result.current.handleCardClick({ id: 'Bear', emoji: '🐻', isClone: false }))
    act(() => result.current.handleCardClick({ id: 'Fox', emoji: '🦊', isClone: true }))
    expect(nextPlayer).toHaveBeenCalledTimes(1)
  })

  it('should start a new game correctly', () => {
    const nextPlayer = jest.fn()
    const resetPlayersMatches = jest.fn()
    const setCurrentPlayerIndex = jest.fn()
    initMock({
      players: [
        { id: 1, name: '1', matches: {} },
        { id: 2, name: '2', matches: {} },
      ],
      nextPlayer,
      resetPlayersMatches,
      setCurrentPlayerIndex,
    })
    act(() => result.current.handleCardClick({ id: 'Bear', emoji: '🐻', isClone: false }))
    act(() => result.current.startNewGame())
    expect(result.current.cards).toEqual(prepareCardsForGame(cards.slice(0, 8)))
    expect(resetPlayersMatches).toHaveBeenCalledTimes(1)
    expect(setCurrentPlayerIndex).toHaveBeenCalledWith(0)
    expect(result.current.selectedCards).toEqual({})
    expect(result.current.isGameOver).toEqual(false)
  })

  it('sets isGameOver to true when all cards have been matched', () => {
    const navigate = jest.fn()
    ;(useNavigate as jest.Mock).mockReturnValue(navigate)
    const { result, rerender } = renderHook(() => useGame())
    initMock({
      players: [
        {
          id: 1,
          name: '1',
          matches: result.current.cards.slice(0, 8).reduce(
            (accumulator, card) => ({
              ...accumulator,
              [card.id]: true,
            }),
            {},
          ),
        },
        { id: 2, name: '2', matches: {} },
      ],
    })

    rerender()

    act(() => {
      jest.runOnlyPendingTimers()
    })

    expect(result.current.isGameOver).toBe(true)
    expect(jsConfetti.addConfetti).toBeCalled()
  })
})
