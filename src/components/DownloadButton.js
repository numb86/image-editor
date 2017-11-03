// @flow
import React from 'react';

export default function DownloadButton(props: {
  href: string | null,
  download: string | null,
}) {
  if (!props.href) return null;
  return (
    <div className="download-button">
      <a href={props.href} download={props.download}>
        画像をダウンロード
      </a>
    </div>
  );
}
