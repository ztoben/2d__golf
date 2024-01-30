import gameState, { changeLocation } from './game-state.ts';
import './App.css';
import Level from './components/level.tsx';

function App() {
  return (
    <div class="app">
      <div class="header">
        <h1>2d__golf</h1>
        <div class="score">
          <span>Level: {gameState.level}</span>
          <span>Strokes: {gameState.strokes.toString().padStart(8, '0')}</span>
        </div>
      </div>

      <div class="game-container">
        {gameState.location === 'start-menu' && (
          <ul class="menu">
            <li>
              <button onClick={() => changeLocation('game')}>Start Game</button>
            </li>
            <li>
              <button onClick={() => changeLocation('editing')}>
                Level Editor
              </button>
            </li>
          </ul>
        )}

        {gameState.location === 'game' && <Level />}

        {gameState.location === 'editing' && <Level editing={true} />}

        {gameState.location === 'game-over' && (
          <button onClick={() => changeLocation('start-menu')}>
            Start Over
          </button>
        )}
      </div>

      <span class="footer">
        Made with <a href="https://solidjs.com/">SolidJS</a> &{' '}
        <a href="https://p5js.org/">p5</a>
      </span>
    </div>
  );
}

export default App;
