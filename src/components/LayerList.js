import React from 'react';

import ViewLayer from './ViewLayer';

export default function LayerList({viewLayerDataList}) {
  return viewLayerDataList.map(data => {
    const {id} = data;
    // TODO: 必要なプロパティだけをコンポーネントに渡す
    return <ViewLayer key={id} {...data} />;
  });
}
