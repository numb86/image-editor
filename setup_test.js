/* eslint-disable import/no-extraneous-dependencies */
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
/* eslint-enable import/no-extraneous-dependencies */

Enzyme.configure({adapter: new Adapter()});

const ctx = {
  getImageData: (x, y, width, height) => ({
    width,
    height,
    data: new Uint8ClampedArray(width * height * 4),
  }),
};

const canvas = {
  getContext: context => {
    if (context !== '2d') throw new Error(`${context} is not support.`);
    return ctx;
  },
};

global.document = {
  createElement: element => {
    if (element !== 'canvas') return null;
    return canvas;
  },
};
