// @flow
import React from 'react';

import DrawLineLayer from './DrawLineLayer';
import EraserLayer from './EraserLayer';

import type {MouseMoveActionLayerSetting} from '../../state/generateActionLayerSettings';

const DRAW_LINE: 'drawLine' = 'drawLine';
const ERASER: 'eraser' = 'eraser';

export type ActionLayerName = typeof DRAW_LINE | typeof ERASER;

type Props = {
  activeActionLayer: ActionLayerName,
  imageData: ImageData,
  updateImageData: ImageData => void,
  setting: MouseMoveActionLayerSetting,
};

export default function ActionLayer(props: Props) {
  const usedProps = Object.assign({}, props);
  delete usedProps.activeActionLayer;
  switch (props.activeActionLayer) {
    case DRAW_LINE:
      return <DrawLineLayer {...usedProps} />;
    case ERASER:
      return <EraserLayer {...usedProps} />;
    default:
      throw new Error('Could not find ActionLayer.');
  }
}
