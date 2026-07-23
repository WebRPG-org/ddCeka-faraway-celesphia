/*=============================================================================
 Linandino_Kofi.js
----------------------------------------------------------------------------
 (C) 2026 Linandino
 English Translation & Support Plugin for RPG Maker MZ / Electron
=============================================================================*/

/*:
 * @plugindesc [v1.0] Custom credit & Ko-Fi support splash screen and title menu option for Linandino's translation patch.
 * @target MZ
 * @author Linandino
 * @url https://ko-fi.com/linandino
 *
 * @help Linandino_Kofi.js
 *
 * This plugin adds:
 * 1. A bootup splash screen crediting Linandino with a Ko-Fi link.
 * 2. A title screen menu option to support the translator on Ko-Fi.
 * 3. A new game welcome message in English.
 */

(() => {
    'use strict';

    const KOFI_URL = "https://ko-fi.com/linandino";
    let _bootSplashShown = false;

    // Helper: Universal external URL opener compatible with Electron, NW.js, and Web browsers
    function openExternalUrl(url) {
        if (typeof require !== 'undefined') {
            try {
                const { shell } = require('electron');
                if (shell && shell.openExternal) {
                    shell.openExternal(url);
                    return;
                }
            } catch (e) {}
            try {
                const nwGui = require('nw.gui');
                if (nwGui && nwGui.Shell && nwGui.Shell.openExternal) {
                    nwGui.Shell.openExternal(url);
                    return;
                }
            } catch (e) {}
        }
        if (window.open) {
            window.open(url, '_blank');
        }
    }

    // =========================================================================
    // 1. Scene_LinandinoSplash - Bootup Splash Screen
    // =========================================================================
    class Scene_LinandinoSplash extends Scene_Base {
        create() {
            super.create();
            this.createBackground();
            this.createWindow();
        }

        createBackground() {
            this._bgSprite = new Sprite();
            const bitmap = new Bitmap(Graphics.width, Graphics.height);
            const ctx = bitmap.context;
            const grad = ctx.createLinearGradient(0, 0, 0, Graphics.height);
            grad.addColorStop(0, "#120826");
            grad.addColorStop(0.5, "#1c0d38");
            grad.addColorStop(1, "#0a0418");
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, Graphics.width, Graphics.height);
            this._bgSprite.bitmap = bitmap;
            this.addChild(this._bgSprite);
        }

        createWindow() {
            const rect = new Rectangle(
                (Graphics.width - 760) / 2,
                (Graphics.height - 440) / 2,
                760,
                440
            );
            this._splashWindow = new Window_Base(rect);
            this.addChild(this._splashWindow);
            this.drawSplashContent();
        }

        drawSplashContent() {
            const win = this._splashWindow;
            win.contents.clear();

            const ctx = win.contents.context;
            ctx.strokeStyle = "#ffd700";
            ctx.lineWidth = 2;
            ctx.strokeRect(10, 10, win.contentsWidth() - 20, win.contentsHeight() - 20);

            let y = 35;
            win.contents.fontSize = 26;
            win.changeTextColor("#ffd700"); // Gold
            win.drawText("=== ENGLISH TRANSLATION PATCH ===", 0, y, win.contentsWidth(), "center");

            y += 50;
            win.contents.fontSize = 22;
            win.changeTextColor("#e0b0ff"); // Soft Purple
            win.drawText("Translated by: Linandino", 0, y, win.contentsWidth(), "center");

            y += 55;
            win.contents.fontSize = 17;
            win.changeTextColor("#ffffff"); // White
            win.drawText("If you enjoy playing this patch, please consider supporting", 0, y, win.contentsWidth(), "center");
            
            y += 30;
            win.drawText("future translation projects on Ko-Fi!", 0, y, win.contentsWidth(), "center");

            y += 55;
            win.contents.fontSize = 20;
            win.changeTextColor("#54cbf5"); // Cyan link color
            win.drawText(KOFI_URL, 0, y, win.contentsWidth(), "center");

            y += 85;
            win.contents.fontSize = 16;
            win.changeTextColor("#aaaaaa"); // Gray prompt
            win.drawText("[ Click anywhere or Press Space/Enter/Z to Start ]", 0, y, win.contentsWidth(), "center");
        }

        update() {
            super.update();
            if (this.isTriggered()) {
                if (TouchInput.isTriggered()) {
                    const cx = TouchInput.x;
                    const cy = TouchInput.y;
                    if (cy > Graphics.height / 2 && cy < Graphics.height / 2 + 100) {
                        openExternalUrl(KOFI_URL);
                    }
                }
                SoundManager.playOk();
                SceneManager.goto(Scene_Title);
            }
        }

        isTriggered() {
            return (
                Input.isTriggered("ok") ||
                Input.isTriggered("cancel") ||
                Input.isTriggered("space") ||
                TouchInput.isTriggered()
            );
        }
    }

    window.Scene_LinandinoSplash = Scene_LinandinoSplash;

    const _Scene_Title_start = Scene_Title.prototype.start;
    Scene_Title.prototype.start = function() {
        if (!_bootSplashShown) {
            _bootSplashShown = true;
            SceneManager.goto(Scene_LinandinoSplash);
            return;
        }
        _Scene_Title_start.call(this);
    };

    const _Window_TitleCommand_makeCommandList = Window_TitleCommand.prototype.makeCommandList;
    Window_TitleCommand.prototype.makeCommandList = function() {
        _Window_TitleCommand_makeCommandList.call(this);
        this.addCommand("Support Translator (Ko-Fi)", "kofiSupport");
    };

    const _Scene_Title_createCommandWindow = Scene_Title.prototype.createCommandWindow;
    Scene_Title.prototype.createCommandWindow = function() {
        _Scene_Title_createCommandWindow.call(this);
        this._commandWindow.setHandler("kofiSupport", this.commandKofiSupport.bind(this));
    };

    Scene_Title.prototype.commandKofiSupport = function() {
        openExternalUrl(KOFI_URL);
        this._commandWindow.activate();
    };

    let _shouldShowWelcomeMessage = false;

    const _DataManager_setupNewGame = DataManager.setupNewGame;
    DataManager.setupNewGame = function() {
        _DataManager_setupNewGame.call(this);
        _shouldShowWelcomeMessage = true;
    };

    const _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function() {
        _Scene_Map_start.call(this);
        if (_shouldShowWelcomeMessage) {
            _shouldShowWelcomeMessage = false;
            $gameMessage.add("=== English Translation by Linandino ===");
            $gameMessage.add("Thank you for playing! If you enjoy this patch,");
            $gameMessage.add("please consider supporting future translations:");
            $gameMessage.add(KOFI_URL);
        }
    };

})();
