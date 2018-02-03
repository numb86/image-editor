const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
ctx.fillRect(10, 10, 120, 60);
const imageData = ctx.getImageData(0, 0, 180, 180);

const initialState = {
  isDragOver: false,
  imageList: [
    {id: 0, isShow: true, imageData},
    {id: 1, isShow: true, imageData},
  ],
  display: {
    width: 500,
    height: 500,
    magnificationPercent: 100,
  },
};

export default initialState;
