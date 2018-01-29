import React from 'react';

export default class ViewLayer extends React.Component {
  constructor(props) {
    super(props);
    this.canvas = null;
    this.ctx = null;
  }
  componentDidMount() {
    const {width, height, imageData} = this.props;
    this.ctx = this.canvas.getContext('2d');
    if (!imageData) {
      if (!width || !height) throw new Error('width or height, is not found.');
      this.canvas.width = width;
      this.canvas.height = height;
      return;
    }
    this.canvas.width = imageData.width;
    this.canvas.height = imageData.height;
    this.ctx.putImageData(imageData, 0, 0);
  }
  render() {
    const {isShow} = this.props;
    return (
      <canvas
        ref={ref => {
          this.canvas = ref;
        }}
        className="layer"
        style={{display: `${isShow ? 'block' : 'none'}`}}
      />
    );
  }
}
