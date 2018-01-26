import React from 'react';

export default function Display({
  width,
  height,
  magnificationPercent,
  children,
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
