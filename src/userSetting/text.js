export default function fillText(currentCanvas) {
  const ctx = currentCanvas.getContext('2d');
  ctx.font = '30px Lato';
  ctx.fillText('image-editor', 0, 30);
  return currentCanvas;
}
