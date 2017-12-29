// @flow
import React from 'react';
import ClassNames from 'classnames';

type Props = {
  src: string | null,
  onDrop: (files: FileList) => void,
};

type State = {
  isDragOver: boolean,
};

export default class PreviewImage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {isDragOver: false};
  }
  render() {
    const classNames = ClassNames({
      'upload-image': true,
      'file-drag-over-area': this.state.isDragOver,
    });
    return (
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
    );
  }
}
