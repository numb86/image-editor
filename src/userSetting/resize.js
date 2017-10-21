export default function resizeImage(currentCanvas, resizeRatio) {
  const dstCanvas = document.createElement('canvas');
  const ctx = dstCanvas.getContext('2d');
  dstCanvas.width = currentCanvas.width * resizeRatio;
  dstCanvas.height = currentCanvas.height * resizeRatio;
  ctx.drawImage(currentCanvas, 0, 0, dstCanvas.width, dstCanvas.height);
  return dstCanvas;
}
