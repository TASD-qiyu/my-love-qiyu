/* ============================================================
   core.js — 传讯核心聊天引擎
   包含：消息渲染、发送/接收逻辑、字卡拼接回复、
         朋友圈自动发布、打字指示器、状态栏、音效等
   ============================================================ */

(function (window) {
    'use strict';

    /* ===================== 全局快捷引用 ===================== */
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);
    const LS = window.localStorage;

    /* ===================== 默认配置 ===================== */
    const DEFAULT_CONFIG = {
        partnerName: '梦角',
        myName: '我',
        replyDelayMin: 3000,
        replyDelayMax: 7000,
        autoSend: false,
        autoSendInterval: 5,
        soundEnabled: true,
        soundVolume: 0.15,
        readReceipts: true,
        readNoReply: false,
        typingIndicator: true,
        replyEnabled: true,
        emojiMix: false,
        timeFormat: 'HH:mm',
        fontSize: 16,
        bubbleStyle: 'standard',
        showAvatars: true,
        alwaysShowAvatar: false,
        avatarSize: 36,
        avatarPosition: 'center',
        avatarShape: 'circle',
        avatarCornerRadius: 8,
        headerOpacityAlways: true,
        bottomCollapse: false,
        immersiveMode: false,
        cardConcat: {
            enabled: false,
            minCards: 2,
            maxCards: 5,
            probability: 30
        },
        cardConcatMoment: {
            enabled: false,
            interval: 30,
            minCards: 3,
            maxCards: 6,
            imgProbability: 50
        },
        fakeVoice: false,
        keepaliveAudio: false,
        pokeSymbol: { me: '♡', partner: '♡' }
    };

    /* ===================== 内置音效 (Web Audio API 生成) ===================== */
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    let audioCtx = null;

    function ensureAudioCtx() {
        if (!audioCtx) audioCtx = new AudioCtx();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        return audioCtx;
    }

    /* 生成提示音 */
    function playTone(freq, duration, type, volume) {
        const ctx = ensureAudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type || 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(volume || 0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + duration);
    }

    /* 内置音效映射 */
    const SOUND_PRESETS = {
        tone_default: () => { playTone(880, 0.15, 'sine', 0.12); },
        tone_soft:    () => { playTone(660, 0.2, 'sine', 0.1); playTone(880, 0.2, 'sine', 0.08); },
        tone_low:     () => { playTone(220, 0.3, 'triangle', 0.15); },
        tone_warm:    () => { playTone(523, 0.15, 'sine', 0.1); setTimeout(() => playTone(659, 0.15, 'sine', 0.08), 80); },
        tone_dark:    () => { playTone(150, 0.4, 'sawtooth', 0.08); },
        tone_haze:    () => { playTone(440, 0.5, 'sine', 0.06); }
    };

    /* ===================== 状态管理 ===================== */
    let settings = {};
    let messages = [];
    let currentSessionId = 'default';
    let isTyping = false;
    let autoSendTimer = null;
    let momentTimer = null;
    let keepaliveOsc = null;

    /* ===================== 工具函数 ===================== */
    function loadSettings() {
        try {
            const saved = LS.getItem('settings');
            if (saved) {
                const parsed = JSON.parse(saved);
                settings = Object.assign({}, DEFAULT_CONFIG, parsed);
                // 确保嵌套对象存在
                if (!settings.cardConcat) settings.cardConcat = { ...DEFAULT_CONFIG.cardConcat };
                if (!settings.cardConcatMoment) settings.cardConcatMoment = { ...DEFAULT_CONFIG.cardConcatMoment };
                if (!settings.pokeSymbol) settings.pokeSymbol = { ...DEFAULT_CONFIG.pokeSymbol };
            } else {
                settings = { ...DEFAULT_CONFIG };
            }
        } catch (e) {
            settings = { ...DEFAULT_CONFIG };
        }
    }

    function saveSettings() {
        LS.setItem('settings', JSON.stringify(settings));
    }

    function loadMessages() {
        try {
            const saved = LS.getItem('messages_' + currentSessionId);
            messages = saved ? JSON.parse(saved) : [];
        } catch (e) {
            messages = [];
        }
    }

    function saveMessages() {
        LS.setItem('messages_' + currentSessionId, JSON.stringify(messages));
    }

    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }

    function formatTime(ts, fmt) {
        const d = new Date(ts);
        const H = String(d.getHours()).padStart(2, '0');
        const h = d.getHours() % 12 || 12;
        const m = String(d.getMinutes()).padStart(2, '0');
        const s = String(d.getSeconds()).padStart(2, '0');
        const ampm = d.getHours() >= 12 ? 'PM' : 'AM';
        fmt = fmt || settings.timeFormat;
        if (fmt === 'off') return '';
        if (fmt === 'HH:mm') return H + ':' + m;
        if (fmt === 'HH:mm:ss') return H + ':' + m + ':' + s;
        if (fmt === 'h:mm AM/PM') return h + ':' + m + ' ' + ampm;
        if (fmt === 'h:mm:ss AM/PM') return h + ':' + m + ':' + s + ' ' + ampm;
        return H + ':' + m;
    }

    /* ===================== 字卡库管理 ===================== */
    function getCardLibrary() {
        try {
            const saved = LS.getItem('customReplies');
            if (saved) {
                const data = JSON.parse(saved);
                if (data.reply && data.reply.main) {
                    return data.reply.main.filter(item => {
                        if (typeof item === 'string') return item.trim().length > 0;
                        return (item.text || item.content || '').trim().length > 0;
                    });
                }
            }
        } catch (e) {}
        return [];
    }

    /* ===================== 字卡拼接功能 ===================== */
    function drawRandomCards(count, library) {
        if (!library || library.length === 0) return [];
        const shuffled = [...library].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(count, shuffled.length));
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
                if (connector) {
                    result += connector + text;
                } else {
                    result += text;
                }
            }
        });
        const endPunctuations = ['。', '！', '？', '……', '～'];
        if (!/[。！？…~～]$/.test(result)) {
            result += endPunctuations[Math.floor(Math.random() * endPunctuations.length)];
        }
        return result;
    }

    function generateConcatMessage() {
        const cc = settings.cardConcat;
        if (!cc || !cc.enabled) return null;
        if (Math.random() * 100 > cc.probability) return null;
        const library = getCardLibrary();
        if (library.length < (cc.minCards || 2)) return null;
        const count = Math.floor(Math.random() * ((cc.maxCards || 5) - (cc.minCards || 2) + 1)) + (cc.minCards || 2);
        const cards = drawRandomCards(count, library);
        if (cards.length < 2) return null;
        return concatCards(cards);
    }

    /* ===================== 朋友圈数据管理 ===================== */
    function getMoments() {
        try {
            const saved = LS.getItem('moments');
            if (saved) return JSON.parse(saved);
        } catch (e) {}
        return [];
    }

    function saveMoments(moments) {
        LS.setItem('moments', JSON.stringify(moments));
    }

    function generateMomentConcatContent() {
        const ccm = settings.cardConcatMoment;
        if (!ccm || !ccm.enabled) return null;
        const library = getCardLibrary();
        if (library.length < (ccm.minCards || 3)) return null;
        const count = Math.floor(Math.random() * ((ccm.maxCards || 6) - (ccm.minCards || 3) + 1)) + (ccm.minCards || 3);
        const cards = drawRandomCards(count, library);
        if (cards.length < 2) return null;
        const text = concatCards(cards);
        const hasImage = Math.random() * 100 < (ccm.imgProbability || 50);
        return { text: text, hasImage: hasImage, images: [] };
    }

    function autoPublishMoment() {
        const content = generateMomentConcatContent();
        if (!content || !content.text) return;
        const moments = getMoments();
        const newMoment = {
            id: Date.now(),
            author: 'partner',
            authorName: settings.partnerName || '梦角',
            text: content.text,
            images: content.images || [],
            likes: [],
            comments: [],
            timestamp: Date.now()
        };
        moments.unshift(newMoment);
        saveMoments(moments);
        if (typeof window.showNotification === 'function') {
            window.showNotification(settings.partnerName + '发布了新动态 ✦', 'info');
        }
        if (typeof window.renderMomentList === 'function') {
            window.renderMomentList();
        }
    }

    function startMomentTimer() {
        stopMomentTimer();
        const ccm = settings.cardConcatMoment;
        if (!ccm || !ccm.enabled) return;
        const intervalMs = (ccm.interval || 30) * 60 * 1000;
        momentTimer = setInterval(autoPublishMoment, intervalMs);
    }

    function stopMomentTimer() {
        if (momentTimer) {
            clearInterval(momentTimer);
            momentTimer = null;
        }
    }

    function restartMomentTimer() {
        startMomentTimer();
    }

    /* ===================== 音效播放 ===================== */
    function playSound(type) {
        if (!settings.soundEnabled) return;
        const vol = settings.soundVolume || 0.15;
        const preset = SOUND_PRESETS[type || 'tone_default'];
        if (preset) {
            try { preset(); } catch (e) {}
        }
    }

    /* ===================== 消息渲染 ===================== */
    function renderMessages() {
        const container = $('#chat-container');
        if (!container) return;
        container.innerHTML = '';
        if (messages.length === 0) {
            const empty = $('#empty-state');
            if (empty) empty.style.display = 'flex';
            return;
        }
        const empty = $('#empty-state');
        if (empty) empty.style.display = 'none';

        let lastSender = null;
        messages.forEach((msg, idx) => {
            const el = createMessageElement(msg, idx, lastSender);
            container.appendChild(el);
            lastSender = msg.sender;
        });
        scrollToBottom();
    }

    function createMessageElement(msg, idx, lastSender) {
        const div = document.createElement('div');
        div.className = 'message-wrapper ' + (msg.sender === 'me' ? 'message-wrapper-sent' : 'message-wrapper-received');
        div.dataset.id = msg.id;

        const showAvatar = settings.showAvatars && (settings.alwaysShowAvatar || lastSender !== msg.sender);
        const avatarSize = (settings.avatarSize || 36) + 'px';
        const avatarShape = settings.avatarShape === 'square' ? 
            (settings.avatarCornerRadius || 0) + 'px' : '50%';
        const avatarPos = settings.avatarPosition || 'center';
        let avatarAlign = 'flex-end';
        if (avatarPos === 'top') avatarAlign = 'flex-start';
        if (avatarPos === 'center') avatarAlign = 'center';
        if (avatarPos === 'bottom') avatarAlign = 'flex-end';

        const timeStr = formatTime(msg.timestamp);
        const readReceipt = msg.sender === 'me' && settings.readReceipts ? 
            '<span class="read-receipt"><i class="fas fa-check-double"></i></span>' : '';

        let contentHtml = '';
        if (msg.type === 'text') {
            contentHtml = '<div class="message-text">' + escapeHtml(msg.text) + '</div>';
        } else if (msg.type === 'image') {
            contentHtml = '<div class="message-image"><img src="' + msg.url + '" onclick="window.open(this.src)"></div>';
        } else if (msg.type === 'voice') {
            contentHtml = '<div class="message-voice"><i class="fas fa-play-circle"></i><span class="voice-wave"></span><span class="voice-duration">' + (msg.duration || '0'') + '</span></div>';
        } else if (msg.type === 'poke') {
            contentHtml = '<div class="message-poke"><span class="poke-symbol">' + (msg.sender === 'me' ? settings.pokeSymbol.me : settings.pokeSymbol.partner) + '</span> ' + escapeHtml(msg.text) + '</div>';
        }

        const bubbleClass = 'message ' + (msg.sender === 'me' ? 'message-sent' : 'message-received') + ' bubble-' + (settings.bubbleStyle || 'standard');

        let avatarHtml = '';
        if (showAvatar) {
            const avatarUrl = msg.sender === 'me' ? 
                (LS.getItem('myAvatar') || '') : (LS.getItem('partnerAvatar') || '');
            const avatarIcon = msg.sender === 'me' ? 'fa-user-circle' : 'fa-user';
            avatarHtml = '<div class="message-avatar" style="width:' + avatarSize + ';height:' + avatarSize + ';border-radius:' + avatarShape + ';align-self:' + avatarAlign + ';">' +
                (avatarUrl ? '<img src="' + avatarUrl + '">' : '<i class="fas ' + avatarIcon + '"></i>') +
                '</div>';
        }

        const innerHtml = msg.sender === 'me' ? 
            (avatarHtml + '<div class="message-content"><div class="message-bubble-row"><div class="' + bubbleClass + '">' + contentHtml + '</div></div><div class="message-meta">' + (timeStr ? '<span class="message-time">' + timeStr + '</span>' : '') + readReceipt + '</div></div>') :
            ('<div class="message-content"><div class="message-bubble-row"><div class="' + bubbleClass + '">' + contentHtml + '</div></div><div class="message-meta">' + (timeStr ? '<span class="message-time">' + timeStr + '</span>' : '') + '</div></div>' + avatarHtml);

        div.innerHTML = innerHtml;

        // 右键菜单
        div.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            showMessageContextMenu(e, msg, div);
        });

        // 长按菜单 (移动端)
        let longPressTimer;
        div.addEventListener('touchstart', (e) => {
            longPressTimer = setTimeout(() => {
                showMessageContextMenu(e.touches[0], msg, div);
            }, 600);
        });
        div.addEventListener('touchend', () => clearTimeout(longPressTimer));
        div.addEventListener('touchmove', () => clearTimeout(longPressTimer));

        return div;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function scrollToBottom() {
        const container = $('#chat-container');
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }

    /* ===================== 消息上下文菜单 ===================== */
    function showMessageContextMenu(e, msg, el) {
        // 移除旧菜单
        const old = $('.message-context-menu');
        if (old) old.remove();

        const menu = document.createElement('div');
        menu.className = 'message-context-menu';
        menu.style.cssText = 'position:fixed;z-index:9999;background:var(--secondary-bg);border:1px solid var(--border-color);border-radius:12px;padding:6px 0;box-shadow:0 8px 32px rgba(0,0,0,0.2);min-width:140px;';

        const items = [];
        items.push({ icon: 'fa-reply', text: '回复', action: () => replyToMessage(msg) });
        items.push({ icon: 'fa-copy', text: '复制', action: () => copyMessage(msg) });
        items.push({ icon: 'fa-star', text: '收藏', action: () => favoriteMessage(msg) });
        if (msg.type === 'text') {
            items.push({ icon: 'fa-sticky-note', text: '注释', action: () => annotateMessage(msg) });
        }
        items.push({ icon: 'fa-trash', text: '删除', action: () => deleteMessage(msg.id) });

        items.forEach(item => {
            const row = document.createElement('div');
            row.style.cssText = 'padding:8px 16px;cursor:pointer;font-size:13px;color:var(--text-primary);display:flex;align-items:center;gap:8px;transition:background 0.15s;';
            row.innerHTML = '<i class="fas ' + item.icon + '" style="width:16px;color:var(--accent-color);font-size:12px;"></i>' + item.text;
            row.addEventListener('mouseenter', () => row.style.background = 'rgba(var(--accent-color-rgb),0.08)');
            row.addEventListener('mouseleave', () => row.style.background = 'transparent');
            row.addEventListener('click', () => { menu.remove(); item.action(); });
            menu.appendChild(row);
        });

        document.body.appendChild(menu);
        const rect = menu.getBoundingClientRect();
        let x = e.clientX || e.pageX;
        let y = e.clientY || e.pageY;
        if (x + rect.width > window.innerWidth) x = window.innerWidth - rect.width - 10;
        if (y + rect.height > window.innerHeight) y = window.innerHeight - rect.height - 10;
        menu.style.left = x + 'px';
        menu.style.top = y + 'px';

        setTimeout(() => {
            document.addEventListener('click', function closeMenu() {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }, { once: true });
        }, 10);
    }

    function replyToMessage(msg) {
        const preview = $('#reply-preview-container');
        if (!preview) return;
        preview.innerHTML = '<div class="reply-preview"><span class="reply-preview-label">回复 ' + (msg.sender === 'me' ? settings.myName : settings.partnerName) + '</span><span class="reply-preview-text">' + escapeHtml(msg.text || '[图片]') + '</span><button class="reply-preview-close" onclick="this.parentElement.remove()">×</button></div>';
        preview.dataset.replyTo = msg.id;
        $('#message-input')?.focus();
    }

    function copyMessage(msg) {
        if (msg.text) {
            navigator.clipboard.writeText(msg.text).then(() => {
                if (typeof window.showNotification === 'function') {
                    window.showNotification('已复制到剪贴板', 'success');
                }
            });
        }
    }

    function favoriteMessage(msg) {
        let favorites = [];
        try { favorites = JSON.parse(LS.getItem('favorites') || '[]'); } catch (e) {}
        favorites.push({ ...msg, favoritedAt: Date.now() });
        LS.setItem('favorites', JSON.stringify(favorites));
        if (typeof window.showNotification === 'function') {
            window.showNotification('已收藏 ✦', 'success');
        }
    }

    function annotateMessage(msg) {
        const noteModal = $('#note-modal');
        const noteInput = $('#note-input');
        if (!noteModal || !noteInput) return;
        noteInput.value = msg.note || '';
        noteModal.dataset.targetId = msg.id;
        if (typeof window.showModal === 'function') window.showModal(noteModal, noteInput);
    }

    function deleteMessage(id) {
        const idx = messages.findIndex(m => m.id === id);
        if (idx > -1) {
            messages.splice(idx, 1);
            saveMessages();
            renderMessages();
        }
    }

    /* ===================== 发送消息 ===================== */
    function sendMessage(text, type, extra) {
        type = type || 'text';
        const msg = {
            id: generateId(),
            sender: 'me',
            type: type,
            text: text,
            timestamp: Date.now(),
            ...extra
        };
        if ($('#reply-preview-container')?.dataset.replyTo) {
            msg.replyTo = $('#reply-preview-container').dataset.replyTo;
            $('#reply-preview-container').innerHTML = '';
            delete $('#reply-preview-container').dataset.replyTo;
        }
        messages.push(msg);
        saveMessages();
        renderMessages();
        playSound('tone_default');

        // 触发对方回复
        if (type === 'text' && settings.replyEnabled) {
            triggerPartnerReply();
        }
    }

    function sendImage(url) {
        sendMessage(null, 'image', { url: url });
    }

    /* ===================== 对方回复逻辑 ===================== */
    function triggerPartnerReply() {
        if (isTyping) return;
        const delay = Math.floor(Math.random() * (settings.replyDelayMax - settings.replyDelayMin + 1)) + settings.replyDelayMin;
        isTyping = true;
        showTypingIndicator(true);

        setTimeout(() => {
            showTypingIndicator(false);
            isTyping = false;

            let replyText = generateConcatMessage();
            if (!replyText) {
                // 回退到普通随机字卡
                const library = getCardLibrary();
                if (library.length > 0) {
                    const card = library[Math.floor(Math.random() * library.length)];
                    replyText = typeof card === 'string' ? card : (card.text || card.content || '');
                }
            }

            if (replyText) {
                const msg = {
                    id: generateId(),
                    sender: 'partner',
                    type: 'text',
                    text: replyText,
                    timestamp: Date.now()
                };
                messages.push(msg);
                saveMessages();
                renderMessages();
                playSound('tone_soft');

                // 已读不回处理
                if (settings.readNoReply) {
                    markAllAsRead();
                }
            }
        }, delay);
    }

    /* ===================== 打字指示器 ===================== */
    function showTypingIndicator(show) {
        const indicator = $('#typing-indicator-wrapper');
        if (!indicator) return;
        indicator.style.display = show ? 'flex' : 'none';
        if (show) {
            const label = $('#typing-indicator-label');
            if (label) label.textContent = settings.partnerName + ' 正在输入';
        }
    }

    /* ===================== 已读回执 ===================== */
    function markAllAsRead() {
        const unread = messages.filter(m => m.sender === 'me' && !m.read);
        unread.forEach(m => m.read = true);
        if (unread.length > 0) {
            saveMessages();
            renderMessages();
        }
    }

    /* ===================== 主动发送 ===================== */
    function startAutoSend() {
        stopAutoSend();
        if (!settings.autoSend) return;
        const interval = (settings.autoSendInterval || 5) * 60 * 1000;
        autoSendTimer = setInterval(() => {
            if (document.hidden) return; // 页面不可见时不发送
            triggerPartnerReply();
        }, interval);
    }

    function stopAutoSend() {
        if (autoSendTimer) {
            clearInterval(autoSendTimer);
            autoSendTimer = null;
        }
    }

    /* ===================== 后台保活 ===================== */
    function startKeepalive() {
        if (keepaliveOsc) return;
        try {
            const ctx = ensureAudioCtx();
            keepaliveOsc = ctx.createOscillator();
            const gain = ctx.createGain();
            keepaliveOsc.frequency.setValueAtTime(1, ctx.currentTime);
            gain.gain.setValueAtTime(0.001, ctx.currentTime);
            keepaliveOsc.connect(gain);
            gain.connect(ctx.destination);
            keepaliveOsc.start();
        } catch (e) {}
    }

    function stopKeepalive() {
        if (keepaliveOsc) {
            try { keepaliveOsc.stop(); } catch (e) {}
            keepaliveOsc = null;
        }
    }

    /* ===================== 拍一拍 ===================== */
    function sendPoke(action) {
        const text = (settings.myName || '我') + ' ' + (action || '拍了拍') + ' ' + (settings.partnerName || '梦角');
        sendMessage(text, 'poke');
        playSound('tone_warm');
    }

    /* ===================== 批量发送 ===================== */
    let batchMode = false;
    let batchQueue = [];

    function toggleBatchMode() {
        batchMode = !batchMode;
        const btn = $('#batch-btn');
        if (btn) {
            btn.classList.toggle('active', batchMode);
            btn.style.color = batchMode ? 'var(--accent-color)' : '';
        }
        const preview = $('#batch-preview');
        if (preview) preview.style.display = batchMode ? 'block' : 'none';
        if (!batchMode && batchQueue.length > 0) {
            flushBatchQueue();
        }
    }

    function addToBatch(text) {
        if (!batchMode) return false;
        batchQueue.push(text);
        updateBatchPreview();
        return true;
    }

    function updateBatchPreview() {
        const preview = $('#batch-preview');
        if (!preview) return;
        preview.innerHTML = batchQueue.map((t, i) => '<span class="batch-item">' + (i + 1) + '. ' + escapeHtml(t) + '</span>').join('');
    }

    function flushBatchQueue() {
        batchQueue.forEach((text, i) => {
            setTimeout(() => sendMessage(text), i * 800);
        });
        batchQueue = [];
        updateBatchPreview();
    }

    /* ===================== UI 更新 ===================== */
    function updateUI() {
        // 昵称
        const partnerNameEl = $('#partner-name');
        if (partnerNameEl) partnerNameEl.textContent = settings.partnerName;
        const myNameEl = $('#my-name');
        if (myNameEl) myNameEl.textContent = settings.myName;

        // 字体大小
        document.documentElement.style.setProperty('--chat-font-size', (settings.fontSize || 16) + 'px');

        // 头像尺寸
        document.documentElement.style.setProperty('--in-chat-avatar-size', (settings.avatarSize || 36) + 'px');

        // 沉浸式模式
        document.body.classList.toggle('immersive-mode', settings.immersiveMode);
        const exitBtn = $('#immersive-exit-btn');
        if (exitBtn) exitBtn.style.display = settings.immersiveMode ? 'flex' : 'none';

        // 底部收纳
        document.body.classList.toggle('bottom-collapsed', settings.bottomCollapse);

        // 顶部栏透明度
        document.body.classList.toggle('header-opacity-hover', !settings.headerOpacityAlways);

        // 气泡样式
        document.body.dataset.bubbleStyle = settings.bubbleStyle || 'standard';
    }

    /* ===================== 初始化 ===================== */
    function init() {
        loadSettings();
        loadMessages();
        renderMessages();
        updateUI();
        startAutoSend();
        startMomentTimer();

        // 监听页面可见性
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                markAllAsRead();
            }
        });

        // 监听设置变化
        window.addEventListener('storage', (e) => {
            if (e.key === 'settings') {
                loadSettings();
                updateUI();
                startAutoSend();
                startMomentTimer();
            }
            if (e.key && e.key.startsWith('messages_')) {
                loadMessages();
                renderMessages();
            }
        });
    }

    /* ===================== 暴露到全局 ===================== */
    window.Core = {
        init,
        settings,
        messages,
        sendMessage,
        sendImage,
        sendPoke,
        toggleBatchMode,
        addToBatch,
        flushBatchQueue,
        renderMessages,
        updateUI,
        loadSettings,
        saveSettings,
        generateConcatMessage,
        getMoments,
        saveMoments,
        autoPublishMoment,
        startMomentTimer,
        stopMomentTimer,
        restartMomentTimer,
        playSound,
        formatTime,
        getCardLibrary,
        markAllAsRead,
        deleteMessage,
        favoriteMessage,
        annotateMessage,
        replyToMessage,
        currentSessionId,
        DEFAULT_CONFIG
    };

    // 兼容旧代码的快捷引用
    window.settings = settings;
    window.messages = messages;
    window.sendMessage = sendMessage;
    window.sendImage = sendImage;
    window.renderMessages = renderMessages;
    window.updateUI = updateUI;
    window.loadSettings = loadSettings;
    window.saveSettings = saveSettings;
    window.generateConcatMessage = generateConcatMessage;
    window.getMoments = getMoments;
    window.saveMoments = saveMoments;
    window.autoPublishMoment = autoPublishMoment;
    window.startMomentTimer = startMomentTimer;
    window.stopMomentTimer = stopMomentTimer;
    window.restartMomentTimer = restartMomentTimer;
    window.playSound = playSound;
    window.formatTime = formatTime;
    window.getCardLibrary = getCardLibrary;
    window.markAllAsRead = markAllAsRead;
    window.deleteMessage = deleteMessage;
    window.favoriteMessage = favoriteMessage;
    window.annotateMessage = annotateMessage;
    window.replyToMessage = replyToMessage;
    window.sendPoke = sendPoke;
    window.toggleBatchMode = toggleBatchMode;
    window.addToBatch = addToBatch;
    window.flushBatchQueue = flushBatchQueue;

})(window);
