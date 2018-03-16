import React from 'react';
import {shallow} from 'enzyme';
import assert from 'assert';

import ResizeAndColorToneManage from '../ResizeAndColorToneManage';

describe('ResizeAndColorToneManage', () => {
  const CANVAS_WIDTH = 8;
  const CANVAS_HEIGHT = 4;
  let canvas;
  let ctx;
  let imageData;
  let funcCalledResult;
  let wrapper;
  let resizeRatioInput;
  beforeEach(() => {
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    imageData = ctx.createImageData(CANVAS_WIDTH, CANVAS_HEIGHT);
    funcCalledResult = null;
    wrapper = shallow(
      <ResizeAndColorToneManage
        imageData={imageData}
        updateImageData={arg => {
          funcCalledResult = arg;
        }}
      />
    );
    resizeRatioInput = wrapper.find('input');
  });
  describe('invertNegaPosi', () => {
    it('ボタンを押すと、 ネガポジ反転した上で updateImageData が呼び出される', () => {
      assert(funcCalledResult === null);
      wrapper.find('[data-test="invert-nega-posi"]').simulate('click');
      assert(funcCalledResult.data[0] === 255);
    });
  });
  describe('applyGrayScale', () => {
    it('ボタンを押すと、 グレースケールした上で updateImageData が呼び出される', () => {
      assert(funcCalledResult === null);
      wrapper.find('[data-test="apply-gray-scale"]').simulate('click');
      assert(funcCalledResult.data[0] === 0);
    });
  });
  describe('resizeImage', () => {
    it('ボタンを押すと、テキストボックスの値でリサイズした上で updateImageData が呼び出される', () => {
      resizeRatioInput.simulate('change', {currentTarget: {value: '50'}});
      assert(funcCalledResult === null);
      wrapper.find('[data-test="resize-image"]').simulate('click');
      assert(funcCalledResult.width === CANVAS_WIDTH / 2);
      assert(funcCalledResult.height === CANVAS_HEIGHT / 2);
    });
    it('テキストボックスの値が0以下のときは updateImageData を呼び出さない', () => {
      resizeRatioInput.simulate('change', {currentTarget: {value: '-80'}});
      assert(funcCalledResult === null);
      wrapper.find('[data-test="resize-image"]').simulate('click');
      assert(funcCalledResult === null);
      resizeRatioInput.simulate('change', {currentTarget: {value: '0'}});
      wrapper.find('[data-test="resize-image"]').simulate('click');
      assert(funcCalledResult === null);
    });
    it('テキストボックスの値が201以上のときは updateImageData を呼び出さない', () => {
      resizeRatioInput.simulate('change', {currentTarget: {value: '201'}});
      assert(funcCalledResult === null);
      wrapper.find('[data-test="resize-image"]').simulate('click');
      assert(funcCalledResult === null);
      resizeRatioInput.simulate('change', {currentTarget: {value: '200'}});
      wrapper.find('[data-test="resize-image"]').simulate('click');
      assert(funcCalledResult.width === CANVAS_WIDTH * 2);
      assert(funcCalledResult.height === CANVAS_HEIGHT * 2);
    });
    it('テキストボックスの値が数値以外のときは updateImageData を呼び出さない', () => {
      resizeRatioInput.simulate('change', {currentTarget: {value: '12a'}});
      assert(funcCalledResult === null);
      wrapper.find('[data-test="resize-image"]').simulate('click');
      assert(funcCalledResult === null);
    });
  });
  describe('state', () => {
    it('resizeRatio の初期値は "100"', () => {
      assert(wrapper.state('resizeRatio') === '100');
    });
    it('テキストボックスへの onChange によって、 resizeRation が変化する', () => {
      assert(wrapper.state('resizeRatio') === '100');
      resizeRatioInput.simulate('change', {currentTarget: {value: '45'}});
      assert(wrapper.state('resizeRatio') === '45');
    });
    it('テキストボックスの値が適切でない状態で resizeImage ボタンを押した場合、 error が true になる', () => {
      assert(wrapper.state('error') === false);
      resizeRatioInput.simulate('change', {currentTarget: {value: 'hoge'}});
      wrapper.find('[data-test="resize-image"]').simulate('click');
      assert(wrapper.state('error') === true);
    });
    it('テキストボックスへの onChange によって、 error が false になる', () => {
      assert(wrapper.state('error') === false);
      resizeRatioInput.simulate('change', {currentTarget: {value: 'hoge'}});
      wrapper.find('[data-test="resize-image"]').simulate('click');
      assert(wrapper.state('error') === true);
      resizeRatioInput.simulate('change', {currentTarget: {value: 'hoge'}});
      assert(wrapper.state('error') === false);
    });
  });
});
