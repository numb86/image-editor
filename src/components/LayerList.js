import React from 'react';

import ViewLayer from './ViewLayer';

export default function LayerList({viewLayerDataList}) {
  return viewLayerDataList.map(data => {
    const {id} = data;
    delete data.id;
    return <ViewLayer key={id} {...data} />;
  });
}
