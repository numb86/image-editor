import React from 'react';

export default function UploadButton(props) {
  return (
    <form className="uploadButton">
      <label htmlFor="imageUploadInput">
        画像をアップロード
        <input
          id="imageUploadInput"
          type="file"
          accept="image/*"
          onChange={props.onChange}
        />
      </label>
    </form>
  );
}
