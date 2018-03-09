import React from 'react';
import {shallow} from 'enzyme';
import assert from 'assert';

import ImageListManage from '../ImageListManage';

describe('ImageListManage', () => {
  const EXPECTED_PROPS = [
    'deleteImage',
    'label',
    'isActive',
    'isShow',
    'activate',
    'moveUpImageOrder',
    'moveDownImageOrder',
    'toggleShowOrHide',
  ];
  let imageList;
  let wrapper;
  let children;
  function updateImageList(updated) {
    imageList = updated;
  }
  beforeEach(() => {
    imageList = [
      {id: 0, label: 'レイヤー0', isShow: true, isActive: false},
      {id: 1, label: 'レイヤー1', isShow: false, isActive: true},
    ];
    wrapper = shallow(
      <ImageListManage
        imageList={imageList}
        updateImageList={updateImageList}
        display={{width: 30, height: 10}}
      />
    );
    children = wrapper.find('ImageListManageItem');
  });
  it('image の数だけ、 ImageListManageItem が作られる', () => {
    assert(children.find('ImageListManageItem').length === imageList.length);
  });
  it('意図した props が ImageListManageItem に渡される', () => {
    const childProps = Object.keys(children.at(0).props());
    assert(
      childProps.every(prop =>
        EXPECTED_PROPS.some(expectedProp => prop === expectedProp)
      )
    );
  });
  it('isActive は、 image の値がそのまま使われる', () => {
    assert(children.at(0).prop('isActive') === imageList[0].isActive);
    assert(children.at(1).prop('isActive') === imageList[1].isActive);
  });
  it('isShow は、 image の値がそのまま使われる', () => {
    assert(children.at(0).prop('isShow') === imageList[0].isShow);
    assert(children.at(1).prop('isShow') === imageList[1].isShow);
  });
  it('label は、 image の値がそのまま使われる', () => {
    assert(children.at(0).prop('label') === imageList[0].label);
    assert(children.at(1).prop('label') === imageList[1].label);
  });
  it('activate を実行すると isActive が切り替わり、 updateImageList が呼び出される', () => {
    assert(imageList[0].isActive === false);
    assert(imageList[1].isActive === true);
    children.at(0).prop('activate')();
    assert(imageList[0].isActive === true);
    assert(imageList[1].isActive === false);
  });
  it('moveUpImageOrder を実行するとその要素が繰り上がり、 updateImageList が呼び出される', () => {
    assert(imageList[0].id === 0);
    assert(imageList[1].id === 1);
    children.at(1).prop('moveUpImageOrder')();
    assert(imageList[0].id === 1);
    assert(imageList[1].id === 0);
  });
  it('一番上の要素については、 moveUpImageOrder は null になる', () => {
    assert(children.at(0).prop('moveUpImageOrder') === null);
  });
  it('moveDownImageOrder を実行するとその要素が繰り下がり、 updateImageList が呼び出される', () => {
    assert(imageList[0].id === 0);
    assert(imageList[1].id === 1);
    children.at(0).prop('moveDownImageOrder')();
    assert(imageList[0].id === 1);
    assert(imageList[1].id === 0);
  });
  it('一番下の要素については、 moveDownImageOrder は null になる', () => {
    assert(children.at(1).prop('moveDownImageOrder') === null);
  });
  it('toggleShowOrHide を実行すると isShow が切り替わり、 updateImageList が呼び出される', () => {
    assert(imageList[0].isShow === true);
    children.at(0).prop('toggleShowOrHide')();
    assert(imageList[0].isShow === false);
  });
  it('deleteImage を実行するとその要素が削除され、 updateImageList が呼び出される', () => {
    assert(imageList[0].id === 0);
    children.at(0).prop('deleteImage')();
    assert(imageList.length === 1);
    assert(imageList[0].id === 1);
  });
  it('要素が一つしか無い場合は、 deleteImage は null になる', () => {
    imageList.pop();
    wrapper = shallow(
      <ImageListManage
        imageList={imageList}
        updateImageList={updateImageList}
      />
    );
    children = wrapper.find('ImageListManageItem');
    assert(children.find('ImageListManageItem').length === 1);
    assert(children.at(0).prop('deleteImage') === null);
  });
  it('レイヤー追加のボタンを押すと、 image が増える', () => {
    assert(imageList.length === 2);
    const button = wrapper
      .children()
      .at(0)
      .find('.add-new-image');
    button.simulate('click');
    assert(imageList.length === 3);
  });
});
