//=============================================================================
// Repeat_Skill.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc <repeat_skill:n>でスキルの連続回数を追加し、連続攻撃時のダメージ表示を高速化します。
 * @author 村人C / modified
 *
 * @param RepeatMessageSpeed
 * @text 連続時ログ待ち
 * @type number
 * @min 0
 * @default 2
 *
 * @param RepeatDamageDuration
 * @text 連続時ダメージ表示時間
 * @type number
 * @min 1
 * @default 45
 *
 * @help
 * スキルのメモ欄に <repeat_skill:2> と書くと、2回追加で発動します。
 *
 * DynamicMotion併用時は、スキルメモ側で damageAll = true を使うと、
 * モーション完了を待たずに連続ダメージ処理を進められます。
 */

(() => {
    "use strict";

    const PLUGIN_NAME = "Repeat_Skill";
    const params = PluginManager.parameters(PLUGIN_NAME);

    const repeatMessageSpeed = Number(params.RepeatMessageSpeed || 2);
    const repeatDamageDuration = Number(params.RepeatDamageDuration || 45);

    const _Game_Action_numRepeats = Game_Action.prototype.numRepeats;
    Game_Action.prototype.numRepeats = function() {
        const baseRepeats = _Game_Action_numRepeats.call(this);
        const addRepeats = this.repeatSkillAddCount();
        return Math.floor(baseRepeats + addRepeats);
    };

    Game_Action.prototype.repeatSkillAddCount = function() {
        const item = this.item();
        if (!item || item.meta.repeat_skill == null) {
            return 0;
        }
        const value = Number(item.meta.repeat_skill);
        return Number.isFinite(value) ? Math.max(value, 0) : 0;
    };

    Game_Action.prototype.isRepeatSkillSpeedTarget = function() {
        const item = this.item();
        return !!item && (this.repeatSkillAddCount() > 0 || item.repeats > 1);
    };

    function isRepeatSkillAction() {
        const action = BattleManager._action;
        return action && action.isRepeatSkillSpeedTarget && action.isRepeatSkillSpeedTarget();
    }

    const _Window_BattleLog_messageSpeed = Window_BattleLog.prototype.messageSpeed;
    Window_BattleLog.prototype.messageSpeed = function() {
        if (isRepeatSkillAction()) {
            return repeatMessageSpeed;
        }
        return _Window_BattleLog_messageSpeed.call(this);
    };

    const _Sprite_Damage_initialize = Sprite_Damage.prototype.initialize;
    Sprite_Damage.prototype.initialize = function() {
        _Sprite_Damage_initialize.apply(this, arguments);
        if (isRepeatSkillAction()) {
            this._duration = repeatDamageDuration;
        }
    };
    const repeatDamageScatterX = 80;
		const repeatDamageScatterY = 36;

		function isRepeatSkillTaggedAction() {
		    const action = BattleManager._action;
		    return action && action.repeatSkillAddCount && action.repeatSkillAddCount() > 0;
		}

		const _Sprite_Battler_createDamageSprite = Sprite_Battler.prototype.createDamageSprite;
		Sprite_Battler.prototype.createDamageSprite = function() {
		    if (!isRepeatSkillTaggedAction()) {
		        _Sprite_Battler_createDamageSprite.call(this);
		        return;
		    }
		
		    const sprite = new Sprite_Damage();
		    const randX = Math.floor(Math.random() * (repeatDamageScatterX * 2 + 1)) - repeatDamageScatterX;
		    const randY = Math.floor(Math.random() * (repeatDamageScatterY * 2 + 1)) - repeatDamageScatterY;
		
		    sprite.x = this.x + this.damageOffsetX() + randX;
		    sprite.y = this.y + this.damageOffsetY() + randY;
		    sprite.setup(this._battler);
		    this._damages.push(sprite);
		    this.parent.addChild(sprite);
		};

})();