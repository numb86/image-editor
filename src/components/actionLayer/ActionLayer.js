import React from 'react';

import DrawLineLayer from './DrawLineLayer';

export default function ActionLayer(props) {
  switch (props.activeActionLayer) {
    case 'drawLine':
      return <DrawLineLayer {...props} />;
    default:
      throw new Error('Could not find ActionLayer.');
  }
}
