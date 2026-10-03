/*:
 * @target MV MZ
 * @plugindesc 実行中のイベントID＋現在行を画面表示するHUD（MV/MZ両対応） v1.1
 * @author あなた
 *
 * @param X
 * @text 表示X
 * @type number
 * @min 0
 * @default 8
 *
 * @param Y
 * @text 表示Y
 * @type number
 * @min 0
 * @default 8
 *
 * @param FontSize
 * @text フォントサイズ
 * @type number
 * @min 10
 * @default 18
 *
 * @param BGOpacity
 * @text 背景不透明度(0-255)
 * @type number
 * @min 0
 * @max 255
 * @default 128
 *
 * @param TextColor
 * @text 文字色(HTMLカラー)
 * @type string
 * @default #FFFFFF
 *
 * @param ShowOnlyOnMap
 * @text マップ画面のみ表示
 * @type boolean
 * @default true
 *
 * @param ShowSwitchId
 * @text 表示制御スイッチID(0で無効)
 * @type switch
 * @default 0
 *
 * @help
 * 現在コマンド実行中の Interpreter が扱っている「イベントID」と
 * 「現在の行（コマンドのインデックス）/ 総行数」「コマンドコード」を表示します。
 *
 * 表示例:
 *   EventID: 12
 *   Line: 34 / 120   Cmd: 101
 *
 * 備考：
 * ・共通イベント等（eventId=0）や待機中/終了直後は「-」表示になります。
 * ・複数並行実行時は、直近でアクティブだった Interpreter の情報が表示されます。
 *
 * ライセンス：プロジェクト内で自由にご利用ください（表記不要）。
 */

(() => {
  'use strict';

  const PLUGIN_NAME = document.currentScript
    ? document.currentScript.src.match(/([^\/]+)\.js$/)[1]
    : 'EventIdHUD';
  const param = (function() {
    const isMZ =
      typeof PluginManagerEx !== 'undefined' ||
      (typeof Utils !== 'undefined' && Utils.RPGMAKER_NAME === 'MZ');
    const raw = (PluginManager.parameters && PluginManager.parameters(PLUGIN_NAME)) || {};
    return {
      x: Number(raw['X'] || 8),
      y: Number(raw['Y'] || 8),
      fontSize: Number(raw['FontSize'] || 18),
      bgOpacity: Math.max(0, Math.min(255, Number(raw['BGOpacity'] || 128))),
      textColor: (raw['TextColor'] || '#FFFFFF'),
      showOnlyOnMap: String(raw['ShowOnlyOnMap'] || 'true') === 'true',
      showSwitchId: Number(raw['ShowSwitchId'] || 0),
      isMZ
    };
  })();

  // ---- 実行情報の共有領域 ----
  window.__EventIdHUD__ = {
    currentEventId: null, // number | null
    index: null,          // number | null（0始まり）
    len: null,            // number | null
    code: null,           // number | null（現在コマンドの code）
    tick: 0
  };

  // ---- Interpreter フック ----
  const _GI_update = Game_Interpreter.prototype.update;
  Game_Interpreter.prototype.update = function() {
    // 実行中の Interpreter を記録（このフレームに動いた最新が勝つ）
    if (this.isRunning && this.isRunning()) {
      const id = (this.eventId && typeof this.eventId === 'function') ? this.eventId() : (this._eventId || 0);
      let idx = (typeof this._index === 'number') ? this._index : null;
      let list = Array.isArray(this._list) ? this._list : null;
      let len = list ? list.length : null;
      let code = (list && idx != null && list[idx]) ? list[idx].code : null;

      window.__EventIdHUD__.currentEventId = id;
      window.__EventIdHUD__.index = idx;
      window.__EventIdHUD__.len = len;
      window.__EventIdHUD__.code = code;
      window.__EventIdHUD__.tick++;
    }
    _GI_update.apply(this, arguments);
  };

  // ---- HUD スプライト ----
  class Sprite_EventIdHUD extends Sprite {
    constructor() {
      super();
      this._lastTick = -1;
      this._needsRedraw = true;
      // 2行表示に拡張
      this.bitmap = new Bitmap(260, 64);
      this.x = param.x;
      this.y = param.y;
      this.opacity = 255;
      this.refresh();
    }

    update() {
      super.update();
      this.visible = this.shouldBeVisible();

      if (this._lastTick !== window.__EventIdHUD__.tick) {
        this._lastTick = window.__EventIdHUD__.tick;
        this._needsRedraw = true;
      }
      if (this._needsRedraw) {
        this.refresh();
        this._needsRedraw = false;
      }
    }

    shouldBeVisible() {
      if (param.showSwitchId > 0) {
        if (!$gameSwitches || !$gameSwitches.value(param.showSwitchId)) return false;
      }
      if (param.showOnlyOnMap) {
        if (!(SceneManager._scene instanceof Scene_Map)) return false;
      }
      return true;
    }

    refresh() {
      const bmp = this.bitmap;
      bmp.clear();

      // 背景
      bmp.paintOpacity = param.bgOpacity;
      bmp.fillRect(0, 0, bmp.width, bmp.height, '#000000');
      bmp.paintOpacity = 255;

      // 値の整形
      const evId = window.__EventIdHUD__.currentEventId;
      const idText = (evId === null) ? 'EventID: -'
                   : (evId > 0)      ? `EventID: ${evId}`
                                     : 'EventID: -';

      const idx = window.__EventIdHUD__.index;
      const len = window.__EventIdHUD__.len;
      const code = window.__EventIdHUD__.code;

      const lineText =
        (idx == null || len == null) ? 'Line: - / -'
                                     : `Line: ${idx + 1} / ${len}`;
      const cmdText =
        (code == null) ? 'Cmd: -' : `Cmd: ${code}`;

      // テキスト描画（2行）
      bmp.fontSize = param.fontSize;
      bmp.textColor = param.textColor;
      const padding = 8;
      bmp.drawText(idText, padding, 8,  bmp.width - padding * 2, 24, 'left');
      bmp.drawText(`${lineText}   ${cmdText}`, padding, 32, bmp.width - padding * 2, 24, 'left');
    }
  }

  // ---- シーン組み込み ----
  const _SM_createDisplayObjects = Scene_Map.prototype.createDisplayObjects;
  Scene_Map.prototype.createDisplayObjects = function() {
    _SM_createDisplayObjects.apply(this, arguments);
    this._eventIdHud = new Sprite_EventIdHUD();
    this.addChild(this._eventIdHud);
  };

  const _SM_start = Scene_Map.prototype.start;
  Scene_Map.prototype.start = function() {
    _SM_start.apply(this, arguments);
    if (!this._eventIdHud) {
      this._eventIdHud = new Sprite_EventIdHUD();
      this.addChild(this._eventIdHud);
    }
  };

})();
