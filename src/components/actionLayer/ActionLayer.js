// @flow
import React from 'react';

import DrawLineLayer from './DrawLineLayer';
import EraserLayer from './EraserLayer';

import type {MouseMoveActionLayerSetting} from '../../state/generateActionLayerSettings';

export type ActionLayerName = 'drawLine' | 'eraser';

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
    case 'drawLine':
      return <DrawLineLayer {...usedProps} />;
    case 'eraser':
      return <EraserLayer {...usedProps} />;
    default:
      throw new Error('Could not find ActionLayer.');
  }
}
