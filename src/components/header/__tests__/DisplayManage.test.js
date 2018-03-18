import React from 'react';
import {shallow} from 'enzyme';
import assert from 'assert';

import DisplayManage from '../DisplayManage';

describe('DisplayManage', () => {
  let wrapper;
  let displaySize;
  let imageDatas;
  let widthInput;
  let heightInput;
  beforeEach(() => {
    displaySize = {width: null, height: null};
    imageDatas = [
      {data: 'foo', width: 20, height: 10},
      {data: 'foo', width: 50, height: 30},
      {data: 'foo', width: 30, height: 40},
    ];
    wrapper = shallow(
      <DisplayManage
        updateDisplaySize={(width, height) => {
          displaySize = {width, height};
        }}
        displayedImageDatas={imageDatas}
        display={{width: 10, height: 10}}
      />
    );
    const inputs = wrapper.find('input');
    widthInput = inputs.at(0);
    heightInput = inputs.at(1);
  });
  describe('fitMaxViewLayer', () => {
    it('ボタンを押すと、 imageDatas の中のwidthとheightの最大値を updateDisplaySize に渡して呼び出す', () => {
      assert(displaySize.width === null && displaySize.height === null);
      wrapper.find('[data-test="fit-max-view-layer"]').simulate('click');
      assert(displaySize.width === 50 && displaySize.height === 40);
    });
    it('imageDatas が空の場合は、何もしない', () => {
      imageDatas = [];
      wrapper = shallow(
        <DisplayManage
          updateDisplaySize={(width, height) => {
            displaySize = {width, height};
          }}
          displayedImageDatas={imageDatas}
          display={{width: 10, height: 10}}
        />
      );
      assert(displaySize.width === null && displaySize.height === null);
      wrapper.find('[data-test="fit-max-view-layer"]').simulate('click');
      assert(displaySize.width === null && displaySize.height === null);
    });
  });
  describe('specifyDisplaySize', () => {
    it('ボタンを押すと、テキストボックスの値を updateDisplaySize に渡して呼び出す', () => {
      widthInput.simulate('change', {currentTarget: {value: '33'}});
      heightInput.simulate('change', {currentTarget: {value: '22'}});
      assert(displaySize.width === null && displaySize.height === null);
      wrapper.find('[data-test="specify-display-size"]').simulate('click');
      assert(displaySize.width === 33 && displaySize.height === 22);
    });
    it('テキストボックスの値が0以下のときは updateDisplaySize を呼び出さない', () => {
      widthInput.simulate('change', {currentTarget: {value: '0'}});
      heightInput.simulate('change', {currentTarget: {value: '22'}});
      assert(displaySize.width === null && displaySize.height === null);
      wrapper.find('[data-test="specify-display-size"]').simulate('click');
      assert(displaySize.width === null && displaySize.height === null);
    });
    it('テキストボックスの値が10,000以上のときは updateDisplaySize を呼び出さない', () => {
      widthInput.simulate('change', {currentTarget: {value: '33'}});
      heightInput.simulate('change', {currentTarget: {value: '10000'}});
      assert(displaySize.width === null && displaySize.height === null);
      wrapper.find('[data-test="specify-display-size"]').simulate('click');
      assert(displaySize.width === null && displaySize.height === null);
    });
    it('テキストボックスの値が数値以外のときは updateDisplaySize を呼び出さない', () => {
      widthInput.simulate('change', {currentTarget: {value: '33a'}});
      heightInput.simulate('change', {currentTarget: {value: '22'}});
      assert(displaySize.width === null && displaySize.height === null);
      wrapper.find('[data-test="specify-display-size"]').simulate('click');
      assert(displaySize.width === null && displaySize.height === null);
    });
  });
  describe('state', () => {
    it('widthString と widthHeight の初期値は、 display を文字列変換した値になる', () => {
      const {width, height} = wrapper.instance().props.display;
      assert(
        String(width) === wrapper.state('widthString') &&
          String(height) === wrapper.state('widthString')
      );
    });
    it('テキストボックスへの onChange によって、 widthString と widthHeight が変化する', () => {
      assert(wrapper.state('widthString') !== '987');
      widthInput.simulate('change', {currentTarget: {value: '987'}});
      assert(wrapper.state('widthString') === '987');
    });
    it('テキストボックスの値が適切でない状態で specifyDisplaySize ボタンを押した場合、 error が true になる', () => {
      assert(wrapper.state('error') === false);
      widthInput.simulate('change', {currentTarget: {value: 'hoge'}});
      wrapper.find('[data-test="specify-display-size"]').simulate('click');
      assert(wrapper.state('error') === true);
    });
    it('テキストボックスへの onChange によって、 error が false になる', () => {
      assert(wrapper.state('error') === false);
      widthInput.simulate('change', {currentTarget: {value: 'hoge'}});
      wrapper.find('[data-test="specify-display-size"]').simulate('click');
      assert(wrapper.state('error') === true);
      widthInput.simulate('change', {currentTarget: {value: '1'}});
      assert(wrapper.state('error') === false);
    });
  });
});
