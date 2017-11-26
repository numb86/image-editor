import React from 'react';
import {shallow} from 'enzyme';
import {spy} from 'sinon';
import assert from 'assert';

import PreviewImage from '../PreviewImage';

describe('PreviewImage', () => {
  const SRC = 'src';
  let wrapper;
  let onDrop;
  let preventDefault;
  beforeEach(() => {
    onDrop = spy();
    preventDefault = spy();
    wrapper = shallow(<PreviewImage src={SRC} onDrop={onDrop} />);
  });
  it('props.srcが画像のsrcになる', () => {
    assert(wrapper.find('img').prop('src') === SRC);
  });
  it('DnDのイベントが発生した際にEvent.preventDefaultが呼び出される', () => {
    assert(preventDefault.callCount === 0);
    wrapper
      .find('img')
      .simulate('dragOver', {preventDefault, dataTransfer: {dropEffect: null}});
    assert(preventDefault.callCount === 1);
    wrapper.find('img').simulate('dragLeave', {preventDefault});
    assert(preventDefault.callCount === 2);
  });
  it('ファイルをドロップするとprops.onDropが呼び出される', () => {
    assert(onDrop.callCount === 0);
    wrapper
      .find('img')
      .simulate('drop', {preventDefault() {}, dataTransfer: {files: null}});
    assert(onDrop.callCount === 1);
  });
  it('DnDイベントによってstate.isDragOverが適切に切り替わる', () => {
    assert(wrapper.state('isDragOver') === false);
    wrapper.find('img').simulate('dragEnter', {preventDefault});
    assert(wrapper.state('isDragOver') === true);
    wrapper.find('img').simulate('dragLeave', {preventDefault});
    assert(wrapper.state('isDragOver') === false);
  });
});
