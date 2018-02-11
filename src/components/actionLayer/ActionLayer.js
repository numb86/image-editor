// @flow
import React from 'react';

import DrawLineLayer from './DrawLineLayer';

export type ActiveActionLayer = 'drawLine' | 'eraser';

type Props = {
  activeActionLayer: ActiveActionLayer,
  imageData: ImageData,
  updateImageData: ImageData => void,
};

export default function ActionLayer(props: Props) {
  const useProps = Object.assign({}, props);
  delete useProps.activeActionLayer;
  switch (props.activeActionLayer) {
    case 'drawLine':
      return <DrawLineLayer {...useProps} />;
    default:
      throw new Error('Could not find ActionLayer.');
  }
}
