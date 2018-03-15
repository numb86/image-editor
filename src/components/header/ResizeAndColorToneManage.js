// @flow
import React from 'react';

type Props = {
  invertNegaPosi: () => void,
  applyGrayScale: () => void,
  resizeImage: number => void,
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
    return (
      <div>
        <button
          data-test="invert-nega-posi"
          onClick={() => {
            this.props.invertNegaPosi();
          }}
        >
          ネガポジ反転
        </button>
        <button
          data-test="apply-gray-scale"
          onClick={() => {
            this.props.applyGrayScale();
          }}
        >
          グレースケール
        </button>
        <input
          type="number"
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
            let error = false;
            const {resizeRatio} = this.state;
            if (!resizeRatio) error = true;
            const ratio = Number(resizeRatio);
            if (isNaN(ratio)) error = true;
            // TODO: マジックナンバーの削除
            if (ratio <= 0) error = true;
            if (ratio > 200) error = true;
            if (error) {
              this.setState({error: true});
              return;
            }
            this.props.resizeImage(ratio);
          }}
        >
          リサイズ
        </button>
      </div>
    );
  }
}
