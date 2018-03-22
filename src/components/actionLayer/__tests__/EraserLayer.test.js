import React from 'react';
import {shallow} from 'enzyme';
import assert from 'assert';

import EraserLayer from '../EraserLayer';

describe('EraserLayer', () => {
  const IMAGE_DATA = {foo: 'boo'};
  const EXPECTED_PROPS = [
    'callbackDidMount',
    'callbackDidUpdate',
    'executeAction',
    'imageData',
    'setting',
    'display',
    'startOmitLengthCount',
    'omitImageListHistory',
  ];
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
  it('props を適切に MouseMoveActionLayer に渡す', () => {
    const wrapperProps = Object.keys(
      wrapper.find('MouseMoveActionLayer').props()
    );
    assert(
      wrapperProps.every(prop =>
        EXPECTED_PROPS.some(expectedProp => prop === expectedProp)
      )
    );
  });
});
