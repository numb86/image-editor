import React from 'react';
import {shallow} from 'enzyme';
import assert from 'assert';

import Header from '../Header';

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
      />
    );
  });
  it('アップロードボタンでアップロードすると、 uploadImageFile が実行される', () => {
    assert(calledFunc === null);
    wrapper
      .find('.upload')
      .find('input')
      .simulate('change', {target: {files: ''}});
    assert(calledFunc.indexOf('uploadImageFile') === 0);
  });
  it('uploadImageFile の引数は e.target.files', () => {
    wrapper
      .find('.upload')
      .find('input')
      .simulate('change', {target: {files: 'foo'}});
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
});
