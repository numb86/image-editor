export const SPECIFY_SHOW_STATE = 'specifyShowState';

function specifyShowState(data, currentState) {
  const {target, isShow} = data;
  let targetData;
  let targetIndex;
  currentState.forEach((elem, index) => {
    if (elem.id === target) {
      targetData = elem;
      targetIndex = index;
    }
  });
  const updatedData = Object.assign({}, targetData, {isShow});
  const updatedState = Object.assign([], currentState);
  updatedState.splice(targetIndex, 1, updatedData);
  return updatedState;
}

export function generateImageList(type, data, currentState) {
  switch (type) {
    case SPECIFY_SHOW_STATE:
      return specifyShowState(data, currentState);
    default:
      throw new Error('This type is not found.');
  }
}
