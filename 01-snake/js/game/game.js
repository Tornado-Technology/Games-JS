const canvas = document.querySelector('#game');
const context = canvas.getContext('2d');

/* GRID SIZE */
const grid = 32;

/* CANVAS SIZE */
canvas.width = 25 * grid;
canvas.height = 25 * grid;

/* GAME SETTINGS */
let gameWarped = true;
let gamePaause = false;
let gameSpeed = 6;

let score = 0;
let count = 0;

//#region map
let map = [
  ["#", "#", "#", "W", "W", "W", "#", "#", "#", "W", "W", "W", "W", "W", "W", "#", "#", "#", "W", "W", "W", "#", "#","#", "#"],
  ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
  ["W", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "W"],
  ["W", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "W"],
  ["W", "#", "#", "#", "#", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "#", "#", "#", "#", "#", "W"],
  ["W", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "W"],
  ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
  ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
  ["W", "W", "W", "W", "#", "#", "W", "W", "W", "W", "#", "#", "#", "#", "W", "W", "W", "W", "#", "#", "W", "W", "W", "W", "W"],
  ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
  ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
  ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
  ["W", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "@", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "W"],
  ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
  ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
  ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
  ["W", "W", "W", "W", "#", "#", "W", "W", "W", "W", "#", "#", "#", "#", "W", "W", "W", "W", "#", "#", "W", "W", "W", "W", "W"],
  ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
  ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
  ["W", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "W"],
  ["W", "#", "#", "#", "#", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "#", "#", "#", "#", "#", "W"],
  ["W", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "W"],
  ["W", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "W"],
  ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
  ["#", "#", "#", "W", "W", "W", "#", "#", "#", "W", "W", "W", "W", "W", "W", "#", "#", "#", "W", "W", "W", "#", "#", "#", "#"]
];

const markers = {
  void: '#',
  wall: 'W',
  spawn: '@'
};
//#endregion

let spawnX = 160;
let spawnY = 160;

map.forEach(function (y, Yi) {
  y.forEach(function (x, Xi) {
    if (x === markers.spawn) {
      spawnX = Xi * grid;
      spawnY = Yi * grid;
    }
  });
});

const colors = {
  snake: 'rgb(139, 195, 74)',
  snakeCell: 'rgb(76, 175, 80)',
  apple: 'rgb(244, 67, 54)',
  walll: 'rgb(50, 50, 50)',
  floor: 'rgb(90, 90, 90)'
};

const keyboard = {
  up: 'ArrowUp',
  down: 'ArrowDown',
  left: 'ArrowLeft',
  right: 'ArrowRight'
};

const snake = {
  x: spawnX,
  y: spawnY,
  dx: grid,
  dy: 0,
  cells: [],
  maxCells: 4
};

const apple = {
  x: 0,
  y: 0
};

const random = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const createAple = () => {
  console.log('--Apple Created--');

  const newX = random(0, (canvas.width - grid) / grid) * grid;
  const newY = random(0, (canvas.height - grid) / grid) * grid;

  apple.x = newX;
  apple.y = newY;
};

createAple();

const update = () => {
  requestAnimationFrame(update);

  if (gamePaause || ++count < gameSpeed) {
    return;
  }

  //console.log('--Update--');
  count = 0;

  map.forEach(function (y, Yi) {
    y.forEach(function (x, Xi) {
      if (x === markers.wall) {
        if (apple.x === Xi * grid && apple.y === Yi * grid) {
          createAple();
        }
      }
    });
  });

  if (snake.x === apple.x && snake.y === apple.y) {
    snake.maxCells++;
    score++;
    createAple();
  }

  snake.x += snake.dx;
  snake.y += snake.dy;

  if (gameWarped === true) {
    if (snake.x < 0) {
      snake.x = canvas.width - grid;
    } else if (snake.x >= canvas.width) {
      snake.x = 0;
    }

    if (snake.y < 0) {
      snake.y = canvas.height - grid;
    } else if (snake.y >= canvas.height) {
      snake.y = 0;
    }
  } else {
    if (snake.x < 0 || snake.x >= canvas.width) {
      gameover();
    }

    if (snake.y < 0 || snake.y >= canvas.height) {
      gameover();
    }
  }

  snake.cells.unshift({
    x: snake.x,
    y: snake.y
  });

  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }

  snake.cells.forEach(function (cell, index) {
    for (let i = index + 1; i < snake.cells.length; i++) {
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        gameover();
      }

      map.forEach(function (y, Yi) {
        y.forEach(function (x, Xi) {
          if (x === markers.wall) {
            if (cell.x === Xi * grid && cell.y === Yi * grid) {
              gameover();
            }
          }
        });
      });
    }
  });

  draw();
};

//

const draw = () => {
  //console.log('--Draw--');

  context.clearRect(0, 0, canvas.width, canvas.height);

  map.forEach(function (y, Yi) {
    y.forEach(function (x, Xi) {
      switch (x) {
        case markers.void:
          context.fillStyle = 'rgb(50, 50, 50)';
          break;
        case markers.wall:
          context.fillStyle = 'rgb(90, 90, 90)';
          break;
        case markers.spawn:
          context.fillStyle = 'rgb(50, 50, 50)';
          break;
        default:
          context.fillStyle = 'rgb(255, 255, 255)';
          break;
      }
      context.fillRect(Xi * grid, Yi * grid, grid, grid);
    });
  });

  context.fillStyle = colors.apple;
  context.fillRect(apple.x, apple.y, grid - 1, grid - 1);

  snake.cells.forEach(function (cell, index) {
    context.fillStyle = colors.snakeCell;
    if (index === 0) {
      context.fillStyle = colors.snake;
    }

    context.fillRect(cell.x, cell.y, grid - 1, grid - 1);
  });
};

//

const gameover = () => {
  console.log('--GameOver--');
  reastart();
};

const reastart = () => {
  console.log('--Restart--');

  snake.x = spawnX;
  snake.y = spawnY;
  snake.dx = grid;
  snake.dy = 0;
  snake.cells = [];
  snake.maxCells = 4;

  apple.x = random(0, 25) * grid;
  apple.y = random(0, 25) * grid;

  score = 0;
};

document.addEventListener('keydown', function (e) {
  if (e.key === keyboard.left && snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  } else if (e.key === keyboard.up && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  } else if (e.key === keyboard.right && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  } else if (e.key === keyboard.down && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
});

requestAnimationFrame(update);