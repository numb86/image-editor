// @flow
import React from 'react';
import ClassNames from 'classnames';

import Display from './Display';

const onDrop = files => console.log(files);

type Props = {||};
type State = {isDragOver: boolean};

export default class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {isDragOver: false};
  }
  render() {
    const classNames = ClassNames({
      app: true,
      'file-drag-over-area': this.state.isDragOver,
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
          children-element
        </Display>
      </div>
    );
  }
}
