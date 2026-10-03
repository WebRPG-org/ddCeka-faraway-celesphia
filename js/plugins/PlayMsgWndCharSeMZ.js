//=============================================================================
// Plugin for RPG Maker MZ
// PlayMsgWndCharSeMZ.js
//=============================================================================
// [Release Note]
// This plugin is the MZ version of PlayMsgWndCharSE.js the RMMV plugin.
// [Update History]
// 2019.Dec.14 Ver1.0.0 First Release
// 2021.Sep.09 Ver1.1.0 Increase the number of available SE from 2 to 5.

/*:ja
 * @target MZ
 * @plugindesc [Ver1.1.0]メッセージウィンドウで文字ごとにSEを演奏します。
 * @author 神無月サスケ
 *
 * @param default SE
 * @text マップでのデフォルトSE番号
 * @desc マップに入るたびにこの値に初期化されます。
 * 0～9のいずれかにしてください。0は無音です。
 * @type number
 * @max 9
 * @min 0
 * @default 1
 *
 * @param battle default SE
 * @text バトルでのデフォルトSE番号
 * @desc バトルに入るたびにこの値に初期化されます。
 * 0～9のいずれかにしてください。0は無音です。
 * @type number
 * @max 9
 * @min 0
 * @default 0
 * 
 * @param interval
 * @text インターバル
 * @desc 何文字スキップして音を鳴らすか(推奨値:2)。
 * 0の場合、全ての文字で音を鳴らします。
 * @type number
 * @max 200
 * @min 0
 * @default 2
 *
 * @param name1
 * @text SE1のファイル名
 * @desc
 * @default Cursor1
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param volume1
 * @parent name1
 * @text SE1のボリューム
 * @desc
 * @type number
 * @min 0
 * @default 90
 *
 * @param pitch1
 * @parent name1
 * @text SE1のピッチ
 * @desc
 * @type number
 * @max 1000000
 * @min 10
 * @default 100
 *
 * @param name2
 * @text SE2のファイル名
 * @desc
 * @default Cursor2
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param volume2
 * @parent name2
 * @text SE2のボリューム
 * @desc デフォルト:90
 * @type number
 * @min 0
 * @default 75
 *
 * @param pitch2
 * @parent name2
 * @text SE2のピッチ
 * @desc デフォルト:100
 * @type number
 * @max 1000000
 * @min 10
 * @default 125
 *
 * @param name3
 * @text SE3のファイル名
 * @desc
 * @default 
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param volume3
 * @parent name3
 * @text SE3のボリューム
 * @desc
 * @type number
 * @min 0
 * @default 90
 *
 * @param pitch3
 * @parent name3
 * @text SE3のピッチ
 * @desc
 * @type number
 * @max 1000000
 * @min 10
 * @default 100
 *
 * @param name4
 * @text SE4のファイル名
 * @desc
 * @default 
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param volume4
 * @parent name4
 * @text SE4のボリューム
 * @desc
 * @type number
 * @min 0
 * @default 90
 *
 * @param pitch4
 * @parent name4
 * @text SE4のピッチ
 * @desc
 * @type number
 * @max 1000000
 * @min 10
 * @default 100
 *
 * @param name5
 * @text SE5のファイル名
 * @desc
 * @default 
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param volume5
 * @parent name5
 * @text SE5のボリューム
 * @desc
 * @type number
 * @min 0
 * @default 90
 *
 * @param pitch5
 * @parent name5
 * @text SE5のピッチ
 * @desc
 * @type number
 * @max 1000000
 * @min 10
 * @default 100
 *
 * @param name6
 * @text SE6のファイル名
 * @desc
 * @default 
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param volume6
 * @parent name6
 * @text SE6のボリューム
 * @desc
 * @type number
 * @min 0
 * @default 90
 *
 * @param pitch6
 * @parent name6
 * @text SE6のピッチ
 * @desc
 * @type number
 * @max 1000000
 * @min 10
 * @default 100
 *
 * @param name7
 * @text SE7のファイル名
 * @desc
 * @default 
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param volume7
 * @parent name7
 * @text SE7のボリューム
 * @desc
 * @type number
 * @min 0
 * @default 90
 *
 * @param pitch7
 * @parent name7
 * @text SE7のピッチ
 * @desc
 * @type number
 * @max 1000000
 * @min 10
 * @default 100
 *
 * @param name8
 * @text SE8のファイル名
 * @desc
 * @default 
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param volume8
 * @parent name8
 * @text SE8のボリューム
 * @desc
 * @type number
 * @min 0
 * @default 90
 *
 * @param pitch8
 * @parent name8
 * @text SE8のピッチ
 * @desc
 * @type number
 * @max 1000000
 * @min 10
 * @default 100
 *
 * @param name9
 * @text SE9のファイル名
 * @desc
 * @default 
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param volume9
 * @parent name9
 * @text SE9のボリューム
 * @desc
 * @type number
 * @min 0
 * @default 90
 *
 * @param pitch9
 * @parent name9
 * @text SE9のピッチ
 * @desc
 * @type number
 * @max 1000000
 * @min 10
 * @default 100
 *
 * @param advanced
 * @text 高度な設定
 * @desc 他のプラグインと競合する場合以外、変更の必要はありません。
 *
 * @param prefix
 * @parent advanced
 * @text SEに代わる文字列
 * @desc \SE[]という書式が別のプラグインと衝突する場合、別の文字列に出来ます。
 * @type string
 * @default SE
 *
 * @help このプラグインには、プラグインコマンドはありません。
 * このプラグインは、RPGツクールMZに対応しています。
 * 
 * このプラグインは、メッセージウィンドウで文字表示の際に、
 * ポポポポ……といった感じでSE(効果音)を鳴らすことを可能にします。
 *
 * 9種類の効果音が指定可能で、ケースに応じて使い分けることが可能です。
 *
 * ■概要
 * メッセージウィンドウで以下の書式で書くことでSEを切り替えられます。
 * \SE[0] : SEを止めます。
 * \SE[1] : SE1を鳴らします。
 * \SE[2] : SE2を鳴らします。
 * 同様に、\SE[3],\SE[4],\SE[5],\SE[6],\SE[7],\SE[8],\SE[9] も記述可能です。
 * この設定は、マップかシーンが切り替わるとデフォルトにリセットされます。
 * ※シーン切り替えには、メニューの開閉も含まれます。
 *
 * 文中で \> が設定された場合、インターバル(interval)の値に関わらず、
 * 強制的に1回だけSEが演奏されます。
 *
 * ■ライセンス表記
 * このプラグインは MIT ライセンスで配布されます。
 * ご自由にお使いください。
 * http://opensource.org/licenses/mit-license.php
 */

