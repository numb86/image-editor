// @flow
import React from 'react';

import Palette from './Palette';

import {DRAW_LINE, ERASER} from '../actionLayer/ActionLayer';

import type {ActionLayerName} from '../actionLayer/ActionLayer';
import type {ChangeableActionLayerSettings} from '../../state/generateActionLayerSettings';

export default function SketchManage({
  activeActionLayer,
  lineWidth,
  specifyActiveActionLayer,
  updateActionLayerSettings,
}: {
  activeActionLayer: ActionLayerName,
  lineWidth: {drawLine: number, eraser: number},
  specifyActiveActionLayer: ActionLayerName => void,
  updateActionLayerSettings: (
    target: ActionLayerName,
    data: ChangeableActionLayerSettings
  ) => void,
}) {
  const Input = actionLayerName => (
    <input
      type="radio"
      value={actionLayerName}
      checked={activeActionLayer === actionLayerName}
      onChange={e => {
        specifyActiveActionLayer(e.currentTarget.value);
      }}
      data-test={
        actionLayerName === DRAW_LINE ? 'radio-draw-line' : 'radio-eraser'
      }
    />
  );

  const Select = actionLayerName => (
    <select
      defaultValue={lineWidth[actionLayerName]}
      onChange={e => {
        const {options} = e.currentTarget;
        const newValue = options[options.selectedIndex].value;
        updateActionLayerSettings(actionLayerName, {lineWidth: newValue});
      }}
      data-test={
        actionLayerName === DRAW_LINE
          ? 'select-draw-line-line-width'
          : 'select-eraser-line-width'
      }
    >
      <option value={1}>細</option>
      <option value={5}>中</option>
      <option value={15}>太</option>
    </select>
  );

  return (
    <div className="sketch-manage">
      {Input(DRAW_LINE)}ペン
      {Select(DRAW_LINE)}
      <Palette updateActionLayerSettings={updateActionLayerSettings} />
      {Input(ERASER)}消しゴム
      {Select(ERASER)}
    </div>
  );
}
