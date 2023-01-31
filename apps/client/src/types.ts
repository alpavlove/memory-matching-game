export type Card = {
  id: string
  emoji: string
  isClone: boolean
}

export type Player = {
  id: number
  name: string
  matches: Record<string, boolean>
}
