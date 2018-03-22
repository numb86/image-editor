// @flow

function generateImageData(
  src: ImageData,
  callback: ImageData => ImageData
): ImageData {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = src.width;
  canvas.height = src.height;
  ctx.putImageData(src, 0, 0);
  const dest = ctx.getImageData(0, 0, src.width, src.height);
  return callback(dest);
}

export function invertNegaPosi(src: ImageData): ImageData {
  // テスト環境（jsdomを使用）では、getImageDataでrgbをコピーできない（必ず0になる）ので、
  // src.data[index]の値を使っている
  // 他の関数も同様
  return generateImageData(src, dest => {
    dest.data.forEach((pixel, index) => {
      dest.data[index] =
        (index + 1) % 4 === 0 ? src.data[index] : 255 - src.data[index];
    });
    return dest;
  });
}

export function applyGrayScale(src: ImageData): ImageData {
  return generateImageData(src, dest => {
    for (let i = 0; i < dest.data.length; i += 4) {
      const {data} = src;
      const avg = Math.floor((data[i] + data[i + 1] + data[i + 2]) / 3);
      dest.data[i] = avg;
      dest.data[i + 1] = avg;
      dest.data[i + 2] = avg;
      dest.data[i + 3] = data[i + 3];
    }
    return dest;
  });
}
