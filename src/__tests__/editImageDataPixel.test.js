import assert from 'assert';

import {invertNegaPosi, applyGrayScale} from '../editImageDataPixel';

describe('editImageDataPixel', () => {
  let canvas;
  let ctx;
  let srcImageData;
  beforeEach(() => {
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    canvas.width = 3;
    canvas.height = 1;
    srcImageData = ctx.createImageData(3, 1);
  });
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
      srcImageData.data.forEach((pixel, index) => {
        srcImageData.data[index] = src[index];
      });
      const dest = invertNegaPosi(srcImageData).data;
      assert(dest[0] === 0);
      assert(dest[1] === 255);
      assert(dest[2] === 245);
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
    it('副作用がなく、元の ImageData には影響を与えない', () => {
      srcImageData.data[0] = 100;
      srcImageData.data[1] = 110;
      const dest = invertNegaPosi(srcImageData).data;
      assert(dest[0] === 155);
      assert(dest[1] === 145);
      assert(srcImageData.data[0] === 100);
      assert(srcImageData.data[1] === 110);
    });
  });
  describe('applyGrayScale', () => {
    it('各ピクセルのRGBを全て、RGBの中間値に変換する。aは反転させず元の値のまま', () => {
      const src = [
        100, // r
        100, // g
        100, // b
        1, // a
        30, // r
        200, // g
        100, // b
        0, // a
        80, // r
        200, // g
        54, // b
        1, // a
      ];
      srcImageData.data.forEach((pixel, index) => {
        srcImageData.data[index] = src[index];
      });
      const dest = applyGrayScale(srcImageData).data;
      assert(
        dest[0] === 100 && dest[1] === 100 && dest[2] === 100 && dest[3] === 1
      );
      assert(
        dest[4] === 110 && dest[5] === 110 && dest[6] === 110 && dest[7] === 0
      );
      assert(
        dest[8] === 111 && dest[9] === 111 && dest[10] === 111 && dest[11] === 1
      );
    });
  });
});
