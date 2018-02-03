export const SPECIFY_PROPERTY = 'specifyProperty';
export const CREATE_IMAGE = 'createImage';

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

function createImage(data, currentState) {
  const updatedState = currentState.concat();
  updatedState.unshift(data);
  return updatedState;
}

export function generateImageList(type, data, currentState, target) {
  switch (type) {
    case SPECIFY_PROPERTY:
      return specifyProperty(data, currentState, target);
    case CREATE_IMAGE:
      return createImage(data, currentState);
    default:
      throw new Error('This type is not found.');
  }
}
