// @flow
import React from 'react';

import SketchCanvas from './SketchCanvas';
import FileDropArea from './FileDropArea';

type Props = {
  src: string,
  onDrop: (files: FileList) => void,
};

type State = {
  sketchCanvasSize: {width: number, height: number},
};

export default class PreviewImage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {sketchCanvasSize: {width: 0, height: 0}};
  }
  componentDidMount() {
    this.getUpdatedImageSize().then(res => {
      this.setState({sketchCanvasSize: res});
    });
  }
  getUpdatedImageSize(): Promise<{width: number, height: number}> {
    return new Promise(resolve => {
      const image = new Image();
      image.onload = () => {
        const {width, height} = image;
        resolve({width, height});
      };
      image.src = this.props.src;
    });
  }
  render() {
    return (
      <FileDropArea
        onDrop={this.props.onDrop}
        isWrapImage
        size={this.state.sketchCanvasSize}
      >
        <img src={this.props.src} alt="プレビュー画像" className="upload-image" />
        <SketchCanvas size={this.state.sketchCanvasSize} />
      </FileDropArea>
    );
  }
}
