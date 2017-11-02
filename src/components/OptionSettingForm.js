import React from 'react';

import {COLOR_TONE_LIST} from '../userSetting/colorTone';
import {RESIZE_LIST} from '../userSetting/resize';
import {ROTATE_LIST} from '../userSetting/rotate';

export default function OptionSettingForm(props) {
  return (
    <form className="option-setting-area">
      <select
        defaultValue={props.resizeRatio}
        onChange={e => {
          props.onChangeSelect(e.target.options, 'resizeRatio');
        }}
      >
        {RESIZE_LIST.map(r => (
          <option key={r.ratio} value={r.ratio}>
            {r.label}
          </option>
        ))}
      </select>
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
