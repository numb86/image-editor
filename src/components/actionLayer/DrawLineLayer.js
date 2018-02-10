import React from 'react';

import MouseMoveActionLayer from './MouseMoveActionLayer';

export default function DrawLineLayer(props) {
  return (
    <MouseMoveActionLayer
      callbackDidMount={({ctx}) => {
        ctx.putImageData(props.imageData, 0, 0);
      }}
      edit={({canvas, ctx, startPoint, currentPoint}) => {
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(currentPoint.x, currentPoint.y);
        ctx.stroke();
        props.changeImageData(
          ctx.getImageData(0, 0, canvas.width, canvas.height)
        );
      }}
      {...props}
    />
  );
}
