// @flow
import React from 'react';
import ClassNames from 'classnames';

import HeaderSubMenu from './HeaderSubMenu';

export type SelectMenu = 'sketch' | 'resizeAndRotate' | 'colorTone';

type Props = {||};

type State = {
  selectMenu: SelectMenu,
};

export default class Header extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {selectMenu: 'sketch'};
    this.onClickTextButton = this.onClickTextButton.bind(this);
  }
  onClickTextButton(selectMenu: SelectMenu) {
    this.setState({selectMenu});
  }
  onClickTextButton: Function;
  render() {
    const {selectMenu} = this.state;
    return (
      <div className="header">
        <div className="header-menu">
          <button className="fa fa-undo header-menu-button header-menu-button__icon" />
          <button className="fa fa-repeat header-menu-button header-menu-button__icon" />
          <button className="fa fa-upload header-menu-button header-menu-button__icon" />
          <button className="fa fa-download header-menu-button header-menu-button__icon" />
          <button
            className={ClassNames(
              'header-menu-button header-menu-button__text',
              {
                'header-menu-button__text-active': selectMenu === 'sketch',
              }
            )}
            onClick={() => this.onClickTextButton('sketch')}
          >
            スケッチ
          </button>
          <button
            className={ClassNames(
              'header-menu-button header-menu-button__text',
              {
                'header-menu-button__text-active':
                  selectMenu === 'resizeAndRotate',
              }
            )}
            onClick={() => this.onClickTextButton('resizeAndRotate')}
          >
            リサイズと回転
          </button>
          <button
            className={ClassNames(
              'header-menu-button header-menu-button__text',
              {
                'header-menu-button__text-active': selectMenu === 'colorTone',
              }
            )}
            onClick={() => this.onClickTextButton('colorTone')}
          >
            色調変更
          </button>
        </div>
        <HeaderSubMenu selectMenu={selectMenu} />
      </div>
    );
  }
}
