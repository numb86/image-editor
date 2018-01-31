export default function specifyShowState(data, currentState) {
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
