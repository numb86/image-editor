function getMinUniqueId(currentState) {
  const iDs = currentState.map(i => i.id);
  if (iDs.length === 0) return 0;
  const result = iDs.filter((id, index) => id !== index)[0];
  return result || iDs.length;
}

function createEmptyImageData({width, height}) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  return ctx.getImageData(0, 0, width, height);
}

export default function createNewImage(data, currentState) {
  return {
    id: getMinUniqueId(currentState),
    isShow: true,
    imageData: createEmptyImageData(data),
  };
}
