import React from 'react';

export default function TextForm(props) {
  return (
    <form onSubmit={e => props.onSubmit(e)}>
      <input
        type="text"
        placeholder="テキストを入力"
        value={props.text}
        onChange={e => props.onChange(e)}
        onKeyPress={e => {
          if (e.charCode === 13) props.onSubmit(e);
        }}
      />
      <input type="submit" value="決定" />
    </form>
  );
}
