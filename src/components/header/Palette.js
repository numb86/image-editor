// @flow
import React from 'react';

import {DRAW_LINE} from '../actionLayer/ActionLayer';

import type {ActionLayerName} from '../actionLayer/ActionLayer';
import type {ChangeableActionLayerSettings} from '../../state/generateActionLayerSettings';

const COLOR_LIST = [
  '#000', // 黒
  '#fff', // 白
  '#f00', // 赤
  '#f90', // オレンジ
  '#ff3', // 黄色
  '#60f', // 青
  '#9ff', // 水色
  '#f0f', // 紫
  '#6f0', // 緑
  '#960', // 茶色
];

export default function Palette({
  updateActionLayerSettings,
}: {
  updateActionLayerSettings: (
    target: ActionLayerName,
    data: ChangeableActionLayerSettings
  ) => void,
}) {
  function update(color) {
    updateActionLayerSettings(DRAW_LINE, {strokeStyle: color});
  }
  // TODO: Fragments を使う
  return (
    <span className="palette">
      {COLOR_LIST.map(color => (
        <button
          key={color}
          style={{backgroundColor: color}}
          onClick={() => {
            update(color);
          }}
        />
      ))}
    </span>
  );
}
