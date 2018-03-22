// @flow
import React from 'react';
import ClassNames from 'classnames';

type Props = {
  deleteImage: (() => void) | null,
  label: string,
  isActive: boolean,
  isShow: boolean,
  activate: () => void,
  moveUpImageOrder: (() => void) | null,
  moveDownImageOrder: (() => void) | null,
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
          'fa fa-times': true,
          delete__disable: !deleteImage,
        })}
        onClick={() => {
          if (!deleteImage) return;
          deleteImage();
        }}
      />
      <span className="label">{label}</span>
      <button
        className={ClassNames({
          active: true,
          'fa fa-check': true,
          active__not: !isActive,
        })}
        onClick={activate}
      />
      <button
        className={ClassNames({
          'move-up': true,
          'fa fa-chevron-up': true,
          'move-up__disable': !moveUpImageOrder,
        })}
        onClick={() => {
          if (!moveUpImageOrder) return;
          moveUpImageOrder();
        }}
      />
      <button
        className={ClassNames({
          'move-down': true,
          'fa fa-chevron-down': true,
          'move-down__disable': !moveDownImageOrder,
        })}
        onClick={() => {
          if (!moveDownImageOrder) return;
          moveDownImageOrder();
        }}
      />
      <button
        className={ClassNames({
          show: true,
          'fa fa-minus-square': true,
          show__not: !isShow,
        })}
        onClick={toggleShowOrHide}
      />
    </li>
  );
}
