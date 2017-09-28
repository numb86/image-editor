import React from 'react';

import FileDropArea from './FileDropArea';
import PreviewImage from './PreviewImage';
import FileTransferButtons from './FileTransferButtons';

const CanvasExifOrientation = require('canvas-exif-orientation');

const ALLOW_FILE_TYPES = ['image/png', 'image/jpeg'];

const createImageDataUrl = (image, mime) => {
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, image.width, image.height);
  return canvas.toDataURL(mime);
};

const rotateNinetyDegreesClockwise = (currentImage, mime) =>
  new Promise(resolve => {
    const canvasElement = CanvasExifOrientation.drawImage(currentImage, 6);
    const dataUrl = createImageDataUrl(canvasElement, mime);
    const image = new Image();
    image.onload = () => resolve(image);
    image.src = dataUrl;
  });

const autoDownload = (url, fileName) => {
  const elem = document.createElement('a');
  elem.href = url;
  elem.download = fileName;
  elem.click();
};

const isAllowedFileType = (uploadedFileType, allowList) => {
  const result = allowList.filter(allowFile => allowFile === uploadedFileType);
  return !!(result.length > 0);
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
    this.processImage();
  }

  onImageSelected(fileList) {
    const file = fileList[0];
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

  processImage() {
    this.restoreUploadedImage()
      .then(res => rotateNinetyDegreesClockwise(res, this.state.fileMime))
      .then(res => {
        res.width *= this.state.userSettings.resizeRatio;
        res.height *= this.state.userSettings.resizeRatio;
        return res;
      })
      .then(res => {
        this.setState({
          previewImageDataUrl: createImageDataUrl(res, this.state.fileMime),
        });
        if (!this.state.allowAutoDownload) return;
        autoDownload(
          this.state.previewImageDataUrl,
          this.state.downloadImageFileName
        );
      });
  }

  restoreUploadedImage() {
    return new Promise(resolve => {
      const image = new Image();
      image.onload = () => {
        resolve(image);
      };
      image.src = this.state.uploadImageDataUrl;
    });
  }

  render() {
    const {
      previewImageDataUrl,
      downloadImageFileName,
      allowAutoDownload,
      errorMessage,
    } = this.state;
    return (
      <div>
        <FileTransferButtons
          onImageSelected={e => {
            this.onImageSelected(e.target.files);
          }}
          previewImageDataUrl={previewImageDataUrl}
          downloadImageFileName={downloadImageFileName}
        />
        {previewImageDataUrl && (
          <div>
            画像にドロップすることでも、新しい画像をアップロードできます。<br />
            画像をクリックすると右回りで90度回転します。
          </div>
        )}
        <form className="option-setting-area">
          <select
            defaultValue={this.state.userSettings.resizeRatio}
            onChange={e => {
              const {options} = e.target;
              this.setState({
                userSettings: {
                  resizeRatio: options[options.selectedIndex].value,
                },
              });
            }}
          >
            <option value={0.25}>25%</option>
            <option value={0.5}>50%</option>
            <option value={1}>100%</option>
            <option value={1.5}>150%</option>
            <option value={2}>200%</option>
          </select>
          <select
            defaultValue={this.state.userSettings.rotateAngle}
            onChange={e => {
              const {options} = e.target;
              this.setState({
                userSettings: {
                  rotateAngle: options[options.selectedIndex].value,
                },
              });
            }}
          >
            <option value={0}>回転しない</option>
            <option value={90}>時計回りに90度回転</option>
            <option value={180}>180度回転</option>
            <option value={270}>時計回りに270度回転</option>
          </select>
          <label htmlFor="option-setting">
            <input
              id="option-setting"
              type="checkbox"
              checked={allowAutoDownload}
              onChange={e => {
                this.setState({allowAutoDownload: e.target.checked});
              }}
            />
            リサイズした画像を自動的にダウンロードする
          </label>
        </form>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {!previewImageDataUrl && <FileDropArea onDrop={this.onImageSelected} />}
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
