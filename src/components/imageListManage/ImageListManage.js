// @flow
import React from 'react';

import ImageListManageItem from './ImageListManageItem';

import {
  generateImageList,
  SPECIFY_IMAGE_PROPERTY,
  SPECIFY_ACTIVE_IMAGE,
  DELETE_IMAGE,
  MOVE_UP_IMAGE_ORDER,
} from '../../state/generateImageList';

import type {Image} from '../../image';

export default function ImageListManage({
  imageList,
  updateImageList,
}: {
  imageList: Image[],
  updateImageList: (Image[]) => void,
}) {
  return (
    <ul>
      {imageList.map((image, index) => (
        <ImageListManageItem
          deleteImage={
            imageList.length === 1 ? null : (
              () => {
                updateImageList(
                  generateImageList({
                    type: DELETE_IMAGE,
                    currentState: imageList,
                    target: image.id,
                  })
                );
              }
            )
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
            index === 0 ? null : (
              () => {
                updateImageList(
                  generateImageList({
                    type: MOVE_UP_IMAGE_ORDER,
                    currentState: imageList,
                    target: image.id,
                  })
                );
              }
            )
          }
          moveDownImageOrder={
            index === imageList.length - 1 ? null : (
              () => {
                updateImageList(
                  generateImageList({
                    type: MOVE_UP_IMAGE_ORDER,
                    currentState: imageList,
                    target: imageList[index + 1].id,
                  })
                );
              }
            )
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
