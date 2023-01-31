/* eslint-disable @typescript-eslint/no-empty-function */
import '@testing-library/jest-dom'
import { render, fireEvent } from '@testing-library/react'
import { Card } from './Card'

describe('Card', () => {
  it('should display the emoji passed as a prop', () => {
    const { getByText } = render(
      <Card emoji="🦄" isGameOver={false} isVisible={true} handleCardClick={() => {}} />,
    )
    expect(getByText('🦄')).toBeInTheDocument()
  })

  it('should call handleCardClick on click when the game is not over and the card is not visible', () => {
    const handleCardClick = jest.fn()
    const { getByTestId } = render(
      <Card emoji="🦄" isGameOver={false} isVisible={false} handleCardClick={handleCardClick} />,
    )
    const card = getByTestId('card')
    fireEvent.click(card)
    expect(handleCardClick).toHaveBeenCalled()
  })

  it('should not call handleCardClick on click when the game is over', () => {
    const handleCardClick = jest.fn()
    const { getByTestId } = render(
      <Card emoji="🦄" isGameOver={true} isVisible={false} handleCardClick={handleCardClick} />,
    )
    const card = getByTestId('card')
    fireEvent.click(card)
    expect(handleCardClick).not.toHaveBeenCalled()
  })

  it('should not call handleCardClick on click when the card is visible', () => {
    const handleCardClick = jest.fn()
    const { getByTestId } = render(
      <Card emoji="🦄" isGameOver={false} isVisible={true} handleCardClick={handleCardClick} />,
    )
    const card = getByTestId('card')
    fireEvent.click(card)
    expect(handleCardClick).not.toHaveBeenCalled()
  })

  it('should have class "flip opacity-0" when isVisible prop is false', () => {
    const { getByTestId } = render(
      <Card emoji="🦄" isGameOver={false} isVisible={false} handleCardClick={() => {}} />,
    )
    expect(getByTestId('card').getAttribute('class')).toContain('opacity-0')
    expect(getByTestId('card-wrapper').getAttribute('class')).toContain('flip')
  })

  it('should have class "opacity-100" when isVisible prop is true', () => {
    const { getByTestId } = render(
      <Card emoji="🦄" isGameOver={false} isVisible={true} handleCardClick={() => {}} />,
    )
    const card = getByTestId('card')
    expect(card).toHaveClass('opacity-100')
  })
})
