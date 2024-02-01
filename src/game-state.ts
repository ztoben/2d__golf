import { createStore } from 'solid-js/store';

export interface GameState {
  location: string;
  strokes: number;
  level: number;
  player: {
    name: string;
    health: number;
    inventory: string[];
  };
}

const defaultGameState = {
  location: 'start-menu',
  strokes: 0,
  level: 1,
  player: {
    name: '',
    health: 100,
    inventory: [],
  },
};

const [gameState, setGameState] = createStore<GameState>(defaultGameState);

export const resetGameState = () => setGameState(defaultGameState);

export const changeLocation = (location: string) =>
  setGameState('location', location);

export const changePlayerName = (name: string) =>
  setGameState('player', 'name', name);

export const changePlayerHealth = (health: number) =>
  setGameState('player', 'health', health);

export const addStroke = () => setGameState('strokes', gameState.strokes + 1);

export const changeLevel = (level: number) => setGameState('level', level);

export const resetStrokes = () => setGameState('strokes', 0);

export default gameState;
