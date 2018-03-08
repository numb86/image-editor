import React from 'react';
import {shallow} from 'enzyme';
import assert from 'assert';

import ImageListManageItem from '../ImageListManageItem';

describe('ImageListManageItem', () => {
  let wrapper;
  let calledFunc;
  const props = {
    deleteImage: () => {
      calledFunc = 'deleteImage';
    },
    label: 'レイヤー0',
    isActive: true,
    isShow: true,
    activate: () => {
      calledFunc = 'activate';
    },
    moveUpImageOrder: () => {
      calledFunc = 'moveUpImageOrder';
    },
    moveDownImageOrder: () => {
      calledFunc = 'moveDownImageOrder';
    },
    toggleShowOrHide: () => {
      calledFunc = 'toggleShowOrHide';
    },
  };
  beforeEach(() => {
    calledFunc = null;
    wrapper = shallow(<ImageListManageItem {...props} />);
  });
  it('渡された label が表示される', () => {
    assert(wrapper.find('.label').text() === props.label);
  });
  it('アクティブかどうかで表示が変わる', () => {
    assert(wrapper.find('.active__not').length === 0);
    props.isActive = false;
    wrapper = shallow(<ImageListManageItem {...props} />);
    assert(wrapper.find('.active__not').length === 1);
  });
  it('表示非表示によって表示が変わる', () => {
    assert(wrapper.find('.show__not').length === 0);
    props.isShow = false;
    wrapper = shallow(<ImageListManageItem {...props} />);
    assert(wrapper.find('.show__not').length === 1);
  });
  it('削除ボタンを押すと deleteImage が呼ばれる', () => {
    assert(calledFunc === null);
    wrapper.find('.delete').simulate('click');
    assert(calledFunc === 'deleteImage');
  });
  it('deleteImage が null の場合、削除ボタンを押しても何も起きない', () => {
    props.deleteImage = null;
    wrapper = shallow(<ImageListManageItem {...props} />);
    assert(calledFunc === null);
    wrapper.find('.delete').simulate('click');
    assert(calledFunc === null);
  });
  it('アクティブボタンを押すと activate が呼ばれる', () => {
    assert(calledFunc === null);
    wrapper.find('.active').simulate('click');
    assert(calledFunc === 'activate');
  });
  it('アップボタンを押すと moveUpImageOrder が呼ばれる', () => {
    assert(calledFunc === null);
    wrapper.find('.move-up').simulate('click');
    assert(calledFunc === 'moveUpImageOrder');
  });
  it('moveUpImageOrder が null の場合、アップボタンを押しても何も起きない', () => {
    props.moveUpImageOrder = null;
    wrapper = shallow(<ImageListManageItem {...props} />);
    assert(calledFunc === null);
    wrapper.find('.move-up').simulate('click');
    assert(calledFunc === null);
  });
  it('ダウンボタンを押すと moveDownImageOrder が呼ばれる', () => {
    assert(calledFunc === null);
    wrapper.find('.move-down').simulate('click');
    assert(calledFunc === 'moveDownImageOrder');
  });
  it('moveDownImageOrder が null の場合、ダウンボタンを押しても何も起きない', () => {
    props.moveDownImageOrder = null;
    wrapper = shallow(<ImageListManageItem {...props} />);
    assert(calledFunc === null);
    wrapper.find('.move-down').simulate('click');
    assert(calledFunc === null);
  });
  it('表示非表示切り替えボタンを押すと toggleShowOrHide が呼ばれる', () => {
    assert(calledFunc === null);
    wrapper.find('.show').simulate('click');
    assert(calledFunc === 'toggleShowOrHide');
  });
});
