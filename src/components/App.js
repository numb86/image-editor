// @flow
import React from 'react';
import ClassNames from 'classnames';

import Display from './Display';
import ViewLayer from './ViewLayer';

// TODO 動作確認のための暫定的なコード
const onDrop = files => console.log(files);
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
ctx.fillRect(10, 10, 120, 60);
const imageData = ctx.getImageData(0, 0, 180, 180);

type Props = {||};
type State = {isDragOver: boolean};

export default class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {isDragOver: false};
  }
  render() {
    const {isDragOver} = this.state;
    const classNames = ClassNames({
      app: true,
      'file-drag-over-area': isDragOver,
    });
    return (
      <div
        className={classNames}
        onDrop={e => {
          e.preventDefault();
          this.setState({isDragOver: false});
          onDrop(e.dataTransfer.files);
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
          if (e.clientX === 0) this.setState({isDragOver: false});
        }}
      >
        <Display width={500} height={500} magnificationPercent={100}>
          <ViewLayer width={200} height={200} isShow imageData={imageData} />
          <ViewLayer width={200} height={200} isShow imageData={imageData} />
        </Display>
        {isDragOver && (
          <div className="guide-file-drop">画像をドロップすると新しくレイヤーが作られます</div>
        )}
      </div>
    );
  }
}
