import React from 'react';
import {shallow} from 'enzyme';
import assert from 'assert';

import ActiveActionLayerState from '../ActiveActionLayerState';

import {DRAW_LINE, ERASER} from '../../actionLayer/ActionLayer';

describe('ActiveActionLayerState', () => {
  const DRAW_LINE_SETTING = {
    ctx: {strokeStyle: '#000'},
  };
  const ERASER_SETTING = {
    ctx: {},
  };
  const DATA_URL_TRANSPARENT =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAP0lEQVQ4T2OcOXPmfwYiwL1794hQxcDAOGogznAaDUOcQTMEkk15eTlROUVJSYm4nDJqIM5wGg1D3Dll0CcbAMflUeHimVpmAAAAAElFTkSuQmCC';
  it('props.activeActionLayer の値に応じてアイコンが変わる', () => {
    let wrapper = shallow(
      <ActiveActionLayerState
        activeActionLayer={DRAW_LINE}
        setting={DRAW_LINE_SETTING}
      />
    );
    assert(wrapper.find('.fa-pencil').length === 1);
    assert(wrapper.find('.fa-eraser').length === 0);
    wrapper = shallow(
      <ActiveActionLayerState
        activeActionLayer={ERASER}
        setting={ERASER_SETTING}
      />
    );
    assert(wrapper.find('.fa-pencil').length === 0);
    assert(wrapper.find('.fa-eraser').length === 1);
  });
  it('props.activeActionLayer が DRAW_LINE のときは strokeStyle が表示される', () => {
    const wrapper = shallow(
      <ActiveActionLayerState
        activeActionLayer={DRAW_LINE}
        setting={DRAW_LINE_SETTING}
      />
    );
    const style = wrapper
      .find('[data-test="active-action-layer-color"]')
      .prop('style');
    assert(style.backgroundColor === '#000');
  });
  it('props.activeActionLayer が ERASER のときは 透過画像 が表示される', () => {
    const wrapper = shallow(
      <ActiveActionLayerState
        activeActionLayer={ERASER}
        setting={ERASER_SETTING}
      />
    );
    const style = wrapper
      .find('[data-test="active-action-layer-color"]')
      .prop('style');
    assert(style.backgroundColor === undefined);
    assert(style.backgroundImage === `url(${DATA_URL_TRANSPARENT})`);
  });
});
