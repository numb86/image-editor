// @flow
import React from 'react';
import ClassNames from 'classnames';

import SketchManage from './SketchManage';
import ResizeAndColorToneManage from './ResizeAndColorToneManage';
import DisplayManage from './DisplayManage';

import {DRAW_LINE, ERASER} from '../actionLayer/ActionLayer';
import {
  generateImageListHistory,
  BACK,
  FORWARD,
} from '../../state/generateImageListHistory';

import type {DisplayType} from '../Display';
import type {ImageListHistory} from '../../state/generateImageListHistory';
import type {
  ActionLayerSettings,
  ChangeableProperty,
} from '../../state/generateActionLayerSettings';
import type {ActionLayerName} from '../actionLayer/ActionLayer';

const SKETCH: 'スケッチ' = 'スケッチ';
const RESIZE_AND_COLOR_TONE_CHANGE: 'リサイズと色調変換' = 'リサイズと色調変換';
const CANVAS: 'キャンバス' = 'キャンバス';

export type HeaderMenuList =
  | typeof SKETCH
  | typeof RESIZE_AND_COLOR_TONE_CHANGE
  | typeof CANVAS;

const HEADER_MENU_LIST = [SKETCH, RESIZE_AND_COLOR_TONE_CHANGE, CANVAS];

export default function Header({
  selectedMenu,
  downloadImageFile,
  uploadImageFile,
  imageListHistory,
  updateImageListHistory,
  select,
  activeActionLayer,
  actionLayerSettings,
  specifyActiveActionLayer,
  updateActionLayerSettings,
  display,
  updateDisplaySize,
  displayedImageDatas,
  imageData,
  updateImageData,
}: {
  selectedMenu: HeaderMenuList,
  downloadImageFile: () => void,
  uploadImageFile: FileList => void,
  imageListHistory: ImageListHistory,
  updateImageListHistory: ImageListHistory => void,
  select: HeaderMenuList => void,
  activeActionLayer: ActionLayerName,
  actionLayerSettings: ActionLayerSettings,
  specifyActiveActionLayer: ActionLayerName => void,
  updateActionLayerSettings: (
    target: ActionLayerName,
    data: ChangeableProperty
  ) => void,
  display: DisplayType,
  updateDisplaySize: (width: number, height: number) => void,
  displayedImageDatas: ImageData[],
  imageData: ImageData,
  updateImageData: ImageData => void,
}) {
  return (
    <header className="header">
      <button className="download fa fa-download" onClick={downloadImageFile} />
      <label htmlFor="image-upload-input" className="upload fa fa-upload">
        <input
          id="image-upload-input"
          type="file"
          accept="image/*"
          onChange={e => {
            e.preventDefault();
            uploadImageFile(e.target.files);
          }}
        />
      </label>
      <button
        className="undo fa fa-undo"
        onClick={() => {
          updateImageListHistory(
            generateImageListHistory({
              type: BACK,
              currentState: imageListHistory,
            })
          );
        }}
      />
      <button
        className="redo fa fa-repeat"
        onClick={() => {
          updateImageListHistory(
            generateImageListHistory({
              type: FORWARD,
              currentState: imageListHistory,
            })
          );
        }}
      />
      <span className="menu-list">
        {HEADER_MENU_LIST.map(menuName => {
          const classNames = ClassNames({
            selected: selectedMenu === menuName,
          });
          return (
            <button
              key={menuName}
              className={classNames}
              onClick={() => select(menuName)}
            >
              {menuName}
            </button>
          );
        })}
      </span>
      <div className="sub-menu">
        {selectedMenu === SKETCH && (
          <SketchManage
            activeActionLayer={activeActionLayer}
            lineWidth={{
              [DRAW_LINE]: actionLayerSettings[DRAW_LINE].ctx.lineWidth,
              [ERASER]: actionLayerSettings[ERASER].ctx.lineWidth,
            }}
            specifyActiveActionLayer={specifyActiveActionLayer}
            updateActionLayerSettings={updateActionLayerSettings}
          />
        )}
        {selectedMenu === RESIZE_AND_COLOR_TONE_CHANGE && (
          <ResizeAndColorToneManage
            imageData={imageData}
            updateImageData={updateImageData}
          />
        )}
        {selectedMenu === CANVAS && (
          <DisplayManage
            updateDisplaySize={updateDisplaySize}
            displayedImageDatas={displayedImageDatas}
            display={display}
          />
        )}
      </div>
    </header>
  );
}
