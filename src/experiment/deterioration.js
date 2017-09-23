import React from 'react';
import ReactDOM from 'react-dom';

const toDataUrl = (image, mime, time) =>
  new Promise(resolve => {
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, image.width, image.height);
    resolve([canvas.toDataURL(mime), time - 1]);
  });

const toImageElement = dataUrl =>
  new Promise(resolve => {
    const image = new Image();
    image.onload = () => {
      resolve(image);
    };
    image.src = dataUrl;
  });

class Deterioration extends React.Component {
  constructor() {
    super();
    this.state = {
      jpegDataUrl: null,
      pngDataUrl: null,
    };
    this.createDataUrl = this.createDataUrl.bind(this);
  }
  createDataUrl(image, mime, time) {
    toDataUrl(image, mime, time).then(([dataUrl, remainTime]) => {
      if (remainTime === 0) {
        if (mime === 'image/jpeg') this.setState({jpegDataUrl: dataUrl});
        else this.setState({pngDataUrl: dataUrl});
      } else {
        toImageElement(dataUrl).then(newImage =>
          this.createDataUrl(newImage, mime, remainTime)
        );
      }
    });
  }
  render() {
    const {jpegDataUrl, pngDataUrl} = this.state;
    const {time} = this.props;
    return (
      <div>
        <h3>jpeg　{`元画像 : ${time}回dataUrlに変換`}</h3>
        <div>
          <img
            src="../images/bay.jpeg"
            alt="検証用の画像"
            onLoad={e => this.createDataUrl(e.target, 'image/jpeg', time)}
          />
          <img src={jpegDataUrl} alt="検証用の画像" />
        </div>
        <h3>png　{`元画像 : ${time}回dataUrlに変換`}</h3>
        <div>
          <img
            src="../images/bay.png"
            alt="検証用の画像"
            onLoad={e => this.createDataUrl(e.target, 'image/png', time)}
          />
          <img src={pngDataUrl} alt="検証用の画像" />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Deterioration time={50} />, document.querySelector('#app'));
