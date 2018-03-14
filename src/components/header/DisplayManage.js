// @flow
import React from 'react';
import ClassNames from 'classnames';

import type {DisplayType} from '../Display';

type Props = {
  updateDisplaySize: (width: number, height: number) => void,
  showImageDatas: ImageData[],
  display: DisplayType,
};

type State = {
  widthString: string,
  heightString: string,
  error: boolean,
};

export default class DisplayManage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const {width, height} = this.props.display;
    this.state = {
      widthString: String(width),
      heightString: String(height),
      error: false,
    };
  }
  render() {
    const {updateDisplaySize, showImageDatas} = this.props;
    return (
      <div className="display-manage">
        <button
          data-test="fit-max-view-layer"
          onClick={() => {
            if (showImageDatas.length === 0) return;
            const maxWidth = Math.max(...showImageDatas.map(i => i.width));
            const maxHeight = Math.max(...showImageDatas.map(i => i.height));
            updateDisplaySize(maxWidth, maxHeight);
          }}
        >
          キャンバスをレイヤーの最大値に合わせる
        </button>
        <input
          type="number"
          className={ClassNames({'error-message': this.state.error})}
          value={this.state.widthString}
          onChange={e => {
            this.setState({
              widthString: e.currentTarget.value,
              error: false,
            });
          }}
        />px
        <input
          type="number"
          className={ClassNames({'error-message': this.state.error})}
          value={this.state.heightString}
          onChange={e => {
            this.setState({
              heightString: e.currentTarget.value,
              error: false,
            });
          }}
        />px
        <button
          data-test="specify-display-size"
          onClick={() => {
            let error = false;
            const {widthString, heightString} = this.state;
            if (!widthString || !heightString) error = true;
            const width = Number(widthString);
            const height = Number(heightString) - 0;
            if (isNaN(width) || isNaN(height)) error = true;
            if (width <= 0 || height <= 0) error = true;
            if (width >= 10000 || height >= 10000) error = true;
            if (error) {
              this.setState({error: true});
              return;
            }
            updateDisplaySize(width, height);
          }}
        >
          リサイズ
        </button>
      </div>
    );
  }
}
