// @flow
import React from 'react';

export default function OptionSettingForm(props: {
  allowAutoDownload: boolean,
  onChangeAllowAutoDownload: (checked: boolean) => void,
}) {
  return (
    <form className="option-setting-area">
      <label htmlFor="allow-auto-download">
        <input
          id="allow-auto-download"
          type="checkbox"
          checked={props.allowAutoDownload}
          onChange={e => {
            props.onChangeAllowAutoDownload(e.target.checked);
          }}
        />
        リサイズした画像を自動的にダウンロードする
      </label>
    </form>
  );
}
