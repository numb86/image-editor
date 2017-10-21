export const COLOR_TONE_NONE_ID = 0;
const COLOR_TONE_NEGATIVE_ID = 1;
const COLOR_TONE_GRAY_SCALE_ID = 2;

function transferCanvasPixelValue(canvas, transferLogic) {
  const ctx = canvas.getContext('2d');
  const src = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const dst = ctx.createImageData(canvas.width, canvas.height);
  transferLogic(src, dst);
  ctx.putImageData(dst, 0, 0);
  return canvas;
}

function applyNegativeFilter(src, dst) {
  for (let i = 0; i < src.data.length; i += 4) {
    /* eslint-disable no-param-reassign */
    dst.data[i] = 255 - src.data[i]; // R
    dst.data[i + 1] = 255 - src.data[i + 1]; // G
    dst.data[i + 2] = 255 - src.data[i + 2]; // B
    dst.data[i + 3] = src.data[i + 3]; // A
    /* eslint-enable no-param-reassign */
  }
}

function applyGrayscaleFilter(src, dst) {
  for (let i = 0; i < src.data.length; i += 4) {
    /* eslint-disable no-param-reassign */
    const pixel = (src.data[i] + src.data[i + 1] + src.data[i + 2]) / 3;
    dst.data[i] = pixel;
    dst.data[i + 1] = pixel;
    dst.data[i + 2] = pixel;
    dst.data[i + 3] = src.data[i + 3];
    /* eslint-enable no-param-reassign */
  }
}

export const COLOR_TONE_LIST = [
  {
    id: COLOR_TONE_NONE_ID,
    label: '色調変更なし',
    func: null,
  },
  {
    id: COLOR_TONE_NEGATIVE_ID,
    label: 'ネガポジ反転',
    func: res => transferCanvasPixelValue(res, applyNegativeFilter),
  },
  {
    id: COLOR_TONE_GRAY_SCALE_ID,
    label: 'グレースケール',
    func: res => transferCanvasPixelValue(res, applyGrayscaleFilter),
  },
];
