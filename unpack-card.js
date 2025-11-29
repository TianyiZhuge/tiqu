import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

/**
 * 读取 JSON 文件
 */
function readJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`读取 JSON 文件失败: ${filePath}`);
    throw error;
  }
}

/**
 * 写入文件
 */
function writeFile(filePath, content) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, content, 'utf-8');
  } catch (error) {
    console.error(`写入文件失败: ${filePath}`);
    throw error;
  }
}

/**
 * 转换 position 数值为字符串
 */
function convertPositionToString(positionNum) {
  const positionMap = {
    0: 'before_char',
    1: 'after_char',
    5: 'before_em',
    6: 'after_em',
    2: 'before_an',
    3: 'after_an',
    4: 'at_depth'
  };
  return positionMap[positionNum] || 'after_char';
}

/**
 * 安全化文件名（移除不合法字符）
 */
function sanitizeFileName(name) {
  return name.replace(/[<>:"/\\|?*]/g, '_').trim();
}

/**
 * 解包世界书条目
 */
function unpackCharacterBookEntries(entries, outputDir) {
  const entriesConfig = [];

  entries.forEach((entry, index) => {
    const comment = entry.comment || `条目${index}`;
    const fileName = sanitizeFileName(comment);

    // 根据文件名确定扩展名
    let fileExt = '.xyaml';
    if (fileName.includes('变量初始化')) {
      fileExt = '.yaml';
    } else if (fileName.includes('变量更新规则') || fileName.includes('变量处理指令集')) {
      fileExt = '.yaml';
    }

    const fullFileName = `${fileName}${fileExt}`;
    const entryPath = path.join(outputDir, fullFileName);

    // 保存条目内容
    if (entry.content) {
      writeFile(entryPath, entry.content);
    }

    // 构建配置
    const config = {
      comment: entry.comment,
      content: fullFileName,
      enabled: entry.enabled ?? true,
      position: entry.position || convertPositionToString(entry.extensions?.position),
      insertion_order: entry.insertion_order ?? 100,
      depth: entry.extensions?.depth ?? 4,
      role: entry.extensions?.role ?? 0
    };

    entriesConfig.push(config);
  });

  return entriesConfig;
}

/**
 * 提取状态栏脚本
 */
function extractStatusBar(regexScripts) {
  if (!regexScripts) return null;

  const statusBarScript = regexScripts.find(script =>
    script.scriptName === '状态栏' && script.findRegex === '<StatusPlaceHolderImpl/>'
  );

  if (statusBarScript && statusBarScript.replaceString) {
    // 移除开头和结尾的 ```\n 和 \n```
    let content = statusBarScript.replaceString;
    content = content.replace(/^```\n/, '').replace(/\n```$/, '');
    return content;
  }

  return null;
}

/**
 * 提取用户脚本
 */
function extractUserScripts(tavernHelperScripts) {
  if (!tavernHelperScripts) return [];

  const userScripts = [];

  tavernHelperScripts.forEach((scriptWrapper, index) => {
    if (scriptWrapper.type === 'script' && scriptWrapper.value) {
      const script = scriptWrapper.value;

      // 跳过 MVU Zod 脚本
      if (script.name === 'MVU Zod 脚本' || script.id === '1f84fa2d-cd60-4015-be1b-cc801a8092be') {
        return;
      }

      userScripts.push({
        name: script.name,
        content: script.content,
        enabled: script.enabled ?? true
      });
    }
  });

  return userScripts;
}

/**
 * 解包角色卡
 */
function unpackCharacterCard(jsonPath, outputDir) {
  console.log(`正在读取角色卡: ${jsonPath}`);
  const card = readJsonFile(jsonPath);

  const cardName = card.name || 'character';
  const workDir = path.join(outputDir, cardName);

  console.log(`解包到目录: ${workDir}`);

  // 创建输出目录
  if (!fs.existsSync(workDir)) {
    fs.mkdirSync(workDir, { recursive: true });
  }

  const data = card.data || card;

  // 保存基础字段
  if (data.description) {
    writeFile(path.join(workDir, '简介.txt'), data.description);
  }

  if (data.first_mes) {
    writeFile(path.join(workDir, '开场白.md'), data.first_mes);
  }

  // 解包世界书条目
  let entriesConfig = [];
  if (data.character_book?.entries && data.character_book.entries.length > 0) {
    console.log(`解包 ${data.character_book.entries.length} 个世界书条目...`);
    entriesConfig = unpackCharacterBookEntries(data.character_book.entries, workDir);
  }

  // 提取状态栏
  let statusBarPath = null;
  if (data.extensions?.regex_scripts) {
    const statusBarContent = extractStatusBar(data.extensions.regex_scripts);
    if (statusBarContent) {
      const statusBarFile = '状态栏.html';
      writeFile(path.join(workDir, statusBarFile), statusBarContent);
      statusBarPath = statusBarFile;
      console.log('✓ 提取状态栏');
    }
  }

  // 提取用户脚本
  const scriptsConfig = [];
  if (data.extensions?.TavernHelper_scripts) {
    const userScripts = extractUserScripts(data.extensions.TavernHelper_scripts);
    userScripts.forEach((script, index) => {
      const scriptFileName = sanitizeFileName(script.name) + '.js';
      writeFile(path.join(workDir, scriptFileName), script.content);
      scriptsConfig.push({
        name: script.name,
        content: scriptFileName,
        enabled: script.enabled
      });
      console.log(`✓ 提取脚本: ${script.name}`);
    });
  }

  // 生成配置文件 - 使用相对于项目根目录的路径
  const relativeWorkDir = path.relative(process.cwd(), workDir).replace(/\\/g, '/');

  const config = {
    name: cardName,
    creator: data.creator || '',
    character_version: data.character_version || '',
    fields: {
      description: data.description ? `${relativeWorkDir}/简介.txt` : '',
      personality: '',
      scenario: '',
      first_mes: data.first_mes ? `${relativeWorkDir}/开场白.md` : '',
      mes_example: '',
      creator_notes: '',
      system_prompt: '',
      post_history_instructions: ''
    },
    extensions: {
      talkativeness: data.extensions?.talkativeness || '0.5',
      fav: data.extensions?.fav || false,
      world: data.extensions?.world || cardName,
      status_bar: statusBarPath ? `${relativeWorkDir}/${statusBarPath}` : undefined
    },
    character_book: {
      name: data.character_book?.name || cardName,
      entries: entriesConfig.map(entry => ({
        ...entry,
        content: `${relativeWorkDir}/${entry.content}`
      }))
    }
  };

  // 添加脚本配置
  if (scriptsConfig.length > 0) {
    config.scripts = scriptsConfig.map(script => ({
      ...script,
      content: `${relativeWorkDir}/${script.content}`
    }));
  }

  // 清理 undefined 值
  if (!config.extensions.status_bar) {
    delete config.extensions.status_bar;
  }

  const configPath = path.join(workDir, `${cardName}.yaml`);
  writeFile(configPath, yaml.dump(config, { lineWidth: -1, noRefs: true }));

  console.log(`✓ 配置文件已生成: ${configPath}`);
  console.log(`✓ 解包完成!`);

  return workDir;
}

/**
 * 主函数
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('用法: node unpack-card.js <角色卡JSON路径> [输出目录]');
    console.error('示例: node unpack-card.js character.json ./作品');
    process.exit(1);
  }

  const jsonPath = args[0];
  const outputDir = args[1] || './作品';

  try {
    unpackCharacterCard(jsonPath, outputDir);
  } catch (error) {
    console.error('解包失败:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
