export function resizeImage(currentCanvas, resizeRatio) {
  const dstCanvas = document.createElement('canvas');
  const ctx = dstCanvas.getContext('2d');
  dstCanvas.width = currentCanvas.width * resizeRatio;
  dstCanvas.height = currentCanvas.height * resizeRatio;
  ctx.drawImage(currentCanvas, 0, 0, dstCanvas.width, dstCanvas.height);
  return dstCanvas;
}

export const RESIZE_LIST = [
  {
    ratio: 0.25,
    label: '25%',
  },
  {
    ratio: 0.5,
    label: '50%',
  },
  {
    ratio: 1,
    label: '100%',
  },
  {
    ratio: 1.5,
    label: '150%',
  },
  {
    ratio: 2,
    label: '200%',
  },
];
