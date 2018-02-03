// @flow
import React from 'react';

import ViewLayer from './ViewLayer';

import type {Image} from '../image';

const COMPONENT_USE_PROPS = ['isShow', 'imageData'];

export default function LayerList({
  viewLayerDataList,
}: {
  viewLayerDataList: Image[],
}) {
  return viewLayerDataList.map(data => {
    const {id} = data;
    const props = COMPONENT_USE_PROPS.reduce((acc, prop) => {
      acc[prop] = data[prop];
      return acc;
    }, {});
    return <ViewLayer key={id} {...(props: any)} />;
  });
}
