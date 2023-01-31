import '@testing-library/jest-dom'
import React from 'react'
import { useNavigate } from 'react-router'
import { render, fireEvent } from '@testing-library/react'
import { SignUp } from './SignUp'
import { usePlayersContext } from '../../hooks/players'

jest.mock('react-router', () => ({
  useNavigate: jest.fn(),
}))

jest.mock('../../hooks/players', () => ({
  usePlayersContext: jest.fn(),
}))

const players = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
]
const setPlayerName = jest.fn()
const addPlayer = jest.fn()
const navigate = jest.fn()

describe('SignUp', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(usePlayersContext as jest.Mock).mockReturnValue({ players, setPlayerName, addPlayer })
    ;(useNavigate as jest.Mock).mockReturnValue(navigate)
  })

  it('should render a form with an input for each player', () => {
    const { getByLabelText } = render(<SignUp />)

    expect(getByLabelText('Enter the player name')).toBeInTheDocument()
  })

  it('should call setPlayerName when input value changes', () => {
    const { getByLabelText } = render(<SignUp />)

    const input = getByLabelText('Enter the player name')
    fireEvent.change(input, { target: { value: 'Jane Doe' } })

    expect(setPlayerName).toHaveBeenCalledWith('Jane Doe', 1)
  })

  it('should call addPlayer when add player button is clicked', () => {
    const { getByText } = render(<SignUp />)

    const addPlayerButton = getByText('Add a player')
    fireEvent.click(addPlayerButton)

    expect(addPlayer).toHaveBeenCalled()
  })

  it('should call navigate when start game button is clicked', () => {
    const { getByText } = render(<SignUp />)

    const startGameButton = getByText('Start')
    fireEvent.click(startGameButton)

    expect(navigate).toHaveBeenCalled()
  })
})
