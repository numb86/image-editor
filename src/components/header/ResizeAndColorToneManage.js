// @flow
import React from 'react';
import ClassNames from 'classnames';

import {invertNegaPosi, applyGrayScale} from '../../editImageDataPixel';
import {resizeImageData} from '../../imageData';

type Props = {
  imageData: ImageData,
  updateImageData: ImageData => void,
};

type State = {
  resizeRatio: string,
  error: boolean,
};

export default class ResizeAndColorToneManage extends React.Component<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);
    this.state = {resizeRatio: '100', error: false};
  }
  render() {
    const {imageData, updateImageData} = this.props;
    return (
      <div className="resize-and-color-tone-manage">
        <button
          data-test="invert-nega-posi"
          onClick={() => {
            updateImageData(invertNegaPosi(imageData));
          }}
        >
          ネガポジ反転
        </button>
        <button
          data-test="apply-gray-scale"
          onClick={() => {
            updateImageData(applyGrayScale(imageData));
          }}
        >
          グレースケール
        </button>
        <input
          type="number"
          className={ClassNames({'error-message': this.state.error})}
          value={this.state.resizeRatio}
          onChange={e => {
            this.setState({
              resizeRatio: e.currentTarget.value,
              error: false,
            });
          }}
        />%
        <button
          data-test="resize-image"
          onClick={() => {
            const {resizeRatio} = this.state;
            if (!resizeRatio) {
              this.setState({error: true});
              return;
            }
            const ratio = Number(resizeRatio);
            // TODO: マジックナンバーの削除
            if (isNaN(ratio) || ratio <= 0 || ratio > 200) {
              this.setState({error: true});
              return;
            }
            updateImageData(resizeImageData(imageData, ratio));
          }}
        >
          リサイズ
        </button>
      </div>
    );
  }
}
