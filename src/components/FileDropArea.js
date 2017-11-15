// @flow
import React from 'react';
import ClassNames from 'classnames';

type Props = {
  onDrop: (files: FileList) => void,
};

type State = {
  isDragOver: boolean,
};

export default class FileDropArea extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {isDragOver: false};
  }
  render() {
    const classNames = ClassNames({
      'file-drop-area': true,
      'file-drag-over-area': this.state.isDragOver,
    });
    return (
      <div
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
      >
        ここに画像をドロップすることでもアップロードできます
      </div>
    );
  }
}
