import React from 'react';
import {shallow} from 'enzyme';
import sinon from 'sinon';
import assert from 'assert';

import MouseMoveActionLayer from '../MouseMoveActionLayer';

describe('MouseMoveActionLayer', () => {
  const CANVAS_WIDTH = 40;
  const CANVAS_HEIGHT = 30;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(CANVAS_WIDTH, CANVAS_HEIGHT);
  const LINE_WIDTH = 6;
  const LINE_CAP = 'round';
  const setting = {
    ctx: {
      lineWidth: LINE_WIDTH,
      lineCap: LINE_CAP,
    },
  };
  const DISPLAY_WIDTH = 40;
  const DISPLAY_HEIGHT = 30;
  const DISPLAY_MAGNIFICATION_PERCENT = 100;
  const display = {
    width: DISPLAY_WIDTH,
    height: DISPLAY_HEIGHT,
    magnificationPercent: DISPLAY_MAGNIFICATION_PERCENT,
  };
  const SCROLL_LEFT = 90;
  const SCROLL_TOP = 80;
  document.scrollingElement = {
    scrollLeft: SCROLL_LEFT,
    scrollTop: SCROLL_TOP,
  };
  let wrapper;
  let calledFunc;
  let executeActionReceivedArg;
  let inst;
  beforeEach(() => {
    calledFunc = null;
    executeActionReceivedArg = null;
    wrapper = shallow(
      <MouseMoveActionLayer
        callbackDidMount={() => {
          calledFunc = 'callbackDidMount';
        }}
        callbackDidUpdate={() => {
          calledFunc = 'callbackDidUpdate';
        }}
        executeAction={receivedArg => {
          calledFunc = 'executeAction';
          executeActionReceivedArg = receivedArg;
        }}
        imageData={imageData}
        setting={setting}
        display={display}
        startOmitLengthCount={() => {
          calledFunc = 'startOmitLengthCount';
        }}
        omitImageListHistory={() => {
          calledFunc = 'omitImageListHistory';
        }}
      />,
      {disableLifecycleMethods: true}
    );
    inst = wrapper.instance();
    inst.canvas = document.createElement('canvas');
    inst.ctx = document.createElement('canvas').getContext('2d');
  });
  it('imageDataで渡されたサイズのCanvasが描画される', () => {
    assert(wrapper.find('canvas').prop('width') === CANVAS_WIDTH);
    assert(wrapper.find('canvas').prop('height') === CANVAS_HEIGHT);
  });
  it('マウスイベントによって startOmitLengthCount や omitImageListHistory が実行される', () => {
    assert(calledFunc === null);
    inst.componentDidMount();
    assert(calledFunc === 'callbackDidMount');
    wrapper.find('canvas').simulate('mouseDown', {pageX: 0, pageY: 0});
    assert(calledFunc === 'startOmitLengthCount');
    wrapper.find('canvas').simulate('mouseUp');
    assert(calledFunc === 'omitImageListHistory');
  });
  it('マウスイベントによって state.isAction が適切に切り替わる', () => {
    inst.componentDidMount();
    assert(wrapper.state('isAction') === false);
    wrapper.find('canvas').simulate('mouseDown', {pageX: 0, pageY: 0});
    assert(wrapper.state('isAction') === true);
    wrapper.find('canvas').simulate('mouseUp');
    assert(wrapper.state('isAction') === false);
  });
  it('ディスプレイの範囲外を押下しても、state.isAction は切り替わらない', () => {
    inst.componentDidMount();
    const {x, y} = inst.canvasStartPosition;
    assert(wrapper.state('isAction') === false);
    wrapper.find('canvas').simulate('mouseDown', {
      pageX: x + DISPLAY_WIDTH + 1,
      pageY: y + DISPLAY_HEIGHT,
    });
    assert(wrapper.state('isAction') === false);
    wrapper.find('canvas').simulate('mouseDown', {
      pageX: x + DISPLAY_WIDTH,
      pageY: y + DISPLAY_HEIGHT,
    });
    assert(wrapper.state('isAction') === true);
  });
  it('componentDidMount すると props.callbackDidMount が実行される', () => {
    assert(calledFunc === null);
    inst.componentDidMount();
    assert(calledFunc === 'callbackDidMount');
  });
  it('componentDidMount すると ctx に props.setting で渡された内容が反映される', () => {
    assert(inst.ctx.lineWidth === 1);
    assert(inst.ctx.lineCap === 'butt');
    inst.componentDidMount();
    assert(inst.ctx.lineWidth === LINE_WIDTH);
    assert(inst.ctx.lineCap === LINE_CAP);
  });
  it('componentDidUpdate すると props.callbackDidUpdate と this.loadContextSetting が実行される', () => {
    const spy = sinon.spy(inst, 'loadContextSetting');
    assert(calledFunc === null);
    assert(spy.callCount === 0);
    inst.componentDidUpdate();
    assert(calledFunc === 'callbackDidUpdate');
    assert(spy.callCount === 1);
    spy.restore();
  });
  it('getCurrentPoint で、押下したポイントを取得できる', () => {
    inst.componentDidMount();
    const result = inst.getCurrentPoint(100, 105);
    assert(result.x === 100 - inst.canvasStartPosition.x);
    assert(result.y === 105 - inst.canvasStartPosition.y);
  });
  it('mouseDown の後に mouseMove すると props.executeAction が実行される', () => {
    assert(calledFunc === null);
    inst.componentDidMount();
    wrapper.find('canvas').simulate('mouseDown', {pageX: 0, pageY: 0});
    wrapper.find('canvas').simulate('mouseMove', {pageX: 0, pageY: 0});
    assert(calledFunc === 'executeAction');
  });
  it('executeAction に、正しくポイントが渡される', () => {
    inst.componentDidMount();
    assert(executeActionReceivedArg === null);
    wrapper.find('canvas').simulate('mouseDown', {pageX: 100, pageY: 60});
    wrapper.find('canvas').simulate('mouseMove', {pageX: 110, pageY: 70});
    const {x, y} = inst.canvasStartPosition;
    assert(executeActionReceivedArg.startPoint.x === 100 - x);
    assert(executeActionReceivedArg.startPoint.y === 60 - y);
    assert(executeActionReceivedArg.currentPoint.x === 110 - x);
    assert(executeActionReceivedArg.currentPoint.y === 70 - y);
  });
  it('switchCurrentPointToStartPoint で受け取った値が state.startPoint になる', () => {
    assert(wrapper.state('startPoint').x === 0);
    assert(wrapper.state('startPoint').y === 0);
    inst.switchCurrentPointToStartPoint({x: 33, y: 44});
    assert(wrapper.state('startPoint').x === 33);
    assert(wrapper.state('startPoint').y === 44);
  });
  it('mouseDown の後に mouseMove すると switchCurrentPointToStartPoint が呼び出される', () => {
    inst.componentDidMount();
    const spy = sinon.spy(inst, 'switchCurrentPointToStartPoint');
    assert(spy.callCount === 0);
    wrapper.find('canvas').simulate('mouseDown', {pageX: 0, pageY: 0});
    assert(spy.callCount === 0);
    wrapper.find('canvas').simulate('mouseMove', {pageX: 0, pageY: 0});
    assert(spy.callCount === 1);
    spy.restore();
  });
});
