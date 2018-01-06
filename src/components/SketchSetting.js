// @flow
import React from 'react';

const SKETCH_PEN_COLOR_LIST = [
  {value: 'black', label: '黒'},
  {value: 'red', label: '赤'},
  {value: 'blue', label: '青'},
  {value: 'white', label: '白'},
];

const SKETCH_PEN_WIDTH_LIST = [
  {value: 1, label: '細'},
  {value: 3, label: '中'},
  {value: 5, label: '太'},
];

function getCtx(canvasElement) {
  if (!canvasElement) return null;
  return canvasElement.getContext('2d') || null;
}

export default function SketchSetting({
  getSketchCanvasElement,
}: {
  getSketchCanvasElement: () => HTMLCanvasElement | null,
}) {
  return (
    <span>
      <span>
        ペンの色：<select
          onChange={e => {
            const {options} = e.target;
            const ctx = getCtx(getSketchCanvasElement());
            if (!ctx) return;
            const {value} = options[options.selectedIndex];
            Object.assign(ctx, {strokeStyle: value});
          }}
        >
          {SKETCH_PEN_COLOR_LIST.map(i => (
            <option key={i.value} value={i.value}>{`${i.label}`}</option>
          ))}
        </select>
        ペンの幅：<select
          onChange={e => {
            const {options} = e.target;
            const ctx = getCtx(getSketchCanvasElement());
            if (!ctx) return;
            const {value} = options[options.selectedIndex];
            Object.assign(ctx, {lineWidth: value});
          }}
        >
          {SKETCH_PEN_WIDTH_LIST.map(i => (
            <option key={i.value} value={i.value}>{`${i.label}`}</option>
          ))}
        </select>
      </span>
    </span>
  );
}
