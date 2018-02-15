// @flow
import type {ActionLayerName} from '../components/actionLayer/ActionLayer';

export const SPECIFY_CONTEXT_PROPERTY: 'specifyContextProperty' =
  'specifyContextProperty';

const CTX: 'ctx' = 'ctx';

type ContextSetting = {
  lineWidth?: number,
  strokeStyle?: string,
  lineCap: string,
  lienJoin: string,
};

type MouseMoveActionLayerSetting = {
  ctx: ContextSetting,
};

type ActionLayerSettings = {
  [ActionLayerName]: MouseMoveActionLayerSetting,
};

function specifyProperty(
  currentState: ActionLayerSettings,
  target: ActionLayerName,
  key: typeof CTX,
  data: ContextSetting
): ActionLayerSettings {
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
}: {
  type: typeof SPECIFY_CONTEXT_PROPERTY,
  currentState: ActionLayerSettings,
  data: ContextSetting,
  target: ActionLayerName,
}): ActionLayerSettings {
  switch (type) {
    case SPECIFY_CONTEXT_PROPERTY:
      return specifyProperty(currentState, target, CTX, data);
    default:
      throw new Error('This type is not found.');
  }
}
