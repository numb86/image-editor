// @flow
import React from 'react';

import UploadButton from './UploadButton';
import DownloadButton from './DownloadButton';

export default function FileTransferButtons(props: {
  onImageSelected: (files: FileList) => void,
  previewImageDataUrl: string | null,
  downloadImageFileName: string | null,
}) {
  return (
    <div className="file-transfer-button-area">
      <UploadButton onChange={props.onImageSelected} />
      <DownloadButton
        href={props.previewImageDataUrl}
        download={props.downloadImageFileName}
      />
    </div>
  );
}
