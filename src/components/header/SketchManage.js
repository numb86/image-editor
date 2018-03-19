// @flow
import React from 'react';

import {DRAW_LINE, ERASER} from '../actionLayer/ActionLayer';

import type {ActionLayerName} from '../actionLayer/ActionLayer';
import type {ChangeableProperty} from '../../state/generateActionLayerSettings';

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
    data: ChangeableProperty
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

  return (
    <div className="display-manage">
      {Input(DRAW_LINE)}
      <select
        defaultValue={lineWidth[DRAW_LINE]}
        onChange={e => {
          const {options} = e.currentTarget;
          const newValue = options[options.selectedIndex].value;
          updateActionLayerSettings(DRAW_LINE, {lineWidth: newValue});
        }}
        data-test="select-draw-line-line-width"
      >
        <option value={1}>細</option>
        <option value={5}>中</option>
        <option value={15}>太</option>
      </select>ペン
      {Input(ERASER)}
      <select
        defaultValue={lineWidth[ERASER]}
        onChange={e => {
          const {options} = e.currentTarget;
          const newValue = options[options.selectedIndex].value;
          updateActionLayerSettings(ERASER, {lineWidth: newValue});
        }}
        data-test="select-eraser-line-width"
      >
        <option value={1}>細</option>
        <option value={5}>中</option>
        <option value={15}>太</option>
      </select>消しゴム
    </div>
  );
}
