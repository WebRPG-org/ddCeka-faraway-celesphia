/*:
 * @target MZ
 * @plugindesc 行動開始前にタイミングバーを表示し、成功時にダメージ補正や会心化を行います。
 * @author Codex
 *
 * @help TimingBarAttackMZ.js
 *
 * 行動開始前にタイミングバーを表示します。
 * バーの中央付近で決定すると成功、右端まで到達すると失敗です。
 *
 * 対象:
 * - 通常攻撃: パラメータ「通常攻撃で表示」がONなら表示します。
 * - スキル: メモ欄に <TimingBar> がある場合に表示します。
 *
 * タイミングバー終了後に本来の行動を開始するため、
 * DynamicMotion / DynamicAnimation の演出は判定後に再生されます。
 *
 * スキルのメモ欄:
 *   <TimingBar>
 *   <TimingBarSpeed: 8>          # カーソル速度
 *   <TimingBarRange: 48>         # 成功範囲の幅
 *   <TimingBarMultiplier: 1.2>   # 成功時ダメージ倍率
 *   <TimingBarFailMultiplier: 1> # 失敗時ダメージ倍率
 *
 * アクターのメモ欄にも既定値として同じタグを指定できます。
 *   <TimingBarSpeed: 10>
 *   <TimingBarRange: 40>
 *   <TimingBarMultiplier: 1.3>
 *
 * 利用規約:
 * 商用・非商用を問わず利用できます。
 *
 * @param showForAttack
 * @text 通常攻撃で表示
 * @desc ONにすると、通常攻撃の前にタイミングバーを表示します。
 * @type boolean
 * @default true
 *
 * @param showForTaggedSkill
 * @text タグ付きスキルで表示
 * @desc ONにすると、メモ欄に <TimingBar> があるスキルの前にタイミングバーを表示します。
 * @type boolean
 * @default true
 *
 * @param resultMode
 * @text 成功時の効果
 * @desc 成功した時の扱いを選びます。
 * @type select
 * @option ダメージ倍率を適用
 * @value multiplier
 * @option 会心にする
 * @value critical
 * @default multiplier
 *
 * @param gaugeWidth
 * @text バーの幅
 * @desc タイミングバー本体の横幅です。
 * @type number
 * @min 1
 * @default 320
 *
 * @param gaugeHeight
 * @text バーの高さ
 * @desc タイミングバー本体の高さです。
 * @type number
 * @min 1
 * @default 18
 *
 * @param positionX
 * @text 表示位置X補正
 * @desc 画面中央からの横方向のずらし量です。正の値で右へ移動します。
 * @type number
 * @min -10000
 * @max 10000
 * @default 0
 *
 * @param positionY
 * @text 表示位置Y
 * @desc 画面上端からの縦位置です。
 * @type number
 * @min -10000
 * @max 10000
 * @default 260
 *
 * @param speed
 * @text カーソル速度
 * @desc カーソルが右へ進む速さです。大きいほど難しくなります。
 * @type number
 * @decimals 2
 * @min 0.01
 * @default 8
 *
 * @param successRange
 * @text 成功範囲
 * @desc 中央の成功範囲の幅です。大きいほど成功しやすくなります。
 * @type number
 * @min 1
 * @default 48
 *
 * @param successMultiplier
 * @text 成功時ダメージ倍率
 * @desc 成功時にダメージへ掛ける倍率です。「成功時の効果」がダメージ倍率の場合に使用します。
 * @type number
 * @decimals 2
 * @min 0
 * @default 1.2
 *
 * @param failMultiplier
 * @text 失敗時ダメージ倍率
 * @desc 失敗時にダメージへ掛ける倍率です。0にすると失敗時ダメージなしになります。
 * @type number
 * @decimals 2
 * @min 0
 * @default 1
 *
 * @param inputDelay
 * @text 入力受付待ち
 * @desc バー表示後、決定/タッチを受け付けないフレーム数です。直前の決定入力による誤停止を防ぎます。
 * @type number
 * @min 0
 * @default 10
 *
 * @param resultWait
 * @text 結果表示時間
 * @desc 成功/失敗テキストを表示してから行動へ進むまでの待ち時間です。
 * @type number
 * @min 0
 * @default 12
 *
 * @param labelText
 * @text ラベル文字
 * @desc バー上部に表示する文字です。
 * @type string
 * @default TIMING
 *
 * @param successText
 * @text 成功時文字
 * @desc 成功した時に表示する文字です。
 * @type string
 * @default CRITICAL
 *
 * @param failText
 * @text 失敗時文字
 * @desc 失敗した時に表示する文字です。
 * @type string
 * @default HIT
 *
 * @param backgroundColor
 * @text 背景色
 * @desc バー全体の背景色です。CSS形式で指定します。
 * @type string
 * @default rgba(0, 0, 0, 0.70)
 *
 * @param gaugeColor
 * @text バー色
 * @desc 通常部分の色です。CSS形式で指定します。
 * @type string
 * @default rgba(255, 255, 255, 0.35)
 *
 * @param successColor
 * @text 成功範囲色
 * @desc 中央の成功範囲の色です。CSS形式で指定します。
 * @type string
 * @default rgba(255, 48, 48, 0.95)
 *
 * @param cursorColor
 * @text カーソル色
 * @desc 動くカーソルの色です。CSS形式で指定します。
 * @type string
 * @default rgba(255, 255, 255, 1)
 *
 * @param textColor
 * @text 文字色
 * @desc ラベルや結果文字の色です。CSS形式で指定します。
 * @type string
 * @default #ffffff
 *
 * @param successSe
 * @text 成功時SE
 * @desc 成功時に再生するSEです。空欄なら再生しません。
 * @type file
 * @dir audio/se
 * @default
 *
 * @param failSe
 * @text 失敗時SE
 * @desc 失敗時に再生するSEです。空欄なら再生しません。
 * @type file
 * @dir audio/se
 * @default
 *
 * @param actorSettings
 * @text アクター別設定
 * @desc アクターごとの速度・成功範囲・倍率を設定します。メモ欄タグより先に適用されます。
 * @type struct<ActorTimingSetting>[]
 * @default []
 */

