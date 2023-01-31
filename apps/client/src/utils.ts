import { Card } from './types'
import JSConfetti from 'js-confetti'

// This function uses the Fisher-Yates shuffle algorithm
// to shuffle the elements of the array in place,
// by repeatedly picking a random element from
// the remaining unshuffled portion of the array
// and swapping it with the current element.
export function shuffleArray<T>(array: T[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }

  return array
}

export function getCardKey(card: Pick<Card, 'id' | 'isClone'>) {
  return `${card.id}${card.isClone ? '-clone' : ''}`
}

export function prepareCardsForGame(cards: Card[]) {
  return shuffleArray([...cards, ...cards.map((card) => ({ ...card, isClone: true }))])
}

export let jsConfetti: JSConfetti

export function initialiseConfetti() {
  if (!jsConfetti) {
    jsConfetti = new JSConfetti()
  }
}
