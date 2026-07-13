/**
 * 传讯 - 应用主入口
 * 整合所有功能模块的初始化与协调
 */

(function() {
    'use strict';

    // ==================== 全局状态 ====================
    window.AppState = {
        initialized: false,
        currentSession: null,
        settings: null,
        messages: [],
        isTyping: false,
        autoSendInterval: null,
        momentTimer: null,
        cardConcatTimer: null,
        keepaliveAudio: null,
        soundEnabled: true,
        soundVolume: 0.15,
        immersiveMode: false,
        bottomCollapse: false,
        headerOpacityAlways: true,
        notificationsEnabled: false,
        theme: 'gold',
        colorTheme: 'black-white'
    };

    // ==================== 初始化入口 ====================
    function initApp() {
        if (AppState.initialized) return;

        console.log('[传讯] 应用初始化开始...');

        // 按顺序初始化各模块
        initStorage();
        initSettings();
        initTheme();
        initUI();
        initEventListeners();
        initFeatures();
        initTimers();

        AppState.initialized = true;
        console.log('[传讯] 应用初始化完成 ✦');

        // 显示欢迎提示
        setTimeout(() => {
            if (typeof showNotification === 'function') {
                showNotification('欢迎来到传讯 ✦', 'success');
            }
        }, 1000);
    }

    // ==================== 存储初始化 ====================
    function initStorage() {
        // 初始化 localforage
        if (typeof localforage !== 'undefined') {
            localforage.config({
                name: 'ChuanXunApp',
                storeName: 'chuanxun_data',
                description: '传讯应用数据存储'
            });
        }

        // 确保基础数据结构存在
        const defaults = {
            'customReplies': JSON.stringify({
                reply: { main: [], sub: [] },
                atmosphere: { poke: [], status: [], motto: [], opening: [] },
                announcement: { titles: [], notes: [], statusPool: [] }
            }),
            'moments': '[]',
            'moodRecords': '{}',
            'anniversaries': '[]',
            'companionDiary': '[]',
            'divinationHistory': '[]',
            'chatSessions': JSON.stringify([{ id: 'default', name: '默认会话', created: Date.now() }]),
            'currentSessionId': 'default',
            'cardConcatSettings': JSON.stringify({
                enabled: false,
                minCards: 2,
                maxCards: 5,
                probability: 30,
                momentEnabled: false,
                momentInterval: 30,
                momentMinCards: 3,
                momentMaxCards: 6,
                momentImgProbability: 50
            }),
            'appSettings': JSON.stringify({
                partnerName: '梦角',
                myName: '我',
                theme: 'gold',
                colorTheme: 'black-white',
                fontSize: 16,
                bubbleStyle: 'standard',
                showAvatar: true,
                alwaysShowAvatar: false,
                avatarSize: 36,
                avatarPosition: 'center',
                avatarShape: 'circle',
                avatarCornerRadius: 8,
                showReadReceipts: true,
                readReceiptStyle: 'icon',
                replyEnabled: true,
                typingIndicator: true,
                readNoReply: false,
                fakeVoice: false,
                autoSend: false,
                autoSendInterval: 5,
                emojiMix: false,
                soundEnabled: true,
                soundVolume: 15,
                timeFormat: 'HH:mm',
                immersiveMode: false,
                bottomCollapse: false,
                headerOpacityAlways: true,
                myPokeText: '拍了拍',
                notifications: false,
                keepaliveAudio: false,
                cardConcat: { enabled: false, minCards: 2, maxCards: 5, probability: 30 },
                cardConcatMoment: { enabled: false, interval: 30, minCards: 3, maxCards: 6, imgProbability: 50 }
            })
        };

        Object.keys(defaults).forEach(key => {
            if (localStorage.getItem(key) === null) {
                localStorage.setItem(key, defaults[key]);
            }
        });
    }

    // ==================== 设置初始化 ====================
    function initSettings() {
        try {
            const saved = localStorage.getItem('appSettings');
            AppState.settings = saved ? JSON.parse(saved) : {};
        } catch (e) {
            AppState.settings = {};
        }

        // 应用设置到UI
        applySettingsToUI();
    }

    function applySettingsToUI() {
        const s = AppState.settings;
        if (!s) return;

        // 昵称
        const partnerNameEl = document.getElementById('partner-name');
        const myNameEl = document.getElementById('my-name');
        if (partnerNameEl && s.partnerName) partnerNameEl.textContent = s.partnerName;
        if (myNameEl && s.myName) myNameEl.textContent = s.myName;

        // 主题
        if (s.theme) setTheme(s.theme);
        if (s.colorTheme) setColorTheme(s.colorTheme);

        // 字体大小
        if (s.fontSize) {
            document.documentElement.style.setProperty('--base-font-size', s.fontSize + 'px');
        }

        // 气泡样式
        if (s.bubbleStyle) setBubbleStyle(s.bubbleStyle);

        // 头像显示
        if (s.showAvatar !== undefined) toggleAvatarDisplay(s.showAvatar);
        if (s.alwaysShowAvatar !== undefined) toggleAlwaysAvatar(s.alwaysShowAvatar);

        // 沉浸式模式
        if (s.immersiveMode) toggleImmersiveMode(true);

        // 底部收纳
        if (s.bottomCollapse) toggleBottomCollapse(true);

        // 顶部栏透明度
        if (s.headerOpacityAlways === false) toggleHeaderOpacity(false);
    }

    // ==================== 主题初始化 ====================
    function initTheme() {
        const html = document.documentElement;
        const savedTheme = localStorage.getItem('theme') || 'gold';
        const savedColorTheme = localStorage.getItem('colorTheme') || 'black-white';

        html.setAttribute('data-theme', savedTheme);
        html.setAttribute('data-color-theme', savedColorTheme);

        applyThemeColors(savedTheme);
    }

    function applyThemeColors(theme) {
        const themes = {
            gold: { accent: '#c5a47e', rgb: '197,164,126' },
            blue: { accent: '#6b9dc7', rgb: '107,157,199' },
            purple: { accent: '#9b7dc7', rgb: '155,125,199' },
            green: { accent: '#7dc79b', rgb: '125,199,155' },
            pink: { accent: '#c77d9b', rgb: '199,125,155' },
            'black-white': { accent: '#888888', rgb: '136,136,136' },
            pastel: { accent: '#c75a5a', rgb: '199,90,90' },
            sunset: { accent: '#c78a5a', rgb: '199,138,90' },
            forest: { accent: '#5a8a5a', rgb: '90,138,90' },
            ocean: { accent: '#5a7a9a', rgb: '90,122,154' }
        };

        const t = themes[theme] || themes.gold;
        document.documentElement.style.setProperty('--accent-color', t.accent);
        document.documentElement.style.setProperty('--accent-color-rgb', t.rgb);
    }

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        applyThemeColors(theme);
        AppState.theme = theme;
    }

    function setColorTheme(colorTheme) {
        document.documentElement.setAttribute('data-color-theme', colorTheme);
        localStorage.setItem('colorTheme', colorTheme);
        AppState.colorTheme = colorTheme;
    }

    // ==================== UI初始化 ====================
    function initUI() {
        // 初始化聊天容器
        const chatContainer = document.getElementById('chat-container');
        if (chatContainer) {
            loadMessages();
        }

        // 初始化输入框
        const messageInput = document.getElementById('message-input');
        if (messageInput) {
            messageInput.addEventListener('input', autoResizeTextarea);
            messageInput.addEventListener('keydown', handleInputKeydown);
        }

        // 初始化空状态
        updateEmptyState();

        // 初始化头部状态
        updateHeaderStatus();
    }

    function autoResizeTextarea() {
        const el = this;
        el.style.height = 'auto';
        el.style.height = Math.min(el.scrollHeight, 120) + 'px';
    }

    function handleInputKeydown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    }

    function updateEmptyState() {
        const emptyState = document.getElementById('empty-state');
        const chatContainer = document.getElementById('chat-container');
        if (!emptyState || !chatContainer) return;

        const hasMessages = chatContainer.children.length > 0;
        emptyState.style.display = hasMessages ? 'none' : 'flex';
    }

    function updateHeaderStatus() {
        const statusEl = document.getElementById('partner-status');
        if (statusEl) {
            statusEl.innerHTML = '<span>在线</span>';
        }
    }

    // ==================== 消息处理 ====================
    function sendMessage() {
        const input = document.getElementById('message-input');
        if (!input) return;

        const text = input.value.trim();
        if (!text) return;

        // 添加用户消息
        addMessage({
            id: Date.now(),
            text: text,
            sender: 'me',
            timestamp: Date.now(),
            type: 'text'
        });

        input.value = '';
        input.style.height = 'auto';

        // 播放发送音效
        playSound('my-send');

        // 触发对方回复
        triggerPartnerReply();
    }

    function addMessage(msg) {
        const container = document.getElementById('chat-container');
        if (!container) return;

        AppState.messages.push(msg);

        const msgEl = createMessageElement(msg);
        container.appendChild(msgEl);

        // 滚动到底部
        scrollToBottom();
        updateEmptyState();

        // 保存消息
        saveMessages();
    }

    function createMessageElement(msg) {
        const div = document.createElement('div');
        div.className = `message message-${msg.sender}`;
        div.dataset.id = msg.id;

        const isMe = msg.sender === 'me';
        const settings = AppState.settings || {};

        // 头像
        let avatarHtml = '';
        if (settings.showAvatar) {
            const showThisAvatar = settings.alwaysShowAvatar || isFirstMessageFromSender(msg);
            if (showThisAvatar) {
                const avatarSize = settings.avatarSize || 36;
                const shape = settings.avatarShape === 'square' ? 
                    `${settings.avatarCornerRadius || 8}px` : '50%';
                avatarHtml = `<div class="msg-avatar" style="width:${avatarSize}px;height:${avatarSize}px;border-radius:${shape};">
                    <i class="fas fa-user"></i>
                </div>`;
            }
        }

        // 内容
        let contentHtml = '';
        if (msg.type === 'text') {
            contentHtml = `<div class="message-content">${escapeHtml(msg.text)}</div>`;
        } else if (msg.type === 'image') {
            contentHtml = `<div class="message-content"><img src="${msg.url}" alt="图片"></div>`;
        } else if (msg.type === 'voice') {
            contentHtml = `<div class="message-content voice-msg">
                <i class="fas fa-play-circle"></i>
                <div class="voice-wave"></div>
                <span>${msg.duration || 0}"</span>
            </div>`;
        }

        // 时间戳
        const timeStr = formatTime(msg.timestamp);
        const timeHtml = settings.timeFormat !== 'off' ? 
            `<div class="message-time">${timeStr}</div>` : '';

        // 已读回执
        let receiptHtml = '';
        if (isMe && settings.showReadReceipts) {
            const style = settings.readReceiptStyle || 'icon';
            receiptHtml = style === 'icon' ? 
                '<div class="read-receipt"><i class="fas fa-check-double"></i></div>' :
                '<div class="read-receipt">已读</div>';
        }

        div.innerHTML = isMe ? 
            `${avatarHtml}<div class="message-body">${contentHtml}${timeHtml}${receiptHtml}</div>` :
            `${avatarHtml}<div class="message-body">${contentHtml}${timeHtml}</div>`;

        return div;
    }

    function isFirstMessageFromSender(msg) {
        const idx = AppState.messages.findIndex(m => m.id === msg.id);
        if (idx <= 0) return true;
        return AppState.messages[idx - 1].sender !== msg.sender;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function formatTime(timestamp) {
        const date = new Date(timestamp);
        const settings = AppState.settings || {};
        const format = settings.timeFormat || 'HH:mm';

        const h = date.getHours();
        const m = String(date.getMinutes()).padStart(2, '0');
        const s = String(date.getSeconds()).padStart(2, '0');

        switch (format) {
            case 'HH:mm': return `${String(h).padStart(2, '0')}:${m}`;
            case 'HH:mm:ss': return `${String(h).padStart(2, '0')}:${m}:${s}`;
            case 'h:mm AM/PM': 
                const ampm = h >= 12 ? 'PM' : 'AM';
                const h12 = h % 12 || 12;
                return `${h12}:${m} ${ampm}`;
            case 'h:mm:ss AM/PM':
                const ampm2 = h >= 12 ? 'PM' : 'AM';
                const h122 = h % 12 || 12;
                return `${h122}:${m}:${s} ${ampm2}`;
            default: return `${String(h).padStart(2, '0')}:${m}`;
        }
    }

    function scrollToBottom() {
        const container = document.getElementById('chat-container');
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }

    // ==================== 对方回复逻辑 ====================
    function triggerPartnerReply() {
        const settings = AppState.settings || {};

        // 计算延迟
        const minDelay = (settings.replyDelayMin || 3) * 1000;
        const maxDelay = (settings.replyDelayMax || 7) * 1000;
        const delay = Math.random() * (maxDelay - minDelay) + minDelay;

        // 显示正在输入
        showTypingIndicator();

        setTimeout(() => {
            hideTypingIndicator();

            // 生成回复
            const reply = generateReply();
            if (reply) {
                addMessage({
                    id: Date.now(),
                    text: reply,
                    sender: 'partner',
                    timestamp: Date.now(),
                    type: 'text'
                });

                playSound('partner-message');
            }
        }, delay);
    }

    function showTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.style.display = 'flex';
            AppState.isTyping = true;
        }
    }

    function hideTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.style.display = 'none';
            AppState.isTyping = false;
        }
    }

    function generateReply() {
        const settings = AppState.settings || {};

        // 检查字卡拼接
        if (settings.cardConcat && settings.cardConcat.enabled) {
            const concatMsg = generateConcatMessage();
            if (concatMsg) return concatMsg;
        }

        // 从字卡库随机选择
        const library = getMainCardLibrary();
        if (library.length === 0) return '我在这里陪着你 ✦';

        const item = library[Math.floor(Math.random() * library.length)];
        return typeof item === 'string' ? item : (item.text || item.content || '...');
    }

    // ==================== 字卡拼接功能 ====================
    function generateConcatMessage() {
        const settings = AppState.settings || {};
        const cc = settings.cardConcat;
        if (!cc || !cc.enabled) return null;

        // 概率检查
        if (Math.random() * 100 > (cc.probability || 30)) return null;

        const library = getMainCardLibrary();
        const minCards = cc.minCards || 2;
        const maxCards = cc.maxCards || 5;

        if (library.length < minCards) return null;

        const count = Math.floor(Math.random() * (maxCards - minCards + 1)) + minCards;
        const shuffled = [...library].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, count);

        return concatCards(selected);
    }

    function concatCards(cards) {
        if (!cards || cards.length === 0) return '';

        const connectors = ['，', '。', '！', '？', '……', '；', ''];
        let result = '';

        cards.forEach((card, index) => {
            let text = typeof card === 'string' ? card : (card.text || card.content || '');
            if (!text) return;

            text = text.replace(/^[，。！？…；]+|[，。！？…；]+$/g, '');

            if (index === 0) {
                result = text;
            } else {
                const connector = connectors[Math.floor(Math.random() * connectors.length)];
                result += connector + text;
            }
        });

        const endPunctuations = ['。', '！', '？', '……', '～'];
        if (!/[。！？…~～]$/.test(result)) {
            result += endPunctuations[Math.floor(Math.random() * endPunctuations.length)];
        }

        return result;
    }

    function getMainCardLibrary() {
        try {
            const saved = localStorage.getItem('customReplies');
            if (saved) {
                const data = JSON.parse(saved);
                if (data.reply && data.reply.main) {
                    return data.reply.main.filter(item => {
                        if (typeof item === 'string') return item.trim();
                        return (item.text || item.content);
                    });
                }
            }
        } catch (e) {}

        // 默认字卡库
        return [
            '今天也要元气满满',
            '想你了',
            '我在这里陪着你',
            '记得按时吃饭',
            '不要太累了',
            '抱抱你',
            '晚安，好梦',
            '早安，今天也要开心',
            '你是最棒的',
            '我会一直陪着你'
        ];
    }

    // ==================== 朋友圈自动发布 ====================
    function initCardConcatMomentTimer() {
        const settings = AppState.settings || {};
        const ccm = settings.cardConcatMoment;

        if (!ccm || !ccm.enabled) return;

        const interval = (ccm.interval || 30) * 60 * 1000;

        AppState.cardConcatTimer = setInterval(() => {
            autoPublishMoment();
        }, interval);
    }

    function autoPublishMoment() {
        const settings = AppState.settings || {};
        const ccm = settings.cardConcatMoment;
        if (!ccm || !ccm.enabled) return;

        const library = getMainCardLibrary();
        const minCards = ccm.minCards || 3;
        const maxCards = ccm.maxCards || 6;

        if (library.length < minCards) return;

        const count = Math.floor(Math.random() * (maxCards - minCards + 1)) + minCards;
        const shuffled = [...library].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, count);
        const text = concatCards(selected);

        if (!text) return;

        // 决定是否附带图片
        const hasImage = Math.random() * 100 < (ccm.imgProbability || 50);

        const moment = {
            id: Date.now(),
            author: 'partner',
            authorName: settings.partnerName || '梦角',
            text: text,
            images: [],
            likes: [],
            comments: [],
            timestamp: Date.now()
        };

        const moments = getMoments();
        moments.unshift(moment);
        saveMoments(moments);

        // 刷新朋友圈列表（如果在打开状态）
        const momentModal = document.getElementById('moment-modal');
        if (momentModal && momentModal.classList.contains('active')) {
            renderMomentList();
        }

        if (typeof showNotification === 'function') {
            showNotification(`${settings.partnerName || '梦角'}发布了新动态 ✦`, 'info');
        }
    }

    // ==================== 朋友圈功能 ====================
    function getMoments() {
        try {
            const saved = localStorage.getItem('moments');
            if (saved) return JSON.parse(saved);
        } catch (e) {}
        return [];
    }

    function saveMoments(moments) {
        localStorage.setItem('moments', JSON.stringify(moments));
    }

    function renderMomentList() {
        const list = document.getElementById('moment-list');
        if (!list) return;

        const moments = getMoments();
        const settings = AppState.settings || {};

        if (moments.length === 0) {
            list.innerHTML = `
                <div class="moment-empty">
                    <i class="fas fa-camera-retro"></i>
                    <p>还没有动态</p>
                    <p style="font-size:12px;opacity:0.6;">发布你的第一条朋友圈吧</p>
                </div>
            `;
            return;
        }

        list.innerHTML = moments.map(moment => {
            const date = new Date(moment.timestamp);
            const timeStr = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')} ${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`;

            let imagesHtml = '';
            if (moment.images && moment.images.length > 0) {
                const imgClass = moment.images.length === 1 ? 'single' : 
                    (moment.images.length === 2 ? 'double' : 'multiple');
                imagesHtml = `<div class="moment-item-images ${imgClass}">
                    ${moment.images.map(img => `<img src="${img}" onclick="window.open('${img}')">`).join('')}
                </div>`;
            }

            const isLiked = moment.likes && moment.likes.includes('me');

            let commentsHtml = '';
            if (moment.comments && moment.comments.length > 0) {
                commentsHtml = `<div class="moment-comments">
                    ${moment.comments.map(c => `<div class="moment-comment-item">
                        <span class="moment-comment-name">${escapeHtml(c.name)}:</span> ${escapeHtml(c.text)}
                    </div>`).join('')}
                </div>`;
            }

            return `
                <div class="moment-item" data-id="${moment.id}">
                    <div class="moment-item-avatar">
                        ${moment.author === 'partner' ? 
                            `<img src="${settings.partnerAvatar || ''}" onerror="this.style.display='none';this.parentNode.innerHTML='<i class=\'fas fa-user\'></i>'">` :
                            `<img src="${settings.myAvatar || ''}" onerror="this.style.display='none';this.parentNode.innerHTML='<i class=\'fas fa-user-circle\'></i>'">`
                        }
                    </div>
                    <div class="moment-item-content">
                        <div class="moment-item-name">${escapeHtml(moment.authorName || (moment.author === 'partner' ? '梦角' : '我'))}</div>
                        <div class="moment-item-text">${escapeHtml(moment.text)}</div>
                        ${imagesHtml}
                        <div class="moment-item-meta">
                            <span>${timeStr}</span>
                            <div class="moment-item-actions">
                                <button class="${isLiked ? 'liked' : ''}" onclick="window.toggleLikeMoment(${moment.id})">
                                    <i class="fas fa-heart"></i> ${moment.likes ? moment.likes.length : 0}
                                </button>
                                <button onclick="window.commentMoment(${moment.id})">
                                    <i class="fas fa-comment"></i> ${moment.comments ? moment.comments.length : 0}
                                </button>
                            </div>
                        </div>
                        ${commentsHtml}
                    </div>
                </div>
            `;
        }).join('');
    }

    // 全局暴露朋友圈函数
    window.toggleLikeMoment = function(momentId) {
        const moments = getMoments();
        const moment = moments.find(m => m.id === momentId);
        if (!moment) return;
        if (!moment.likes) moment.likes = [];
        const idx = moment.likes.indexOf('me');
        if (idx > -1) moment.likes.splice(idx, 1);
        else moment.likes.push('me');
        saveMoments(moments);
        renderMomentList();
    };

    window.commentMoment = function(momentId) {
        const text = prompt('输入评论:');
        if (!text || !text.trim()) return;
        const moments = getMoments();
        const moment = moments.find(m => m.id === momentId);
        if (!moment) return;
        if (!moment.comments) moment.comments = [];
        moment.comments.push({
            name: '我',
            text: text.trim(),
            timestamp: Date.now()
        });
        saveMoments(moments);
        renderMomentList();
    };

    window.openPublishMoment = function() {
        const modal = document.getElementById('publish-moment-modal');
        if (modal) showModal(modal);
    };

    window.publishMoment = function() {
        const contentInput = document.getElementById('moment-content-input');
        const text = contentInput ? contentInput.value.trim() : '';
        if (!text) {
            alert('请输入内容');
            return;
        }

        const moments = getMoments();
        moments.unshift({
            id: Date.now(),
            author: 'me',
            authorName: AppState.settings.myName || '我',
            text: text,
            images: [],
            likes: [],
            comments: [],
            timestamp: Date.now()
        });
        saveMoments(moments);

        contentInput.value = '';
        hideModal(document.getElementById('publish-moment-modal'));
        renderMomentList();

        if (typeof showNotification === 'function') {
            showNotification('动态发布成功 ✦', 'success');
        }
    };

    window.openMomentSettings = function() {
        const modal = document.getElementById('moment-settings-modal');
        if (modal) showModal(modal);
    };

    window.saveMomentSettings = function() {
        const signature = document.getElementById('moment-signature-input');
        if (signature) {
            localStorage.setItem('momentSignature', signature.value);
        }
        hideModal(document.getElementById('moment-settings-modal'));
        if (typeof showNotification === 'function') {
            showNotification('设置已保存 ✦', 'success');
        }
    };

    window.openMomentModal = function() {
        const modal = document.getElementById('moment-modal');
        if (modal) {
            renderMomentList();
            showModal(modal);
        }
    };

    // ==================== 事件监听初始化 ====================
    function initEventListeners() {
        // 发送按钮
        const sendBtn = document.getElementById('send-btn');
        if (sendBtn) sendBtn.addEventListener('click', sendMessage);

        // 设置按钮
        const settingsBtn = document.getElementById('settings-btn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                const modal = document.getElementById('settings-modal');
                if (modal) showModal(modal);
            });
        }

        // 外观设置
        const appearanceBtn = document.getElementById('appearance-settings');
        if (appearanceBtn) {
            appearanceBtn.addEventListener('click', () => {
                hideModal(document.getElementById('settings-modal'));
                const modal = document.getElementById('appearance-modal');
                if (modal) showModal(modal);
            });
        }

        // 聊天设置
        const chatBtn = document.getElementById('chat-settings');
        if (chatBtn) {
            chatBtn.addEventListener('click', () => {
                hideModal(document.getElementById('settings-modal'));
                const modal = document.getElementById('chat-modal');
                if (modal) showModal(modal);
            });
        }

        // 高级功能
        const advancedBtn = document.getElementById('advanced-settings');
        if (advancedBtn) {
            advancedBtn.addEventListener('click', () => {
                hideModal(document.getElementById('settings-modal'));
                const modal = document.getElementById('advanced-modal');
                if (modal) showModal(modal);
            });
        }

        // 数据管理
        const dataBtn = document.getElementById('data-settings');
        if (dataBtn) {
            dataBtn.addEventListener('click', () => {
                hideModal(document.getElementById('settings-modal'));
                const modal = document.getElementById('data-modal');
                if (modal) showModal(modal);
            });
        }

        // 朋友圈按钮（头部）
        const momentHeaderBtn = document.getElementById('moment-header-btn');
        if (momentHeaderBtn) {
            momentHeaderBtn.addEventListener('click', openMomentModal);
        }

        // 关闭按钮们
        document.querySelectorAll('.modal-btn-secondary').forEach(btn => {
            if (btn.textContent.includes('关闭')) {
                btn.addEventListener('click', function() {
                    const modal = this.closest('.modal');
                    if (modal) hideModal(modal);
                });
            }
        });

        // 图片上传预览
        const momentImageInput = document.getElementById('moment-image-input');
        if (momentImageInput) {
            momentImageInput.addEventListener('change', handleMomentImagePreview);
        }

        // 封面上传
        const momentCoverInput = document.getElementById('moment-cover-input');
        if (momentCoverInput) {
            momentCoverInput.addEventListener('change', handleMomentCoverUpload);
        }
    }

    function handleMomentImagePreview(e) {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const preview = document.getElementById('moment-image-preview');
        if (!preview) return;

        preview.innerHTML = '';
        preview.style.display = 'flex';

        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = function(event) {
                const img = document.createElement('img');
                img.src = event.target.result;
                img.style.cssText = 'width:60px;height:60px;object-fit:cover;border-radius:8px;';
                preview.appendChild(img);
            };
            reader.readAsDataURL(file);
        });
    }

    function handleMomentCoverUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            const coverBg = document.getElementById('moment-cover-bg');
            if (coverBg) {
                coverBg.style.backgroundImage = `url(${event.target.result})`;
                coverBg.style.backgroundSize = 'cover';
                coverBg.style.backgroundPosition = 'center';
            }
            localStorage.setItem('momentCover', event.target.result);
        };
        reader.readAsDataURL(file);
    }

    // ==================== 功能模块初始化 ====================
    function initFeatures() {
        // 初始化字卡拼接UI
        initCardConcatUI();

        // 初始化朋友圈
        initMomentFeature();

        // 初始化其他功能模块（如果存在）
        if (typeof initReplyLibrary === 'function') initReplyLibrary();
        if (typeof initMood === 'function') initMood();
        if (typeof initEnvelope === 'function') initEnvelope();
        if (typeof initCompanion === 'function') initCompanion();
        if (typeof initCallFeature === 'function') initCallFeature();
        if (typeof initThemeEditor === 'function') initThemeEditor();
        if (typeof initGroupChat === 'function') initGroupChat();
        if (typeof initStats === 'function') initStats();
        if (typeof initFortune === 'function') initFortune();
        if (typeof initDecision === 'function') initDecision();
        if (typeof initAnniversary === 'function') initAnniversary();
        if (typeof initMusicPlayer === 'function') initMusicPlayer();
    }

    function initCardConcatUI() {
        // 字卡拼接开关
        const toggle = document.getElementById('card-concat-toggle');
        const control = document.getElementById('card-concat-control');

        if (toggle && control) {
            const settings = AppState.settings || {};
            const cc = settings.cardConcat || {};

            updateToggleUI(toggle, cc.enabled);
            control.style.display = cc.enabled ? 'block' : 'none';

            toggle.addEventListener('click', function() {
                const enabled = !cc.enabled;
                cc.enabled = enabled;
                settings.cardConcat = cc;
                AppState.settings = settings;
                saveSettings();

                updateToggleUI(toggle, enabled);
                control.style.display = enabled ? 'block' : 'none';
            });
        }

        // 最少条数
        initSlider('card-concat-min-slider', 'card-concat-min-value', (val) => {
            const settings = AppState.settings || {};
            if (!settings.cardConcat) settings.cardConcat = {};
            settings.cardConcat.minCards = val;
            saveSettings();
        }, '条');

        // 最多条数
        initSlider('card-concat-max-slider', 'card-concat-max-value', (val) => {
            const settings = AppState.settings || {};
            if (!settings.cardConcat) settings.cardConcat = {};
            settings.cardConcat.maxCards = val;
            saveSettings();
        }, '条');

        // 概率
        initSlider('card-concat-prob-slider', 'card-concat-prob-value', (val) => {
            const settings = AppState.settings || {};
            if (!settings.cardConcat) settings.cardConcat = {};
            settings.cardConcat.probability = val;
            saveSettings();
        }, '%');

        // 朋友圈开关
        const momentToggle = document.getElementById('card-concat-moment-toggle');
        const momentControl = document.getElementById('card-concat-moment-control');

        if (momentToggle && momentControl) {
            const settings = AppState.settings || {};
            const ccm = settings.cardConcatMoment || {};

            updateToggleUI(momentToggle, ccm.enabled);
            momentControl.style.display = ccm.enabled ? 'block' : 'none';

            momentToggle.addEventListener('click', function() {
                const enabled = !ccm.enabled;
                ccm.enabled = enabled;
                settings.cardConcatMoment = ccm;
                AppState.settings = settings;
                saveSettings();

                updateToggleUI(momentToggle, enabled);
                momentControl.style.display = enabled ? 'block' : 'none';

                if (enabled) initCardConcatMomentTimer();
                else clearInterval(AppState.cardConcatTimer);
            });
        }

        // 朋友圈间隔
        initSlider('card-concat-moment-interval-slider', 'card-concat-moment-interval-value', (val) => {
            const settings = AppState.settings || {};
            if (!settings.cardConcatMoment) settings.cardConcatMoment = {};
            settings.cardConcatMoment.interval = val;
            saveSettings();
            clearInterval(AppState.cardConcatTimer);
            initCardConcatMomentTimer();
        }, '分钟');

        // 朋友圈最少字卡
        initSlider('card-concat-moment-min-slider', 'card-concat-moment-min-value', (val) => {
            const settings = AppState.settings || {};
            if (!settings.cardConcatMoment) settings.cardConcatMoment = {};
            settings.cardConcatMoment.minCards = val;
            saveSettings();
        }, '条');

        // 朋友圈最多字卡
        initSlider('card-concat-moment-max-slider', 'card-concat-moment-max-value', (val) => {
            const settings = AppState.settings || {};
            if (!settings.cardConcatMoment) settings.cardConcatMoment = {};
            settings.cardConcatMoment.maxCards = val;
            saveSettings();
        }, '条');

        // 朋友圈图片概率
        initSlider('card-concat-moment-img-prob-slider', 'card-concat-moment-img-prob-value', (val) => {
            const settings = AppState.settings || {};
            if (!settings.cardConcatMoment) settings.cardConcatMoment = {};
            settings.cardConcatMoment.imgProbability = val;
            saveSettings();
        }, '%');
    }

    function initSlider(sliderId, valueId, callback, suffix) {
        const slider = document.getElementById(sliderId);
        const valueEl = document.getElementById(valueId);
        if (!slider || !valueEl) return;

        slider.addEventListener('input', function() {
            const val = parseInt(this.value);
            valueEl.textContent = val + (suffix || '');
            if (callback) callback(val);
        });
    }

    function updateToggleUI(toggleEl, enabled) {
        const switchEl = toggleEl.querySelector('.setting-pill-switch');
        const knob = toggleEl.querySelector('.setting-pill-knob');
        if (switchEl) switchEl.style.background = enabled ? 'var(--accent-color)' : 'var(--border-color)';
        if (knob) knob.style.left = enabled ? '23px' : '3px';
    }

    function initMomentFeature() {
        // 加载封面
        const savedCover = localStorage.getItem('momentCover');
        if (savedCover) {
            const coverBg = document.getElementById('moment-cover-bg');
            if (coverBg) {
                coverBg.style.backgroundImage = `url(${savedCover})`;
                coverBg.style.backgroundSize = 'cover';
                coverBg.style.backgroundPosition = 'center';
            }
        }

        // 加载签名
        const savedSignature = localStorage.getItem('momentSignature');
        if (savedSignature) {
            const input = document.getElementById('moment-signature-input');
            if (input) input.value = savedSignature;
        }

        // 初始化定时器
        initCardConcatMomentTimer();
    }

    // ==================== 定时器初始化 ====================
    function initTimers() {
        const settings = AppState.settings || {};

        // 主动发消息定时器
        if (settings.autoSend) {
            const interval = (settings.autoSendInterval || 5) * 60 * 1000;
            AppState.autoSendInterval = setInterval(() => {
                if (!AppState.isTyping) {
                    triggerPartnerReply();
                }
            }, interval);
        }
    }

    // ==================== 数据持久化 ====================
    function saveMessages() {
        const sessionId = AppState.currentSession || 'default';
        localStorage.setItem(`messages_${sessionId}`, JSON.stringify(AppState.messages));
    }

    function loadMessages() {
        const sessionId = AppState.currentSession || 'default';
        try {
            const saved = localStorage.getItem(`messages_${sessionId}`);
            if (saved) {
                AppState.messages = JSON.parse(saved);
                renderMessages();
            }
        } catch (e) {
            AppState.messages = [];
        }
    }

    function renderMessages() {
        const container = document.getElementById('chat-container');
        if (!container) return;

        container.innerHTML = '';
        AppState.messages.forEach(msg => {
            container.appendChild(createMessageElement(msg));
        });

        scrollToBottom();
        updateEmptyState();
    }

    function saveSettings() {
        localStorage.setItem('appSettings', JSON.stringify(AppState.settings));
    }

    // ==================== 音效系统 ====================
    function playSound(type) {
        const settings = AppState.settings || {};
        if (!settings.soundEnabled) return;

        const volume = (settings.soundVolume || 15) / 100;

        // 内置音效（使用 Web Audio API 生成简单音效）
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        switch (type) {
            case 'my-send':
                oscillator.frequency.value = 800;
                gainNode.gain.value = volume * 0.3;
                oscillator.type = 'sine';
                break;
            case 'partner-message':
                oscillator.frequency.value = 600;
                gainNode.gain.value = volume * 0.3;
                oscillator.type = 'sine';
                break;
            case 'poke':
                oscillator.frequency.value = 400;
                gainNode.gain.value = volume * 0.5;
                oscillator.type = 'triangle';
                break;
            default:
                oscillator.frequency.value = 500;
                gainNode.gain.value = volume * 0.3;
        }

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.1);
    }

    // ==================== 模态框控制 ====================
    window.showModal = function(modal, focusEl) {
        if (!modal) return;
        modal.classList.add('active');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        if (focusEl) {
            setTimeout(() => focusEl.focus(), 100);
        }
    };

    window.hideModal = function(modal) {
        if (!modal) return;
        modal.classList.remove('active');
        modal.style.display = 'none';
        document.body.style.overflow = '';
    };

    // ==================== 主题与样式控制 ====================
    function setBubbleStyle(style) {
        const container = document.getElementById('chat-container');
        if (!container) return;
        container.setAttribute('data-bubble-style', style);
    }

    function toggleAvatarDisplay(show) {
        const container = document.getElementById('chat-container');
        if (container) {
            container.classList.toggle('hide-avatars', !show);
        }
    }

    function toggleAlwaysAvatar(always) {
        const container = document.getElementById('chat-container');
        if (container) {
            container.classList.toggle('always-avatars', always);
        }
    }

    window.toggleImmersiveMode = function(enable) {
        const body = document.body;
        const btn = document.getElementById('immersive-exit-btn');

        if (enable === undefined) {
            enable = !body.classList.contains('immersive-mode');
        }

        body.classList.toggle('immersive-mode', enable);
        if (btn) btn.style.display = enable ? 'flex' : 'none';

        AppState.immersiveMode = enable;
        if (AppState.settings) {
            AppState.settings.immersiveMode = enable;
            saveSettings();
        }
    };

    window.toggleBottomCollapse = function(enable) {
        if (enable === undefined) {
            enable = !AppState.bottomCollapse;
        }

        AppState.bottomCollapse = enable;
        document.body.classList.toggle('bottom-collapsed', enable);

        const collapseBtn = document.getElementById('collapse-expand-btn');
        const collapsedPanel = document.getElementById('collapsed-extras-panel');

        if (collapseBtn) collapseBtn.style.display = enable ? 'flex' : 'none';
        if (collapsedPanel) collapsedPanel.style.display = 'none';

        if (AppState.settings) {
            AppState.settings.bottomCollapse = enable;
            saveSettings();
        }
    };

    window.toggleHeaderOpacity = function(enable) {
        if (enable === undefined) {
            enable = !AppState.headerOpacityAlways;
        }

        AppState.headerOpacityAlways = enable;
        document.body.classList.toggle('header-always-clear', enable);

        if (AppState.settings) {
            AppState.settings.headerOpacityAlways = enable;
            saveSettings();
        }
    };

    window.toggleCollapsedExtras = function() {
        const panel = document.getElementById('collapsed-extras-panel');
        const btn = document.getElementById('collapse-expand-btn');

        if (!panel) return;

        const isOpen = panel.style.display === 'block';
        panel.style.display = isOpen ? 'none' : 'block';
        if (btn) btn.classList.toggle('open', !isOpen);
    };

    window.exitCollapseMode = function() {
        toggleBottomCollapse(false);
    };

    // ==================== 通知系统 ====================
    window.showNotification = function(message, type) {
        const existing = document.querySelector('.app-notification');
        if (existing) existing.remove();

        const notif = document.createElement('div');
        notif.className = `app-notification notification-${type || 'info'}`;
        notif.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notif);

        requestAnimationFrame(() => {
            notif.classList.add('show');
        });

        setTimeout(() => {
            notif.classList.remove('show');
            setTimeout(() => notif.remove(), 300);
        }, 3000);
    };

    // ==================== 数据导入导出 ====================
    window.exportData = function() {
        const data = {};
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            data[key] = localStorage.getItem(key);
        });

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `传讯备份_${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        URL.revokeObjectURL(url);

        showNotification('数据导出成功 ✦', 'success');
    };

    window.importData = function(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                Object.keys(data).forEach(key => {
                    localStorage.setItem(key, data[key]);
                });

                showNotification('数据导入成功，页面将刷新 ✦', 'success');
                setTimeout(() => location.reload(), 1500);
            } catch (err) {
                showNotification('数据导入失败：格式错误', 'error');
            }
        };
        reader.readAsText(file);
    };

    // ==================== 内置字卡库导出导入 ====================
    window.exportCardLibrary = function() {
        const library = getMainCardLibrary();
        const blob = new Blob([JSON.stringify(library, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `字卡库_${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    window.importCardLibrary = function(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const library = JSON.parse(e.target.result);
                const data = JSON.parse(localStorage.getItem('customReplies') || '{}');
                if (!data.reply) data.reply = {};
                data.reply.main = library;
                localStorage.setItem('customReplies', JSON.stringify(data));

                showNotification('字卡库导入成功 ✦', 'success');
            } catch (err) {
                showNotification('字卡库导入失败', 'error');
            }
        };
        reader.readAsText(file);
    };

    // ==================== 音效导出导入 ====================
    window.exportSounds = function() {
        const sounds = {};
        ['my-send', 'partner-message', 'my-poke', 'partner-poke'].forEach(key => {
            const data = localStorage.getItem(`sound_${key}`);
            if (data) sounds[key] = data;
        });

        const blob = new Blob([JSON.stringify(sounds, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `音效配置_${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    window.importSounds = function(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const sounds = JSON.parse(e.target.result);
                Object.keys(sounds).forEach(key => {
                    localStorage.setItem(`sound_${key}`, sounds[key]);
                });
                showNotification('音效配置导入成功 ✦', 'success');
            } catch (err) {
                showNotification('音效导入失败', 'error');
            }
        };
        reader.readAsText(file);
    };

    // ==================== 工具函数 ====================
    window.throttledSaveData = function() {
        clearTimeout(window._saveThrottleTimer);
        window._saveThrottleTimer = setTimeout(() => {
            saveSettings();
        }, 500);
    };

    window.updateUI = function() {
        applySettingsToUI();
    };

    // ==================== DOM Ready ====================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        initApp();
    }

    // 暴露全局
    window.AppState = AppState;
    window.initApp = initApp;
    window.sendMessage = sendMessage;
    window.addMessage = addMessage;
    window.generateConcatMessage = generateConcatMessage;
    window.getMainCardLibrary = getMainCardLibrary;
    window.saveSettings = saveSettings;
    window.playSound = playSound;

})();
