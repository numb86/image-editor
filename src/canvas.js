// @flow
export type Canvas = HTMLCanvasElement & {
  getContext: ('2d') => CanvasRenderingContext2D,
};
