// @flow
import React from 'react';

import type {SelectMenu} from './Header';

export default function HeaderSubMenu({selectMenu}: {selectMenu: SelectMenu}) {
  return (
    <div className="header-sub-menu">
      {selectMenu === 'sketch' && 'スケッチ'}
      {selectMenu === 'resizeAndRotate' && 'リサイズと回転'}
      {selectMenu === 'colorTone' && '色調変更'}
    </div>
  );
}
