// показываем надпись Game Over
const showGameOver = () => {
  // прекращаем всю анимацию игры
  cancelAnimationFrame(rAF);
  // ставим флаг окончания
  gameOver = true;
  // рисуем чёрный прямоугольник посередине поля
  context.fillStyle = 'black';
  context.globalAlpha = 0.75;
  context.fillRect(0, canvas.height / 2 - 30, canvas.width, 60);
  // пишем надпись белым моноширинным шрифтом по центру
  context.globalAlpha = 1;
  context.fillStyle = 'white';
  context.font = '36px monospace';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText('GAME OVER!', canvas.width / 2, canvas.height / 2);
}