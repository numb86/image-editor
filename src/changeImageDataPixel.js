// @flow

export default function invertNegaPosi(
  src: Uint8ClampedArray
): Uint8ClampedArray {
  return src.map(
    (pixel, index) => ((index + 1) % 4 === 0 ? pixel : 255 - pixel)
  );
}
