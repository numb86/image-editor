import React from 'react';
import {shallow} from 'enzyme';
import assert from 'assert';

import DownloadButton from '../DownloadButton';

describe('DownloadButton', () => {
  it('props.hrefが渡されないときはnullを返す', () => {
    const wrapper = shallow(<DownloadButton />);
    assert(wrapper.type() === null);
  });
  it('props.hrefが渡されたときはレンダリングする', () => {
    const wrapper = shallow(<DownloadButton href="hoge" />);
    assert(wrapper.type() === 'div');
    assert(wrapper.find('a').length === 1);
  });
  it('propsの値がそのままa要素のhrefとdownloadに使われる', () => {
    const URL = 'url';
    const FILE_NAME = 'fileName';
    const wrapper = shallow(<DownloadButton href={URL} download={FILE_NAME} />);
    assert(wrapper.find('a').prop('href') === URL);
    assert(wrapper.find('a').prop('download') === FILE_NAME);
  });
});
