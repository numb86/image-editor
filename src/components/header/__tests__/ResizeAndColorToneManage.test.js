import React from 'react';
import {shallow} from 'enzyme';
import assert from 'assert';

import ResizeAndColorToneManage from '../ResizeAndColorToneManage';

describe('ResizeAndColorToneManage', () => {
  let wrapper;
  let calledFunc;
  let resizeRatioInput;
  beforeEach(() => {
    calledFunc = null;
    wrapper = shallow(
      <ResizeAndColorToneManage
        invertNegaPosi={() => {
          calledFunc = 'invertNegaPosi';
        }}
        applyGrayScale={() => {
          calledFunc = 'applyGrayScale';
        }}
        resizeImage={resizeRatio => {
          calledFunc = resizeRatio;
        }}
      />
    );
    resizeRatioInput = wrapper.find('input');
  });
  describe('invertNegaPosi', () => {
    it('ボタンを押すと、 invertNegaPosi が呼び出される', () => {
      assert(calledFunc === null);
      wrapper.find('[data-test="invert-nega-posi"]').simulate('click');
      assert(calledFunc === 'invertNegaPosi');
    });
  });
  describe('applyGrayScale', () => {
    it('ボタンを押すと、 applyGrayScale が呼び出される', () => {
      assert(calledFunc === null);
      wrapper.find('[data-test="apply-gray-scale"]').simulate('click');
      assert(calledFunc === 'applyGrayScale');
    });
  });
  describe('resizeImage', () => {
    it('ボタンを押すと、テキストボックスの値を resizeImage に渡して呼び出す', () => {
      resizeRatioInput.simulate('change', {currentTarget: {value: '80'}});
      assert(calledFunc === null);
      wrapper.find('[data-test="resize-image"]').simulate('click');
      assert(calledFunc === 80);
    });
    it('テキストボックスの値が0以下のときは resizeImage を呼び出さない', () => {
      resizeRatioInput.simulate('change', {currentTarget: {value: '-80'}});
      assert(calledFunc === null);
      wrapper.find('[data-test="resize-image"]').simulate('click');
      assert(calledFunc === null);
      resizeRatioInput.simulate('change', {currentTarget: {value: '0'}});
      wrapper.find('[data-test="resize-image"]').simulate('click');
      assert(calledFunc === null);
    });
    it('テキストボックスの値が201以上のときは resizeImage を呼び出さない', () => {
      resizeRatioInput.simulate('change', {currentTarget: {value: '201'}});
      assert(calledFunc === null);
      wrapper.find('[data-test="resize-image"]').simulate('click');
      assert(calledFunc === null);
      resizeRatioInput.simulate('change', {currentTarget: {value: '200'}});
      wrapper.find('[data-test="resize-image"]').simulate('click');
      assert(calledFunc === 200);
    });
    it('テキストボックスの値が数値以外のときは resizeImage を呼び出さない', () => {
      resizeRatioInput.simulate('change', {currentTarget: {value: '12a'}});
      assert(calledFunc === null);
      wrapper.find('[data-test="resize-image"]').simulate('click');
      assert(calledFunc === null);
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
  });
});
