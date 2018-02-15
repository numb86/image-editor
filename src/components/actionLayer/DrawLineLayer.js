// @flow
import React from 'react';

import MouseMoveActionLayer from './MouseMoveActionLayer';

type Props = {
  imageData: ImageData,
  updateImageData: ImageData => void,
};

export default function DrawLineLayer(props: Props) {
  return (
    <MouseMoveActionLayer
      callbackDidMount={({ctx}) => {
        ctx.putImageData(props.imageData, 0, 0);
      }}
      callbackDidUpdate={({ctx}) => {
        ctx.putImageData(props.imageData, 0, 0);
      }}
      executeAction={({canvas, ctx, startPoint, currentPoint}) => {
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(currentPoint.x, currentPoint.y);
        ctx.stroke();
        props.updateImageData(
          ctx.getImageData(0, 0, canvas.width, canvas.height)
        );
      }}
      imageData={props.imageData}
    />
  );
}