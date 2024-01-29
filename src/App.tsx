import gameState, {changeLocation} from "./game-state.ts";
import './App.css'
import Level from "./components/level.tsx";

function App() {
  return (
    <div class="app">
      <div class="header">
        <h1>2d__golf</h1>
        {gameState.score}
      </div>

      <div class="game-container">
        {gameState.location === 'start-menu' && (
          <ul class="menu">
            <li><button onClick={() => changeLocation('game')}>Start Game</button></li>
            <li><button onClick={() => changeLocation('settings')}>Settings</button></li>
          </ul>
        )}

        {gameState.location === 'game' && (
          <Level />
        )}

        {gameState.location === 'game-over' && (
          <button onClick={() => changeLocation('start-menu')}>Start Over</button>
        )}
      </div>

      <span class="footer">
        Made with <a href="https://solidjs.com/">SolidJS</a>
      </span>
    </div>
  )
}

export default App
