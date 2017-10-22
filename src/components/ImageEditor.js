import React from 'react';

import FileDropArea from './FileDropArea';
import PreviewImage from './PreviewImage';
import FileTransferButtons from './FileTransferButtons';
import OptionSettingForm from './OptionSettingForm';

import {COLOR_TONE_NONE_ID, COLOR_TONE_LIST} from '../userSetting/colorTone';
import {resizeImage} from '../userSetting/resize';
import {rotateImage} from '../userSetting/rotate';
import fillText from '../userSetting/text';

const ALLOW_FILE_TYPES = ['image/png', 'image/jpeg'];

const autoDownload = (url, fileName) => {
  const elem = document.createElement('a');
  elem.href = url;
  elem.download = fileName;
  elem.click();
};

const isAllowedFileType = (uploadedFileType, allowList) => {
  const result = allowList.filter(allowFile => allowFile === uploadedFileType);
  return result.length > 0;
};

export default class ImageEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userSettings: {
        resizeRatio: 0.5,
        rotateAngle: 0,
        colorToneId: COLOR_TONE_NONE_ID,
        text: '',
      },
      uploadImageDataUrl: null,
      previewImageDataUrl: null,
      downloadImageFileName: null,
      fileMime: null,
      allowAutoDownload: true,
      errorMessage: null,
      isProcessing: false,
    };
    this.onImageSelected = this.onImageSelected.bind(this);
    this.onImageLoad = this.onImageLoad.bind(this);
  }

  onImageLoad(imageDataUrl, originalFileName, originalFileMime) {
    this.setState({
      uploadImageDataUrl: imageDataUrl,
      downloadImageFileName: originalFileName,
      fileMime: originalFileMime,
    });
    this.processImage(this.state.userSettings);
  }

  onImageSelected(fileList) {
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

  processImage(userSettings) {
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
    taskList.push(canvas => fillText(canvas));
    this.generateUploadedImageCanvas()
      .then(res => taskList.reduce((canvas, task) => task(canvas), res))
      .then(res => {
        this.setState({
          previewImageDataUrl: res.toDataURL(this.state.fileMime),
          isProcessing: false,
        });
        if (!this.state.allowAutoDownload) return;
        autoDownload(
          this.state.previewImageDataUrl,
          this.state.downloadImageFileName
        );
      });
  }

  generateUploadedImageCanvas() {
    return new Promise(resolve => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, image.width, image.height);
        resolve(canvas);
      };
      image.src = this.state.uploadImageDataUrl;
    });
  }

  changeUserSettings(key, value) {
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
      allowAutoDownload,
      errorMessage,
      isProcessing,
    } = this.state;
    const {
      resizeRatio,
      rotateAngle,
      colorToneId,
      text,
    } = this.state.userSettings;
    return (
      <div>
        <FileTransferButtons
          onImageSelected={e => {
            this.onImageSelected(e.target.files);
          }}
          previewImageDataUrl={previewImageDataUrl}
          downloadImageFileName={downloadImageFileName}
        />
        <div>画像にドロップすることでも、新しい画像をアップロードできます。</div>
        <input
          type="text"
          placeholder="テキストを入力"
          value={text}
          onChange={e => this.changeUserSettings('text', e.target.value)}
        />
        <OptionSettingForm
          resizeRatio={resizeRatio}
          rotateAngle={rotateAngle}
          colorToneId={colorToneId}
          allowAutoDownload={allowAutoDownload}
          onChangeSelect={(e, stateName) => {
            const {options} = e.target;
            this.changeUserSettings(
              stateName,
              +options[options.selectedIndex].value
            );
          }}
          onChangeAllowAutoDownload={e => {
            this.setState({allowAutoDownload: e.target.checked});
          }}
        />
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
    );
  }
}
