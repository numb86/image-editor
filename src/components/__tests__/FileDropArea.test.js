import React from 'react';
import {shallow} from 'enzyme';
import {spy} from 'sinon';
import assert from 'assert';

import FileDropArea from '../FileDropArea';

describe('FileDropArea', () => {
  let wrapper;
  let onDrop;
  let preventDefault;
  beforeEach(() => {
    onDrop = spy();
    preventDefault = spy();
    wrapper = shallow(<FileDropArea onDrop={onDrop} />);
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
  it('ファイルをドロップするとprops.onDropが呼び出される', () => {
    assert(onDrop.callCount === 0);
    wrapper
      .find('div')
      .simulate('drop', {preventDefault() {}, dataTransfer: {files: null}});
    assert(onDrop.callCount === 1);
  });
  it('DnDイベントによってstate.isDragOverが適切に切り替わる', () => {
    assert(wrapper.state('isDragOver') === false);
    wrapper.find('div').simulate('dragEnter', {preventDefault});
    assert(wrapper.state('isDragOver') === true);
    wrapper.find('div').simulate('dragLeave', {preventDefault});
    assert(wrapper.state('isDragOver') === false);
  });
});
