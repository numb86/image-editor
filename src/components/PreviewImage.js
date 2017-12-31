// @flow
import React from 'react';
import ClassNames from 'classnames';

import SketchCanvas from './SketchCanvas';

type Props = {
  src: string | null,
  onDrop: (files: FileList) => void,
};

type State = {
  isDragOver: boolean,
  sketchCanvasSize: {width: number, height: number},
};

export default class PreviewImage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {isDragOver: false, sketchCanvasSize: {width: 0, height: 0}};
  }
  componentDidMount() {
    this.getUpdatedImageSize().then(res => {
      this.setState({sketchCanvasSize: res});
    });
  }
  getUpdatedImageSize() {
    return new Promise(resolve => {
      const src = this.props.src;
      const image = new Image();
      image.onload = () => {
        const {width, height} = image;
        resolve({width, height});
      };
      image.src = src;
    });
  }
  render() {
    const classNames = ClassNames({
      'upload-image': true,
      'file-drag-over-area': this.state.isDragOver,
    });
    return (
      <div>
        <img
          src={this.props.src}
          alt="プレビュー画像"
          className={classNames}
          onDrop={e => {
            e.preventDefault();
            this.setState({isDragOver: false});
            this.props.onDrop(e.dataTransfer.files);
          }}
          onDragOver={e => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
          }}
          onDragEnter={e => {
            e.preventDefault();
            this.setState({isDragOver: true});
          }}
          onDragLeave={e => {
            e.preventDefault();
            this.setState({isDragOver: false});
          }}
        />
        <SketchCanvas size={this.state.sketchCanvasSize} />
      </div>
    );
  }
}
