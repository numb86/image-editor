// @flow
export type Image = {
  id: number,
  isShow: boolean,
  imageData: ImageData,
};

function getMinUniqueId(currentState: Image[]): number {
  const iDs = currentState.map(i => i.id);
  if (iDs.length === 0) return 0;
  const result = iDs.filter((id, index) => id !== index)[0];
  if (result === undefined) return iDs.length;
  return result - 1;
}

function createEmptyImageData({
  width,
  height,
}: {
  width: number,
  height: number,
}): ImageData {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  return ctx.getImageData(0, 0, width, height);
}

export default function createNewImage(
  data: {width: number, height: number},
  currentState: Image[]
): Image {
  return {
    id: getMinUniqueId(currentState),
    isShow: true,
    imageData: createEmptyImageData(data),
  };
}
