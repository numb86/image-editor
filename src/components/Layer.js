import React from 'react';

export default class Layer extends React.Component {
  constructor(props) {
    super(props);
    this.canvas = null;
    this.ctx = null;
  }
  componentDidMount() {
    this.ctx = this.canvas.getContext('2d');
  }
  render() {
    const {width, height, isShow} = this.props;
    return (
      <canvas
        ref={ref => {
          this.canvas = ref;
        }}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          display: `${isShow ? 'block' : 'none'}`,
        }}
      />
    );
  }
}
