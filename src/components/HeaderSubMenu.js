// @flow
//  React.Node という型を指定するためにはこのようにReactをimportする必要がある
import * as React from 'react';

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
  children,
}: {
  selectMenu: SelectMenu,
  resizeRatio: number,
  rotateAngle: number,
  colorToneId: number,
  onChangeImageSetting: (
    options: HTMLOptionsCollection,
    stateName: string
  ) => void,
  children: React.Node,
}) {
  return (
    <div className="header-sub-menu">
      {selectMenu === 'sketch' && children}
      {selectMenu === 'resizeAndRotate' && (
        <form>
          <span>リサイズ：</span>
          <SelectBox
            defaultValue={resizeRatio}
            onChange={onChangeImageSetting}
            stateName="resizeRatio"
            optionList={RESIZE_LIST}
          />
          <span>回転：</span>
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
          <span>色調変更：</span>
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
