import React from 'react';
import {shallow} from 'enzyme';
import assert from 'assert';

import SketchManage from '../SketchManage';

describe('SketchManage', () => {
  let wrapper;
  let funcCalledResult;
  const props = {
    activeActionLayer: 'drawLine',
    lineWidth: {drawLine: 1, eraser: 1},
    specifyActiveActionLayer: arg => {
      funcCalledResult = arg;
    },
    updateActionLayerSettings: (arg1, arg2) => {
      funcCalledResult = [arg1, arg2];
    },
  };
  beforeEach(() => {
    funcCalledResult = null;
    wrapper = shallow(<SketchManage {...props} />);
  });
  it('ラジオボタンの初期値は activeActionLayer', () => {
    assert(props.activeActionLayer === 'drawLine');
    assert(
      wrapper.find('[data-test="radio-draw-line"]').prop('checked') === true
    );
    assert(
      wrapper.find('[data-test="radio-eraser"]').prop('checked') === false
    );
  });
  it('ラジオボタンをチェックすると specifyActiveActionLayer が呼び出される', () => {
    assert(funcCalledResult === null);
    wrapper
      .find('[data-test="radio-eraser"]')
      .simulate('change', {currentTarget: {value: 'foo'}});
    assert(funcCalledResult === 'foo');
  });
  it('セレクトボックスの初期値は lineWidth', () => {
    assert(
      wrapper
        .find('[data-test="select-draw-line-line-width"]')
        .prop('defaultValue') === props.lineWidth.drawLine
    );
    assert(
      wrapper
        .find('[data-test="select-eraser-line-width"]')
        .prop('defaultValue') === props.lineWidth.eraser
    );
  });
  it('セレクトボックスの onChange で updateActionLayerSettings が呼び出される', () => {
    assert(funcCalledResult === null);
    wrapper
      .find('[data-test="select-draw-line-line-width"]')
      .simulate('change', {
        currentTarget: {options: {selectedIndex: 1, 1: {value: 'foo'}}},
      });
    assert(funcCalledResult !== null);
  });
  it('updateActionLayerSettings の引数は (ActionLayerName, {lineWidth: 選択された値}) という形式', () => {
    assert(funcCalledResult === null);
    wrapper
      .find('[data-test="select-draw-line-line-width"]')
      .simulate('change', {
        currentTarget: {options: {selectedIndex: 1, 1: {value: 'foo'}}},
      });
    assert(funcCalledResult[0] === 'drawLine');
    assert(Object.keys(funcCalledResult[1])[0] === 'lineWidth');
    assert(funcCalledResult[1].lineWidth === 'foo');
  });
});
