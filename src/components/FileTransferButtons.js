// @flow
import React from 'react';

import DownloadButton from './DownloadButton';

export default function FileTransferButtons(props: {
  previewImageDataUrl: string | null,
  downloadImageFileName: string | null,
}) {
  return (
    <div className="file-transfer-button-area">
      <DownloadButton
        href={props.previewImageDataUrl}
        download={props.downloadImageFileName}
      />
    </div>
  );
}
