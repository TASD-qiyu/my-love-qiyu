/**
 * companion.js - 陪伴功能模块
 * 功能：一起学习、一起工作、一起运动、一起睡觉
 * 包含：模式选择、时间设置、全屏陪伴、背景音、气泡对话、陪伴日记
 */

(function() {
    'use strict';

    // ==================== 配置常量 ====================
    const COMPANION_MODES = {
        study: { icon: 'fa-book-open', label: '学习', hint: 'STUDY', color: '#8B7EC8' },
        work: { icon: 'fa-laptop-code', label: '工作', hint: 'WORK', color: '#6B8E9F' },
        exercise: { icon: 'fa-person-running', label: '运动', hint: 'EXERCISE', color: '#E07A5F' },
        sleep: { icon: 'fa-moon', label: '睡觉', hint: 'SLEEP', color: '#4A5568' }
    };

    const TIME_OPTIONS = [
        { label: '15分钟', value: 15 * 60 },
        { label: '30分钟', value: 30 * 60 },
        { label: '45分钟', value: 45 * 60 },
        { label: '1小时', value: 60 * 60 },
        { label: '1.5小时', value: 90 * 60 },
        { label: '2小时', value: 120 * 60 },
        { label: '3小时', value: 180 * 60 },
        { label: '自定义', value: -1 }
    ];

    const HINT_TEXTS = {
        study: ['正在一起学习 · 加油', '专注当下，效率翻倍', '知识在积累，未来在靠近'],
        work: ['正在一起工作 · 高效', '专注任务，稳步推进', '工作虽忙，有我在旁'],
        exercise: ['正在一起运动 · 坚持', '动起来，更健康', '每一滴汗水都算数'],
        sleep: ['正在一起休息 · 晚安', '放下手机，安心入睡', '好梦，明天见']
    };

    // ==================== 状态管理 ====================
    let companionState = {
        mode: null,
        duration: 0,
        remaining: 0,
        isRunning: false,
        timerId: null,
        startTime: null,
        bgDataUrl: null,
        voices: [],
        noiseAudio: null,
        noiseEnabled: false,
        messages: [],
        initBy: 'user' // 'user' | 'partner'
    };

    // ==================== DOM 引用缓存 ====================
    let $ = {};

    function cacheDOM() {
        $.companionModal = document.getElementById('companion-modal');
        $.setupModal = document.getElementById('setup-modal');
        $.timeModal = document.getElementById('time-modal');
        $.companionPage = document.getElementById('companion-page');
        $.companionBgContainer = document.getElementById('companion-bg-container');
        $.companionTimerDisplay = document.getElementById('companion-timer-display');
        $.companionTimerLabel = document.getElementById('companion-timer-label');
        $.companionHintText = document.getElementById('companion-hint-text');
        $.companionBubbleArea = document.getElementById('companion-bubble-area');
        $.companionInputBar = document.getElementById('companion-input-bar');
        $.companionInputField = document.getElementById('companion-input-field');
        $.companionTypingIndicator = document.getElementById('companion-typing-indicator');
        $.companionExitConfirm = document.getElementById('companion-exit-confirm');
        $.companionNoiseBtn = document.getElementById('companion-noise-btn');
        $.companionHistoryBtn = document.getElementById('companion-history-btn');
        $.companionKeyboardBtn = document.getElementById('companion-keyboard-btn');
        $.setupBgPreview = document.getElementById('setup-bg-preview');
        $.setupBgTrigger = document.getElementById('setup-bg-trigger');
        $.setupBgInput = document.getElementById('setup-bg-input');
        $.setupVoiceTrigger = document.getElementById('setup-voice-trigger');
        $.setupVoiceInput = document.getElementById('setup-voice-input');
        $.setupVoiceList = document.getElementById('setup-voice-list');
        $.setupBtnNext = document.getElementById('setup-btn-next');
        $.setupBtnFinish = document.getElementById('setup-btn-finish');
        $.setupBtnSkip = document.getElementById('setup-btn-skip');
        $.setupBtnCancel = document.getElementById('setup-btn-cancel');
        $.setupStepBg = document.getElementById('setup-step-bg');
        $.setupStepVoice = document.getElementById('setup-step-voice');
        $.timeOptionsGrid = document.getElementById('time-options-grid');
        $.timeModalTitle = document.getElementById('time-modal-title');
        $.timeModalIcon = document.getElementById('time-modal-icon');
        $.setupModalTitle = document.getElementById('setup-modal-title');
        $.setupModalIcon = document.getElementById('setup-modal-icon');
    }

    // ==================== 工具函数 ====================
    function formatTime(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        if (h > 0) {
            return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
        }
        return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    }

    function showNotification(msg, type) {
        if (window.showNotification) {
            window.showNotification(msg, type);
        } else {
            console.log(`[${type}] ${msg}`);
        }
    }

    function showModal(modal) {
        if (!modal) return;
        modal.style.display = 'flex';
        modal.classList.add('active');
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.style.transform = 'scale(1)';
        }, 10);
    }

    function hideModal(modal) {
        if (!modal) return;
        modal.style.opacity = '0';
        modal.style.transform = 'scale(0.95)';
        setTimeout(() => {
            modal.style.display = 'none';
            modal.classList.remove('active');
        }, 250);
    }

    function getCompanionData() {
        try {
            const data = localStorage.getItem('companionData');
            return data ? JSON.parse(data) : {};
        } catch(e) {
            return {};
        }
    }

    function saveCompanionData(data) {
        localStorage.setItem('companionData', JSON.stringify(data));
    }

    function getCompanionDiary() {
        try {
            const data = localStorage.getItem('companionDiary');
            return data ? JSON.parse(data) : [];
        } catch(e) {
            return [];
        }
    }

    function saveCompanionDiary(diary) {
        localStorage.setItem('companionDiary', JSON.stringify(diary));
    }

    // ==================== 模式选择 ====================
    function initModeSelection() {
        const cards = document.querySelectorAll('.companion-mode-card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const mode = card.dataset.mode;
                openCompanionSetup(mode);
            });
        });

        // 关闭按钮
        const closeBtn = document.getElementById('companion-modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => hideModal($.companionModal));
        }
    }

    // ==================== 初始化设置弹窗 ====================
    function openCompanionSetup(mode) {
        companionState.mode = mode;
        const config = COMPANION_MODES[mode];

        // 更新弹窗标题
        if ($.setupModalTitle) $.setupModalTitle.textContent = `陪我${config.label}`;
        if ($.setupModalIcon) $.setupModalIcon.className = `fas ${config.icon}`;

        // 重置步骤
        if ($.setupStepBg) $.setupStepBg.style.display = 'block';
        if ($.setupStepVoice) $.setupStepVoice.style.display = 'none';
        if ($.setupBtnNext) $.setupBtnNext.style.display = 'none';

        // 重置预览
        companionState.bgDataUrl = null;
        companionState.voices = [];
        if ($.setupBgPreview) {
            $.setupBgPreview.style.display = 'none';
            $.setupBgPreview.innerHTML = '';
        }
        if ($.setupVoiceList) $.setupVoiceList.innerHTML = '';

        // 加载已保存的背景
        const savedData = getCompanionData();
        if (savedData[mode] && savedData[mode].bg) {
            companionState.bgDataUrl = savedData[mode].bg;
            showBgPreview(savedData[mode].bg);
            if ($.setupBtnNext) $.setupBtnNext.style.display = 'inline-flex';
        }

        showModal($.setupModal);
    }

    // ==================== 背景上传 ====================
    function initBgUpload() {
        if (!$.setupBgTrigger || !$.setupBgInput) return;

        $.setupBgTrigger.addEventListener('click', () => $.setupBgInput.click());

        $.setupBgInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            if (file.size > 100 * 1024 * 1024) {
                showNotification('文件过大，请控制在100MB以内', 'error');
                return;
            }

            const reader = new FileReader();
            reader.onload = (ev) => {
                companionState.bgDataUrl = ev.target.result;
                showBgPreview(ev.target.result);
                if ($.setupBtnNext) $.setupBtnNext.style.display = 'inline-flex';

                // 保存到对应模式
                const savedData = getCompanionData();
                if (!savedData[companionState.mode]) savedData[companionState.mode] = {};
                savedData[companionState.mode].bg = ev.target.result;
                saveCompanionData(savedData);
            };
            reader.readAsDataURL(file);
        });
    }

    function showBgPreview(dataUrl) {
        if (!$.setupBgPreview) return;
        $.setupBgPreview.style.display = 'block';

        const isVideo = dataUrl.startsWith('data:video');
        if (isVideo) {
            $.setupBgPreview.innerHTML = `<video src="${dataUrl}" autoplay loop muted playsinline style="width:100%;height:100%;object-fit:cover;border-radius:12px;"></video>`;
        } else {
            $.setupBgPreview.innerHTML = `<img src="${dataUrl}" style="width:100%;height:100%;object-fit:cover;border-radius:12px;">`;
        }
    }

    // ==================== 语音上传 ====================
    function initVoiceUpload() {
        if (!$.setupVoiceTrigger || !$.setupVoiceInput) return;

        $.setupVoiceTrigger.addEventListener('click', () => $.setupVoiceInput.click());

        $.setupVoiceInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            files.forEach(file => {
                if (file.size > 50 * 1024 * 1024) {
                    showNotification('语音文件过大', 'error');
                    return;
                }
                const reader = new FileReader();
                reader.onload = (ev) => {
                    const voice = {
                        id: Date.now() + Math.random(),
                        name: file.name,
                        dataUrl: ev.target.result
                    };
                    companionState.voices.push(voice);
                    renderVoiceList();

                    // 保存
                    const savedData = getCompanionData();
                    if (!savedData[companionState.mode]) savedData[companionState.mode] = {};
                    if (!savedData[companionState.mode].voices) savedData[companionState.mode].voices = [];
                    savedData[companionState.mode].voices.push(voice);
                    saveCompanionData(savedData);
                };
                reader.readAsDataURL(file);
            });
        });
    }

    function renderVoiceList() {
        if (!$.setupVoiceList) return;
        $.setupVoiceList.innerHTML = companionState.voices.map((v, i) => `
            <div class="companion-voice-item" data-id="${v.id}">
                <i class="fas fa-music"></i>
                <span>${v.name}</span>
                <button class="companion-voice-play" onclick="window.playCompanionVoice('${v.id}')">
                    <i class="fas fa-play"></i>
                </button>
                <button class="companion-voice-remove" onclick="window.removeCompanionVoice('${v.id}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
    }

    window.playCompanionVoice = function(voiceId) {
        const voice = companionState.voices.find(v => String(v.id) === String(voiceId));
        if (!voice) return;
        const audio = new Audio(voice.dataUrl);
        audio.play();
    };

    window.removeCompanionVoice = function(voiceId) {
        companionState.voices = companionState.voices.filter(v => String(v.id) !== String(voiceId));
        renderVoiceList();

        const savedData = getCompanionData();
        if (savedData[companionState.mode]) {
            savedData[companionState.mode].voices = companionState.voices;
            saveCompanionData(savedData);
        }
    };

    // ==================== 设置步骤导航 ====================
    function initSetupNavigation() {
        // 下一步
        if ($.setupBtnNext) {
            $.setupBtnNext.addEventListener('click', () => {
                if ($.setupStepBg) $.setupStepBg.style.display = 'none';
                if ($.setupStepVoice) $.setupStepVoice.style.display = 'block';

                // 加载已保存的语音
                const savedData = getCompanionData();
                if (savedData[companionState.mode] && savedData[companionState.mode].voices) {
                    companionState.voices = savedData[companionState.mode].voices;
                    renderVoiceList();
                }
            });
        }

        // 跳过
        if ($.setupBtnSkip) {
            $.setupBtnSkip.addEventListener('click', () => {
                hideModal($.setupModal);
                openTimeSelection();
            });
        }

        // 完成
        if ($.setupBtnFinish) {
            $.setupBtnFinish.addEventListener('click', () => {
                hideModal($.setupModal);
                openTimeSelection();
            });
        }

        // 取消
        if ($.setupBtnCancel) {
            $.setupBtnCancel.addEventListener('click', () => hideModal($.setupModal));
        }
    }

    // ==================== 时间选择 ====================
    function openTimeSelection() {
        const config = COMPANION_MODES[companionState.mode];
        if ($.timeModalTitle) $.timeModalTitle.textContent = `陪我${config.label}`;
        if ($.timeModalIcon) $.timeModalIcon.className = `fas ${config.icon}`;

        // 生成时间选项
        if ($.timeOptionsGrid) {
            $.timeOptionsGrid.innerHTML = TIME_OPTIONS.map(opt => `
                <button class="companion-time-btn" data-value="${opt.value}">
                    <span class="companion-time-btn-label">${opt.label}</span>
                </button>
            `).join('');

            // 绑定点击
            $.timeOptionsGrid.querySelectorAll('.companion-time-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const value = parseInt(btn.dataset.value);
                    if (value === -1) {
                        // 自定义时间
                        const custom = prompt('请输入分钟数:', '60');
                        if (custom && !isNaN(custom)) {
                            startCompanion(parseInt(custom) * 60);
                        }
                    } else {
                        startCompanion(value);
                    }
                    hideModal($.timeModal);
                });
            });
        }

        showModal($.timeModal);
    }

    // 关闭时间弹窗
    function initTimeModalClose() {
        const closeBtn = document.getElementById('time-modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => hideModal($.timeModal));
        }
    }

    // ==================== 开始陪伴 ====================
    function startCompanion(durationSeconds) {
        companionState.duration = durationSeconds;
        companionState.remaining = durationSeconds;
        companionState.isRunning = true;
        companionState.startTime = Date.now();
        companionState.messages = [];
        companionState.initBy = 'user';

        const config = COMPANION_MODES[companionState.mode];

        // 设置背景
        if ($.companionBgContainer && companionState.bgDataUrl) {
            const isVideo = companionState.bgDataUrl.startsWith('data:video');
            if (isVideo) {
                $.companionBgContainer.innerHTML = `<video src="${companionState.bgDataUrl}" autoplay loop muted playsinline style="width:100%;height:100%;object-fit:cover;"></video>`;
            } else {
                $.companionBgContainer.innerHTML = `<img src="${companionState.bgDataUrl}" style="width:100%;height:100%;object-fit:cover;">`;
            }
        } else if ($.companionBgContainer) {
            // 默认渐变背景
            $.companionBgContainer.innerHTML = `<div style="width:100%;height:100%;background:linear-gradient(135deg, ${config.color}22, ${config.color}44);"></div>`;
        }

        // 设置标签
        if ($.companionTimerLabel) $.companionTimerLabel.textContent = config.hint;

        // 更新提示文字
        updateHintText();

        // 显示页面
        if ($.companionPage) {
            $.companionPage.style.display = 'flex';
            setTimeout(() => $.companionPage.style.opacity = '1', 10);
        }

        // 启动计时器
        updateTimerDisplay();
        companionState.timerId = setInterval(() => {
            companionState.remaining--;
            updateTimerDisplay();

            if (companionState.remaining <= 0) {
                finishCompanion();
            }
        }, 1000);

        // 随机气泡
        startRandomBubbles();

        showNotification(`开始陪伴 - ${config.label}模式 ✦`, 'success');
    }

    function updateTimerDisplay() {
        if ($.companionTimerDisplay) {
            $.companionTimerDisplay.textContent = formatTime(companionState.remaining);
        }
    }

    function updateHintText() {
        const hints = HINT_TEXTS[companionState.mode] || ['陪伴中...'];
        const hint = hints[Math.floor(Math.random() * hints.length)];
        if ($.companionHintText) $.companionHintText.textContent = hint;
    }

    // ==================== 随机气泡 ====================
    function startRandomBubbles() {
        // 每30-90秒随机显示一个气泡
        const scheduleNextBubble = () => {
            if (!companionState.isRunning) return;
            const delay = 30000 + Math.random() * 60000;
            setTimeout(() => {
                if (companionState.isRunning) {
                    showCompanionBubble();
                    scheduleNextBubble();
                }
            }, delay);
        };
        scheduleNextBubble();
    }

    function showCompanionBubble(text) {
        if (!$.companionBubbleArea) return;

        const bubble = document.createElement('div');
        bubble.className = 'companion-bubble';

        // 如果没有提供文字，从字卡库随机获取
        if (!text) {
            text = getRandomReplyText();
        }

        const partnerName = (window.settings && window.settings.partnerName) || '梦角';
        bubble.innerHTML = `
            <div class="companion-bubble-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="companion-bubble-content">
                <div class="companion-bubble-name">${partnerName}</div>
                <div class="companion-bubble-text">${text}</div>
            </div>
        `;

        $.companionBubbleArea.appendChild(bubble);

        // 动画进入
        requestAnimationFrame(() => {
            bubble.style.opacity = '1';
            bubble.style.transform = 'translateY(0)';
        });

        // 5秒后自动消失
        setTimeout(() => {
            bubble.style.opacity = '0';
            bubble.style.transform = 'translateY(-20px)';
            setTimeout(() => bubble.remove(), 500);
        }, 5000);
    }

    function getRandomReplyText() {
        // 从主字卡库获取
        try {
            const saved = localStorage.getItem('customReplies');
            if (saved) {
                const data = JSON.parse(saved);
                if (data.reply && data.reply.main && data.reply.main.length > 0) {
                    const items = data.reply.main;
                    const item = items[Math.floor(Math.random() * items.length)];
                    return typeof item === 'string' ? item : (item.text || item.content || '...');
                }
            }
        } catch(e) {}

        // 默认文案
        const defaults = {
            study: ['加油，你可以的！', '专注当下，效率翻倍', '我在旁边陪着你'],
            work: ['工作顺利吗？', '注意休息，别太累', '有我在，不孤单'],
            exercise: ['坚持就是胜利！', '动起来，更健康', '你运动的样子很帅'],
            sleep: ['晚安，好梦', '放下手机，安心睡吧', '明天见']
        };
        const list = defaults[companionState.mode] || ['...'];
        return list[Math.floor(Math.random() * list.length)];
    }

    // ==================== 输入区 ====================
    function initCompanionInput() {
        if (!$.companionInputField) return;

        $.companionInputField.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendCompanionMessage();
            }
        });

        // 发送按钮（如果有）
        const sendBtn = document.getElementById('companion-send-btn');
        if (sendBtn) {
            sendBtn.addEventListener('click', sendCompanionMessage);
        }

        // 表情按钮
        const emojiBtn = document.getElementById('companion-emoji-btn');
        if (emojiBtn) {
            emojiBtn.addEventListener('click', () => {
                // 简化：直接发送一个表情
                sendCompanionMessage('😊');
            });
        }

        // 图片按钮
        const imageBtn = document.getElementById('companion-image-btn');
        if (imageBtn) {
            imageBtn.addEventListener('click', () => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                            sendCompanionMessage(null, ev.target.result);
                        };
                        reader.readAsDataURL(file);
                    }
                };
                input.click();
            });
        }
    }

    function sendCompanionMessage(text, imageUrl) {
        if (!text && !imageUrl && $.companionInputField) {
            text = $.companionInputField.value.trim();
            $.companionInputField.value = '';
        }
        if (!text && !imageUrl) return;

        // 显示用户消息
        showUserBubble(text, imageUrl);

        // 保存到消息记录
        companionState.messages.push({
            role: 'user',
            text: text,
            image: imageUrl,
            time: Date.now()
        });

        // 模拟对方正在输入
        showTypingIndicator();

        // 延迟回复
        const delay = 2000 + Math.random() * 3000;
        setTimeout(() => {
            hideTypingIndicator();
            const reply = getRandomReplyText();
            showCompanionBubble(reply);
            companionState.messages.push({
                role: 'partner',
                text: reply,
                time: Date.now()
            });
        }, delay);

        // 随机播放语音
        if (companionState.voices.length > 0 && Math.random() < 0.3) {
            const voice = companionState.voices[Math.floor(Math.random() * companionState.voices.length)];
            const audio = new Audio(voice.dataUrl);
            audio.play().catch(() => {});
        }
    }

    function showUserBubble(text, imageUrl) {
        if (!$.companionBubbleArea) return;

        const bubble = document.createElement('div');
        bubble.className = 'companion-bubble companion-bubble-user';

        let content = '';
        if (imageUrl) {
            content = `<img src="${imageUrl}" style="max-width:150px;border-radius:8px;">`;
        } else {
            content = `<div class="companion-bubble-text">${text}</div>`;
        }

        bubble.innerHTML = `
            <div class="companion-bubble-content" style="margin-left:auto;">
                ${content}
            </div>
        `;

        $.companionBubbleArea.appendChild(bubble);
        requestAnimationFrame(() => {
            bubble.style.opacity = '1';
            bubble.style.transform = 'translateY(0)';
        });

        setTimeout(() => {
            bubble.style.opacity = '0';
            setTimeout(() => bubble.remove(), 500);
        }, 5000);
    }

    function showTypingIndicator() {
        if (!$.companionTypingIndicator) return;
        const partnerName = (window.settings && window.settings.partnerName) || '梦角';
        const nameEl = $.companionTypingIndicator.querySelector('.companion-typing-name');
        if (nameEl) nameEl.textContent = partnerName;
        $.companionTypingIndicator.style.display = 'flex';
    }

    function hideTypingIndicator() {
        if (!$.companionTypingIndicator) return;
        $.companionTypingIndicator.style.display = 'none';
    }

    // ==================== 键盘切换 ====================
    function initKeyboardToggle() {
        if (!$.companionKeyboardBtn || !$.companionInputBar) return;

        $.companionKeyboardBtn.addEventListener('click', () => {
            const isVisible = $.companionInputBar.style.display !== 'none';
            $.companionInputBar.style.display = isVisible ? 'none' : 'flex';
            if (!isVisible && $.companionInputField) {
                setTimeout(() => $.companionInputField.focus(), 100);
            }
        });

        // 默认隐藏输入栏
        $.companionInputBar.style.display = 'none';
    }

    // ==================== 历史记录 ====================
    function initHistoryButton() {
        if (!$.companionHistoryBtn) return;

        $.companionHistoryBtn.addEventListener('click', () => {
            showCompanionHistory();
        });
    }

    function showCompanionHistory() {
        if (companionState.messages.length === 0) {
            showNotification('还没有对话记录', 'info');
            return;
        }

        const partnerName = (window.settings && window.settings.partnerName) || '梦角';
        const html = companionState.messages.map(msg => {
            const time = new Date(msg.time).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
            if (msg.role === 'user') {
                return `<div style="text-align:right;margin:6px 0;"><span style="background:rgba(var(--accent-color-rgb),0.2);padding:6px 12px;border-radius:12px;font-size:13px;">${msg.text || '[图片]'}</span><span style="font-size:10px;color:var(--text-secondary);margin-left:6px;">${time}</span></div>`;
            } else {
                return `<div style="text-align:left;margin:6px 0;"><span style="font-size:10px;color:var(--text-secondary);margin-right:6px;">${time}</span><span style="background:rgba(255,255,255,0.1);padding:6px 12px;border-radius:12px;font-size:13px;">${msg.text}</span></div>`;
            }
        }).join('');

        // 创建临时弹窗
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.style.cssText = 'display:flex;z-index:3000;';
        modal.innerHTML = `
            <div class="modal-content" style="max-height:70vh;display:flex;flex-direction:column;">
                <div class="modal-title"><i class="fas fa-comment-dots"></i><span>本次对话</span></div>
                <div style="flex:1;overflow-y:auto;padding:10px;">${html}</div>
                <div class="modal-buttons">
                    <button class="modal-btn modal-btn-secondary" onclick="this.closest('.modal').remove()">关闭</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // ==================== 背景音 ====================
    function initNoiseButton() {
        if (!$.companionNoiseBtn) return;

        $.companionNoiseBtn.addEventListener('click', () => {
            toggleNoise();
        });
    }

    function toggleNoise() {
        if (companionState.noiseEnabled && companionState.noiseAudio) {
            companionState.noiseAudio.pause();
            companionState.noiseEnabled = false;
            if ($.companionNoiseBtn) $.companionNoiseBtn.style.opacity = '0.6';
            showNotification('背景音已关闭', 'info');
        } else {
            // 尝试播放内置白噪音或用户上传的音乐
            playNoise();
        }
    }

    function playNoise() {
        // 检查是否有用户上传的该场景音乐
        const savedData = getCompanionData();
        const modeData = savedData[companionState.mode];
        if (modeData && modeData.noise) {
            companionState.noiseAudio = new Audio(modeData.noise);
            companionState.noiseAudio.loop = true;
            companionState.noiseAudio.play().then(() => {
                companionState.noiseEnabled = true;
                if ($.companionNoiseBtn) $.companionNoiseBtn.style.opacity = '1';
                showNotification('背景音已开启', 'success');
            }).catch(() => {
                showNotification('无法播放背景音', 'error');
            });
        } else {
            // 生成简单的白噪音
            try {
                const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                const bufferSize = 2 * audioCtx.sampleRate;
                const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
                const output = noiseBuffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    output[i] = Math.random() * 2 - 1;
                }
                const whiteNoise = audioCtx.createBufferSource();
                whiteNoise.buffer = noiseBuffer;
                whiteNoise.loop = true;
                const gainNode = audioCtx.createGain();
                gainNode.gain.value = 0.05;
                whiteNoise.connect(gainNode);
                gainNode.connect(audioCtx.destination);
                whiteNoise.start();
                companionState.noiseAudio = { pause: () => { whiteNoise.stop(); audioCtx.close(); } };
                companionState.noiseEnabled = true;
                if ($.companionNoiseBtn) $.companionNoiseBtn.style.opacity = '1';
                showNotification('白噪音已开启', 'success');
            } catch(e) {
                showNotification('无法播放背景音', 'error');
            }
        }
    }

    // ==================== 退出确认 ====================
    function initExitButton() {
        const exitBtn = document.getElementById('companion-exit-btn');
        if (!exitBtn) return;

        exitBtn.addEventListener('click', () => {
            if ($.companionExitConfirm) {
                $.companionExitConfirm.style.display = 'flex';
            }
        });

        const noBtn = document.getElementById('exit-confirm-no');
        const yesBtn = document.getElementById('exit-confirm-yes');

        if (noBtn) {
            noBtn.addEventListener('click', () => {
                if ($.companionExitConfirm) $.companionExitConfirm.style.display = 'none';
            });
        }

        if (yesBtn) {
            yesBtn.addEventListener('click', () => {
                finishCompanion();
                if ($.companionExitConfirm) $.companionExitConfirm.style.display = 'none';
            });
        }
    }

    // ==================== 结束陪伴 ====================
    function finishCompanion() {
        if (companionState.timerId) {
            clearInterval(companionState.timerId);
            companionState.timerId = null;
        }

        if (companionState.noiseAudio) {
            companionState.noiseAudio.pause();
            companionState.noiseAudio = null;
        }

        companionState.isRunning = false;

        // 记录到日记
        const elapsed = companionState.duration - companionState.remaining;
        if (elapsed > 60) { // 超过1分钟才记录
            const diaryEntry = {
                id: Date.now(),
                mode: companionState.mode,
                duration: elapsed,
                startTime: companionState.startTime,
                endTime: Date.now(),
                initBy: companionState.initBy,
                note: ''
            };
            const diary = getCompanionDiary();
            diary.unshift(diaryEntry);
            saveCompanionDiary(diary);
        }

        // 隐藏页面
        if ($.companionPage) {
            $.companionPage.style.opacity = '0';
            setTimeout(() => {
                $.companionPage.style.display = 'none';
                // 清理气泡
                if ($.companionBubbleArea) $.companionBubbleArea.innerHTML = '';
            }, 300);
        }

        const config = COMPANION_MODES[companionState.mode];
        showNotification(`陪伴结束 - 本次${config.label} ${formatTime(elapsed)} ✦`, 'success');
    }

    // ==================== 页面点击互动 ====================
    function initPageInteraction() {
        if (!$.companionPage) return;

        $.companionPage.addEventListener('click', (e) => {
            // 点击空白处随机播放语音
            if (companionState.voices.length > 0 && e.target === $.companionPage) {
                if (Math.random() < 0.3) {
                    const voice = companionState.voices[Math.floor(Math.random() * companionState.voices.length)];
                    const audio = new Audio(voice.dataUrl);
                    audio.play().catch(() => {});
                }
            }
        });
    }

    // ==================== 外部调用：由梦角发起陪伴 ====================
    window.inviteCompanion = function(mode) {
        companionState.mode = mode;
        companionState.initBy = 'partner';
        const config = COMPANION_MODES[mode];

        // 检查是否有背景
        const savedData = getCompanionData();
        if (savedData[mode] && savedData[mode].bg) {
            companionState.bgDataUrl = savedData[mode].bg;
        }
        if (savedData[mode] && savedData[mode].voices) {
            companionState.voices = savedData[mode].voices;
        }

        // 显示邀请弹窗
        const partnerName = (window.settings && window.settings.partnerName) || '梦角';
        if (confirm(`${partnerName} 邀请你一起${config.label}，要接受吗？`)) {
            openTimeSelection();
        }
    };

    // ==================== 初始化入口 ====================
    function init() {
        cacheDOM();
        initModeSelection();
        initBgUpload();
        initVoiceUpload();
        initSetupNavigation();
        initTimeModalClose();
        initCompanionInput();
        initKeyboardToggle();
        initHistoryButton();
        initNoiseButton();
        initExitButton();
        initPageInteraction();

        // 绑定主按钮
        const companionBtn = document.getElementById('companion-btn');
        if (companionBtn) {
            companionBtn.addEventListener('click', () => {
                showModal($.companionModal);
            });
        }
    }

    // DOM 就绪后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 暴露全局
    window.companionState = companionState;
    window.COMPANION_MODES = COMPANION_MODES;
    window.getCompanionDiary = getCompanionDiary;
    window.saveCompanionDiary = saveCompanionDiary;

})();
