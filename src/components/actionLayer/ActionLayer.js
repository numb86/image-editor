// @flow
import React from 'react';

import DrawLineLayer from './DrawLineLayer';
import EraserLayer from './EraserLayer';

export type ActiveActionLayer = 'drawLine' | 'eraser';

type Props = {
  activeActionLayer: ActiveActionLayer,
  imageData: ImageData,
  updateImageData: ImageData => void,
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