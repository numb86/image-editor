import assert from 'assert';

import {generateImageList, SPECIFY_PROPERTY} from '../generateImageList';

describe('generateImageList', () => {
  let originalImageList;
  beforeEach(() => {
    originalImageList = [
      {id: 0, isShow: true, imageData: [1, 2, 3], obj: {a: 5}},
      {id: 1, isShow: true, imageData: [1, 2, 3], obj: {a: 5}},
    ];
  });
  it('指定したIDで変更対象のオブジェクトを指定できる', () => {
    const imageData = 'newValue';
    let newList = generateImageList(
      SPECIFY_PROPERTY,
      {imageData},
      originalImageList,
      0
    );
    assert(newList[0].imageData === imageData);
    assert(newList[1].imageData !== imageData);
    newList = generateImageList(
      SPECIFY_PROPERTY,
      {imageData},
      originalImageList,
      1
    );
    assert(newList[1].imageData === imageData);
  });
  it('リテラルである要素を副作用なく変更できる', () => {
    const newList = generateImageList(
      SPECIFY_PROPERTY,
      {isShow: false},
      originalImageList,
      0
    );
    assert(newList[0].isShow === false);
    assert(originalImageList[0].isShow === true);
  });
  it('オブジェクトである要素を副作用なく変更できる', () => {
    const newList = generateImageList(
      SPECIFY_PROPERTY,
      {imageData: [7, 8, 9]},
      originalImageList,
      0
    );
    assert(newList[0].imageData[0] === 7);
    assert(originalImageList[0].imageData[0] === 1);
    assert(originalImageList[0].imageData !== newList[0].imageData);
    // 変更する要素以外は参照渡しになるので注意
    assert(originalImageList[0].obj === newList[0].obj);
  });
});
