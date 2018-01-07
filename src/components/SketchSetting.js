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

function getCtx(
  canvasElement: HTMLCanvasElement | null
): CanvasRenderingContext2D | null {
  if (!canvasElement) return null;
  return canvasElement.getContext('2d') || null;
}

function changeSetting(
  ctx: CanvasRenderingContext2D,
  key: string,
  event: SyntheticEvent<HTMLSelectElement>
): void {
  const {options} = event.currentTarget;
  const {value} = options[options.selectedIndex];
  Object.assign(ctx, {[key]: value});
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
            const ctx = getCtx(getSketchCanvasElement());
            if (!ctx) return;
            changeSetting(ctx, 'strokeStyle', e);
          }}
        >
          {SKETCH_PEN_COLOR_LIST.map(i => (
            <option key={i.value} value={i.value}>{`${i.label}`}</option>
          ))}
        </select>
        ペンの幅：<select
          onChange={e => {
            const ctx = getCtx(getSketchCanvasElement());
            if (!ctx) return;
            changeSetting(ctx, 'lineWidth', e);
          }}
        >
          {SKETCH_PEN_WIDTH_LIST.map(i => (
            <option key={i.value} value={i.value}>{`${i.label}`}</option>
          ))}
        </select>
      </span>
      <button
        onClick={() => {
          const canvasElement = getSketchCanvasElement();
          if (!canvasElement) return;
          const ctx = canvasElement.getContext('2d');
          if (!ctx) return;
          ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        }}
      >
        スケッチした内容を全て消去
      </button>
    </span>
  );
}
