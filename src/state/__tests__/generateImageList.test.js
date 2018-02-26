import assert from 'assert';

import {
  generateImageList,
  SPECIFY_IMAGE_PROPERTY,
  SPECIFY_ACTIVE_IMAGE,
  ADD_IMAGE,
  ADD_NEW_IMAGE,
  DELETE_IMAGE,
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
        active: true,
        obj: {a: 5},
      },
      {
        id: 1,
        isShow: true,
        imageData: createImageData(100, 100, [1, 2, 3]),
        active: false,
        obj: {a: 5},
      },
      {
        id: 2,
        isShow: true,
        imageData: createImageData(100, 100, [11, 22, 33]),
        active: false,
        obj: {a: 5},
      },
    ];
  });

  describe('SPECIFY_IMAGE_PROPERTY', () => {
    it('指定したIDで変更対象のオブジェクトを指定できる', () => {
      const imageData = 'newValue';
      let newList = generateImageList({
        type: SPECIFY_IMAGE_PROPERTY,
        data: {imageData},
        currentState: originalImageList,
        target: 0,
      });
      assert(newList[0].imageData === imageData);
      assert(newList[1].imageData !== imageData);
      newList = generateImageList({
        type: SPECIFY_IMAGE_PROPERTY,
        data: {imageData},
        currentState: originalImageList,
        target: 1,
      });
      assert(newList[1].imageData === imageData);
    });
    it('リテラルである要素を副作用なく変更できる', () => {
      const newList = generateImageList({
        type: SPECIFY_IMAGE_PROPERTY,
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
        type: SPECIFY_IMAGE_PROPERTY,
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
        type: SPECIFY_IMAGE_PROPERTY,
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
      const originalLength = originalImageList.length;
      const ID = 9;
      const image = {id: ID};
      const newList = generateImageList({
        type: ADD_IMAGE,
        image,
        currentState: originalImageList,
      });
      assert(newList.length === originalLength + 1);
      assert(newList[0].id === ID);
      assert(originalImageList.length === originalLength);
      assert(originalImageList[0].id === 0);
    });
  });

  describe('ADD_NEW_IMAGE', () => {
    it('widthとheightを渡した場合、指定したサイズのimageが先頭に追加され、副作用がなくcurrentStateに影響を与えない', () => {
      const originalLength = originalImageList.length;
      const WIDTH = 185;
      const HEIGHT = 97;
      const newList = generateImageList({
        type: ADD_NEW_IMAGE,
        data: {width: WIDTH, height: HEIGHT},
        currentState: originalImageList,
      });
      assert(newList[0].imageData.width === WIDTH);
      assert(newList[0].imageData.height === HEIGHT);
      assert(originalImageList.length === originalLength);
    });
    it('渡されたimageDataが利用され、それがない場合は、0 で埋められる', () => {
      const DATA = [7, 8, 9, 10];
      const drawnImage = generateImageList({
        type: ADD_NEW_IMAGE,
        data: {imageData: {width: 1, height: 1, data: DATA}},
        currentState: originalImageList,
      })[0];
      assert(drawnImage.imageData.data.every(i => i !== 0));
      assert(drawnImage.imageData.data[0] === DATA[0]);
      const blankImage = generateImageList({
        type: ADD_NEW_IMAGE,
        data: {width: 10, height: 10},
        currentState: originalImageList,
      })[0];
      assert(blankImage.imageData.data.every(i => i === 0));
    });
    it('先頭に追加されるimageがアクティブになる', () => {
      const newList = generateImageList({
        type: ADD_NEW_IMAGE,
        data: {width: 200, height: 200},
        currentState: originalImageList,
      });
      assert(newList[0].active === true);
      assert(newList[1].active === false);
      assert(newList.filter(i => i.id === 3)[0].active === true);
    });
  });

  describe('SPECIFY_ACTIVE_IMAGE', () => {
    it('指定したidのimageがアクティブになり、副作用がなくcurrentStateに影響を与えない', () => {
      const newList = generateImageList({
        type: SPECIFY_ACTIVE_IMAGE,
        currentState: originalImageList,
        target: 1,
      });
      assert(originalImageList[0].active === true);
      assert(originalImageList[1].active === false);
      assert(newList[0].active === false);
      assert(newList[1].active === true);
    });
    it('アクティブなimageは常にひとつだけ', () => {
      let newList = generateImageList({
        type: SPECIFY_ACTIVE_IMAGE,
        currentState: originalImageList,
        target: 1,
      });
      newList = generateImageList({
        type: SPECIFY_ACTIVE_IMAGE,
        currentState: originalImageList,
        target: 2,
      });
      assert(newList[2].active === true);
      assert(newList.filter(image => image.active === true).length === 1);
    });
  });

  describe('DELETE_IMAGE', () => {
    it('指定したidのimageが削除される。副作用がなくcurrentStateに影響を与えない', () => {
      const originalLength = originalImageList.length;
      const newList = generateImageList({
        type: DELETE_IMAGE,
        currentState: originalImageList,
        target: 1,
      });
      assert(originalImageList.length === originalLength);
      assert(newList.length === originalLength - 1);
      assert(newList.filter(image => image.id === 1).length === 0);
      assert(originalImageList.filter(image => image.id === 1).length === 1);
    });
    it('削除するimageがアクティブな場合、後ろのimageにアクティブが移る。後ろがない場合のみ、前のimageに移る。', () => {
      const activeIsOne = generateImageList({
        type: SPECIFY_ACTIVE_IMAGE,
        currentState: originalImageList,
        target: 1,
      });
      assert(activeIsOne.filter(image => image.active === true)[0].id === 1);
      const deleteOne = generateImageList({
        type: DELETE_IMAGE,
        currentState: activeIsOne,
        target: 1,
      });
      assert(deleteOne.filter(image => image.active === true)[0].id === 2);
      const deleteTwo = generateImageList({
        type: DELETE_IMAGE,
        currentState: deleteOne,
        target: 2,
      });
      assert(deleteTwo.filter(image => image.active === true)[0].id === 0);
    });
    it('imageが一つしか無い場合は、削除できない。例外を投げる。', () => {
      const newList = generateImageList({
        type: DELETE_IMAGE,
        currentState: generateImageList({
          type: DELETE_IMAGE,
          currentState: originalImageList,
          target: 0,
        }),
        target: 1,
      });
      assert(newList.length === 1);
      let error = false;
      try {
        generateImageList({
          type: DELETE_IMAGE,
          currentState: newList,
          target: 2,
        });
      } catch (e) {
        error = true;
      }
      assert(error === true);
    });
  });
});
