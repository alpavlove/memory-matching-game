import { StrictMode } from 'react'
import * as ReactDOM from 'react-dom/client'
import { App } from './components/App/App'
import { initialiseConfetti } from './utils'
import { BrowserRouter } from 'react-router-dom'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)

initialiseConfetti()
