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
        uploadImageFile={() => {
          calledFunc = 'uploadImageFile';
        }}
        downloadImageFile={() => {
          calledFunc = 'downloadImageFile';
        }}
        imageListHistory={imageListHistory}
        updateImageListHistory={updateImageListHistory}
      />
    );
  });
  it.skip('アップロードボタンを押すとアップロードダイアログが表示され、 uploadImageFile が実行される', () => {});
  it.skip('uploadImageFile の引数は e.target.files', () => {});
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
