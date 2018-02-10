// @flow
import React from 'react';

import ViewLayer from './ViewLayer';

import type {Image} from '../image';

const COMPONENT_USE_PROPS = ['isShow', 'imageData'];

export default function ViewLayerList({
  viewLayerDataList,
}: {
  viewLayerDataList: Image[],
}) {
  return viewLayerDataList.map(image => {
    const {id} = image;
    const props = Object.assign({}, image);
    const unusedKey = Object.keys(props).filter(key =>
      COMPONENT_USE_PROPS.every(useProps => key !== useProps)
    );
    unusedKey.forEach(key => {
      delete props[key];
    });
    return <ViewLayer key={id} {...props} />;
  });
}
