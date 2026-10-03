/*:
 * @target MZ
 * @plugindesc イベントにアニメーション付きの明かりを表示します。（MZ対応）
 * @author tomoaky
 *
 * @param range
 * @desc アニメーションの大きさ（±で拡大縮小）
 * @default 0.1
 *
 * @param defaultZ
 * @desc 明かりのZ座標
 * @default 4
 *
 * @param frames
 * @desc アニメーションフレーム数
 * @default 30
 *
 * @help
 * このプラグインはMV用に作られたものですが、MZでも互換動作します。
 *
 * 詳細な使い方は元のドキュメントを参照してください。
 */

// TMAnimeLight_MZ.js
// RPGツクールMZ対応版（MV互換）
// 元: TMPlugin - アニメ付き明かり ver2.0.1

var Imported = Imported || {};
Imported.TMAnimeLight = true;

var TMPlugin = TMPlugin || {};
TMPlugin.AnimeLight = {};
TMPlugin.AnimeLight.Parameters = PluginManager.parameters('TMAnimeLight');
TMPlugin.AnimeLight.Range = +(TMPlugin.AnimeLight.Parameters['range'] || 0.1);
TMPlugin.AnimeLight.DefaultZ = +(TMPlugin.AnimeLight.Parameters['defaultZ'] || 4);
TMPlugin.AnimeLight.Frames = +(TMPlugin.AnimeLight.Parameters['frames'] || 30);

if (!TMPlugin.EventBase) {
  TMPlugin.EventBase = true;
  (function() {
    const _Game_Event_setupPage = Game_Event.prototype.setupPage;
    Game_Event.prototype.setupPage = function() {
      _Game_Event_setupPage.call(this);
      if (this._pageIndex >= 0) this.loadCommentParams();
    };

    Game_Event.prototype.loadCommentParams = function() {
      this._commentParams = {};
      const re = /<([^<>:]+)(:?)([^>]*)>/g;
      const list = this.list();
      for (let i = 0; i < list.length; i++) {
        const command = list[i];
        if (command && (command.code === 108 || command.code === 408)) {
          for (;;) {
            const match = re.exec(command.parameters[0]);
            if (match) {
              this._commentParams[match[1]] = match[2] === ':' ? match[3] : true;
            } else {
              break;
            }
          }
        } else {
          break;
        }
      }
    };

    Game_Event.prototype.loadTagParam = function(paramName) {
      return this._commentParams[paramName] || this.event().meta[paramName];
    };
  })();
}

if (!TMPlugin.InterpreterBase) {
  TMPlugin.InterpreterBase = true;
  (function() {
    Game_Interpreter.prototype.convertEscapeCharactersTM = function(text) {
      text = text.replace(/\\/g, '\x1b');
      text = text.replace(/\x1b\x1b/g, '\\');
      text = text.replace(/\x1bV\[(\d+)\]/gi, (_, p1) => $gameVariables.value(Number(p1)));
      text = text.replace(/\x1bN\[(\d+)\]/gi, (_, p1) => this.actorNameTM(Number(p1)));
      text = text.replace(/\x1bP\[(\d+)\]/gi, (_, p1) => this.partyMemberNameTM(Number(p1)));
      text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
      return text;
    };

    Game_Interpreter.prototype.actorNameTM = function(n) {
      const actor = n >= 1 ? $gameActors.actor(n) : null;
      return actor ? actor.name() : '';
    };

    Game_Interpreter.prototype.partyMemberNameTM = function(n) {
      const actor = n >= 1 ? $gameParty.members()[n - 1] : null;
      return actor ? actor.name() : '';
    };
  })();
}

