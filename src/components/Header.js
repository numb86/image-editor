// @flow
import React from 'react';
import ClassNames from 'classnames';

import HeaderSubMenu from './HeaderSubMenu';

const SELECT_MENU_SKETCH: 'sketch' = 'sketch';
const SELECT_MENU_RESIZE_AND_ROTATE: 'resizeAndRotate' = 'resizeAndRotate';
const SELECT_MENU_COLOR_TONE: 'colorTone' = 'colorTone';

export type SelectMenu =
  | typeof SELECT_MENU_SKETCH
  | typeof SELECT_MENU_RESIZE_AND_ROTATE
  | typeof SELECT_MENU_COLOR_TONE;

const TEXT_BUTTON_LIST = [
  {value: SELECT_MENU_SKETCH, label: 'スケッチ'},
  {value: SELECT_MENU_RESIZE_AND_ROTATE, label: 'リサイズと回転'},
  {value: SELECT_MENU_COLOR_TONE, label: '色調変更'},
];

type Props = {
  onImageSelected: (files: FileList) => void,
  previewImageDataUrl: string | null,
  downloadImageFileName: string | null,
  resizeRatio: number,
  rotateAngle: number,
  colorToneId: number,
  onChangeImageSetting: (
    options: HTMLOptionsCollection,
    stateName: string
  ) => void,
  undo: () => void,
  redo: () => void,
};

type State = {
  selectedTextMenu: SelectMenu,
};

export default class Header extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {selectedTextMenu: 'sketch'};
    this.onClickTextButton = this.onClickTextButton.bind(this);
  }
  onClickTextButton(selectedTextMenu: SelectMenu) {
    this.setState({selectedTextMenu});
  }
  onClickTextButton: Function;
  render() {
    const {selectedTextMenu} = this.state;
    const {
      onImageSelected,
      previewImageDataUrl,
      downloadImageFileName,
      resizeRatio,
      rotateAngle,
      colorToneId,
      onChangeImageSetting,
      undo,
      redo,
    } = this.props;
    return (
      <div className="header">
        <div className="header-menu">
          <button
            className="fa fa-undo header-menu-button header-menu-button__icon"
            onClick={undo}
          />
          <button
            className="fa fa-repeat header-menu-button header-menu-button__icon"
            onClick={redo}
          />
          <label
            htmlFor="image-upload-input"
            className="fa fa-upload header-menu-button header-menu-button__icon"
          >
            <input
              id="image-upload-input"
              type="file"
              accept="image/*"
              onChange={e => onImageSelected(e.target.files)}
            />
          </label>
          <a href={previewImageDataUrl} download={downloadImageFileName}>
            <i className="fa fa-download header-menu-button header-menu-button__icon" />
          </a>
          {TEXT_BUTTON_LIST.map(text => (
            <button
              key={text.value}
              className={ClassNames(
                'header-menu-button header-menu-button__text',
                {
                  'header-menu-button__text-active':
                    selectedTextMenu === text.value,
                }
              )}
              onClick={() => this.onClickTextButton((text.value: SelectMenu))}
            >
              {text.label}
            </button>
          ))}
        </div>
        <HeaderSubMenu
          selectMenu={selectedTextMenu}
          resizeRatio={resizeRatio}
          rotateAngle={rotateAngle}
          colorToneId={colorToneId}
          onChangeImageSetting={onChangeImageSetting}
        />
      </div>
    );
  }
}
