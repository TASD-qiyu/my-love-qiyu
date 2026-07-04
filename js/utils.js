/**
 * utils.js - 传讯应用工具函数库
 * 包含：DOM操作、动画、音效、数据导出导入、字卡拼接、朋友圈等核心工具
 */

// ==================== 全局命名空间 ====================
window.AppUtils = window.AppUtils || {};

// ==================== DOM 工具 ====================

/**
 * 安全获取元素
 */
function $(selector, context = document) {
    return context.querySelector(selector);
}

function $$(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
}

/**
 * 创建元素并设置属性
 */
function createElement(tag, attrs = {}, children = []) {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([key, val]) => {
        if (key === 'className') el.className = val;
        else if (key === 'innerHTML') el.innerHTML = val;
        else if (key === 'textContent') el.textContent = val;
        else if (key.startsWith('on') && typeof val === 'function') {
            el.addEventListener(key.slice(2).toLowerCase(), val);
        } else {
            el.setAttribute(key, val);
        }
    });
    children.forEach(child => {
        if (typeof child === 'string') el.appendChild(document.createTextNode(child));
        else if (child instanceof Node) el.appendChild(child);
    });
    return el;
}

/**
 * 切换元素显示/隐藏
 */
function toggleDisplay(el, show) {
    if (typeof el === 'string') el = $(el);
    if (!el) return;
    el.style.display = show ? '' : 'none';
}

/**
 * 切换类名
 */
function toggleClass(el, className, force) {
    if (typeof el === 'string') el = $(el);
    if (!el) return;
    if (force === undefined) el.classList.toggle(className);
    else el.classList.toggle(className, force);
}

// ==================== 动画工具 ====================

/**
 * 平滑滚动到元素
 */
function scrollToElement(el, behavior = 'smooth', block = 'end') {
    if (typeof el === 'string') el = $(el);
    if (el && el.scrollIntoView) {
        el.scrollIntoView({ behavior, block });
    }
}

/**
 * 打字机效果
 */
function typewriterEffect(element, text, speed = 50, callback) {
    if (typeof element === 'string') element = $(element);
    if (!element) return;
    element.textContent = '';
    let i = 0;
    const timer = setInterval(() => {
        element.textContent += text.charAt(i);
        i++;
        if (i >= text.length) {
            clearInterval(timer);
            if (callback) callback();
        }
    }, speed);
    return timer;
}

/**
 * 淡入动画
 */
function fadeIn(el, duration = 300, callback) {
    if (typeof el === 'string') el = $(el);
    if (!el) return;
    el.style.opacity = '0';
    el.style.display = '';
    el.style.transition = `opacity ${duration}ms ease`;
    requestAnimationFrame(() => {
        el.style.opacity = '1';
        setTimeout(() => {
            el.style.transition = '';
            if (callback) callback();
        }, duration);
    });
}

/**
 * 淡出动画
 */
function fadeOut(el, duration = 300, callback) {
    if (typeof el === 'string') el = $(el);
    if (!el) return;
    el.style.transition = `opacity ${duration}ms ease`;
    el.style.opacity = '0';
    setTimeout(() => {
        el.style.display = 'none';
        el.style.transition = '';
        if (callback) callback();
    }, duration);
}

/**
 * 震动动画
 */
function shakeElement(el, intensity = 5, duration = 300) {
    if (typeof el === 'string') el = $(el);
    if (!el) return;
    const original = el.style.transform;
    const start = Date.now();
    function frame() {
        const elapsed = Date.now() - start;
        if (elapsed >= duration) {
            el.style.transform = original;
            return;
        }
        const x = (Math.random() - 0.5) * intensity * 2;
        const y = (Math.random() - 0.5) * intensity;
        el.style.transform = `translate(${x}px, ${y}px)`;
        requestAnimationFrame(frame);
    }
    frame();
}

// ==================== 音效系统 ====================

/**
 * 音效管理器 - 内置音效 + 自定义音效
 */
