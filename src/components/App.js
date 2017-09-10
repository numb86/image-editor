import React from 'react';

const RESIZE_RATIO = 0.5;
const DOWNLOAD_IMAGE_FILE_TYPE = 'png';

const UploadButton = props => (
  <form className="uploadButton">
    <label htmlFor="imageUploadInput">
      画像をアップロード
      <input
        id="imageUploadInput"
        type="file"
        accept="image/*"
        onChange={props.onChange}
      />
    </label>
  </form>
);

const DownloadButton = props => (
  <div className="downloadButton">
    <a href={props.href} download={props.download}>
      画像をダウンロード
    </a>
  </div>
);

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

class ImagePreviewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      previewImageDataUrl: null,
      downloadImageFileName: null,
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
      });
      autoDownload(
        this.state.previewImageDataUrl,
        this.state.downloadImageFileName
      );
    });
  }

  onImageSelected(e) {
    const file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = () => {
      this.onImageLoad(fileReader.result, file.name);
    };
    fileReader.readAsDataURL(file);
  }

  render() {
    const {previewImageDataUrl, downloadImageFileName} = this.state;
    return (
      <div>
        <UploadButton onChange={this.onImageSelected} />
        <DownloadButton
          href={previewImageDataUrl}
          download={downloadImageFileName}
        />
        <p>
          <img src={previewImageDataUrl} alt="ここに画像が表示されます。" />
        </p>
      </div>
    );
  }
}

export default function App() {
  return <ImagePreviewer />;
}
