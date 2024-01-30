import { createStore } from 'solid-js/store';
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
  flagPosition: {
    x: 250,
    y: 250,
  },
  get levelStatus() {
    if (
      this.ballPosition.x === this.flagPosition.x &&
      this.ballPosition.y === this.flagPosition.y
    ) {
      return 'won';
    }

    return 'playing';
  },
});

export const updateMap = (map: string) => setLevelState('map', map);

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

function isValidMove(x: number, y: number) {
  if (x < 0 || y < 0 || x >= MAP_SIZE || y >= MAP_SIZE) {
    return false;
  }

  const tile = levelState.map[x / TILE_SIZE + (y / TILE_SIZE) * MAP_SIZE];

  switch (tile) {
    case TILE_TYPES.fairway:
    case TILE_TYPES.green:
    case TILE_TYPES.rough:
    case TILE_TYPES.sand:
      return true;
    default:
      return false;
  }
}

export const setFlagPosition = (x: number, y: number) =>
  setLevelState('flagPosition', { x, y });

export const setBallPosition = (x: number, y: number) =>
  setLevelState('ballPosition', { x, y });

export const loadLevelState = async (level: number) => {
  console.log('loading level', level);

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
  }
};

export default levelState;
