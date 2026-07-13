/**
 * theme-editor.js - 主题编辑器模块
 * 提供完整的主题配色自定义编辑、快捷换肤、主题方案保存/切换功能
 */

(function() {
    'use strict';

    // ========== 默认主题变量 ==========
    const DEFAULT_THEME_VARS = {
        '--accent-color': '#c5a47e',
        '--accent-color-rgb': '197,164,126',
        '--primary-bg': '#faf8f5',
        '--secondary-bg': '#ffffff',
        '--chat-bg': '#f5f0eb',
        '--text-primary': '#2c2c2c',
        '--text-secondary': '#8a8a8a',
        '--border-color': 'rgba(0,0,0,0.08)',
        '--message-sent-bg': '#c5a47e',
        '--message-sent-text': '#ffffff',
        '--message-received-bg': '#f0ebe5',
        '--message-received-text': '#2c2c2c',
        '--welcome-bg': '#1a1a2e',
        '--welcome-text': '#e8e0d5',
        '--welcome-text-sub': '#a09080',
    };

    // 预设主题配色
    const PRESET_THEMES = {
        'gold': {
            '--accent-color': '#c5a47e',
            '--accent-color-rgb': '197,164,126',
            '--primary-bg': '#faf8f5',
            '--secondary-bg': '#ffffff',
            '--chat-bg': '#f5f0eb',
            '--text-primary': '#2c2c2c',
            '--text-secondary': '#8a8a8a',
            '--border-color': 'rgba(0,0,0,0.08)',
            '--message-sent-bg': '#c5a47e',
            '--message-sent-text': '#ffffff',
            '--message-received-bg': '#f0ebe5',
            '--message-received-text': '#2c2c2c',
            '--welcome-bg': '#1a1a2e',
            '--welcome-text': '#e8e0d5',
            '--welcome-text-sub': '#a09080',
        },
        'blue': {
            '--accent-color': '#6b8cae',
            '--accent-color-rgb': '107,140,174',
            '--primary-bg': '#f5f7fa',
            '--secondary-bg': '#ffffff',
            '--chat-bg': '#eef2f7',
            '--text-primary': '#2c2c2c',
            '--text-secondary': '#7a8a9a',
            '--border-color': 'rgba(0,0,0,0.08)',
            '--message-sent-bg': '#6b8cae',
            '--message-sent-text': '#ffffff',
            '--message-received-bg': '#e8eef5',
            '--message-received-text': '#2c2c2c',
            '--welcome-bg': '#1a1a2e',
            '--welcome-text': '#e8e0d5',
            '--welcome-text-sub': '#a09080',
        },
        'purple': {
            '--accent-color': '#9b7cb6',
            '--accent-color-rgb': '155,124,182',
            '--primary-bg': '#f8f5fa',
            '--secondary-bg': '#ffffff',
            '--chat-bg': '#f2eef5',
            '--text-primary': '#2c2c2c',
            '--text-secondary': '#8a7a9a',
            '--border-color': 'rgba(0,0,0,0.08)',
            '--message-sent-bg': '#9b7cb6',
            '--message-sent-text': '#ffffff',
            '--message-received-bg': '#ede8f2',
            '--message-received-text': '#2c2c2c',
            '--welcome-bg': '#1a1a2e',
            '--welcome-text': '#e8e0d5',
            '--welcome-text-sub': '#a09080',
        },
        'green': {
            '--accent-color': '#7cb69b',
            '--accent-color-rgb': '124,182,155',
            '--primary-bg': '#f5faf8',
            '--secondary-bg': '#ffffff',
            '--chat-bg': '#eef5f2',
            '--text-primary': '#2c2c2c',
            '--text-secondary': '#7a9a8a',
            '--border-color': 'rgba(0,0,0,0.08)',
            '--message-sent-bg': '#7cb69b',
            '--message-sent-text': '#ffffff',
            '--message-received-bg': '#e8f2ee',
            '--message-received-text': '#2c2c2c',
            '--welcome-bg': '#1a1a2e',
            '--welcome-text': '#e8e0d5',
            '--welcome-text-sub': '#a09080',
        },
        'pink': {
            '--accent-color': '#d4a5a5',
            '--accent-color-rgb': '212,165,165',
            '--primary-bg': '#faf5f5',
            '--secondary-bg': '#ffffff',
            '--chat-bg': '#f5eeee',
            '--text-primary': '#2c2c2c',
            '--text-secondary': '#9a8a8a',
            '--border-color': 'rgba(0,0,0,0.08)',
            '--message-sent-bg': '#d4a5a5',
            '--message-sent-text': '#ffffff',
            '--message-received-bg': '#f2e8e8',
            '--message-received-text': '#2c2c2c',
            '--welcome-bg': '#1a1a2e',
            '--welcome-text': '#e8e0d5',
            '--welcome-text-sub': '#a09080',
        },
        'black-white': {
            '--accent-color': '#333333',
            '--accent-color-rgb': '51,51,51',
            '--primary-bg': '#ffffff',
            '--secondary-bg': '#f5f5f5',
            '--chat-bg': '#f0f0f0',
            '--text-primary': '#1a1a1a',
            '--text-secondary': '#666666',
            '--border-color': 'rgba(0,0,0,0.1)',
            '--message-sent-bg': '#333333',
            '--message-sent-text': '#ffffff',
            '--message-received-bg': '#e8e8e8',
            '--message-received-text': '#1a1a1a',
            '--welcome-bg': '#0a0a0a',
            '--welcome-text': '#e0e0e0',
            '--welcome-text-sub': '#808080',
        },
        'pastel': {
            '--accent-color': '#e8a0a0',
            '--accent-color-rgb': '232,160,160',
            '--primary-bg': '#fdf8f8',
            '--secondary-bg': '#ffffff',
            '--chat-bg': '#f9f0f0',
            '--text-primary': '#3c3c3c',
            '--text-secondary': '#9a8a8a',
            '--border-color': 'rgba(0,0,0,0.06)',
            '--message-sent-bg': '#e8a0a0',
            '--message-sent-text': '#ffffff',
            '--message-received-bg': '#f5e8e8',
            '--message-received-text': '#3c3c3c',
            '--welcome-bg': '#2a1a1a',
            '--welcome-text': '#f0e0e0',
            '--welcome-text-sub': '#b0a0a0',
        },
        'sunset': {
            '--accent-color': '#d4a574',
            '--accent-color-rgb': '212,165,116',
            '--primary-bg': '#faf6f0',
            '--secondary-bg': '#ffffff',
            '--chat-bg': '#f5efe8',
            '--text-primary': '#2c2c2c',
            '--text-secondary': '#9a8a7a',
            '--border-color': 'rgba(0,0,0,0.08)',
            '--message-sent-bg': '#d4a574',
            '--message-sent-text': '#ffffff',
            '--message-received-bg': '#f2ebe3',
            '--message-received-text': '#2c2c2c',
            '--welcome-bg': '#2a1a0a',
            '--welcome-text': '#f0e8d8',
            '--welcome-text-sub': '#b0a080',
        },
        'forest': {
            '--accent-color': '#5a8a6a',
            '--accent-color-rgb': '90,138,106',
            '--primary-bg': '#f5f8f6',
            '--secondary-bg': '#ffffff',
            '--chat-bg': '#eef2ef',
            '--text-primary': '#2c2c2c',
            '--text-secondary': '#6a8a7a',
            '--border-color': 'rgba(0,0,0,0.08)',
            '--message-sent-bg': '#5a8a6a',
            '--message-sent-text': '#ffffff',
            '--message-received-bg': '#e5eee8',
            '--message-received-text': '#2c2c2c',
            '--welcome-bg': '#0a1a0e',
            '--welcome-text': '#d8e8dc',
            '--welcome-text-sub': '#80a088',
        },
        'ocean': {
            '--accent-color': '#4a7a9a',
            '--accent-color-rgb': '74,122,154',
            '--primary-bg': '#f5f7f9',
            '--secondary-bg': '#ffffff',
            '--chat-bg': '#eef2f5',
            '--text-primary': '#2c2c2c',
            '--text-secondary': '#6a8aaa',
            '--border-color': 'rgba(0,0,0,0.08)',
            '--message-sent-bg': '#4a7a9a',
            '--message-sent-text': '#ffffff',
            '--message-received-bg': '#e5eef2',
            '--message-received-text': '#2c2c2c',
            '--welcome-bg': '#0a1420',
            '--welcome-text': '#d8e4f0',
            '--welcome-text-sub': '#80a0b8',
        },
    };

    // 编辑器变量定义
    const EDITOR_VARS = [
        { key: '--accent-color', label: '强调色', type: 'color' },
        { key: '--primary-bg', label: '主背景', type: 'color' },
        { key: '--secondary-bg', label: '次背景', type: 'color' },
        { key: '--chat-bg', label: '聊天背景', type: 'color' },
        { key: '--text-primary', label: '主文字', type: 'color' },
        { key: '--text-secondary', label: '次文字', type: 'color' },
        { key: '--border-color', label: '边框色', type: 'color' },
        { key: '--message-sent-bg', label: '发送气泡', type: 'color' },
        { key: '--message-sent-text', label: '发送文字', type: 'color' },
        { key: '--message-received-bg', label: '接收气泡', type: 'color' },
        { key: '--message-received-text', label: '接收文字', type: 'color' },
        { key: '--welcome-bg', label: '欢迎背景', type: 'color' },
        { key: '--welcome-text', label: '欢迎文字', type: 'color' },
        { key: '--welcome-text-sub', label: '欢迎副文字', type: 'color' },
    ];

    // ========== 状态管理 ==========
    let currentThemeVars = { ...DEFAULT_THEME_VARS };
    let savedSchemes = [];
    let currentSchemeId = null;

    // ========== 工具函数 ==========
    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}` : null;
    }

    function getComputedVar(varName) {
        return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    }

    function setCssVar(varName, value) {
        document.documentElement.style.setProperty(varName, value);
        currentThemeVars[varName] = value;
        if (varName === '--accent-color') {
            const rgb = hexToRgb(value);
            if (rgb) {
                document.documentElement.style.setProperty('--accent-color-rgb', rgb);
                currentThemeVars['--accent-color-rgb'] = rgb;
            }
        }
    }

    function applyThemeVars(vars) {
        Object.entries(vars).forEach(([key, value]) => {
            document.documentElement.style.setProperty(key, value);
        });
        currentThemeVars = { ...vars };
    }

    // ========== 预设主题应用 ==========
    function applyPresetTheme(themeName) {
        const theme = PRESET_THEMES[themeName];
        if (!theme) return;
        applyThemeVars(theme);
        saveCurrentTheme();
        updateEditorInputs();
        updatePresetButtons(themeName);
        if (typeof showNotification === 'function') {
            showNotification(`已切换到「${getThemeLabel(themeName)}」主题 ✦`, 'success');
        }
    }

    function getThemeLabel(themeName) {
        const labels = {
            'gold': '金色', 'blue': '蓝色', 'purple': '紫色', 'green': '绿色',
            'pink': '粉色', 'black-white': '黑白', 'pastel': '红色', 'sunset': '橙色',
            'forest': '深绿', 'ocean': '深蓝'
        };
        return labels[themeName] || themeName;
    }

    function updatePresetButtons(activeTheme) {
        document.querySelectorAll('.theme-color-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === activeTheme);
        });
    }

    // ========== 编辑器功能 ==========
    function initThemeEditor() {
        const grid = document.getElementById('theme-editor-grid');
        if (!grid) return;

        grid.innerHTML = EDITOR_VARS.map(v => `
            <div class="theme-editor-item" data-var="${v.key}">
                <label class="theme-editor-label">${v.label}</label>
                <div class="theme-editor-input-wrap">
                    <input type="color" class="theme-editor-color-input" data-var="${v.key}" value="${currentThemeVars[v.key] || '#000000'}">
                    <input type="text" class="theme-editor-text-input" data-var="${v.key}" value="${currentThemeVars[v.key] || ''}" placeholder="CSS值">
                </div>
            </div>
        `).join('');

        // 绑定颜色输入事件
        grid.querySelectorAll('.theme-editor-color-input').forEach(input => {
            input.addEventListener('input', function() {
                const varName = this.dataset.var;
                const value = this.value;
                setCssVar(varName, value);
                const textInput = grid.querySelector(`.theme-editor-text-input[data-var="${varName}"]`);
                if (textInput) textInput.value = value;
                if (typeof throttledSaveData === 'function') throttledSaveData();
            });
        });

        // 绑定文本输入事件
        grid.querySelectorAll('.theme-editor-text-input').forEach(input => {
            input.addEventListener('change', function() {
                const varName = this.dataset.var;
                const value = this.value;
                setCssVar(varName, value);
                const colorInput = grid.querySelector(`.theme-editor-color-input[data-var="${varName}"]`);
                if (colorInput && value.startsWith('#')) colorInput.value = value;
                if (typeof throttledSaveData === 'function') throttledSaveData();
            });
        });
    }

    function updateEditorInputs() {
        const grid = document.getElementById('theme-editor-grid');
        if (!grid) return;
        grid.querySelectorAll('.theme-editor-color-input').forEach(input => {
            const varName = input.dataset.var;
            const val = currentThemeVars[varName];
            if (val && val.startsWith('#')) input.value = val;
        });
        grid.querySelectorAll('.theme-editor-text-input').forEach(input => {
            const varName = input.dataset.var;
            input.value = currentThemeVars[varName] || '';
        });
    }

    // ========== 主题方案管理 ==========
    function loadSavedSchemes() {
        try {
            const saved = localStorage.getItem('themeSchemes');
            if (saved) savedSchemes = JSON.parse(saved);
        } catch (e) { savedSchemes = []; }
        renderSchemesList();
    }

    function saveSchemes() {
        localStorage.setItem('themeSchemes', JSON.stringify(savedSchemes));
    }

    function saveCurrentAsScheme() {
        const name = prompt('为当前主题方案命名：');
        if (!name || !name.trim()) return;

        const scheme = {
            id: Date.now().toString(),
            name: name.trim(),
            vars: { ...currentThemeVars },
            timestamp: Date.now()
        };

        savedSchemes.push(scheme);
        saveSchemes();
        renderSchemesList();

        if (typeof showNotification === 'function') {
            showNotification(`主题方案「${name}」已保存 ✦`, 'success');
        }
    }

    function overwriteCurrentScheme() {
        if (!currentSchemeId) {
            saveCurrentAsScheme();
            return;
        }
        const scheme = savedSchemes.find(s => s.id === currentSchemeId);
        if (scheme) {
            scheme.vars = { ...currentThemeVars };
            scheme.timestamp = Date.now();
            saveSchemes();
            renderSchemesList();
            if (typeof showNotification === 'function') {
                showNotification(`已覆盖保存「${scheme.name}」✦`, 'success');
            }
        }
    }

    function renameScheme(id) {
        const scheme = savedSchemes.find(s => s.id === id);
        if (!scheme) return;
        const newName = prompt('重命名方案：', scheme.name);
        if (newName && newName.trim()) {
            scheme.name = newName.trim();
            saveSchemes();
            renderSchemesList();
        }
    }

    function deleteScheme(id) {
        if (!confirm('确定要删除这个主题方案吗？')) return;
        savedSchemes = savedSchemes.filter(s => s.id !== id);
        if (currentSchemeId === id) currentSchemeId = null;
        saveSchemes();
        renderSchemesList();
    }

    function applyScheme(id) {
        const scheme = savedSchemes.find(s => s.id === id);
        if (!scheme) return;
        applyThemeVars(scheme.vars);
        currentSchemeId = id;
        saveCurrentTheme();
        updateEditorInputs();
        renderSchemesList();
        if (typeof showNotification === 'function') {
            showNotification(`已应用主题方案「${scheme.name}」✦`, 'success');
        }
    }

    function renderSchemesList() {
        const container = document.getElementById('theme-schemes-list');
        const empty = document.getElementById('theme-schemes-empty');
        if (!container) return;

        if (savedSchemes.length === 0) {
            container.innerHTML = '';
            if (empty) empty.style.display = 'flex';
            return;
        }
        if (empty) empty.style.display = 'none';

        container.innerHTML = savedSchemes.map(scheme => {
            const isActive = scheme.id === currentSchemeId;
            const accentColor = scheme.vars['--accent-color'] || '#c5a47e';
            const primaryBg = scheme.vars['--primary-bg'] || '#faf8f5';
            const textPrimary = scheme.vars['--text-primary'] || '#2c2c2c';

            return `
                <div class="theme-scheme-card ${isActive ? 'active' : ''}" data-id="${scheme.id}" onclick="window.applyThemeScheme('${scheme.id}')">
                    <div class="theme-scheme-preview" style="background:${primaryBg};border-color:${accentColor}40;">
                        <div class="theme-scheme-dot" style="background:${accentColor};"></div>
                        <div class="theme-scheme-bar" style="background:${scheme.vars['--message-sent-bg'] || accentColor};"></div>
                        <div class="theme-scheme-bar2" style="background:${scheme.vars['--message-received-bg'] || '#f0ebe5'};"></div>
                    </div>
                    <div class="theme-scheme-info">
                        <div class="theme-scheme-name" style="color:${textPrimary};">${escapeHtml(scheme.name)}</div>
                        <div class="theme-scheme-date">${formatDate(scheme.timestamp)}</div>
                    </div>
                    <div class="theme-scheme-actions" onclick="event.stopPropagation()">
                        ${isActive ? '<i class="fas fa-check" style="color:var(--accent-color);"></i>' : ''}
                        <button onclick="window.renameThemeScheme('${scheme.id}')" title="重命名"><i class="fas fa-pen"></i></button>
                        <button onclick="window.deleteThemeScheme('${scheme.id}')" title="删除"><i class="fas fa-times"></i></button>
                    </div>
                </div>
            `;
        }).join('');
    }

    // ========== 全局CSS功能 ==========
    function applyGlobalCSS(css) {
        let styleEl = document.getElementById('global-custom-css');
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'global-custom-css';
            document.head.appendChild(styleEl);
        }
        styleEl.textContent = css || '';
    }

    function getGlobalCSS() {
        const styleEl = document.getElementById('global-custom-css');
        return styleEl ? styleEl.textContent : '';
    }

    // ========== 气泡CSS功能 ==========
    function applyBubbleCSS(css) {
        let styleEl = document.getElementById('bubble-custom-css');
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'bubble-custom-css';
            document.head.appendChild(styleEl);
        }
        styleEl.textContent = css || '';
    }

    function getBubbleCSS() {
        const styleEl = document.getElementById('bubble-custom-css');
        return styleEl ? styleEl.textContent : '';
    }

    // ========== 数据持久化 ==========
    function saveCurrentTheme() {
        try {
            localStorage.setItem('currentThemeVars', JSON.stringify(currentThemeVars));
        } catch (e) {}
    }

    function loadSavedTheme() {
        try {
            const saved = localStorage.getItem('currentThemeVars');
            if (saved) {
                const vars = JSON.parse(saved);
                applyThemeVars(vars);
            }
        } catch (e) {
            applyThemeVars(DEFAULT_THEME_VARS);
        }
    }

    // ========== 辅助函数 ==========
    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function formatDate(ts) {
        const d = new Date(ts);
        return `${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()}`;
    }

    // ========== 初始化 ==========
    function init() {
        loadSavedTheme();
        loadSavedSchemes();

        // 预设按钮事件
        document.querySelectorAll('.theme-color-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                applyPresetTheme(this.dataset.theme);
            });
        });

        // 保存方案按钮
        const saveBtn = document.getElementById('save-theme-scheme-btn');
        if (saveBtn) saveBtn.addEventListener('click', saveCurrentAsScheme);

        // 打开编辑器
        const openEditorBtn = document.getElementById('open-theme-editor');
        if (openEditorBtn) {
            openEditorBtn.addEventListener('click', function() {
                initThemeEditor();
                const modal = document.getElementById('theme-editor-modal');
                if (modal && typeof showModal === 'function') showModal(modal);
            });
        }

        // 编辑器内按钮
        const applyCloseBtn = document.getElementById('apply-close-theme-editor');
        if (applyCloseBtn) {
            applyCloseBtn.addEventListener('click', function() {
                saveCurrentTheme();
                const modal = document.getElementById('theme-editor-modal');
                if (modal && typeof hideModal === 'function') hideModal(modal);
            });
        }

        const resetEditorBtn = document.getElementById('reset-theme-editor');
        if (resetEditorBtn) {
            resetEditorBtn.addEventListener('click', function() {
                if (confirm('确定要重置为默认主题吗？')) {
                    applyThemeVars(DEFAULT_THEME_VARS);
                    updateEditorInputs();
                    saveCurrentTheme();
                }
            });
        }

        const closeEditorBtn = document.getElementById('close-theme-editor');
        if (closeEditorBtn) {
            closeEditorBtn.addEventListener('click', function() {
                const modal = document.getElementById('theme-editor-modal');
                if (modal && typeof hideModal === 'function') hideModal(modal);
            });
        }

        const overwriteBtn = document.getElementById('overwrite-theme-preset-btn');
        if (overwriteBtn) overwriteBtn.addEventListener('click', overwriteCurrentScheme);

        const savePresetBtn = document.getElementById('save-theme-preset-btn');
        if (savePresetBtn) savePresetBtn.addEventListener('click', saveCurrentAsScheme);

        const renamePresetBtn = document.getElementById('rename-theme-preset-btn');
        if (renamePresetBtn) renamePresetBtn.addEventListener('click', function() {
            if (currentSchemeId) renameScheme(currentSchemeId);
            else saveCurrentAsScheme();
        });

        const deletePresetBtn = document.getElementById('delete-theme-preset-btn');
        if (deletePresetBtn) {
            deletePresetBtn.addEventListener('click', function() {
                if (currentSchemeId) deleteScheme(currentSchemeId);
                else if (typeof showNotification === 'function') showNotification('请先选择一个方案', 'info');
            });
        }

        // 全局CSS
        const applyGlobalCssBtn = document.getElementById('apply-global-css-btn');
        if (applyGlobalCssBtn) {
            applyGlobalCssBtn.addEventListener('click', function() {
                const textarea = document.getElementById('custom-global-css');
                if (textarea) {
                    applyGlobalCSS(textarea.value);
                    localStorage.setItem('customGlobalCSS', textarea.value);
                    const status = document.getElementById('global-css-status');
                    if (status) {
                        status.style.display = 'block';
                        status.textContent = 'CSS 已应用 ✦';
                        setTimeout(() => status.style.display = 'none', 2000);
                    }
                }
            });
        }

        const resetGlobalCssBtn = document.getElementById('reset-global-css-btn');
        if (resetGlobalCssBtn) {
            resetGlobalCssBtn.addEventListener('click', function() {
                const textarea = document.getElementById('custom-global-css');
                if (textarea) textarea.value = '';
                applyGlobalCSS('');
                localStorage.removeItem('customGlobalCSS');
            });
        }

        const globalCssLiveToggle = document.getElementById('global-css-live-toggle');
        if (globalCssLiveToggle) {
            globalCssLiveToggle.addEventListener('change', function() {
                localStorage.setItem('globalCssLive', this.checked ? '1' : '0');
            });
            const liveEnabled = localStorage.getItem('globalCssLive') === '1';
            globalCssLiveToggle.checked = liveEnabled;
        }

        // 气泡CSS
        const applyCssBtn = document.getElementById('apply-css-btn');
        if (applyCssBtn) {
            applyCssBtn.addEventListener('click', function() {
                const textarea = document.getElementById('custom-bubble-css');
                if (textarea) {
                    applyBubbleCSS(textarea.value);
                    localStorage.setItem('customBubbleCSS', textarea.value);
                }
            });
        }

        const resetCssBtn = document.getElementById('reset-css-btn');
        if (resetCssBtn) {
            resetCssBtn.addEventListener('click', function() {
                const textarea = document.getElementById('custom-bubble-css');
                if (textarea) textarea.value = '';
                applyBubbleCSS('');
                localStorage.removeItem('customBubbleCSS');
            });
        }

        // 加载保存的CSS
        const savedGlobalCss = localStorage.getItem('customGlobalCSS');
        if (savedGlobalCss) {
            const textarea = document.getElementById('custom-global-css');
            if (textarea) textarea.value = savedGlobalCss;
            applyGlobalCSS(savedGlobalCss);
        }

        const savedBubbleCss = localStorage.getItem('customBubbleCSS');
        if (savedBubbleCss) {
            const textarea = document.getElementById('custom-bubble-css');
            if (textarea) textarea.value = savedBubbleCss;
            applyBubbleCSS(savedBubbleCss);
        }

        // 预设下拉框
        const presetSelector = document.getElementById('theme-preset-selector');
        if (presetSelector) {
            presetSelector.innerHTML = `
                <option value="">-- 选择预设 --</option>
                ${Object.keys(PRESET_THEMES).map(k => `<option value="${k}">${getThemeLabel(k)}</option>`).join('')}
            `;
            presetSelector.addEventListener('change', function() {
                if (this.value) applyPresetTheme(this.value);
            });
        }
    }

    // ========== 全局暴露 ==========
    window.applyPresetTheme = applyPresetTheme;
    window.applyThemeScheme = applyScheme;
    window.renameThemeScheme = renameScheme;
    window.deleteThemeScheme = deleteScheme;
    window.saveThemeScheme = saveCurrentAsScheme;
    window.getCurrentThemeVars = () => ({ ...currentThemeVars });
    window.getDefaultThemeVars = () => ({ ...DEFAULT_THEME_VARS });
    window.getPresetThemes = () => ({ ...PRESET_THEMES });
    window.applyGlobalCSS = applyGlobalCSS;
    window.applyBubbleCSS = applyBubbleCSS;

    // DOMReady初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
