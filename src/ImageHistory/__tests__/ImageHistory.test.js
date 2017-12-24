import assert from 'assert';

import ImageHistory from '../ImageHistory';

describe('ImageHistory', () => {
  const abc = {originalData: 'abc', editedData: 'editedAbc'};
  const qwerty = {originalData: 'qwerty', editedData: 'editedQwerty'};
  const foo = {originalData: 'foo', editedData: 'editedQwerty'};
  let imageHistory;
  beforeEach(() => {
    imageHistory = new ImageHistory();
  });
  describe('初期状態', () => {
    it('historyは空の配列である', () => {
      assert(Array.isArray(imageHistory.history));
      assert(imageHistory.history.length === 0);
    });
    it('positionはnullである', () => {
      assert(imageHistory.position === null);
    });
  });
  describe('update', () => {
    it('渡された引数が、historyの先頭の要素になる', () => {
      imageHistory.update(abc);
      assert(imageHistory.history[0].originalData === abc.originalData);
      imageHistory.update(qwerty);
      assert(imageHistory.history[0].originalData === qwerty.originalData);
    });
    it('positionが0になる', () => {
      imageHistory.position = 3;
      assert(imageHistory.position !== 0);
      imageHistory.update(abc);
      assert(imageHistory.position === 0);
    });
    it('position > 0 の場合、positionより前の要素は全て消去し前に詰める', () => {
      imageHistory.update(abc);
      imageHistory.update(qwerty);
      imageHistory.update(foo);
      imageHistory.position = 2;
      imageHistory.update(abc);
      assert(imageHistory.history.length === 2);
      assert(imageHistory.history[0].originalData === abc.originalData);
      assert(imageHistory.history[1].originalData === abc.originalData);
    });
  });
  describe('get', () => {
    it('history[position]の要素を取得する', () => {
      imageHistory.update(abc);
      imageHistory.update(qwerty);
      imageHistory.position = 1;
      assert(imageHistory.get().originalData === abc.originalData);
      imageHistory.position = 0;
      assert(imageHistory.get().originalData === qwerty.originalData);
    });
    it('historyが空ならnullを返す', () => {
      assert(imageHistory.history.length === 0);
      assert(imageHistory.get() === null);
    });
  });
  describe('back', () => {
    it('positionの数値を一つ増やす', () => {
      imageHistory.update(abc);
      imageHistory.update(qwerty);
      imageHistory.update(foo);
      imageHistory.back();
      assert(imageHistory.position === 1);
      imageHistory.back();
      assert(imageHistory.position === 2);
    });
    it('(history.length - 1)よりは増えない', () => {
      imageHistory.update(abc);
      imageHistory.back();
      assert(imageHistory.position === 0);
      imageHistory.update(qwerty);
      imageHistory.back();
      imageHistory.back();
      assert(imageHistory.position === 1);
    });
    it('historyが空なら何も起こらない', () => {
      assert(imageHistory.history.length === 0);
      assert(imageHistory.position === null);
      imageHistory.back();
      assert(imageHistory.position === null);
    });
  });
  describe('forward', () => {
    it('positionの数値を一つ減らす', () => {
      imageHistory.update(abc);
      imageHistory.update(qwerty);
      imageHistory.update(foo);
      imageHistory.position = 2;
      imageHistory.forward();
      assert(imageHistory.position === 1);
      imageHistory.forward();
      assert(imageHistory.position === 0);
    });
    it('0よりは減らない', () => {
      imageHistory.update(abc);
      imageHistory.position = 1;
      imageHistory.forward();
      assert(imageHistory.position === 0);
      imageHistory.forward();
      assert(imageHistory.position === 0);
    });
    it('historyが空なら何も起こらない', () => {
      assert(imageHistory.history.length === 0);
      assert(imageHistory.position === null);
      imageHistory.forward();
      assert(imageHistory.position === null);
    });
  });
});
