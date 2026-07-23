//=============================================================================
// FasterBattle_DynamicMotionSafe.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Battle speedup compatible with DynamicMotion.
 * @author あわやまたな
 *
 * @param fastForwardSpeed
 * @text Fast Forward Speed
 * @type number
 * @min 1
 * @max 8
 * @default 2
 *
 * @help
 * Hold OK key to accelerate battle.
 *
 * Compatible with:
 * - NRP_DynamicMotionMZ
 * - NRP_DynamicAnimationMZ
 *
 * This plugin speeds up the entire battle update loop
 * instead of skipping waits.
 */

(() => {

    "use strict";

    const pluginName = document.currentScript.src.match(/^.*\/(.*).js$/)[1];
    const params = PluginManager.parameters(pluginName);

    const FAST_SPEED = Number(params.fastForwardSpeed || 2);

    //-------------------------------------------------------------------------
    // Fast Forward Check
    //-------------------------------------------------------------------------

    function isBattleFastForward() {
        return (
            SceneManager._scene instanceof Scene_Battle &&
            (
                Input.isPressed("ok") ||
                TouchInput.isLongPressed()
            )
        );
    }

    //-------------------------------------------------------------------------
    // Scene_Battle
    //-------------------------------------------------------------------------

    const _Scene_Battle_update = Scene_Battle.prototype.update;

    Scene_Battle.prototype.update = function() {

        const speed = isBattleFastForward() ? FAST_SPEED : 1;

        for (let i = 0; i < speed; i++) {
            _Scene_Battle_update.call(this);
        }
    };

    //-------------------------------------------------------------------------
    // Window_BattleLog
    // メッセージだけ少し高速化
    //-------------------------------------------------------------------------

    Window_BattleLog.prototype.messageSpeed = function() {
        return isBattleFastForward() ? 2 : 10;
    };

})();