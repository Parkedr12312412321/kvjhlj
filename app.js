// ==================== STATE ====================
const state = {
  currentView: 'home',
  games: [],
  proxies: [],
  currentProxy: 'ultraviolet',
  tabs: new Map(),
  tabId: 0,
  currentTab: null,
  chatMessages: [],
  settings: {
    siteName: 'Bebe Pro',
    favicon: '🎮',
    defaultProxy: 'ultraviolet',
    searchEngine: 'brave',
    theme: 'dark',
    cacheSize: 'unlimited',
    cookies: 'enabled',
    imageOpt: 'aggressive'
  }
};

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', async () => {
  loadSettings();
  applySettings();
  await loadGames();
  await loadProxies();
  loadChatHistory();
  setupEvents();
  renderCategories();
  createBrowserTab();
  console.log('🎮 Bebe Pro v2.0 loaded');
});

// ==================== GAMES ====================
async function loadGames() {
  try {
    const res = await fetch('/api/games');
    const data = await res.json();
    state.games = data.games || [];
  } catch (e) {
    console.error('Load games failed:', e);
  }
}

async function loadProxies() {
  try {
    const res = await fetch('/api/proxies');
    state.proxies = await res.json();
    renderProxySelect();
  } catch (e) {
    console.error('Load proxies failed:', e);
  }
}

function renderCategories() {
  const categories = [...new Set(state.games.map(g => g.category))];
  const grid = $('#categoryGrid');
  if (!grid) return;

  grid.innerHTML = categories.map(cat => `
    <button class="category-btn" onclick="filterByCategory('${cat}')">${cat.charAt(0).toUpperCase() + cat.slice(1)}</button>
  `).join('');
}

function renderProxySelect() {
  const select = $('#proxySelect');
  if (!select) return;

  select.innerHTML = `<option value="">Select Proxy</option>` + 
    state.proxies.map(p => `<option value="${p.id}">${p.name} ${p.speed}</option>`).join('');
  
  const proxiesGrid = $('#proxiesGrid');
  if (proxiesGrid) {
    proxiesGrid.innerHTML = state.proxies.map(p => `
      <div class="proxy-card ${p.id === state.currentProxy ? 'active' : ''}" onclick="selectProxy('${p.id}')">
        <div class="proxy-name">${p.name}</div>
        <div class="proxy-speed">${p.speed}</div>
        <div class="proxy-desc">${p.desc}</div>
      </div>
    `).join('');
  }
}

function filterByCategory(category) {
  switchView('games');
  const filtered = state.games.filter(g => g.category === category);
  renderGames(filtered);
}

function renderGames(games = state.games) {
  const grid = $('#gamesGrid');
  if (!grid) return;

  grid.innerHTML = games.map(game => `
    <div class="game-card" onclick="playGame('${game.slug}')">
      <div class="game-icon">${game.icon}</div>
      <div class="game-name">${game.name}</div>
      <div class="game-desc">${game.desc}</div>
      <div class="game-category">${game.type}</div>
    </div>
  `).join('');

  $('#gameCount').textContent = `${games.length} games`;
}

function playGame(slug) {
  const game = state.games.find(g => g.slug === slug);
  if (!game) return;
  
  switchView('browser');
  navigateBrowser(`https://www.google.com/search?q=${encodeURIComponent(game.name + ' play online')}`);
}

// ==================== BROWSER ====================
function createBrowserTab() {
  const id = ++state.tabId;
  const tab = {
    id,
    url: 'about:blank',
    title: 'New Tab',
    history: []
  };
  state.tabs.set(id, tab);
  state.currentTab = id;
  renderTabs();
  updateAddressBar();
}

function renderTabs() {
  const list = $('#tabsList');
  if (!list) return;

  list.innerHTML = Array.from(state.tabs.values()).map(tab => `
    <div class="tab ${tab.id === state.currentTab ? 'active' : ''}" onclick="switchTab(${tab.id})">
      <span>${tab.title || 'New Tab'}</span>
      <button class="tab-close" onclick="event.stopPropagation(); closeTab(${tab.id})">✕</button>
    </div>
  `).join('');
}

function switchTab(id) {
  state.currentTab = id;
  const tab = state.tabs.get(id);
  if (tab) {
    $('#browserFrame').src = tab.url || 'about:blank';
    $('#addressBar').value = tab.url;
  }
  renderTabs();
}

function closeTab(id) {
  state.tabs.delete(id);
  if (state.currentTab === id) {
    const remaining = Array.from(state.tabs.keys());
    state.currentTab = remaining.length > 0 ? remaining[0] : null;
    if (!state.currentTab) createBrowserTab();
    else switchTab(state.currentTab);
  }
  renderTabs();
}

