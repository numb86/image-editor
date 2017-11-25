import React from 'react';
import {shallow} from 'enzyme';
import assert from 'assert';

import FileTransferButtons from '../FileTransferButtons';

describe('FileTransferButtons', () => {
  const wrapper = shallow(
    <FileTransferButtons
      onImageSelected={() => 'called onImageSelected'}
      previewImageDataUrl="called previewImageDataUrl"
      downloadImageFileName="called downloadImageFileName"
    />
  );
  it('UploadButtonとDownloadButtonがレンダリングされる', () => {
    assert(wrapper.find('UploadButton').length === 1);
    assert(wrapper.find('DownloadButton').length === 1);
  });
  it('porps.onImageSelectedがUploadButtonに渡される', () => {
    assert(
      wrapper.find('UploadButton').prop('onChange')() ===
        'called onImageSelected'
    );
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
