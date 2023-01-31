import { useState, useCallback, useEffect } from 'react'
import ky from 'ky'

const api = ky.create({ prefixUrl: process.env.NX_API_URL })

export function useTopPlayers() {
  const [topPlayers, setTopPlayers] = useState<{ id: number; name: string; score: number }[]>([])

  useEffect(() => {
    const fetchTopPlayers = async () => {
      const { data } = await api
        .get('players/top')
        .json<{ data: { id: number; name: string; score: number }[] }>()
      setTopPlayers(data)
    }

    fetchTopPlayers()
  }, [])

  return topPlayers
}

export function usePostPlayer() {
  const [isPosting, setIsPosting] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const postPlayer = useCallback(async (name: string, score: number) => {
    setIsPosting(true)
    try {
      await api.post('players', { json: { name, score } }).json()
    } catch (error) {
      setError(error as Error)
    } finally {
      setIsPosting(false)
    }
  }, [])

  return { isPosting, error, mutate: postPlayer }
}
