import React from 'react';
import {shallow} from 'enzyme';
import assert from 'assert';

import TextForm from '../TextForm';

describe('TextForm', () => {
  let submitCount = 0;
  let text = '';
  const onSubmit = () => {
    submitCount += 1;
  };
  const onChange = value => {
    text = value;
  };
  const wrapper = shallow(
    <TextForm text={'foo'} onSubmit={onSubmit} onChange={onChange} />
  );
  const textBox = wrapper.find('input').first();
  beforeEach(() => {
    submitCount = 0;
    text = '';
  });

  it('props.textの値がテキストボックスの値になる', () => {
    assert(textBox.prop('type') === 'text');
    assert(textBox.prop('value') === 'foo');
  });

  it('changeイベントによってprops.onChangeが実行される', () => {
    const newValue = 'hogehoge';
    textBox.simulate('change', {target: {value: newValue}});
    assert(text === newValue);
  });

  it('formの送信やEnterの押下でprops.onSubmitが実行される', () => {
    assert(wrapper.find('input').get(1).props.type === 'submit');
    assert(submitCount === 0);
    wrapper.find('form').simulate('submit', {preventDefault() {}});
    assert(submitCount === 1);
    textBox.simulate('keyPress', {charCode: 16}); // shiftを押下
    assert(submitCount === 1);
    textBox.simulate('keyPress', {charCode: 13}); // enterを押下
    assert(submitCount === 2);
  });
});
