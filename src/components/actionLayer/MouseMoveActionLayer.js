import React from 'react';

export default class MouseMoveActionLayer extends React.Component {
  constructor(props) {
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
    this.ctx = this.canvas.getContext('2d');
    const {x, y} = this.canvas.getBoundingClientRect();
    this.canvasStartPosition = {x, y};
    this.props.callbackDidMount({
      canvas: this.canvas,
      ctx: this.ctx,
    });
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
    const {canvasStartPosition} = this;
    return {
      x: mouseEventPageX - canvasStartPosition.x,
      y: mouseEventPageY - canvasStartPosition.y,
    };
  }
  startAction() {
    this.setState({isAction: true});
  }
  stopAction() {
    this.setState({isAction: false});
  }
  switchCurrentPointToStartPoint(currentPoint) {
    this.setState({
      startPoint: currentPoint,
    });
  }
  render() {
    const {width, height} = this.props.imageData;
    const {opacity} = this.props;
    return (
      <canvas
        className="layer"
        style={{opacity}}
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
