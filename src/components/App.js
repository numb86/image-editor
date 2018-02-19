// @flow
import React from 'react';
import ClassNames from 'classnames';

import Display from './Display';
import ViewLayerList from './ViewLayerList';
import {ActionLayer, DRAW_LINE, ERASER} from './actionLayer/ActionLayer';

import synthesizeImageData from '../synthesizeImageData';
import {
  generateImageList,
  SPECIFY_IMAGE_PROPERTY,
  ADD_NEW_IMAGE,
} from '../state/generateImageList';
import {
  generateActionLayerSettings,
  SPECIFY_CONTEXT_PROPERTY,
} from '../state/generateActionLayerSettings';
import initialState from '../state/initialState';
import convertBlobToImageData from '../file/convertBlobToImageData';

import type {Image} from '../image';
import type {ActionLayerName} from './actionLayer/ActionLayer';
import type {ActionLayerSettings} from '../state/generateActionLayerSettings';

const MIME_PING = 'image/png';
const MIME_JPEG = 'image/jpeg';
const ALLOW_FILE_TYPES = [MIME_PING, MIME_JPEG];

type Props = {||};
type State = {
  isDragOver: boolean,
  imageList: Image[],
  display: {
    width: number,
    height: number,
    magnificationPercent: number,
  },
  activeActionLayer: ActionLayerName,
  actionLayerSettings: ActionLayerSettings,
};

function isAllowedFileType(uploadedFileType: string): boolean {
  return ALLOW_FILE_TYPES.some(
    allowFileType => allowFileType === uploadedFileType
  );
}

export default class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = initialState;
  }
  getActiveImage(): Image {
    return this.state.imageList.filter(image => image.active === true)[0];
  }
  uploadImageFile(files: FileList): void {
    if (files.length > 1) {
      this.handleError('複数のファイルは選べません');
      return;
    }
    const file = files[0];
    if (!file) return; // ファイルアップロードのダイアログでキャンセルした場合の対応
    if (!isAllowedFileType(file.type)) {
      this.handleError('対応しているファイルはjpegとpngのみです');
      return;
    }
    convertBlobToImageData(file).then(imageData => {
      const updatedState = generateImageList({
        type: ADD_NEW_IMAGE,
        data: {imageData},
        currentState: this.state.imageList,
      });
      const {width, height} = this.state.display;
      const changeWidth = imageData.width > width ? imageData.width : width;
      const changeHeight =
        imageData.height > height ? imageData.height : height;
      if (changeWidth !== width || changeHeight !== height) {
        this.changeDisplaySize(changeWidth, changeHeight);
      }
      this.setState({imageList: updatedState});
    });
  }
  generateDisplayImageData(): Promise<ImageData> {
    const targetImageDatas = this.state.imageList
      .concat()
      .filter(i => i.isShow)
      .map(i => i.imageData)
      .reverse();
    const {width, height} = this.state.display;
    return synthesizeImageData(targetImageDatas, width, height).then(
      result => result
    );
  }
  handleError(error: string): void {
    console.log(error);
    // TODO: 受け取った値に応じてエラーメッセージを返すようにする
  }
  changeDisplaySize(width: number, height: number): void {
    this.setState({
      display: Object.assign({}, this.state.display, {width, height}),
    });
  }
  render() {
    const {
      isDragOver,
      imageList,
      display,
      activeActionLayer,
      actionLayerSettings,
    } = this.state;
    const activeImage = this.getActiveImage();
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
          this.uploadImageFile(e.dataTransfer.files);
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
              actionLayerSettings[DRAW_LINE].ctx.lineWidth === 1 ? 15 : 1;
            const newSetting = generateActionLayerSettings({
              type: SPECIFY_CONTEXT_PROPERTY,
              currentState: actionLayerSettings,
              data: {lineWidth: newValue},
              target: DRAW_LINE,
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
            imageData={activeImage.imageData}
            setting={actionLayerSettings[activeActionLayer]}
            updateImageData={imageData => {
              const updatedState = generateImageList({
                type: SPECIFY_IMAGE_PROPERTY,
                data: {imageData},
                currentState: imageList,
                target: activeImage.id,
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
