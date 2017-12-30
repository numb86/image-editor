import React from 'react';

const SKETCH_CANVAS_COMPONENT_ID = 'sketch-canvas';

export default class SketchCanvas extends React.Component {
  constructor() {
    super();
    this.state = {
      isDrawing: false,
      startPoint: {x: 0, y: 0},
      currentPoint: {x: 0, y: 0},
    };
    this.canvasElement = null;
    this.ctx = null;
    this.canvasStartPosition = null;
  }
  componentDidMount() {
    this.canvasElement = document.querySelector(
      `#${SKETCH_CANVAS_COMPONENT_ID}`
    );
    this.ctx = this.canvasElement.getContext('2d');
    const {x, y} = this.canvasElement.getBoundingClientRect();
    this.canvasStartPosition = {x, y};
  }
  setStartPoint(mouseEventPageX, mouseEventPageY) {
    this.setState({
      startPoint: {
        x: mouseEventPageX - this.canvasStartPosition.x,
        y: mouseEventPageY - this.canvasStartPosition.y,
      },
    });
  }
  setCurrentPoint(mouseEventPageX, mouseEventPageY) {
    this.setState({
      currentPoint: {
        x: mouseEventPageX - this.canvasStartPosition.x,
        y: mouseEventPageY - this.canvasStartPosition.y,
      },
    });
  }
  startDraw() {
    this.setState({isDrawing: true});
  }
  stopDraw() {
    this.setState({isDrawing: false});
  }
  drawLine() {
    const {ctx} = this;
    const {startPoint, currentPoint} = this.state;
    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(currentPoint.x, currentPoint.y);
    ctx.stroke();
  }
  switchCurrentPointToStartPoint() {
    this.setState({
      startPoint: this.state.currentPoint,
    });
  }
  changeSetting(key, value) {
    this.ctx[key] = value;
  }
  eraseAll() {
    const {ctx, canvasElement} = this;
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  }
  render() {
    const style = this.props.show
      ? {visibility: 'visible'}
      : {visibility: 'hidden'};
    return (
      <canvas
        id={SKETCH_CANVAS_COMPONENT_ID}
        style={style}
        onMouseDown={e => {
          this.startDraw();
          this.setStartPoint(e.pageX, e.pageY);
        }}
        onMouseMove={e => {
          if (!this.state.isDrawing) return;
          this.setCurrentPoint(e.pageX, e.pageY);
          this.drawLine();
          this.switchCurrentPointToStartPoint();
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
