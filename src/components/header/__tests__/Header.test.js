import React from 'react';
import {shallow} from 'enzyme';
import assert from 'assert';

import Header from '../Header';
import {DRAW_LINE} from '../../actionLayer/ActionLayer';

describe('Header', () => {
  let wrapper;
  let calledFunc;
  let imageListHistory;
  function updateImageListHistory(updated) {
    imageListHistory = updated;
  }
  beforeEach(() => {
    calledFunc = null;
    imageListHistory = {
      history: [['a'], ['b'], ['c']],
      position: 0,
      omitLength: null,
    };
    wrapper = shallow(
      <Header
        uploadImageFile={arg => {
          calledFunc = `uploadImageFile+${arg}`;
        }}
        downloadImageFile={() => {
          calledFunc = 'downloadImageFile';
        }}
        imageListHistory={imageListHistory}
        updateImageListHistory={updateImageListHistory}
        select={arg => {
          calledFunc = `select+${arg}`;
        }}
        activeActionLayer={DRAW_LINE}
        actionLayerSettings={{[DRAW_LINE]: {ctx: {}}}}
      />
    );
  });
  it('アップロードボタンでアップロードすると、 uploadImageFile が実行される', () => {
    assert(calledFunc === null);
    wrapper
      .find('.upload')
      .find('input')
      .simulate('change', {target: {files: ''}, preventDefault: () => {}});
    assert(calledFunc.indexOf('uploadImageFile') === 0);
  });
  it('uploadImageFile の引数は e.target.files', () => {
    wrapper
      .find('.upload')
      .find('input')
      .simulate('change', {target: {files: 'foo'}, preventDefault: () => {}});
    assert(calledFunc.indexOf('foo') !== -1);
  });
  it('ダウンロードボタンを押すと downloadImageFile が実行される', () => {
    assert(calledFunc === null);
    wrapper.find('.download').simulate('click');
    assert(calledFunc === 'downloadImageFile');
  });
  it('undo を押すと imageListHistory.position の数値が増え、 updateImageListHistory が実行される', () => {
    assert(imageListHistory.position === 0);
    wrapper.find('.undo').simulate('click');
    assert(imageListHistory.position === 1);
  });
  it('redo を押すと imageListHistory.position の数値が減り、 updateImageListHistory が実行される', () => {
    imageListHistory.position = 1;
    assert(imageListHistory.position === 1);
    wrapper.find('.redo').simulate('click');
    assert(imageListHistory.position === 0);
  });
  it('メニューリストを押すと、 select が呼ばれる', () => {
    assert(calledFunc === null);
    wrapper
      .find('.menu-list')
      .children()
      .at(1)
      .simulate('click');
    assert(calledFunc.indexOf('select') === 0);
  });
  it('クリックした要素のテキストが、 select の引数になる', () => {
    assert(calledFunc === null);
    const target = wrapper
      .find('.menu-list')
      .children()
      .at(1);
    target.simulate('click');
    assert(calledFunc.indexOf(target.text()) !== -1);
  });
});
