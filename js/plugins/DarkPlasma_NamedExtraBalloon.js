/*:ja
 * @plugindesc フキダシアイコンを名前選択して表示する
 * @author DarkPlasma
 *
 * @target MZ
 *
 * @command showBalloon
 * @text フキダシ表示
 * @desc フキダシ名を選択して表示します。
 * @arg id
 * @type select
 * @option びっくり
 * @value 1
 * @option はてな
 * @value 2
 * @option 音符
 * @value 3
 * @option ハート
 * @value 4
 * @option 怒り
 * @value 5
 * @option 汗
 * @value 6
 * @option くしゃくしゃ
 * @value 7
 * @option 沈黙
 * @value 8
 * @option 電球
 * @value 9
 * @option Zzz
 * @value 10
 * @option 照れる
 * @value 11
 * @option ガーン
 * @value 12
 * @option キラキラ
 * @value 13
 * @option ハナハナ
 * @value 14
 * @option ブルブル
 * @value 15
 * @option キャッキャ
 * @value 16
 * @option ルンルン
 * @value 17
 * @option ワイワイ左
 * @value 18
 * @option ワイワイ右
 * @value 19
 * @option 汗右
 * @value 20
 * @option 汗左
 * @value 21
 * @arg targetType
 * @text 対象キャラクター
 * @desc フキダシ表示対象を選択します。
 * @type select
 * @option プレイヤー
 * @value player
 * @option このイベント
 * @value thisEvent
 * @option その他イベント
 * @value otherEvent
 * @default player
 * @arg targetEventId
 * @text 対象イベントID
 * @desc キャラクターにその他イベントを選択した場合、イベントIDを指定します。
 * @type number
 * @default 1
 * @arg wait
 * @text 完了までウェイト
 * @desc ONの場合、フキダシ表示完了までウェイトします。
 * @type boolean
 * @default false
 * 
 * @base DarkPlasma_ExtraBalloon
 * 
 * @help
 * 本プラグインは DarkPlasma_ExtraBalloon.js によって生成されました。
 * DarkPlasma_ExtraBalloon.js で定義されたフキダシを
 * 名前を選択して表示するプラグインコマンドを提供します。
 */