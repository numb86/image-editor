import React from 'react';
import {shallow} from 'enzyme';
import assert from 'assert';

import PreviewImage from '../PreviewImage';

describe('PreviewImage', () => {
  const SRC = 'src';
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<PreviewImage src={SRC} onDrop={() => {}} />);
  });
  it('props.srcが画像のsrcになる', () => {
    assert(wrapper.find('img').prop('src') === SRC);
  });
});
