import React from 'react';

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
    this.state = {uploadedImage: null};
    this.onImageSelected = this.onImageSelected.bind(this);
  }

  onImageSelected(e) {
    const file = e.target.files[0];
    const fr = new FileReader();

    fr.onload = () => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const dstWidth = image.width * 0.5;
        const dstHeight = image.height * 0.5;
        canvas.width = dstWidth;
        canvas.height = dstHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, dstWidth, dstHeight);
        this.setState({uploadedImage: canvas.toDataURL('image/png')});
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
          <img src={this.state.uploadedImage} alt="ここに画像が表示されます。" />
        </p>
      </div>
    );
  }
}

export default function App() {
  return <ImagePreviewer />;
}
