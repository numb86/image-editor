import React from 'react';
import {shallow} from 'enzyme';
import sinon from 'sinon';
import assert from 'assert';

import App from '../App';

import {DRAW_LINE} from '../actionLayer/ActionLayer';

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
      assert(image.isActive === true);
    });
  });
  describe('updateImageData', () => {
    it('updateImageData に ImageData を渡すことで state.imageListHistory を更新できる', () => {
      assert(wrapper.state('imageListHistory').history.length === 1);
      assert(
        wrapper.state('imageListHistory').history[0][0].imageData.width === 500
      );
      wrapper.instance().updateImageData({data: 'foo', width: 99, height: 88});
      assert(wrapper.state('imageListHistory').history.length === 2);
      assert(
        wrapper.state('imageListHistory').history[0][0].imageData.width === 99
      );
    });
  });
  describe('updateImageList', () => {
    it('updateImageList で state.imageListHistory を更新できる', () => {
      assert(wrapper.state('imageListHistory').history.length === 1);
      assert(wrapper.state('imageListHistory').history[0][0].id === 0);
      wrapper
        .instance()
        .updateImageList([{id: 9, isActive: true}, {id: 0, isActive: false}]);
      assert(wrapper.state('imageListHistory').history.length === 2);
      assert(wrapper.state('imageListHistory').history[0][0].id === 9);
    });
  });
  describe('updateImageListHistory', () => {
    it('updateImageListHistory で state.imageListHistory を更新できる', () => {
      assert(wrapper.state('imageListHistory').position === 0);
      assert(wrapper.state('imageListHistory').history[0][0].id === 0);
      wrapper.instance().updateImageListHistory({
        history: [[{id: 1, isActive: true}], [{id: 0, isActive: true}]],
        position: 1,
        omitLength: null,
      });
      assert(wrapper.state('imageListHistory').position === 1);
      assert(wrapper.state('imageListHistory').history[0][0].id === 1);
    });
  });
  describe('updateActionLayerSettings', () => {
    it('updateActionLayerSettings で state.actionLayerSettings を更新できる', () => {
      const target = DRAW_LINE;
      assert(wrapper.state('actionLayerSettings')[target].ctx.lineWidth === 1);
      wrapper.instance().updateActionLayerSettings(target, {lineWidth: 3});
      assert(wrapper.state('actionLayerSettings')[target].ctx.lineWidth === 3);
    });
  });
  describe('changeDisplaySize', () => {
    it('渡された値に、 state.display のサイズを変える', () => {
      const inst = wrapper.instance();
      inst.changeDisplaySize(50, 90);
      assert(wrapper.state('display').width === 50);
      assert(wrapper.state('display').height === 90);
      inst.changeDisplaySize(100, 80);
      assert(wrapper.state('display').width === 100);
      assert(wrapper.state('display').height === 80);
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
    it('複数のファイルがアップロードされた場合は handleError が呼び出される', () => {
      const spy = sinon.spy(inst, 'handleError');
      assert(spy.callCount === 0);
      inst.uploadImageFile([file, file]);
      assert(spy.callCount === 1);
      spy.restore();
    });
    it('許可していないファイルタイプがアップロードされた場合は handleError が呼び出される', () => {
      const spy = sinon.spy(inst, 'handleError');
      assert(spy.callCount === 0);
      inst.uploadImageFile([file]);
      assert(file.type === 'text/xml');
      assert(spy.callCount === 1);
      spy.restore();
    });
  });
  describe('handleError', () => {
    it.skip('渡されたエラーに応じて、適切なメッセージを出す', () => {});
  });
});
