// @flow
//  React.Node という型を指定するためにはこのようにReactをimportする必要がある
import * as React from 'react';

export default function Display({
  width,
  height,
  magnificationPercent,
  children,
}: {
  width: number,
  height: number,
  magnificationPercent: number,
  children: React.Node,
}) {
  return (
    <div
      className="display"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        transform: `scale(${magnificationPercent / 100})`,
      }}
    >
      {children}
    </div>
  );
}
