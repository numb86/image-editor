export const SPECIFY_CONTEXT_PROPERTY: 'specifyContextProperty' =
  'specifyContextProperty';
const CTX: 'ctx' = 'ctx';

function specifyProperty(currentState, target, key, data) {
  const newKeyValue = Object.assign({}, currentState[target][key], data);
  const newTargetValue = Object.assign({}, currentState[target], {
    [key]: newKeyValue,
  });
  return Object.assign({}, currentState, {[target]: newTargetValue});
}

export function generateActionLayerSettings({
  type,
  currentState,
  data,
  target,
}) {
  switch (type) {
    case SPECIFY_CONTEXT_PROPERTY:
      return specifyProperty(currentState, target, CTX, data);
    default:
      throw new Error('This type is not found.');
  }
}
