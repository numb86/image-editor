/* eslint-disable import/no-extraneous-dependencies */
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
/* eslint-enable import/no-extraneous-dependencies */

Enzyme.configure({adapter: new Adapter()});

/* eslint-disable class-methods-use-this */
class Ctx {
  constructor(canvas) {
    this.canvas = canvas;
  }
  getImageData(x, y, width, height) {
    return {
      width,
      height,
      data: new Uint8ClampedArray(width * height * 4),
    };
  }
}
/* eslint-enable class-methods-use-this */

class Canvas {
  constructor() {
    this.imageData = null;
  }
  getContext(context) {
    if (context !== '2d') throw new Error(`${context} is not support.`);
    return new Ctx(this);
  }
}

global.document = {
  createElement: element => {
    if (element !== 'canvas') return null;
    return new Canvas();
  },
};
