import React from 'react';

import FileTransferButtons from './FileTransferButtons';

const RESIZE_RATIO = 0.5;
const DOWNLOAD_IMAGE_FILE_TYPE = 'png';
const ALLOW_FILE_TYPES = ['image/png', 'image/jpeg'];

const trimFileNameExtension = fileName => {
  const periodPosition = fileName.lastIndexOf('.');
  return fileName.slice(0, periodPosition);
};

const autoDownload = (url, fileName) => {
  const elem = document.createElement('a');
  elem.href = url;
  elem.download = fileName;
  elem.click();
};

const isAllowedFileType = (uploadedFileType, allowList) => {
  const result = allowList.filter(allowFile => allowFile === uploadedFileType);
  return !!(result.length > 0) || false;
};

const resizeImage = (imageDataUrl, ratio) =>
  new Promise(resolve => {
    const image = new Image();
    image.onload = () => {
      const deformedWidth = image.width * ratio;
      const deformedHeight = image.height * ratio;
      const canvas = document.createElement('canvas');
      canvas.width = deformedWidth;
      canvas.height = deformedHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0, deformedWidth, deformedHeight);
      resolve(canvas.toDataURL(`image/${DOWNLOAD_IMAGE_FILE_TYPE}`));
    };
    image.src = imageDataUrl;
  });

export default class ImageEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      previewImageDataUrl: null,
      downloadImageFileName: null,
      errorMessage: null,
    };
    this.onImageSelected = this.onImageSelected.bind(this);
    this.onImageLoad = this.onImageLoad.bind(this);
  }

  onImageLoad(imageDataUrl, originalFileName) {
    resizeImage(imageDataUrl, RESIZE_RATIO).then(res => {
      this.setState({
        previewImageDataUrl: res,
        /* prettier-ignore */
        downloadImageFileName: `${trimFileNameExtension(originalFileName)}.${DOWNLOAD_IMAGE_FILE_TYPE}`,
        errorMessage: null,
      });
      autoDownload(
        this.state.previewImageDataUrl,
        this.state.downloadImageFileName
      );
    });
  }

  onImageSelected(e) {
    const file = e.target.files[0];
    if (!isAllowedFileType(file.type, ALLOW_FILE_TYPES)) {
      this.setState({errorMessage: '対応しているファイル形式はjpegとpngのみです。'});
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      this.onImageLoad(fileReader.result, file.name);
    };
    fileReader.readAsDataURL(file);
  }

  render() {
    const {
      previewImageDataUrl,
      downloadImageFileName,
      errorMessage,
    } = this.state;
    return (
      <div>
        <FileTransferButtons
          onImageSelected={this.onImageSelected}
          previewImageDataUrl={previewImageDataUrl}
          downloadImageFileName={downloadImageFileName}
        />
        {errorMessage && <p>{errorMessage}</p>}
        <p>
          <img src={previewImageDataUrl} alt="ここに画像が表示されます。" />
        </p>
      </div>
    );
  }
}
