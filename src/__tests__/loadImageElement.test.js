import assert from 'assert';

import loadImageElement from '../loadImageElement';

// 20*20 のpng
const dataUrl =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAP0lEQVQ4T2OcOXPmfwYiwL1794hQxcDAOGogznAaDUOcQTMEkk15eTlROUVJSYm4nDJqIM5wGg1D3Dll0CcbAMflUeHimVpmAAAAAElFTkSuQmCC';

describe('loadImageElement', () => {
  it('url を渡すと HTMLImageElement を返す', done => {
    loadImageElement(dataUrl).then(image => {
      assert(image instanceof window.HTMLImageElement);
      done();
    });
  });
  it('渡した url が src に設定される', done => {
    loadImageElement(dataUrl).then(image => {
      assert(image.src === dataUrl);
      done();
    });
  });
  it('width, height を正しく取得できる', done => {
    loadImageElement(dataUrl).then(image => {
      assert(image.width === 20);
      assert(image.height === 20);
      done();
    });
  });
});
