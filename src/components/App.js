// @flow
import React from 'react';
import ClassNames from 'classnames';

import Display from './Display';
import ViewLayerList from './ViewLayerList';
import {ActionLayer} from './actionLayer/ActionLayer';
import ImageListManage from './imageListManage/ImageListManage';
import Header from './header/Header';

import {
  synthesizeImageData,
  convertBlobToImageData,
  convertImageDataToBlob,
} from '../imageData';
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
  UPDATE,
  START_OMIT_LENGTH_COUNT,
  OMIT,
} from '../state/generateImageListHistory';
import initialState from '../state/initialState';

import type {DisplayType} from './Display';
import type {Image} from '../image';
import type {ActionLayerName} from './actionLayer/ActionLayer';
import type {
  ActionLayerSettings,
  ChangeableActionLayerSettings,
} from '../state/generateActionLayerSettings';
import type {ImageListHistory} from '../state/generateImageListHistory';
import type {HeaderMenuList} from './header/Header';

const MIME_PING = 'image/png';
const MIME_JPEG = 'image/jpeg';
const ALLOW_FILE_TYPES = [MIME_PING, MIME_JPEG];

type Props = {||};
type State = {
  isDragOver: boolean,
  selectedMenu: HeaderMenuList,
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
  updateImageData(imageData: ImageData): void {
    const {history, position} = this.state.imageListHistory;
    const imageList = history[position];
    const updatedState = generateImageList({
      type: SPECIFY_IMAGE_PROPERTY,
      data: {imageData},
      currentState: imageList,
      target: this.getActiveImage().id,
    });
    this.updateImageList(updatedState);
  }
  updateImageList(imageList: Image[]): void {
    this.setState({
      imageListHistory: generateImageListHistory({
        type: UPDATE,
        currentState: this.state.imageListHistory,
        imageList,
      }),
    });
  }
  updateImageListHistory(imageListHistory: ImageListHistory): void {
    this.setState({imageListHistory});
  }
  updateActionLayerSettings(
    target: ActionLayerName,
    data: ChangeableActionLayerSettings
  ): void {
    this.setState({
      actionLayerSettings: generateActionLayerSettings({
        type: SPECIFY_CONTEXT_PROPERTY,
        currentState: this.state.actionLayerSettings,
        data,
        target,
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
      this.updateImageList(updatedState);
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
        <Display {...display}>
          <ViewLayerList viewLayerDataList={imageList} />
          <ActionLayer
            activeActionLayer={activeActionLayer}
            imageData={activeImage.imageData}
            setting={actionLayerSettings[activeActionLayer]}
            display={display}
            updateImageData={imageData => {
              this.updateImageData(imageData);
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
        <ImageListManage
          imageList={imageList}
          updateImageList={updatedImageList => {
            this.updateImageList(updatedImageList);
          }}
          display={{width: display.width, height: display.height}}
        />
        {/* TODO: Header に渡す props が増えすぎているため、調整する */}
        <Header
          selectedMenu={this.state.selectedMenu}
          downloadImageFile={() => this.downloadImageFile()}
          uploadImageFile={fileList => this.uploadImageFile(fileList)}
          imageListHistory={imageListHistory}
          updateImageListHistory={changedImageListHistory =>
            this.updateImageListHistory(changedImageListHistory)
          }
          select={menuName => {
            this.setState({selectedMenu: menuName});
          }}
          activeActionLayer={activeActionLayer}
          actionLayerSettings={actionLayerSettings}
          specifyActiveActionLayer={actionLayerName => {
            this.setState({activeActionLayer: actionLayerName});
          }}
          updateActionLayerSettings={(target, data) => {
            this.updateActionLayerSettings(target, data);
          }}
          display={display}
          updateDisplaySize={(width, height) => {
            this.changeDisplaySize(width, height);
          }}
          displayedImageDatas={imageList
            .filter(image => image.isShow)
            .map(image => image.imageData)}
          imageData={activeImage.imageData}
          updateImageData={imageData => {
            this.updateImageData(imageData);
          }}
        />
        {isDragOver && (
          <div className="guide-file-drop">
            画像をドロップすると新しくレイヤーが作られます
          </div>
        )}
      </div>
    );
  }
}
