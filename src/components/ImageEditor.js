// @flow
import React from 'react';

import Header from './Header';
import FileDropArea from './FileDropArea';
import PreviewImage from './PreviewImage';

import {COLOR_TONE_NONE_ID, COLOR_TONE_LIST} from '../userSetting/colorTone';
import {resizeImage} from '../userSetting/resize';
import {rotateImage} from '../userSetting/rotate';

const MIME_PING: 'image/png' = 'image/png';
const MIME_JPEG: 'image/jpeg' = 'image/jpeg';
const ALLOW_FILE_TYPES = [MIME_PING, MIME_JPEG];

type AllowFileList = typeof MIME_PING | typeof MIME_JPEG;

function isAllowedFileType(
  uploadedFileType: string,
  allowList: Array<AllowFileList>
): boolean {
  const result = allowList.filter(allowFile => allowFile === uploadedFileType);
  return result.length > 0;
}

type Props = void;

type State = {
  userSettings: {
    resizeRatio: number,
    rotateAngle: number,
    colorToneId: number,
  },
  uploadImageDataUrl: string | null,
  previewImageDataUrl: string | null,
  downloadImageFileName: string | null,
  fileMime: AllowFileList | null,
  errorMessage: string | null,
  isProcessing: boolean,
};

export default class ImageEditor extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      userSettings: {
        resizeRatio: 0.5,
        rotateAngle: 0,
        colorToneId: COLOR_TONE_NONE_ID,
      },
      uploadImageDataUrl: null,
      previewImageDataUrl: null,
      downloadImageFileName: null,
      fileMime: null,
      errorMessage: null,
      isProcessing: false,
    };
    this.onImageSelected = this.onImageSelected.bind(this);
    this.onImageLoad = this.onImageLoad.bind(this);
  }
  onImageSelected: Function;
  onImageLoad: Function;
  onImageLoad(
    imageDataUrl: string,
    originalFileName: string,
    originalFileMime: AllowFileList
  ): void {
    this.setState({
      uploadImageDataUrl: imageDataUrl,
      downloadImageFileName: originalFileName,
      fileMime: originalFileMime,
    });
    this.processImage(this.state.userSettings);
  }

  onImageSelected(fileList: FileList): void {
    const file = fileList[0];
    if (!file) return; // ファイルアップロードのダイアログでキャンセルした場合の対応
    if (!isAllowedFileType(file.type, ALLOW_FILE_TYPES)) {
      this.setState({errorMessage: '対応しているファイル形式はjpegとpngのみです。'});
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      this.onImageLoad(fileReader.result, file.name, file.type);
    };
    fileReader.readAsDataURL(file);
  }

  processImage(userSettings: $PropertyType<State, 'userSettings'>): void {
    this.setState({
      isProcessing: true,
      previewImageDataUrl: null,
      errorMessage: null,
    });
    const {rotateAngle, resizeRatio, colorToneId} = userSettings;
    const taskList = [];
    const colorToneFunc = COLOR_TONE_LIST.filter(t => t.id === colorToneId)[0]
      .func;
    if (colorToneFunc) taskList.push(colorToneFunc);
    taskList.push(canvas => rotateImage(canvas, rotateAngle));
    taskList.push(canvas => resizeImage(canvas, resizeRatio));
    this.generateUploadedImageCanvas()
      .then(res => taskList.reduce((canvas, task) => task(canvas), res))
      .then(res => {
        const {fileMime} = this.state;
        if (!fileMime) throw new Error('fileMime is null.');
        this.setState({
          previewImageDataUrl: res.toDataURL(fileMime),
          isProcessing: false,
        });
      });
  }

  generateUploadedImageCanvas(): Promise<HTMLCanvasElement> {
    return new Promise(resolve => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('ctx is null.');
        ctx.drawImage(image, 0, 0, image.width, image.height);
        resolve(canvas);
      };
      if (!this.state.uploadImageDataUrl) {
        throw new Error('uploadImageDataUrl is null');
      }
      image.src = this.state.uploadImageDataUrl;
    });
  }

  changeUserSettings(key: string, value: number): void {
    const newUserSettings = Object.assign({}, this.state.userSettings, {
      [key]: value,
    });
    this.setState({userSettings: newUserSettings});
    if (!this.state.uploadImageDataUrl) return;
    this.processImage(newUserSettings);
  }

  render() {
    const {
      previewImageDataUrl,
      downloadImageFileName,
      errorMessage,
      isProcessing,
    } = this.state;
    const {resizeRatio, rotateAngle, colorToneId} = this.state.userSettings;
    return (
      <div>
        <div className="main-area">
          <div>画像にドロップすることでも、新しい画像をアップロードできます。</div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {!previewImageDataUrl &&
          !isProcessing && <FileDropArea onDrop={this.onImageSelected} />}
          {isProcessing && <div>画像生成中……</div>}
          {previewImageDataUrl && (
            <PreviewImage
              src={previewImageDataUrl}
              onDrop={this.onImageSelected}
            />
          )}
        </div>
        <Header
          onImageSelected={this.onImageSelected}
          previewImageDataUrl={previewImageDataUrl}
          downloadImageFileName={downloadImageFileName}
          resizeRatio={resizeRatio}
          rotateAngle={rotateAngle}
          colorToneId={colorToneId}
          onChangeImageSetting={(options, stateName) => {
            this.changeUserSettings(
              stateName,
              +options[options.selectedIndex].value
            );
          }}
        />
      </div>
    );
  }
}
