// @flow
import React from 'react';

import DrawLineLayer from './DrawLineLayer';

export type ActiveActionLayer = 'drawLine' | 'eraser';

export default function ActionLayer(props: {
  activeActionLayer: ActiveActionLayer,
}) {
  switch (props.activeActionLayer) {
    case 'drawLine':
      return <DrawLineLayer {...props} />;
    default:
      throw new Error('Could not find ActionLayer.');
  }
}
