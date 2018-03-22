import assert from 'assert';

import createNewImage from '../image';

describe('generateImageList', () => {
  describe('createNewImage', () => {
    it('指定したサイズのimageが返される', () => {
      const image = createNewImage({width: 90, height: 70}, []);
      assert(image.imageData.width === 90);
      assert(image.imageData.height === 70);
    });
    it('idは必ず、ユニークかつ最小の整数となる', () => {
      let image = createNewImage({width: 10, height: 10}, []);
      assert(image.id === 0);
      image = createNewImage({width: 10, height: 10}, [{id: 0}]);
      assert(image.id === 1);
      image = createNewImage({width: 10, height: 10}, [{id: 0}, {id: 1}]);
      assert(image.id === 2);
      image = createNewImage({width: 10, height: 10}, [{id: 1}, {id: 2}]);
      assert(image.id === 0);
      image = createNewImage({width: 10, height: 10}, [{id: 1}, {id: 0}]);
      assert(image.id === 2);
      image = createNewImage({width: 10, height: 10}, [
        {id: 0},
        {id: 1},
        {id: 3},
      ]);
      assert(image.id === 2);
    });
    it('label は、 レイヤー + id となる', () => {
      let image = createNewImage({width: 10, height: 10}, []);
      assert(image.id === 0);
      assert(image.label === 'レイヤー0');
      image = createNewImage({width: 10, height: 10}, [{id: 0}]);
      assert(image.id === 1);
      assert(image.label === 'レイヤー1');
    });
  });
});
