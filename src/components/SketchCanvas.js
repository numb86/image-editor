import React from 'react';

const SKETCH_CANVAS_COMPONENT_ID = 'sketch-canvas';

export default class SketchCanvas extends React.Component {
  componentDidMount() {
    this.canvasElement = document.querySelector(
      `#${SKETCH_CANVAS_COMPONENT_ID}`
    );
    this.ctx = this.canvasElement.getContext('2d');
    const {x, y} = this.canvasElement.getBoundingClientRect();
    this.canvasStartPosition = {x, y};
    this.startPoint = {x: 0, y: 0};
    this.currentPoint = {x: 0, y: 0};
    this.isDrawing = false;
  }
  setStartPoint(mouseEventPageX, mouseEventPageY) {
    this.startPoint = {
      x: mouseEventPageX - this.canvasStartPosition.x,
      y: mouseEventPageY - this.canvasStartPosition.y,
    };
  }
  setCurrentPoint(mouseEventPageX, mouseEventPageY) {
    this.currentPoint = {
      x: mouseEventPageX - this.canvasStartPosition.x,
      y: mouseEventPageY - this.canvasStartPosition.y,
    };
  }
  startDraw() {
    this.isDrawing = true;
  }
  stopDraw() {
    this.isDrawing = false;
  }
  drawLine() {
    const {ctx, startPoint, currentPoint} = this;
    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(currentPoint.x, currentPoint.y);
    ctx.stroke();
  }
  switchCurrentPointToStartPoint() {
    this.startPoint = this.currentPoint;
  }
  changeSetting(key, value) {
    this.ctx[key] = value;
  }
  eraseAll() {
    const {ctx, canvasElement} = this;
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  }
  render() {
    return (
      <canvas
        id={SKETCH_CANVAS_COMPONENT_ID}
        onMouseDown={e => {
          this.startDraw();
          this.setStartPoint(e.pageX, e.pageY);
        }}
        onMouseMove={e => {
          if (!this.isDrawing) return;
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
