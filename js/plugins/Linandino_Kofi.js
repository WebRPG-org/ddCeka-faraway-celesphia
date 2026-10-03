//=============================================================================
// Linandino_Kofi.js
//=============================================================================

/*:
 * @target MV MZ
 * @plugindesc Custom Credit & Ko-Fi Support Plugin.
 * @author Linandino
 * @url https://ko-fi.com/linandino
 *
 * @help Linandino_Kofi.js
 *
 * This plugin displays a custom English translation patch credit splash screen
 * on bootup, adds a link to Ko-Fi in the title screen, and shows a welcome
 * message upon starting a new game.
 */

(function() {
    "use strict";

    const kofiUrl = "https://ko-fi.com/linandino";

    function openKofi() {
        if (typeof require !== 'undefined' && require('nw.gui')) {
            require('nw.gui').Shell.openExternal(kofiUrl);
        } else {
            window.open(kofiUrl, "_blank");
        }
    }

    //-----------------------------------------------------------------------------
    // Scene_LinandinoSplash
    //
    // The scene class for the custom translation patch splash screen on bootup.

    function Scene_LinandinoSplash() {
        this.initialize(...arguments);
    }

    Scene_LinandinoSplash.prototype = Object.create(Scene_Base.prototype);
    Scene_LinandinoSplash.prototype.constructor = Scene_LinandinoSplash;

    Scene_LinandinoSplash.prototype.initialize = function() {
        Scene_Base.prototype.initialize.call(this);
    };

    Scene_LinandinoSplash.prototype.create = function() {
        Scene_Base.prototype.create.call(this);
        this.createBackground();
        this.createSplashWindow();
    };

    Scene_LinandinoSplash.prototype.createBackground = function() {
        this._bgSprite = new Sprite();
        this._bgSprite.bitmap = new Bitmap(Graphics.width, Graphics.height);
        this._bgSprite.bitmap.fillAll("#1E112A"); // Dark purple background
        this.addChild(this._bgSprite);
    };

    Scene_LinandinoSplash.prototype.createSplashWindow = function() {
        this._splashSprite = new Sprite();
        this._splashSprite.bitmap = new Bitmap(Graphics.width, Graphics.height);
        this.addChild(this._splashSprite);

        const bitmap = this._splashSprite.bitmap;

        // Draw Gold borders
        bitmap.fillRect(20, 20, Graphics.width - 40, 4, "#D4AF37");
        bitmap.fillRect(20, Graphics.height - 24, Graphics.width - 40, 4, "#D4AF37");
        bitmap.fillRect(20, 20, 4, Graphics.height - 40, "#D4AF37");
        bitmap.fillRect(Graphics.width - 24, 20, 4, Graphics.height - 40, "#D4AF37");

        // Header
        bitmap.textColor = "#D4AF37";
        bitmap.fontSize = 32;
        bitmap.fontFace = "sans-serif";
        bitmap.drawText("=== ENGLISH TRANSLATION PATCH ===", 0, 100, Graphics.width, 40, "center");

        // Subtitle
        bitmap.textColor = "#ffffff";
        bitmap.fontSize = 24;
        bitmap.drawText("Translated by: Linandino", 0, 180, Graphics.width, 30, "center");

        // Description
        bitmap.fontSize = 20;
        bitmap.drawText("If you enjoy playing this patch, please consider", 0, 260, Graphics.width, 30, "center");
        bitmap.drawText("supporting future translation projects on Ko-Fi!", 0, 300, Graphics.width, 30, "center");

        // Link
        bitmap.textColor = "#5dbbf2";
        bitmap.fontSize = 22;
        bitmap.drawText(kofiUrl, 0, 380, Graphics.width, 30, "center");

        // Prompt
        bitmap.textColor = "#888888";
        bitmap.fontSize = 18;
        bitmap.drawText("[ Click anywhere or Press Space/Enter/Z to Start ]", 0, 480, Graphics.width, 30, "center");

        const urlWidth = bitmap.measureTextWidth(kofiUrl);
        this._urlRect = {
            x: (Graphics.width - urlWidth) / 2,
            y: 380,
            width: urlWidth,
            height: 30
        };
    };

    Scene_LinandinoSplash.prototype.update = function() {
        Scene_Base.prototype.update.call(this);

        if (Input.isTriggered("ok") || TouchInput.isTriggered()) {
            if (TouchInput.isTriggered()) {
                const tx = TouchInput.x;
                const ty = TouchInput.y;
                if (tx >= this._urlRect.x && tx <= this._urlRect.x + this._urlRect.width &&
                    ty >= this._urlRect.y && ty <= this._urlRect.y + this._urlRect.height) {
                    openKofi();
                    TouchInput.clear();
                    return;
                }
            }
            this.goToTitle();
        }
    };

    Scene_LinandinoSplash.prototype.goToTitle = function() {
        SoundManager.playOk();
        SceneManager.goto(Scene_Title);
    };

    //-----------------------------------------------------------------------------
    // Boot Interception Hook
    //

    let _Scene_Title_start = Scene_Title.prototype.start;
    let _hasShownSplash = false;

    Scene_Title.prototype.start = function() {
        if (!_hasShownSplash) {
            _hasShownSplash = true;
            SceneManager.goto(Scene_LinandinoSplash);
        } else {
            _Scene_Title_start.call(this);
        }
    };

    //-----------------------------------------------------------------------------
    // Title Menu Commands Hook
    //

    let _Window_TitleCommand_makeCommandList = Window_TitleCommand.prototype.makeCommandList;
    Window_TitleCommand.prototype.makeCommandList = function() {
        _Window_TitleCommand_makeCommandList.call(this);
        this.addCommand("Support Translator (Ko-Fi)", "linandinoKofi");
    };

    let _Scene_Title_createCommandWindow = Scene_Title.prototype.createCommandWindow;
    Scene_Title.prototype.createCommandWindow = function() {
        _Scene_Title_createCommandWindow.call(this);
        this._commandWindow.setHandler("linandinoKofi", this.commandLinandinoKofi.bind(this));
    };

    Scene_Title.prototype.commandLinandinoKofi = function() {
        openKofi();
        this._commandWindow.activate();
    };

    //-----------------------------------------------------------------------------
    // Setup New Game Message Hook
    //

    let _DataManager_setupNewGame = DataManager.setupNewGame;
    DataManager.setupNewGame = function() {
        _DataManager_setupNewGame.call(this);
        $gameMessage.add("=== English Translation by Linandino ===");
        $gameMessage.add("Thank you for playing! If you enjoy this patch,");
        $gameMessage.add("please consider supporting future translations on");
        $gameMessage.add("Ko-Fi: https://ko-fi.com/linandino");
    };

})();
