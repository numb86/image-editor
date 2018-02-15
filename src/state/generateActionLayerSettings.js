// @flow
import type {ActionLayerName} from '../components/actionLayer/ActionLayer';

export const SPECIFY_CONTEXT_PROPERTY: 'specifyContextProperty' =
  'specifyContextProperty';

const CTX: 'ctx' = 'ctx';

type ChangeableProperty = {
  lineWidth?: number,
  strokeStyle?: string,
};

type MouseMoveActionLayerSetting = {
  ctx: {
    lineWidth: number,
    lineCap: string,
    lineJoin: string,
    strokeStyle?: string,
  },
};

export type ActionLayerSettings = {
  [ActionLayerName]: MouseMoveActionLayerSetting,
};

function specifyProperty(
  currentState: ActionLayerSettings,
  target: ActionLayerName,
  key: typeof CTX,
  data: ChangeableProperty
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
  data: ChangeableProperty,
  target: ActionLayerName,
}): ActionLayerSettings {
  switch (type) {
    case SPECIFY_CONTEXT_PROPERTY:
      return specifyProperty(currentState, target, CTX, data);
    default:
      throw new Error('This type is not found.');
  }
}
