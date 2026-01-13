/**
 * 特莱恩大陆RPG - 酒馆助手加载器
 * 通过TavernRegex将<TelainUI>标签替换为游戏界面iframe
 */

(async function() {
  const TH = window.TavernHelper;
  if (!TH) {
    console.error('[Telain RPG] TavernHelper not found');
    return;
  }

  // 游戏UI的CDN地址
  const UI_URL = 'https://testingcf.jsdelivr.net/gh/TianyiZhuge/tiqu@master/extensions/telain-rpg/dist/index.html';

  // 注册TavernRegex，将<TelainUI>替换为iframe
  const regex = {
    findRegex: '<TelainUI\\s*/?>',
    replaceString: `<div class="telain-rpg-container" style="width:100%;min-height:500px;"><iframe src="${UI_URL}" style="width:100%;height:600px;border:none;border-radius:8px;" allowfullscreen></iframe></div>`,
    placement: [1], // AI_OUTPUT
    markdownOnly: true,
    promptOnly: false,
    runOnEdit: true,
    substituteRegex: 0,
  };

  try {
    // 使用TavernHelper API注册regex
    await TH.updateTavernRegexesWith((regexes) => {
      // 移除旧的同名regex
      const filtered = regexes.filter(r => r.script_name !== 'TelainRPG-UI');
      // 添加新的regex
      filtered.push({
        id: 'telain-rpg-ui-' + Date.now(),
        script_name: 'TelainRPG-UI',
        enabled: true,
        run_on_edit: true,
        scope: 'global',
        find_regex: regex.findRegex,
        replace_string: regex.replaceString,
        source: {
          user_input: false,
          ai_output: true,
          slash_command: false,
          world_info: false,
        },
        destination: {
          display: true,
          prompt: false,
        },
        min_depth: null,
        max_depth: null,
      });
      return filtered;
    }, { scope: 'global' });

    console.log('[Telain RPG] TavernRegex registered successfully');
  } catch (e) {
    console.error('[Telain RPG] Failed to register TavernRegex:', e);
  }
})();
