// @flow
import {generateImageList, ADD_NEW_IMAGE} from './generateImageList';

const INITIAL_DISPALY_WIDTH = 500;
const INITIAL_DISPALY_HEIGHT = 500;
const INITIAL_DISPALY_MAGNIFICATION_PERCENT = 100;

const initialState = {
  isDragOver: false,
  imageList: generateImageList(
    ADD_NEW_IMAGE,
    {width: INITIAL_DISPALY_WIDTH, height: INITIAL_DISPALY_HEIGHT},
    []
  ),
  display: {
    width: INITIAL_DISPALY_WIDTH,
    height: INITIAL_DISPALY_HEIGHT,
    magnificationPercent: INITIAL_DISPALY_MAGNIFICATION_PERCENT,
  },
};

export default initialState;
