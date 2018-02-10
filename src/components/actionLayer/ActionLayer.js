import React from 'react';

import DrawLineLayer from './DrawLineLayer';

export default function ActionLayer(props) {
  const {activeActionLayer, ...other} = props;
  switch (activeActionLayer) {
    case 'drawLine':
      return <DrawLineLayer {...other} />;
    default:
      throw new Error('Could not find ActionLayer.');
  }
}
