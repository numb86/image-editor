import React from 'react';
import {shallow} from 'enzyme';
import assert from 'assert';

import ViewLayerList from '../ViewLayerList';

describe('ViewLayerList', () => {
  const COMPONENT_USE_PROPS = ['isShow', 'imageData'];
  function createImageData(width, height, data) {
    return {
      width,
      height,
      data: Uint8ClampedArray.from(data),
    };
  }
  const imageList = [
    {
      id: 0,
      isShow: true,
      imageData: createImageData(100, 100, [1, 2, 3]),
    },
    {
      id: 1,
      isShow: false,
      imageData: createImageData(90, 90, [7, 8, 9]),
    },
  ];
  const list = shallow(<ViewLayerList viewLayerDataList={imageList} />).first();
  it('渡されたリストの逆順にViewLayerのリストがレンダリングされる', () => {
    assert(list.length === 2);
    assert(list.at(0).prop('isShow') === false);
    assert(list.at(1).prop('imageData').data[0] === 1);
  });
  it('ViewLayerのkeyには渡されたIDが使われる', () => {
    assert(list.at(1).key() === '0');
    assert(list.at(0).key() === '1');
  });
  it('指定したプロパティ以外はViewLayerには渡されない', () => {
    const propsList = Object.keys(list.at(0).props());
    assert(
      propsList.every(key =>
        COMPONENT_USE_PROPS.some(useProp => key === useProp)
      )
    );
  });
});