const SoundManager = {
    audioContext: null,
    sounds: new Map(),
    volume: 0.15,
    enabled: true,

    /**
     * 初始化音频上下文
     */
    init() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    },

    /**
     * 生成内置音效 - 默认提示音
     */
    generateTone(type = 'default', duration = 0.15) {
        this.init();
        const ctx = this.audioContext;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        const tones = {
            default: { freq: 800, type: 'sine' },
            soft: { freq: 600, type: 'sine' },
            low: { freq: 400, type: 'triangle' },
            warm: { freq: 500, type: 'sine' },
            dark: { freq: 300, type: 'sawtooth' },
            haze: { freq: 700, type: 'sine' },
            kakaotalk: { freq: 900, type: 'sine' },
            poke: { freq: 1000, type: 'sine' },
            send: { freq: 1200, type: 'sine' },
            receive: { freq: 800, type: 'sine' },
            invite: { freq: 600, type: 'sine' },
            videocall: { freq: 500, type: 'sine' }
        };

        const tone = tones[type] || tones.default;
        osc.frequency.setValueAtTime(tone.freq, ctx.currentTime);
        osc.type = tone.type;

        gain.gain.setValueAtTime(this.volume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + duration);

        return { osc, gain };
    },

    /**
     * 播放音效
     */
    play(type = 'default', customUrl = null) {
        if (!this.enabled) return;

        if (customUrl) {
            this.playCustom(customUrl);
            return;
        }

        this.generateTone(type);
    },

    /**
     * 播放自定义音效
     */
    playCustom(url) {
        if (!this.enabled) return;
        const audio = new Audio(url);
        audio.volume = this.volume;
        audio.play().catch(() => {});
    },

    /**
     * 设置音量
     */
    setVolume(vol) {
        this.volume = Math.max(0, Math.min(1, vol));
    },

    /**
     * 开关音效
     */
    toggle(enable) {
        this.enabled = enable !== undefined ? enable : !this.enabled;
        return this.enabled;
    },

    /**
     * 上传音效文件并转为DataURL
     */
    async uploadSound(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
};

// 绑定到全局
window.SoundManager = SoundManager;

// ==================== 数据导出导入 ====================

/**
 * 数据管理器 - 导出导入所有应用数据
 */
