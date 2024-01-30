import levelState, {
  moveDown,
  moveLeft,
  moveRight,
  moveUp,
  loadLevelState,
  setFlagPosition,
  setBallPosition,
  TILE_COLORS,
  TILE_SIZE,
  TILE_TYPES,
  updateMap, resetLevel,
} from '../level-state.ts';
import p5 from 'p5';
import { createSignal } from 'solid-js';
import gameState, {
  addStroke,
  changeLevel,
  changeLocation,
} from '../game-state.ts';
import { effect } from 'solid-js/web';
import './level.css';

const funWinningPhrases = [
  'Nice shooting tex',
  'Heck of a job kid',
  'Smooth as butter',
  'You got game',
  'You got skillz',
  'You got the touch',
  'Rootin tootin',
  'Nice work partner',
  'You got the stuff',
  'Heckin nice job',
];

// TODO: figure out why double renders happen sometimes, instance isn't tearing down?

interface LevelProps {
  editing?: boolean;
}

const Level = ({ editing }: LevelProps) => {
  const [instance, setInstance] = createSignal<p5>();
  const [resource, setResource] = createSignal<string>(TILE_TYPES.green);
  const [brushSize, setBrushSize] = createSignal(1);

  effect(() => {
    if (!editing) {
      loadLevelState(gameState.level);
    }
  });

  const ref = (el: HTMLDivElement) => {
    if (!el) return;
    instance()?.remove();
    setInstance(new p5(sketch, el));
  };

  const sketch = (p: p5) => {
    p.setup = () => {
      const canvas = p.createCanvas(levelState.width, levelState.height);
      canvas.style('visibility', 'visible');

      if (editing) {
        canvas.mouseClicked(() => editMouseClick(p, resource, brushSize));
        canvas.mouseMoved(() => {
          if (p.mouseIsPressed) {
            editMouseClick(p, resource, brushSize);
          }
        });
      }
    };

    p.draw = () => {
      // set render speed based on what tile the ball is on
      determineBallSpeed(p);
      drawBoard(p);

      if (editing) {
        editMode(p, brushSize);
      } else if (levelState.levelStatus === 'won') {
        endGame(p);
      } else if (levelState.levelStatus === 'playing') {
        playing(p);
      }
    };
  };

  return (
    <div class="level-container">
      <div class="game" ref={(el) => ref(el)} />
      {editing && (
        <div class="edit-controls">
          <div class="column-left">
            <span
              style={{
                border: '1px solid white',
                'background-color': TILE_COLORS[resource()] || '',
                padding: '2px',
              }}
            >
              Tile: {resourceName(resource)}
            </span>
            <span>Brush Size: </span>
            <input
              type="range"
              min="1"
              max="9"
              step="2"
              value={brushSize()}
              onInput={(e) => setBrushSize(parseInt(e.currentTarget.value))}
            />
          </div>
          <div class="column-right">
            <div>
              {Object.entries(TILE_TYPES).map(([key, value]) => (
                <button
                  class={resource() === value ? 'active' : ''}
                  onClick={() => setResource(value)}
                >
                  {key}
                </button>
              ))}
            </div>
            <div>
              <button
                class={resource() === 'ball' ? 'active' : ''}
                onClick={() => setResource('ball')}
              >
                Ball
              </button>
              <button
                class={resource() === 'flag' ? 'active' : ''}
                onClick={() => setResource('flag')}
              >
                Flag
              </button>
            </div>
            <div class="edit-actions">
              <button onClick={saveLevel}>Save Level</button>
              <button onClick={resetLevel}>Reset</button>
              <button onClick={() => changeLocation('start-menu')}>Exit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function resourceName(resource: () => string) {
  if (resource() === 'ball') {
    return 'Ball';
  } else if (resource() === 'flag') {
    return 'Flag';
  } else {
    const tileType = Object.entries(TILE_TYPES).find(
      ([_, value]) => value === resource()
    );
    return tileType ? tileType[0] : 'Tile';
  }
}

function saveLevel() {
  const level = {
    width: levelState.width,
    height: levelState.height,
    map: levelState.map,
    flagPosition: levelState.flagPosition,
    ballPosition: levelState.ballPosition,
  };

  const blob = new Blob([JSON.stringify(level)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `level-${new Date().toISOString()}.json`;
  a.click();

  URL.revokeObjectURL(url);
}

function editMode(p: p5, brushSize: () => number) {
  p.keyPressed = () => {
    if (p.keyCode === p.LEFT_ARROW) {
      moveLeft();
    } else if (p.keyCode === p.RIGHT_ARROW) {
      moveRight();
    } else if (p.keyCode === p.UP_ARROW) {
      moveUp();
    } else if (p.keyCode === p.DOWN_ARROW) {
      moveDown();
    }
  };

  p.noFill();
  p.stroke('white');

  const x = Math.floor(p.mouseX / TILE_SIZE);
  const y = Math.floor(p.mouseY / TILE_SIZE);
  const halfSize = Math.floor(brushSize() / 2);
  const xStart = x - halfSize;
  const yStart = y - halfSize;

  p.rect(
    xStart * TILE_SIZE,
    yStart * TILE_SIZE,
    TILE_SIZE * brushSize(),
    TILE_SIZE * brushSize()
  );
}

function editMouseClick(
  p: p5,
  resource: () => string,
  brushSize: () => number
) {
  const x = Math.floor(p.mouseX / TILE_SIZE);
  const y = Math.floor(p.mouseY / TILE_SIZE);

  if (resource() === 'ball') {
    setBallPosition(x * TILE_SIZE, y * TILE_SIZE);
  } else if (resource() === 'flag') {
    setFlagPosition(x * TILE_SIZE, y * TILE_SIZE);
  } else {
    // account for brush size and shape
    const halfSize = Math.floor(brushSize() / 2);
    const xStart = x - halfSize;
    const xEnd = x + halfSize;
    const yStart = y - halfSize;
    const yEnd = y + halfSize;

    const newMap = levelState.map.split('');
    for (let i = xStart; i <= xEnd; i++) {
      for (let j = yStart; j <= yEnd; j++) {
        const index = j * levelState.width + i;
        newMap.splice(index, 1, resource());
      }
    }
    updateMap(newMap.join(''));
  }
}

function endGame(p: p5) {
  const phraseIndex = Math.floor(gameState.strokes % funWinningPhrases.length);
  const phrase = funWinningPhrases[phraseIndex];

  p.fill('black');
  p.textSize(40);
  p.textAlign(p.CENTER, p.CENTER);
  p.text(phrase, levelState.width / 2, 100);
  p.textSize(20);
  p.text('Press enter to continue...', levelState.width / 2, 150);

  p.keyPressed = () => {
    if (p.keyCode === p.ENTER) {
      const nextLevel = gameState.level + 1;

      changeLevel(nextLevel);
    }
  };
}

function playing(p: p5) {
  p.keyIsDown(p.LEFT_ARROW) && moveLeft();
  p.keyIsDown(p.RIGHT_ARROW) && moveRight();
  p.keyIsDown(p.UP_ARROW) && moveUp();
  p.keyIsDown(p.DOWN_ARROW) && moveDown();

  p.keyPressed = () => {
    if (
      p.keyCode === p.LEFT_ARROW ||
      p.keyCode === p.RIGHT_ARROW ||
      p.keyCode === p.UP_ARROW ||
      p.keyCode === p.DOWN_ARROW
    ) {
      addStroke();
    }
  };
}

function determineBallSpeed(p: p5) {
  const ballIndex =
    Math.floor(levelState.ballPosition.y / TILE_SIZE) * levelState.width +
    Math.floor(levelState.ballPosition.x / TILE_SIZE);
  const tile = levelState.map[ballIndex];

  switch (tile) {
    case TILE_TYPES.green:
      p.frameRate(60);
      break;
    case TILE_TYPES.rough:
      p.frameRate(30);
      break;
    case TILE_TYPES.sand:
      p.frameRate(5);
      break;
  }

  return 60;
}

function drawBoard(p: p5) {
  // draw the map
  levelState.map.split('').forEach((tile, index) => {
    const x = index % levelState.width;
    const y = Math.floor(index / levelState.width);

    p.fill(TILE_COLORS[tile]);
    p.stroke('black');
    p.rect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  });

  // draw golf flag
  const centerOfCup = {
    x: levelState.flagPosition.x + TILE_SIZE / 2,
    y: levelState.flagPosition.y + TILE_SIZE / 2,
  };
  p.stroke('red');
  p.fill('black');
  p.circle(centerOfCup.x, centerOfCup.y, TILE_SIZE / 2);

  p.fill('red');
  p.line(
    centerOfCup.x,
    centerOfCup.y,
    centerOfCup.x,
    centerOfCup.y - TILE_SIZE * 2
  );
  p.triangle(
    centerOfCup.x,
    centerOfCup.y - TILE_SIZE * 2,
    centerOfCup.x,
    centerOfCup.y - TILE_SIZE * 1.5,
    centerOfCup.x + TILE_SIZE / 2,
    centerOfCup.y - TILE_SIZE * 1.5
  );

  // draw ball
  const centerOfBall = {
    x: levelState.ballPosition.x + TILE_SIZE / 2,
    y: levelState.ballPosition.y + TILE_SIZE / 2,
  };

  p.stroke('white');
  p.fill('white');
  p.circle(centerOfBall.x, centerOfBall.y, TILE_SIZE / 2);
}

export default Level;
