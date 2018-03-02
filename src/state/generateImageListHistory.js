// @flow

import type {Image} from '../image';

export const BACK: 'back' = 'back';
export const FORWARD: 'forward' = 'forward';
export const UPDATE: 'update' = 'update';
export const START_OMIT_LENGTH_COUNT: 'startOmitLengthCount' =
  'startOmitLengthCount';
export const OMIT: 'omit' = 'omit';

type GenerateImageListHistoryTypeName =
  | typeof BACK
  | typeof FORWARD
  | typeof UPDATE
  | typeof START_OMIT_LENGTH_COUNT
  | typeof OMIT;

export type ImageListHistory = {
  history: Image[][],
  position: number,
  omitLength: number | null,
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
    omitLength: currentState.omitLength,
  };
  switch (type) {
    case BACK:
      if (currentState.omitLength !== null) {
        throw new Error('omitLength is not null.');
      }
      if (currentState.position === currentState.history.length - 1) {
        return updatedState;
      }
      updatedState.position += 1;
      return updatedState;

    case FORWARD:
      if (currentState.omitLength !== null) {
        throw new Error('omitLength is not null.');
      }
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
      if (currentState.omitLength !== null) {
        updatedState.omitLength += 1;
      }
      return updatedState;

    case START_OMIT_LENGTH_COUNT:
      if (currentState.omitLength !== null) {
        throw new Error('omitLength is not null.');
      }
      updatedState.omitLength = -1;
      return updatedState;

    case OMIT: {
      const {omitLength} = currentState;
      if (omitLength === null) {
        throw new Error('omitLength is null.');
      }
      updatedState.omitLength = null;
      if (omitLength <= 0) return updatedState;
      updatedState.history = updatedState.history.filter((e, index) => {
        if (index === 0) return true;
        return index > omitLength;
      });
      return updatedState;
    }

    default:
      throw new Error('This type is not found.');
  }
}