function navigateBrowser(urlOrSearch) {
  if (!state.currentTab) createBrowserTab();
  
  const tab = state.tabs.get(state.currentTab);
  if (!tab) return;

  let url = urlOrSearch.trim();
  
  if (!url.includes('://') && !url.startsWith('about:')) {
    const engines = {
      brave: 'https://search.brave.com/search?q=',
      google: 'https://www.google.com/search?q=',
      duckduckgo: 'https://duckduckgo.com/?q=',
      bing: 'https://www.bing.com/search?q='
    };
    url = (engines[state.settings.searchEngine] || engines.brave) + encodeURIComponent(url);
  }

  tab.url = url;
  tab.title = 'Loading...';
  tab.history.push(url);

  $('#browserFrame').src = url;
  $('#addressBar').value = url;
  renderTabs();
}

function browserBack() {
  const tab = state.tabs.get(state.currentTab);
  if (tab && tab.history.length > 1) {
    tab.history.pop();
    tab.url = tab.history[tab.history.length - 1];
    $('#browserFrame').src = tab.url;
    $('#addressBar').value = tab.url;
  }
}

function browserForward() {
  console.log('Forward navigation not implemented');
}

function browserReload() {
  const frame = $('#browserFrame');
  if (frame) frame.src = frame.src;
}

function browserHome() {
  navigateBrowser('about:blank');
}

function updateAddressBar() {
  const tab = state.tabs.get(state.currentTab);
  if (tab) $('#addressBar').value = tab.url;
}

function changeProxy(proxyId) {
  if (proxyId) {
    state.currentProxy = proxyId;
    updateCurrentProxyDisplay();
  }
}

function selectProxy(proxyId) {
  state.currentProxy = proxyId;
  $('#proxySelect').value = proxyId;
  updateCurrentProxyDisplay();
}

function updateCurrentProxyDisplay() {
  const proxy = state.proxies.find(p => p.id === state.currentProxy);
  if (proxy) {
    $('#currentProxyStatus').textContent = `✅ Active: ${proxy.name} ${proxy.speed}`;
  }
  document.querySelectorAll('.proxy-card').forEach(card => {
    card.classList.toggle('active', 
      card.onclick.toString().includes(state.currentProxy));
  });
}

// ==================== CHAT ====================
async function loadChatHistory() {
  try {
    const res = await fetch('/api/chat');
    const data = await res.json();
    state.chatMessages = data.messages || [];
    renderChat();
  } catch (e) {
    console.error('Load chat failed:', e);
  }
}

async function sendChat(e) {
  e.preventDefault();
  
  const user = $('#chatName').value.trim() || 'Guest';
  const msg = $('#chatMsg').value.trim();
  
  if (!msg) return;

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, message: msg })
    });
    
    const data = await res.json();
    state.chatMessages.push(data);
    $('#chatMsg').value = '';
    renderChat();
  } catch (e) {
    console.error('Send chat failed:', e);
  }
}

