/**
 * ============================================================
 * 信封投递模块 (Envelope Module)
 * ============================================================
 * 功能：寄信、收信、时空来信、信件管理
 * 包含：
 *   - 寄出的信 / 收到的信 / 时空来信 三个标签页
 *   - 写信与发送
 *   - 信件详情查看与回复
 *   - 自动回信（时空来信）
 *   - 信件导入导出
 *   - 本地存储持久化
 * ============================================================
 */

(function() {
    'use strict';

    // ==================== 配置与常量 ====================
    const ENV_STORAGE_KEY = 'envelopeData';
    const ENV_SETTINGS_KEY = 'envelopeSettings';
    const ENV_AUTO_REPLY_KEY = 'envelopeAutoReply';

    // 时空来信默认回复库（内置）
    const DEFAULT_TIME_LETTER_REPLIES = [
        "收到你的信了，我也一直在想你。",
        "纸短情长，心意已收到。",
        "你的文字让我今天的心情变得很好。",
        "我也在远方牵挂着你。",
        "每一封信都是一次心灵的触碰，谢谢你。",
        "时光流转，但这份心意我会好好珍藏。",
        "读着你的信，仿佛你就在身边。",
        "愿这封信能带给你温暖和力量。",
        "你的话语像春风一样温柔。",
        "无论相隔多远，心始终在一起。",
        "这封信我反复读了好几遍。",
        "期待下一次收到你的消息。",
        "你的信是我今天最好的礼物。",
        "字里行间，都是满满的心意呢。",
        "我也正想给你写点什么，心有灵犀。",
        "收到信的那一刻，嘴角不自觉上扬了。",
        "愿我们的故事，像这些信件一样绵长。",
        "每一封信都是时光胶囊，珍藏着美好。",
        "谢谢你愿意分享你的心情给我。",
        "我会把这份心意，好好收藏在心底。"
    ];

    // 信件模板（用于时空来信）
    const TIME_LETTER_TEMPLATES = [
        { greeting: "见信如晤", sign: "思念你的" },
        { greeting: "展信安", sign: "牵挂你的" },
        { greeting: "亲启", sign: "远方的" },
        { greeting: "你好呀", sign: "一直陪着你的" },
        { greeting: "又给你写信了", sign: "爱你的" }
    ];

    // ==================== 状态管理 ====================
    let envelopeData = {
        outbox: [],      // 寄出的信
        inbox: [],       // 收到的信
        timeLetters: [], // 时空来信
        lastReplyTime: 0 // 上次自动回信时间
    };

    let envelopeSettings = {
        autoReplyEnabled: true,      // 是否开启自动回信
        autoReplyDelay: 5,           // 自动回信延迟（分钟）
        timeLetterEnabled: true,     // 是否开启时空来信
        timeLetterInterval: 30,      // 时空来信间隔（分钟）
        showNotification: true,      // 新信通知
        customReplies: []            // 自定义回信库
    };

    let autoReplyTimer = null;
    let timeLetterTimer = null;
    let currentViewingLetter = null; // 当前查看的信件
    let isComposing = false;         // 是否正在写信

    // ==================== 初始化 ====================
    function initEnvelope() {
        loadEnvelopeData();
        loadEnvelopeSettings();
        initEventListeners();
        startAutoReplyTimer();
        startTimeLetterTimer();
        console.log('[Envelope] 信封模块初始化完成');
    }

    // ==================== 数据持久化 ====================
    function loadEnvelopeData() {
        try {
            const saved = localStorage.getItem(ENV_STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                envelopeData.outbox = parsed.outbox || [];
                envelopeData.inbox = parsed.inbox || [];
                envelopeData.timeLetters = parsed.timeLetters || [];
                envelopeData.lastReplyTime = parsed.lastReplyTime || 0;
            }
        } catch (e) {
            console.warn('[Envelope] 加载数据失败:', e);
        }
    }

    function saveEnvelopeData() {
        try {
            localStorage.setItem(ENV_STORAGE_KEY, JSON.stringify(envelopeData));
        } catch (e) {
            console.warn('[Envelope] 保存数据失败:', e);
        }
    }

    function loadEnvelopeSettings() {
        try {
            const saved = localStorage.getItem(ENV_SETTINGS_KEY);
            if (saved) {
                envelopeSettings = { ...envelopeSettings, ...JSON.parse(saved) };
            }
        } catch (e) {
            console.warn('[Envelope] 加载设置失败:', e);
        }
    }

    function saveEnvelopeSettings() {
        try {
            localStorage.setItem(ENV_SETTINGS_KEY, JSON.stringify(envelopeSettings));
        } catch (e) {
            console.warn('[Envelope] 保存设置失败:', e);
        }
    }

    // ==================== 事件监听 ====================
    function initEventListeners() {
        // 关闭信封弹窗
        const cancelBtn = document.getElementById('cancel-envelope');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', closeEnvelopeModal);
        }

        // 发送信件
        const sendBtn = document.getElementById('send-envelope');
        if (sendBtn) {
            sendBtn.addEventListener('click', sendEnvelope);
        }

        // 取消写信
        const cancelComposeBtn = document.getElementById('cancel-compose');
        if (cancelComposeBtn) {
            cancelComposeBtn.addEventListener('click', cancelEnvelopeCompose);
        }

        // 监听设置变化（从其他模块）
        window.addEventListener('envelopeSettingsChanged', function(e) {
            if (e.detail) {
                envelopeSettings = { ...envelopeSettings, ...e.detail };
                saveEnvelopeSettings();
                restartTimers();
            }
        });
    }

    // ==================== 标签切换 ====================
    window.switchEnvTab = function(tabName) {
        // 更新标签按钮状态
        document.querySelectorAll('.env-tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        const tabBtn = document.getElementById('env-tab-' + tabName);
        if (tabBtn) tabBtn.classList.add('active');

        // 隐藏所有内容区
        const outboxSection = document.getElementById('env-outbox-section');
        const inboxSection = document.getElementById('env-inbox-section');
        const timeSection = document.getElementById('env-time-section');
        const composeForm = document.getElementById('env-compose-form');

        if (outboxSection) outboxSection.style.display = 'none';
        if (inboxSection) inboxSection.style.display = 'none';
        if (timeSection) timeSection.style.display = 'none';
        if (composeForm) composeForm.style.display = 'none';

        // 显示对应内容
        isComposing = false;
        if (tabName === 'outbox') {
            if (outboxSection) outboxSection.style.display = 'block';
            renderOutboxList();
        } else if (tabName === 'inbox') {
            if (inboxSection) inboxSection.style.display = 'block';
            renderInboxList();
            // 标记所有收件为已读
            markInboxAsRead();
        } else if (tabName === 'time') {
            if (timeSection) timeSection.style.display = 'block';
            renderTimeLetterList();
            markTimeLettersAsRead();
        }

        // 更新底部按钮
        updateBottomButtons(tabName);
    };

    function updateBottomButtons(tabName) {
        const sendArea = document.getElementById('env-main-close-btn');
        if (!sendArea) return;

        if (tabName === 'compose') {
            sendArea.style.display = 'none';
        } else {
            sendArea.style.display = 'flex';
            const writeBtn = document.getElementById('new-envelope-btn');
            if (writeBtn) {
                writeBtn.style.display = tabName === 'outbox' ? 'flex' : 'none';
            }
        }
    }

    // ==================== 写信功能 ====================
    window.openNewEnvelopeForm = function() {
        isComposing = true;

        // 隐藏列表区域
        const outboxSection = document.getElementById('env-outbox-section');
        const inboxSection = document.getElementById('env-inbox-section');
        const timeSection = document.getElementById('env-time-section');

        if (outboxSection) outboxSection.style.display = 'none';
        if (inboxSection) inboxSection.style.display = 'none';
        if (timeSection) timeSection.style.display = 'none';

        // 显示写信表单
        const composeForm = document.getElementById('env-compose-form');
        if (composeForm) {
            composeForm.style.display = 'block';
            composeForm.style.animation = 'fadeInUp 0.3s ease';
        }

        // 清空输入
        const input = document.getElementById('envelope-input');
        if (input) {
            input.value = '';
            input.focus();
        }

        // 重置"同时发送到聊天记录"
        const sendToChat = document.getElementById('env-send-to-chat');
        if (sendToChat) sendToChat.checked = false;

        // 更新底部按钮
        updateBottomButtons('compose');

        // 更新标题
        const composeTitle = document.getElementById('env-compose-title');
        if (composeTitle) composeTitle.textContent = '写一封信';

        // 更新回复信息
        const replyInfo = document.getElementById('env-reply-time-info');
        if (replyInfo) {
            const partnerName = (typeof settings !== 'undefined' && settings.partnerName) ? settings.partnerName : '梦角';
            replyInfo.textContent = '寄出后，' + partnerName + '会在 ' + envelopeSettings.autoReplyDelay + ' 分钟左右回信';
        }
    };

    window.cancelEnvelopeCompose = function() {
        isComposing = false;
        const composeForm = document.getElementById('env-compose-form');
        if (composeForm) composeForm.style.display = 'none';

        // 返回寄出的信标签
        switchEnvTab('outbox');
    };

    function sendEnvelope() {
        const input = document.getElementById('envelope-input');
        if (!input) return;

        const content = input.value.trim();
        if (!content) {
            showNotification('请先写点什么吧 ✦', 'warning');
            return;
        }

        const partnerName = (typeof settings !== 'undefined' && settings.partnerName) ? settings.partnerName : '梦角';
        const myName = (typeof settings !== 'undefined' && settings.myName) ? settings.myName : '我';

        // 创建信件对象
        const letter = {
            id: Date.now(),
            content: content,
            timestamp: Date.now(),
            from: myName,
            to: partnerName,
            isRead: true,
            hasReply: false,
            replyContent: null,
            replyTimestamp: null,
            type: 'normal'
        };

        // 添加到寄件箱
        envelopeData.outbox.unshift(letter);
        saveEnvelopeData();

        // 检查是否需要同时发送到聊天记录
        const sendToChat = document.getElementById('env-send-to-chat');
        if (sendToChat && sendToChat.checked) {
            sendLetterToChat(content);
        }

        // 显示成功提示
        showNotification('信件已寄出 ✦', 'success');

        // 触发自动回信（如果开启）
        if (envelopeSettings.autoReplyEnabled) {
            scheduleAutoReply(letter.id);
        }

        // 返回列表
        cancelEnvelopeCompose();
        renderOutboxList();
        updateBadges();
    }

    function sendLetterToChat(content) {
        // 将信件内容发送到聊天窗口
        if (typeof addMessage === 'function') {
            addMessage(content, 'sent');
        }

        // 添加特殊标记
        const partnerName = (typeof settings !== 'undefined' && settings.partnerName) ? settings.partnerName : '梦角';
        const letterNotice = `[信件] 已寄给 ${partnerName}`;

        if (typeof addSystemMessage === 'function') {
            addSystemMessage(letterNotice);
        }
    }

    // ==================== 自动回信 ====================
    function scheduleAutoReply(letterId) {
        const delay = envelopeSettings.autoReplyDelay * 60 * 1000;
        // 添加一些随机性 (±30%)
        const randomDelay = delay * (0.7 + Math.random() * 0.6);

        setTimeout(() => {
            generateAutoReply(letterId);
        }, randomDelay);
    }

    function generateAutoReply(letterId) {
        const partnerName = (typeof settings !== 'undefined' && settings.partnerName) ? settings.partnerName : '梦角';

        // 获取回复内容
        let replyContent;
        const customReplies = envelopeSettings.customReplies || [];
        const allReplies = customReplies.length > 0
            ? customReplies
            : DEFAULT_TIME_LETTER_REPLIES;

        replyContent = allReplies[Math.floor(Math.random() * allReplies.length)];

        // 创建回信
        const replyLetter = {
            id: Date.now(),
            content: replyContent,
            timestamp: Date.now(),
            from: partnerName,
            to: '我',
            isRead: false,
            isReply: true,
            replyTo: letterId,
            type: 'normal'
        };

        // 添加到收件箱
        envelopeData.inbox.unshift(replyLetter);

        // 更新原信件状态
        const originalLetter = envelopeData.outbox.find(l => l.id === letterId);
        if (originalLetter) {
            originalLetter.hasReply = true;
            originalLetter.replyContent = replyContent;
            originalLetter.replyTimestamp = Date.now();
        }

        saveEnvelopeData();

        // 显示通知
        if (envelopeSettings.showNotification) {
            showNotification(`收到 ${partnerName} 的回信 ✦`, 'info');
        }

        // 更新UI
        updateBadges();

        // 如果当前在收件箱页面，刷新列表
        const inboxSection = document.getElementById('env-inbox-section');
        if (inboxSection && inboxSection.style.display !== 'none') {
            renderInboxList();
        }

        // 触发事件
        window.dispatchEvent(new CustomEvent('newEnvelopeReceived', {
            detail: { letter: replyLetter }
        }));
    }

    // ==================== 时空来信 ====================
    function startTimeLetterTimer() {
        if (!envelopeSettings.timeLetterEnabled) return;

        // 检查是否需要立即发送一封
        const now = Date.now();
        const interval = envelopeSettings.timeLetterInterval * 60 * 1000;
        const lastTimeLetter = envelopeData.timeLetters[0];

        if (!lastTimeLetter || (now - lastTimeLetter.timestamp > interval)) {
            // 可以发送，但延迟一下避免初始化时立即发送
            setTimeout(() => {
                if (Math.random() < 0.3) { // 30%概率立即发送
                    generateTimeLetter();
                }
            }, 60000);
        }

        // 设置定时器
        timeLetterTimer = setInterval(() => {
            if (envelopeSettings.timeLetterEnabled && Math.random() < 0.5) {
                generateTimeLetter();
            }
        }, interval);
    }

    function generateTimeLetter() {
        const partnerName = (typeof settings !== 'undefined' && settings.partnerName) ? settings.partnerName : '梦角';

        // 选择模板
        const template = TIME_LETTER_TEMPLATES[Math.floor(Math.random() * TIME_LETTER_TEMPLATES.length)];

        // 生成内容
        const replies = envelopeSettings.customReplies.length > 0
            ? envelopeSettings.customReplies
            : DEFAULT_TIME_LETTER_REPLIES;
        const content = replies[Math.floor(Math.random() * replies.length)];

        // 构建完整信件
        const fullContent = `${template.greeting}，\n\n${content}\n\n${template.sign}\n${partnerName}`;

        const timeLetter = {
            id: Date.now(),
            content: fullContent,
            timestamp: Date.now(),
            from: partnerName,
            to: '我',
            isRead: false,
            type: 'time',
            template: template
        };

        envelopeData.timeLetters.unshift(timeLetter);
        saveEnvelopeData();

        // 通知
        if (envelopeSettings.showNotification) {
            showNotification(`收到来自 ${partnerName} 的时空来信 ✦`, 'info');
        }

        updateBadges();
    }

    // ==================== 渲染列表 ====================
    function renderOutboxList() {
        const container = document.getElementById('env-outbox-list');
        if (!container) return;

        if (envelopeData.outbox.length === 0) {
            container.innerHTML = renderEmptyState('还没有寄出的信', '提笔写一封信吧');
            return;
        }

        container.innerHTML = envelopeData.outbox.map(letter => renderLetterItem(letter, 'outbox')).join('');
    }

    function renderInboxList() {
        const container = document.getElementById('env-inbox-list');
        if (!container) return;

        if (envelopeData.inbox.length === 0) {
            container.innerHTML = renderEmptyState('还没有收到的信', '寄一封信，等待回信吧');
            return;
        }

        container.innerHTML = envelopeData.inbox.map(letter => renderLetterItem(letter, 'inbox')).join('');
    }

    function renderTimeLetterList() {
        const container = document.getElementById('env-time-list');
        if (!container) {
            // 如果没有时空来信容器，创建一个
            createTimeLetterSection();
            return;
        }

        if (envelopeData.timeLetters.length === 0) {
            container.innerHTML = renderEmptyState('还没有时空来信', '开启后，对方会随机给你写信');
            return;
        }

        container.innerHTML = envelopeData.timeLetters.map(letter => renderLetterItem(letter, 'time')).join('');
    }

    function createTimeLetterSection() {
        const envBody = document.querySelector('.env-body');
        if (!envBody) return;

        // 创建时空来信内容区
        const timeSection = document.createElement('div');
        timeSection.id = 'env-time-section';
        timeSection.style.display = 'none';
        timeSection.innerHTML = '<div id="env-time-list"></div>';

        // 插入到收件箱之后
        const inboxSection = document.getElementById('env-inbox-section');
        if (inboxSection) {
            inboxSection.after(timeSection);
        }

        // 添加时空来信标签
        const tabBar = document.querySelector('.env-tab-bar');
        if (tabBar) {
            const timeTab = document.createElement('button');
            timeTab.className = 'env-tab-btn';
            timeTab.id = 'env-tab-time';
            timeTab.onclick = function() { switchEnvTab('time'); };
            timeTab.innerHTML = `
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-1px;margin-right:4px;">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                </svg>时空来信
                <span id="env-time-badge" class="env-badge" style="display:none;"></span>
            `;
            tabBar.appendChild(timeTab);
        }

        renderTimeLetterList();
    }

    function renderLetterItem(letter, type) {
        const date = new Date(letter.timestamp);
        const dateStr = formatLetterDate(date);
        const isUnread = !letter.isRead;
        const partnerName = (typeof settings !== 'undefined' && settings.partnerName) ? settings.partnerName : '梦角';

        let preview = letter.content;
        if (preview.length > 60) {
            preview = preview.substring(0, 60) + '...';
        }
        // 去除换行显示
        preview = preview.replace(/\n/g, ' ');

        let icon, title, badge;
        if (type === 'outbox') {
            icon = 'fa-paper-plane';
            title = '寄给 ' + letter.to;
            badge = letter.hasReply ? '<span class="env-reply-badge">已回信</span>' : '';
        } else if (type === 'inbox') {
            icon = 'fa-envelope';
            title = letter.from;
            badge = isUnread ? '<span class="env-unread-badge">新</span>' : '';
        } else {
            icon = 'fa-clock';
            title = '时空来信';
            badge = isUnread ? '<span class="env-unread-badge">新</span>' : '';
        }

        return `
            <div class="env-letter-item ${isUnread ? 'unread' : ''}" data-id="${letter.id}" data-type="${type}" onclick="openLetterDetail(${letter.id}, '${type}')">
                <div class="env-letter-icon">
                    <i class="fas ${icon}"></i>
                </div>
                <div class="env-letter-info">
                    <div class="env-letter-header">
                        <span class="env-letter-title">${title}</span>
                        <span class="env-letter-date">${dateStr}</span>
                    </div>
                    <div class="env-letter-preview">${preview}</div>
                    <div class="env-letter-badges">${badge}</div>
                </div>
                <div class="env-letter-arrow">
                    <i class="fas fa-chevron-right"></i>
                </div>
            </div>
        `;
    }

    function renderEmptyState(title, subtitle) {
        return `
            <div class="env-empty-state">
                <i class="fas fa-envelope-open"></i>
                <p class="env-empty-title">${title}</p>
                <p class="env-empty-subtitle">${subtitle}</p>
            </div>
        `;
    }

    function formatLetterDate(date) {
        const now = new Date();
        const diff = now - date;
        const day = 24 * 60 * 60 * 1000;

        if (diff < day && now.getDate() === date.getDate()) {
            return date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');
        } else if (diff < 2 * day) {
            return '昨天';
        } else if (diff < 7 * day) {
            const days = ['日', '一', '二', '三', '四', '五', '六'];
            return '周' + days[date.getDay()];
        } else {
            return (date.getMonth() + 1) + '/' + date.getDate();
        }
    }

    // ==================== 信件详情 ====================
    window.openLetterDetail = function(letterId, type) {
        let letter;
        if (type === 'outbox') {
            letter = envelopeData.outbox.find(l => l.id === letterId);
        } else if (type === 'inbox') {
            letter = envelopeData.inbox.find(l => l.id === letterId);
        } else {
            letter = envelopeData.timeLetters.find(l => l.id === letterId);
        }

        if (!letter) return;
        currentViewingLetter = letter;

        // 标记为已读
        if (!letter.isRead) {
            letter.isRead = true;
            saveEnvelopeData();
            updateBadges();
        }

        // 构建详情HTML
        const partnerName = (typeof settings !== 'undefined' && settings.partnerName) ? settings.partnerName : '梦角';
        const myName = (typeof settings !== 'undefined' && settings.myName) ? settings.myName : '我';

        const date = new Date(letter.timestamp);
        const dateStr = date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日 ' +
            date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');

        let detailHTML = `
            <div class="env-detail-overlay" id="env-detail-overlay" onclick="closeLetterDetail(event)">
                <div class="env-detail-card" onclick="event.stopPropagation()">
                    <div class="env-detail-header">
                        <button class="env-detail-back" onclick="closeLetterDetail()">
                            <i class="fas fa-arrow-left"></i>
                        </button>
                        <span class="env-detail-title">信件详情</span>
                        <button class="env-detail-delete" onclick="deleteLetter(${letterId}, '${type}')" title="删除">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                    <div class="env-detail-meta">
                        <div class="env-detail-from">
                            <span class="env-detail-label">寄件人：</span>
                            <span class="env-detail-value">${letter.from}</span>
                        </div>
                        <div class="env-detail-to">
                            <span class="env-detail-label">收件人：</span>
                            <span class="env-detail-value">${letter.to}</span>
                        </div>
                        <div class="env-detail-time">
                            <span class="env-detail-label">时间：</span>
                            <span class="env-detail-value">${dateStr}</span>
                        </div>
                    </div>
                    <div class="env-detail-content">
                        ${formatLetterContent(letter.content)}
                    </div>
        `;

        // 如果是寄出的信且有回信，显示回信
        if (type === 'outbox' && letter.hasReply && letter.replyContent) {
            const replyDate = new Date(letter.replyTimestamp);
            const replyDateStr = replyDate.getFullYear() + '年' + (replyDate.getMonth() + 1) + '月' + replyDate.getDate() + '日 ' +
                replyDate.getHours().toString().padStart(2, '0') + ':' + replyDate.getMinutes().toString().padStart(2, '0');

            detailHTML += `
                <div class="env-detail-reply-section">
                    <div class="env-detail-reply-header">
                        <i class="fas fa-reply"></i>
                        <span>${partnerName} 的回信</span>
                        <span class="env-detail-reply-time">${replyDateStr}</span>
                    </div>
                    <div class="env-detail-reply-content">
                        ${letter.replyContent}
                    </div>
                </div>
            `;
        }

        // 如果是收到的信，显示回复按钮
        if (type === 'inbox' || type === 'time') {
            detailHTML += `
                <div class="env-detail-actions">
                    <button class="modal-btn modal-btn-primary" onclick="replyToLetter(${letterId}, '${type}')">
                        <i class="fas fa-reply"></i> 写回信
                    </button>
                </div>
            `;
        }

        detailHTML += `
                </div>
            </div>
        `;

        // 插入到body
        const existing = document.getElementById('env-detail-overlay');
        if (existing) existing.remove();

        const div = document.createElement('div');
        div.innerHTML = detailHTML;
        document.body.appendChild(div.firstElementChild);

        // 刷新列表
        if (type === 'outbox') renderOutboxList();
        else if (type === 'inbox') renderInboxList();
        else renderTimeLetterList();
    };

    window.closeLetterDetail = function(event) {
        if (event && event.target !== event.currentTarget) return;
        const overlay = document.getElementById('env-detail-overlay');
        if (overlay) {
            overlay.style.animation = 'fadeOut 0.2s ease';
            setTimeout(() => overlay.remove(), 200);
        }
        currentViewingLetter = null;
    };

    function formatLetterContent(content) {
        // 将换行符转换为<br>
        return content.replace(/\n/g, '<br>').replace(/\n/g, '<br>');
    }

    // ==================== 删除信件 ====================
    window.deleteLetter = function(letterId, type) {
        if (!confirm('确定要删除这封信吗？')) return;

        if (type === 'outbox') {
            envelopeData.outbox = envelopeData.outbox.filter(l => l.id !== letterId);
        } else if (type === 'inbox') {
            envelopeData.inbox = envelopeData.inbox.filter(l => l.id !== letterId);
        } else {
            envelopeData.timeLetters = envelopeData.timeLetters.filter(l => l.id !== letterId);
        }

        saveEnvelopeData();
        closeLetterDetail();

        // 刷新对应列表
        if (type === 'outbox') renderOutboxList();
        else if (type === 'inbox') renderInboxList();
        else renderTimeLetterList();

        updateBadges();
        showNotification('信件已删除', 'success');
    };

    // ==================== 回信功能 ====================
    window.replyToLetter = function(letterId, type) {
        closeLetterDetail();

        // 打开写信表单，预填充
        openNewEnvelopeForm();

        const composeTitle = document.getElementById('env-compose-title');
        if (composeTitle) composeTitle.textContent = '写回信';

        const replyInfo = document.getElementById('env-reply-time-info');
        if (replyInfo) replyInfo.textContent = '这是一封回信，对方会优先回复';

        // 标记原信件
        let letter;
        if (type === 'inbox') {
            letter = envelopeData.inbox.find(l => l.id === letterId);
        } else {
            letter = envelopeData.timeLetters.find(l => l.id === letterId);
        }

        if (letter) {
            letter.isReplied = true;
            saveEnvelopeData();
        }
    };

    // ==================== 标记已读 ====================
    function markInboxAsRead() {
        let changed = false;
        envelopeData.inbox.forEach(letter => {
            if (!letter.isRead) {
                letter.isRead = true;
                changed = true;
            }
        });
        if (changed) {
            saveEnvelopeData();
            updateBadges();
        }
    }

    function markTimeLettersAsRead() {
        let changed = false;
        envelopeData.timeLetters.forEach(letter => {
            if (!letter.isRead) {
                letter.isRead = true;
                changed = true;
            }
        });
        if (changed) {
            saveEnvelopeData();
            updateBadges();
        }
    }

    // ==================== 徽章更新 ====================
    function updateBadges() {
        const unreadInbox = envelopeData.inbox.filter(l => !l.isRead).length;
        const unreadTime = envelopeData.timeLetters.filter(l => !l.isRead).length;

        const inboxBadge = document.getElementById('env-inbox-badge');
        if (inboxBadge) {
            if (unreadInbox > 0) {
                inboxBadge.textContent = unreadInbox > 99 ? '99+' : unreadInbox;
                inboxBadge.style.display = 'inline-flex';
            } else {
                inboxBadge.style.display = 'none';
            }
        }

        const timeBadge = document.getElementById('env-time-badge');
        if (timeBadge) {
            if (unreadTime > 0) {
                timeBadge.textContent = unreadTime > 99 ? '99+' : unreadTime;
                timeBadge.style.display = 'inline-flex';
            } else {
                timeBadge.style.display = 'none';
            }
        }

        // 更新信封按钮上的红点
        const totalUnread = unreadInbox + unreadTime;
        const envelopeBtn = document.getElementById('envelope-header-btn');
        if (envelopeBtn) {
            let badge = envelopeBtn.querySelector('.header-badge');
            if (totalUnread > 0) {
                if (!badge) {
                    badge = document.createElement('span');
                    badge.className = 'header-badge';
                    envelopeBtn.appendChild(badge);
                }
                badge.textContent = totalUnread > 99 ? '99+' : totalUnread;
                badge.style.display = 'flex';
            } else if (badge) {
                badge.style.display = 'none';
            }
        }
    }

    // ==================== 定时器管理 ====================
    function startAutoReplyTimer() {
        // 自动回信在sendEnvelope时单独设置
    }

    function restartTimers() {
        if (autoReplyTimer) clearInterval(autoReplyTimer);
        if (timeLetterTimer) clearInterval(timeLetterTimer);
        startAutoReplyTimer();
        startTimeLetterTimer();
    }

    // ==================== 导入导出 ====================
    function exportEnvelopeData() {
        return {
            outbox: envelopeData.outbox,
            inbox: envelopeData.inbox,
            timeLetters: envelopeData.timeLetters,
            settings: envelopeSettings,
            exportTime: Date.now()
        };
    }

    function importEnvelopeData(data) {
        if (!data) return false;

        if (data.outbox) envelopeData.outbox = data.outbox;
        if (data.inbox) envelopeData.inbox = data.inbox;
        if (data.timeLetters) envelopeData.timeLetters = data.timeLetters;
        if (data.settings) envelopeSettings = { ...envelopeSettings, ...data.settings };

        saveEnvelopeData();
        saveEnvelopeSettings();
        updateBadges();

        // 刷新当前视图
        const outboxSection = document.getElementById('env-outbox-section');
        if (outboxSection && outboxSection.style.display !== 'none') {
            renderOutboxList();
        }

        return true;
    }

    // ==================== 打开/关闭弹窗 ====================
    window.openEnvelopeModal = function() {
        const modal = document.getElementById('envelope-modal');
        if (modal) {
            if (typeof showModal === 'function') {
                showModal(modal);
            } else {
                modal.classList.add('active');
                modal.style.display = 'flex';
            }

            // 默认显示寄出的信
            switchEnvTab('outbox');
            updateBadges();
        }
    };

    function closeEnvelopeModal() {
        const modal = document.getElementById('envelope-modal');
        if (modal) {
            if (typeof hideModal === 'function') {
                hideModal(modal);
            } else {
                modal.classList.remove('active');
                modal.style.display = 'none';
            }
        }
        isComposing = false;
    }

    // ==================== 工具函数 ====================
    function showNotification(message, type) {
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, type);
        } else {
            console.log('[' + type + '] ' + message);
        }
    }

    // ==================== 设置面板 ====================
    window.openEnvelopeSettings = function() {
        // 创建设置弹窗
        const settingsHTML = `
            <div class="modal" id="envelope-settings-modal" style="z-index:2200;">
                <div class="modal-content" style="max-width:360px;">
                    <div class="modal-title">
                        <i class="fas fa-cog"></i><span>信箱设置</span>
                    </div>
                    <div class="settings-section">
                        <div class="settings-section-title"><i class="fas fa-robot"></i>自动回信</div>
                        <div class="setting-pill-row" id="env-auto-reply-toggle" style="cursor:pointer;">
                            <span class="setting-pill-icon"><i class="fas fa-reply"></i></span>
                            <span class="setting-pill-label">开启自动回信</span>
                            <div class="setting-pill-switch" id="env-auto-reply-switch">
                                <div class="setting-pill-knob"></div>
                            </div>
                        </div>
                        <div class="cs-slider-row" style="margin-top:10px;">
                            <span class="cs-slider-label">回信延迟</span>
                            <input type="range" min="1" max="60" step="1" value="${envelopeSettings.autoReplyDelay}" class="font-size-slider" id="env-reply-delay-slider">
                            <span class="cs-slider-val" id="env-reply-delay-value">${envelopeSettings.autoReplyDelay}分钟</span>
                        </div>
                    </div>
                    <div class="settings-section">
                        <div class="settings-section-title"><i class="fas fa-clock"></i>时空来信</div>
                        <div class="setting-pill-row" id="env-time-letter-toggle" style="cursor:pointer;">
                            <span class="setting-pill-icon"><i class="fas fa-history"></i></span>
                            <span class="setting-pill-label">开启时空来信</span>
                            <div class="setting-pill-switch" id="env-time-letter-switch">
                                <div class="setting-pill-knob"></div>
                            </div>
                        </div>
                        <div class="cs-slider-row" style="margin-top:10px;">
                            <span class="cs-slider-label">来信间隔</span>
                            <input type="range" min="10" max="180" step="5" value="${envelopeSettings.timeLetterInterval}" class="font-size-slider" id="env-time-interval-slider">
                            <span class="cs-slider-val" id="env-time-interval-value">${envelopeSettings.timeLetterInterval}分钟</span>
                        </div>
                    </div>
                    <div class="settings-section">
                        <div class="settings-section-title"><i class="fas fa-bell"></i>通知</div>
                        <div class="setting-pill-row" id="env-notif-toggle" style="cursor:pointer;">
                            <span class="setting-pill-icon"><i class="fas fa-bell"></i></span>
                            <span class="setting-pill-label">新信通知</span>
                            <div class="setting-pill-switch" id="env-notif-switch">
                                <div class="setting-pill-knob"></div>
                            </div>
                        </div>
                    </div>
                    <div class="settings-section">
                        <div class="settings-section-title"><i class="fas fa-database"></i>数据</div>
                        <div style="display:flex;gap:8px;">
                            <button class="modal-btn modal-btn-secondary" onclick="exportEnvelopeToFile()" style="flex:1;font-size:12px;">
                                <i class="fas fa-download"></i> 导出
                            </button>
                            <button class="modal-btn modal-btn-secondary" onclick="importEnvelopeFromFile()" style="flex:1;font-size:12px;">
                                <i class="fas fa-upload"></i> 导入
                            </button>
                        </div>
                    </div>
                    <div class="modal-buttons">
                        <button class="modal-btn modal-btn-secondary" onclick="closeEnvelopeSettings()">关闭</button>
                        <button class="modal-btn modal-btn-primary" onclick="saveEnvelopeSettingsFromPanel()">保存</button>
                    </div>
                </div>
            </div>
        `;

        const existing = document.getElementById('envelope-settings-modal');
        if (existing) existing.remove();

        const div = document.createElement('div');
        div.innerHTML = settingsHTML;
        document.body.appendChild(div.firstElementChild);

        // 初始化开关状态
        initEnvelopeSettingsSwitches();

        // 显示弹窗
        const modal = document.getElementById('envelope-settings-modal');
        if (modal && typeof showModal === 'function') {
            showModal(modal);
        }
    };

    function initEnvelopeSettingsSwitches() {
        // 自动回信开关
        const autoReplyToggle = document.getElementById('env-auto-reply-toggle');
        const autoReplySwitch = document.getElementById('env-auto-reply-switch');
        if (autoReplyToggle && autoReplySwitch) {
            updateSwitchUI(autoReplySwitch, envelopeSettings.autoReplyEnabled);
            autoReplyToggle.addEventListener('click', () => {
                envelopeSettings.autoReplyEnabled = !envelopeSettings.autoReplyEnabled;
                updateSwitchUI(autoReplySwitch, envelopeSettings.autoReplyEnabled);
            });
        }

        // 时空来信开关
        const timeLetterToggle = document.getElementById('env-time-letter-toggle');
        const timeLetterSwitch = document.getElementById('env-time-letter-switch');
        if (timeLetterToggle && timeLetterSwitch) {
            updateSwitchUI(timeLetterSwitch, envelopeSettings.timeLetterEnabled);
            timeLetterToggle.addEventListener('click', () => {
                envelopeSettings.timeLetterEnabled = !envelopeSettings.timeLetterEnabled;
                updateSwitchUI(timeLetterSwitch, envelopeSettings.timeLetterEnabled);
            });
        }

        // 通知开关
        const notifToggle = document.getElementById('env-notif-toggle');
        const notifSwitch = document.getElementById('env-notif-switch');
        if (notifToggle && notifSwitch) {
            updateSwitchUI(notifSwitch, envelopeSettings.showNotification);
            notifToggle.addEventListener('click', () => {
                envelopeSettings.showNotification = !envelopeSettings.showNotification;
                updateSwitchUI(notifSwitch, envelopeSettings.showNotification);
            });
        }

        // 滑块事件
        const replyDelaySlider = document.getElementById('env-reply-delay-slider');
        const replyDelayValue = document.getElementById('env-reply-delay-value');
        if (replyDelaySlider && replyDelayValue) {
            replyDelaySlider.addEventListener('input', () => {
                envelopeSettings.autoReplyDelay = parseInt(replyDelaySlider.value);
                replyDelayValue.textContent = envelopeSettings.autoReplyDelay + '分钟';
            });
        }

        const timeIntervalSlider = document.getElementById('env-time-interval-slider');
        const timeIntervalValue = document.getElementById('env-time-interval-value');
        if (timeIntervalSlider && timeIntervalValue) {
            timeIntervalSlider.addEventListener('input', () => {
                envelopeSettings.timeLetterInterval = parseInt(timeIntervalSlider.value);
                timeIntervalValue.textContent = envelopeSettings.timeLetterInterval + '分钟';
            });
        }
    }

    function updateSwitchUI(switchEl, enabled) {
        const knob = switchEl.querySelector('.setting-pill-knob');
        if (enabled) {
            switchEl.style.background = 'var(--accent-color)';
            if (knob) knob.style.left = '23px';
        } else {
            switchEl.style.background = 'var(--border-color)';
            if (knob) knob.style.left = '3px';
        }
    }

    window.closeEnvelopeSettings = function() {
        const modal = document.getElementById('envelope-settings-modal');
        if (modal) {
            if (typeof hideModal === 'function') hideModal(modal);
            else modal.remove();
        }
    };

    window.saveEnvelopeSettingsFromPanel = function() {
        saveEnvelopeSettings();
        restartTimers();
        closeEnvelopeSettings();
        showNotification('信箱设置已保存 ✦', 'success');
    };

    // ==================== 文件导入导出 ====================
    window.exportEnvelopeToFile = function() {
        const data = exportEnvelopeData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'envelope-data-' + new Date().toISOString().split('T')[0] + '.json';
        a.click();
        URL.revokeObjectURL(url);
        showNotification('信箱数据已导出 ✦', 'success');
    };

    window.importEnvelopeFromFile = function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = function(e) {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function(event) {
                try {
                    const data = JSON.parse(event.target.result);
                    if (importEnvelopeData(data)) {
                        showNotification('信箱数据导入成功 ✦', 'success');
                        closeEnvelopeSettings();
                        // 刷新当前视图
                        switchEnvTab('outbox');
                    } else {
                        showNotification('数据格式不正确', 'error');
                    }
                } catch (err) {
                    showNotification('导入失败：' + err.message, 'error');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    };

    // ==================== 全局暴露 ====================
    window.envelopeModule = {
        init: initEnvelope,
        open: openEnvelopeModal,
        close: closeEnvelopeModal,
        getData: () => envelopeData,
        getSettings: () => envelopeSettings,
        exportData: exportEnvelopeData,
        importData: importEnvelopeData,
        generateTimeLetter: generateTimeLetter,
        addCustomReply: function(reply) {
            if (!envelopeSettings.customReplies) envelopeSettings.customReplies = [];
            envelopeSettings.customReplies.push(reply);
            saveEnvelopeSettings();
        }
    };

    // ==================== 初始化入口 ====================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEnvelope);
    } else {
        initEnvelope();
    }

})();
