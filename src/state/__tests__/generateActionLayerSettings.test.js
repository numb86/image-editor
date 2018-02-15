import assert from 'assert';

import {
  generateActionLayerSettings,
  SPECIFY_CONTEXT_PROPERTY,
} from '../generateActionLayerSettings';

describe('generateActionLayerSettings', () => {
  let originalSettings;
  beforeEach(() => {
    originalSettings = {
      drawLine: {
        number: 1,
        ctx: {
          lineWidth: 5,
        },
      },
      eraser: {
        number: 2,
        ctx: {
          lineWidth: 10,
        },
      },
      hoge: {
        number: 3,
        boo: 'abc',
      },
    };
  });
  describe('SPECIFY_CONTEXT_PROPERTY', () => {
    it('type で指定したオブジェクトの内容を変更する', () => {
      const TARGET = 'drawLine';
      const newSettings = generateActionLayerSettings({
        type: SPECIFY_CONTEXT_PROPERTY,
        data: {key: 'value'},
        currentState: originalSettings,
        target: TARGET,
      });
      assert(newSettings[TARGET].ctx.lineWidth === 5);
      assert(newSettings[TARGET].ctx.key === 'value');
    });
    it('ctx 以外には影響を与えない', () => {
      const TARGET = 'drawLine';
      const newSettings = generateActionLayerSettings({
        type: SPECIFY_CONTEXT_PROPERTY,
        data: {lineWidth: 7},
        currentState: originalSettings,
        target: TARGET,
      });
      assert(newSettings[TARGET].ctx.lineWidth === 7);
      assert(newSettings[TARGET].number === 1);
    });
    it('type で指定したオブジェクト以外はそのままコピーされる', () => {
      const TARGET = 'drawLine';
      const newSettings = generateActionLayerSettings({
        type: SPECIFY_CONTEXT_PROPERTY,
        data: {lineWidth: 7},
        currentState: originalSettings,
        target: TARGET,
      });
      assert(newSettings[TARGET].ctx.lineWidth === 7);
      assert(newSettings.eraser.ctx.lineWidth === 10);
      assert(newSettings.hoge.boo === 'abc');
    });
    it('副作用なく、新しい settings を生み出せる', () => {
      const TARGET = 'eraser';
      const newSettings = generateActionLayerSettings({
        type: SPECIFY_CONTEXT_PROPERTY,
        data: {lineWidth: 9, key: 'value'},
        currentState: originalSettings,
        target: TARGET,
      });
      assert(newSettings !== originalSettings);

      assert(newSettings[TARGET].ctx.lineWidth === 9);
      assert(originalSettings[TARGET].ctx.lineWidth === 10);
      assert(newSettings[TARGET].ctx.key === 'value');
      assert(originalSettings[TARGET].ctx.key === undefined);
    });
  });
});
