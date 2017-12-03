// @flow
const CanvasExifOrientation = require('canvas-exif-orientation');

const ORIENTATION_NUMBER = {
  /* eslint-disable no-useless-computed-key */
  [0]: 1,
  [90]: 6,
  [180]: 3,
  [270]: 8,
  /* eslint-enable no-useless-computed-key */
};

export function rotateImage(
  currentCanvas: HTMLCanvasElement,
  angle: number
): HTMLCanvasElement {
  const orietationNumber = ORIENTATION_NUMBER[angle];
  return CanvasExifOrientation.drawImage(currentCanvas, orietationNumber);
}

export const ROTATE_LIST = [
  {
    value: 0,
    label: '回転しない',
  },
  {
    value: 90,
    label: '時計回りに90度回転',
  },
  {
    value: 180,
    label: '180度回転',
  },
  {
    value: 270,
    label: '時計回りに270度回転',
  },
];
