import React from 'react';

export default function HeaderSubMenu({selectMenu}) {
  return (
    <div className="header-sub-menu">
      {selectMenu === 'sketch' && 'スケッチ'}
      {selectMenu === 'resizeAndRotate' && 'リサイズと回転'}
      {selectMenu === 'colorTone' && '色調変更'}
    </div>
  );
}
