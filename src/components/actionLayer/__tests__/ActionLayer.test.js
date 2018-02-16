import React from 'react';
import {shallow} from 'enzyme';
import assert from 'assert';

import {ActionLayer, DRAW_LINE, ERASER} from '../ActionLayer';

describe('ActionLayer', () => {
  it('props.activeActionLayer に応じて返すコンポーネントが変わる', () => {
    const drawLineWrapper = shallow(
      <ActionLayer activeActionLayer={DRAW_LINE} />
    );
    assert(drawLineWrapper.find('DrawLineLayer').length === 1);
    const eraserWrapper = shallow(<ActionLayer activeActionLayer={ERASER} />);
    assert(eraserWrapper.find('DrawLineLayer').length === 0);
    assert(eraserWrapper.find('EraserLayer').length === 1);
  });
  it('対応していない props.activeActionLayer を渡すとエラーを返す', () => {
    let error = false;
    try {
      shallow(<ActionLayer activeActionLayer="hoge" />);
    } catch (e) {
      error = true;
    }
    assert(error === true);
  });
  it('props.activeActionLayer はバケツリレーされない', () => {
    const wrapper = shallow(
      <ActionLayer activeActionLayer={DRAW_LINE} data="hoge" />
    );
    assert(wrapper.find('DrawLineLayer').prop('data') === 'hoge');
    assert(
      wrapper.find('DrawLineLayer').prop('activeActionLayer') === undefined
    );
  });
});
