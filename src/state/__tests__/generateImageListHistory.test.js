import assert from 'assert';

import {
  generateImageListHistory,
  BACK,
  FORWARD,
  UPDATE,
  START_OMIT_LENGTH_COUNT,
  OMIT,
} from '../generateImageListHistory';

describe('generateImageListHistory', () => {
  let originalHistory;
  beforeEach(() => {
    originalHistory = {
      history: [['a'], ['b'], ['c']],
      position: 0,
      omitLength: null,
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
    it('omitLength が null でないときは、例外を投げる', () => {
      originalHistory.omitLength = 0;
      let error = false;
      try {
        generateImageListHistory({
          type: BACK,
          currentState: originalHistory,
        });
      } catch (e) {
        error = true;
      }
      assert(error === true);
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
    it('omitLength が null でないときは、例外を投げる', () => {
      originalHistory.omitLength = 0;
      let error = false;
      try {
        generateImageListHistory({
          type: FORWARD,
          currentState: originalHistory,
        });
      } catch (e) {
        error = true;
      }
      assert(error === true);
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
    it('omitLength が null でないときは、カウントアップしていく', () => {
      originalHistory.omitLength = -1;
      const newHistory = generateImageListHistory({
        type: UPDATE,
        imageList: ['d'],
        currentState: originalHistory,
      });
      assert(newHistory.omitLength === 0);
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

  describe('startOmitLengthCount', () => {
    it('omitLength が null から -1 になる', () => {
      const newHistory = generateImageListHistory({
        type: START_OMIT_LENGTH_COUNT,
        currentState: originalHistory,
      });
      assert(originalHistory.omitLength === null);
      assert(newHistory.omitLength === -1);
    });
    it('omitLength が null でないときに呼び出されると例外を投げる', () => {
      originalHistory.omitLength = 1;
      let error = false;
      try {
        generateImageListHistory({
          type: START_OMIT_LENGTH_COUNT,
          currentState: originalHistory,
        });
      } catch (e) {
        error = true;
      }
      assert(error === true);
    });
    it('新しいhistoryを返すため、副作用がない', () => {
      const newHistory = generateImageListHistory({
        type: START_OMIT_LENGTH_COUNT,
        currentState: originalHistory,
      });
      assert(originalHistory.omitLength === null);
      assert(newHistory.omitLength === -1);
      assert(originalHistory.history !== newHistory.history);
    });
  });

  describe('omit', () => {
    it('history[1] 以降の要素を、 omitLength の数だけ削除される', () => {
      originalHistory.omitLength = 1;
      const newHistory = generateImageListHistory({
        type: OMIT,
        currentState: originalHistory,
      });
      const {history} = newHistory;
      assert(history.length === 2);
      assert(history[0][0] === 'a');
      assert(history[1][0] === 'c');
    });
    it('omitLength が 0 以下だった時は、history に変化はない', () => {
      originalHistory.omitLength = 0;
      const newHistory = generateImageListHistory({
        type: OMIT,
        currentState: originalHistory,
      });
      const {history} = newHistory;
      assert(history.length === 3);
      assert(history[0][0] === 'a');
      assert(history[1][0] === 'b');
    });
    it('omitLength が null になる', () => {
      originalHistory.omitLength = 1;
      const newHistory = generateImageListHistory({
        type: OMIT,
        currentState: originalHistory,
      });
      assert(newHistory.omitLength === null);
    });
    it('omitLength が null のときに呼び出されると、例外を投げる', () => {
      assert(originalHistory.omitLength === null);
      let error = false;
      try {
        generateImageListHistory({
          type: OMIT,
          currentState: originalHistory,
        });
      } catch (e) {
        error = true;
      }
      assert(error === true);
    });
    it('新しいhistoryを返すため、副作用がない', () => {
      originalHistory.omitLength = 0;
      const newHistory = generateImageListHistory({
        type: OMIT,
        currentState: originalHistory,
      });
      const {history} = newHistory;
      assert(history.length === 3);
      assert(originalHistory.history !== newHistory.history);
    });
  });
});
