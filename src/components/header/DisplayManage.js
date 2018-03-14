import React from 'react';

export default class DisplayManage extends React.Component {
  constructor(props) {
    super(props);
    const {width, height} = this.props.display;
    this.state = {
      widthString: String(width),
      heightString: String(height),
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
          value={this.state.widthString}
          onChange={e => {
            this.setState({widthString: e.currentTarget.value});
          }}
        />px
        <input
          type="number"
          value={this.state.heightString}
          onChange={e => {
            this.setState({heightString: e.currentTarget.value});
          }}
        />px
        <button
          data-test="specify-display-size"
          onClick={() => {
            const {widthString, heightString} = this.state;
            if (!widthString || !heightString) return;
            const width = Number(widthString);
            const height = Number(heightString) - 0;
            if (isNaN(width) || isNaN(height)) return;
            if (width <= 0 || height <= 0) return;
            if (width >= 10000 || height >= 10000) return;
            updateDisplaySize(width, height);
          }}
        >
          リサイズ
        </button>
      </div>
    );
  }
}
