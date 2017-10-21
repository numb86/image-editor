const CanvasExifOrientation = require('canvas-exif-orientation');

const ORIENTATION_NUMBER = {
  0: 1,
  90: 6,
  180: 3,
  270: 8,
};

export default function rotateImage(currentCanvas, angle) {
  const orietationNumber = ORIENTATION_NUMBER[angle];
  return CanvasExifOrientation.drawImage(currentCanvas, orietationNumber);
}
