import React from 'react';
import {shallow} from 'enzyme';
import {spy} from 'sinon';
import assert from 'assert';

import TextForm from '../TextForm';

describe('TextForm', () => {
  let onSubmit;
  let onChange;
  let wrapper;
  let textBox;
  const PROPS_TEXT_VALUE = 'foo';
  beforeEach(() => {
    onSubmit = spy();
    onChange = spy();
    wrapper = shallow(
      <TextForm
        text={PROPS_TEXT_VALUE}
        onSubmit={onSubmit}
        onChange={onChange}
      />
    );
    textBox = wrapper.find('input').first();
  });

  it('props.textの値がテキストボックスの値になる', () => {
    assert(textBox.prop('type') === 'text');
    assert(textBox.prop('value') === PROPS_TEXT_VALUE);
  });

  it('changeイベントによってprops.onChangeが実行される', () => {
    textBox.simulate('change', {target: {value: 'hogehoge'}});
    assert(onChange.callCount === 1);
  });

  it('formの送信やEnterの押下でprops.onSubmitが実行される', () => {
    assert(wrapper.find('input').get(1).props.type === 'submit');
    assert(onSubmit.callCount === 0);
    wrapper.find('form').simulate('submit', {preventDefault() {}});
    assert(onSubmit.callCount === 1);
    textBox.simulate('keyPress', {charCode: 16}); // shiftを押下
    assert(onSubmit.callCount === 1);
    textBox.simulate('keyPress', {charCode: 13}); // enterを押下
    assert(onSubmit.callCount === 2);
  });
});
