// @flow
import createNewImage from '../image';

import type {Image} from '../image';

// TODO: SPECIFY_PROPERTY -> SPECIFY_IMAGE_PROPERTY
export const SPECIFY_PROPERTY: 'specifyProperty' = 'specifyProperty';
export const ADD_IMAGE: 'addImage' = 'addImage';
export const ADD_NEW_IMAGE: 'addNewImage' = 'addNewImage';

type GenerateImageListTypeName =
  | typeof SPECIFY_PROPERTY
  | typeof ADD_IMAGE
  | typeof ADD_NEW_IMAGE;

type GenerateImageListData = {
  isShow?: boolean,
  imageData?: ImageData,
  width?: number,
  height?: number,
};

function specifyProperty(
  data: {isShow?: boolean, imageData?: ImageData},
  currentState: Image[],
  target: number
): Image[] {
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
  const updatedData = (Object.assign({}, targetData, data): Image);
  const updatedState = currentState.concat();
  updatedState.splice(targetIndex, 1, updatedData);
  return updatedState;
}

function addImage(data: Image, currentState: Image[]): Image[] {
  const updatedState = currentState.concat();
  updatedState.unshift(data);
  return updatedState;
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
  data?: GenerateImageListData,
  image?: Image,
  target?: number,
}): Image[] {
  switch (type) {
    case SPECIFY_PROPERTY:
      if (!target && target !== 0) throw new Error('Need target id number.');
      if (!data) throw new Error('Data is necessary.');
      if (data.id) throw new Error('Id can not be overwritten.');
      return specifyProperty(data, currentState, target);
    case ADD_IMAGE:
      if (!image) throw new Error('Image is necessary.');
      return addImage(image, currentState);
    case ADD_NEW_IMAGE: {
      if (!data) throw new Error('Data is necessary.');
      const {width, height} = data;
      if (!width || !height) throw new Error('Data is not enough.');
      return generateImageList({
        type: ADD_IMAGE,
        image: createNewImage({width, height}, currentState),
        currentState,
      });
    }
    default:
      throw new Error('This type is not found.');
  }
}
