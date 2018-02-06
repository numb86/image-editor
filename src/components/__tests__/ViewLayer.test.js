import React from 'react';
import {shallow} from 'enzyme';
import assert from 'assert';

import ViewLayer from '../ViewLayer';

describe('ViewLayer', () => {
  function createImageData(width, height, data) {
    return {
      width,
      height,
      data: Uint8ClampedArray.from(data),
    };
  }
  const imageData = createImageData(100, 100, [0, 1, 2, 3, 4]);
  const wrapper = shallow(<ViewLayer key="0" imageData={imageData} isShow />, {
    disableLifecycleMethods: true,
  });
  it.skip('imageDataで渡されたサイズのCanvasが描画される', () => {});
  it.skip('渡されたimageDataの内容が描画される', () => {});
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
