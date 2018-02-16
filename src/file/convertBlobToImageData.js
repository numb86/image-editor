// @flow
import loadImageElement from '../loadImageElement';

export default function convertBlobToImageData(blob: Blob): Promise<ImageData> {
  const url = URL.createObjectURL(blob);
  return loadImageElement(url).then(image => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
    URL.revokeObjectURL(url);
    return ctx.getImageData(0, 0, image.width, image.height);
  });
}
