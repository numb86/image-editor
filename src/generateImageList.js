import createEmptyImage from './image';

export const SPECIFY_PROPERTY = 'specifyProperty';
export const ADD_IMAGE = 'addImage';
export const ADD_NEW_IMAGE = 'addNewImage';

function specifyProperty(data, currentState, target) {
  let targetData;
  let targetIndex;
  currentState.forEach((elem, index) => {
    if (elem.id === target) {
      targetData = elem;
      targetIndex = index;
    }
  });
  const updatedData = Object.assign({}, targetData, data);
  const updatedState = currentState.concat();
  updatedState.splice(targetIndex, 1, updatedData);
  return updatedState;
}

function addImage(data, currentState) {
  const updatedState = currentState.concat();
  updatedState.unshift(data);
  return updatedState;
}

export function generateImageList(type, data, currentState, target) {
  switch (type) {
    case SPECIFY_PROPERTY:
      return specifyProperty(data, currentState, target);
    case ADD_IMAGE:
      return addImage(data, currentState);
    case ADD_NEW_IMAGE: {
      const newImage = createEmptyImage(data, currentState);
      return generateImageList(ADD_IMAGE, newImage, currentState);
    }
    default:
      throw new Error('This type is not found.');
  }
}
