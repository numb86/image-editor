// @flow
import {generateImageList, ADD_NEW_IMAGE} from './generateImageList';

const INITIAL_DISPALY_WIDTH = 500;
const INITIAL_DISPALY_HEIGHT = 500;
const INITIAL_DISPALY_MAGNIFICATION_PERCENT = 100;

const initialState = {
  isDragOver: false,
  imageList: generateImageList({
    type: ADD_NEW_IMAGE,
    data: {width: INITIAL_DISPALY_WIDTH, height: INITIAL_DISPALY_HEIGHT},
    currentState: [],
  }),
  display: {
    width: INITIAL_DISPALY_WIDTH,
    height: INITIAL_DISPALY_HEIGHT,
    magnificationPercent: INITIAL_DISPALY_MAGNIFICATION_PERCENT,
  },
  activeImageId: 0,
  activeActionLayer: 'drawLine',
};

export default initialState;
