// @flow
import React from 'react';
import ClassNames from 'classnames';

import HeaderSubMenu from './HeaderSubMenu';

export type SelectMenu = 'sketch' | 'resizeAndRotate' | 'colorTone';

type Props = {||};

type State = {
  selectMenu: SelectMenu,
};

const TEXT_BUTTON_LIST = [
  {value: 'sketch', label: 'スケッチ'},
  {value: 'resizeAndRotate', label: 'リサイズと回転'},
  {value: 'colorTone', label: '色調変更'},
];

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
          {TEXT_BUTTON_LIST.map(text => (
            <button
              key={text.value}
              className={ClassNames(
                'header-menu-button header-menu-button__text',
                {
                  'header-menu-button__text-active': selectMenu === text.value,
                }
              )}
              onClick={() => this.onClickTextButton(text.value)}
            >
              {text.label}
            </button>
          ))}
        </div>
        <HeaderSubMenu selectMenu={selectMenu} />
      </div>
    );
  }
}
