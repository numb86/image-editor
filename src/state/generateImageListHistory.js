// @flow

import type {Image} from '../image';

export const BACK: 'back' = 'back';
export const FORWARD: 'forward' = 'forward';
export const UPDATE: 'update' = 'update';
export const SET_OMIT_BASE_POSITION: 'setOmitBasePosition' =
  'setOmitBasePosition';

type GenerateImageListHistoryTypeName =
  | typeof BACK
  | typeof FORWARD
  | typeof UPDATE
  | typeof SET_OMIT_BASE_POSITION;

export type ImageListHistory = {
  history: Image[][],
  position: number,
};

export function generateImageListHistory({
  type,
  currentState,
  imageList,
  target,
}: {
  type: GenerateImageListHistoryTypeName,
  currentState: ImageListHistory,
  imageList?: Image[],
  target?: number,
}): ImageListHistory {
  const updatedHistory = currentState.history.concat();
  const updatedState = {
    history: updatedHistory,
    position: currentState.position,
  };
  switch (type) {
    case BACK:
      if (currentState.position === currentState.history.length - 1) {
        return updatedState;
      }
      updatedState.position += 1;
      return updatedState;

    case FORWARD:
      if (currentState.position === 0) return updatedState;
      updatedState.position -= 1;
      return updatedState;

    case UPDATE:
      if (!imageList) throw new Error('ImageList is necessary.');
      if (currentState.position !== 0) {
        updatedState.history = currentState.history.filter(
          (e, index) => index >= currentState.position
        );
        updatedState.position = 0;
      }
      updatedState.history.unshift(imageList);
      return updatedState;

    case SET_OMIT_BASE_POSITION:
      if (!target && target !== 0) throw new Error('Need target id number.');
      if (currentState.omitBasePosition !== null) {
        throw new Error(
          'It is not possible to specify omit base positions double.'
        );
      }
      if (target >= currentState.history.length) {
        throw new Error('Invalid position.');
      }
      updatedState.omitBasePosition = target;
      return updatedState;

    default:
      throw new Error('This type is not found.');
  }
}
