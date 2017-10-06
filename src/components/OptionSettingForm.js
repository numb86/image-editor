import React from 'react';

export default function OptionSettingForm(props) {
  return (
    <form className="option-setting-area">
      <select
        defaultValue={props.resizeRatio}
        onChange={e => {
          props.onChangeSelect(e, 'resizeRatio');
        }}
      >
        <option value={0.25}>25%</option>
        <option value={0.5}>50%</option>
        <option value={1}>100%</option>
        <option value={1.5}>150%</option>
        <option value={2}>200%</option>
      </select>
      <select
        defaultValue={props.rotateAngle}
        onChange={e => {
          props.onChangeSelect(e, 'rotateAngle');
        }}
      >
        <option value={0}>回転しない</option>
        <option value={90}>時計回りに90度回転</option>
        <option value={180}>180度回転</option>
        <option value={270}>時計回りに270度回転</option>
      </select>
      <label htmlFor="allow-auto-download">
        <input
          id="allow-auto-download"
          type="checkbox"
          checked={props.allowAutoDownload}
          onChange={e => {
            props.onChangeAllowAutoDownload(e);
          }}
        />
        リサイズした画像を自動的にダウンロードする
      </label>
    </form>
  );
}
