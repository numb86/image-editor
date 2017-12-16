import React from 'react';
import {shallow} from 'enzyme';
import assert from 'assert';

import FileTransferButtons from '../FileTransferButtons';

describe('FileTransferButtons', () => {
  const wrapper = shallow(
    <FileTransferButtons
      previewImageDataUrl="called previewImageDataUrl"
      downloadImageFileName="called downloadImageFileName"
    />
  );
  it('DownloadButtonがレンダリングされる', () => {
    assert(wrapper.find('DownloadButton').length === 1);
  });
  it('porps.previewImageDataUrlとprops.downloadImageFileNameがDownloadButtonに渡される', () => {
    assert(
      wrapper.find('DownloadButton').prop('href') ===
        'called previewImageDataUrl'
    );
    assert(
      wrapper.find('DownloadButton').prop('download') ===
        'called downloadImageFileName'
    );
  });
});
