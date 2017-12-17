// @flow
import React from 'react';

import SelectBox from './SelectBox';

import {RESIZE_LIST} from '../userSetting/resize';
import {ROTATE_LIST} from '../userSetting/rotate';
import {COLOR_TONE_LIST} from '../userSetting/colorTone';

import type {SelectMenu} from './Header';

export default function HeaderSubMenu({
  selectMenu,
  resizeRatio,
  rotateAngle,
  colorToneId,
  onChangeImageSetting,
}: {
  selectMenu: SelectMenu,
  resizeRatio: number,
  rotateAngle: number,
  colorToneId: number,
  onChangeImageSetting: (
    options: HTMLOptionsCollection,
    stateName: string
  ) => void,
}) {
  return (
    <div className="header-sub-menu">
      {selectMenu === 'sketch' && 'この機能はまだ実装されていません'}
      {selectMenu === 'resizeAndRotate' && (
        <form>
          <SelectBox
            defaultValue={resizeRatio}
            onChange={onChangeImageSetting}
            stateName="resizeRatio"
            optionList={RESIZE_LIST}
          />
          <SelectBox
            defaultValue={rotateAngle}
            onChange={onChangeImageSetting}
            stateName="rotateAngle"
            optionList={ROTATE_LIST}
          />
        </form>
      )}
      {selectMenu === 'colorTone' && (
        <form>
          <SelectBox
            defaultValue={colorToneId}
            onChange={onChangeImageSetting}
            stateName="colorToneId"
            optionList={COLOR_TONE_LIST}
          />
        </form>
      )}
    </div>
  );
}
