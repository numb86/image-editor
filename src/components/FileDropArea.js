import React from 'react';

export default function FileDropArea(props) {
  return (
    <div
      className="file-drop-area"
      onDrop={e => {
        e.preventDefault();
        props.onDrop(e.dataTransfer.files);
      }}
      onDragOver={e => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
      }}
      onDragEnter={e => {
        e.preventDefault();
      }}
      onDragLeave={e => {
        e.preventDefault();
      }}
    >
      ここに画像をドロップしてください
    </div>
  );
}
