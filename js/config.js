/**
 * config.js - 传讯应用配置文件
 * 包含内置音效、字卡库、系统配置等
 */

const CONFIG = {
    version: '2.0.0',
    appName: '传讯',

    // ========== 内置音效配置 ==========
    sounds: {
        // 内置音效 - 使用 Base64 编码的短音频（实际使用时建议替换为真实音频文件）
        builtIn: {
            // 默认消息音效
            default: {
                name: '内置：默认',
                type: 'tone',
                // 使用 Web Audio API 生成的简单提示音
                frequency: 800,
                duration: 0.15,
                type_wave: 'sine'
            },
            soft: {
                name: '内置：柔和',
                type: 'tone',
                frequency: 600,
                duration: 0.2,
                type_wave: 'sine'
            },
            low: {
                name: '内置：低沉',
                type: 'tone',
                frequency: 300,
                duration: 0.25,
                type_wave: 'triangle'
            },
            warm: {
                name: '内置：厚暖',
                type: 'tone',
                frequency: 500,
                duration: 0.3,
                type_wave: 'sine'
            },
            dark: {
                name: '内置：暗夜',
                type: 'tone',
                frequency: 200,
                duration: 0.4,
                type_wave: 'sawtooth'
            },
            haze: {
                name: '内置：雾感',
                type: 'tone',
                frequency: 450,
                duration: 0.35,
                type_wave: 'sine'
            },
            // kakaotalk 风格音效
            kakaotalk: {
                name: 'kakaotalk',
                type: 'tone',
                frequency: 700,
                duration: 0.1,
                type_wave: 'sine'
            }
        },

        // 邀请音效
        invite: {
            study: { name: '陪我学习', preset: 'default' },
            work: { name: '陪我工作', preset: 'default' },
            exercise: { name: '陪我运动', preset: 'default' },
            sleep: { name: '陪我睡觉', preset: 'soft' },
            videocall: { name: '视频通话', preset: 'default' }
        }
    },

    // ========== 内置字卡库 ==========
    defaultReplies: {
        reply: {
            main: [
                { id: 'r1', text: '我在想你', group: 'default' },
                { id: 'r2', text: '今天过得怎么样？', group: 'default' },
                { id: 'r3', text: '记得按时吃饭', group: 'default' },
                { id: 'r4', text: '想你了', group: 'default' },
                { id: 'r5', text: '晚安，好梦', group: 'default' },
                { id: 'r6', text: '早安，今天也要元气满满', group: 'default' },
                { id: 'r7', text: '我一直在', group: 'default' },
                { id: 'r8', text: '别太累了，注意休息', group: 'default' },
                { id: 'r9', text: '你的消息就是我最好的礼物', group: 'default' },
                { id: 'r10', text: '想听听你的声音', group: 'default' },
                { id: 'r11', text: '今天有想我吗？', group: 'default' },
                { id: 'r12', text: '你是我最重要的人', group: 'default' },
                { id: 'r13', text: '不管发生什么，我都在你身边', group: 'default' },
                { id: 'r14', text: '你的笑容是我最大的幸福', group: 'default' },
                { id: 'r15', text: '想和你一起看星星', group: 'default' },
                { id: 'r16', text: '今天也要开心哦', group: 'default' },
                { id: 'r17', text: '你是最棒的', group: 'default' },
                { id: 'r18', text: '等你的消息', group: 'default' },
                { id: 'r19', text: '想抱你', group: 'default' },
                { id: 'r20', text: '你是我生命中的光', group: 'default' },
                { id: 'r21', text: '有你在，一切都好', group: 'default' },
                { id: 'r22', text: '想和你一起去旅行', group: 'default' },
                { id: 'r23', text: '你的存在让我的世界更美好', group: 'default' },
                { id: 'r24', text: '想牵你的手', group: 'default' },
                { id: 'r25', text: '你是我最珍贵的宝藏', group: 'default' },
                { id: 'r26', text: '今天也想见到你', group: 'default' },
                { id: 'r27', text: '想和你一起慢慢变老', group: 'default' },
                { id: 'r28', text: '你的每一个瞬间我都想珍藏', group: 'default' },
                { id: 'r29', text: '想和你分享生活中的点点滴滴', group: 'default' },
                { id: 'r30', text: '你是我心中最美的风景', group: 'default' }
            ],
            atmosphere: [
                { id: 'a1', text: '正在连接我们的思绪 ✧', group: 'default' },
                { id: 'a2', text: 'Love', group: 'default' },
                { id: 'a3', text: '若要由我来谈论爱的话', group: 'default' },
                { id: 'a4', text: 'Echo', group: 'default' },
                { id: 'a5', text: '听见我的回音了吗？', group: 'default' },
                { id: 'a6', text: 'Soulmate', group: 'default' },
                { id: 'a7', text: '灵魂正在共振', group: 'default' },
                { id: 'a8', text: '在想你', group: 'default' },
                { id: 'a9', text: '我们的频率一致', group: 'default' },
                { id: 'a10', text: '心跳同步中...', group: 'default' }
            ]
        },

        // 拍一拍动作库
        poke: [
            { id: 'p1', text: '拍了拍', group: 'default' },
            { id: 'p2', text: '戳了戳', group: 'default' },
            { id: 'p3', text: '捏了捏', group: 'default' },
            { id: 'p4', text: '摸了摸', group: 'default' },
            { id: 'p5', text: '抱了抱', group: 'default' },
            { id: 'p6', text: '亲了亲', group: 'default' },
            { id: 'p7', text: '揉了揉', group: 'default' },
            { id: 'p8', text: '拉了拉', group: 'default' }
        ],

        // 摸鱼活动库
        slack: {
            activities: [
                { id: 'sa1', text: '和小鱼们玩', group: 'default' },
                { id: 'sa2', text: '抓娃娃', group: 'default' },
                { id: 'sa3', text: '做饭', group: 'default' },
                { id: 'sa4', text: '逛海滩', group: 'default' },
                { id: 'sa5', text: '写信', group: 'default' },
                { id: 'sa6', text: '画画', group: 'default' },
                { id: 'sa7', text: '听音乐', group: 'default' },
                { id: 'sa8', text: '看书', group: 'default' }
            ],
            locations: [
                { id: 'sl1', text: '卧室', group: 'default' },
                { id: 'sl2', text: '客厅', group: 'default' },
                { id: 'sl3', text: '阳台', group: 'default' },
                { id: 'sl4', text: '厨房', group: 'default' },
                { id: 'sl5', text: '书房', group: 'default' }
            ]
        }
    },

    // ========== 字卡拼接配置 ==========
    cardConcat: {
        enabled: false,
        minCards: 2,
        maxCards: 5,
        probability: 30,
        // 连接词库
        connectors: ['，', '。', '！', '？', '……', '；', ''],
        // 结尾标点
        endPunctuations: ['。', '！', '？', '……', '～'],
        // 朋友圈自动发布
        moment: {
            enabled: false,
            interval: 30, // 分钟
            minCards: 3,
            maxCards: 6,
            imgProbability: 50
        }
    },

    // ========== 朋友圈配置 ==========
    moment: {
        enabled: true,
        // 默认封面
        defaultCover: 'linear-gradient(135deg, rgba(var(--accent-color-rgb),0.3), rgba(var(--accent-color-rgb),0.1))',
        // 默认签名
        defaultSignature: '',
        // 自动发布配置
        autoPublish: {
            enabled: false,
            interval: 30, // 分钟
            minCards: 3,
            maxCards: 6,
            imgProbability: 50
        }
    },

    // ========== 主题配置 ==========
    themes: {
        gold: { name: '金色', color: '#c5a47e', rgb: '197,164,126' },
        blue: { name: '蓝色', color: '#6b9dc7', rgb: '107,157,199' },
        purple: { name: '紫色', color: '#9b7dc7', rgb: '155,125,199' },
        green: { name: '绿色', color: '#7dc79b', rgb: '125,199,155' },
        pink: { name: '粉色', color: '#c79bb7', rgb: '199,155,183' },
        'black-white': { name: '黑白', color: '#333333', rgb: '51,51,51' },
        pastel: { name: '红色', color: '#c77d7d', rgb: '199,125,125' },
        sunset: { name: '橙色', color: '#c7a07d', rgb: '199,160,125' },
        forest: { name: '深绿', color: '#5a8a6a', rgb: '90,138,106' },
        ocean: { name: '深蓝', color: '#5a7a9a', rgb: '90,122,154' }
    },

    // ========== 默认设置 ==========
    defaults: {
        partnerName: '梦角',
        myName: '我',
        fontSize: 16,
        bubbleStyle: 'standard',
        theme: 'black-white',
        showAvatar: true,
        alwaysShowAvatar: false,
        avatarSize: 36,
        avatarPosition: 'center',
        avatarShape: 'circle',
        avatarCornerRadius: 8,
        showReadReceipts: true,
        readReceiptStyle: 'icon',
        showTypingIndicator: true,
        enableReply: true,
        enableSound: true,
        soundVolume: 15,
        replyDelayMin: 3000,
        replyDelayMax: 7000,
        autoSend: false,
        autoSendInterval: 5,
        emojiMix: false,
        timeFormat: 'HH:mm',
        immersiveMode: false,
        bottomCollapse: false,
        headerOpacity: true,
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
        }
    },

    // ========== 存储键名 ==========
    storageKeys: {
        settings: 'settings',
        messages: 'messages',
        customReplies: 'customReplies',
        moodData: 'moodData',
        anniversary: 'anniversary',
        sessions: 'sessions',
        companionData: 'companionData',
        companionDiary: 'companionDiary',
        themeSchemes: 'themeSchemes',
        dailyGreeting: 'dailyGreeting',
        envelope: 'envelope',
        moments: 'moments',
        cardConcatSettings: 'cardConcatSettings',
        momentSettings: 'momentSettings',
        visitorRecords: 'visitorRecords',
        divinationHistory: 'divinationHistory',
        favorites: 'favorites',
        soundSettings: 'soundSettings',
        stickerLibrary: 'stickerLibrary'
    }
};

