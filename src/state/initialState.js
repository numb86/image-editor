// @flow
import {generateImageList, ADD_NEW_IMAGE} from './generateImageList';

import {DRAW_LINE, ERASER} from '../components/actionLayer/ActionLayer';

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
  actionLayerSettings: {
    [DRAW_LINE]: {
      ctx: {
        strokeStyle: '#000',
        lineWidth: 1,
        lineCap: 'round',
        lineJoin: 'round',
      },
    },
    [ERASER]: {
      ctx: {
        lineWidth: 5,
        lineCap: 'round',
        lineJoin: 'round',
      },
    },
  },
};

export default initialState;
