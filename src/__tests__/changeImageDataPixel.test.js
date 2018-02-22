import assert from 'assert';

import invertNegaPosi from '../changeImageDataPixel';

describe('changeImageDataPixel', () => {
  describe('invertNegaPosi', () => {
    it('rgbを反転させる。aは反転させず元の値のまま', () => {
      const src = [
        255, // r
        0, // g
        10, // b
        1, // a
        200, // r
        200, // g
        100, // b
        0, // a
        0, // r
        0, // g
        0, // b
        1, // a
      ];
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 3;
      canvas.height = 1;
      const srcImageData = ctx.createImageData(3, 1);
      srcImageData.data.forEach((pixel, index) => {
        srcImageData.data[index] = src[index];
      });
      const dest = invertNegaPosi(srcImageData).data;
      assert(dest[0] === 0);
      assert(dest[3] === 1);
      assert(dest[4] === 55);
      assert(dest[5] === 55);
      assert(dest[6] === 155);
      assert(dest[7] === 0);
      assert(dest[8] === 255);
      assert(dest[9] === 255);
      assert(dest[10] === 255);
      assert(dest[11] === 1);
    });
  });
});
