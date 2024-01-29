import {createStore} from "solid-js/store";

export interface GameState {
  location: string;
  score: number;
  player: {
    name: string;
    health: number;
    inventory: string[];
  };
}

const defaultGameState = {
  location: 'start-menu',
  score: 0,
  player: {
    name: '',
    health: 100,
    inventory: [],
  },
}

const [gameState, setGameState] = createStore<GameState>(defaultGameState);

export const resetGameState = () => setGameState(defaultGameState);

export const changeLocation = (location: string) => setGameState('location', location);

export const changePlayerName = (name: string) => setGameState('player', 'name', name);

export const changePlayerHealth = (health: number) => setGameState('player', 'health', health);

export const setScore = (score: number) => setGameState('score', score);

export default gameState;
