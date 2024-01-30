import { createStore } from 'solid-js/store'
const levels = import.meta.glob('./levels/*.json')

export const MAP_SIZE = 500
export const TILE_SIZE = 10

interface Color {
  [key: string]: string
}

export const TILE_TYPES = {
  fairway: 'f',
  rough: 'r',
  green: 'g',
  sand: 's',
  water: 'w',
  empty: 'e',
}

export const TILE_COLORS: Color = {
  f: '#00ff00',
  r: '#00aa00',
  g: '#00ff00',
  s: '#ffcc00',
  w: '#0000ff',
  e: '#000000',
}

export interface LevelState {
  map: string
  width: number
  height: number
  ballPosition: {
    x: number
    y: number
  }
  flagPosition: {
    x: number
    y: number
  }
  levelStatus: 'playing' | 'won'
}

const buildEmptyMap = () => {
  const tiles = []
  for (let i = 0; i < (MAP_SIZE * MAP_SIZE) / TILE_SIZE; i += 1) {
    tiles.push(TILE_TYPES.fairway)
  }
  return tiles.join('')
}

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
      return 'won'
    }

    return 'playing'
  },
})

export const updateMap = (map: string) => setLevelState('map', map)

export const moveLeft = () => {
  const x = levelState.ballPosition.x
  if (x > 0) {
    setLevelState('ballPosition', 'x', x - TILE_SIZE)
  }
}

export const moveRight = () => {
  const x = levelState.ballPosition.x
  if (x < MAP_SIZE - TILE_SIZE) {
    setLevelState('ballPosition', 'x', x + TILE_SIZE)
  }
}

export const moveUp = () => {
  const y = levelState.ballPosition.y
  if (y > 0) {
    setLevelState('ballPosition', 'y', y - TILE_SIZE)
  }
}

export const moveDown = () => {
  const y = levelState.ballPosition.y
  if (y < MAP_SIZE - TILE_SIZE) {
    setLevelState('ballPosition', 'y', y + TILE_SIZE)
  }
}

export const setFlagPosition = (x: number, y: number) =>
  setLevelState('flagPosition', { x, y })

export const setPlayerPosition = (x: number, y: number) =>
  setLevelState('ballPosition', { x, y })

export const loadLevelState = async (level: number) => {
  console.log('loading level', level)

  if (level > Object.keys(levels).length) {
    level = 1
  }

  const levelJson: LevelState = (await levels[
    `./levels/${level}.json`
  ]()) as LevelState

  if (levelJson) {
    setLevelState('map', levelJson.map)
    setLevelState('width', levelJson.width)
    setLevelState('height', levelJson.height)
    setLevelState('ballPosition', levelJson.ballPosition)
    setLevelState('flagPosition', levelJson.flagPosition)
  }
}

export default levelState
