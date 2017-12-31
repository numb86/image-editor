import React from 'react';

const SKETCH_CANVAS_COMPONENT_ID = 'sketch-canvas';

let previousData = null;

export default class SketchCanvas extends React.Component {
  constructor(props) {
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
    this.canvasElement = document.querySelector(
      `#${SKETCH_CANVAS_COMPONENT_ID}`
    );
    this.ctx = this.canvasElement.getContext('2d');
    const {x, y} = this.canvasElement.getBoundingClientRect();
    this.canvasStartPosition = {x, y};
  }
  componentWillUnmount() {
    previousData = this.canvasElement.toDataURL();
  }
  setStartPoint(mouseEventPageX, mouseEventPageY) {
    this.setState({
      startPoint: {
        x: mouseEventPageX - this.canvasStartPosition.x,
        y: mouseEventPageY - this.canvasStartPosition.y,
      },
    });
  }
  getCurrentPoint(mouseEventPageX, mouseEventPageY) {
    return {
      x: mouseEventPageX - this.canvasStartPosition.x,
      y: mouseEventPageY - this.canvasStartPosition.y,
    };
  }
  restoreImage(data) {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('ctx is null.');
      ctx.drawImage(image, 0, 0, image.width, image.height);
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
  drawLine(currentPoint) {
    const {ctx} = this;
    const {startPoint} = this.state;
    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(currentPoint.x, currentPoint.y);
    ctx.stroke();
  }
  switchCurrentPointToStartPoint(currentPoint) {
    this.setState({
      startPoint: currentPoint,
    });
  }
  changeSetting(key, value) {
    this.ctx[key] = value;
  }
  eraseAll() {
    const {ctx, canvasElement} = this;
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  }
  changeCanvasSize(imageWidth, imageHeight) {
    const {canvasElement} = this;
    if (!canvasElement) return;
    const {width: currentWidth, height: currentHeight} = canvasElement;
    if (imageWidth === currentWidth && imageHeight === currentHeight) return;
    this.canvasElement.width = imageWidth;
    this.canvasElement.height = imageHeight;
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
