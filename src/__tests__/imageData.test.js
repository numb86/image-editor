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
  });
});
