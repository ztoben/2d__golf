import { changeLevel, changeLocation } from '../game-state.ts';
import './level-picker.css';

export function LevelPicker() {
  async function goToLevel(level: number) {
    changeLevel(level);
    changeLocation('game');
  }

  return (
    <div class="level-picker">
      {new Array(18).fill(0).map((_, i) => (
        <button onClick={() => goToLevel(i + 1)}>Level {i + 1}</button>
      ))}
    </div>
  );
}
