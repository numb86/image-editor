import React from 'react';
import {shallow} from 'enzyme';
import assert from 'assert';

import Palette from '../Palette';

import {DRAW_LINE} from '../../actionLayer/ActionLayer';

describe('Palette', () => {
  let funcCalledResult;
  beforeEach(() => {
    funcCalledResult = null;
  });
  it('背景色として表示されている色を引数として updateActionLayerSettings が呼び出される', () => {
    const wrapper = shallow(
      <Palette
        updateActionLayerSettings={(arg1, arg2) => {
          funcCalledResult = [arg1, arg2];
        }}
      />
    );
    let button = wrapper.find('button').at(0);
    let backgroundColor = button.prop('style').backgroundColor;
    assert(funcCalledResult === null);
    button.simulate('click');
    assert(funcCalledResult[0] === DRAW_LINE);
    assert(funcCalledResult[1].strokeStyle === backgroundColor);
    button = wrapper.find('button').at(3);
    backgroundColor = button.prop('style').backgroundColor;
    button.simulate('click');
    assert(funcCalledResult[0] === DRAW_LINE);
    assert(funcCalledResult[1].strokeStyle === backgroundColor);
  });
});
