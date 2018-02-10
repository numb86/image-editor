import React from 'react';
import {shallow} from 'enzyme';
import {spy} from 'sinon';
import assert from 'assert';

import App from '../App';

describe('App', () => {
  let wrapper;
  let onDrop;
  let preventDefault;
  beforeEach(() => {
    onDrop = spy();
    preventDefault = spy();
    wrapper = shallow(<App onDrop={onDrop} />);
  });
  it('DnDのイベントが発生した際にEvent.preventDefaultが呼び出される', () => {
    assert(preventDefault.callCount === 0);
    wrapper
      .find('div')
      .simulate('dragOver', {preventDefault, dataTransfer: {dropEffect: null}});
    assert(preventDefault.callCount === 1);
    wrapper.find('div').simulate('dragLeave', {preventDefault});
    assert(preventDefault.callCount === 2);
  });
  it('DnDイベントによってstate.isDragOverが適切に切り替わる', () => {
    assert(wrapper.state('isDragOver') === false);
    wrapper
      .find('div')
      .first()
      .simulate('dragEnter', {preventDefault});
    assert(wrapper.state('isDragOver') === true);
    wrapper
      .find('div')
      .first()
      .simulate('dragLeave', {preventDefault});
    assert(wrapper.state('isDragOver') === true);
    // カーソルがブラウザの外に出た時のみ、false になる
    wrapper
      .find('div')
      .first()
      .simulate('dragLeave', {preventDefault, clientX: 0});
    assert(wrapper.state('isDragOver') === false);
  });
  it('state.isDragOverがtrueのときのみ、ファイルドロップの案内文が表示される', () => {
    assert(wrapper.state('isDragOver') === false);
    assert(!wrapper.find('div').find('.guide-file-drop').length);
    wrapper
      .find('div')
      .first()
      .simulate('dragEnter', {preventDefault});
    assert(wrapper.state('isDragOver') === true);
    assert(wrapper.find('div').find('.guide-file-drop').length);
  });
  it('getActiveImage でアクティブな image を取得できる', () => {
    const inst = wrapper.instance();
    const image = inst.getActiveImage();
    assert(image.id === wrapper.state('activeImageId'));
  });
});
