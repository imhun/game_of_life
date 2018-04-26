import { Universe } from "./wasm_game_of_life";
import { memory } from "./wasm_game_of_life_bg";

const CELL_SIZE = 8; // px
const GRID_COLOR = "#CCCCCC";
const DEAD_COLOR = "#FFFFFF";
const ALIVE_COLOR = "#000000";

// These must match `Cell::Alive` and `Cell::Dead` in `src/lib.rs`.
const DEAD = 0;
const ALIVE = 1;


const universe = Universe.new();
const width = universe.width();
const height = universe.height();


const canvas = document.getElementById("game-of-life-canvas");
canvas.height=(CELL_SIZE+1)*height+1;
canvas.width=(CELL_SIZE+1)*width+1;

const ctx=canvas.getContext('2d');

const drawGrid = () => {
  ctx.beginPath();
  ctx.lineWidth = 1 / window.devicePixelRatio;
  ctx.strokeStyle = GRID_COLOR;

  // Vertical lines.
  for (let i = 0; i <= width; i++) {
    ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
    ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
  }

  // Horizontal lines.
  for (let j = 0; j <= height; j++) {
    ctx.moveTo(0,                           j * (CELL_SIZE + 1) + 1);
    ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
  }

  ctx.stroke();
};

const getIndex = (row, column) => {
  return row * width + column;
};


const getCell = (num,bit) => {
  return (num & (1 << bit)) !== 0;
}

const drawCells = () => {
  const cellsPtr = universe.cells();
  const cells = new Uint8Array(memory.buffer, cellsPtr, universe.bytes());

  ctx.beginPath();

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const idx = getIndex(row, col);

      ctx.fillStyle =
          getCell(cells[Math.floor(idx/8)],idx%8)
        ? ALIVE_COLOR
        : DEAD_COLOR;

      ctx.fillRect(
        col * (CELL_SIZE + 1) + 1,
        row * (CELL_SIZE + 1) + 1,
        CELL_SIZE,
        CELL_SIZE
      );
    }
  }

  ctx.stroke();
};

const draw =() => {
  drawGrid();
  drawCells();
}

let animationId = null;

const isPaused = () => {
  return animationId === null;
};

const playPauseButton = document.getElementById("play-pause");
const playClearButton = document.getElementById("play-clear");
const playRandButton = document.getElementById("play-randgen");

const play = () => {
  playPauseButton.textContent = "⏸";
  renderLoop();
};

const pause = () => {
  playPauseButton.textContent = "▶";
  cancelAnimationFrame(animationId);
  animationId = null;
};

playPauseButton.addEventListener("click", event => {
  if (isPaused()) {
    play();
  } else {
    pause();
  }
});

playClearButton.addEventListener("click", event => {
  universe.clear();
  draw();
  pause();
});

playRandButton.addEventListener("click", event => {
  universe.rand_gen();
  draw();
  
  pause();
});

canvas.addEventListener("click", event => {
  const boundingRect = canvas.getBoundingClientRect();

  const scaleX = canvas.width / boundingRect.width;
  const scaleY = canvas.height / boundingRect.height;

  const canvasLeft = (event.clientX - boundingRect.left) * scaleX;
  const canvasTop = (event.clientY - boundingRect.top) * scaleY;

  const row = Math.min(Math.floor(canvasTop / (CELL_SIZE + 1)), height - 1);
  const col = Math.min(Math.floor(canvasLeft / (CELL_SIZE + 1)), width - 1);

  universe.toggle_cell(row, col);

  draw();
});

const renderLoop = () => {

  universe.tick();
  draw(); 
  animationId =requestAnimationFrame(renderLoop);
 };

play();