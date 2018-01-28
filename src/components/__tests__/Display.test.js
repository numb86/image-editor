import React from 'react';
import {shallow} from 'enzyme';
import assert from 'assert';

import Display from '../Display';

describe('Display', () => {
  const SPAN_STRING = 'abc';
  const IMG_SRC = 'foo.png';
  const IMG_ALT = 'foo';
  const WIDTH = 400;
  const HEIGHT = 200;
  const MAGNIFICATION_PERCENT = 120;
  const spanWrapper = shallow(<span>{`${SPAN_STRING}`}</span>);
  const imageWrapper = shallow(<img src={IMG_SRC} alt={IMG_ALT} />);
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(
      <Display
        width={WIDTH}
        height={HEIGHT}
        magnificationPercent={MAGNIFICATION_PERCENT}
      >
        {spanWrapper}
        {imageWrapper}
      </Display>
    );
  });
  it('子要素がレンダリングされる', () => {
    assert(wrapper.children().length === 2);
    assert(wrapper.childAt(0).text() === SPAN_STRING);
    assert(wrapper.childAt(1).type() === 'img');
    assert(wrapper.childAt(1).prop('src') === IMG_SRC);
  });
  it('propsで渡されたサイズになる', () => {
    const {width, height} = wrapper.prop('style');
    assert(width === `${WIDTH}px`);
    assert(height === `${HEIGHT}px`);
  });
  it('表示倍率が調整される', () => {
    assert(
      wrapper.prop('style').transform ===
        `scale(${MAGNIFICATION_PERCENT / 100})`
    );
  });
});