const DataManager = {
    /**
     * 获取所有应用数据
     */
    getAllData() {
        const data = {};
        const keys = [
            'settings', 'messages', 'customReplies', 'moodData',
            'anniversaryData', 'fortuneHistory', 'companionData',
            'companionDiary', 'envelopeData', 'moments',
            'cardConcatSettings', 'sessionData', 'themeSchemes',
            'soundSettings', 'chatSettings', 'appearanceSettings',
            'stickerData', 'pokeLibrary', 'atmosphereData',
            'dailyGreetingData', 'groupChatData', 'visitorRecords'
        ];
        keys.forEach(key => {
            try {
                const val = localStorage.getItem(key);
                if (val) data[key] = JSON.parse(val);
            } catch (e) {}
        });

        // 包含内置字卡库
        data._builtInCardLibrary = this.getBuiltInCardLibrary();
        data._builtInSounds = this.getBuiltInSoundManifest();

        return data;
    },

    /**
     * 导出数据为JSON文件
     */
    exportData(filename = '传讯备份_' + formatDate(new Date(), 'yyyyMMdd_HHmmss') + '.json') {
        const data = this.getAllData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
        return data;
    },

    /**
     * 导入数据
     */
    importData(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            Object.entries(data).forEach(([key, val]) => {
                if (key.startsWith('_')) return; // 跳过元数据
                localStorage.setItem(key, JSON.stringify(val));
            });
            return { success: true, data };
        } catch (e) {
            return { success: false, error: e.message };
        }
    },

    /**
     * 导出字卡库
     */
    exportCardLibrary() {
        const library = this.getCardLibrary();
        const blob = new Blob([JSON.stringify(library, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = '字卡库_' + formatDate(new Date(), 'yyyyMMdd') + '.json';
        a.click();
        URL.revokeObjectURL(url);
    },

    /**
     * 导入字卡库
     */
    importCardLibrary(jsonString) {
        try {
            const library = JSON.parse(jsonString);
            localStorage.setItem('customReplies', JSON.stringify(library));
            return { success: true };
        } catch (e) {
            return { success: false, error: e.message };
        }
    },

    /**
     * 获取字卡库
     */
    getCardLibrary() {
        try {
            const saved = localStorage.getItem('customReplies');
            if (saved) return JSON.parse(saved);
        } catch (e) {}
        return { reply: { main: [] }, atmosphere: {}, announcement: {} };
    },

    /**
     * 内置字卡库 - 默认数据
     */
    getBuiltInCardLibrary() {
        return {
            reply: {
                main: [
                    { text: '想你了', tags: [] },
                    { text: '今天过得怎么样？', tags: [] },
                    { text: '我在呢', tags: [] },
                    { text: '抱抱你', tags: [] },
                    { text: '要照顾好自己哦', tags: [] },
                    { text: '会一直陪着你的', tags: [] },
                    { text: '笨蛋', tags: [] },
                    { text: '好可爱', tags: [] },
                    { text: '最喜欢你了', tags: [] },
                    { text: '等你回来', tags: [] },
                    { text: '嗯嗯', tags: [] },
                    { text: '知道啦', tags: [] },
                    { text: '别担心', tags: [] },
                    { text: '有我在', tags: [] },
                    { text: '乖', tags: [] },
                    { text: '好想见你', tags: [] },
                    { text: '今天也很想你', tags: [] },
                    { text: '要开心呀', tags: [] },
                    { text: '爱你', tags: [] },
                    { text: '早点休息', tags: [] }
                ]
            },
            atmosphere: {
                poke: [
                    '拍了拍', '戳了戳', '捏了捏', '揉了揉',
                    '摸了摸头', '抱了抱', '亲了亲', '牵了牵手'
                ],
                status: [
                    '在想你', '忙碌中', '等你', '发呆',
                    '听音乐', '画画', '写作', '散步'
                ],
                motto: [
                    '爱是永恒', '思念如潮', '心有灵犀',
                    '天涯若比邻', '执子之手', '与子偕老'
                ],
                opening: [
                    '正在连接我们的思绪',
                    '思念的电波已连接',
                    '跨越时空的问候',
                    '今日份想念已送达'
                ]
            }
        };
    },

    /**
     * 内置音效清单
     */
    getBuiltInSoundManifest() {
        return {
            tones: ['default', 'soft', 'low', 'warm', 'dark', 'haze', 'kakaotalk'],
            categories: {
                mySend: '我发出的消息',
                partnerMessage: '对方发来的消息',
                myPoke: '我拍一拍',
                partnerPoke: '对方拍一拍',
                inviteStudy: '陪我学习邀请',
                inviteWork: '陪我工作邀请',
                inviteExercise: '陪我运动邀请',
                inviteSleep: '陪我睡觉邀请',
                inviteVideocall: '视频通话邀请'
            }
        };
    },

    /**
     * 计算存储用量
     */
    getStorageUsage() {
        let total = 0;
        const details = { messages: 0, settings: 0, media: 0 };

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const val = localStorage.getItem(key);
            const size = new Blob([val]).size;
            total += size;

            if (key === 'messages' || key.includes('chat')) details.messages += size;
            else if (key.includes('setting') || key.includes('config')) details.settings += size;
            else details.media += size;
        }

        return {
            total,
            totalMB: (total / 1024 / 1024).toFixed(2),
            details: {
                messages: (details.messages / 1024 / 1024).toFixed(2),
                settings: (details.settings / 1024 / 1024).toFixed(2),
                media: (details.media / 1024 / 1024).toFixed(2)
            }
        };
    },

    /**
     * 清除所有数据
     */
    clearAllData() {
        localStorage.clear();
    },

    /**
     * 清除会话数据
     */
    clearSession() {
        localStorage.removeItem('messages');
        localStorage.removeItem('sessionData');
    }
};

window.DataManager = DataManager;

// ==================== 字卡拼接功能 ====================

/**
 * 字卡拼接器 - 将多条字卡拼接成一句话
 */
const CardConcatenator = {
    /**
     * 默认设置
     */
    defaultSettings: {
        enabled: false,
        minCards: 2,
        maxCards: 5,
        probability: 30,
        momentEnabled: false,
        momentInterval: 30,
        momentMinCards: 3,
        momentMaxCards: 6,
        momentImgProbability: 50
    },

    /**
     * 获取当前设置
     */
    getSettings() {
        try {
            const saved = localStorage.getItem('cardConcatSettings');
            if (saved) return { ...this.defaultSettings, ...JSON.parse(saved) };
        } catch (e) {}
        return { ...this.defaultSettings };
    },

    /**
     * 保存设置
     */
    saveSettings(settings) {
        localStorage.setItem('cardConcatSettings', JSON.stringify(settings));
    },

    /**
     * 从字卡库随机抽取
     */
    drawRandomCards(count, library) {
        if (!library || library.length === 0) return [];
        const shuffled = [...library].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(count, shuffled.length));
    },

    /**
     * 获取主字卡库
     */
    getMainLibrary() {
        const data = DataManager.getCardLibrary();
        if (data.reply && data.reply.main) {
            return data.reply.main.filter(item => {
                if (typeof item === 'string') return item.trim();
                return item && (item.text || item.content);
            });
        }
        return [];
    },

    /**
     * 拼接字卡为一句话
     */
    concatCards(cards) {
        if (!cards || cards.length === 0) return '';

        const connectors = ['，', '。', '！', '？', '……', '；', ''];
        let result = '';

        cards.forEach((card, index) => {
            let text = typeof card === 'string' ? card : (card.text || card.content || '');
            if (!text) return;

            // 清理首尾标点
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

        // 添加结尾标点
        const endPunctuations = ['。', '！', '？', '……', '～'];
        if (!/[。！？…~～]$/.test(result)) {
            result += endPunctuations[Math.floor(Math.random() * endPunctuations.length)];
        }

        return result;
    },

    /**
     * 生成拼接消息
     */
    generateMessage() {
        const settings = this.getSettings();
        if (!settings.enabled) return null;

        // 概率检查
        if (Math.random() * 100 > settings.probability) return null;

        const library = this.getMainLibrary();
        if (library.length < settings.minCards) return null;

        const count = Math.floor(
            Math.random() * (settings.maxCards - settings.minCards + 1)
        ) + settings.minCards;

        const cards = this.drawRandomCards(count, library);
        if (cards.length < 2) return null;

        return this.concatCards(cards);
    },

    /**
     * 生成朋友圈拼接内容
     */
    generateMomentContent() {
        const settings = this.getSettings();
        if (!settings.momentEnabled) return null;

        const library = this.getMainLibrary();
        if (library.length < settings.momentMinCards) return null;

        const count = Math.floor(
            Math.random() * (settings.momentMaxCards - settings.momentMinCards + 1)
        ) + settings.momentMinCards;

        const cards = this.drawRandomCards(count, library);
        if (cards.length < 2) return null;

        const text = this.concatCards(cards);
        const hasImage = Math.random() * 100 < settings.momentImgProbability;

        return { text, hasImage, images: [] };
    }
};

window.CardConcatenator = CardConcatenator;

// ==================== 朋友圈系统 ====================

/**
 * 朋友圈管理器
 */
const MomentManager = {
    /**
     * 获取所有动态
     */
    getMoments() {
        try {
            const saved = localStorage.getItem('moments');
            if (saved) return JSON.parse(saved);
        } catch (e) {}
        return [];
    },

    /**
     * 保存动态
     */
    saveMoments(moments) {
        localStorage.setItem('moments', JSON.stringify(moments));
    },

    /**
     * 发布动态
     */
    publish(text, images = [], author = 'me') {
        const moments = this.getMoments();
        const partnerName = (window.settings && window.settings.partnerName) || '梦角';

        const newMoment = {
            id: Date.now(),
            author,
            authorName: author === 'partner' ? partnerName : '我',
            text,
            images: images || [],
            likes: [],
            comments: [],
            timestamp: Date.now()
        };

        moments.unshift(newMoment);
        this.saveMoments(moments);

        // 触发更新事件
        window.dispatchEvent(new CustomEvent('momentsUpdated', { detail: newMoment }));

        return newMoment;
    },

    /**
     * 自动发布（字卡拼接）
     */
    autoPublish() {
        const content = CardConcatenator.generateMomentContent();
        if (!content || !content.text) return null;

        return this.publish(content.text, content.images, 'partner');
    },

    /**
     * 点赞
     */
    toggleLike(momentId) {
        const moments = this.getMoments();
        const moment = moments.find(m => m.id === momentId);
        if (!moment) return false;

        if (!moment.likes) moment.likes = [];
        const idx = moment.likes.indexOf('me');

        if (idx > -1) {
            moment.likes.splice(idx, 1);
        } else {
            moment.likes.push('me');
        }

        this.saveMoments(moments);
        return idx === -1; // 返回是否已点赞
    },

    /**
     * 评论
     */
    addComment(momentId, text, name = '我') {
        const moments = this.getMoments();
        const moment = moments.find(m => m.id === momentId);
        if (!moment) return null;

        if (!moment.comments) moment.comments = [];
        const comment = {
            name,
            text: text.trim(),
            timestamp: Date.now()
        };

        moment.comments.push(comment);
        this.saveMoments(moments);
        return comment;
    },

    /**
     * 删除动态
     */
    deleteMoment(momentId) {
        let moments = this.getMoments();
        moments = moments.filter(m => m.id !== momentId);
        this.saveMoments(moments);
    },

    /**
     * 获取设置
     */
    getSettings() {
        try {
            const saved = localStorage.getItem('momentSettings');
            if (saved) return JSON.parse(saved);
        } catch (e) {}
        return {
            coverImage: null,
            signature: '',
            avatarFrame: null
        };
    },

    /**
     * 保存设置
     */
    saveSettings(settings) {
        localStorage.setItem('momentSettings', JSON.stringify(settings));
    },

    /**
     * 获取访客记录
     */
    getVisitorRecords() {
        try {
            const saved = localStorage.getItem('visitorRecords');
            if (saved) return JSON.parse(saved);
        } catch (e) {}
        return [];
    },

    /**
     * 添加访客记录
     */
    addVisitorRecord(visitor) {
        const records = this.getVisitorRecords();
        records.unshift({
            name: visitor.name || '梦角',
            avatar: visitor.avatar,
            timestamp: Date.now()
        });
        // 保留最近50条
        if (records.length > 50) records.pop();
        localStorage.setItem('visitorRecords', JSON.stringify(records));
    },

    /**
     * 清空访客记录
     */
    clearVisitorRecords() {
        localStorage.removeItem('visitorRecords');
    }
};

window.MomentManager = MomentManager;

// ==================== 定时器管理 ====================

/**
 * 朋友圈自动发布定时器
 */
const MomentTimer = {
    timer: null,

    start() {
        this.stop();
        const settings = CardConcatenator.getSettings();
        if (!settings.momentEnabled) return;

        const intervalMs = settings.momentInterval * 60 * 1000;
        this.timer = setInterval(() => {
            MomentManager.autoPublish();
        }, intervalMs);
    },

    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    },

    restart() {
        this.start();
    }
};

window.MomentTimer = MomentTimer;

// ==================== 日期时间工具 ====================

/**
 * 格式化日期
 */
function formatDate(date, fmt = 'yyyy-MM-dd HH:mm:ss') {
    if (!(date instanceof Date)) date = new Date(date);
    const o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'H+': date.getHours(),
        'h+': date.getHours() % 12 || 12,
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        'q+': Math.floor((date.getMonth() + 3) / 3),
        'S': date.getMilliseconds()
    };

    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }

    Object.entries(o).forEach(([k, v]) => {
        const re = new RegExp('(' + k + ')');
        if (re.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? v : ('00' + v).substr(('' + v).length));
        }
    });

    return fmt;
}

