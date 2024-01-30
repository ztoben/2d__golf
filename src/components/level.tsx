import levelState, {
  moveDown,
  moveLeft,
  moveRight,
  moveUp,
  resetLevelState,
  TILE_COLORS,
  TILE_SIZE
} from "../level-state.ts";
import p5 from "p5";
import {createSignal} from "solid-js";
import gameState, {addTime, addStroke} from "../game-state.ts";

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

const Level = () => {
  const [instance, setInstance] = createSignal<p5>();

  const ref = (el: HTMLDivElement) => {
    if (!el) return;
    instance()?.remove();
    setInstance(new p5(sketch, el));
  }

  const sketch = (p: p5) => {
    p.setup = () => {
      const canvas = p.createCanvas(levelState.width, levelState.height);
      canvas.style('visibility', 'visible');
    };

    p.draw = () => {
      drawBoard(p);

      if (levelState.levelStatus === 'won') {
        endGame(p);
      } else if (levelState.levelStatus === 'playing') {
        playing(p);
      }
    };
  };

  return (
    <div ref={el => ref(el)} />
  );
};

function endGame(p: p5) {
  const phraseIndex = Math.floor(gameState.time % funWinningPhrases.length);
  const phrase = funWinningPhrases[phraseIndex];

  p.fill('black');
  p.textSize(40);
  p.textAlign(p.CENTER, p.CENTER);
  p.text(phrase, levelState.width / 2, 100);
  p.textSize(20);
  p.text('Press enter to continue...', levelState.width / 2, 150);

  p.keyPressed = () => {
    if (p.keyCode === p.ENTER) {
      resetLevelState();
    }
  };
}

function playing(p: p5) {
  addTime();

  p.keyIsDown(p.LEFT_ARROW) && moveLeft();
  p.keyIsDown(p.RIGHT_ARROW) && moveRight();
  p.keyIsDown(p.UP_ARROW) && moveUp();
  p.keyIsDown(p.DOWN_ARROW) && moveDown();

  p.keyPressed = () => {
    if (p.keyCode === p.LEFT_ARROW || p.keyCode === p.RIGHT_ARROW || p.keyCode === p.UP_ARROW || p.keyCode === p.DOWN_ARROW) {
      addStroke();
    }
  };
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
  const centerOfCup = {x: levelState.flagPosition.x + TILE_SIZE / 2, y: levelState.flagPosition.y + TILE_SIZE / 2};
  p.stroke('red');
  p.fill('black');
  p.circle(centerOfCup.x, centerOfCup.y, TILE_SIZE / 2);

  p.fill('red');
  p.line(centerOfCup.x, centerOfCup.y, centerOfCup.x, centerOfCup.y - TILE_SIZE * 2);
  p.triangle(centerOfCup.x, centerOfCup.y - TILE_SIZE * 2, centerOfCup.x, centerOfCup.y - TILE_SIZE * 1.5, centerOfCup.x + TILE_SIZE / 2, centerOfCup.y - TILE_SIZE * 1.5);

  // draw ball
  const centerOfBall = {x: levelState.position.x + TILE_SIZE / 2, y: levelState.position.y + TILE_SIZE / 2};

  p.stroke('white');
  p.fill('white');
  p.circle(centerOfBall.x, centerOfBall.y, TILE_SIZE / 2);
}

export default Level;
