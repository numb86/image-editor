import React from 'react';

export default function Display({width, height, children}) {
  return (
    <div
      className="display"
      style={{width: `${width}px`, height: `${height}px`}}
    >
      {children}
    </div>
  );
}