/**
 * 获取相对时间描述
 */
function getRelativeTime(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const week = 7 * day;

    if (diff < minute) return '刚刚';
    if (diff < hour) return Math.floor(diff / minute) + '分钟前';
    if (diff < day) return Math.floor(diff / hour) + '小时前';
    if (diff < week) return Math.floor(diff / day) + '天前';
    return formatDate(timestamp, 'yyyy-MM-dd');
}

/**
 * 获取星期几
 */
function getWeekDay(date) {
    const days = ['日', '一', '二', '三', '四', '五', '六'];
    return days[new Date(date).getDay()];
}

// ==================== 字符串工具 ====================

/**
 * 截断文本
 */
function truncate(str, maxLength, suffix = '...') {
    if (!str) return '';
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength) + suffix;
}

/**
 * 转义HTML
 */
function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * 随机从数组中取一个
 */
function randomPick(arr) {
    if (!arr || arr.length === 0) return null;
    return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * 打乱数组
 */
function shuffle(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
}

/**
 * 生成唯一ID
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// ==================== 文件工具 ====================

/**
 * 读取文件为DataURL
 */
function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * 读取文件为文本
 */
function readFileAsText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsText(file);
    });
}

/**
 * 下载文本文件
 */
function downloadText(text, filename) {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

/**
 * 下载JSON文件
 */
function downloadJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

// ==================== 图片工具 ====================

/**
 * 压缩图片
 */
function compressImage(dataURL, maxWidth = 800, quality = 0.8) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let { width, height } = img;

            if (width > maxWidth) {
                height = (maxWidth / width) * height;
                width = maxWidth;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.src = dataURL;
    });
}

