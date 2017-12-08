import React from 'react';
import {shallow} from 'enzyme';
import {spy} from 'sinon';
import assert from 'assert';

import SelectBox from '../SelectBox';

describe('SelectBox', () => {
  let onChange;
  let wrapper;
  const STATE_NAME = 'hogehogeState';
  const SELECT_LIST = [
    {value: 1, label: '選択肢1'},
    {value: 2, label: '選択肢2'},
    {value: 3, label: '選択肢3'},
  ];
  const DEFAULT_VALUE = SELECT_LIST[2].value;
  beforeEach(() => {
    onChange = spy();
    wrapper = shallow(
      <SelectBox
        defaultValue={DEFAULT_VALUE}
        onChange={onChange}
        stateName={STATE_NAME}
        optionList={SELECT_LIST}
      />
    );
  });

  it('propsとして渡した値がselect要素のdefaultValueになっている', () => {
    assert(wrapper.find('select').prop('defaultValue') === DEFAULT_VALUE);
  });
  it('optionListとして渡した値がoption要素のリストになる', () => {
    const optionList = wrapper.find('option');
    assert(optionList.length === SELECT_LIST.length);
    assert(optionList.get(0).props.value === SELECT_LIST[0].value);
    assert(optionList.get(0).props.children === SELECT_LIST[0].label);
  });
  it('changeイベントによってprops.onChangeが実行される', () => {
    const TARGET_OPTIONS = null;
    assert(onChange.callCount === 0);
    wrapper
      .find('select')
      .simulate('change', {target: {options: TARGET_OPTIONS}});
    assert(onChange.callCount === 1);
    assert(onChange.args[0][0] === TARGET_OPTIONS);
    assert(onChange.args[0][1] === STATE_NAME);
  });
});
