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
      <SelectBox
        defaultValue={props.rotateAngle}
        onChange={props.onChangeSelect}
        stateName="rotateAngle"
        optionList={ROTATE_LIST}
      />
      <SelectBox
        defaultValue={props.colorToneId}
        onChange={props.onChangeSelect}
        stateName="colorToneId"
        optionList={COLOR_TONE_LIST}
      />
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
