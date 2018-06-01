// @flow
import React from 'react';

import type {DisplayType} from '../Display';
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
  display: DisplayType,
  startOmitLengthCount: () => void,
  omitImageListHistory: () => void,
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
    this.canvasStartPosition = {x: null, y: null};
  }
  componentDidMount() {
    const {canvas} = this;
    if (!canvas) throw new Error('canvas is null.');
    this.ctx = canvas.getContext('2d');
    const {left, top} = ((canvas.getBoundingClientRect(): any): DOMRect);
    if (!document.scrollingElement) {
      throw new Error('document.scrollingElement is undefined.');
    }
    const {scrollTop, scrollLeft} = (document.scrollingElement: any);
    this.canvasStartPosition.x = left + scrollLeft;
    this.canvasStartPosition.y = top + scrollTop;
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
    const {x, y} = this.canvasStartPosition;
    if (!x || !y) throw new Error('canvasStartPosition is null.');
    this.setState({
      startPoint: {
        x: mouseEventPageX - x,
        y: mouseEventPageY - y,
      },
    });
  }
  getCurrentPoint(mouseEventPageX: number, mouseEventPageY: number): Point {
    const {x, y} = this.canvasStartPosition;
    if (!x || !y) throw new Error('canvasStartPosition is null.');
    return {
      x: mouseEventPageX - x,
      y: mouseEventPageY - y,
    };
  }
  loadContextSetting(ctx: CanvasRenderingContext2D) {
    Object.assign(ctx, this.props.setting.ctx);
  }
  isOutsideDisplay(mouseEventPageX: number, mouseEventPageY: number): boolean {
    const {x, y} = this.canvasStartPosition;
    if (!x || !y) throw new Error('canvasStartPosition is null.');
    const targetX = mouseEventPageX - x;
    const targetY = mouseEventPageY - y;
    const {width, height} = this.props.display;
    return targetX > width || targetY > height;
  }

  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null;
  canvasStartPosition: {x: number | null, y: number | null};

  startAction() {
    this.props.startOmitLengthCount();
    this.setState({isAction: true});
  }
  stopAction() {
    this.setState({isAction: false});
    this.props.omitImageListHistory();
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
        ref={ref => {
          this.canvas = ref;
        }}
        width={width}
        height={height}
        onMouseDown={e => {
          if (this.isOutsideDisplay(e.pageX, e.pageY)) return;
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
