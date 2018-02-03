function getMixUniqueId(currentState) {
  const iDs = currentState.map(i => i.id);
  if (iDs.length === 0) return 0;
  const result = iDs.filter((id, index) => id !== index)[0];
  return result || iDs.length;
}

function createTemplateImage(currentState) {
  return {
    id: getMixUniqueId(currentState),
    isShow: true,
    imageData: new Uint8ClampedArray(0),
  };
}

export default function createEmptyImage({width, height}, currentState) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, width, height);
  return Object.assign({}, createTemplateImage(currentState), {imageData});
}
