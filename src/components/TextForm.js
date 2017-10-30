// @flow
import React from 'react';

export default function TextForm(props: {
  text: string,
  onSubmit: (e: Event) => void,
  onChange: (text: string) => void,
}) {
  return (
    <form onSubmit={e => props.onSubmit(e)}>
      <input
        type="text"
        placeholder="テキストを入力"
        value={props.text}
        onChange={e => props.onChange(e.target.value)}
        onKeyPress={e => {
          if (e.charCode === 13) props.onSubmit(e);
        }}
      />
      <input type="submit" value="決定" />
    </form>
  );
}
