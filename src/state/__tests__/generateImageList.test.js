import assert from 'assert';

import {
  generateImageList,
  SPECIFY_PROPERTY,
  ADD_IMAGE,
  ADD_NEW_IMAGE,
} from '../generateImageList';

describe('generateImageList', () => {
  function createImageData(width, height, data) {
    return {
      width,
      height,
      data: Uint8ClampedArray.from(data),
    };
  }
  let originalImageList;
  beforeEach(() => {
    originalImageList = [
      {
        id: 0,
        isShow: true,
        imageData: createImageData(100, 100, [1, 2, 3]),
        obj: {a: 5},
      },
      {
        id: 1,
        isShow: true,
        imageData: createImageData(100, 100, [1, 2, 3]),
        obj: {a: 5},
      },
    ];
  });

  describe('SPECIFY_PROPERTY', () => {
    it('指定したIDで変更対象のオブジェクトを指定できる', () => {
      const imageData = 'newValue';
      let newList = generateImageList({
        type: SPECIFY_PROPERTY,
        data: {imageData},
        currentState: originalImageList,
        target: 0,
      });
      assert(newList[0].imageData === imageData);
      assert(newList[1].imageData !== imageData);
      newList = generateImageList({
        type: SPECIFY_PROPERTY,
        data: {imageData},
        currentState: originalImageList,
        target: 1,
      });
      assert(newList[1].imageData === imageData);
    });
    it('リテラルである要素を副作用なく変更できる', () => {
      const newList = generateImageList({
        type: SPECIFY_PROPERTY,
        data: {isShow: false},
        currentState: originalImageList,
        target: 0,
      });
      assert(newList[0].isShow === false);
      assert(originalImageList[0].isShow === true);
    });
    it('オブジェクトである要素を副作用なく変更できる', () => {
      const DATA = [7, 8, 9];
      const newList = generateImageList({
        type: SPECIFY_PROPERTY,
        data: {imageData: createImageData(40, 40, DATA)},
        currentState: originalImageList,
        target: 0,
      });
      assert(newList[0].imageData.data[0] === DATA[0]);
      assert(originalImageList[0].imageData.data[0] === 1);
      assert(originalImageList[0].imageData !== newList[0].imageData);
      // 変更する要素以外は参照渡しになるので注意
      assert(originalImageList[0].obj === newList[0].obj);
    });
    it('複数の要素を副作用なく変更できる', () => {
      const DATA = [7, 8, 9];
      const newList = generateImageList({
        type: SPECIFY_PROPERTY,
        data: {isShow: false, imageData: createImageData(40, 40, DATA)},
        currentState: originalImageList,
        target: 0,
      });

      assert(newList[0].imageData.data[2] === DATA[2]);
      assert(newList[1].imageData.data[2] === 3);
      assert(originalImageList[0].imageData.data[2] === 3);

      assert(newList[0].isShow === false);
      assert(newList[1].isShow === true);
      assert(originalImageList[0].isShow === true);
    });
  });

  describe('ADD_IMAGE', () => {
    it('指定したimageが先頭に追加され、副作用がなくcurrentStateに影響を与えない', () => {
      const ID = 9;
      const image = {id: ID};
      const newList = generateImageList({
        type: ADD_IMAGE,
        image,
        currentState: originalImageList,
      });
      assert(newList.length === 3);
      assert(newList[0].id === ID);
      assert(originalImageList.length === 2);
      assert(originalImageList[0].id === 0);
    });
  });

  describe('ADD_NEW_IMAGE', () => {
    it('指定したサイズのimageが先頭に追加され、副作用がなくcurrentStateに影響を与えない', () => {
      const WIDTH = 185;
      const HEIGHT = 97;
      const newList = generateImageList({
        type: ADD_NEW_IMAGE,
        data: {width: WIDTH, height: HEIGHT},
        currentState: originalImageList,
      });
      assert(newList[0].imageData.width === WIDTH);
      assert(newList[0].imageData.height === HEIGHT);
      assert(originalImageList.length === 2);
    });
  });
});
