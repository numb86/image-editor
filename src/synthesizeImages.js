// @flow
function loadImage(dataUrl: string): Promise<Image> {
  return new Promise(resolve => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.src = dataUrl;
  });
}

function generateBaseCanvas(
  baseImage: string
): Promise<{canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D}> {
  return loadImage(baseImage).then(image => {
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, image.width, image.height);
    return {canvas, ctx};
  });
}

export default function synthesizeImages(
  dataUrlList: string[]
): Promise<string> {
  return generateBaseCanvas(dataUrlList[0])
    .then(({canvas, ctx}) => {
      dataUrlList.shift();
      return Promise.all(
        dataUrlList.map(data => loadImage(data))
      ).then(images => ({canvas, ctx, images}));
    })
    .then(({canvas, ctx, images}) => {
      images.forEach(image => {
        ctx.drawImage(image, 0, 0, image.width, image.height);
      });
      return canvas.toDataURL();
    });
}
