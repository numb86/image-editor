// @flow
export default function loadImageElement(url: string): Promise<Image> {
  return new Promise(resolve => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.src = url;
  });
}
