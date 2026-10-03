/*:
 * @target MZ
 * @plugindesc 複数SEをIDごとにループ再生する簡易プラグイン
 *
 * @command StartLoopSe
 * @text SEループ開始
 *
 * @arg id
 * @text 管理ID
 * @type string
 * @default loop1
 *
 * @arg name
 * @text SE名
 * @type file
 * @dir audio/se
 *
 * @arg volume
 * @text 音量
 * @type number
 * @default 90
 *
 * @arg pitch
 * @text ピッチ
 * @type number
 * @default 100
 *
 * @arg pan
 * @text 位相
 * @type number
 * @default 0
 *
 * @command StopLoopSe
 * @text SEループ停止
 *
 * @arg id
 * @text 管理ID
 * @type string
 * @default loop1
 *
 * @command StopAllLoopSe
 * @text 全SEループ停止
 */

(() => {
  "use strict";

  const pluginName = document.currentScript.src.match(/^.*\/(.+)\.js$/)[1];
  const loops = {};

  function playLoop(id) {
    const state = loops[id];
    if (!state || !state.active) return;

    const token = state.token;
    const se = state.se;

    const buffer = AudioManager.createBuffer("se/", se.name);
    state.buffer = buffer;

    buffer.volume = se.volume / 100;
    buffer.pitch = se.pitch / 100;
    buffer.pan = se.pan / 100;

    buffer.addStopListener(() => {
      const current = loops[id];
      if (current && current.active && current.token === token) {
        playLoop(id);
      }
    });

    buffer.play(false);
  }

  PluginManager.registerCommand(pluginName, "StartLoopSe", args => {
    const id = String(args.id || "loop1");

    if (loops[id]?.buffer) {
      loops[id].active = false;
      loops[id].token++;
      loops[id].buffer.stop();
    }

    loops[id] = {
      active: true,
      token: (loops[id]?.token || 0) + 1,
      buffer: null,
      se: {
        name: String(args.name),
        volume: Number(args.volume || 90),
        pitch: Number(args.pitch || 100),
        pan: Number(args.pan || 0)
      }
    };

    playLoop(id);
  });

  PluginManager.registerCommand(pluginName, "StopLoopSe", args => {
    const id = String(args.id || "loop1");
    const state = loops[id];
    if (!state) return;

    state.active = false;
    state.token++;

    if (state.buffer) {
      state.buffer.stop();
    }

    delete loops[id];
  });

  PluginManager.registerCommand(pluginName, "StopAllLoopSe", () => {
    for (const id of Object.keys(loops)) {
      const state = loops[id];

      state.active = false;
      state.token++;

      if (state.buffer) {
        state.buffer.stop();
      }

      delete loops[id];
    }
  });
})();