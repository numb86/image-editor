import assert from 'assert';

import ImageHistory from '../ImageHistory';

describe('ImageHistory', () => {
  const stringAbc = 'abc';
  const stringQwerty = 'qwerty';
  const stringFoo = 'foo';
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
      imageHistory.update(stringAbc);
      assert(imageHistory.history[0] === stringAbc);
      imageHistory.update(stringQwerty);
      assert(imageHistory.history[0] === stringQwerty);
    });
    it('positionが0になる', () => {
      imageHistory.position = 3;
      assert(imageHistory.position !== 0);
      imageHistory.update(stringAbc);
      assert(imageHistory.position === 0);
    });
    it('position > 0 の場合、positionより前の要素は全て消去し前に詰める', () => {
      imageHistory.update(stringAbc);
      imageHistory.update(stringQwerty);
      imageHistory.update(stringFoo);
      imageHistory.position = 2;
      imageHistory.update(stringAbc);
      assert(imageHistory.history.length === 2);
      assert(imageHistory.history[0] === stringAbc);
      assert(imageHistory.history[1] === stringAbc);
    });
  });
  describe('get', () => {
    it('history[position]の要素を取得する', () => {
      imageHistory.update(stringAbc);
      imageHistory.update(stringQwerty);
      imageHistory.position = 1;
      assert(imageHistory.get() === stringAbc);
    });
    it('historyが空ならnullを返す', () => {
      assert(imageHistory.history.length === 0);
      assert(imageHistory.get() === null);
    });
  });
  describe('back', () => {
    it('positionの数値を一つ増やす', () => {
      imageHistory.update(stringAbc);
      imageHistory.update(stringQwerty);
      imageHistory.update(stringFoo);
      imageHistory.back();
      assert(imageHistory.position === 1);
      imageHistory.back();
      assert(imageHistory.position === 2);
    });
    it('(history.length - 1)よりは増えない', () => {
      imageHistory.update(stringAbc);
      imageHistory.back();
      assert(imageHistory.position === 0);
      imageHistory.update(stringQwerty);
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
      imageHistory.update(stringAbc);
      imageHistory.update(stringQwerty);
      imageHistory.update(stringFoo);
      imageHistory.position = 2;
      imageHistory.forward();
      assert(imageHistory.position === 1);
      imageHistory.forward();
      assert(imageHistory.position === 0);
    });
    it('0よりは減らない', () => {
      imageHistory.update(stringAbc);
      imageHistory.position = 1;
      imageHistory.forward();
      assert(imageHistory.position === 0);
      imageHistory.forward();
      assert(imageHistory.position === 0);
    });
    it('', () => {});
    it('historyが空なら何も起こらない', () => {
      assert(imageHistory.history.length === 0);
      assert(imageHistory.position === null);
      imageHistory.forward();
      assert(imageHistory.position === null);
    });
  });
});
