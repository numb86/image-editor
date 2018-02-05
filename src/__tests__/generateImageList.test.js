import assert from 'assert';

import {
  generateImageList,
  SPECIFY_PROPERTY,
  ADD_IMAGE,
  ADD_NEW_IMAGE,
} from '../generateImageList';

// TODO: テストが長くなってきたので、定数を使うなどして保守性を高めておく
// TODO: imageDataのデータ構造が間違っているので、直す
describe('generateImageList', () => {
  let originalImageList;
  beforeEach(() => {
    originalImageList = [
      {id: 0, isShow: true, imageData: [1, 2, 3], obj: {a: 5}},
      {id: 1, isShow: true, imageData: [1, 2, 3], obj: {a: 5}},
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
      const newList = generateImageList({
        type: SPECIFY_PROPERTY,
        data: {imageData: [7, 8, 9]},
        currentState: originalImageList,
        target: 0,
      });
      assert(newList[0].imageData[0] === 7);
      assert(originalImageList[0].imageData[0] === 1);
      assert(originalImageList[0].imageData !== newList[0].imageData);
      // 変更する要素以外は参照渡しになるので注意
      assert(originalImageList[0].obj === newList[0].obj);
    });
    it('複数の要素を副作用なく変更できる', () => {
      const newList = generateImageList({
        type: SPECIFY_PROPERTY,
        data: {isShow: false, imageData: [7, 8, 9]},
        currentState: originalImageList,
        target: 0,
      });

      assert(newList[0].imageData[2] === 9);
      assert(newList[1].imageData[2] === 3);
      assert(originalImageList[0].imageData[2] === 3);

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
