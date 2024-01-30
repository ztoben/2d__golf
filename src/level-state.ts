import {createStore} from "solid-js/store";

export const MAP_SIZE = 500;
export const TILE_SIZE = 10;

interface Color {
  [key: string]: string;
}

export const TILE_TYPES = {
  'fairway': 'f',
  'rough': 'r',
  'green': 'g',
  'sand': 's',
  'water': 'w',
  'empty': 'e',
};

export const TILE_COLORS: Color = {
  'f': '#00ff00',
  'r': '#00aa00',
  'g': '#00ff00',
  's': '#ffcc00',
  'w': '#0000ff',
  'e': '#000000',
};

export interface LevelState {
  map: string;
  width: number;
  height: number;
  position: {
    x: number;
    y: number;
  };
  flagPosition: {
    x: number;
    y: number;
  };
  levelStatus: 'playing' | 'won';
}

const buildMap = (size: number) => {
  const tiles = [];
  for (let i = 0; i < size * size / TILE_SIZE; i += 1) {
    tiles.push(TILE_TYPES.fairway);
  }
  return tiles.join('');
}

const [levelState, setLevelState] = createStore<LevelState>({
  map: buildMap(MAP_SIZE),
  width: MAP_SIZE,
  height: MAP_SIZE,
  position: {
    x: 0,
    y: 0,
  },
  flagPosition: {
    x: 250,
    y: 250,
  },
  get levelStatus() {
    if (this.position.x === this.flagPosition.x && this.position.y === this.flagPosition.y) {
      return 'won';
    }

    return 'playing';
  }
});

export const changeMap = (map: string) => setLevelState('map', map);

export const moveLeft = () => {
  const x = levelState.position.x;
  if (x > 0) {
    setLevelState('position', 'x', x - TILE_SIZE);
  }
}

export const moveRight = () => {
  const x = levelState.position.x;
  if (x < MAP_SIZE - TILE_SIZE) {
    setLevelState('position', 'x', x + TILE_SIZE);
  }
}

export const moveUp = () => {
  const y = levelState.position.y;
  if (y > 0) {
    setLevelState('position', 'y', y - TILE_SIZE);
  }
}

export const moveDown = () => {
  const y = levelState.position.y;
  if (y < MAP_SIZE - TILE_SIZE) {
    setLevelState('position', 'y', y + TILE_SIZE);
  }
}

export const setFlagPosition = (x: number, y: number) => setLevelState('flagPosition', { x, y });

export const resetLevelState = () => {
  setLevelState({
    map: buildMap(MAP_SIZE),
    width: MAP_SIZE,
    height: MAP_SIZE,
    position: {
      x: 0,
      y: 0,
    },
    flagPosition: {
      x: 250,
      y: 250,
    },
  });
}

export default levelState;
