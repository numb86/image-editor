import React from 'react';
import {shallow} from 'enzyme';
import assert from 'assert';
import sinon from 'sinon';

import ViewLayer from '../ViewLayer';

describe('ViewLayer', () => {
  const WIDTH = 20;
  const HEIGHT = 19;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(WIDTH, HEIGHT);
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<ViewLayer key="0" imageData={imageData} isShow />, {
      disableLifecycleMethods: true,
    });
  });
  it('渡されたimageDataの内容が描画される', () => {
    const inst = wrapper.instance();
    inst.canvas = document.createElement('canvas');
    inst.componentDidMount();
    const drawnData = inst.ctx.getImageData(0, 0, WIDTH, HEIGHT).data;
    assert(drawnData.length === imageData.data.length);
    assert(drawnData.every((data, index) => data === imageData.data[index]));
  });
  it('imageDataで渡されたサイズのCanvasが描画される', () => {
    assert(wrapper.find('canvas').prop('width') === WIDTH);
    assert(wrapper.find('canvas').prop('height') === HEIGHT);
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
  it('componentDidUpdate の際に putImageData が呼び出される', () => {
    const inst = wrapper.instance();
    inst.canvas = document.createElement('canvas');
    inst.componentDidMount();
    const spy = sinon.spy(inst.ctx, 'putImageData');
    assert(spy.callCount === 0);
    inst.componentDidUpdate();
    assert(spy.callCount === 1);
    spy.restore();
  });
});
