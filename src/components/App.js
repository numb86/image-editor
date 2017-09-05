import React from 'react';

const RESIZE_RATIO = 0.5;

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

class ImagePreviewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {uploadedImageUrl: null};
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
    this.setState({uploadedImageUrl: canvas.toDataURL('image/png')});
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
    };

    fr.readAsDataURL(file);
  }

  render() {
    return (
      <div>
        <UploadButton onChange={this.onImageSelected} />
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
