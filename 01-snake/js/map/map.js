const canvas = document.querySelector('#map');
const exportString = document.querySelector('#export');
const context = canvas.getContext('2d');

const grid = 32;

const mapWith = 50 * grid;
const mapHeight = 50 * grid;

const mapWithCell = mapWith / grid;
const mapHeightCell = mapHeight / grid;

canvas.width = mapWith;
canvas.height = mapHeight;

const map = [];

const markers = {
  void: '#',
  wall: 'W',
  spawn: '@'
};

for (let i = 0; i < mapWithCell; i++) {
  map[i] = [];
  for (let j = 0; j < mapHeightCell; j++) {
    map[i][j] = '#';
  }
}

const draw = () => {
  requestAnimationFrame(draw);

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
          context.fillStyle = '#009688';
          break;
        default:
          context.fillStyle = '#ffffff';
          break;
      }
      context.fillRect(Xi * grid, Yi * grid, grid - 1, grid - 1);
    });
  });

  exportString.textContent = JSON.stringify(map);
};

const createMarker = (x, y) => {
  let type = '';

  const Xm = Math.floor(x / 32);
  const Ym = Math.floor(y / 32);

  console.log('x: ' + Xm);
  console.log('y: ' + Ym);

  switch (map[Ym][Xm]) {
    case markers.void:
      type = markers.wall;
      break;
    case markers.wall:
      type = markers.spawn;
      break;
    case markers.spawn:
      type = markers.void;
      break;
  }

  map[Ym][Xm] = type;
};

document.addEventListener('click', (e) => {
  createMarker(e.x, e.y);
});

requestAnimationFrame(draw);