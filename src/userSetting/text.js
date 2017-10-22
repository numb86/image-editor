export default function fillText(currentCanvas, text) {
  const ctx = currentCanvas.getContext('2d');
  ctx.font = '30px Lato';
  ctx.fillText(text, 0, 30);
  return currentCanvas;
}
