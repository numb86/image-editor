// @flow
import React from 'react';
import ClassNames from 'classnames';

type Prop = {
  src: string | null,
  onDrop: (files: FileList) => void,
};

type State = {
  isDragOver: boolean,
};

export default class FileDropArea extends React.Component {
  constructor(props: Prop) {
    super(props);
    this.state = {isDragOver: false};
  }
  state: State;
  props: Prop;
  render() {
    const classNames = ClassNames({
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
