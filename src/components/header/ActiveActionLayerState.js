// @flow
import React from 'react';

import {DRAW_LINE, ERASER} from '../actionLayer/ActionLayer';

import type {ActionLayerName} from '../actionLayer/ActionLayer';
import type {MouseMoveActionLayerSetting} from '../../state/generateActionLayerSettings';

const DRAW_LINE_ICON_CLASS_NAME = 'fa-pencil';
const ERASER_ICON_CLASS_NAME = 'fa-eraser';

const DATA_URL_TRANSPARENT =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAP0lEQVQ4T2OcOXPmfwYiwL1794hQxcDAOGogznAaDUOcQTMEkk15eTlROUVJSYm4nDJqIM5wGg1D3Dll0CcbAMflUeHimVpmAAAAAElFTkSuQmCC';

export default function ActiveActionLayerState({
  activeActionLayer,
  setting,
}: {
  activeActionLayer: ActionLayerName,
  setting: MouseMoveActionLayerSetting,
}) {
  const getIconClassName = () => {
    switch (activeActionLayer) {
      case DRAW_LINE:
        return DRAW_LINE_ICON_CLASS_NAME;
      case ERASER:
        return ERASER_ICON_CLASS_NAME;
      default:
        throw new Error('This actionLayer is not defined.');
    }
  };
  const getColorStateStyle = () => {
    if (activeActionLayer === ERASER) {
      return {backgroundImage: `url(${DATA_URL_TRANSPARENT})`};
    }
    return {backgroundColor: setting.ctx.strokeStyle};
  };
  return (
    <span>
      <span className={`fa ${getIconClassName()}`} />
      <span
        data-test="active-action-layer-color"
        className="active-action-layer-color"
        style={getColorStateStyle()}
      />
    </span>
  );
}
