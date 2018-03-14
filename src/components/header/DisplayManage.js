// @flow
import React from 'react';

import type {DisplayType} from '../Display';

export default function DisplayManage({
  updateDisplaySize,
  showImageDatas,
  display,
}: {
  updateDisplaySize: (width: number, height: number) => void,
  showImageDatas: ImageData[],
  display: DisplayType,
}) {
  let widthString = String(display.width);
  let heightString = String(display.height);
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
        onChange={e => {
          widthString = e.currentTarget.value;
        }}
      />px
      <input
        type="number"
        onChange={e => {
          heightString = e.currentTarget.value;
        }}
      />px
      <button
        data-test="specify-display-size"
        onClick={() => {
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
