// @flow
import React from 'react';

import ImageListManageItem from './ImageListManageItem';

import {
  generateImageList,
  SPECIFY_IMAGE_PROPERTY,
  SPECIFY_ACTIVE_IMAGE,
  ADD_NEW_IMAGE,
  DELETE_IMAGE,
  MOVE_UP_IMAGE_ORDER,
} from '../../state/generateImageList';

import type {Image} from '../../image';

export default function ImageListManage({
  imageList,
  updateImageList,
  display,
}: {
  imageList: Image[],
  updateImageList: (Image[]) => void,
  display: {width: number, height: number},
}) {
  return (
    <ul className="image-list-manage">
      <li>
        <button
          className="add-new-image fa fa-plus"
          onClick={() => {
            updateImageList(
              generateImageList({
                type: ADD_NEW_IMAGE,
                currentState: imageList,
                data: {width: display.width, height: display.height},
              })
            );
          }}
        />
      </li>
      {imageList.map((image, index) => (
        <ImageListManageItem
          key={image.id}
          deleteImage={
            imageList.length === 1
              ? null
              : () => {
                  updateImageList(
                    generateImageList({
                      type: DELETE_IMAGE,
                      currentState: imageList,
                      target: image.id,
                    })
                  );
                }
          }
          label={image.label}
          isActive={image.isActive}
          isShow={image.isShow}
          activate={() => {
            updateImageList(
              generateImageList({
                type: SPECIFY_ACTIVE_IMAGE,
                currentState: imageList,
                target: image.id,
              })
            );
          }}
          moveUpImageOrder={
            index === 0
              ? null
              : () => {
                  updateImageList(
                    generateImageList({
                      type: MOVE_UP_IMAGE_ORDER,
                      currentState: imageList,
                      target: image.id,
                    })
                  );
                }
          }
          moveDownImageOrder={
            index === imageList.length - 1
              ? null
              : () => {
                  updateImageList(
                    generateImageList({
                      type: MOVE_UP_IMAGE_ORDER,
                      currentState: imageList,
                      target: imageList[index + 1].id,
                    })
                  );
                }
          }
          toggleShowOrHide={() => {
            updateImageList(
              generateImageList({
                type: SPECIFY_IMAGE_PROPERTY,
                data: {isShow: !image.isShow},
                currentState: imageList,
                target: image.id,
              })
            );
          }}
        />
      ))}
    </ul>
  );
}
