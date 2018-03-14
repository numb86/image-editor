import React from 'react';
import {shallow} from 'enzyme';
import assert from 'assert';

import DisplayManage from '../DisplayManage';

describe('DisplayManage', () => {
  let wrapper;
  let displaySize;
  let imageDatas;
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
        showImageDatas={imageDatas}
      />
    );
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
          showImageDatas={imageDatas}
        />
      );
      assert(displaySize.width === null && displaySize.height === null);
      wrapper.find('[data-test="fit-max-view-layer"]').simulate('click');
      assert(displaySize.width === null && displaySize.height === null);
    });
  });
  describe('specifyDisplaySize', () => {
    let widthInput;
    let heightInput;
    beforeEach(() => {
      const inputs = wrapper.find('input');
      widthInput = inputs.at(0);
      heightInput = inputs.at(1);
    });
    it('ボタンを押すと、テキストボックスの値を updateDisplaySize に渡して呼び出す', () => {
      widthInput.simulate('change', {currentTarget: {value: 33}});
      heightInput.simulate('change', {currentTarget: {value: 22}});
      assert(displaySize.width === null && displaySize.height === null);
      wrapper.find('[data-test="specify-display-size"]').simulate('click');
      assert(displaySize.width === 33 && displaySize.height === 22);
    });
    it('テキストボックスの値が0以下のときは updateDisplaySize を呼び出さない', () => {
      widthInput.simulate('change', {currentTarget: {value: -33}});
      heightInput.simulate('change', {currentTarget: {value: 22}});
      assert(displaySize.width === null && displaySize.height === null);
      wrapper.find('[data-test="specify-display-size"]').simulate('click');
      assert(displaySize.width === null && displaySize.height === null);
    });
    it('テキストボックスの値が10,000以上のときは updateDisplaySize を呼び出さない', () => {
      widthInput.simulate('change', {currentTarget: {value: 33}});
      heightInput.simulate('change', {currentTarget: {value: 10000}});
      assert(displaySize.width === null && displaySize.height === null);
      wrapper.find('[data-test="specify-display-size"]').simulate('click');
      assert(displaySize.width === null && displaySize.height === null);
    });
    it('テキストボックスの値が数値以外のときは updateDisplaySize を呼び出さない', () => {
      widthInput.simulate('change', {currentTarget: {value: '33a'}});
      heightInput.simulate('change', {currentTarget: {value: 22}});
      assert(displaySize.width === null && displaySize.height === null);
      wrapper.find('[data-test="specify-display-size"]').simulate('click');
      assert(displaySize.width === null && displaySize.height === null);
    });
  });
});