function renderChat() {
  const container = $('#chatMessages');
  if (!container) return;

  container.innerHTML = state.chatMessages.map(m => `
    <div class="chat-message">
      <div class="chat-user">${escapeHtml(m.user)}</div>
      <div class="chat-text">${escapeHtml(m.message)}</div>
      <div class="chat-time">${new Date(m.timestamp).toLocaleTimeString()}</div>
    </div>
  `).join('');

  container.scrollTop = container.scrollHeight;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ==================== SETTINGS ====================
function loadSettings() {
  const saved = localStorage.getItem('bebe_settings');
  if (saved) {
    state.settings = { ...state.settings, ...JSON.parse(saved) };
  }
}

function saveSettings() {
  localStorage.setItem('bebe_settings', JSON.stringify(state.settings));
}

function applySettings() {
  document.title = state.settings.siteName;
  $('#siteName').textContent = state.settings.siteName;
  $('#heroTitle').textContent = state.settings.siteName;
  $('#siteTitle').textContent = state.settings.siteName;

  const favicon = $('#siteFavicon');
  if (favicon) {
    favicon.href = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='75' font-size='75'>${state.settings.favicon}</text></svg>`;
  }

  // Apply theme
  if (state.settings.theme === 'light') {
    document.documentElement.style.colorScheme = 'light';
  }

  // Populate settings form
  $('#siteName_set').value = state.settings.siteName;
  $('#faviconEmoji').value = state.settings.favicon;
  $('#defaultProxy').value = state.settings.defaultProxy;
  $('#searchEngine').value = state.settings.searchEngine;
  $('#theme').value = state.settings.theme;
  $('#cacheSize').value = state.settings.cacheSize;
  $('#cookies').value = state.settings.cookies;
  $('#imageOpt').value = state.settings.imageOpt;
}

function setupEvents() {
  // Settings changes
  $('#siteName_set')?.addEventListener('change', (e) => {
    state.settings.siteName = e.target.value;
    saveSettings();
    applySettings();
  });

  $('#faviconEmoji')?.addEventListener('change', (e) => {
    state.settings.favicon = e.target.value || '🎮';
    saveSettings();
    applySettings();
  });

  $('#defaultProxy')?.addEventListener('change', (e) => {
    state.settings.defaultProxy = e.target.value;
    state.currentProxy = e.target.value;
    saveSettings();
  });

  $('#searchEngine')?.addEventListener('change', (e) => {
    state.settings.searchEngine = e.target.value;
    saveSettings();
  });

  $('#theme')?.addEventListener('change', (e) => {
    state.settings.theme = e.target.value;
    saveSettings();
    applySettings();
  });

  $('#cacheSize')?.addEventListener('change', (e) => {
    state.settings.cacheSize = e.target.value;
    saveSettings();
  });

  $('#cookies')?.addEventListener('change', (e) => {
    state.settings.cookies = e.target.value;
    saveSettings();
  });

  $('#imageOpt')?.addEventListener('change', (e) => {
    state.settings.imageOpt = e.target.value;
    saveSettings();
  });

  // Game filters
  $('#gameSearch')?.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    const filtered = state.games.filter(g => 
      g.name.toLowerCase().includes(q) ||
      g.desc.toLowerCase().includes(q)
    );
    renderGames(filtered);
  });

  $('#categoryFilter')?.addEventListener('change', (e) => {
    const cat = e.target.value;
    const filtered = cat ? 
      state.games.filter(g => g.category === cat) : 
      state.games;
    renderGames(filtered);
  });

  $('#typeFilter')?.addEventListener('change', (e) => {
    const type = e.target.value;
    const filtered = type ?
      state.games.filter(g => g.type === type) :
      state.games;
    renderGames(filtered);
  });

  // Load category filters
  const catSelect = $('#categoryFilter');
  if (catSelect) {
    const cats = [...new Set(state.games.map(g => g.category))];
    cats.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat;
      option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
      catSelect.appendChild(option);
    });
  }

  const typeSelect = $('#typeFilter');
  if (typeSelect) {
    const types = [...new Set(state.games.map(g => g.type))];
    types.forEach(type => {
      const option = document.createElement('option');
      option.value = type;
      option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
      typeSelect.appendChild(option);
    });
  }

  // Global search
  $('#globalSearch')?.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    const filtered = state.games.filter(g =>
      g.name.toLowerCase().includes(q) ||
      g.desc.toLowerCase().includes(q)
    );
    if (filtered.length > 0) {
      switchView('games');
      renderGames(filtered);
    }
  });

  // Sidebar menu
  $('#menuBtn')?.addEventListener('click', () => {
    const sidebar = $('.sidebar');
    if (sidebar) sidebar.classList.toggle('open');
  });
}

// ==================== VIEW SWITCHING ====================
function switchView(view) {
  // Update active view
  $$('.view').forEach(v => v.classList.remove('active'));
  $(`#view-${view}`)?.classList.add('active');

  // Update active nav
  $$('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === view);
  });

  // Update breadcrumb
  $('#viewTitle').textContent = view;
  state.currentView = view;

  // Close sidebar on mobile
  const sidebar = $('.sidebar');
  if (sidebar && window.innerWidth <= 768) {
    sidebar.classList.remove('open');
  }

  // Render view-specific content
  if (view === 'games') {
    renderGames();
  } else if (view === 'chat') {
    renderChat();
    setTimeout(() => $('#chatMessages')?.scrollTo(0, Infinity), 0);
  } else if (view === 'proxies') {
    updateCurrentProxyDisplay();
  }
}

function toggleSearch() {
  $('#globalSearch')?.focus();
}

// ==================== UTILITIES ====================
function clearCache() {
  if (confirm('Clear all cache?')) {
    localStorage.clear();
    alert('Cache cleared');
  }
}

function clearCookies() {
  if (confirm('Clear all cookies?')) {
    document.cookie.split(";").forEach(c => {
      document.cookie = c.split("=")[0] + "=;max-age=0";
    });
    alert('Cookies cleared');
  }
}

function resetSettings() {
  if (confirm('Reset all settings to default?')) {
    localStorage.removeItem('bebe_settings');
    state.settings = {
      siteName: 'Bebe Pro',
      favicon: '🎮',
      defaultProxy: 'ultraviolet',
      searchEngine: 'brave',
      theme: 'dark',
      cacheSize: 'unlimited',
      cookies: 'enabled',
      imageOpt: 'aggressive'
    };
    applySettings();
    location.reload();
  }
}

// Global functions
window.switchView = switchView;
window.playGame = playGame;
window.createBrowserTab = createBrowserTab;
window.switchTab = switchTab;
window.closeTab = closeTab;
window.navigateBrowser = navigateBrowser;
window.browserBack = browserBack;
window.browserForward = browserForward;
window.browserReload = browserReload;
window.browserHome = browserHome;
window.changeProxy = changeProxy;
window.selectProxy = selectProxy;
window.sendChat = sendChat;
window.filterByCategory = filterByCategory;
window.toggleSearch = toggleSearch;
window.clearCache = clearCache;
window.clearCookies = clearCookies;
window.resetSettings = resetSettings;
