import React from 'react';
import {shallow} from 'enzyme';
import {spy} from 'sinon';
import assert from 'assert';

import UploadButton from '../UploadButton';

describe('UploadButton', () => {
  it('ファイルをアップロードするとprops.onChangeが実行される', () => {
    const callback = spy();
    const wrapper = shallow(<UploadButton onChange={callback} />);
    assert(callback.callCount === 0);
    assert(wrapper.find('input').prop('type') === 'file');
    wrapper.find('input').simulate('change', {target: {files: []}});
    assert(callback.callCount === 1);
  });
});
