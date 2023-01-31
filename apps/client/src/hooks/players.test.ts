import { act, renderHook } from '@testing-library/react-hooks'
import { usePlayers } from './players'
import { Card } from '../types'
import { RenderHookResult } from '@testing-library/react'

describe('usePlayers', () => {
  let result: RenderHookResult<ReturnType<typeof usePlayers>, void>['result']

  beforeEach(() => {
    result = renderHook(() => usePlayers()).result
  })

  it('should have an initial state of one player with empty name and matches', () => {
    expect(result.current.players.length).toBe(1)
    expect(result.current.players[0].name).toBe('')
    expect(result.current.players[0].matches).toEqual({})
  })

  it('should add a new player', () => {
    act(() => {
      result.current.addPlayer()
    })

    expect(result.current.players.length).toBe(2)
    expect(result.current.players[1].id).toBe(2)
    expect(result.current.players[1].name).toBe('')
    expect(result.current.players[1].matches).toEqual({})
  })

  it('should set the name of a specific player', () => {
    act(() => {
      result.current.setPlayerName('John', 1)
    })

    expect(result.current.players[0].name).toBe('John')
  })

  it('should add a match to the current player', () => {
    const card: Card = { id: 'Bear', emoji: '🐻', isClone: false }

    act(() => {
      result.current.addPlayerMatch(card)
    })

    expect(result.current.players[0].matches).toEqual({ Bear: true })
  })

  it('should change the current player index and wrap around when reaching the end', () => {
    act(() => {
      result.current.addPlayer()
    })

    act(() => {
      result.current.addPlayer()
    })

    act(() => {
      result.current.nextPlayer()
    })

    expect(result.current.currentPlayerIndex).toBe(1)

    act(() => {
      result.current.nextPlayer()
    })

    expect(result.current.currentPlayerIndex).toBe(2)

    act(() => {
      result.current.nextPlayer()
    })

    expect(result.current.currentPlayerIndex).toBe(0)
  })

  it('should set the current player index', () => {
    act(() => {
      result.current.setCurrentPlayerIndex(2)
    })

    expect(result.current.currentPlayerIndex).toBe(2)
  })

  it('should remove a player', () => {
    act(() => {
      result.current.addPlayer()
    })

    act(() => {
      result.current.addPlayer()
    })

    act(() => {
      result.current.removePlayer(2)
    })

    expect(result.current.players.length).toBe(2)
    expect(result.current.players[0].id).toBe(1)
    expect(result.current.players[1].id).toBe(3)
  })
})
