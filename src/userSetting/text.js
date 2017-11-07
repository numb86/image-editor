// @flow
type Canvas = HTMLCanvasElement & {
  getContext: ('2d') => CanvasRenderingContext2D,
};

export default function fillText(currentCanvas: Canvas, text: string): Canvas {
  const ctx = currentCanvas.getContext('2d');
  ctx.font = '30px Lato';
  ctx.fillText(text, 0, 30);
  return currentCanvas;
}
