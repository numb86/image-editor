// @flow
import React from 'react';
import ClassNames from 'classnames';

import Display from './Display';
import ViewLayerList from './ViewLayerList';
import {ActionLayer, DRAW_LINE, ERASER} from './actionLayer/ActionLayer';

import {
  synthesizeImageData,
  convertBlobToImageData,
  convertImageDataToBlob,
  resizeImageData,
} from '../imageData';
import {invertNegaPosi} from '../editImageDataPixel';
import {
  generateImageList,
  SPECIFY_IMAGE_PROPERTY,
  ADD_NEW_IMAGE,
} from '../state/generateImageList';
import {
  generateActionLayerSettings,
  SPECIFY_CONTEXT_PROPERTY,
} from '../state/generateActionLayerSettings';
import {
  generateImageListHistory,
  BACK,
  FORWARD,
  UPDATE,
  START_OMIT_LENGTH_COUNT,
  OMIT,
} from '../state/generateImageListHistory';
import initialState from '../state/initialState';

import type {DisplayType} from './Display';
import type {Image} from '../image';
import type {ActionLayerName} from './actionLayer/ActionLayer';
import type {ActionLayerSettings} from '../state/generateActionLayerSettings';
import type {ImageListHistory} from '../state/generateImageListHistory';

const MIME_PING = 'image/png';
const MIME_JPEG = 'image/jpeg';
const ALLOW_FILE_TYPES = [MIME_PING, MIME_JPEG];

type Props = {||};
type State = {
  isDragOver: boolean,
  imageListHistory: ImageListHistory,
  display: DisplayType,
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
    const {history, position} = this.state.imageListHistory;
    return history[position].filter(image => image.isActive === true)[0];
  }
  updateImageListHistory(imageList: Image[]): void {
    this.setState({
      imageListHistory: generateImageListHistory({
        type: UPDATE,
        currentState: this.state.imageListHistory,
        imageList,
      }),
    });
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
      const {history, position} = this.state.imageListHistory;
      const updatedState = generateImageList({
        type: ADD_NEW_IMAGE,
        data: {imageData},
        currentState: history[position],
      });
      const {width, height} = this.state.display;
      const changeWidth = imageData.width > width ? imageData.width : width;
      const changeHeight =
        imageData.height > height ? imageData.height : height;
      if (changeWidth !== width || changeHeight !== height) {
        this.changeDisplaySize(changeWidth, changeHeight);
      }
      this.updateImageListHistory(updatedState);
    });
  }
  downloadImageFile(): void {
    this.generateDisplayImageData()
      .then(imageData => convertImageDataToBlob(imageData).then(blob => blob))
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const elem = document.createElement('a');
        elem.href = url;
        elem.download = `${new Date().toISOString()}.png`;
        elem.click();
        URL.revokeObjectURL(url);
      });
  }
  generateDisplayImageData(): Promise<ImageData> {
    const {history, position} = this.state.imageListHistory;
    const targetImageDatas = history[position]
      .concat()
      .filter(i => i.isShow)
      .map(i => i.imageData)
      .reverse();
    const {width, height} = this.state.display;
    return synthesizeImageData(targetImageDatas, width, height).then(
      result => result
    );
  }
  /* eslint-disable */
  handleError(error: string): void {
    console.log(error);
    // TODO: 受け取った値に応じてエラーメッセージを返すようにする
  }
  /* eslint-enable */
  changeDisplaySize(width: number, height: number): void {
    this.setState({
      display: Object.assign({}, this.state.display, {width, height}),
    });
  }
  render() {
    const {
      isDragOver,
      imageListHistory,
      display,
      activeActionLayer,
      actionLayerSettings,
    } = this.state;
    const {history, position} = imageListHistory;
    const imageList = history[position];
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
        <button onClick={() => this.downloadImageFile()}>ダウンロード</button>
        <button
          onClick={() => {
            const imageData = invertNegaPosi(activeImage.imageData);
            const updatedState = generateImageList({
              type: SPECIFY_IMAGE_PROPERTY,
              data: {imageData},
              currentState: imageList,
              target: activeImage.id,
            });
            this.updateImageListHistory(updatedState);
          }}
        >
          ネガポジ
        </button>
        <button
          onClick={() => {
            const imageData = resizeImageData(activeImage.imageData, 50);
            const updatedState = generateImageList({
              type: SPECIFY_IMAGE_PROPERTY,
              data: {imageData},
              currentState: imageList,
              target: activeImage.id,
            });
            this.updateImageListHistory(updatedState);
          }}
        >
          50%縮小
        </button>
        <button
          onClick={() => {
            this.setState({
              imageListHistory: generateImageListHistory({
                type: BACK,
                currentState: imageListHistory,
              }),
            });
          }}
        >
          undo
        </button>
        <button
          onClick={() => {
            this.setState({
              imageListHistory: generateImageListHistory({
                type: FORWARD,
                currentState: imageListHistory,
              }),
            });
          }}
        >
          redo
        </button>
        <Display {...display}>
          <ViewLayerList viewLayerDataList={imageList} />
          <ActionLayer
            activeActionLayer={activeActionLayer}
            imageData={activeImage.imageData}
            setting={actionLayerSettings[activeActionLayer]}
            display={display}
            updateImageData={imageData => {
              const updatedState = generateImageList({
                type: SPECIFY_IMAGE_PROPERTY,
                data: {imageData},
                currentState: imageList,
                target: activeImage.id,
              });
              this.updateImageListHistory(updatedState);
            }}
            startOmitLengthCount={() => {
              this.setState({
                imageListHistory: generateImageListHistory({
                  type: START_OMIT_LENGTH_COUNT,
                  currentState: imageListHistory,
                }),
              });
            }}
            omitImageListHistory={() => {
              if (!imageListHistory.omitLength) return;
              this.setState({
                imageListHistory: generateImageListHistory({
                  type: OMIT,
                  currentState: imageListHistory,
                }),
              });
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
