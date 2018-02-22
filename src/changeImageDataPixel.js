// @flow

export default function invertNegaPosi(src: ImageData): ImageData {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = src.width;
  canvas.height = src.height;
  ctx.putImageData(src, 0, 0);
  const dest = ctx.getImageData(0, 0, src.width, src.height);
  // テスト環境（jsdomを使用）では、getImageDataでrgbをコピーできない（必ず0になる）ので、
  // src.data[index]の値を使っている
  dest.data.forEach((pixel, index) => {
    dest.data[index] =
      (index + 1) % 4 === 0 ? src.data[index] : 255 - src.data[index];
  });
  return dest;
}
