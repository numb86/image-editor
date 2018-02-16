import React from 'react';
import {shallow} from 'enzyme';
import sinon from 'sinon';
import assert from 'assert';

import MouseMoveActionLayer from '../MouseMoveActionLayer';

describe('MouseMoveActionLayer', () => {
  const WIDTH = 40;
  const HEIGHT = 30;
  const CANVAS_START_POSITION = {x: 200, y: 200};
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(WIDTH, HEIGHT);
  const LINE_WIDTH = 6;
  const LINE_CAP = 'round';
  const setting = {
    ctx: {
      lineWidth: LINE_WIDTH,
      lineCap: LINE_CAP,
    },
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
      />,
      {disableLifecycleMethods: true}
    );
    inst = wrapper.instance();
    inst.canvas = document.createElement('canvas');
    inst.ctx = document.createElement('canvas').getContext('2d');
    inst.canvasStartPosition = CANVAS_START_POSITION;
  });
  it('imageDataで渡されたサイズのCanvasが描画される', () => {
    assert(wrapper.length === 1);
    assert(wrapper.find('canvas').length === 1);
    assert(wrapper.find('canvas').prop('width') === WIDTH);
    assert(wrapper.find('canvas').prop('height') === HEIGHT);
  });
  it('マウスイベントによって state.isAction が適切に切り替わる', () => {
    assert(wrapper.state('isAction') === false);
    wrapper.find('canvas').simulate('mouseDown', {pageX: 0, pageY: 0});
    assert(wrapper.state('isAction') === true);
    wrapper.find('canvas').simulate('mouseUp');
    assert(wrapper.state('isAction') === false);
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
    const result = inst.getCurrentPoint(100, 105);
    assert(result.x === 100 - CANVAS_START_POSITION.x);
    assert(result.y === 105 - CANVAS_START_POSITION.y);
  });
  it('mouseDown の後に mouseMove すると props.executeAction が実行される', () => {
    assert(calledFunc === null);
    wrapper.find('canvas').simulate('mouseDown', {pageX: 0, pageY: 0});
    wrapper.find('canvas').simulate('mouseMove', {pageX: 0, pageY: 0});
    assert(calledFunc === 'executeAction');
  });
  it('executeAction に、正しくポイントが渡される', () => {
    assert(executeActionReceivedArg === null);
    wrapper.find('canvas').simulate('mouseDown', {pageX: 100, pageY: 60});
    wrapper.find('canvas').simulate('mouseMove', {pageX: 110, pageY: 70});
    const {x, y} = CANVAS_START_POSITION;
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
    const spy = sinon.spy(inst, 'switchCurrentPointToStartPoint');
    assert(spy.callCount === 0);
    wrapper.find('canvas').simulate('mouseDown', {pageX: 0, pageY: 0});
    assert(spy.callCount === 0);
    wrapper.find('canvas').simulate('mouseMove', {pageX: 0, pageY: 0});
    assert(spy.callCount === 1);
    spy.restore();
  });
});