(() => {
  const pluginName = 'PlayMsgWndCharSeMZ';
  //
  // process parameters
  //
  let name = [];
  let volume = [];
  let pitch = [];
  const parameters = PluginManager.parameters(pluginName);
  const defaultMode = Number(parameters['default SE'] || 1);
  const battleDefaultMode = Number(parameters['battle default SE'] || 0);
  const interval = Number(parameters['interval'] || 2);

  name[1] = (parameters['name1'] || 'Cursor1');
  volume[1] = Number(parameters['volume1'] || 90);
  pitch[1] = Number(parameters['pitch1'] || 100);

  name[2] = (parameters['name2'] || 'Cursor2');
  volume[2] = Number(parameters['volume2'] || 75);
  pitch[2] = Number(parameters['pitch2'] || 125);

  name[3] = (parameters['name3'] || '');
  volume[3] = Number(parameters['volume3'] || 90);
  pitch[3] = Number(parameters['pitch3'] || 100);

  name[4] = (parameters['name4'] || '');
  volume[4] = Number(parameters['volume4'] || 90);
  pitch[4] = Number(parameters['pitch4'] || 100);

  name[5] = (parameters['name5'] || '');
  volume[5] = Number(parameters['volume5'] || 90);
  pitch[5] = Number(parameters['pitch5'] || 100);

  // --- added: SE6 ～ SE9 ---
  name[6] = (parameters['name6'] || '');
  volume[6] = Number(parameters['volume6'] || 90);
  pitch[6] = Number(parameters['pitch6'] || 100);

  name[7] = (parameters['name7'] || '');
  volume[7] = Number(parameters['volume7'] || 90);
  pitch[7] = Number(parameters['pitch7'] || 100);

  name[8] = (parameters['name8'] || '');
  volume[8] = Number(parameters['volume8'] || 90);
  pitch[8] = Number(parameters['pitch8'] || 100);

  name[9] = (parameters['name9'] || '');
  volume[9] = Number(parameters['volume9'] || 90);
  pitch[9] = Number(parameters['pitch9'] || 100);
  // -------------------------

  const Prefix = (parameters['prefix'] || 'SE');

  //
  // initialize variables
  //
  const _Window_Message_initMembers = Window_Message.prototype.initMembers;
  Window_Message.prototype.initMembers = function() {
    _Window_Message_initMembers.call(this);
    this.charSECount = 0;
    this.charSEmode = defaultMode;
  };

  //
  // set Battle Mode
  //
  const _Scene_Battle_createMessageWindow =
   Scene_Battle.prototype.createMessageWindow;
  Scene_Battle.prototype.createMessageWindow = function() {
    _Scene_Battle_createMessageWindow.call(this);
    this._messageWindow.charSEmode = battleDefaultMode;
  };

  //
  // set the char SE mode
  //  
  const _Window_Message_processEscapeCharacter =
   Window_Message.prototype.processEscapeCharacter;
  Window_Message.prototype.processEscapeCharacter = function(code, textState) {
    switch (code) {
    case Prefix:
      this.charSEmode = this.obtainEscapeParam(textState);
      break;
    case '>':
      // force to play char SE once. 
      this.charSECount = interval + 1;
      // do not break, do also default process.
    default:
      _Window_Message_processEscapeCharacter.call(this, code, textState);
      break;
    }
  };

  //
  // play char SE at message window
  // 
  const _Window_Message_shouldBreakHere =
   Window_Message.prototype.shouldBreakHere;
  Window_Message.prototype.shouldBreakHere = function(textState) {
    const doesBreak = _Window_Message_shouldBreakHere.call(this, textState);
    if (doesBreak) {
      this.processCharSE();
    }
    return doesBreak;
  };

  Window_Message.prototype.processCharSE = function(){
    if(this._showFast) { // triggered (= skipping message)
      return;
    }
    if(!this._lineShowFast) { // unless '\>' mode
      ++this.charSECount;
    }
    if(this.charSECount > interval) {
      this.playCharSE();
      this.charSECount = 0;
    }
  };

  const playCharSE = (name, pitch, volume) => {
    if (name) {
      let audio = {};
      audio.name = name;
      audio.pitch = pitch;
      audio.volume = volume;
      AudioManager.playStaticSe(audio);
    }
  };

  Window_Message.prototype.playCharSE = function(){
    const id = this.charSEmode;
    switch (id) {
    case 0:
      // not play sound
      break;
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6: // added
    case 7: // added
    case 8: // added
    case 9: // added
      playCharSE(name[id], pitch[id], volume[id]);
      break;
    default:
      // not supported yet
      break;
    }
  };

  // 会話終了時にSEモードをリセット
  const _Window_Message_terminateMessage = Window_Message.prototype.terminateMessage;
  Window_Message.prototype.terminateMessage = function() {
    _Window_Message_terminateMessage.call(this);
    this.charSEmode = 0;  // \SE[0]と同等の無音設定にリセット
  };
})();
