// ==================== 回复库管理 (reply-library.js) ====================
(function() {
    'use strict';

    // ========== 默认字卡库 ==========
    const DEFAULT_REPLY_LIBRARY = {
        reply: {
            main: [
                "想你了",
                "今天过得怎么样",
                "我在呢",
                "抱抱你",
                "要开心哦",
                "记得按时吃饭",
                "好想见到你",
                "你是最棒的",
                "我一直在",
                "爱你",
                "想和你一起看星星",
                "今天也很想你",
                "你笑起来的样子最好看",
                "我会一直陪着你",
                "不管发生什么我都在",
                "你是我最重要的人",
                "想听你说话",
                "和你在一起的时光最珍贵",
                "希望你一切都好",
                "想牵着你的手",
                "你的消息是我一天中最期待的事",
                "想和你一起去旅行",
                "你是我心里的光",
                "想给你最好的",
                "有你在真好",
                "想和你分享一切",
                "你是我最特别的存在",
                "想和你一起变老",
                "你的声音是我最喜欢的音乐",
                "想和你度过每一个节日",
                "你是我最美的遇见",
                "想和你一起吃很多顿饭",
                "你的笑容能治愈一切",
                "想和你看遍世间风景",
                "你是我最温暖的依靠",
                "想和你一直走下去",
                "你的存在让我的世界更美好",
                "想和你创造更多回忆",
                "你是我最珍贵的宝藏",
                "想和你分享喜怒哀乐",
                "你的一举一动都牵动着我的心",
                "想和你共度余生",
                "你是我生命中最美的意外",
                "想和你一起慢慢变老",
                "你的温柔是我最大的幸福",
                "想和你永远在一起",
                "你是我最坚定的选择",
                "想和你一起面对未来",
                "你的爱是我最大的勇气",
                "想和你携手走过每一天",
                "你是我最想要守护的人"
            ],
            kaomoji: [
                "(｡♥‿♥｡)",
                "(◕‿◕✿)",
                "(｡◕‿◕｡)",
                "(◍•ᴗ•◍)",
                "(｡･ω･｡)ﾉ♡",
                "(◕ᴗ◕✿)",
                "(｡♥‿♥｡)",
                "(◍•ᴗ•◍)❤",
                "(｡･ω･｡)ﾉ♡",
                "(◕‿◕)♡",
                "(｡♥‿♥｡)",
                "(◍•ᴗ•◍)✧",
                "(｡･ω･｡)ﾉ",
                "(◕ᴗ◕✿)",
                "(｡♥‿♥｡)ﾉ",
                "(◍•ᴗ•◍)♡",
                "(｡･ω･｡)ﾉ♡",
                "(◕‿◕✿)",
                "(｡♥‿♥｡)",
                "(◍•ᴗ•◍)❤"
            ],
            emoji: [
                "😊", "😍", "🥰", "😘", "💕",
                "💖", "💗", "💓", "💞", "💝",
                "❤️", "🧡", "💛", "💚", "💙",
                "💜", "🖤", "🤍", "🤎", "❣️",
                "💌", "🌹", "🌸", "🌺", "🌻",
                "🌷", "🌼", "🍀", "🌈", "⭐",
                "✨", "🎀", "🎁", "💐", "🦋"
            ]
        },
        atmosphere: {
            poke: [
                "拍了拍你的肩膀",
                "捏了捏你的脸",
                "摸了摸你的头",
                "戳了戳你的腰",
                "抱了抱你",
                "亲了亲你的额头",
                "牵了牵你的手",
                "揉了揉你的头发",
                "拍了拍你的背",
                "握了握你的手"
            ],
            status: [
                "正在想你",
                "等待你的消息",
                "看着你的照片发呆",
                "听着你喜欢的歌",
                "想象着和你见面的场景",
                "回忆着我们的点点滴滴",
                "期待着你的回复",
                "想着你的笑容",
                "感受着有你的幸福",
                "珍惜着和你在一起的每一刻"
            ],
            header: [
                "爱是我们的思绪 ✧",
                "Love",
                "Echo",
                "Soulmate",
                "Forever",
                "Together",
                "Dream",
                "Wish",
                "Hope",
                "Believe"
            ],
            opening: [
                "正在连接我们的思绪 ✧",
                "Love",
                "若爱由我来谈爱的话",
                "听见我的回音了吗？",
                "灵魂共振"
            ]
        },
        announcement: {
            titles: [
                "早上好",
                "中午好",
                "晚上好",
                "晚安",
                "想你"
            ],
            notes: [
                "今天也要元气满满，我在这里陪着你 ✦",
                "想你了，你有没有在想我呢",
                "记得照顾好自己，我会担心的",
                "不管多忙，都要记得想我哦",
                "你是我一天中最美好的期待",
                "希望今天的你也能开心",
                "我会一直在这里等你",
                "你的笑容是我最大的动力",
                "想和你一起度过每一天",
                "有你在，每一天都是美好的"
            ],
            statusPool: [
                { text: "在想你", label: "MISSING YOU", icon: "💭" },
                { text: "等你消息", label: "WAITING", icon: "📱" },
                { text: "很开心", label: "HAPPY", icon: "😊" },
                { text: "有点困", label: "SLEEPY", icon: "😴" },
                { text: "在发呆", label: "DAYDREAMING", icon: "✨" }
            ]
        }
    };

    // ========== 默认音效库 ==========
    const DEFAULT_SOUNDS = {
        mySend: { preset: 'tone_default', customUrl: '', volume: 15 },
        partnerMessage: { preset: 'tone_soft', customUrl: '', volume: 15 },
        myPoke: { preset: 'tone_warm', customUrl: '', volume: 15 },
        partnerPoke: { preset: 'tone_low', customUrl: '', volume: 15 },
        inviteStudy: { preset: 'default', customUrl: '', volume: 15 },
        inviteWork: { preset: 'default', customUrl: '', volume: 15 },
        inviteExercise: { preset: 'default', customUrl: '', volume: 15 },
        inviteSleep: { preset: 'default', customUrl: '', volume: 15 },
        inviteVideocall: { preset: 'default', customUrl: '', volume: 15 }
    };

    // 内置音效数据 (Base64编码的短音频)
    const BUILTIN_SOUNDS = {
        tone_default: generateTone(800, 0.1, 'sine'),
        tone_soft: generateTone(600, 0.15, 'sine'),
        tone_low: generateTone(400, 0.2, 'sine'),
        tone_warm: generateTone(700, 0.12, 'triangle'),
        tone_dark: generateTone(300, 0.25, 'sine'),
        tone_haze: generateTone(500, 0.18, 'sine'),
        kakaotalk: generateTone(900, 0.08, 'sine'),
        default: generateTone(650, 0.1, 'sine')
    };

    // 生成简单音调
    function generateTone(frequency, duration, type) {
        // 返回一个可以播放的音频数据对象
        return { frequency, duration, type, builtin: true };
    }

    // ========== 数据持久化 ==========
    function getReplyLibrary() {
        try {
            const saved = localStorage.getItem('customReplies');
            if (saved) {
                const parsed = JSON.parse(saved);
                // 合并默认值，确保新字段存在
                return mergeDeep(JSON.parse(JSON.stringify(DEFAULT_REPLY_LIBRARY)), parsed);
            }
        } catch (e) {
            console.error('读取回复库失败:', e);
        }
        return JSON.parse(JSON.stringify(DEFAULT_REPLY_LIBRARY));
    }

    function saveReplyLibrary(library) {
        localStorage.setItem('customReplies', JSON.stringify(library));
    }

    function getSoundSettings() {
        try {
            const saved = localStorage.getItem('soundSettings');
            if (saved) return JSON.parse(saved);
        } catch (e) {}
        return JSON.parse(JSON.stringify(DEFAULT_SOUNDS));
    }

    function saveSoundSettings(settings) {
        localStorage.setItem('soundSettings', JSON.stringify(settings));
    }

    // 深度合并对象
    function mergeDeep(target, source) {
        const output = Object.assign({}, target);
        if (isObject(target) && isObject(source)) {
            Object.keys(source).forEach(key => {
                if (isObject(source[key])) {
                    if (!(key in target)) Object.assign(output, { [key]: source[key] });
                    else output[key] = mergeDeep(target[key], source[key]);
                } else {
                    Object.assign(output, { [key]: source[key] });
                }
            });
        }
        return output;
    }

    function isObject(item) {
        return item && typeof item === 'object' && !Array.isArray(item);
    }

    // ========== 字卡拼接功能 ==========
    const DEFAULT_CARD_CONCAT_SETTINGS = {
        enabled: false,
        minCards: 2,
        maxCards: 5,
        probability: 30,
        momentEnabled: false,
        momentInterval: 30,
        momentMinCards: 3,
        momentMaxCards: 6,
        momentImgProbability: 50
    };

    function getCardConcatSettings() {
        try {
            const saved = localStorage.getItem('cardConcatSettings');
            if (saved) {
                return { ...DEFAULT_CARD_CONCAT_SETTINGS, ...JSON.parse(saved) };
            }
        } catch(e) {}
        return { ...DEFAULT_CARD_CONCAT_SETTINGS };
    }

    function saveCardConcatSettings(settings) {
        localStorage.setItem('cardConcatSettings', JSON.stringify(settings));
    }

    // 从字卡库随机抽取指定数量的字卡
    function drawRandomCards(count, library) {
        if (!library || library.length === 0) return [];
        const shuffled = [...library].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(count, shuffled.length));
    }

    // 拼接字卡为一句话
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

    // 获取主字卡库
    function getMainCardLibrary() {
        const library = getReplyLibrary();
        if (library.reply && library.reply.main) {
            return library.reply.main.filter(item => item && (typeof item === 'string' ? item.trim() : (item.text || item.content)));
        }
        return [];
    }

    // 生成拼接消息
    function generateConcatMessage() {
        const settings = getCardConcatSettings();
        if (!settings.enabled) return null;
        if (Math.random() * 100 > settings.probability) return null;

        const library = getMainCardLibrary();
        if (library.length < settings.minCards) return null;

        const count = Math.floor(Math.random() * (settings.maxCards - settings.minCards + 1)) + settings.minCards;
        const cards = drawRandomCards(count, library);
        if (cards.length < 2) return null;

        return concatCards(cards);
    }

    // 生成朋友圈拼接内容
    function generateMomentConcatContent() {
        const settings = getCardConcatSettings();
        if (!settings.momentEnabled) return null;

        const library = getMainCardLibrary();
        if (library.length < settings.momentMinCards) return null;

        const count = Math.floor(Math.random() * (settings.momentMaxCards - settings.momentMinCards + 1)) + settings.momentMinCards;
        const cards = drawRandomCards(count, library);
        if (cards.length < 2) return null;

        const text = concatCards(cards);
        const hasImage = Math.random() * 100 < settings.momentImgProbability;

        return { text, hasImage, images: [] };
    }

    // ========== 朋友圈数据管理 ==========
    function getMoments() {
        try {
            const saved = localStorage.getItem('moments');
            if (saved) return JSON.parse(saved);
        } catch(e) {}
        return [];
    }

    function saveMoments(moments) {
        localStorage.setItem('moments', JSON.stringify(moments));
    }

    // ========== 音效播放 ==========
    let audioContext = null;

    function getAudioContext() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        return audioContext;
    }

    function playBuiltinSound(soundKey, volume = 0.15) {
        const sound = BUILTIN_SOUNDS[soundKey];
        if (!sound || !sound.builtin) return false;

        try {
            const ctx = getAudioContext();
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.type = sound.type;
            oscillator.frequency.setValueAtTime(sound.frequency, ctx.currentTime);

            gainNode.gain.setValueAtTime(volume, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + sound.duration);

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + sound.duration);

            return true;
        } catch (e) {
            console.error('播放音效失败:', e);
            return false;
        }
    }

    function playSound(soundType) {
        const settings = getSoundSettings();
        const soundConfig = settings[soundType];
        if (!soundConfig) return;

        if (soundConfig.preset === 'mute') return;

        const volume = (soundConfig.volume || 15) / 100;

        // 优先播放自定义URL
        if (soundConfig.customUrl) {
            const audio = new Audio(soundConfig.customUrl);
            audio.volume = volume;
            audio.play().catch(() => {
                // 如果自定义播放失败，回退到内置音效
                playBuiltinSound(soundConfig.preset, volume);
            });
            return;
        }

        // 播放内置音效
        playBuiltinSound(soundConfig.preset, volume);
    }

    // ========== UI 初始化 ==========
    function initReplyLibraryUI() {
        // 确保默认数据存在
        if (!localStorage.getItem('customReplies')) {
            saveReplyLibrary(DEFAULT_REPLY_LIBRARY);
        }
        if (!localStorage.getItem('soundSettings')) {
            saveSoundSettings(DEFAULT_SOUNDS);
        }

        initCardConcatUI();
        initMomentUI();
    }

    // 字卡拼接UI初始化
    function initCardConcatUI() {
        const settings = getCardConcatSettings();

        // 主开关
        const toggle = document.getElementById('card-concat-toggle');
        const control = document.getElementById('card-concat-control');
        if (toggle) {
            const switchEl = toggle.querySelector('.setting-pill-switch');
            const knob = toggle.querySelector('.setting-pill-knob');
            if (settings.enabled) {
                if (switchEl) switchEl.style.background = 'var(--accent-color)';
                if (knob) knob.style.left = '23px';
                if (control) control.style.display = 'block';
            }
            toggle.addEventListener('click', function() {
                settings.enabled = !settings.enabled;
                if (switchEl) switchEl.style.background = settings.enabled ? 'var(--accent-color)' : 'var(--border-color)';
                if (knob) knob.style.left = settings.enabled ? '23px' : '3px';
                if (control) control.style.display = settings.enabled ? 'block' : 'none';
                saveCardConcatSettings(settings);
            });
        }

        // 最少条数
        const minSlider = document.getElementById('card-concat-min-slider');
        const minValue = document.getElementById('card-concat-min-value');
        if (minSlider && minValue) {
            minSlider.value = settings.minCards;
            minValue.textContent = settings.minCards + '条';
            minSlider.addEventListener('input', function() {
                settings.minCards = parseInt(this.value);
                minValue.textContent = settings.minCards + '条';
                if (settings.minCards > settings.maxCards) {
                    settings.maxCards = settings.minCards;
                    const maxSlider = document.getElementById('card-concat-max-slider');
                    const maxValue = document.getElementById('card-concat-max-value');
                    if (maxSlider) maxSlider.value = settings.maxCards;
                    if (maxValue) maxValue.textContent = settings.maxCards + '条';
                }
                saveCardConcatSettings(settings);
            });
        }

        // 最多条数
        const maxSlider = document.getElementById('card-concat-max-slider');
        const maxValue = document.getElementById('card-concat-max-value');
        if (maxSlider && maxValue) {
            maxSlider.value = settings.maxCards;
            maxValue.textContent = settings.maxCards + '条';
            maxSlider.addEventListener('input', function() {
                settings.maxCards = parseInt(this.value);
                maxValue.textContent = settings.maxCards + '条';
                saveCardConcatSettings(settings);
            });
        }

        // 概率
        const probSlider = document.getElementById('card-concat-prob-slider');
        const probValue = document.getElementById('card-concat-prob-value');
        if (probSlider && probValue) {
            probSlider.value = settings.probability;
            probValue.textContent = settings.probability + '%';
            probSlider.addEventListener('input', function() {
                settings.probability = parseInt(this.value);
                probValue.textContent = settings.probability + '%';
                saveCardConcatSettings(settings);
            });
        }

        // 朋友圈开关
        const momentToggle = document.getElementById('card-concat-moment-toggle');
        const momentControl = document.getElementById('card-concat-moment-control');
        if (momentToggle) {
            const switchEl = momentToggle.querySelector('.setting-pill-switch');
            const knob = momentToggle.querySelector('.setting-pill-knob');
            if (settings.momentEnabled) {
                if (switchEl) switchEl.style.background = 'var(--accent-color)';
                if (knob) knob.style.left = '23px';
                if (momentControl) momentControl.style.display = 'block';
            }
            momentToggle.addEventListener('click', function() {
                settings.momentEnabled = !settings.momentEnabled;
                if (switchEl) switchEl.style.background = settings.momentEnabled ? 'var(--accent-color)' : 'var(--border-color)';
                if (knob) knob.style.left = settings.momentEnabled ? '23px' : '3px';
                if (momentControl) momentControl.style.display = settings.momentEnabled ? 'block' : 'none';
                saveCardConcatSettings(settings);
                if (settings.momentEnabled) startMomentTimer();
                else stopMomentTimer();
            });
        }

        // 朋友圈间隔
        const intervalSlider = document.getElementById('card-concat-moment-interval-slider');
        const intervalValue = document.getElementById('card-concat-moment-interval-value');
        if (intervalSlider && intervalValue) {
            intervalSlider.value = settings.momentInterval;
            intervalValue.textContent = settings.momentInterval + '分钟';
            intervalSlider.addEventListener('input', function() {
                settings.momentInterval = parseInt(this.value);
                intervalValue.textContent = settings.momentInterval + '分钟';
                saveCardConcatSettings(settings);
                restartMomentTimer();
            });
        }

        // 朋友圈最少字卡
        const momentMinSlider = document.getElementById('card-concat-moment-min-slider');
        const momentMinValue = document.getElementById('card-concat-moment-min-value');
        if (momentMinSlider && momentMinValue) {
            momentMinSlider.value = settings.momentMinCards;
            momentMinValue.textContent = settings.momentMinCards + '条';
            momentMinSlider.addEventListener('input', function() {
                settings.momentMinCards = parseInt(this.value);
                momentMinValue.textContent = settings.momentMinCards + '条';
                if (settings.momentMinCards > settings.momentMaxCards) {
                    settings.momentMaxCards = settings.momentMinCards;
                    const maxSlider = document.getElementById('card-concat-moment-max-slider');
                    const maxValue = document.getElementById('card-concat-moment-max-value');
                    if (maxSlider) maxSlider.value = settings.momentMaxCards;
                    if (maxValue) maxValue.textContent = settings.momentMaxCards + '条';
                }
                saveCardConcatSettings(settings);
            });
        }

        // 朋友圈最多字卡
        const momentMaxSlider = document.getElementById('card-concat-moment-max-slider');
        const momentMaxValue = document.getElementById('card-concat-moment-max-value');
        if (momentMaxSlider && momentMaxValue) {
            momentMaxSlider.value = settings.momentMaxCards;
            momentMaxValue.textContent = settings.momentMaxCards + '条';
            momentMaxSlider.addEventListener('input', function() {
                settings.momentMaxCards = parseInt(this.value);
                momentMaxValue.textContent = settings.momentMaxCards + '条';
                saveCardConcatSettings(settings);
            });
        }

        // 朋友圈图片概率
        const imgProbSlider = document.getElementById('card-concat-moment-img-prob-slider');
        const imgProbValue = document.getElementById('card-concat-moment-img-prob-value');
        if (imgProbSlider && imgProbValue) {
            imgProbSlider.value = settings.momentImgProbability;
            imgProbValue.textContent = settings.momentImgProbability + '%';
            imgProbSlider.addEventListener('input', function() {
                settings.momentImgProbability = parseInt(this.value);
                imgProbValue.textContent = settings.momentImgProbability + '%';
                saveCardConcatSettings(settings);
            });
        }
    }

    // ========== 朋友圈定时器 ==========
    let momentTimer = null;

    function startMomentTimer() {
        stopMomentTimer();
        const settings = getCardConcatSettings();
        if (!settings.momentEnabled) return;

        const intervalMs = settings.momentInterval * 60 * 1000;
        momentTimer = setInterval(() => {
            autoPublishMoment();
        }, intervalMs);
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

    // 自动发布朋友圈
    function autoPublishMoment() {
        const content = generateMomentConcatContent();
        if (!content || !content.text) return;

        const moments = getMoments();
        const partnerName = (typeof settings !== 'undefined' && settings.partnerName) ? settings.partnerName : '梦角';
        const newMoment = {
            id: Date.now(),
            author: 'partner',
            authorName: partnerName,
            text: content.text,
            images: content.images,
            likes: [],
            comments: [],
            timestamp: Date.now()
        };
        moments.unshift(newMoment);
        saveMoments(moments);

        // 刷新朋友圈列表
        const momentModal = document.getElementById('moment-modal');
        if (momentModal && momentModal.classList.contains('active')) {
            renderMomentList();
        }

        // 显示通知
        if (typeof showNotification === 'function') {
            showNotification(partnerName + '发布了新动态 ✦', 'info');
        }
    }

    // ========== 朋友圈UI ==========
    function initMomentUI() {
        // 初始化朋友圈设置
        const savedSignature = localStorage.getItem('momentSignature');
        const signatureInput = document.getElementById('moment-signature-input');
        if (signatureInput && savedSignature) {
            signatureInput.value = savedSignature;
        }
    }

    function renderMomentList() {
        const list = document.getElementById('moment-list');
        if (!list) return;

        const moments = getMoments();
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
            const timeStr = date.getFullYear() + '-' + String(date.getMonth()+1).padStart(2,'0') + '-' + String(date.getDate()).padStart(2,'0') + ' ' + String(date.getHours()).padStart(2,'0') + ':' + String(date.getMinutes()).padStart(2,'0');

            let imagesHtml = '';
            if (moment.images && moment.images.length > 0) {
                const imgClass = moment.images.length === 1 ? 'single' : (moment.images.length === 2 ? 'double' : 'multiple');
                imagesHtml = `<div class="moment-item-images ${imgClass}">${moment.images.map(img => `<img src="${img}" onclick="window.open('${img}')">`).join('')}</div>`;
            }

            const isLiked = moment.likes && moment.likes.includes('me');

            let commentsHtml = '';
            if (moment.comments && moment.comments.length > 0) {
                commentsHtml = `<div class="moment-comments">${moment.comments.map(c => `<div class="moment-comment-item"><span class="moment-comment-name">${c.name}:</span> ${c.text}</div>`).join('')}</div>`;
            }

            return `
                <div class="moment-item" data-id="${moment.id}">
                    <div class="moment-item-avatar">
                        ${moment.author === 'partner' ? '<i class="fas fa-user" style="color:var(--accent-color);"></i>' : '<i class="fas fa-user-circle" style="color:var(--text-secondary);"></i>'}
                    </div>
                    <div class="moment-item-content">
                        <div class="moment-item-name">${moment.authorName || (moment.author === 'partner' ? '梦角' : '我')}</div>
                        <div class="moment-item-text">${moment.text}</div>
                        ${imagesHtml}
                        <div class="moment-item-meta">
                            <span>${timeStr}</span>
                            <div class="moment-item-actions">
                                <button class="${isLiked ? 'liked' : ''}" onclick="toggleLikeMoment(${moment.id})">
                                    <i class="fas fa-heart"></i> ${moment.likes ? moment.likes.length : 0}
                                </button>
                                <button onclick="commentMoment(${moment.id})">
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

    // ========== 导出/导入功能 ==========
    function exportData() {
        const data = {
            customReplies: getReplyLibrary(),
            soundSettings: getSoundSettings(),
            cardConcatSettings: getCardConcatSettings(),
            moments: getMoments(),
            exportTime: new Date().toISOString(),
            version: '1.0'
        };
        return JSON.stringify(data, null, 2);
    }

    function importData(jsonStr) {
        try {
            const data = JSON.parse(jsonStr);
            if (data.customReplies) saveReplyLibrary(data.customReplies);
            if (data.soundSettings) saveSoundSettings(data.soundSettings);
            if (data.cardConcatSettings) saveCardConcatSettings(data.cardConcatSettings);
            if (data.moments) saveMoments(data.moments);
            return true;
        } catch (e) {
            console.error('导入数据失败:', e);
            return false;
        }
    }

    // ========== 全局暴露 ==========
    window.getReplyLibrary = getReplyLibrary;
    window.saveReplyLibrary = saveReplyLibrary;
    window.getSoundSettings = getSoundSettings;
    window.saveSoundSettings = saveSoundSettings;
    window.playSound = playSound;
    window.getCardConcatSettings = getCardConcatSettings;
    window.saveCardConcatSettings = saveCardConcatSettings;
    window.generateConcatMessage = generateConcatMessage;
    window.generateMomentConcatContent = generateMomentConcatContent;
    window.getMoments = getMoments;
    window.saveMoments = saveMoments;
    window.renderMomentList = renderMomentList;
    window.autoPublishMoment = autoPublishMoment;
    window.startMomentTimer = startMomentTimer;
    window.stopMomentTimer = stopMomentTimer;
    window.exportData = exportData;
    window.importData = importData;
    window.initReplyLibraryUI = initReplyLibraryUI;

    // 朋友圈交互
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
        if (modal && typeof showModal === 'function') showModal(modal);
    };

    window.publishMoment = function() {
        const contentInput = document.getElementById('moment-content-input');
        const text = contentInput ? contentInput.value.trim() : '';
        if (!text) {
            if (typeof showNotification === 'function') showNotification('请输入内容', 'error');
            return;
        }

        const moments = getMoments();
        moments.unshift({
            id: Date.now(),
            author: 'me',
            authorName: '我',
            text: text,
            images: [],
            likes: [],
            comments: [],
            timestamp: Date.now()
        });
        saveMoments(moments);

        if (contentInput) contentInput.value = '';
        const modal = document.getElementById('publish-moment-modal');
        if (modal && typeof hideModal === 'function') hideModal(modal);
        renderMomentList();

        if (typeof showNotification === 'function') {
            showNotification('动态发布成功 ✦', 'success');
        }
    };

    window.openMomentSettings = function() {
        const modal = document.getElementById('moment-settings-modal');
        if (modal && typeof showModal === 'function') showModal(modal);
    };

    window.saveMomentSettings = function() {
        const signature = document.getElementById('moment-signature-input');
        if (signature) {
            localStorage.setItem('momentSignature', signature.value);
        }
        const modal = document.getElementById('moment-settings-modal');
        if (modal && typeof hideModal === 'function') hideModal(modal);
        if (typeof showNotification === 'function') {
            showNotification('设置已保存 ✦', 'success');
        }
    };

    window.openMomentModal = function() {
        const modal = document.getElementById('moment-modal');
        if (modal) {
            renderMomentList();
            if (typeof showModal === 'function') showModal(modal);
        }
    };

    // 初始化
    document.addEventListener('DOMContentLoaded', function() {
        initReplyLibraryUI();
        const settings = getCardConcatSettings();
        if (settings.momentEnabled) {
            startMomentTimer();
        }
    });

})();
