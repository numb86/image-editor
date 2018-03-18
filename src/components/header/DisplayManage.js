// @flow
import React from 'react';
import ClassNames from 'classnames';

import type {DisplayType} from '../Display';

type Props = {
  updateDisplaySize: (width: number, height: number) => void,
  displayedImageDatas: ImageData[],
  display: DisplayType,
};

type State = {
  widthString: string,
  heightString: string,
  error: boolean,
};

const MIN_DISPLAY_WIDTH = 1;
const MIN_DISPLAY_HEIGHT = 1;
const MAX_DISPLAY_WIDTH = 9999;
const MAX_DISPLAY_HEIGHT = 9999;

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
    const {updateDisplaySize, displayedImageDatas} = this.props;
    return (
      <div className="display-manage">
        <button
          data-test="fit-max-view-layer"
          onClick={() => {
            if (displayedImageDatas.length === 0) return;
            const maxWidth = Math.max(...displayedImageDatas.map(i => i.width));
            const maxHeight = Math.max(
              ...displayedImageDatas.map(i => i.height)
            );
            updateDisplaySize(maxWidth, maxHeight);
          }}
        >
          キャンバスをレイヤーの最大値に合わせる
        </button>
        {['widthString', 'heightString'].map(value => (
          <span key={value}>
            <input
              type="number"
              className={ClassNames({'error-message': this.state.error})}
              value={this.state[value]}
              onChange={e => {
                this.setState({
                  [value]: e.currentTarget.value,
                  error: false,
                });
              }}
            />px
          </span>
        ))}
        <button
          data-test="specify-display-size"
          onClick={() => {
            const {widthString, heightString} = this.state;
            if (!widthString || !heightString) {
              this.setState({error: true});
              return;
            }
            const width = Number(widthString);
            const height = Number(heightString);
            if (
              isNaN(width) ||
              isNaN(height) ||
              width < MIN_DISPLAY_WIDTH ||
              height < MIN_DISPLAY_HEIGHT ||
              width > MAX_DISPLAY_WIDTH ||
              height > MAX_DISPLAY_HEIGHT
            ) {
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
