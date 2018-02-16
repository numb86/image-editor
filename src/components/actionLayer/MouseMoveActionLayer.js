// @flow
import React from 'react';

import type {MouseMoveActionLayerSetting} from '../../state/generateActionLayerSettings';

type Point = {x: number, y: number};

type Props = {
  callbackDidMount: ({ctx: CanvasRenderingContext2D}) => void,
  callbackDidUpdate: ({ctx: CanvasRenderingContext2D}) => void,
  executeAction: ({
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    startPoint: Point,
    currentPoint: Point,
  }) => void,
  imageData: ImageData,
  setting: MouseMoveActionLayerSetting,
};

type State = {
  isAction: boolean,
  startPoint: Point,
};

export default class MouseMoveActionLayer extends React.Component<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isAction: false,
      startPoint: {x: 0, y: 0},
    };
    this.canvas = null;
    this.ctx = null;
    this.canvasStartPosition = null;
  }
  componentDidMount() {
    const {canvas} = this;
    if (!canvas) throw new Error('canvas is null.');
    this.ctx = canvas.getContext('2d');
    const {x, y} = ((canvas.getBoundingClientRect(): any): DOMRect);
    this.canvasStartPosition = {x, y};
    const {ctx} = this;
    if (!ctx) throw new Error('ctx is null.');
    this.loadContextSetting(ctx);
    this.props.callbackDidMount({ctx});
  }
  componentDidUpdate() {
    const {ctx} = this;
    if (!ctx) throw new Error('ctx is null.');
    this.loadContextSetting(ctx);
    this.props.callbackDidUpdate({ctx});
  }
  setStartPoint(mouseEventPageX: number, mouseEventPageY: number) {
    const {canvasStartPosition} = this;
    if (!canvasStartPosition) throw new Error('canvasStartPosition is null.');
    this.setState({
      startPoint: {
        x: mouseEventPageX - canvasStartPosition.x,
        y: mouseEventPageY - canvasStartPosition.y,
      },
    });
  }
  getCurrentPoint(mouseEventPageX: number, mouseEventPageY: number): Point {
    const {canvasStartPosition} = this;
    if (!canvasStartPosition) throw new Error('canvasStartPosition is null.');
    return {
      x: mouseEventPageX - canvasStartPosition.x,
      y: mouseEventPageY - canvasStartPosition.y,
    };
  }
  loadContextSetting(ctx: CanvasRenderingContext2D) {
    Object.assign(ctx, this.props.setting.ctx);
  }

  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null;
  canvasStartPosition: Point | null;

  startAction() {
    this.setState({isAction: true});
  }
  stopAction() {
    this.setState({isAction: false});
  }
  switchCurrentPointToStartPoint(currentPoint: Point) {
    this.setState({
      startPoint: currentPoint,
    });
  }
  render() {
    const {width, height} = this.props.imageData;
    return (
      <canvas
        className="action-layer"
        width={width}
        height={height}
        ref={ref => {
          this.canvas = ref;
        }}
        onMouseDown={e => {
          this.startAction();
          this.setStartPoint(e.pageX, e.pageY);
        }}
        onMouseMove={e => {
          if (!this.state.isAction) return;
          const currentPoint = this.getCurrentPoint(e.pageX, e.pageY);
          if (!this.canvas) throw new Error('this.canvas is null.');
          if (!this.ctx) throw new Error('this.ctx is null.');
          this.props.executeAction({
            canvas: this.canvas,
            ctx: this.ctx,
            startPoint: this.state.startPoint,
            currentPoint,
          });
          this.switchCurrentPointToStartPoint(currentPoint);
        }}
        onMouseUp={() => {
          this.stopAction();
        }}
        onMouseLeave={() => {
          this.stopAction();
        }}
      />
    );
  }
}
