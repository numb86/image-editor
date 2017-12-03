// @flow
import React from 'react';

export default function SelectBox(props: {
  defaultValue: number,
  onChange: (options: HTMLOptionsCollection, stateName: string) => void,
  stateName: string,
  optionList: {value: number, label: string}[],
}) {
  return (
    <select
      defaultValue={props.defaultValue}
      onChange={e => {
        props.onChange(e.target.options, props.stateName);
      }}
    >
      {props.optionList.map(o => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
