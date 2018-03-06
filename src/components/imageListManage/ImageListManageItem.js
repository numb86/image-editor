// @flow
import React from 'react';
import ClassNames from 'classnames';

type Props = {
  deleteImage: () => void | null,
  label: string,
  isActive: boolean,
  isShow: boolean,
  activate: () => void,
  moveUpImageOrder: () => void | null,
  moveDownImageOrder: () => void | null,
  toggleShowOrHide: () => void,
};

export default function ImageListManageItem({
  deleteImage,
  label,
  isActive,
  isShow,
  activate,
  moveUpImageOrder,
  moveDownImageOrder,
  toggleShowOrHide,
}: Props) {
  return (
    <li className="image-list-manage-item">
      <button
        className={ClassNames({
          delete: true,
          delete__disable: !deleteImage,
        })}
        onClick={() => {
          if (!deleteImage) return;
          deleteImage();
        }}
      >
        削除ボタン
      </button>
      <span className="label">{label}</span>
      <button
        className={ClassNames({
          active: true,
          active__not: !isActive,
        })}
        onClick={activate}
      >
        アクティブ
      </button>
      <button
        className={ClassNames({
          'move-up': true,
          'move-up__disable': !moveUpImageOrder,
        })}
        onClick={() => {
          if (!moveUpImageOrder) return;
          moveUpImageOrder();
        }}
      >
        アップ
      </button>
      <button
        className={ClassNames({
          'move-down': true,
          'move-down__disable': !moveDownImageOrder,
        })}
        onClick={() => {
          if (!moveDownImageOrder) return;
          moveDownImageOrder();
        }}
      >
        ダウン
      </button>
      <button
        className={ClassNames({
          show: true,
          show__not: !isShow,
        })}
        onClick={toggleShowOrHide}
      >
        表示非表示
      </button>
    </li>
  );
}
