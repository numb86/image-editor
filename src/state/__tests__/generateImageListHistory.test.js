import assert from 'assert';

import {
  generateImageListHistory,
  BACK,
  FORWARD,
  UPDATE,
} from '../generateImageListHistory';

describe('generateImageListHistory', () => {
  let originalHistory;
  beforeEach(() => {
    originalHistory = {history: [['a'], ['b'], ['c']], position: 0};
  });

  describe('back', () => {
    it('positionの数値を一つ増やす', () => {
      const newHistory = generateImageListHistory({
        type: BACK,
        currentState: originalHistory,
      });
      assert(newHistory.position === 1);
    });
    it('positionが(history.length - 1)の場合、positionは変わらない', () => {
      originalHistory.position = 2;
      assert(originalHistory.position === originalHistory.history.length - 1);
      const newHistory = generateImageListHistory({
        type: BACK,
        currentState: originalHistory,
      });
      assert(newHistory.position === 2);
      assert(newHistory !== originalHistory);
    });
    it('新しいhistoryを返すため、副作用がない', () => {
      const newHistory = generateImageListHistory({
        type: BACK,
        currentState: originalHistory,
      });
      assert(newHistory.history !== originalHistory.history);
      assert(originalHistory.position === 0);
      assert(newHistory.position === 1);
    });
  });

  describe('forward', () => {
    it('positionの数値を一つ減らす', () => {
      originalHistory.position = 1;
      const newHistory = generateImageListHistory({
        type: FORWARD,
        currentState: originalHistory,
      });
      assert(newHistory.position === 0);
    });
    it('positionが0の場合、positionは変わらない', () => {
      assert(originalHistory.position === 0);
      const newHistory = generateImageListHistory({
        type: FORWARD,
        currentState: originalHistory,
      });
      assert(newHistory.position === 0);
      assert(newHistory !== originalHistory);
    });
    it('新しいhistoryを返すため、副作用がない', () => {
      originalHistory.position = 2;
      const newHistory = generateImageListHistory({
        type: FORWARD,
        currentState: originalHistory,
      });
      assert(newHistory.history !== originalHistory.history);
      assert(originalHistory.position === 2);
      assert(newHistory.position === 1);
    });
  });

  describe('update', () => {
    it('渡された要素が、historyの先頭の要素になる', () => {
      const newHistory = generateImageListHistory({
        type: UPDATE,
        imageList: ['d'],
        currentState: originalHistory,
      });
      assert(newHistory.history[0][0] === 'd');
      assert(newHistory.history[1][0] === 'a');
    });
    it('position > 0 の場合、positionより前の要素は全て消去し前に詰める', () => {
      originalHistory.position = 1;
      const newHistory = generateImageListHistory({
        type: UPDATE,
        imageList: ['d'],
        currentState: originalHistory,
      });
      assert(newHistory.history[0][0] === 'd');
      assert(newHistory.history[1][0] === 'b');
    });
    it('positionが0になる', () => {
      originalHistory.position = 1;
      const newHistory = generateImageListHistory({
        type: UPDATE,
        imageList: ['d'],
        currentState: originalHistory,
      });
      assert(newHistory.position === 0);
    });
    it('新しいhistoryを返すため、副作用がない', () => {
      const newHistory = generateImageListHistory({
        type: UPDATE,
        imageList: ['d'],
        currentState: originalHistory,
      });
      assert(newHistory !== originalHistory);
      assert(newHistory.history !== originalHistory.history);
    });
  });
});
