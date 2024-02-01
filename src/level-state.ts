import { createStore } from 'solid-js/store';
import p5, { Vector } from 'p5';
const levels = import.meta.glob('./levels/*.json');

export const MAP_SIZE = 500;
export const TILE_SIZE = 10;

interface Color {
  [key: string]: string;
}

export const TILE_TYPES = {
  fairway: 'f',
  rough: 'r',
  green: 'g',
  sand: 's',
  water: 'w',
  empty: 'e',
};

export const TILE_COLORS: Color = {
  f: '#00b700',
  r: '#005900',
  g: '#00ff00',
  s: '#ffcc00',
  w: '#0000ff',
  e: '#000000',
};

export interface LevelState {
  map: string;
  width: number;
  height: number;
  ballPosition: {
    x: number;
    y: number;
  };
  flagPosition: {
    x: number;
    y: number;
  };
  levelStatus: 'playing' | 'won';
  ballVelocity: Vector;
}

const buildEmptyMap = () => {
  const tiles = [];
  for (let i = 0; i < (MAP_SIZE * MAP_SIZE) / TILE_SIZE; i += 1) {
    tiles.push(TILE_TYPES.fairway);
  }
  return tiles.join('');
};

const [levelState, setLevelState] = createStore<LevelState>({
  map: buildEmptyMap(),
  width: MAP_SIZE,
  height: MAP_SIZE,
  ballPosition: {
    x: 0,
    y: 0,
  },
  ballVelocity: new p5.Vector(0, 0),
  flagPosition: {
    x: 250,
    y: 250,
  },
  levelStatus: 'playing',
});

export const updateMap = (map: string) => setLevelState('map', map);

export const resetLevel = () => {
  setLevelState('map', buildEmptyMap());
  setLevelState('ballPosition', { x: 0, y: 0 });
  setLevelState('flagPosition', { x: 250, y: 250 });
  setLevelState('width', MAP_SIZE);
  setLevelState('height', MAP_SIZE);
};

export const moveLeft = () => {
  const { x, y } = levelState.ballPosition;
  const newX = x - TILE_SIZE;

  if (isValidMove(newX, y)) {
    setLevelState('ballPosition', 'x', newX);
  }
};

export const moveRight = () => {
  const { x, y } = levelState.ballPosition;
  const newX = x + TILE_SIZE;

  if (isValidMove(newX, y)) {
    setLevelState('ballPosition', 'x', newX);
  }
};

export const moveUp = () => {
  const { x, y } = levelState.ballPosition;
  const newY = y - TILE_SIZE;

  if (isValidMove(x, newY)) {
    setLevelState('ballPosition', 'y', newY);
  }
};

export const moveDown = () => {
  const { x, y } = levelState.ballPosition;
  const newY = y + TILE_SIZE;

  if (isValidMove(x, newY)) {
    setLevelState('ballPosition', 'y', newY);
  }
};

export function isValidMove(x: number, y: number) {
  return !(x < 0 || y < 0 || x >= MAP_SIZE || y >= MAP_SIZE);
}

// async function resetBallIfOutOfBounds(x: number, y: number) {
//   const tile = levelState.map[x / TILE_SIZE + (y / TILE_SIZE) * MAP_SIZE];
//
//   switch (tile) {
//     case TILE_TYPES.fairway:
//     case TILE_TYPES.green:
//     case TILE_TYPES.rough:
//     case TILE_TYPES.sand:
//       return;
//     default:
//       let level = gameState.level;
//
//       if (level > Object.keys(levels).length) {
//         level = 1;
//       }
//
//       const levelJson: LevelState = (await levels[
//         `./levels/${level}.json`
//         ]()) as LevelState;
//
//       if (levelJson) {
//         setLevelState('ballPosition', levelJson.ballPosition);
//       }
//   }
// }

export const setFlagPosition = (x: number, y: number) =>
  setLevelState('flagPosition', { x, y });

export const setBallPosition = (x: number, y: number) =>
  setLevelState('ballPosition', { x, y });

export const loadLevelState = async (level: number) => {
  if (level > Object.keys(levels).length) {
    level = 1;
  }

  const levelJson: LevelState = (await levels[
    `./levels/${level}.json`
  ]()) as LevelState;

  if (levelJson) {
    setLevelState('map', levelJson.map);
    setLevelState('width', levelJson.width);
    setLevelState('height', levelJson.height);
    setLevelState('ballPosition', levelJson.ballPosition);
    setLevelState('flagPosition', levelJson.flagPosition);
    setLevelState('levelStatus', 'playing');
    setLevelState('ballVelocity', new p5.Vector(0, 0));
  }
};

export const setLevelStatus = (status: 'playing' | 'won') => {
  setLevelState('levelStatus', status);
};

export const setBallVelocity = (velocity: p5.Vector) => {
  setLevelState('ballVelocity', velocity);
};
export default levelState;
