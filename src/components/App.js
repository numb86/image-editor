// @flow
import React from 'react';
import ClassNames from 'classnames';

import Display from './Display';
import ViewLayerList from './ViewLayerList';
import {ActionLayer, DRAW_LINE, ERASER} from './actionLayer/ActionLayer';

import {
  generateImageList,
  SPECIFY_IMAGE_PROPERTY,
} from '../state/generateImageList';
import {
  generateActionLayerSettings,
  SPECIFY_CONTEXT_PROPERTY,
} from '../state/generateActionLayerSettings';
import initialState from '../state/initialState';

import type {Image} from '../image';
import type {ActionLayerName} from './actionLayer/ActionLayer';
import type {ActionLayerSettings} from '../state/generateActionLayerSettings';

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
  activeActionLayer: ActionLayerName,
  actionLayerSettings: ActionLayerSettings,
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
      actionLayerSettings,
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
            this.setState({
              activeActionLayer:
                this.state.activeActionLayer === DRAW_LINE ? ERASER : DRAW_LINE,
            });
          }}
        >
          ペン ⇔ 消しゴム
        </button>
        <button
          onClick={() => {
            const newValue =
              actionLayerSettings.drawLine.ctx.lineWidth === 1 ? 15 : 1;
            const newSetting = generateActionLayerSettings({
              type: SPECIFY_CONTEXT_PROPERTY,
              currentState: actionLayerSettings,
              data: {lineWidth: newValue},
              target: 'drawLine',
            });
            this.setState({actionLayerSettings: newSetting});
          }}
        >
          ペン（太） ⇔　ペン（細）
        </button>
        <Display {...display}>
          <ViewLayerList viewLayerDataList={imageList} />
          <ActionLayer
            activeActionLayer={activeActionLayer}
            imageData={this.getActiveImage().imageData}
            setting={actionLayerSettings[activeActionLayer]}
            updateImageData={imageData => {
              const updatedState = generateImageList({
                type: SPECIFY_IMAGE_PROPERTY,
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
