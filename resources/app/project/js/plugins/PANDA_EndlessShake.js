//=============================================================================
// PANDA_EndlessShake.js
//=============================================================================
// [Update History]
// 2025-07-30 Ver.1.0.0 First Release for MV/MZ.

/*:
 * @target MV MZ
 * @plugindesc allows screen shake to run indefinitely.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20250730203955.html
 * 
 * @help In the event command "Shake Screen", set Duration to the max (999 frames)
 * and uncheck "Wait for Completion" to make the screen shake indefinitely.
 * 
 * To stop the shake, run another "Shake Screen" command
 * with a very short Duration (e.g. 1 frame).
 * 
 * [License]
 * this plugin is released under MIT license.
 * https://opensource.org/licenses/mit-license.php
 * 
 */

/*:ja
 * @target MV MZ
 * @plugindesc 画面のシェイクを永続的にできるようにします。
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20250730203955.html
 * 
 * @help イベントコマンドの「画面のシェイク」で、時間を最大の999フレームに設定し、
 * 「完了までウェイト」のチェックを外すと、画面を永続的にシェイクさせられます。
 * 
 * シェイクを停止する場合は、時間を1フレームなどのごく短い時間に設定した
 * 「画面のシェイク」コマンドを実行してください。
 * 
 * ■ 利用規約
 * このプラグインはMITライセンスで配布されます。
 * ご自由にお使いください。
 * https://opensource.org/licenses/mit-license.php
 * 
 */

/*:ko
 * @target MV MZ
 * @plugindesc 화면 흔들기 효과를 무기한 지속할 수 있도록 합니다.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20250730203955.html
 * 
 * @help 이벤트 명령 "화면 흔들기"에서 지속 시간을 최대값인 999프레임으로 설정하고
 * "완료까지 대기" 체크를 해제하면 화면을 계속 흔들 수 있습니다.
 * 
 * 흔들림을 멈추려면 지속 시간을 1프레임 등 아주 짧게 설정한
 * "화면 흔들기" 명령을 다시 실행하십시오.
 * 
 * [이용 약관]
 * 이 플러그인은 MIT 라이센스로 공개됩니다.
 * https://opensource.org/licenses/mit-license.php
 * 
 */

(() => {
	'use strict';
	
	//--------------------------------------------------
	// Game_Screen.updateShake
	//  [Added Definition]
	//--------------------------------------------------
	const _Game_Screen_updateShake = Game_Screen.prototype.updateShake;
	Game_Screen.prototype.updateShake = function() {
		// if duration is 999, continuous.
		if (this._shakeDuration === 999) {
			this._shakeDuration++;
		}
		_Game_Screen_updateShake.call(this);
	};
	
})();

