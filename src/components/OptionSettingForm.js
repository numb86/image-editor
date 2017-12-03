// @flow
import React from 'react';

import SelectBox from './SelectBox';

import {COLOR_TONE_LIST} from '../userSetting/colorTone';
import {RESIZE_LIST} from '../userSetting/resize';
import {ROTATE_LIST} from '../userSetting/rotate';

export default function OptionSettingForm(props: {
  resizeRatio: number,
  rotateAngle: number,
  colorToneId: number,
  allowAutoDownload: boolean,
  onChangeSelect: (options: HTMLOptionsCollection, stateName: string) => void,
  onChangeAllowAutoDownload: (checked: boolean) => void,
}) {
  return (
    <form className="option-setting-area">
      <SelectBox
        defaultValue={props.resizeRatio}
        onChange={props.onChangeSelect}
        stateName="resizeRatio"
        optionList={RESIZE_LIST}
      />
      <select
        defaultValue={props.rotateAngle}
        onChange={e => {
          props.onChangeSelect(e.target.options, 'rotateAngle');
        }}
      >
        {ROTATE_LIST.map(r => (
          <option key={r.angle} value={r.angle}>
            {r.label}
          </option>
        ))}
      </select>
      <select
        defaultValue={props.colorToneId}
        onChange={e => {
          props.onChangeSelect(e.target.options, 'colorToneId');
        }}
      >
        {COLOR_TONE_LIST.map(i => (
          <option key={i.id} value={i.id}>
            {i.label}
          </option>
        ))}
      </select>
      <label htmlFor="allow-auto-download">
        <input
          id="allow-auto-download"
          type="checkbox"
          checked={props.allowAutoDownload}
          onChange={e => {
            props.onChangeAllowAutoDownload(e.target.checked);
          }}
        />
        リサイズした画像を自動的にダウンロードする
      </label>
    </form>
  );
}
