import levelState, {moveDown, moveLeft, moveRight, moveUp, TILE_SIZE} from "../level-state.ts";
import p5 from "p5";
import {createSignal} from "solid-js";

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
      const centerOfCircle = {x: levelState.position.x + TILE_SIZE / 2, y: levelState.position.y + TILE_SIZE / 2};

      // draw the map
      p.fill(0, 255, 0);
      levelState.map.split('').forEach((tile, index) => {
        const x = index % levelState.width;
        const y = Math.floor(index / levelState.width);
        if (tile === '0') {
          p.rect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
      });

      // draw player
      p.fill(0, 0, 255);
      p.circle(centerOfCircle.x, centerOfCircle.y, TILE_SIZE);

      // draw golf flag
      p.fill(255, 0, 0);
      p.rect(levelState.flagPosition.x, levelState.flagPosition.y, TILE_SIZE, TILE_SIZE);

      p.keyIsDown(p.LEFT_ARROW) && moveLeft();
      p.keyIsDown(p.RIGHT_ARROW) && moveRight();
      p.keyIsDown(p.UP_ARROW) && moveUp();
      p.keyIsDown(p.DOWN_ARROW) && moveDown();
    };
  };

  return (
    <div ref={el => ref(el)} />
  );
};

export default Level;
