// @flow
import React from 'react';
import ClassNames from 'classnames';

import Display from './Display';
import ViewLayerList from './ViewLayerList';
import ActionLayer from './actionLayer/ActionLayer';

import {generateImageList, SPECIFY_PROPERTY} from '../generateImageList';
import initialState from '../state';

import type {Image} from '../image';
import type {ActiveActionLayer} from './actionLayer/ActionLayer';

type Props = {||};
type State = {
  isDragOver: boolean,
  imageList: Image[],
  display: {
    width: number,
    height: number,
    magnificationPercent: number,
  },
  activeImageId: number,
  activeActionLayer: ActiveActionLayer,
};

export default class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = initialState;
  }
  getActiveImage(): Image {
    const {imageList, activeImageId} = this.state;
    return imageList.filter(image => image.id === activeImageId)[0];
  }
  render() {
    const {
      isDragOver,
      imageList,
      display,
      activeImageId,
      activeActionLayer,
    } = this.state;
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
        <button
          onClick={() => {
            const updatedState = generateImageList({
              type: SPECIFY_PROPERTY,
              data: {isShow: false},
              currentState: imageList,
              target: 0,
            });
            this.setState({imageList: updatedState});
          }}
        >
          動作確認用のボタン
        </button>
        <Display {...display}>
          <ViewLayerList viewLayerDataList={imageList} />
          <ActionLayer
            activeActionLayer={activeActionLayer}
            imageData={this.getActiveImage().imageData}
            updateImageData={imageData => {
              const updatedState = generateImageList({
                type: SPECIFY_PROPERTY,
                data: {imageData},
                currentState: imageList,
                target: activeImageId,
              });
              this.setState({imageList: updatedState});
            }}
          />
        </Display>
        {isDragOver && (
          <div className="guide-file-drop">画像をドロップすると新しくレイヤーが作られます</div>
        )}
      </div>
    );
  }
}