(function() {
  const _Game_Temp_initialize = Game_Temp.prototype.initialize;
  Game_Temp.prototype.initialize = function() {
    _Game_Temp_initialize.call(this);
    this.createAnimeLightSinTable();
  };

  Game_Temp.prototype.createAnimeLightSinTable = function() {
    this._animeLightSinTable = [];
    for (let i = 0; i < TMPlugin.AnimeLight.Frames; i++) {
      this._animeLightSinTable[i] = Math.sin(Math.PI * i / (TMPlugin.AnimeLight.Frames / 2)) * TMPlugin.AnimeLight.Range + 1;
    }
  };

  Game_Temp.prototype.animeLightSin = function(index) {
    return this._animeLightSinTable[index];
  };

  Game_CharacterBase.prototype.requestAnimeLight = function() {
    this._requestAnimeLight = true;
  };

  Game_CharacterBase.prototype.onChangeAnimeLight = function() {
    this._requestAnimeLight = false;
  };

  Game_CharacterBase.prototype.isAnimeLightRequested = function() {
    return this._requestAnimeLight;
  };

  const _Game_Event_setupPage = Game_Event.prototype.setupPage;
  Game_Event.prototype.setupPage = function() {
    _Game_Event_setupPage.call(this);
    if (this._pageIndex >= 0) {
      const animeLight = this.loadTagParam('animeLight');
      if (animeLight) {
        const arr = animeLight.split(' ');
        this._animeLight = arr[0];
        this._animeLightOpacity = arr[1] || 255;
        this._animeLightShiftX  = arr[2] || 0;
        this._animeLightShiftY  = arr[3] || 0;
        this._animeLightZ       = arr[4] || TMPlugin.AnimeLight.DefaultZ;
        this._animeLightNone    = arr[5] === '1';
      }
    } else {
      this._animeLight = '';
      this._animeLightOpacity = 255;
      this._animeLightShiftX = 0;
      this._animeLightShiftY = 0;
      this._animeLightZ = TMPlugin.AnimeLight.DefaultZ;
      this._animeLightNone = false;
    }
    this.requestAnimeLight();
  };

  const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'animeLight') {
      const arr = args.map(this.convertEscapeCharactersTM, this);
      const character = this.character(+arr[0]);
      if (character) {
        character._animeLight = arr[1];
        character._animeLightOpacity = arr[2] || 255;
        character._animeLightShiftX  = arr[3] || 0;
        character._animeLightShiftY  = arr[4] || 0;
        character._animeLightZ       = arr[5] || TMPlugin.AnimeLight.DefaultZ;
        character._animeLightNone    = arr[6] === '1';
        character.requestAnimeLight();
      }
    }
  };

  const _Sprite_Character_update = Sprite_Character.prototype.update;
  Sprite_Character.prototype.update = function() {
    _Sprite_Character_update.call(this);
    this.updateAnimeLight();
  };

  Sprite_Character.prototype.updateAnimeLight = function() {
    if (this._character.isAnimeLightRequested() || this._animeLight !== this._character._animeLight) {
      this._character.onChangeAnimeLight();
      this._animeLight = this._character._animeLight;
      if (this._animeLight) {
        if (!this._animeLightSprite) {
          this._animeLightSprite = new Sprite_AnimeLight(this);
          this.parent.addChild(this._animeLightSprite);
        }
        this._animeLightSprite.refresh(this._animeLight);
      } else {
        if (this._animeLightSprite) {
          this.parent.removeChild(this._animeLightSprite);
          this._animeLightSprite = null;
        }
      }
    }
  };

  function Sprite_AnimeLight(characterSprite) {
    this.initialize.apply(this, arguments);
  }

  Sprite_AnimeLight.prototype = Object.create(Sprite.prototype);
  Sprite_AnimeLight.prototype.constructor = Sprite_AnimeLight;

  Sprite_AnimeLight.prototype.initialize = function(characterSprite) {
    Sprite.prototype.initialize.call(this);
    this._characterSprite = characterSprite;
    this.anchor.set(0.5, 0.5);
    this.blendMode = 1;
    this._animeCount = 0;
  };

  Sprite_AnimeLight.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.x = this._characterSprite.x + this._shiftX;
    this.y = this._characterSprite.y + this._shiftY;
    if (!this._characterSprite._character._animeLightNone) {
      this._animeCount = (this._animeCount + 1) % TMPlugin.AnimeLight.Frames;
      const n = $gameTemp.animeLightSin(this._animeCount);
      this.scale.set(n, n);
    }
  };

  Sprite_AnimeLight.prototype.refresh = function(fileName) {
    this.bitmap = ImageManager.loadPicture(fileName);
    this.opacity = +this._characterSprite._character._animeLightOpacity;
    this._shiftX = +this._characterSprite._character._animeLightShiftX;
    this._shiftY = +this._characterSprite._character._animeLightShiftY;
    this.x = this._characterSprite.x + this._shiftX;
    this.y = this._characterSprite.y + this._shiftY;
    this.z = +this._characterSprite._character._animeLightZ;
  };
})();
