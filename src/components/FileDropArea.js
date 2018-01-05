// @flow
//  React.Node という型を指定するためにはこのようにReactをimportする必要がある
import * as React from 'react';
import ClassNames from 'classnames';

type Props = {
  size: {width: number, height: number},
  onDrop: (files: FileList) => void,
  children?: React.Node,
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
    const {children} = this.props;
    const {width, height} = this.props.size;
    const classNames = ClassNames({
      'file-drop-area': true,
      'file-drag-over-area': this.state.isDragOver,
    });
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
        {!children && <span>ここに画像をドロップすることでもアップロードできます</span>}
        {children}
      </div>
    );
  }
}
