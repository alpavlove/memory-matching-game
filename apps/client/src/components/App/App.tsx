import { Routes, Route } from 'react-router-dom'
import { Game } from '../Game/Game'
import { SignUp } from '../SignUp/SignUp'
import { GameProvider } from '../../hooks/game'
import { PlayersProvider } from '../../hooks/players'
import { LeaderBoard } from '../LeaderBoard/LeaderBoard'

export function App() {
  return (
    <div className="flex flex-col items-center bg-gray-200 h-screen">
      <PlayersProvider>
        <GameProvider>
          <Routes>
            <Route path="/" element={<SignUp />} />
            <Route path="/game" element={<Game />} />
            <Route path="/leaderboard" element={<LeaderBoard />} />
          </Routes>
        </GameProvider>
      </PlayersProvider>
    </div>
  )
}
