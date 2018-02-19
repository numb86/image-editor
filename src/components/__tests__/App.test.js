import React from 'react';
import {shallow} from 'enzyme';
import sinon from 'sinon';
import assert from 'assert';

import App from '../App';

describe('App', () => {
  let wrapper;
  let onDrop;
  let preventDefault;
  beforeEach(() => {
    onDrop = sinon.spy();
    preventDefault = sinon.spy();
    wrapper = shallow(<App onDrop={onDrop} />);
  });
  describe('DnD', () => {
    it('DnDのイベントが発生した際にEvent.preventDefaultが呼び出される', () => {
      assert(preventDefault.callCount === 0);
      wrapper.find('div').simulate('dragOver', {
        preventDefault,
        dataTransfer: {dropEffect: null},
      });
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
  });
  describe('getActiveImage', () => {
    it('getActiveImage でアクティブな image を取得できる', () => {
      const inst = wrapper.instance();
      const image = inst.getActiveImage();
      assert(image.active === true);
    });
  });
  describe('uploadImageFile', () => {
    let inst;
    let file;
    beforeEach(() => {
      inst = wrapper.instance();
      file = new window.File(['<xml>foo</xml>'], 'example.xml', {
        type: 'text/xml',
      });
    });
    it.skip('複数のファイルがアップロードされた場合は handleError が呼び出される', () => {
      const spy = sinon.spy(inst, 'handleError');
      assert(spy.callCount === 0);
      inst.uploadImageFile([file, file]);
      assert(spy.callCount === 1);
      spy.restore();
    });
    it.skip('許可していないファイルタイプがアップロードされた場合は handleError が呼び出される', () => {
      const spy = sinon.spy(inst, 'handleError');
      assert(spy.callCount === 0);
      inst.uploadImageFile([file]);
      assert(file.type === 'text/xml');
      assert(spy.callCount === 1);
      spy.restore();
    });
    it.skip(
      'アップロードした画像をImageDataに変換し、 state.imageList に新規imageを追加する',
      () => {}
    );
    it.skip('アップロードした画像がディスプレイより大きい場合は、ディスプレイをその大きさにする', () => {});
  });
  describe('handleError', () => {
    it.skip('渡されたエラーに応じて、適切なメッセージを出す', () => {});
  });
});