/**
 * 获取图片尺寸
 */
function getImageSize(dataURL) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve({ width: img.width, height: img.height });
        img.src = dataURL;
    });
}

// ==================== 通知工具 ====================

/**
 * 显示通知
 */
function showNotification(message, type = 'info', duration = 3000) {
    // 移除已有通知
    const existing = $('.app-notification');
    if (existing) existing.remove();

    const icons = {
        info: 'fa-info-circle',
        success: 'fa-check-circle',
        warning: 'fa-exclamation-triangle',
        error: 'fa-times-circle'
    };

    const colors = {
        info: 'var(--accent-color)',
        success: '#4caf50',
        warning: '#ff9800',
        error: '#f44336'
    };

    const el = createElement('div', {
        className: 'app-notification',
        style: `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(-100px);
            background: var(--secondary-bg);
            color: var(--text-primary);
            padding: 12px 20px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 9999;
            font-size: 14px;
            border: 1px solid var(--border-color);
            transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            max-width: 80vw;
            word-break: break-word;
        `
    }, [
        createElement('i', {
            className: `fas ${icons[type] || icons.info}`,
            style: `color: ${colors[type] || colors.info}; font-size: 16px;`
        }),
        createElement('span', { textContent: message })
    ]);

    document.body.appendChild(el);

    requestAnimationFrame(() => {
        el.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(() => {
        el.style.transform = 'translateX(-50%) translateY(-100px)';
        setTimeout(() => el.remove(), 300);
    }, duration);
}

// ==================== 模态框工具 ====================

/**
 * 显示模态框
 */
function showModal(modal, focusEl) {
    if (typeof modal === 'string') modal = $(modal);
    if (!modal) return;

    modal.classList.add('active');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    if (focusEl) {
        setTimeout(() => {
            if (typeof focusEl === 'string') focusEl = $(focusEl);
            if (focusEl) focusEl.focus();
        }, 100);
    }

    // 触发事件
    modal.dispatchEvent(new CustomEvent('modalShow'));
}

/**
 * 隐藏模态框
 */
function hideModal(modal) {
    if (typeof modal === 'string') modal = $(modal);
    if (!modal) return;

    modal.classList.remove('active');
    modal.style.display = 'none';
    document.body.style.overflow = '';

    // 触发事件
    modal.dispatchEvent(new CustomEvent('modalHide'));
}

/**
 * 切换模态框
 */
function toggleModal(modal) {
    if (typeof modal === 'string') modal = $(modal);
    if (!modal) return;

    if (modal.classList.contains('active')) {
        hideModal(modal);
    } else {
        showModal(modal);
    }
}

// ==================== 防抖节流 ====================

/**
 * 防抖
 */
function debounce(fn, delay = 300) {
    let timer;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

/**
 * 节流
 */
function throttle(fn, limit = 300) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            fn.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ==================== 本地存储封装 ====================

/**
 * 安全获取localStorage
 */
function storageGet(key, defaultValue = null) {
    try {
        const val = localStorage.getItem(key);
        return val ? JSON.parse(val) : defaultValue;
    } catch (e) {
        return defaultValue;
    }
}

/**
 * 安全设置localStorage
 */
function storageSet(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (e) {
        console.error('Storage set error:', e);
        return false;
    }
}

/**
 * 安全移除localStorage
 */
function storageRemove(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (e) {
        return false;
    }
}

// ==================== 主题工具 ====================

/**
 * 获取CSS变量值
 */
function getCssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/**
 * 设置CSS变量
 */
function setCssVar(name, value) {
    document.documentElement.style.setProperty(name, value);
}

/**
 * 获取RGB值
 */
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

/**
 * 颜色变亮/变暗
 */
function adjustColor(hex, amount) {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;

    const clamp = (val) => Math.min(255, Math.max(0, val));
    const r = clamp(rgb.r + amount);
    const g = clamp(rgb.g + amount);
    const b = clamp(rgb.b + amount);

    return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
}

// ==================== 触摸手势 ====================

/**
 * 简单的滑动手势检测
 */
function addSwipeListener(el, callbacks = {}) {
    if (typeof el === 'string') el = $(el);
    if (!el) return;

    let startX, startY, startTime;

    el.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        startTime = Date.now();
    }, { passive: true });

    el.addEventListener('touchend', (e) => {
        if (!startX || !startY) return;

        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const diffX = startX - endX;
        const diffY = startY - endY;
        const elapsed = Date.now() - startTime;

        // 快速滑动判定
        if (elapsed > 300) return;

        const threshold = 50;

        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (Math.abs(diffX) > threshold) {
                if (diffX > 0 && callbacks.left) callbacks.left();
                else if (diffX < 0 && callbacks.right) callbacks.right();
            }
        } else {
            if (Math.abs(diffY) > threshold) {
                if (diffY > 0 && callbacks.up) callbacks.up();
                else if (diffY < 0 && callbacks.down) callbacks.down();
            }
        }

        startX = startY = null;
    }, { passive: true });
}

