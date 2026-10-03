//=============================================================================
// Plugin for RPG Maker MZ
// DamagePopupColor.js（改造版 + セーブデータ補完 + NewGame補完）
//=============================================================================

/*:
 * @target MZ
 * @plugindesc 弱点属性を受けた際、その属性によりダメージ色を変更（デフォルト色内蔵・セーブ＆ニューゲーム補完）
 * @author 神無月サスケ（改造: 貴方）
 */

(() => {
  const pluginName = 'DamagePopupColor';

  //=============================================================================
  // 🔧 デフォルト属性色（ユーザー設定）
  //=============================================================================
  const defaultWeakElementColors = {
    2: '#FF4444',  // 炎
    3: '#66CCFF',  // 氷
    4: '#E6C84C',  // 雷
    5: '#66FFFF',  // 水
    6: '#C2B280',  // 土
    7: '#99FF99',  // 風
    8: '#FFF9CC',  // 光
    9: '#9966FF'   // 闇
  };

  //=============================================================================
  // 🟦 デフォルト設定の補完処理（共通）
  //=============================================================================
  const applyDefaultElementColors = () => {
    $gameSystem.weakElementColor = $gameSystem.weakElementColor || [];

    for (const id in defaultWeakElementColors) {
      if (
        $gameSystem.weakElementColor[id] === undefined ||
        $gameSystem.weakElementColor[id] === null ||
        $gameSystem.weakElementColor[id] === ''
      ) {
        $gameSystem.weakElementColor[id] = defaultWeakElementColors[id];
      }
    }
  };

  //=============================================================================
  // 🟧 セーブデータロード後の補完
  //=============================================================================
  const _DataManager_extractSaveContents = DataManager.extractSaveContents;
  DataManager.extractSaveContents = function(contents) {
    _DataManager_extractSaveContents.call(this, contents);
    applyDefaultElementColors();
  };

  //=============================================================================
  // 🟩 ニューゲーム開始時の補完（最確実な場所）
  //=============================================================================
  const _DataManager_createGameObjects = DataManager.createGameObjects;
  DataManager.createGameObjects = function() {
    _DataManager_createGameObjects.call(this);
    applyDefaultElementColors();
  };

  //=============================================================================
  // 🔶 プラグインコマンド（元のまま）
  //=============================================================================
  PluginManager.registerCommand(pluginName, 'set', args => {
    $gameSystem.weakElementColor = $gameSystem.weakElementColor || [];
    const elements = eval(args["Element And Color"]);
    for (elementStr of elements) {
      const element = JsonEx.parse(elementStr);
      const elementId = +element.ElementId;
      const colorId = element.ColorId || 0;
      $gameSystem.weakElementColor[elementId] = colorId;
    }
  });

  //=============================================================================
  // 🔶 ダメージ色変更処理 (#カラー対応)
  //=============================================================================
  const _ColorManager_damageColor = ColorManager.damageColor;
  ColorManager.damageColor = function(colorType) {
    if (colorType === 0 && $gameSystem.weakElementColor) {
      const colorId = $gameSystem.weakElementColor[$gameTemp.weakElementId];
      if (colorId != null) {
        if (typeof colorId === 'string' && colorId.startsWith('#')) {
          return colorId;
        } else {
          return this.textColor(colorId);
        }
      }
    }
    return _ColorManager_damageColor.call(this, colorType);
  };

  //=============================================================================
  // 🔶 弱点属性検出処理
  //=============================================================================
  const modifyMaxElementId = (rate, elementId) => {
    const maxRate = $gameTemp.maxElementRate || 1;
    if (rate > maxRate) {
      $gameTemp.weakElementId = elementId;
      $gameTemp.maxElementRate = rate;
    }
  };

  const _Game_Battler_elementRate = Game_BattlerBase.prototype.elementRate;
  Game_BattlerBase.prototype.elementRate = function(elementId) {
    const rate = _Game_Battler_elementRate.call(this, elementId);
    modifyMaxElementId(rate, elementId);
    return rate;
  };

  //=============================================================================
  // 🔶 一時変数リセット処理
  //=============================================================================
  const resetMaxElementId = () => {
    $gameTemp.weakElementId = null;
    $gameTemp.maxElementRate = null;
  };

  Window_BattleLog.prototype.resetMaxElementId = function() {
    resetMaxElementId();
  };

  const _Window_BattleLog_displayActionResults =
    Window_BattleLog.prototype.displayActionResults;
  Window_BattleLog.prototype.displayActionResults = function(subject, target) {
    _Window_BattleLog_displayActionResults.call(this, subject, target);
    this.push('resetMaxElementId');
  };

})();
