import React from 'react';

import UploadButton from './UploadButton';
import DownloadButton from './DownloadButton';

export default function FileTransferButtons(props) {
  return (
    <div className="fileTransferButtonArea">
      <UploadButton onChange={props.onImageSelected} />
      <DownloadButton
        href={props.previewImageDataUrl}
        download={props.downloadImageFileName}
      />
    </div>
  );
}
