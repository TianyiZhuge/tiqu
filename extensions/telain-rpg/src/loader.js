/**
 * 特莱恩大陆RPG - 酒馆助手加载器
 * 此脚本用于在TavernHelper_scripts中自动加载RPG前端
 */

// 配置
const CONFIG = {
  // HTML文件CDN地址
  htmlUrl: 'https://testingcf.jsdelivr.net/gh/TianyiZhuge/tiqu@master/extensions/telain-rpg/dist/index.html',
  // iframe容器ID
  containerId: 'telain-rpg-container',
  // iframe ID
  iframeId: 'telain-rpg-iframe'
};

// 创建并插入iframe
function loadTelainRPG() {
  // 检查是否已加载
  if (document.getElementById(CONFIG.iframeId)) {
    console.log('[Telain RPG] Already loaded');
    return;
  }

  // 获取酒馆助手的iframe容器
  const targetContainer = document.querySelector('#tavern-helper-iframe-container')
    || document.querySelector('.tavern-helper-content')
    || document.body;

  // 创建容器
  const container = document.createElement('div');
  container.id = CONFIG.containerId;
  container.style.cssText = `
    width: 100%;
    height: 100%;
    position: relative;
  `;

  // 创建iframe
  const iframe = document.createElement('iframe');
  iframe.id = CONFIG.iframeId;
  iframe.src = CONFIG.htmlUrl;
  iframe.style.cssText = `
    width: 100%;
    height: 100%;
    border: none;
    background: transparent;
  `;

  // 组装DOM
  container.appendChild(iframe);
  targetContainer.appendChild(container);

  console.log('[Telain RPG] Loaded successfully');
}

// 在DOM准备好后执行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadTelainRPG);
} else {
  loadTelainRPG();
}
