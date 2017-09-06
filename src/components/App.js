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

const trimFileNameExtension = fileName => {
  const periodPosition = fileName.lastIndexOf('.');
  return fileName.slice(0, periodPosition);
};

class ImagePreviewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadedImageUrl: null,
      downloadImageFileName: null,
    };
    this.onImageSelected = this.onImageSelected.bind(this);
    this.onImageLoad = this.onImageLoad.bind(this);
  }

  onImageLoad(imageObject) {
    const canvas = document.createElement('canvas');
    const dstWidth = imageObject.width * RESIZE_RATIO;
    const dstHeight = imageObject.height * RESIZE_RATIO;
    canvas.width = dstWidth;
    canvas.height = dstHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imageObject, 0, 0, dstWidth, dstHeight);
    this.setState({
      uploadedImageUrl: canvas.toDataURL(`image/${DOWNLOAD_IMAGE_FILE_TYPE}`),
    });
  }

  onImageSelected(e) {
    const file = e.target.files[0];
    const fr = new FileReader();

    fr.onload = () => {
      const image = new Image();
      image.onload = () => {
        this.onImageLoad(image);
      };
      image.src = fr.result;
      this.setState({
        /* prettier-ignore */
        downloadImageFileName: `${trimFileNameExtension(file.name)}.${DOWNLOAD_IMAGE_FILE_TYPE}`,
      });
    };

    fr.readAsDataURL(file);
  }

  render() {
    const {uploadedImageUrl, downloadImageFileName} = this.state;
    return (
      <div>
        <UploadButton onChange={this.onImageSelected} />
        <a href={uploadedImageUrl} download={downloadImageFileName}>
          ダウンロード
        </a>
        <p>
          <img src={this.state.uploadedImageUrl} alt="ここに画像が表示されます。" />
        </p>
      </div>
    );
  }
}

export default function App() {
  return <ImagePreviewer />;
}
