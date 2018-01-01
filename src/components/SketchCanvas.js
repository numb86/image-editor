// @flow
import React from 'react';

const SKETCH_CANVAS_COMPONENT_ID = 'sketch-canvas';

let previousData = null;

type Point = {x: number, y: number};
type Props = {
  size: {width: number, height: number},
};
type State = {
  isDrawing: boolean,
  startPoint: Point,
};

export default class SketchCanvas extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isDrawing: false,
      startPoint: {x: 0, y: 0},
    };
    this.canvasElement = null;
    this.ctx = null;
    this.canvasStartPosition = null;
    if (previousData) this.restoreImage(previousData);
  }

  componentDidMount() {
    this.canvasElement = ((document.querySelector(
      `#${SKETCH_CANVAS_COMPONENT_ID}`
    ): any): HTMLCanvasElement);
    const canvasElement = this.canvasElement;
    this.ctx = canvasElement.getContext('2d');
    const {x, y} = ((canvasElement.getBoundingClientRect(): any): DOMRect);
    this.canvasStartPosition = {x, y};
  }
  componentWillUnmount() {
    if (!this.canvasElement) throw new Error('this.canvasElement is null.');
    previousData = this.canvasElement.toDataURL();
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

  canvasElement: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null;
  canvasStartPosition: Point | null;

  restoreImage(data: string) {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('ctx is null.');
      ctx.drawImage(image, 0, 0, image.width, image.height);
      if (!this.ctx) throw new Error('this.ctx is null.');
      this.ctx.drawImage(canvas, 0, 0);
    };
    image.src = data;
  }
  startDraw() {
    this.setState({isDrawing: true});
  }
  stopDraw() {
    this.setState({isDrawing: false});
  }
  drawLine(currentPoint: Point) {
    const {ctx} = this;
    if (!ctx) return;
    const {startPoint} = this.state;
    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(currentPoint.x, currentPoint.y);
    ctx.stroke();
  }
  switchCurrentPointToStartPoint(currentPoint: Point) {
    this.setState({
      startPoint: currentPoint,
    });
  }
  changeSetting(key: string, value: string) {
    const {ctx} = this;
    if (!ctx) return;
    Object.assign(ctx, {[key]: value});
  }
  eraseAll() {
    const {ctx, canvasElement} = this;
    if (!ctx || !canvasElement) return;
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  }
  changeCanvasSize(imageWidth: number, imageHeight: number) {
    const {canvasElement} = this;
    if (!canvasElement) return;
    const {width: currentWidth, height: currentHeight} = canvasElement;
    if (imageWidth === currentWidth && imageHeight === currentHeight) return;
    canvasElement.width = imageWidth;
    canvasElement.height = imageHeight;
    if (previousData) this.restoreImage(previousData);
  }

  render() {
    const {width, height} = this.props.size;
    this.changeCanvasSize(width, height);
    return (
      <canvas
        id={SKETCH_CANVAS_COMPONENT_ID}
        onMouseDown={e => {
          this.startDraw();
          this.setStartPoint(e.pageX, e.pageY);
        }}
        onMouseMove={e => {
          if (!this.state.isDrawing) return;
          const currentPoint = this.getCurrentPoint(e.pageX, e.pageY);
          this.drawLine(currentPoint);
          this.switchCurrentPointToStartPoint(currentPoint);
        }}
        onMouseUp={() => {
          this.stopDraw();
        }}
        onMouseLeave={() => {
          this.stopDraw();
        }}
      />
    );
  }
}
