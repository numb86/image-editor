// @flow
import loadImageElement from './loadImageElement';

function imageDataToBlob(imageData: ImageData): Promise<Blob> {
  return new Promise(resolve => {
    const canvas = document.createElement('canvas');
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    const ctx = canvas.getContext('2d');
    ctx.putImageData(imageData, 0, 0);
    canvas.toBlob(blob => resolve(blob));
  });
}

function imageDataToImageElement(
  imageData: ImageData
): Promise<HTMLImageElement> {
  return imageDataToBlob(imageData).then(blob => {
    const url = URL.createObjectURL(blob);
    return loadImageElement(url).then(image => {
      URL.revokeObjectURL(url);
      return image;
    });
  });
}

export default function synthesizeImageData(
  imageDatas: ImageData[],
  width: number,
  height: number
): Promise<ImageData> {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  return Promise.all(
    imageDatas.map(i => imageDataToImageElement(i))
  ).then(images => {
    images.forEach(image => {
      ctx.drawImage(image, 0, 0, image.width, image.height);
    });
    return ctx.getImageData(0, 0, width, height);
  });
}
