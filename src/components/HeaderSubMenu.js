// @flow
import React from 'react';

import SelectBox from './SelectBox';
import {COLOR_TONE_LIST} from '../userSetting/colorTone';

import type {SelectMenu} from './Header';

export default function HeaderSubMenu({
  selectMenu,
  colorToneId,
  onChangeImageSetting,
}: {
  selectMenu: SelectMenu,
  colorToneId: number,
  onChangeImageSetting: (
    options: HTMLOptionsCollection,
    stateName: string
  ) => void,
}) {
  return (
    <div className="header-sub-menu">
      {selectMenu === 'sketch' && 'この機能はまだ実装されていません'}
      {selectMenu === 'resizeAndRotate' && 'リサイズと回転'}
      {selectMenu === 'colorTone' && (
        <SelectBox
          defaultValue={colorToneId}
          onChange={onChangeImageSetting}
          stateName="colorToneId"
          optionList={COLOR_TONE_LIST}
        />
      )}
    </div>
  );
}
