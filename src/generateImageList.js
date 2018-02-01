export const SPECIFY_PROPERTY = 'specifyProperty';

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
  const updatedState = Object.assign([], currentState);
  updatedState.splice(targetIndex, 1, updatedData);
  return updatedState;
}

export function generateImageList(type, data, currentState, target) {
  switch (type) {
    case SPECIFY_PROPERTY:
      return specifyProperty(data, currentState, target);
    default:
      throw new Error('This type is not found.');
  }
}
