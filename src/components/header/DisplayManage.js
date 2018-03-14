// @flow
import React from 'react';

// TODO: use Fragments
export default function DisplayManage({
  updateDisplaySize,
  showImageDatas,
}: {
  updateDisplaySize: (width: number, height: number) => void,
  showImageDatas: ImageData[],
}) {
  return (
    <div className="display-manage">
      <button>キャンバスをレイヤーの最大値に合わせる</button>
      <input type="number" />px
      <input type="number" />px
      <button>リサイズ</button>
    </div>
  );
}