// ========== 音效播放器 ==========
const SoundPlayer = {
    audioContext: null,
    volume: 0.15,
    enabled: true,

    init() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    },

    // 播放内置音效
    playBuiltIn(soundKey) {
        if (!this.enabled) return;
        this.init();

        const sound = CONFIG.sounds.builtIn[soundKey];
        if (!sound || sound.type !== 'tone') return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.type = sound.type_wave || 'sine';
        oscillator.frequency.setValueAtTime(sound.frequency, this.audioContext.currentTime);

        gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + sound.duration);

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + sound.duration);
    },

    // 播放自定义 URL 音效
    playUrl(url) {
        if (!this.enabled || !url) return;

        const audio = new Audio(url);
        audio.volume = this.volume;
        audio.play().catch(() => {});
    },

    // 测试音效
    test(soundKeyOrUrl) {
        if (soundKeyOrUrl.startsWith('http') || soundKeyOrUrl.startsWith('data:') || soundKeyOrUrl.startsWith('blob:')) {
            this.playUrl(soundKeyOrUrl);
        } else if (CONFIG.sounds.builtIn[soundKeyOrUrl]) {
            this.playBuiltIn(soundKeyOrUrl);
        }
    },

    setVolume(vol) {
        this.volume = Math.max(0, Math.min(1, vol / 100));
    },

    setEnabled(enabled) {
        this.enabled = enabled;
    }
};

