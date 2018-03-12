// @flow
import React from 'react';

import {
  generateImageListHistory,
  BACK,
  FORWARD,
} from '../../state/generateImageListHistory';

import type {ImageListHistory} from '../../state/generateImageListHistory';

export default function Header({
  downloadImageFile,
  uploadImageFile,
  imageListHistory,
  updateImageListHistory,
}: {
  downloadImageFile: () => void,
  uploadImageFile: FileList => void,
  imageListHistory: ImageListHistory,
  updateImageListHistory: ImageListHistory => void,
}) {
  return (
    <header>
      <button className="download" onClick={downloadImageFile} />
      <label htmlFor="image-upload-input" className="upload">
        <input
          id="image-upload-input"
          type="file"
          accept="image/*"
          onChange={e => {
            e.preventDefault();
            uploadImageFile(e.target.files);
          }}
        />
      </label>
      <button
        className="undo"
        onClick={() => {
          updateImageListHistory(
            generateImageListHistory({
              type: BACK,
              currentState: imageListHistory,
            })
          );
        }}
      />
      <button
        className="redo"
        onClick={() => {
          updateImageListHistory(
            generateImageListHistory({
              type: FORWARD,
              currentState: imageListHistory,
            })
          );
        }}
      />
    </header>
  );
}
