// @flow
import createNewImage from '../image';

import type {Image} from '../image';

export const SPECIFY_IMAGE_PROPERTY: 'specifyImageProperty' =
  'specifyImageProperty';
export const SPECIFY_ACTIVE_IMAGE: 'specifyActiveImage' = 'specifyActiveImage';
export const ADD_IMAGE: 'addImage' = 'addImage';
export const ADD_NEW_IMAGE: 'addNewImage' = 'addNewImage';
export const DELETE_IMAGE: 'deleteImage' = 'deleteImage';
export const MOVE_UP_IMAGE_ORDER: 'moveUpImageOrder' = 'moveUpImageOrder';

type GenerateImageListTypeName =
  | typeof SPECIFY_IMAGE_PROPERTY
  | typeof SPECIFY_ACTIVE_IMAGE
  | typeof ADD_IMAGE
  | typeof ADD_NEW_IMAGE
  | typeof DELETE_IMAGE
  | typeof MOVE_UP_IMAGE_ORDER;

type GenerateImageListReceiveData = {
  isShow?: boolean,
  imageData?: ImageData,
  width?: number,
  height?: number,
  isActive?: boolean,
};

function getTargetIndexAndData(
  currentState: Image[],
  target: number
): {targetIndex: number, targetData: Image} {
  let targetData;
  let targetIndex;
  currentState.forEach((elem, index) => {
    if (elem.id === target) {
      targetData = elem;
      targetIndex = index;
    }
  });
  if (!targetData || (!targetIndex && targetIndex !== 0)) {
    throw new Error('Not found target data.');
  }
  return {targetIndex, targetData};
}

function specifyProperty(
  currentState: Image[],
  target: number,
  data: {isShow?: boolean, imageData?: ImageData, isActive?: boolean}
): Image[] {
  const {targetIndex, targetData} = getTargetIndexAndData(currentState, target);
  const updatedData = (Object.assign({}, targetData, data): Image);
  const updatedState = currentState.concat();
  updatedState.splice(targetIndex, 1, updatedData);
  return updatedState;
}

function addImage(currentState: Image[], image: Image): Image[] {
  const updatedState = currentState.concat();
  updatedState.unshift(image);
  return updatedState;
}

function deleteImage(currentState: Image[], target: number): Image[] {
  const {targetIndex} = getTargetIndexAndData(currentState, target);
  const updatedState = currentState.concat();
  updatedState.splice(targetIndex, 1);
  return updatedState;
}

function allImageNotActive(currentState: Image[]): Image[] {
  const updatedState = currentState.concat();
  return updatedState.map(image => Object.assign({}, image, {isActive: false}));
}

function specifyActiveImage(currentState: Image[], target: number): Image[] {
  return specifyProperty(currentState, target, {isActive: true});
}

function moveUpImageOrder(currentState: Image[], target: number): Image[] {
  const {targetIndex, targetData} = getTargetIndexAndData(currentState, target);
  if (targetIndex === 0) throw new Error('This image is top.');
  const updatedState = currentState.concat();
  updatedState.splice(targetIndex, 1);
  updatedState.splice(targetIndex - 1, 0, targetData);
  return updatedState;
}

function searchNextActiveImageId(
  currentState: Image[],
  target: number
): number {
  const {targetIndex} = getTargetIndexAndData(currentState, target);
  const nextIndex =
    targetIndex === currentState.length - 1 ? targetIndex - 1 : targetIndex + 1;
  return currentState[nextIndex].id;
}

export function generateImageList({
  type,
  currentState,
  data,
  image,
  target,
}: {
  type: GenerateImageListTypeName,
  currentState: Image[],
  data?: GenerateImageListReceiveData,
  image?: Image,
  target?: number,
}): Image[] {
  switch (type) {
    case SPECIFY_IMAGE_PROPERTY:
      if (!target && target !== 0) throw new Error('Need target id number.');
      if (!data) throw new Error('Data is necessary.');
      if (data.id) throw new Error('Id can not be overwritten.');
      return specifyProperty(currentState, target, data);

    case ADD_IMAGE:
      if (!image) throw new Error('Image is necessary.');
      return addImage(currentState, image);

    case ADD_NEW_IMAGE: {
      if (!data) throw new Error('Data is necessary.');
      const {imageData} = data;
      let {width, height} = data;
      if (!imageData && (!width || !height)) {
        throw new Error('Data is not enough.');
      }
      if (!width || !height) {
        if (!imageData) throw new Error('Data is not enough.');
        width = imageData.width;
        height = imageData.height;
      }
      const blankImage = createNewImage({width, height}, currentState);
      const updatedState = generateImageList({
        type: ADD_IMAGE,
        image: blankImage,
        currentState: allImageNotActive(currentState),
      });
      return imageData
        ? generateImageList({
            type: SPECIFY_IMAGE_PROPERTY,
            currentState: updatedState,
            data: {imageData},
            target: blankImage.id,
          })
        : updatedState;
    }

    case SPECIFY_ACTIVE_IMAGE: {
      if (!target && target !== 0) throw new Error('Need target id number.');
      return specifyActiveImage(allImageNotActive(currentState), target);
    }

    case DELETE_IMAGE: {
      if (!target && target !== 0) throw new Error('Need target id number.');
      if (currentState.length === 1) {
        throw new Error('You can not delete all image.');
      }
      const currentActiveId = currentState.filter(i => i.isActive === true)[0]
        .id;
      return deleteImage(
        target === currentActiveId
          ? generateImageList({
              type: SPECIFY_ACTIVE_IMAGE,
              currentState,
              target: searchNextActiveImageId(currentState, target),
            })
          : currentState,
        target
      );
    }

    case MOVE_UP_IMAGE_ORDER: {
      if (!target && target !== 0) throw new Error('Need target id number.');
      return moveUpImageOrder(currentState, target);
    }

    default:
      throw new Error('This type is not found.');
  }
}
