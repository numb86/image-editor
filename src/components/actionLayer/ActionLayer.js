// @flow
import React from 'react';

import DrawLineLayer from './DrawLineLayer';

export type ActiveActionLayer = 'drawLine' | 'eraser';

export default function ActionLayer(props: {
  activeActionLayer: ActiveActionLayer,
}) {
  const useProps = Object.assign({}, props);
  delete useProps.activeActionLayer;
  switch (props.activeActionLayer) {
    case 'drawLine':
      return <DrawLineLayer {...useProps} />;
    default:
      throw new Error('Could not find ActionLayer.');
  }
}
