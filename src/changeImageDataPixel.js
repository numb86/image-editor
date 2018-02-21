// @flow

export default function invertNegaPosi(src: ImageData): ImageData {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = src.width;
  canvas.height = src.height;
  ctx.putImageData(src, 0, 0);
  const dest = ctx.getImageData(0, 0, src.width, src.height);
  dest.data.forEach((pixel, index) => {
    dest.data[index] = (index + 1) % 4 === 0 ? pixel : 255 - pixel;
  });
  return dest;
}
