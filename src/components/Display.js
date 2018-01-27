// @flow
import React from 'react';

export default function Display({
  width,
  height,
  magnificationPercent,
  children,
}: {
  width: number,
  height: number,
  magnificationPercent: number,
  children: string,
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
