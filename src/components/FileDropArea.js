// @flow
//  React.Node という型を指定するためにはこのようにReactをimportする必要がある
import * as React from 'react';
import ClassNames from 'classnames';

type Props = {
  size: {width: number, height: number},
  onDrop: (files: FileList) => void,
  children?: React.Node,
  isWrapImage: boolean,
};

type State = {
  isDragOver: boolean,
};

export default class FileDropArea extends React.Component<Props, State> {
  static defaultProps = {
    size: {width: 600, height: 400},
  };
  constructor(props: Props) {
    super(props);
    this.state = {isDragOver: false};
  }
  render() {
    const {isWrapImage} = this.props;
    const classNames = ClassNames({
      'file-drop-area': true,
      'file-drag-over-area': this.state.isDragOver,
    });
    const {width, height} = this.props.size;
    return (
      <div
        className={classNames}
        style={{width, height}}
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
        {!isWrapImage && <span>ここに画像をドロップすることでもアップロードできます</span>}
        {isWrapImage && this.props.children}
      </div>
    );
  }
}