// ========== 数据导出导入 ==========
const DataManager = {
    // 导出所有数据
    exportAll() {
        const data = {};
        Object.values(CONFIG.storageKeys).forEach(key => {
            const value = localStorage.getItem(key);
            if (value) {
                try {
                    data[key] = JSON.parse(value);
                } catch {
                    data[key] = value;
                }
            }
        });

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `传讯备份_${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        URL.revokeObjectURL(url);

        return data;
    },

    // 导入数据
    importAll(jsonData) {
        try {
            const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;

            Object.entries(data).forEach(([key, value]) => {
                if (typeof value === 'object') {
                    localStorage.setItem(key, JSON.stringify(value));
                } else {
                    localStorage.setItem(key, value);
                }
            });

            return { success: true, message: '数据导入成功' };
        } catch (e) {
            return { success: false, message: '数据导入失败：' + e.message };
        }
    },

    // 导出字卡库
    exportReplies() {
        const replies = localStorage.getItem(CONFIG.storageKeys.customReplies);
        if (!replies) {
            // 导出默认字卡库
            const blob = new Blob([JSON.stringify(CONFIG.defaultReplies, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `字卡库_${new Date().toISOString().slice(0,10)}.json`;
            a.click();
            URL.revokeObjectURL(url);
            return;
        }

        const blob = new Blob([replies], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `字卡库_${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    },

    // 导入字卡库
    importReplies(jsonData) {
        try {
            const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
            localStorage.setItem(CONFIG.storageKeys.customReplies, JSON.stringify(data));
            return { success: true, message: '字卡库导入成功' };
        } catch (e) {
            return { success: false, message: '字卡库导入失败：' + e.message };
        }
    },

    // 导出音效设置
    exportSoundSettings() {
        const settings = localStorage.getItem(CONFIG.storageKeys.soundSettings);
        const blob = new Blob([settings || '{}'], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `音效设置_${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    },

    // 导入音效设置
    importSoundSettings(jsonData) {
        try {
            const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
            localStorage.setItem(CONFIG.storageKeys.soundSettings, JSON.stringify(data));
            return { success: true, message: '音效设置导入成功' };
        } catch (e) {
            return { success: false, message: '音效设置导入失败：' + e.message };
        }
    },

    // 获取存储用量
    getStorageUsage() {
        let total = 0;
        const details = {};

        Object.values(CONFIG.storageKeys).forEach(key => {
            const value = localStorage.getItem(key);
            if (value) {
                const size = new Blob([value]).size;
                total += size;
                details[key] = size;
            }
        });

        // 估算其他 localStorage 数据
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (!Object.values(CONFIG.storageKeys).includes(key)) {
                const value = localStorage.getItem(key);
                if (value) {
                    const size = new Blob([value]).size;
                    total += size;
                    details[`other_${key}`] = size;
                }
            }
        }

        return { total, details };
    },

    // 格式化存储大小
    formatSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    // 清除所有数据
    clearAll() {
        Object.values(CONFIG.storageKeys).forEach(key => {
            localStorage.removeItem(key);
        });
    },

    // 清除会话数据
    clearSession() {
        localStorage.removeItem(CONFIG.storageKeys.messages);
        localStorage.removeItem(CONFIG.storageKeys.sessions);
    }
};

// ========== 字卡拼接引擎 ==========
const CardConcatEngine = {
    // 获取设置
    getSettings() {
        try {
            const saved = localStorage.getItem(CONFIG.storageKeys.cardConcatSettings);
            if (saved) {
                return { ...CONFIG.cardConcat, ...JSON.parse(saved) };
            }
        } catch(e) {}
        return { ...CONFIG.cardConcat };
    },

    // 保存设置
    saveSettings(settings) {
        localStorage.setItem(CONFIG.storageKeys.cardConcatSettings, JSON.stringify(settings));
    },

    // 从字卡库随机抽取
    drawRandomCards(count, library) {
        if (!library || library.length === 0) return [];
        const shuffled = [...library].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(count, shuffled.length));
    },

    // 获取主字卡库
    getMainLibrary() {
        try {
            const saved = localStorage.getItem(CONFIG.storageKeys.customReplies);
            if (saved) {
                const data = JSON.parse(saved);
                if (data.reply && data.reply.main) {
                    return data.reply.main.filter(item => item && (typeof item === 'string' ? item.trim() : (item.text || item.content)));
                }
            }
        } catch(e) {}
        return CONFIG.defaultReplies.reply.main;
    },

    // 拼接字卡为一句话
    concatCards(cards) {
        if (!cards || cards.length === 0) return '';

        const settings = this.getSettings();
        const connectors = settings.connectors || CONFIG.cardConcat.connectors;
        const endPunctuations = settings.endPunctuations || CONFIG.cardConcat.endPunctuations;

        let result = '';
        cards.forEach((card, index) => {
            let text = typeof card === 'string' ? card : (card.text || card.content || '');
            if (!text) return;

            // 清理文本首尾标点
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

        // 随机添加结尾标点
        if (!/[。！？…~～]$/.test(result)) {
            result += endPunctuations[Math.floor(Math.random() * endPunctuations.length)];
        }

        return result;
    },

    // 生成拼接消息
    generateMessage() {
        const settings = this.getSettings();
        if (!settings.enabled) return null;

        // 概率检查
        if (Math.random() * 100 > settings.probability) return null;

        const library = this.getMainLibrary();
        if (library.length < settings.minCards) return null;

        const count = Math.floor(Math.random() * (settings.maxCards - settings.minCards + 1)) + settings.minCards;
        const cards = this.drawRandomCards(count, library);
        if (cards.length < 2) return null;

        return this.concatCards(cards);
    },

    // 生成朋友圈拼接内容
    generateMomentContent() {
        const settings = this.getSettings();
        if (!settings.moment || !settings.moment.enabled) return null;

        const moment = settings.moment;
        const library = this.getMainLibrary();
        if (library.length < moment.minCards) return null;

        const count = Math.floor(Math.random() * (moment.maxCards - moment.minCards + 1)) + moment.minCards;
        const cards = this.drawRandomCards(count, library);
        if (cards.length < 2) return null;

        const text = this.concatCards(cards);
        const hasImage = Math.random() * 100 < moment.imgProbability;

        return {
            text: text,
            hasImage: hasImage,
            images: []
        };
    }
};

// ========== 朋友圈数据管理 ==========
const MomentManager = {
    // 获取所有动态
    getMoments() {
        try {
            const saved = localStorage.getItem(CONFIG.storageKeys.moments);
            if (saved) return JSON.parse(saved);
        } catch(e) {}
        return [];
    },

    // 保存动态
    saveMoments(moments) {
        localStorage.setItem(CONFIG.storageKeys.moments, JSON.stringify(moments));
    },

    // 发布动态
    publish(text, images = [], author = 'me') {
        const moments = this.getMoments();
        const settings = JSON.parse(localStorage.getItem(CONFIG.storageKeys.settings) || '{}');

        const newMoment = {
            id: Date.now(),
            author: author,
            authorName: author === 'partner' ? (settings.partnerName || CONFIG.defaults.partnerName) : (settings.myName || CONFIG.defaults.myName),
            text: text,
            images: images || [],
            likes: [],
            comments: [],
            timestamp: Date.now()
        };

        moments.unshift(newMoment);
        this.saveMoments(moments);
        return newMoment;
    },

    // 自动发布（字卡拼接）
    autoPublish() {
        const content = CardConcatEngine.generateMomentContent();
        if (!content || !content.text) return null;

        return this.publish(content.text, content.images, 'partner');
    },

    // 点赞
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
        return idx === -1; // 返回是否点赞
    },

    // 评论
    addComment(momentId, text, name = '我') {
        const moments = this.getMoments();
        const moment = moments.find(m => m.id === momentId);
        if (!moment) return false;

        if (!moment.comments) moment.comments = [];
        moment.comments.push({
            name: name,
            text: text.trim(),
            timestamp: Date.now()
        });

        this.saveMoments(moments);
        return true;
    },

    // 删除动态
    delete(momentId) {
        let moments = this.getMoments();
        moments = moments.filter(m => m.id !== momentId);
        this.saveMoments(moments);
    },

    // 获取设置
    getSettings() {
        try {
            const saved = localStorage.getItem(CONFIG.storageKeys.momentSettings);
            if (saved) return { ...CONFIG.moment, ...JSON.parse(saved) };
        } catch(e) {}
        return { ...CONFIG.moment };
    },

    // 保存设置
    saveSettings(settings) {
        localStorage.setItem(CONFIG.storageKeys.momentSettings, JSON.stringify(settings));
    }
};

// ========== 初始化默认数据 ==========
function initDefaultData() {
    // 初始化字卡库
    if (!localStorage.getItem(CONFIG.storageKeys.customReplies)) {
        localStorage.setItem(CONFIG.storageKeys.customReplies, JSON.stringify(CONFIG.defaultReplies));
    }

    // 初始化设置
    if (!localStorage.getItem(CONFIG.storageKeys.settings)) {
        localStorage.setItem(CONFIG.storageKeys.settings, JSON.stringify(CONFIG.defaults));
    }

    // 初始化字卡拼接设置
    if (!localStorage.getItem(CONFIG.storageKeys.cardConcatSettings)) {
        localStorage.setItem(CONFIG.storageKeys.cardConcatSettings, JSON.stringify(CONFIG.cardConcat));
    }

    // 初始化朋友圈设置
    if (!localStorage.getItem(CONFIG.storageKeys.momentSettings)) {
        localStorage.setItem(CONFIG.storageKeys.momentSettings, JSON.stringify(CONFIG.moment));
    }
}

// 导出到全局
window.CONFIG = CONFIG;
window.SoundPlayer = SoundPlayer;
window.DataManager = DataManager;
window.CardConcatEngine = CardConcatEngine;
window.MomentManager = MomentManager;
window.initDefaultData = initDefaultData;
