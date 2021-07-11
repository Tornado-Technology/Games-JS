const canvas = document.querySelector('#game');
const ctx = canvas.getContext('2d');

const canvasColors = {
  background: '#2d2838',
  border: '6px solid #595267'
};

const keyboard = {
  up: 'ArrowUp',
  down: 'ArrowDown',
  left: 'ArrowLeft',
  right: 'ArrowRight'
};

const cellSize = 32;

const widthCells = 16;
const heightCells = 32;

const canvasWidth = widthCells * cellSize;
const canvasHeight = heightCells * cellSize;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

canvas.style.backgroundColor = canvasColors.background;
canvas.style.border = canvasColors.border;

const field = [];

/* Create field */
for (let y = 0; y < heightCells; y++) {
  field[y] = [];
  for (let x = 0; x < widthCells; x++) {
    field[y][x] = 0;
  }
}

const sequences = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
const tetrominoSequences = [];

const tetrominos = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0]
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0]
  ],
  O: [
    [1, 1],
    [1, 1]
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0]
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0]
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0]
  ]
};

const tetrominosColors = {
  I: 'cyan',
  O: 'yellow',
  T: 'purple',
  S: 'green',
  Z: 'red',
  J: 'blue',
  L: 'orange'
};

/* Random */
const random = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// создаём последовательность фигур, которая появится в игре
const tetrominoGenerate = () => {
  while (sequences.length) {
    const rand = random(0, sequences.length - 1);
    const name = sequences.splice(rand, 1)[0];
    tetrominoSequences.push(name);
  }
};

/* Get next tatramino */
const tetrominoNext = () => {
  if (tetrominoSequences.length <= 0) {
    tetrominoGenerate();
  }

  const name = tetrominoSequences.pop();
  const matrix = tetrominos[name];
  const x = field[0].length / 2 - Math.ceil(matrix[0].length / 2);
  const y = name === 'I' ? -1 : -2;

  return {
    name: name,
    matrix: matrix,
    y: y,
    x: x
  };
};

/* Rotate tetromino in 90 deg */
const tetrominoRotate = (tetramino) => {
  return tetramino.map((y, i) => y.map((val, j) => tetramino[tetramino.length - 1 - j][i]));
};

const tetrominoCanMove = (matrix, cellY, cellX) => {
  let res = true;
  matrix.forEach((y, Yi) => {
    y.forEach((x, Xi) => {
      if (
        x === 1 && (cellX + Xi < 0 ||
          cellX + Xi >= field[Yi].length ||
          cellY + Yi >= field.length ||
          field[cellY + Yi][cellX + Xi] !== 0
        )
      ) {
        console.log('Colision');
        res = false;
      }
    });
  });

  return res;
};

const tetrominoPlace = () => {
  // tetromino = tetrominoNext();
};

let score = 0;
let count = 0;
let gameOver = false;
let tetromino = tetrominoNext();

const update = () => {
  window.requestAnimationFrame(update);

  if (tetromino) {
    if (++count > 35) {
      if (tetrominoCanMove(tetromino.matrix, tetromino.y + 1, tetromino.x)) {
        tetromino.y += 1;
      } else {
        tetromino.y -= 1;
        tetrominoPlace();
      }
      count = 0;
    }
  }

  draw();
};

const draw = () => {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  field.forEach((y, Yi) => {
    y.forEach((x, Xi) => {
      if (x !== 0) {
        const name = x;

        ctx.fillStyle = tetrominosColors[name];
        ctx.fillRect(Xi * cellSize, Yi * cellSize, cellSize - 1, cellSize - 1);
      }
    });
  });

  if (tetromino) {
    ctx.fillStyle = tetrominosColors[tetromino.name];

    tetromino.matrix.forEach((y, Yi) => {
      y.forEach((x, Xi) => {
        if (x === 1) {
          ctx.fillRect((tetromino.x + Xi) * cellSize, (tetromino.y + Yi) * cellSize, cellSize - 1, cellSize - 1);
        }
      });
    });
  }
};

document.addEventListener('keydown', function (e) {
  if (gameOver) return;

  const key = e.key;

  /* Left move */
  if (key === keyboard.left) {
    if (tetrominoCanMove(tetromino.matrix, tetromino.y, tetromino.x - 1)) {
      tetromino.x -= 1;
    }
  }

  /* Right move */
  if (key === keyboard.right) {
    if (tetrominoCanMove(tetromino.matrix, tetromino.y, tetromino.x + 1)) {
      tetromino.x += 1;
    }
  }

  /* Down to ускорить падение */
  if (key === keyboard.down) {
    if (tetrominoCanMove(tetromino.matrix, tetromino.y + 1, tetromino.x)) {
      tetromino.y += 1;
    }
  }

  /* Up to rotate */
  if (key === keyboard.up) {
    const matrix = tetrominoRotate(tetromino.matrix);
    if (tetrominoCanMove(matrix, tetromino.y, tetromino.x)) {
      tetromino.matrix = matrix;
    }
  }
});

window.requestAnimationFrame(update);
