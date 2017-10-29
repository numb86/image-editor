// @flow
export default function fillText(
  currentCanvas: HTMLCanvasElement,
  text: string
): HTMLCanvasElement {
  const ctx = currentCanvas.getContext('2d');
  if (!ctx) throw new Error('ctx is not found.');
  ctx.font = '30px Lato';
  ctx.fillText(text, 0, 30);
  return currentCanvas;
}
