import assert from 'assert';

import {convertImageDataToBlob, resizeImageData} from '../imageData';

describe('imageData', () => {
  let canvas;
  let ctx;
  let srcImageData;
  beforeEach(() => {
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    canvas.width = 10;
    canvas.height = 7;
    srcImageData = ctx.createImageData(10, 7);
  });
  describe('convertImageDataToBlob', () => {
    it('imageData を渡すと Blob が返ってくる', done => {
      convertImageDataToBlob(srcImageData).then(blob => {
        assert(blob instanceof window.Blob);
        done();
      });
    });
  });
  describe('resizeImageData', () => {
    it('副作用なく、リサイズした ImageData を返す', () => {
      const destImageData = resizeImageData(srcImageData, 50);
      assert(destImageData.width === 5);
      assert(destImageData.height === 3);
      assert(srcImageData.width === 10);
      assert(srcImageData.height === 7);
    });
    it('第二引数に渡した数値の比率で、リサイズする　端数は切り捨て', () => {
      let ratio;
      let destImageData;
      const assertCheck = () => {
        assert(
          destImageData.width === Math.floor(srcImageData.width * (ratio / 100))
        );
        assert(
          destImageData.height ===
            Math.floor(srcImageData.height * (ratio / 100))
        );
      };
      ratio = 50;
      destImageData = resizeImageData(srcImageData, ratio);
      assertCheck();
      ratio = 100;
      destImageData = resizeImageData(srcImageData, ratio);
      assertCheck();
      ratio = 200;
      destImageData = resizeImageData(srcImageData, ratio);
      assertCheck();
    });
  });
});