// ==================== 初始化 ====================

/**
 * 初始化字卡拼接定时器
 */
function initCardConcatTimer() {
    const settings = CardConcatenator.getSettings();
    if (settings.momentEnabled) {
        MomentTimer.start();
    }
}

/**
 * 导出所有工具到全局
 */
window.$ = $;
window.$$ = $$;
window.createElement = createElement;
window.toggleDisplay = toggleDisplay;
window.toggleClass = toggleClass;
window.scrollToElement = scrollToElement;
window.typewriterEffect = typewriterEffect;
window.fadeIn = fadeIn;
window.fadeOut = fadeOut;
window.shakeElement = shakeElement;
window.formatDate = formatDate;
window.getRelativeTime = getRelativeTime;
window.getWeekDay = getWeekDay;
window.truncate = truncate;
window.escapeHtml = escapeHtml;
window.randomPick = randomPick;
window.shuffle = shuffle;
window.generateId = generateId;
window.readFileAsDataURL = readFileAsDataURL;
window.readFileAsText = readFileAsText;
window.downloadText = downloadText;
window.downloadJSON = downloadJSON;
window.compressImage = compressImage;
window.getImageSize = getImageSize;
window.showNotification = showNotification;
window.showModal = showModal;
window.hideModal = hideModal;
window.toggleModal = toggleModal;
window.debounce = debounce;
window.throttle = throttle;
window.storageGet = storageGet;
window.storageSet = storageSet;
window.storageRemove = storageRemove;
window.getCssVar = getCssVar;
window.setCssVar = setCssVar;
window.hexToRgb = hexToRgb;
window.adjustColor = adjustColor;
window.addSwipeListener = addSwipeListener;
window.initCardConcatTimer = initCardConcatTimer;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    initCardConcatTimer();
});

console.log('✦ utils.js loaded - 传讯工具库已就绪');
