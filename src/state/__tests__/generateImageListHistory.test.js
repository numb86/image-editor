import assert from 'assert';

import {
  generateImageListHistory,
  BACK,
  FORWARD,
  UPDATE,
  SET_OMIT_BASE_POSITION,
  OMIT,
} from '../generateImageListHistory';

describe('generateImageListHistory', () => {
  let originalHistory;
  beforeEach(() => {
    originalHistory = {
      history: [['a'], ['b'], ['c']],
      position: 0,
      omitBasePosition: null,
    };
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

  describe('setOmitBasePosition', () => {
    it('指定した数値が omitBasePosition に設定される', () => {
      const newHistory = generateImageListHistory({
        type: SET_OMIT_BASE_POSITION,
        currentState: originalHistory,
        target: 0,
      });
      assert(originalHistory.omitBasePosition === null);
      assert(newHistory.omitBasePosition === 0);
    });
    it('omitBasePosition が null でないときに呼び出されると例外を投げる', () => {
      originalHistory.omitBasePosition = 1;
      let error = false;
      try {
        generateImageListHistory({
          type: SET_OMIT_BASE_POSITION,
          currentState: originalHistory,
          target: 0,
        });
      } catch (e) {
        error = true;
      }
      assert(error === true);
    });
    it('history.length 以上の値を指定された場合は例外を投げる', () => {
      let error = false;
      try {
        generateImageListHistory({
          type: SET_OMIT_BASE_POSITION,
          currentState: originalHistory,
          target: originalHistory.length,
        });
      } catch (e) {
        error = true;
      }
      assert(error === true);
    });
    it('新しいhistoryを返すため、副作用がない', () => {
      const newHistory = generateImageListHistory({
        type: SET_OMIT_BASE_POSITION,
        currentState: originalHistory,
        target: 1,
      });
      assert(originalHistory.omitBasePosition === null);
      assert(newHistory.omitBasePosition === 1);
      assert(originalHistory.history !== newHistory.history);
    });
  });

  describe('omit', () => {
    it('指定した値と omitBasePosition の間にある history が削除される', () => {
      originalHistory.omitBasePosition = 2;
      const newHistory = generateImageListHistory({
        type: OMIT,
        currentState: originalHistory,
        target: 0,
      });
      const {history} = newHistory;
      assert(history.length === 2);
      assert(history[0][0] === 'a');
      assert(history[1][0] === 'c');
    });
    it('omitBasePosition が null になる', () => {
      originalHistory.omitBasePosition = 2;
      const newHistory = generateImageListHistory({
        type: OMIT,
        currentState: originalHistory,
        target: 0,
      });
      assert(newHistory.omitBasePosition === null);
    });
    it('omitBasePosition が null のときに呼び出されると、例外を投げる', () => {
      assert(originalHistory.omitBasePosition === null);
      let error = false;
      try {
        generateImageListHistory({
          type: OMIT,
          currentState: originalHistory,
          target: 0,
        });
      } catch (e) {
        error = true;
      }
      assert(error === true);
    });
    it('omitBasePosition 以上の値を指定された場合は例外を投げる', () => {
      originalHistory.omitBasePosition = 1;
      let error = false;
      try {
        generateImageListHistory({
          type: OMIT,
          currentState: originalHistory,
          target: 1,
        });
      } catch (e) {
        error = true;
      }
      assert(error === true);
      error = false;
      try {
        generateImageListHistory({
          type: OMIT,
          currentState: originalHistory,
          target: 2,
        });
      } catch (e) {
        error = true;
      }
      assert(error === true);
    });
    it('新しいhistoryを返すため、副作用がない', () => {
      originalHistory.omitBasePosition = 2;
      const newHistory = generateImageListHistory({
        type: OMIT,
        currentState: originalHistory,
        target: 1,
      });
      const {history} = newHistory;
      assert(history.length === 3);
      assert(originalHistory.history !== newHistory.history);
    });
  });
});
