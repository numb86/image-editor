import React from 'react';

import ViewLayer from './ViewLayer';

export default function LayerList({viewLayerDataList}) {
  return viewLayerDataList.map(data => <ViewLayer {...data} />);
}
