import {generateImageList, CREATE_IMAGE} from './generateImageList';

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
ctx.fillRect(10, 10, 120, 60);
const imageData = ctx.getImageData(0, 0, 180, 180);

const initialState = {
  isDragOver: false,
  imageList: generateImageList(
    CREATE_IMAGE,
    {id: 0, isShow: true, imageData},
    []
  ),
  display: {
    width: 500,
    height: 500,
    magnificationPercent: 100,
  },
};

export default initialState;
