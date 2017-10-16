import React from 'react';

import FileDropArea from './FileDropArea';
import PreviewImage from './PreviewImage';
import FileTransferButtons from './FileTransferButtons';
import OptionSettingForm from './OptionSettingForm';

const CanvasExifOrientation = require('canvas-exif-orientation');

const ALLOW_FILE_TYPES = ['image/png', 'image/jpeg'];

const ORIENTATION_NUMBER = {
  0: 1,
  90: 6,
  180: 3,
  270: 8,
};

const transferCanvasPixelValue = (canvas, transferLogic) => {
  const ctx = canvas.getContext('2d');
  const src = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const dst = ctx.createImageData(canvas.width, canvas.height);
  transferLogic(src, dst);
  ctx.putImageData(dst, 0, 0);
  return canvas;
};

const applyNegativeFilter = canvas => {
  transferCanvasPixelValue(canvas, (src, dst) => {
    for (let i = 0; i < src.data.length; i += 4) {
      /* eslint-disable no-param-reassign */
      dst.data[i] = 255 - src.data[i]; // R
      dst.data[i + 1] = 255 - src.data[i + 1]; // G
      dst.data[i + 2] = 255 - src.data[i + 2]; // B
      dst.data[i + 3] = src.data[i + 3]; // A
      /* eslint-enable no-param-reassign */
    }
  });
  return canvas;
};

const applyGrayscaleFilter = canvas => {
  transferCanvasPixelValue(canvas, (src, dst) => {
    for (let i = 0; i < src.data.length; i += 4) {
      /* eslint-disable no-param-reassign */
      const pixel = (src.data[i] + src.data[i + 1] + src.data[i + 2]) / 3;
      dst.data[i] = pixel;
      dst.data[i + 1] = pixel;
      dst.data[i + 2] = pixel;
      dst.data[i + 3] = src.data[i + 3];
      /* eslint-enable no-param-reassign */
    }
  });
  return canvas;
};

const resizeImage = (currentCanvas, resizeRatio) => {
  const dstCanvas = document.createElement('canvas');
  const ctx = dstCanvas.getContext('2d');
  dstCanvas.width = currentCanvas.width * resizeRatio;
  dstCanvas.height = currentCanvas.height * resizeRatio;
  ctx.drawImage(currentCanvas, 0, 0, dstCanvas.width, dstCanvas.height);
  return dstCanvas;
};

const rotateImage = (currentCanvas, angle) => {
  const orietationNumber = ORIENTATION_NUMBER[angle];
  return CanvasExifOrientation.drawImage(currentCanvas, orietationNumber);
};

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
    const {rotateAngle, resizeRatio} = userSettings;
    this.generateUploadedImageCanvas()
      .then(res => rotateImage(res, rotateAngle))
      .then(res => applyNegativeFilter(res))
      .then(res => applyGrayscaleFilter(res))
      .then(res => resizeImage(res, resizeRatio))
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
    const {resizeRatio, rotateAngle} = this.state.userSettings;
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
        <OptionSettingForm
          resizeRatio={resizeRatio}
          rotateAngle={rotateAngle}
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
