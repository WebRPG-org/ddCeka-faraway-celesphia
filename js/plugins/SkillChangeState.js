/*:ja
 * @plugindesc 使用可能なスキルを変更するステート
 * @author DarkPlasma
 *
 * @target MZ
 * @url https://ci-en.net/creator/15997
 * 
 * @param stateAndSkills
 * @text ステートとスキル一覧
 * @desc 指定ステートにかかっている場合、対応するスキルのみ使用可能になります
 * @type struct<StateAndSkills>[]
 * @default []
 * 
 * @help
 * 特定のステートにかかっている場合、対応するスキルのみ使用可能にします。
 */
/*~struct~StateAndSkills:
 * @param state
 * @text ステート
 * @type state
 * @default 0
 * 
 * @param skills
 * @text スキル一覧
 * @type skill[]
 * @default []
 */
(() => {
  'use strict';
  const pluginName = 'SkillChangeState';
  const parameters = PluginManager.parameters(pluginName);
  const stateAndSkills = JSON.parse(parameters.stateAndSkills || '[]').map(e => {
    const stateAndSkill = JSON.parse(e);
    return {
      state: Number(stateAndSkill.state || 0),
      skills: JSON.parse(stateAndSkill.skills || '[]').map(skillId => Number(skillId || 0)),
    };
  });

  function Game_Actor_SkillChangeStateMixIn(gameActor) {
    const _skills = gameActor.skills;
    gameActor.skills = function () {
      const s = stateAndSkills.find(stateAndSkill => this.isStateAffected(stateAndSkill.state));
      if (s) {
        return s.skills.map(id => $dataSkills[id]);
      }
      return _skills.call(this);
    };
  }

  Game_Actor_SkillChangeStateMixIn(Game_Actor.prototype);
})();
