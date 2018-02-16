// @flow
export default function loadImageElement(
  url: string
): Promise<HTMLImageElement> {
  return new Promise(resolve => {
    // new Image()
    // image.onload
    // これらは、jsdom が対応しておらずテストできないので、使っていない
    const image = document.createElement('img');
    image.addEventListener(
      'load',
      () => {
        resolve(image);
      },
      false
    );
    image.src = url;
  });
}
