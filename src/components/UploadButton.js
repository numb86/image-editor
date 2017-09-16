import React from 'react';

export default function UploadButton(props) {
  return (
    <form className="upload-button">
      <label htmlFor="image-upload-input">
        画像をアップロード
        <input
          id="image-upload-input"
          type="file"
          accept="image/*"
          onChange={props.onChange}
        />
      </label>
    </form>
  );
}