/*~struct~ActorTimingSetting:
 * @param actorId
 * @text 対象アクター
 * @desc この設定を適用するアクターです。
 * @type actor
 * @default 1
 *
 * @param speed
 * @text カーソル速度
 * @desc カーソルが右へ進む速さです。大きいほど難しくなります。
 * @type number
 * @decimals 2
 * @min 0.01
 * @default 8
 *
 * @param successRange
 * @text 成功範囲
 * @desc 中央の成功範囲の幅です。大きいほど成功しやすくなります。
 * @type number
 * @min 1
 * @default 48
 *
 * @param successMultiplier
 * @text 成功時ダメージ倍率
 * @desc 成功時にダメージへ掛ける倍率です。
 * @type number
 * @decimals 2
 * @min 0
 * @default 1.2
 *
 * @param failMultiplier
 * @text 失敗時ダメージ倍率
 * @desc 失敗時にダメージへ掛ける倍率です。0にすると失敗時ダメージなしになります。
 * @type number
 * @decimals 2
 * @min 0
 * @default 1
 */

(() => {
    "use strict";

    const PLUGIN_NAME = (() => {
        const currentScript = document.currentScript;
        if (!currentScript) return "TimingBarAttackMZ";
        return currentScript.src.split("/").pop().replace(/\.js$/, "");
    })();

    const rawParameters = PluginManager.parameters(PLUGIN_NAME);
    const JP_TIMING_BAR = "\u30bf\u30a4\u30df\u30f3\u30b0\u30d0\u30fc";
    const JP_SPEED = "\u901f\u5ea6";
    const JP_RANGE = "\u7bc4\u56f2";
    const JP_MULTIPLIER = "\u500d\u7387";
    const JP_FAIL_MULTIPLIER = "\u5931\u6557\u500d\u7387";

    function toBoolean(value, defaultValue) {
        if (value === undefined || value === "") return defaultValue;
        return value === true || String(value).toLowerCase() === "true";
    }

    function toNumber(value, defaultValue) {
        if (value === undefined || value === "") return defaultValue;
        const numberValue = Number(value);
        return Number.isFinite(numberValue) ? numberValue : defaultValue;
    }

    function toString(value, defaultValue) {
        if (value === undefined || value === null || value === "") return defaultValue;
        return String(value);
    }

    function parseStructArray(value) {
        if (!value) return [];
        try {
            return JSON.parse(value).map((entry) => JSON.parse(entry));
        } catch (e) {
            if (typeof $gameTemp !== "undefined" && $gameTemp.isPlaytest()) console.error(e);
            return [];
        }
    }

    const parameters = {
        showForAttack: toBoolean(rawParameters.showForAttack, true),
        showForTaggedSkill: toBoolean(rawParameters.showForTaggedSkill, true),
        resultMode: toString(rawParameters.resultMode, "multiplier"),
        gaugeWidth: toNumber(rawParameters.gaugeWidth, 320),
        gaugeHeight: toNumber(rawParameters.gaugeHeight, 18),
        positionX: toNumber(rawParameters.positionX, 0),
        positionY: toNumber(rawParameters.positionY, 260),
        speed: toNumber(rawParameters.speed, 8),
        successRange: toNumber(rawParameters.successRange, 48),
        successMultiplier: toNumber(rawParameters.successMultiplier, 1.2),
        failMultiplier: toNumber(rawParameters.failMultiplier, 1),
        inputDelay: toNumber(rawParameters.inputDelay, 10),
        resultWait: toNumber(rawParameters.resultWait, 12),
        labelText: toString(rawParameters.labelText, "TIMING"),
        successText: toString(rawParameters.successText, "CRITICAL"),
        failText: toString(rawParameters.failText, "HIT"),
        backgroundColor: toString(rawParameters.backgroundColor, "rgba(0, 0, 0, 0.70)"),
        gaugeColor: toString(rawParameters.gaugeColor, "rgba(255, 255, 255, 0.35)"),
        successColor: toString(rawParameters.successColor, "rgba(255, 48, 48, 0.95)"),
        cursorColor: toString(rawParameters.cursorColor, "rgba(255, 255, 255, 1)"),
        textColor: toString(rawParameters.textColor, "#ffffff"),
        successSe: toString(rawParameters.successSe, ""),
        failSe: toString(rawParameters.failSe, ""),
        actorSettings: parseStructArray(rawParameters.actorSettings)
    };

    const actorSettings = new Map();
    for (const setting of parameters.actorSettings) {
        const actorId = toNumber(setting.actorId, 0);
        if (!actorId) continue;
        actorSettings.set(actorId, {
            speed: toNumber(setting.speed, parameters.speed),
            successRange: toNumber(setting.successRange, parameters.successRange),
            successMultiplier: toNumber(setting.successMultiplier, parameters.successMultiplier),
            failMultiplier: toNumber(setting.failMultiplier, parameters.failMultiplier)
        });
    }

    function metaValue(data, names) {
        if (!data || !data.meta) return undefined;
        for (const name of names) {
            if (Object.prototype.hasOwnProperty.call(data.meta, name)) {
                return data.meta[name];
            }
        }
        return undefined;
    }

    function metaNumber(data, names, defaultValue) {
        const value = metaValue(data, names);
        if (value === undefined || value === true || value === "") return defaultValue;
        return toNumber(value, defaultValue);
    }

    function hasEnabledMeta(data, names) {
        const value = metaValue(data, names);
        if (value === undefined) return false;
        if (value === true || value === "") return true;
        return String(value).toLowerCase() !== "false";
    }

    function playSe(name) {
        if (!name) return;
        AudioManager.playSe({
            name: name,
            volume: 90,
            pitch: 100,
            pan: 0
        });
    }

    const TimingBarAttack = {
        shouldOpen(subject, action) {
            if (!subject || !subject.isActor || !subject.isActor()) return false;
            if (!action || action._timingBarAttackResolved) return false;
            const item = action.item();
            if (!item) return false;

            if (action.isAttack()) {
                return parameters.showForAttack;
            }

            return parameters.showForTaggedSkill && hasEnabledMeta(item, ["TimingBar", JP_TIMING_BAR]);
        },

        makeSettings(subject, action) {
            const item = action.item();
            const actor = subject.isActor() ? subject.actor() : null;
            const actorSetting = actorSettings.get(subject.actorId && subject.actorId());
            const settings = Object.assign({}, parameters);

            if (actorSetting) {
                Object.assign(settings, actorSetting);
            }

            settings.speed = metaNumber(actor, ["TimingBarSpeed", JP_TIMING_BAR + JP_SPEED], settings.speed);
            settings.successRange = metaNumber(actor, ["TimingBarRange", JP_TIMING_BAR + JP_RANGE], settings.successRange);
            settings.successMultiplier = metaNumber(
                actor,
                ["TimingBarMultiplier", "TimingBarRate", JP_TIMING_BAR + JP_MULTIPLIER],
                settings.successMultiplier
            );
            settings.failMultiplier = metaNumber(
                actor,
                ["TimingBarFailMultiplier", "TimingBarFailRate", JP_TIMING_BAR + JP_FAIL_MULTIPLIER],
                settings.failMultiplier
            );

            settings.speed = metaNumber(item, ["TimingBarSpeed", JP_TIMING_BAR + JP_SPEED], settings.speed);
            settings.successRange = metaNumber(item, ["TimingBarRange", JP_TIMING_BAR + JP_RANGE], settings.successRange);
            settings.successMultiplier = metaNumber(
                item,
                ["TimingBarMultiplier", "TimingBarRate", JP_TIMING_BAR + JP_MULTIPLIER],
                settings.successMultiplier
            );
            settings.failMultiplier = metaNumber(
                item,
                ["TimingBarFailMultiplier", "TimingBarFailRate", JP_TIMING_BAR + JP_FAIL_MULTIPLIER],
                settings.failMultiplier
            );

            settings.gaugeWidth = Math.max(1, settings.gaugeWidth);
            settings.gaugeHeight = Math.max(1, settings.gaugeHeight);
            settings.successRange = Math.max(1, Math.min(settings.successRange, settings.gaugeWidth));
            settings.speed = Math.max(0.01, settings.speed);

            return settings;
        },

        applyResult(action, result, settings) {
            action._timingBarAttackResolved = true;
            action._timingBarAttackSuccess = result.success;
            action._timingBarAttackRate = result.success
                ? (settings.resultMode === "critical" ? 1 : settings.successMultiplier)
                : settings.failMultiplier;
            action._timingBarAttackForceCritical = result.success && settings.resultMode === "critical";
        }
    };

    window.TimingBarAttack = TimingBarAttack;

    function Sprite_TimingBarAttack() {
        this.initialize(...arguments);
    }

    Sprite_TimingBarAttack.prototype = Object.create(Sprite.prototype);
    Sprite_TimingBarAttack.prototype.constructor = Sprite_TimingBarAttack;

    Sprite_TimingBarAttack.prototype.initialize = function(settings) {
        Sprite.prototype.initialize.call(this);
        this._settings = settings;
        this._gaugeX = 24;
        this._gaugeY = 32;
        this._markerX = 0;
        this._inputDelay = settings.inputDelay;
        this._resultWait = -1;
        this._success = false;
        this._finished = false;
        this._stopped = false;
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
        this.x = Graphics.boxWidth / 2 + settings.positionX;
        this.y = settings.positionY;
        this.createBitmap();
        this.redraw();
    };

    Sprite_TimingBarAttack.prototype.createBitmap = function() {
        const width = this._settings.gaugeWidth + this._gaugeX * 2;
        const height = this._gaugeY + this._settings.gaugeHeight + 42;
        this.bitmap = new Bitmap(width, height);
    };

    Sprite_TimingBarAttack.prototype.update = function() {
        Sprite.prototype.update.call(this);

        if (this._finished) return;

        if (this._inputDelay > 0) {
            this._inputDelay--;
        }

        if (this._stopped) {
            if (this._resultWait > 0) {
                this._resultWait--;
            } else {
                this._finished = true;
            }
            this.redraw();
            return;
        }

        this.updateMarker();
        this.redraw();
    };

    Sprite_TimingBarAttack.prototype.updateMarker = function() {
        const width = this._settings.gaugeWidth;
        this._markerX += this._settings.speed;

        if (this._markerX >= width) {
            this._markerX = width;
            this.stop(false);
        }
    };

    Sprite_TimingBarAttack.prototype.canAcceptInput = function() {
        return !this._stopped && this._inputDelay <= 0;
    };

    Sprite_TimingBarAttack.prototype.stop = function(success) {
        if (this._stopped) return;
        this._success = success !== undefined ? success : this.isInSuccessRange();
        this._stopped = true;
        this._resultWait = this._settings.resultWait;
        playSe(this._success ? this._settings.successSe : this._settings.failSe);
        this.redraw();
    };

    Sprite_TimingBarAttack.prototype.isInSuccessRange = function() {
        const center = this._settings.gaugeWidth / 2;
        const halfRange = this._settings.successRange / 2;
        return this._markerX >= center - halfRange && this._markerX <= center + halfRange;
    };

    Sprite_TimingBarAttack.prototype.isFinished = function() {
        return this._finished;
    };

    Sprite_TimingBarAttack.prototype.result = function() {
        return {
            success: this._success
        };
    };

    Sprite_TimingBarAttack.prototype.redraw = function() {
        const bitmap = this.bitmap;
        const settings = this._settings;
        const gaugeX = this._gaugeX;
        const gaugeY = this._gaugeY;
        const width = settings.gaugeWidth;
        const height = settings.gaugeHeight;
        const successX = gaugeX + (width - settings.successRange) / 2;

        bitmap.clear();
        bitmap.fillRect(0, 0, bitmap.width, bitmap.height, settings.backgroundColor);

        bitmap.textColor = settings.textColor;
        bitmap.fontSize = 18;
        bitmap.drawText(settings.labelText, gaugeX, 5, width, 24, "center");

        bitmap.fillRect(gaugeX - 2, gaugeY - 2, width + 4, height + 4, "rgba(255, 255, 255, 0.90)");
        bitmap.fillRect(gaugeX, gaugeY, width, height, settings.gaugeColor);
        bitmap.fillRect(successX, gaugeY, settings.successRange, height, settings.successColor);

        const cursorX = Math.round(gaugeX + this._markerX);
        bitmap.fillRect(cursorX - 2, gaugeY - 8, 4, height + 16, settings.cursorColor);

        if (this._stopped) {
            bitmap.fontSize = 22;
            const text = this._success ? settings.successText : settings.failText;
            bitmap.drawText(text, gaugeX, gaugeY + height + 8, width, 28, "center");
        }
    };

    const _Scene_Battle_update = Scene_Battle.prototype.update;
    Scene_Battle.prototype.update = function() {
        _Scene_Battle_update.apply(this, arguments);
        this.updateTimingBarAttack();
    };

    Scene_Battle.prototype.startTimingBarAttack = function(subject, action, settings, callback) {
        this.endTimingBarAttack();
        this._timingBarAttackSprite = new Sprite_TimingBarAttack(settings);
        this._timingBarAttackCallback = callback;
        this.addChild(this._timingBarAttackSprite);
    };

    Scene_Battle.prototype.updateTimingBarAttack = function() {
        const sprite = this._timingBarAttackSprite;
        if (!sprite) return;

        if (sprite.canAcceptInput() && (Input.isTriggered("ok") || TouchInput.isTriggered())) {
            sprite.stop();
        }

        if (sprite.isFinished()) {
            const result = sprite.result();
            const callback = this._timingBarAttackCallback;
            this.endTimingBarAttack();
            if (callback) callback(result);
        }
    };

    Scene_Battle.prototype.endTimingBarAttack = function() {
        if (this._timingBarAttackSprite) {
            this.removeChild(this._timingBarAttackSprite);
            this._timingBarAttackSprite.destroy();
            this._timingBarAttackSprite = null;
        }
        this._timingBarAttackCallback = null;
    };

    const _BattleManager_updatePhase = BattleManager.updatePhase;
    BattleManager.updatePhase = function(timeActive) {
        if (this._phase === "timingBarAttack") return;
        _BattleManager_updatePhase.apply(this, arguments);
    };

    const _BattleManager_processTurn = BattleManager.processTurn;
    BattleManager.processTurn = function() {
        const subject = this._subject;
        const action = subject && subject.currentAction();

        if (!action) {
            _BattleManager_processTurn.apply(this, arguments);
            return;
        }

        action.prepare();
        if (!action.isValid()) {
            subject.removeCurrentAction();
            return;
        }

        if (TimingBarAttack.shouldOpen(subject, action)) {
            const settings = TimingBarAttack.makeSettings(subject, action);
            action._timingBarAttackResolved = true;
            this._phase = "timingBarAttack";

            const scene = SceneManager._scene;
            const finishTimingBar = (result) => {
                TimingBarAttack.applyResult(action, result, settings);
                this._phase = "turn";
                this.startAction();
                subject.removeCurrentAction();
            };

            if (scene && scene.startTimingBarAttack) {
                scene.startTimingBarAttack(subject, action, settings, finishTimingBar);
            } else {
                finishTimingBar({ success: false });
            }
            return;
        }

        this.startAction();
        subject.removeCurrentAction();
    };

    const _Game_Action_itemCri = Game_Action.prototype.itemCri;
    Game_Action.prototype.itemCri = function(target) {
        if (this._timingBarAttackForceCritical) return 1;
        return _Game_Action_itemCri.apply(this, arguments);
    };

    const _Game_Action_makeDamageValue = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function(target, critical) {
        let value = _Game_Action_makeDamageValue.apply(this, arguments);
        if (this._timingBarAttackRate !== undefined && this._timingBarAttackRate !== 1) {
            value = Math.round(value * this._timingBarAttackRate);
        }
        return value;
    };
})();
