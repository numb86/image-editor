// @flow

import type {Image} from '../image';

export const BACK: 'back' = 'back';
export const FORWARD: 'forward' = 'forward';
export const UPDATE: 'update' = 'update';

type GenerateImageListHistoryTypeName =
  | typeof BACK
  | typeof FORWARD
  | typeof UPDATE;

export type ImageListHistory = {
  history: Image[][],
  position: number,
};

export function generateImageListHistory({
  type,
  currentState,
  imageList,
}: {
  type: GenerateImageListHistoryTypeName,
  currentState: ImageListHistory,
  imageList?: Image[],
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

    default:
      throw new Error('This type is not found.');
  }
}
