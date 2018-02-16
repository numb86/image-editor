import React from 'react';
import {shallow} from 'enzyme';
import assert from 'assert';

import EraserLayer from '../EraserLayer';

describe('EraserLayer', () => {
  const IMAGE_DATA = {foo: 'boo'};
  const wrapper = shallow(
    <EraserLayer imageData={IMAGE_DATA} updateImageData={() => {}} />
  );
  it('MouseMoveActionLayer を返す', () => {
    assert(wrapper.length === 1);
    assert(wrapper.find('MouseMoveActionLayer').length === 1);
  });
  it('props.imageData がそのままバケツリレーされる', () => {
    assert(
      wrapper.find('MouseMoveActionLayer').prop('imageData') === IMAGE_DATA
    );
  });
  it('callbackDidMount, callbackDidUpdate, executeAction, imageData, setting を EraserLayer に渡す', () => {
    const expectedProps = [
      'callbackDidMount',
      'callbackDidUpdate',
      'executeAction',
      'imageData',
      'setting',
    ];
    const wrapperProps = Object.keys(
      wrapper.find('MouseMoveActionLayer').props()
    );
    assert(
      wrapperProps.every(prop =>
        expectedProps.some(expectedProp => prop === expectedProp)
      )
    );
  });
});
