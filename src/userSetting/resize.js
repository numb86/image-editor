// @flow
export function resizeImage(
  currentCanvas: HTMLCanvasElement,
  resizeRatio: number
): HTMLCanvasElement {
  const dstCanvas = document.createElement('canvas');
  const ctx = dstCanvas.getContext('2d');
  if (!ctx) throw new Error('ctx is null.');
  dstCanvas.width = currentCanvas.width * resizeRatio;
  dstCanvas.height = currentCanvas.height * resizeRatio;
  ctx.drawImage(currentCanvas, 0, 0, dstCanvas.width, dstCanvas.height);
  return dstCanvas;
}

export const RESIZE_LIST = [
  {
    value: 0.25,
    label: '25%',
  },
  {
    value: 0.5,
    label: '50%',
  },
  {
    value: 1,
    label: '100%',
  },
  {
    value: 1.5,
    label: '150%',
  },
  {
    value: 2,
    label: '200%',
  },
];
