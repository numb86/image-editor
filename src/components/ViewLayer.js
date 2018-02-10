// @flow
import React from 'react';

type Props = {
  imageData: ImageData,
  isShow: boolean,
};

export default class ViewLayer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.canvas = null;
    this.ctx = null;
  }
  componentDidMount() {
    const {imageData} = this.props;
    if (!this.canvas) throw new Error('this.canvas is not found.');
    this.ctx = this.canvas.getContext('2d');
    if (!this.canvas) throw new Error('this.canvas is not found.');
    this.canvas.width = imageData.width;
    this.canvas.height = imageData.height;
    this.ctx.putImageData(imageData, 0, 0);
  }
  componentDidUpdate() {
    const {imageData} = this.props;
    if (!this.canvas) throw new Error('this.canvas is not found.');
    this.canvas.width = imageData.width;
    this.canvas.height = imageData.height;
    if (!this.ctx) throw new Error('this.ctx is not found.');
    this.ctx.putImageData(imageData, 0, 0);
  }
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null;
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
