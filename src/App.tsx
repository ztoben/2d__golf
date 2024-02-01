import gameState, {
  changeLevel,
  changeLocation,
  resetStrokes,
} from './game-state.ts';
import './App.css';
import Level from './components/level.tsx';
import { LevelPicker } from './components/level-picker.tsx';
import { loadLevelState } from './level-state.ts';

function App() {
  const editMode = async () => {
    changeLevel(1);
    resetStrokes();
    await loadLevelState(1);
    changeLocation('editing');
  };

  const startNewGame = async () => {
    changeLevel(1);
    resetStrokes();
    await loadLevelState(1);
    changeLocation('game');
  };

  const pickLevel = () => {
    changeLocation('pick-level');
  };

  return (
    <div class="app">
      <div class="header">
        <h1>2d__golf</h1>
        <div class="score">
          <span>Level: {gameState.level}</span>
          <span>Strokes: {gameState.strokes.toString().padStart(8, '0')}</span>
        </div>
      </div>

      {gameState.location !== 'start-menu' && (
        <button
          class="back-button"
          onClick={() => changeLocation('start-menu')}
        >
          Home
        </button>
      )}

      <div class="game-container">
        {gameState.location === 'start-menu' && (
          <ul class="menu">
            <li>
              <button onClick={startNewGame}>Start Game</button>
            </li>
            <li>
              <button onClick={pickLevel}>Pick Level</button>
            </li>
            <li>
              <button onClick={editMode}>Level Editor</button>
            </li>
          </ul>
        )}

        {gameState.location === 'pick-level' && <LevelPicker />}

        {gameState.location === 'game' && <Level />}

        {gameState.location === 'editing' && <Level editing={true} />}
      </div>

      <span class="footer">
        Made with <a href="https://solidjs.com/">SolidJS</a> &{' '}
        <a href="https://p5js.org/">p5</a>
      </span>
    </div>
  );
}

export default App;
