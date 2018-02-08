import React from 'react';
import {shallow} from 'enzyme';
import assert from 'assert';

import ViewLayer from '../ViewLayer';

describe('ViewLayer', () => {
  const WIDTH = 100;
  const HEIGHT = 90;
  function createImageData(width, height, data) {
    return {
      width,
      height,
      data: Uint8ClampedArray.from(data),
    };
  }
  const imageData = createImageData(WIDTH, HEIGHT, [0, 1, 2, 3, 4]);
  const wrapper = shallow(<ViewLayer key="0" imageData={imageData} isShow />, {
    disableLifecycleMethods: true,
  });
  it('渡されたimageDataの内容が描画される', () => {
    const inst = wrapper.instance();
    inst.canvas = document.createElement('canvas');
    inst.componentDidMount();
    assert(inst.canvas.imageData.data === imageData.data);
  });
  it('imageDataで渡されたサイズのCanvasが描画される', () => {
    const inst = wrapper.instance();
    inst.canvas = document.createElement('canvas');
    inst.componentDidMount();
    assert(inst.canvas.imageData.width === WIDTH);
    assert(inst.canvas.imageData.height === HEIGHT);
  });
  it('props.isShowに応じて、表示非表示が切り替わる', () => {
    let {display} = wrapper.prop('style');
    assert(display === 'block');
    const hiddenWrapper = shallow(
      <ViewLayer key="0" imageData={imageData} isShow={false} />,
      {
        disableLifecycleMethods: true,
      }
    );
    display = hiddenWrapper.prop('style').display;
    assert(display === 'none');
  });
});