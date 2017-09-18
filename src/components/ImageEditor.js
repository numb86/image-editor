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

const rotateNinetyDegreesClockwise = (currentImage, mime) => {
  const image = CanvasExifOrientation.drawImage(currentImage, 6);
  return createImageDataUrl(image, mime);
};

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

const resizeImage = (imageDataUrl, mime, ratio) =>
  new Promise(resolve => {
    const image = new Image();
    image.onload = () => {
      image.width *= ratio;
      image.height *= ratio;
      resolve(createImageDataUrl(image, mime));
    };
    image.src = imageDataUrl;
  });

export default class ImageEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resizeRatio: 0.5,
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
    resizeImage(
      imageDataUrl,
      originalFileMime,
      this.state.resizeRatio
    ).then(res => {
      this.setState({
        previewImageDataUrl: res,
        /* prettier-ignore */
        downloadImageFileName: originalFileName,
        fileMime: originalFileMime,
        errorMessage: null,
      });
      if (!this.state.allowAutoDownload) return;
      autoDownload(
        this.state.previewImageDataUrl,
        this.state.downloadImageFileName
      );
    });
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
            defaultValue={this.state.resizeRatio}
            onChange={e => {
              const {options} = e.target;
              this.setState({
                resizeRatio: options[options.selectedIndex].value,
              });
            }}
          >
            <option value={0.25}>25%</option>
            <option value={0.5}>50%</option>
            <option value={1}>100%</option>
            <option value={1.5}>150%</option>
            <option value={2}>200%</option>
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
            onClick={e => {
              const rotatedImage = rotateNinetyDegreesClockwise(
                e.target,
                this.state.fileMime
              );
              this.setState({previewImageDataUrl: rotatedImage});
            }}
          />
        )}
      </div>
    );
  }
}
