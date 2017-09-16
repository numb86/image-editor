import React from 'react';
import ClassNames from 'classnames';

export default class FileDropArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isDragOver: false};
  }
  render() {
    const classNames = ClassNames({
      'file-drag-over-are': this.state.isDragOver,
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
