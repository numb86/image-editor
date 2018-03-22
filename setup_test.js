/* eslint-disable import/no-extraneous-dependencies */
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {JSDOM} from 'jsdom';
/* eslint-enable import/no-extraneous-dependencies */

Enzyme.configure({adapter: new Adapter()});

const jsdom = new JSDOM('<!doctype html><html><body></body></html>', {
  resources: 'usable',
});

global.window = jsdom.window;
global.document = window.document;
