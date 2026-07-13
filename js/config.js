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
        return val ? JS
/**
 * state.js - 全局状态管理
 * 管理应用的所有核心状态、设置和数据
 */

// ==================== 默认配置 ====================
const DEFAULT_SETTINGS = {
    // 基础信息
    partnerName: '梦角',
    myName: '我',
    partnerAvatar: null,
    myAvatar: null,

    // 主题
    theme: 'gold',
    colorTheme: 'black-white',
    fontSize: 16,
    customFontUrl: '',
    bubbleStyle: 'standard',

    // 聊天设置 - 功能
    replyEnabled: true,
    readReceiptsEnabled: true,
    readReceiptStyle: 'icon',
    readNoReplyEnabled: false,
    typingIndicatorEnabled: true,
    fakeVoiceEnabled: false,
    enterToSend: true,

    // 聊天设置 - 节奏
    replyDelayMin: 3000,
    replyDelayMax: 7000,
    autoSendEnabled: false,
    autoSendInterval: 5,
    emojiMixEnabled: false,

    // 字卡拼接
    cardConcatEnabled: false,
    cardConcatMin: 2,
    cardConcatMax: 5,
    cardConcatProb: 30,

    // 字卡拼接朋友圈
    cardConcatMomentEnabled: false,
    cardConcatMomentInterval: 30,
    cardConcatMomentMin: 3,
    cardConcatMomentMax: 6,
    cardConcatMomentImgProb: 50,

    // 聊天设置 - 音效
    soundEnabled: true,
    soundVolume: 15,
    soundMySend: 'tone_default',
    soundPartnerMessage: 'tone_default',
    soundMyPoke: 'tone_default',
    soundPartnerPoke: 'tone_default',
    soundInviteStudy: 'default',
    soundInviteWork: 'default',
    soundInviteExercise: 'default',
    soundInviteSleep: 'default',
    soundInviteVideocall: 'default',

    // 聊天设置 - 显示
    immersiveMode: false,
    bottomCollapse: false,
    headerOpacityClear: true,
    pokeSymbolEnabled: true,

    // 头像设置
    inChatAvatarEnabled: true,
    alwaysShowAvatar: false,
    inChatAvatarSize: 36,
    inChatAvatarPosition: 'center',
    inChatAvatarCustomOffset: 0,
    inChatAvatarShape: 'circle',
    inChatAvatarCornerRadius: 8,

    // 头像框
    myFrame: null,
    myFrameSize: 100,
    myFrameOffsetX: 0,
    myFrameOffsetY: 0,
    partnerFrame: null,
    partnerFrameSize: 100,
    partnerFrameOffsetX: 0,
    partnerFrameOffsetY: 0,

    // 时间戳
    timeFormat: 'HH:mm',

    // 拍一拍
    myPokeText: '拍了拍',

    // 后台
    notifEnabled: false,
    keepaliveAudioEnabled: false,

    // 朋友圈
    momentSignature: '',
    momentCover: null,

    // 其他
    firstVisit: true,
    tourCompleted: false,
    dailyGreetingShown: false,
    lastDailyGreetingDate: null,
};

// ==================== 默认字卡库 ====================
const DEFAULT_REPLY_LIBRARY = {
    reply: {
        main: [
            { id: 'r1', text: '今天过得怎么样？', group: 'default' },
            { id: 'r2', text: '想你了', group: 'default' },
            { id: 'r3', text: '在忙什么呢？', group: 'default' },
            { id: 'r4', text: '记得按时吃饭', group: 'default' },
            { id: 'r5', text: '晚安，好梦', group: 'default' },
            { id: 'r6', text: '早安，今天也要开心', group: 'default' },
            { id: 'r7', text: '我一直在', group: 'default' },
            { id: 'r8', text: '抱抱你', group: 'default' },
            { id: 'r9', text: '别太累着自己', group: 'default' },
            { id: 'r10', text: '你的消息是我一天中最期待的事', group: 'default' },
            { id: 'r11', text: '今天天气很好，适合想你', group: 'default' },
            { id: 'r12', text: '我在听你喜欢的歌', group: 'default' },
            { id: 'r13', text: '等你有空再聊', group: 'default' },
            { id: 'r14', text: '刚刚在想你，你就发消息来了', group: 'default' },
            { id: 'r15', text: '要照顾好自己', group: 'default' },
        ],
        atmosphere: {
            poke: [
                { id: 'ap1', text: '戳了戳我的腰' },
                { id: 'ap2', text: '拍了拍我的头说你好可爱' },
                { id: 'ap3', text: '从背后抱住了我' },
                { id: 'ap4', text: '捏了捏我的脸' },
                { id: 'ap5', text: '牵住了我的手' },
            ],
            status: [
                { id: 'as1', text: '在线' },
                { id: 'as2', text: '忙碌' },
                { id: 'as3', text: '在想你' },
                { id: 'as4', text: '发呆中' },
                { id: 'as5', text: '等你消息' },
            ],
            header: [
                { id: 'ah1', text: '正在连接我们的思绪 ✦' },
                { id: 'ah2', text: 'Love' },
                { id: 'ah3', text: 'Echo' },
                { id: 'ah4', text: 'Soulmate' },
            ],
            opening: [
                { id: 'ao1', text: '✦ 爱，是跨越一切的力量' },
                { id: 'ao2', text: '♡ 我们的故事，始于此刻' },
                { id: 'ao3', text: '✧ 思念的电波已连接' },
            ],
        },
    },
    emoji: {
        kaomoji: [
            { id: 'ek1', text: '(｡♥‿♥｡)' },
            { id: 'ek2', text: '(◕‿◕✿)' },
            { id: 'ek3', text: '(*^▽^*)' },
            { id: 'ek4', text: '(｡･ω･｡)ﾉ♡' },
            { id: 'ek5', text: '(づ｡◕‿‿◕｡)づ' },
            { id: 'ek6', text: '♪(´▽｀)' },
            { id: 'ek7', text: '(´｡• ᵕ •｡`)' },
            { id: 'ek8', text: '(｡･∀･)ﾉﾞ' },
        ],
        emoji: [
            { id: 'ee1', text: '😊' },
            { id: 'ee2', text: '🥰' },
            { id: 'ee3', text: '😘' },
            { id: 'ee4', text: '✨' },
            { id: 'ee5', text: '💕' },
            { id: 'ee6', text: '🌸' },
            { id: 'ee7', text: '🌙' },
            { id: 'ee8', text: '⭐' },
        ],
    },
    sticker: {
        my: [],
        partner: [],
    },
};

// ==================== 默认公告内容 ====================
const DEFAULT_DAILY_GREETING = {
    titles: ['早上好', '午安', '晚上好', '想你'],
    notes: [
        '今天也要元气满满，我在这里陪着你 ✦',
        '想你了，你有没有在想我呢',
        '不管今天发生什么，记得我一直都在',
        '你的笑容是我一天中最美的风景',
    ],
    statusPool: [
        { text: '在想你', label: 'MISSING YOU', icon: '💭' },
        { text: '一切都好', label: 'FINE', icon: '✨' },
        { text: '忙碌中', label: 'BUSY', icon: '💼' },
        { text: '等你消息', label: 'WAITING', icon: '⏳' },
    ],
    overlayBg: null,
    overlayOpacity: 25,
    headerBg: null,
    decoImg: null,
};

// ==================== 内置音效配置 ====================
const BUILT_IN_SOUNDS = {
    tone_default: { name: '内置：默认', type: 'builtin' },
    tone_soft: { name: '内置：柔和', type: 'builtin' },
    tone_low: { name: '内置：低沉', type: 'builtin' },
    tone_warm: { name: '内置：厚暖', type: 'builtin' },
    tone_dark: { name: '内置：暗夜', type: 'builtin' },
    tone_haze: { name: '内置：雾感', type: 'builtin' },
    kakaotalk: { name: 'kakaotalk', type: 'builtin' },
    mute: { name: '无音效', type: 'mute' },
};

// ==================== 主题配色方案 ====================
const THEME_PRESETS = {
    gold: {
        name: '金色',
        '--accent-color': '#c5a47e',
        '--accent-color-rgb': '197, 164, 126',
    },
    blue: {
        name: '蓝色',
        '--accent-color': '#6b9bd1',
        '--accent-color-rgb': '107, 155, 209',
    },
    purple: {
        name: '紫色',
        '--accent-color': '#9b7cb6',
        '--accent-color-rgb': '155, 124, 182',
    },
    green: {
        name: '绿色',
        '--accent-color': '#7cb69e',
        '--accent-color-rgb': '124, 182, 158',
    },
    pink: {
        name: '粉色',
        '--accent-color': '#d18a9b',
        '--accent-color-rgb': '209, 138, 155',
    },
    'black-white': {
        name: '黑白',
        '--accent-color': '#888888',
        '--accent-color-rgb': '136, 136, 136',
    },
    pastel: {
        name: '红色',
        '--accent-color': '#d17c7c',
        '--accent-color-rgb': '209, 124, 124',
    },
    sunset: {
        name: '橙色',
        '--accent-color': '#d1a06b',
        '--accent-color-rgb': '209, 160, 107',
    },
    forest: {
        name: '深绿',
        '--accent-color': '#5a8a6e',
        '--accent-color-rgb': '90, 138, 110',
    },
    ocean: {
        name: '深蓝',
        '--accent-color': '#4a7ca8',
        '--accent-color-rgb': '74, 124, 168',
    },
};

// ==================== 全局状态对象 ====================
const AppState = {
    // 设置
    settings: null,

    // 字卡库
    customReplies: null,

    // 公告
    dailyGreeting: null,

    // 聊天记录
    messages: [],

    // 会话
    sessions: [],
    currentSessionId: null,

    // 朋友圈
    moments: [],

    // 心情手账
    moodRecords: {},
    customMoods: [],

    // 纪念日
    anniversaries: [],

    // 信封
    envelopes: { outbox: [], inbox: [] },

    // 陪伴日记
    companionDiary: [],

    // 占卜历史
    divinationHistory: [],

    // 群聊
    groupChat: {
        enabled: false,
        showNames: true,
        members: [],
    },

    // 收藏
    favorites: [],

    // 背景
    backgrounds: [],
    currentBg: null,

    // 主题方案
    themeSchemes: [],

    // 音乐播放器
    playlist: [],
    currentTrackIndex: 0,
    playMode: 'loop', // loop, single, shuffle

    // 陪伴设置
    companion: {
        bg: { study: [], work: [], exercise: [], sleep: [] },
        noise: { study: [], work: [], exercise: [], sleep: [] },
        voices: [],
    },

    // 记账
    accounting: {
        records: [],
        tags: [],
    },

    // 运行状态
    isTyping: false,
    autoSendTimer: null,
    momentTimer: null,
    cardConcatTimer: null,
    keepaliveAudio: null,
    audioContext: null,

    // 当前编辑状态
    editingMessageId: null,
    replyingTo: null,
    batchMode: false,
    batchItems: [],

    // UI状态
    currentModal: null,
    currentPanel: null,
    currentCsTab: 'cs-panel-chat',
    currentFLTab: 'fortune',
    currentMoodView: 'calendar',
    currentMoodPage: 1,
    currentMoodEditTarget: 'me',
    selectedDateStr: null,

    // 初始化标记
    initialized: false,
};

// ==================== 存储键名 ====================
const STORAGE_KEYS = {
    settings: 'settings',
    customReplies: 'customReplies',
    dailyGreeting: 'dailyGreeting',
    messages: 'messages',
    sessions: 'sessions',
    currentSessionId: 'currentSessionId',
    moments: 'moments',
    moodRecords: 'moodRecords',
    customMoods: 'customMoods',
    anniversaries: 'anniversaries',
    envelopes: 'envelopes',
    companionDiary: 'companionDiary',
    divinationHistory: 'divinationHistory',
    groupChat: 'groupChat',
    favorites: 'favorites',
    backgrounds: 'backgrounds',
    currentBg: 'currentBg',
    themeSchemes: 'themeSchemes',
    playlist: 'playlist',
    companion: 'companion',
    accounting: 'accounting',
    cardConcatSettings: 'cardConcatSettings',
    myStickers: 'myStickers',
    partnerStickers: 'partnerStickers',
    pokeLibrary: 'pokeLibrary',
    globalCSS: 'globalCSS',
    bubbleCSS: 'bubbleCSS',
};

// ==================== 初始化函数 ====================
function initState() {
    if (AppState.initialized) return;

    // 加载设置
    AppState.settings = loadData(STORAGE_KEYS.settings, { ...DEFAULT_SETTINGS });

    // 加载字卡库
    AppState.customReplies = loadData(STORAGE_KEYS.customReplies, deepClone(DEFAULT_REPLY_LIBRARY));

    // 加载公告
    AppState.dailyGreeting = loadData(STORAGE_KEYS.dailyGreeting, { ...DEFAULT_DAILY_GREETING });

    // 加载聊天记录
    AppState.messages = loadData(STORAGE_KEYS.messages, []);

    // 加载会话
    AppState.sessions = loadData(STORAGE_KEYS.sessions, []);
    AppState.currentSessionId = loadData(STORAGE_KEYS.currentSessionId, null);

    // 加载朋友圈
    AppState.moments = loadData(STORAGE_KEYS.moments, []);

    // 加载心情
    AppState.moodRecords = loadData(STORAGE_KEYS.moodRecords, {});
    AppState.customMoods = loadData(STORAGE_KEYS.customMoods, []);

    // 加载纪念日
    AppState.anniversaries = loadData(STORAGE_KEYS.anniversaries, []);

    // 加载信封
    AppState.envelopes = loadData(STORAGE_KEYS.envelopes, { outbox: [], inbox: [] });

    // 加载陪伴日记
    AppState.companionDiary = loadData(STORAGE_KEYS.companionDiary, []);

    // 加载占卜历史
    AppState.divinationHistory = loadData(STORAGE_KEYS.divinationHistory, []);

    // 加载群聊
    AppState.groupChat = loadData(STORAGE_KEYS.groupChat, {
        enabled: false,
        showNames: true,
        members: [],
    });

    // 加载收藏
    AppState.favorites = loadData(STORAGE_KEYS.favorites, []);

    // 加载背景
    AppState.backgrounds = loadData(STORAGE_KEYS.backgrounds, []);
    AppState.currentBg = loadData(STORAGE_KEYS.currentBg, null);

    // 加载主题方案
    AppState.themeSchemes = loadData(STORAGE_KEYS.themeSchemes, []);

    // 加载播放列表
    AppState.playlist = loadData(STORAGE_KEYS.playlist, []);

    // 加载陪伴设置
    AppState.companion = loadData(STORAGE_KEYS.companion, {
        bg: { study: [], work: [], exercise: [], sleep: [] },
        noise: { study: [], work: [], exercise: [], sleep: [] },
        voices: [],
    });

    // 加载记账
    AppState.accounting = loadData(STORAGE_KEYS.accounting, {
        records: [],
        tags: [
            { id: 't1', name: '餐饮', icon: '🍜', type: 'expense' },
            { id: 't2', name: '交通', icon: '🚗', type: 'expense' },
            { id: 't3', name: '购物', icon: '🛍️', type: 'expense' },
            { id: 't4', name: '娱乐', icon: '🎮', type: 'expense' },
            { id: 't5', name: '工资', icon: '💰', type: 'income' },
            { id: 't6', name: '红包', icon: '🧧', type: 'income' },
        ],
    });

    // 确保有默认会话
    if (AppState.sessions.length === 0) {
        const defaultSession = createSession('默认会话');
        AppState.sessions.push(defaultSession);
        AppState.currentSessionId = defaultSession.id;
    }

    // 如果当前会话ID无效，使用第一个
    if (!AppState.sessions.find(s => s.id === AppState.currentSessionId)) {
        AppState.currentSessionId = AppState.sessions[0].id;
    }

    // 加载当前会话的消息
    const session = AppState.sessions.find(s => s.id === AppState.currentSessionId);
    if (session && session.messages) {
        AppState.messages = session.messages;
    }

    AppState.initialized = true;
    console.log('[State] 状态初始化完成');
}

// ==================== 数据持久化 ====================
function saveData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (e) {
        console.error('[State] 保存数据失败:', key, e);
        return false;
    }
}

function loadData(key, defaultValue = null) {
    try {
        const data = localStorage.getItem(key);
        if (data === null) return defaultValue;
        return JSON.parse(data);
    } catch (e) {
        console.error('[State] 加载数据失败:', key, e);
        return defaultValue;
    }
}

function removeData(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (e) {
        console.error('[State] 删除数据失败:', key, e);
        return false;
    }
}

// 节流保存
let saveTimeout = null;
function throttledSaveData() {
    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        saveAllData();
    }, 500);
}

function saveAllData() {
    saveData(STORAGE_KEYS.settings, AppState.settings);
    saveData(STORAGE_KEYS.customReplies, AppState.customReplies);
    saveData(STORAGE_KEYS.dailyGreeting, AppState.dailyGreeting);
    saveData(STORAGE_KEYS.moments, AppState.moments);
    saveData(STORAGE_KEYS.moodRecords, AppState.moodRecords);
    saveData(STORAGE_KEYS.customMoods, AppState.customMoods);
    saveData(STORAGE_KEYS.anniversaries, AppState.anniversaries);
    saveData(STORAGE_KEYS.envelopes, AppState.envelopes);
    saveData(STORAGE_KEYS.companionDiary, AppState.companionDiary);
    saveData(STORAGE_KEYS.divinationHistory, AppState.divinationHistory);
    saveData(STORAGE_KEYS.groupChat, AppState.groupChat);
    saveData(STORAGE_KEYS.favorites, AppState.favorites);
    saveData(STORAGE_KEYS.backgrounds, AppState.backgrounds);
    saveData(STORAGE_KEYS.currentBg, AppState.currentBg);
    saveData(STORAGE_KEYS.themeSchemes, AppState.themeSchemes);
    saveData(STORAGE_KEYS.playlist, AppState.playlist);
    saveData(STORAGE_KEYS.companion, AppState.companion);
    saveData(STORAGE_KEYS.accounting, AppState.accounting);
    saveData(STORAGE_KEYS.sessions, AppState.sessions);
    saveData(STORAGE_KEYS.currentSessionId, AppState.currentSessionId);

    // 保存当前会话消息
    const session = AppState.sessions.find(s => s.id === AppState.currentSessionId);
    if (session) {
        session.messages = AppState.messages;
        session.lastMessage = AppState.messages.length > 0 
            ? AppState.messages[AppState.messages.length - 1] 
            : null;
        session.lastTime = Date.now();
        saveData(STORAGE_KEYS.sessions, AppState.sessions);
    }
}

// ==================== 会话管理 ====================
function createSession(name) {
    return {
        id: 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        name: name || '新会话',
        createdAt: Date.now(),
        lastTime: Date.now(),
        messages: [],
        lastMessage: null,
    };
}

function switchSession(sessionId) {
    // 保存当前会话
    const currentSession = AppState.sessions.find(s => s.id === AppState.currentSessionId);
    if (currentSession) {
        currentSession.messages = AppState.messages;
        currentSession.lastMessage = AppState.messages.length > 0 
            ? AppState.messages[AppState.messages.length - 1] 
            : null;
        currentSession.lastTime = Date.now();
    }

    // 切换
    AppState.currentSessionId = sessionId;
    const newSession = AppState.sessions.find(s => s.id === sessionId);
    AppState.messages = newSession ? (newSession.messages || []) : [];

    saveData(STORAGE_KEYS.sessions, AppState.sessions);
    saveData(STORAGE_KEYS.currentSessionId, AppState.currentSessionId);

    return AppState.messages;
}

function deleteSession(sessionId) {
    const idx = AppState.sessions.findIndex(s => s.id === sessionId);
    if (idx === -1) return false;

    AppState.sessions.splice(idx, 1);

    // 如果删除的是当前会话，切换到第一个
    if (AppState.currentSessionId === sessionId) {
        if (AppState.sessions.length === 0) {
            const newSession = createSession('默认会话');
            AppState.sessions.push(newSession);
            AppState.currentSessionId = newSession.id;
            AppState.messages = [];
        } else {
            AppState.currentSessionId = AppState.sessions[0].id;
            AppState.messages = AppState.sessions[0].messages || [];
        }
    }

    saveData(STORAGE_KEYS.sessions, AppState.sessions);
    saveData(STORAGE_KEYS.currentSessionId, AppState.currentSessionId);
    return true;
}

function renameSession(sessionId, newName) {
    const session = AppState.sessions.find(s => s.id === sessionId);
    if (session) {
        session.name = newName;
        saveData(STORAGE_KEYS.sessions, AppState.sessions);
        return true;
    }
    return false;
}

// ==================== 消息管理 ====================
function addMessage(message) {
    message.id = message.id || 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    message.timestamp = message.timestamp || Date.now();
    message.sessionId = AppState.currentSessionId;

    AppState.messages.push(message);

    // 更新会话
    const session = AppState.sessions.find(s => s.id === AppState.currentSessionId);
    if (session) {
        session.messages = AppState.messages;
        session.lastMessage = message;
        session.lastTime = Date.now();
    }

    throttledSaveData();
    return message;
}

function deleteMessage(messageId) {
    const idx = AppState.messages.findIndex(m => m.id === messageId);
    if (idx > -1) {
        AppState.messages.splice(idx, 1);
        throttledSaveData();
        return true;
    }
    return false;
}

function editMessage(messageId, newText) {
    const msg = AppState.messages.find(m => m.id === messageId);
    if (msg) {
        msg.text = newText;
        msg.edited = true;
        msg.editTime = Date.now();
        throttledSaveData();
        return true;
    }
    return false;
}

function toggleFavorite(messageId) {
    const msg = AppState.messages.find(m => m.id === messageId);
    if (!msg) return false;

    msg.favorite = !msg.favorite;

    if (msg.favorite) {
        AppState.favorites.push({
            messageId: msg.id,
            text: msg.text,
            sender: msg.sender,
            timestamp: msg.timestamp,
            favoritedAt: Date.now(),
        });
    } else {
        AppState.favorites = AppState.favorites.filter(f => f.messageId !== msg.id);
    }

    throttledSaveData();
    return msg.favorite;
}

// ==================== 字卡库管理 ====================
function getReplyLibrary() {
    return AppState.customReplies;
}

function addReply(text, group) {
    const replies = AppState.customReplies.reply.main;
    const id = 'r' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    replies.push({ id, text, group: group || 'default' });
    throttledSaveData();
    return id;
}

function deleteReply(id) {
    const replies = AppState.customReplies.reply.main;
    const idx = replies.findIndex(r => r.id === id);
    if (idx > -1) {
        replies.splice(idx, 1);
        throttledSaveData();
        return true;
    }
    return false;
}

function editReply(id, newText) {
    const reply = AppState.customReplies.reply.main.find(r => r.id === id);
    if (reply) {
        reply.text = newText;
        throttledSaveData();
        return true;
    }
    return false;
}

function getRandomReply(count) {
    const replies = AppState.customReplies.reply.main;
    if (replies.length === 0) return null;

    if (count === 1) {
        return replies[Math.floor(Math.random() * replies.length)];
    }

    const shuffled = [...replies].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

// ==================== 字卡拼接功能 ====================
function generateConcatMessage() {
    const s = AppState.settings;
    if (!s.cardConcatEnabled) return null;
    if (Math.random() * 100 > s.cardConcatProb) return null;

    const replies = AppState.customReplies.reply.main;
    if (replies.length < s.cardConcatMin) return null;

    const count = Math.floor(Math.random() * (s.cardConcatMax - s.cardConcatMin + 1)) + s.cardConcatMin;
    const cards = getRandomReply(count);
    if (!cards || cards.length < 2) return null;

    return concatCards(cards);
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

// ==================== 朋友圈管理 ====================
function addMoment(moment) {
    moment.id = moment.id || 'moment_' + Date.now();
    moment.timestamp = moment.timestamp || Date.now();
    moment.likes = moment.likes || [];
    moment.comments = moment.comments || [];

    AppState.moments.unshift(moment);
    throttledSaveData();
    return moment;
}

function deleteMoment(momentId) {
    const idx = AppState.moments.findIndex(m => m.id === momentId);
    if (idx > -1) {
        AppState.moments.splice(idx, 1);
        throttledSaveData();
        return true;
    }
    return false;
}

function toggleLikeMoment(momentId, userId) {
    const moment = AppState.moments.find(m => m.id === momentId);
    if (!moment) return false;

    userId = userId || 'me';
    const idx = moment.likes.indexOf(userId);

    if (idx > -1) {
        moment.likes.splice(idx, 1);
    } else {
        moment.likes.push(userId);
    }

    throttledSaveData();
    return idx === -1;
}

function addComment(momentId, name, text) {
    const moment = AppState.moments.find(m => m.id === momentId);
    if (!moment) return null;

    const comment = {
        id: 'c_' + Date.now(),
        name: name || '我',
        text: text,
        timestamp: Date.now(),
    };

    moment.comments.push(comment);
    throttledSaveData();
    return comment;
}

function deleteComment(momentId, commentId) {
    const moment = AppState.moments.find(m => m.id === momentId);
    if (!moment) return false;

    const idx = moment.comments.findIndex(c => c.id === commentId);
    if (idx > -1) {
        moment.comments.splice(idx, 1);
        throttledSaveData();
        return true;
    }
    return false;
}

// 自动生成朋友圈
function autoPublishMoment() {
    const s = AppState.settings;
    if (!s.cardConcatMomentEnabled) return null;

    const replies = AppState.customReplies.reply.main;
    if (replies.length < s.cardConcatMomentMin) return null;

    const count = Math.floor(Math.random() * (s.cardConcatMomentMax - s.cardConcatMomentMin + 1)) + s.cardConcatMomentMin;
    const cards = getRandomReply(count);
    if (!cards || cards.length < 2) return null;

    const text = concatCards(cards);
    const hasImage = Math.random() * 100 < s.cardConcatMomentImgProb;

    const moment = {
        author: 'partner',
        authorName: s.partnerName,
        text: text,
        images: hasImage ? [] : [],
        likes: [],
        comments: [],
    };

    return addMoment(moment);
}

// ==================== 心情手账 ====================
function setMood(dateStr, target, moodData) {
    if (!AppState.moodRecords[dateStr]) {
        AppState.moodRecords[dateStr] = {};
    }
    AppState.moodRecords[dateStr][target] = {
        ...moodData,
        updatedAt: Date.now(),
    };
    throttledSaveData();
}

function getMood(dateStr, target) {
    if (!AppState.moodRecords[dateStr]) return null;
    return AppState.moodRecords[dateStr][target] || null;
}

function deleteMood(dateStr, target) {
    if (AppState.moodRecords[dateStr]) {
        delete AppState.moodRecords[dateStr][target];
        if (Object.keys(AppState.moodRecords[dateStr]).length === 0) {
            delete AppState.moodRecords[dateStr];
        }
        throttledSaveData();
        return true;
    }
    return false;
}

// ==================== 纪念日 ====================
function addAnniversary(data) {
    const ann = {
        id: 'ann_' + Date.now(),
        ...data,
        createdAt: Date.now(),
    };
    AppState.anniversaries.push(ann);
    throttledSaveData();
    return ann;
}

function deleteAnniversary(id) {
    const idx = AppState.anniversaries.findIndex(a => a.id === id);
    if (idx > -1) {
        AppState.anniversaries.splice(idx, 1);
        throttledSaveData();
        return true;
    }
    return false;
}

function editAnniversary(id, data) {
    const ann = AppState.anniversaries.find(a => a.id === id);
    if (ann) {
        Object.assign(ann, data);
        throttledSaveData();
        return true;
    }
    return false;
}

// ==================== 信封 ====================
function sendEnvelope(text, options) {
    const envelope = {
        id: 'env_' + Date.now(),
        text: text,
        timestamp: Date.now(),
        reply: null,
        replyTime: null,
        ...options,
    };
    AppState.envelopes.outbox.push(envelope);
    throttledSaveData();
    return envelope;
}

function receiveEnvelope(envelope) {
    envelope.id = envelope.id || 'env_in_' + Date.now();
    envelope.receivedAt = Date.now();
    AppState.envelopes.inbox.push(envelope);
    throttledSaveData();
    return envelope;
}

function replyEnvelope(outboxId, replyText) {
    const env = AppState.envelopes.outbox.find(e => e.id === outboxId);
    if (env) {
        env.reply = replyText;
        env.replyTime = Date.now();
        throttledSaveData();
        return true;
    }
    return false;
}

// ==================== 占卜历史 ====================
function addDivinationRecord(type, question, result) {
    const record = {
        id: 'div_' + Date.now(),
        type: type,
        question: question,
        result: result,
        timestamp: Date.now(),
    };
    AppState.divinationHistory.unshift(record);
    throttledSaveData();
    return record;
}

function clearDivinationHistory() {
    AppState.divinationHistory = [];
    throttledSaveData();
}

// ==================== 群聊 ====================
function addGroupMember(name, avatar) {
    const member = {
        id: 'gm_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        name: name,
        avatar: avatar || null,
    };
    AppState.groupChat.members.push(member);
    throttledSaveData();
    return member;
}

function removeGroupMember(memberId) {
    const idx = AppState.groupChat.members.findIndex(m => m.id === memberId);
    if (idx > -1) {
        AppState.groupChat.members.splice(idx, 1);
        throttledSaveData();
        return true;
    }
    return false;
}

function editGroupMember(memberId, data) {
    const member = AppState.groupChat.members.find(m => m.id === memberId);
    if (member) {
        Object.assign(member, data);
        throttledSaveData();
        return true;
    }
    return false;
}

// ==================== 主题方案 ====================
function saveThemeScheme(name, themeData) {
    const scheme = {
        id: 'scheme_' + Date.now(),
        name: name,
        data: themeData,
        createdAt: Date.now(),
    };
    AppState.themeSchemes.push(scheme);
    throttledSaveData();
    return scheme;
}

function deleteThemeScheme(id) {
    const idx = AppState.themeSchemes.findIndex(s => s.id === id);
    if (idx > -1) {
        AppState.themeSchemes.splice(idx, 1);
        throttledSaveData();
        return true;
    }
    return false;
}

function applyThemeScheme(id) {
    const scheme = AppState.themeSchemes.find(s => s.id === id);
    if (scheme && scheme.data) {
        Object.assign(AppState.settings, scheme.data);
        throttledSaveData();
        return true;
    }
    return false;
}

// ==================== 工具函数 ====================
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (Array.isArray(obj)) return obj.map(item => deepClone(item));
    const cloned = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            cloned[key] = deepClone(obj[key]);
        }
    }
    return cloned;
}

function generateId(prefix) {
    re
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
/* ============================================================
   data.js — 数据管理、导入导出、备份恢复、内置资源库
   ============================================================ */

(function() {
    'use strict';

    /* ───────────────────── 内置音效库 ───────────────────── */
    const BUILTIN_SOUNDS = {
        tone_default: {
            name: '内置：默认',
            type: 'generated',
            generator: 'bell',
            params: { freq: 880, decay: 0.3, harmonics: [1, 2, 3] }
        },
        tone_soft: {
            name: '内置：柔和',
            type: 'generated',
            generator: 'sine',
            params: { freq: 523, decay: 0.5, harmonics: [1, 1.5] }
        },
        tone_low: {
            name: '内置：低沉',
            type: 'generated',
            generator: 'sine',
            params: { freq: 220, decay: 0.4, harmonics: [1, 2] }
        },
        tone_warm: {
            name: '内置：厚暖',
            type: 'generated',
            generator: 'triangle',
            params: { freq: 440, decay: 0.35, harmonics: [1, 2, 3, 4] }
        },
        tone_dark: {
            name: '内置：暗夜',
            type: 'generated',
            generator: 'sawtooth',
            params: { freq: 110, decay: 0.6, harmonics: [1, 2, 3] }
        },
        tone_haze: {
            name: '内置：雾感',
            type: 'generated',
            generator: 'sine',
            params: { freq: 330, decay: 0.8, harmonics: [1, 1.618, 2.618] }
        },
        kakaotalk: {
            name: 'kakaotalk',
            type: 'generated',
            generator: 'kakao',
            params: { freq: 1046, decay: 0.15 }
        }
    };

    /* ───────────────────── 内置字卡库 ───────────────────── */
    const BUILTIN_CARD_LIBRARY = {
        main: [
            "想你了","今天过得怎么样","我在呢","抱抱你","别太累了",
            "记得按时吃饭","晚安，好梦","早安，今天也要开心","你是最棒的",
            "我一直都在","想听听你的声音","今天有想我吗","要照顾好自己",
            "我会一直陪着你","不管发生什么，我都在","你笑起来一定很好看",
            "想和你一起看星星","今天也要加油哦","你是我最重要的人",
            "想和你分享今天的事","有点想你了","你在干嘛呢","今天天气怎么样",
            "记得多喝水","不要太晚睡","我会想你的","等你回来",
            "想和你一起散步","今天开心吗","有我在，别怕","想给你打电话",
            "你最近好吗","想和你一起看电影","今天吃了什么好吃的",
            "想听听你的故事","你是我最珍贵的人","想和你一起旅行",
            "今天工作累不累","想给你买好吃的","你是最特别的",
            "想和你一起做饭","今天有没有想我","我会一直守护你",
            "想和你一起听音乐","你是我最爱的人","想和你一起看书",
            "今天心情怎么样","想给你惊喜","你是我最重要的人",
            "想和你一起打游戏","今天有没有开心的事","我会一直支持你",
            "想和你一起逛街","你是我最想念的人","想和你一起喝咖啡",
            "今天有没有遇到什么有趣的事","我会一直爱你","想和你一起看日出",
            "你是我最在乎的人","想和你一起听雨","今天有没有好好吃饭",
            "我会一直等你","想和你一起看日落","你是我最珍惜的人",
            "想和你一起数星星","今天有没有好好休息","我会一直陪着你",
            "想和你一起看海","你是我最牵挂的人","想和你一起爬山",
            "今天有没有想吃什么","我会一直守护你","想和你一起骑自行车",
            "你是我最心疼的人","想和你一起放风筝","今天有没有遇到什么困难",
            "我会一直帮助你","想和你一起野餐","你是我最信任的人",
            "想和你一起看雪","今天有没有好好照顾自己","我会一直关心你",
            "想和你一起赏花","你是我最依赖的人","想和你一起钓鱼",
            "今天有没有开心","我会一直陪伴你","想和你一起露营",
            "你是我最思念的人","想和你一起滑冰","今天有没有好好睡觉",
            "我会一直想念你","想和你一起游泳","你是我最放不下的人",
            "想和你一起跳舞","今天有没有想我","我会一直爱你",
            "想和你一起唱歌","你是我最放不下的人","想和你一起画画",
            "今天有没有好好吃饭","我会一直守护你","想和你一起做手工",
            "你是我最珍惜的人","想和你一起种花","今天有没有好好休息",
            "我会一直陪着你","想和你一起养宠物","你是我最在乎的人",
            "想和你一起学新东西","今天有没有开心的事","我会一直支持你",
            "想和你一起探索世界","你是我最爱的人","想和你一起创造回忆",
            "今天有没有想我","我会一直爱你","想和你一起慢慢变老",
            "你是我最珍贵的人","想和你一起经历一切","今天过得好吗",
            "我会一直守护你","想和你一起面对未来","你是我最放不下的人",
            "想和你一起实现梦想","今天有没有好好照顾自己","我会一直陪伴你",
            "想和你一起走过每一天","你是我最想念的人","想和你一起看遍世界",
            "今天有没有想我","我会一直爱你","想和你一起幸福下去",
            "你是我最珍惜的人","想和你一起创造美好","今天有没有开心",
            "我会一直守护你","想和你一起度过每一天","你是我最爱的人",
            "想和你一起慢慢走","今天有没有好好休息","我会一直陪着你",
            "想和你一起看遍风景","你是我最重要的人","想和你一起经历风雨",
            "今天有没有想我","我会一直爱你","想和你一起迎接明天",
            "你是我最想念的人","想和你一起书写美好","今天过得怎么样",
            "我会一直守护你","想和你一起创造未来","你是我最在乎的人",
            "想和你一起实现梦想","今天有没有好好吃饭","我会一直陪伴你",
            "想和你一起看遍花开","你是我最珍贵的人","想和你一起度过时光",
            "今天有没有想我","我会一直爱你","想和你一起慢慢变老",
            "你是我最放不下的人","想和你一起实现梦想","今天过得好吗",
            "我会一直守护你","想和你一起创造幸福","你是我最珍惜的人",
            "想和你一起走过岁月","今天有没有好好照顾自己","我会一直陪伴你",
            "想和你一起看遍世界","你是我最爱的人","想和你一起度过每一天",
            "今天有没有想我","我会一直爱你","想和你一起幸福到老",
            "你是我最重要的人","想和你一起书写美好","今天有没有开心",
            "我会一直守护你","想和你一起慢慢走","你是我最想念的人",
            "想和你一起迎接未来","今天有没有好好休息","我会一直陪着你",
            "想和你一起看遍风景","你是我最在乎的人","想和你一起走过人生",
            "今天有没有想我","我会一直爱你","想和你一起慢慢变老",
            "你是我最珍贵的人","想和你一起书写故事","今天过得怎么样",
            "我会一直守护你","想和你一起迎接明天","你是我最放不下的人",
            "想和你一起实现梦想","今天有没有好好吃饭","我会一直陪伴你",
            "想和你一起看遍花开","你是我最珍惜的人","想和你一起度过每一天",
            "今天有没有想我","我会一直爱你","想和你一起幸福下去",
            "你是我最爱的人","想和你一起慢慢走","今天有没有开心的事",
            "我会一直守护你","想和你一起经历风雨","你是我最想念的人",
            "想和你一起看遍星辰","今天有没有好好休息","我会一直陪着你",
            "想和你一起创造美好回忆","你是我最珍贵的人","想和你一起度过时光",
            "今天有没有想我","我会一直爱你","想和你一起慢慢变老",
            "你是我最放不下的人","想和你一起实现梦想","今天过得好吗",
            "我会一直守护你","想和你一起创造幸福","你是我最珍惜的人",
            "想和你一起走过岁月","今天有没有好好照顾自己","我会一直陪伴你",
            "想和你一起看遍世界","你是我最爱的人","想和你一起度过每一天",
            "今天有没有想我","我会一直爱你","想和你一起幸福到老",
            "你是我最重要的人","想和你一起书写美好","今天有没有开心",
            "我会一直守护你","想和你一起慢慢走","你是我最想念的人",
            "想和你一起迎接未来","今天有没有好好休息","我会一直陪着你",
            "想和你一起看遍风景","你是我最在乎的人","想和你一起走过人生",
            "今天有没有想我","我会一直爱你","想和你一起慢慢变老",
            "你是我最珍贵的人","想和你一起书写故事","今天过得怎么样",
            "我会一直守护你","想和你一起迎接明天","你是我最放不下的人",
            "想和你一起实现梦想","今天有没有好好吃饭","我会一直陪伴你",
            "想和你一起看遍花开","你是我最珍惜的人","想和你一起度过每一天",
            "今天有没有想我","我会一直爱你","想和你一起幸福下去",
            "你是我最爱的人","想和你一起慢慢走","今天有没有开心的事",
            "我会一直守护你","想和你一起经历风雨","你是我最想念的人",
            "想和你一起看遍星辰","今天有没有好好休息","我会一直陪着你",
            "想和你一起创造美好回忆","你是我最珍贵的人","想和你一起度过时光",
            "今天有没有想我","我会一直爱你","想和你一起慢慢变老",
            "你是我最放不下的人","想和你一起实现梦想","今天过得好吗",
            "我会一直守护你","想和你一起创造幸福","你是我最珍惜的人",
            "想和你一起走过岁月","今天有没有好好照顾自己","我会一直陪伴你",
            "想和你一起看遍世界","你是我最爱的人","想和你一起度过每一天",
            "今天有没有想我","我会一直爱你","想和你一起幸福到老"
        ],
        atmosphere: [
            "正在连接我们的思绪","Love","若要由我来谈爱的话",
            "Echo","听见我的回音了吗","Soulmate","灵魂正在共振"
        ],
        poke: [
            "拍了拍","亲了亲","戳了戳","抱了抱","摸了摸头",
            "捏了捏脸","牵了牵手","搂了搂腰","靠了靠肩","蹭了蹭"
        ],
        status: [
            "在想你","忙碌","休息中","工作中","学习中",
            "运动中","睡觉中","吃饭中","逛街中","旅行中"
        ]
    };

    /* ───────────────────── 音频上下文 ───────────────────── */
    let audioCtx = null;
    function getAudioContext() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        return audioCtx;
    }

    /* ───────────────────── 音效生成器 ───────────────────── */
    const SoundGenerator = {
        // 播放内置音效
        playBuiltin: function(presetKey, volume) {
            const preset = BUILTIN_SOUNDS[presetKey];
            if (!preset) return;
            vol = volume !== undefined ? volume : 0.15;

            switch (preset.generator) {
                case 'bell':
                    this._playBell(preset.params, vol);
                    break;
                case 'sine':
                    this._playSine(preset.params, vol);
                    break;
                case 'triangle':
                    this._playTriangle(preset.params, vol);
                    break;
                case 'sawtooth':
                    this._playSawtooth(preset.params, vol);
                    break;
                case 'kakao':
                    this._playKakao(preset.params, vol);
                    break;
            }
        },

        _playBell: function(params, volume) {
            const ctx = getAudioContext();
            const now = ctx.currentTime;
            params.harmonics.forEach((h, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.value = params.freq * h;
                gain.gain.setValueAtTime(volume * (1 / (i + 1)), now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + params.decay * (i + 1));
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + params.decay * (i + 1));
            });
        },

        _playSine: function(params, volume) {
            const ctx = getAudioContext();
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = params.freq;
            gain.gain.setValueAtTime(volume, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + params.decay);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + params.decay);
        },

        _playTriangle: function(params, volume) {
            const ctx = getAudioContext();
            const now = ctx.currentTime;
            params.harmonics.forEach((h, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.value = params.freq * h;
                gain.gain.setValueAtTime(volume * 0.5 / (i + 1), now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + params.decay);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + params.decay);
            });
        },

        _playSawtooth: function(params, volume) {
            const ctx = getAudioContext();
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const filter = ctx.createBiquadFilter();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.value = params.freq;
            filter.type = 'lowpass';
            filter.frequency.value = params.freq * 4;
            gain.gain.setValueAtTime(volume * 0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + params.decay);
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + params.decay);
        },

        _playKakao: function(params, volume) {
            const ctx = getAudioContext();
            const now = ctx.currentTime;
            [1, 1.2, 0.8].forEach((ratio, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.value = params.freq * ratio;
                gain.gain.setValueAtTime(volume, now + i * 0.05);
                gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + params.decay);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now + i * 0.05);
                osc.stop(now + i * 0.05 + params.decay);
            });
        }
    };

    /* ───────────────────── 数据导出 ───────────────────── */
    const DataExporter = {
        // 导出所有数据
        exportAll: function() {
            const data = {
                version: '2.0',
                exportTime: new Date().toISOString(),
                settings: this._getSettings(),
                messages: this._getMessages(),
                customReplies: this._getCustomReplies(),
                moments: this._getMoments(),
                moodRecords: this._getMoodRecords(),
                anniversaries: this._getAnniversaries(),
                companionDiary: this._getCompanionDiary(),
                envelopes: this._getEnvelopes(),
                soundSettings: this._getSoundSettings(),
                themeSettings: this._getThemeSettings(),
                cardConcatSettings: this._getCardConcatSettings(),
                sessionData: this._getSessionData()
            };
            return data;
        },

        // 导出字卡库
        exportCardLibrary: function() {
            const data = {
                version: '2.0',
                type: 'card-library',
                exportTime: new Date().toISOString(),
                library: this._getCustomReplies()
            };
            return data;
        },

        // 导出音效设置
        exportSoundSettings: function() {
            const data = {
                version: '2.0',
                type: 'sound-settings',
                exportTime: new Date().toISOString(),
                settings: this._getSoundSettings()
            };
            return data;
        },

        // 下载 JSON 文件
        downloadJSON: function(data, filename) {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename || '传讯备份_' + new Date().toISOString().slice(0, 10) + '.json';
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);
        },

        _getSettings: function() {
            try {
                const s = localStorage.getItem('settings');
                return s ? JSON.parse(s) : {};
            } catch(e) { return {}; }
        },

        _getMessages: function() {
            try {
                const m = localStorage.getItem('messages');
                return m ? JSON.parse(m) : [];
            } catch(e) { return []; }
        },

        _getCustomReplies: function() {
            try {
                const r = localStorage.getItem('customReplies');
                return r ? JSON.parse(r) : { reply: { main: [], atmosphere: [], poke: [], status: [] }, groups: [] };
            } catch(e) { 
                return { reply: { main: [], atmosphere: [], poke: [], status: [] }, groups: [] };
            }
        },

        _getMoments: function() {
            try {
                const m = localStorage.getItem('moments');
                return m ? JSON.parse(m) : [];
            } catch(e) { return []; }
        },

        _getMoodRecords: function() {
            try {
                const m = localStorage.getItem('moodRecords');
                return m ? JSON.parse(m) : {};
            } catch(e) { return {}; }
        },

        _getAnniversaries: function() {
            try {
                const a = localStorage.getItem('anniversaries');
                return a ? JSON.parse(a) : [];
            } catch(e) { return []; }
        },

        _getCompanionDiary: function() {
            try {
                const c = localStorage.getItem('companionDiary');
                return c ? JSON.parse(c) : [];
            } catch(e) { return []; }
        },

        _getEnvelopes: function() {
            try {
                const e = localStorage.getItem('envelopes');
                return e ? JSON.parse(e) : { outbox: [], inbox: [] };
            } catch(e) { return { outbox: [], inbox: [] }; }
        },

        _getSoundSettings: function() {
            try {
                const s = localStorage.getItem('soundSettings');
                return s ? JSON.parse(s) : {};
            } catch(e) { return {}; }
        },

        _getThemeSettings: function() {
            try {
                const t = localStorage.getItem('themeSettings');
                return t ? JSON.parse(t) : {};
            } catch(e) { return {}; }
        },

        _getCardConcatSettings: function() {
            try {
                const c = localStorage.getItem('cardConcatSettings');
                return c ? JSON.parse(c) : {};
            } catch(e) { return {}; }
        },

        _getSessionData: function() {
            try {
                const s = localStorage.getItem('sessionData');
                return s ? JSON.parse(s) : {};
            } catch(e) { return {}; }
        }
    };

    /* ───────────────────── 数据导入 ───────────────────── */
    const DataImporter = {
        // 导入数据
        importData: function(jsonData, options) {
            options = options || { merge: false, overwrite: true };

            if (typeof jsonData === 'string') {
                try {
                    jsonData = JSON.parse(jsonData);
                } catch(e) {
                    return { success: false, error: '无效的 JSON 格式' };
                }
            }

            const results = [];

            // 根据类型导入
            if (jsonData.type === 'card-library') {
                results.push(this._importCardLibrary(jsonData, options));
            } else if (jsonData.type === 'sound-settings') {
                results.push(this._importSoundSettings(jsonData, options));
            } else {
                // 全量导入
                results.push(this._importSettings(jsonData.settings, options));
                results.push(this._importMessages(jsonData.messages, options));
                results.push(this._importCustomReplies(jsonData.customReplies, options));
                results.push(this._importMoments(jsonData.moments, options));
                results.push(this._importMoodRecords(jsonData.moodRecords, options));
                results.push(this._importAnniversaries(jsonData.anniversaries, options));
                results.push(this._importCompanionDiary(jsonData.companionDiary, options));
                results.push(this._importEnvelopes(jsonData.envelopes, options));
                results.push(this._importSoundSettings(jsonData.soundSettings, options));
                results.push(this._importThemeSettings(jsonData.themeSettings, options));
                results.push(this._importCardConcatSettings(jsonData.cardConcatSettings, options));
            }

            return {
                success: results.every(r => r.success),
                results: results
            };
        },

        _importSettings: function(data, options) {
            if (!data) return { success: true, key: 'settings', count: 0 };
            try {
                if (options.merge) {
                    const existing = JSON.parse(localStorage.getItem('settings') || '{}');
                    data = Object.assign({}, existing, data);
                }
                localStorage.setItem('settings', JSON.stringify(data));
                return { success: true, key: 'settings', count: Object.keys(data).length };
            } catch(e) {
                return { success: false, key: 'settings', error: e.message };
            }
        },

        _importMessages: function(data, options) {
            if (!data || !Array.isArray(data)) return { success: true, key: 'messages', count: 0 };
            try {
                if (options.merge) {
                    const existing = JSON.parse(localStorage.getItem('messages') || '[]');
                    data = existing.concat(data);
                }
                localStorage.setItem('messages', JSON.stringify(data));
                return { success: true, key: 'messages', count: data.length };
            } catch(e) {
                return { success: false, key: 'messages', error: e.message };
            }
        },

        _importCustomReplies: function(data, options) {
            if (!data) return { success: true, key: 'customReplies', count: 0 };
            try {
                if (options.merge) {
                    const existing = JSON.parse(localStorage.getItem('customReplies') || '{"reply":{"main":[],"atmosphere":[],"poke":[],"status":[]},"groups":[]}');
                    if (data.reply && data.reply.main) {
                        existing.reply.main = existing.reply.main.concat(data.reply.main);
                    }
                    if (data.groups) {
                        existing.groups = existing.groups.concat(data.groups);
                    }
                    data = existing;
                }
                localStorage.setItem('customReplies', JSON.stringify(data));
                const count = (data.reply && data.reply.main ? data.reply.main.length : 0) +
                             (data.groups ? data.groups.length : 0);
                return { success: true, key: 'customReplies', count: count };
            } catch(e) {
                return { success: false, key: 'customReplies', error: e.message };
            }
        },

        _importCardLibrary: function(data, options) {
            if (!data || !data.library) return { success: false, key: 'cardLibrary', error: '无效的字卡库数据' };
            return this._importCustomReplies(data.library, options);
        },

        _importMoments: function(data, options) {
            if (!data || !Array.isArray(data)) return { success: true, key: 'moments', count: 0 };
            try {
                if (options.merge) {
                    const existing = JSON.parse(localStorage.getItem('moments') || '[]');
                    data = existing.concat(data);
                }
                localStorage.setItem('moments', JSON.stringify(data));
                return { success: true, key: 'moments', count: data.length };
            } catch(e) {
                return { success: false, key: 'moments', error: e.message };
            }
        },

        _importMoodRecords: function(data, options) {
            if (!data) return { success: true, key: 'moodRecords', count: 0 };
            try {
                if (options.merge) {
                    const existing = JSON.parse(localStorage.getItem('moodRecords') || '{}');
                    data = Object.assign({}, existing, data);
                }
                localStorage.setItem('moodRecords', JSON.stringify(data));
                return { success: true, key: 'moodRecords', count: Object.keys(data).length };
            } catch(e) {
                return { success: false, key: 'moodRecords', error: e.message };
            }
        },

        _importAnniversaries: function(data, options) {
            if (!data || !Array.isArray(data)) return { success: true, key: 'anniversaries', count: 0 };
            try {
                if (options.merge) {
                    const existing = JSON.parse(localStorage.getItem('anniversaries') || '[]');
                    data = existing.concat(data);
                }
                localStorage.setItem('anniversaries', JSON.stringify(data));
                return { success: true, key: 'anniversaries', count: data.length };
            } catch(e) {
                return { success: false, key: 'anniversaries', error: e.message };
            }
        },

        _importCompanionDiary: function(data, options) {
            if (!data || !Array.isArray(data)) return { success: true, key: 'companionDiary', count: 0 };
            try {
                if (options.merge) {
                    const existing = JSON.parse(localStorage.getItem('companionDiary') || '[]');
                    data = existing.concat(data);
                }
                localStorage.setItem('companionDiary', JSON.stringify(data));
                return { success: true, key: 'companionDiary', count: data.length };
            } catch(e) {
                return { success: false, key: 'companionDiary', error: e.message };
            }
        },

        _importEnvelopes: function(data, options) {
            if (!data) return { success: true, key: 'envelopes', count: 0 };
            try {
                if (options.merge) {
                    const existing = JSON.parse(localStorage.getItem('envelopes') || '{"outbox":[],"inbox":[]}');
                    if (data.outbox) existing.outbox = existing.outbox.concat(data.outbox);
                    if (data.inbox) existing.inbox = existing.inbox.concat(data.inbox);
                    data = existing;
                }
                localStorage.setItem('envelopes', JSON.stringify(data));
                const count = (data.outbox ? data.outbox.length : 0) + (data.inbox ? data.inbox.length : 0);
                return { success: true, key: 'envelopes', count: count };
            } catch(e) {
                return { success: false, key: 'envelopes', error: e.message };
            }
        },

        _importSoundSettings: function(data, options) {
            if (!data) return { success: true, key: 'soundSettings', count: 0 };
            try {
                if (options.merge) {
                    const existing = JSON.parse(localStorage.getItem('soundSettings') || '{}');
                    data = Object.assign({}, existing, data);
                }
                localStorage.setItem('soundSettings', JSON.stringify(data));
                return { success: true, key: 'soundSettings', count: Object.keys(data).length };
            } catch(e) {
                return { success: false, key: 'soundSettings', error: e.message };
            }
        },

        _importThemeSettings: function(data, options) {
            if (!data) return { success: true, key: 'themeSettings', count: 0 };
            try {
                if (options.merge) {
                    const existing = JSON.parse(localStorage.getItem('themeSettings') || '{}');
                    data = Object.assign({}, existing, data);
                }
                localStorage.setItem('themeSettings', JSON.stringify(data));
                return { success: true, key: 'themeSettings', count: Object.keys(data).length };
            } catch(e) {
                return { success: false, key: 'themeSettings', error: e.message };
            }
        },

        _importCardConcatSettings: function(data, options) {
            if (!data) return { success: true, key: 'cardConcatSettings', count: 0 };
            try {
                if (options.merge) {
                    const existing = JSON.parse(localStorage.getItem('cardConcatSettings') || '{}');
                    data = Object.assign({}, existing, data);
                }
                localStorage.setItem('cardConcatSettings', JSON.stringify(data));
                return { success: true, key: 'cardConcatSettings', count: Object.keys(data).length };
            } catch(e) {
                return { success: false, key: 'cardConcatSettings', error: e.message };
            }
        }
    };

    /* ───────────────────── 存储用量统计 ───────────────────── */
    const StorageStats = {
        calculate: function() {
            const stats = {
                total: 0,
                breakdown: {},
                limit: 5 * 1024 * 1024 // 约 5MB localStorage 限制
            };

            const keys = [
                'settings', 'messages', 'customReplies', 'moments',
                'moodRecords', 'anniversaries', 'companionDiary',
                'envelopes', 'soundSettings', 'themeSettings',
                'cardConcatSettings', 'sessionData', 'backgrounds',
                'stickerLibrary', 'myStickers', 'partnerStickers',
                'pokeLibrary', 'dailyGreeting', 'fortuneHistory',
                'divinationHistory', 'companionBg', 'companionNoise',
                'diaryBg', 'frameSettings', 'globalCSS', 'bubbleCSS'
            ];

            keys.forEach(key => {
                try {
                    const value = localStorage.getItem(key);
                    if (value) {
                        const size = new Blob([value]).size;
                        stats.breakdown[key] = {
                            size: size,
                            sizeText: this._formatSize(size),
                            count: this._getItemCount(key, value)
                        };
                        stats.total += size;
                    }
                } catch(e) {}
            });

            stats.totalText = this._formatSize(stats.total);
            stats.percentage = Math.min(100, (stats.total / stats.limit * 100).toFixed(1));
            return stats;
        },

        _formatSize: function(bytes) {
            if (bytes < 1024) return bytes + ' B';
            if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
            return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
        },

        _getItemCount: function(key, value) {
            try {
                const data = JSON.parse(value);
                if (Array.isArray(data)) return data.length;
                if (typeof data === 'object') return Object.keys(data).length;
                return 1;
            } catch(e) {
                return 1;
            }
        }
    };

    /* ───────────────────── 数据清理 ───────────────────── */
    const DataCleaner = {
        clearSession: function() {
            localStorage.removeItem('messages');
            localStorage.removeItem('sessionData');
            return { success: true, message: '本会话数据已清除' };
        },

        clearAll: function() {
            const keys = Object.keys(localStorage);
            keys.forEach(key => localStorage.removeItem(key));
            return { success: true, message: '所有数据已重置' };
        },

        clearByPrefix: function(prefix) {
            const keys = Object.keys(localStorage).filter(k => k.startsWith(prefix));
            keys.forEach(key => localStorage.removeItem(key));
            return { success: true, message: `已清除 ${keys.length} 项数据`, count: keys.length };
        }
    };

    /* ───────────────────── 初始化内置数据 ───────────────────── */
    function initBuiltinData() {
        // 如果字卡库为空，填充内置字卡
        try {
            const replies = localStorage.getItem('customReplies');
            if (!replies) {
                localStorage.setItem('customReplies', JSON.stringify
/**
 * features.js - 功能模块整合
 * 包含：字卡拼接、朋友圈系统、聊天设置节奏面板、音效系统、数据管理等
 */

// ==================== 全局命名空间 ====================
window.AppFeatures = window.AppFeatures || {};

// ==================== 音效系统 (内置) ====================
const AudioSystem = {
    ctx: null,
    volume: 0.15,
    enabled: true,

    init() {
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        } catch(e) {
            console.warn('Web Audio API not supported');
        }
        this.loadSettings();
    },

    loadSettings() {
        const saved = localStorage.getItem('audioSettings');
        if (saved) {
            const s = JSON.parse(saved);
            this.volume = s.volume ?? 0.15;
            this.enabled = s.enabled ?? true;
        }
    },

    saveSettings() {
        localStorage.setItem('audioSettings', JSON.stringify({
            volume: this.volume,
            enabled: this.enabled
        }));
    },

    // 内置音效生成器
    generateTone(type, duration = 0.15, frequency = 800) {
        if (!this.ctx || !this.enabled) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        const now = this.ctx.currentTime;

        switch(type) {
            case 'send':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(880, now);
                osc.frequency.exponentialRampToValueAtTime(440, now + 0.1);
                gain.gain.setValueAtTime(this.volume * 0.3, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
                break;
            case 'receive':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(660, now);
                osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
                gain.gain.setValueAtTime(this.volume * 0.3, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
                break;
            case 'poke':
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(400, now);
                osc.frequency.exponentialRampToValueAtTime(200, now + 0.1);
                gain.gain.setValueAtTime(this.volume * 0.4, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                break;
            case 'soft':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(600, now);
                gain.gain.setValueAtTime(this.volume * 0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
                break;
            case 'low':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(200, now);
                gain.gain.setValueAtTime(this.volume * 0.3, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
                break;
            case 'warm':
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(500, now);
                gain.gain.setValueAtTime(this.volume * 0.25, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
                break;
            case 'dark':
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(150, now);
                gain.gain.setValueAtTime(this.volume * 0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
                break;
            case 'haze':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(350, now);
                osc.frequency.linearRampToValueAtTime(300, now + duration);
                gain.gain.setValueAtTime(this.volume * 0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
                break;
            case 'kakaotalk':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, now);
                osc.frequency.setValueAtTime(1000, now + 0.05);
                gain.gain.setValueAtTime(this.volume * 0.3, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                break;
            default:
                osc.type = 'sine';
                osc.frequency.setValueAtTime(frequency, now);
                gain.gain.setValueAtTime(this.volume * 0.3, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
        }

        osc.start(now);
        osc.stop(now + duration + 0.05);
    },

    play(type) {
        if (!this.ctx) this.init();
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        this.generateTone(type);
    },

    setVolume(v) {
        this.volume = Math.max(0, Math.min(1, v));
        this.saveSettings();
    },

    toggle() {
        this.enabled = !this.enabled;
        this.saveSettings();
        return this.enabled;
    }
};

// ==================== 内置字卡库 ====================
const BuiltInCardLibrary = {
    // 主字卡库 - 情感类
    main: [
        "想你了", "今天过得怎么样", "记得按时吃饭", "别太累着自己",
        "我一直在", "抱抱你", "晚安好梦", "早安呀",
        "你笑起来真好看", "想和你一起看星星", "今天也要开心哦",
        "我在想你呢", "等你的消息", "想听你的声音", "想见你",
        "你是最棒的", "别忘了我", "想牵你的手", "想抱紧你",
        "今天有想我吗", "我会一直陪着你", "你是我最重要的人",
        "想和你一起去旅行", "想和你一起做饭", "想和你一起看电影",
        "你的消息是我每天的期待", "和你聊天是我最开心的事",
        "想和你一起度过每一天", "你是我心中的光",
        "不管多远我都会找到你", "想和你一起变老",
        "你的存在让我的世界完整", "想和你一起看日出日落",
        "你是我最美的意外", "想和你一起走过四季",
        "有你在身边真好", "想和你一起数星星",
        "你是我最想守护的人", "想和你一起创造回忆",
        "你的笑容是我最大的幸福", "想和你一起面对未来",
        "你是我生命中的奇迹", "想和你一起慢慢变老",
        "有你的日子都是晴天", "想和你一起探索世界",
        "你是我心中的唯一", "想和你一起写我们的故事"
    ],

    // 日常类
    daily: [
        "今天天气不错", "记得带伞", "多喝热水", "早点休息",
        "吃饭了没", "在干嘛呢", "忙完了吗", "累了吧",
        "注意休息", "别熬夜", "记得吃药", "穿暖和点",
        "路上小心", "到家了吗", "今天开心吗", "有什么新鲜事",
        "工作顺利吗", "学习累不累", "今天吃了什么",
        "睡得好吗", "做梦了吗", "今天有什么计划",
        "周末想去哪里", "最近在看什么", "有什么推荐",
        "今天听到一首歌想起你", "路过一家店想带你去",
        "看到一朵云像你", "今天的风很温柔像你"
    ],

    // 甜蜜类
    sweet: [
        "我爱你", "你是我的", "只喜欢你", "永远爱你",
        "心属于你", "为你心动", "爱你如初", "情深似海",
        "此生唯你", "至死不渝", "海枯石烂", "天长地久",
        "一见钟情", "两情相悦", "三生三世", "四季有你",
        "五湖四海", "六神无主", "七上八下", "八面玲珑",
        "九死一生", "十全十美", "百年好合", "千里共婵娟"
    ],

    // 安慰类
    comfort: [
        "没事的", "有我在", "别怕", "一切都会好",
        "我陪着你", "不要难过", "会过去的", "相信自己",
        "你很坚强", "不要放弃", "还有我", "不用担心",
        "我懂你的", "释放出来吧", "哭出来会好受点",
        "明天会更好", "阳光总在风雨后", "柳暗花明又一村"
    ],

    // 俏皮类
    playful: [
        "笨蛋", "傻瓜", "小懒猪", "小馋猫", "小迷糊",
        "又在发呆", "是不是想我了", "被我抓到了吧",
        "就知道你会这样", "你这个小机灵鬼", "调皮",
        "不听话", "欠收拾", "看我不教训你", "哼",
        "不理你了", "骗你的啦", "开个玩笑", "逗你玩呢"
    ],

    // 颜文字
    kaomoji: [
        "(｡♥‿♥｡)", "(◕‿◕✿)", "(｡◕‿◕｡)", "(◠‿◠✿)",
        "(｡･ω･｡)", "(◍•ᴗ•◍)", "(｡♥‿♥｡)", "(◕ᴗ◕✿)",
        "(｡･∀･｡)", "(◠‿◠)", "(｡◕‿◕｡)", "(◍•ᴗ•◍)❤",
        "(｡♥‿♥｡)", "(◕‿◕)", "(｡･ω･｡)ﾉ♡", "(◠‿◠)♡"
    ],

    // Emoji
    emoji: [
        "❤️", "💖", "💕", "💗", "💓", "💝", "💘", "💞",
        "😊", "😄", "😆", "🥰", "😍", "🤗", "☺️", "😚",
        "🌸", "🌺", "🌹", "🌷", "💐", "🌻", "🌼", "🌿",
        "⭐", "✨", "🌟", "💫", "☀️", "🌙", "🌈", "☁️",
        "🐱", "🐶", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯"
    ],

    // 拍一拍
    poke: [
        "拍了拍", "戳了戳", "捏了捏", "揉了揉", "摸了摸",
        "亲了亲", "抱了抱", "摇了摇", "拍了拍头", "戳了戳脸",
        "捏了捏鼻子", "揉了揉头发", "摸了摸头", "亲了亲额头",
        "抱了抱腰", "摇了摇肩膀", "拍了拍背", "戳了戳肚子"
    ],

    // 开场动画文案
    opening: [
        "正在连接我们的思绪", "Love", "若要由我来谈论爱的话",
        "Echo", "听见我的回音了吗？", "Soulmate", "灵魂正在共振"
    ],

    // 顶部格言
    motto: [
        "思念的电波已连接", "在按祁煜的思络", "亲了亲祁煜的脸颊",
        "戳了戳我的腰", "离开了", "掐了掐我的头说你好可爱",
        "思考", "听音乐", "抱住了我"
    ],

    // 对方状态
    status: [
        "在线", "忙碌", "离开", "思考", "听音乐", "抱住了我",
        "在想你", "等你消息", "刚刚", "7分钟前", "25分钟前"
    ],

    // 摸鱼活动
    idle: [
        "和小鱼们玩", "抓娃娃", "做饭", "逛海滩", "写信",
        "采风", "画画", "游泳", "晒太阳", "看星星"
    ],

    // 公告标题
    announcement: [
        "早上好", "七夕快乐", "思念你", "GOOD MORNING",
        "GOOD EVENING", "想你", "晚安", "早安"
    ],

    // 每日寄语
    dailyNote: [
        "今天也要元气满满，我在这里陪着你",
        "想你了，你有没有在想我呢",
        "不管今天发生什么，记得我一直都在",
        "你的笑容是我今天最大的动力",
        "愿你的每一天都充满阳光",
        "记得照顾好自己，我会担心的",
        "今天也要加油哦，我相信你",
        "想和你一起度过每一个平凡的日子"
    ]
};

// ==================== 字卡拼接功能 ====================
const CardConcat = {
    settings: {
        enabled: false,
        minCards: 2,
        maxCards: 5,
        probability: 30
    },

    momentSettings: {
        enabled: false,
        interval: 30,
        minCards: 3,
        maxCards: 6,
        imgProbability: 50
    },

    timer: null,

    init() {
        this.loadSettings();
        this.initUI();
        if (this.momentSettings.enabled) {
            this.startMomentTimer();
        }
    },

    loadSettings() {
        const saved = localStorage.getItem('cardConcatSettings');
        if (saved) {
            const data = JSON.parse(saved);
            this.settings = { ...this.settings, ...data.settings };
            this.momentSettings = { ...this.momentSettings, ...data.momentSettings };
        }
    },

    saveSettings() {
        localStorage.setItem('cardConcatSettings', JSON.stringify({
            settings: this.settings,
            momentSettings: this.momentSettings
        }));
    },

    // 从主字卡库随机抽取
    drawRandomCards(count) {
        const library = this.getMainLibrary();
        if (library.length < count) return [];

        const shuffled = [...library].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    },

    getMainLibrary() {
        // 优先使用用户自定义库
        try {
            const custom = localStorage.getItem('customReplies');
            if (custom) {
                const data = JSON.parse(custom);
                if (data.reply && data.reply.main && data.reply.main.length > 0) {
                    return data.reply.main.map(item => 
                        typeof item === 'string' ? item : (item.text || item.content || '')
                    ).filter(Boolean);
                }
            }
        } catch(e) {}

        // 回退到内置库
        return [...BuiltInCardLibrary.main, ...BuiltInCardLibrary.daily];
    },

    // 拼接字卡为一句话
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
                if (connector && !result.endsWith(connector)) {
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

    // 生成拼接消息
    generateMessage() {
        if (!this.settings.enabled) return null;
        if (Math.random() * 100 > this.settings.probability) return null;

        const library = this.getMainLibrary();
        if (library.length < this.settings.minCards) return null;

        const count = Math.floor(
            Math.random() * (this.settings.maxCards - this.settings.minCards + 1)
        ) + this.settings.minCards;

        const cards = this.drawRandomCards(Math.min(count, library.length));
        if (cards.length < 2) return null;

        return this.concatCards(cards);
    },

    // 生成朋友圈内容
    generateMomentContent() {
        if (!this.momentSettings.enabled) return null;

        const library = this.getMainLibrary();
        if (library.length < this.momentSettings.minCards) return null;

        const count = Math.floor(
            Math.random() * (this.momentSettings.maxCards - this.momentSettings.minCards + 1)
        ) + this.momentSettings.minCards;

        const cards = this.drawRandomCards(Math.min(count, library.length));
        if (cards.length < 2) return null;

        const text = this.concatCards(cards);
        const hasImage = Math.random() * 100 < this.momentSettings.imgProbability;

        return { text, hasImage, images: [] };
    },

    // 朋友圈定时器
    startMomentTimer() {
        this.stopMomentTimer();
        if (!this.momentSettings.enabled) return;

        const intervalMs = this.momentSettings.interval * 60 * 1000;
        this.timer = setInterval(() => {
            this.autoPublishMoment();
        }, intervalMs);
    },

    stopMomentTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    },

    restartMomentTimer() {
        this.startMomentTimer();
    },

    autoPublishMoment() {
        const content = this.generateMomentContent();
        if (!content || !content.text) return;

        const moments = MomentSystem.getMoments();
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
        MomentSystem.saveMoments(moments);

        // 刷新UI
        if (document.getElementById('moment-modal')?.classList.contains('active')) {
            MomentSystem.renderList();
        }

        // 通知
        if (typeof showNotification === 'function') {
            showNotification(`${partnerName}发布了新动态 ✦`, 'info');
        }
    },

    // 初始化UI绑定
    initUI() {
        // 主开关
        const toggle = document.getElementById('card-concat-toggle');
        const control = document.getElementById('card-concat-control');
        if (toggle && control) {
            const switchEl = toggle.querySelector('.setting-pill-switch');
            const knob = toggle.querySelector('.setting-pill-knob');

            const updateToggle = () => {
                if (this.settings.enabled) {
                    switchEl.style.background = 'var(--accent-color)';
                    knob.style.left = '23px';
                    control.style.display = 'block';
                } else {
                    switchEl.style.background = 'var(--border-color)';
                    knob.style.left = '3px';
                    control.style.display = 'none';
                }
            };

            updateToggle();

            toggle.addEventListener('click', () => {
                this.settings.enabled = !this.settings.enabled;
                this.saveSettings();
                updateToggle();
            });
        }

        // 最少条数
        const minSlider = document.getElementById('card-concat-min-slider');
        const minValue = document.getElementById('card-concat-min-value');
        if (minSlider && minValue) {
            minSlider.value = this.settings.minCards;
            minValue.textContent = this.settings.minCards + '条';
            minSlider.addEventListener('input', () => {
                this.settings.minCards = parseInt(minSlider.value);
                minValue.textContent = this.settings.minCards + '条';
                if (this.settings.minCards > this.settings.maxCards) {
                    this.settings.maxCards = this.settings.minCards;
                    const maxSlider = document.getElementById('card-concat-max-slider');
                    const maxValue = document.getElementById('card-concat-max-value');
                    if (maxSlider) maxSlider.value = this.settings.maxCards;
                    if (maxValue) maxValue.textContent = this.settings.maxCards + '条';
                }
                this.saveSettings();
            });
        }

        // 最多条数
        const maxSlider = document.getElementById('card-concat-max-slider');
        const maxValue = document.getElementById('card-concat-max-value');
        if (maxSlider && maxValue) {
            maxSlider.value = this.settings.maxCards;
            maxValue.textContent = this.settings.maxCards + '条';
            maxSlider.addEventListener('input', () => {
                this.settings.maxCards = parseInt(maxSlider.value);
                maxValue.textContent = this.settings.maxCards + '条';
                this.saveSettings();
            });
        }

        // 概率
        const probSlider = document.getElementById('card-concat-prob-slider');
        const probValue = document.getElementById('card-concat-prob-value');
        if (probSlider && probValue) {
            probSlider.value = this.settings.probability;
            probValue.textContent = this.settings.probability + '%';
            probSlider.addEventListener('input', () => {
                this.settings.probability = parseInt(probSlider.value);
                probValue.textContent = this.settings.probability + '%';
                this.saveSettings();
            });
        }

        // 朋友圈开关
        const momentToggle = document.getElementById('card-concat-moment-toggle');
        const momentControl = document.getElementById('card-concat-moment-control');
        if (momentToggle && momentControl) {
            const switchEl = momentToggle.querySelector('.setting-pill-switch');
            const knob = momentToggle.querySelector('.setting-pill-knob');

            const updateMomentToggle = () => {
                if (this.momentSettings.enabled) {
                    switchEl.style.background = 'var(--accent-color)';
                    knob.style.left = '23px';
                    momentControl.style.display = 'block';
                } else {
                    switchEl.style.background = 'var(--border-color)';
                    knob.style.left = '3px';
                    momentControl.style.display = 'none';
                }
            };

            updateMomentToggle();

            momentToggle.addEventListener('click', () => {
                this.momentSettings.enabled = !this.momentSettings.enabled;
                this.saveSettings();
                updateMomentToggle();
                if (this.momentSettings.enabled) {
                    this.startMomentTimer();
                } else {
                    this.stopMomentTimer();
                }
            });
        }

        // 朋友圈间隔
        const intervalSlider = document.getElementById('card-concat-moment-interval-slider');
        const intervalValue = document.getElementById('card-concat-moment-interval-value');
        if (intervalSlider && intervalValue) {
            intervalSlider.value = this.momentSettings.interval;
            intervalValue.textContent = this.momentSettings.interval + '分钟';
            intervalSlider.addEventListener('input', () => {
                this.momentSettings.interval = parseInt(intervalSlider.value);
                intervalValue.textContent = this.momentSettings.interval + '分钟';
                this.saveSettings();
                this.restartMomentTimer();
            });
        }

        // 朋友圈最少字卡
        const momentMinSlider = document.getElementById('card-concat-moment-min-slider');
        const momentMinValue = document.getElementById('card-concat-moment-min-value');
        if (momentMinSlider && momentMinValue) {
            momentMinSlider.value = this.momentSettings.minCards;
            momentMinValue.textContent = this.momentSettings.minCards + '条';
            momentMinSlider.addEventListener('input', () => {
                this.momentSettings.minCards = parseInt(momentMinSlider.value);
                momentMinValue.textContent = this.momentSettings.minCards + '条';
                if (this.momentSettings.minCards > this.momentSettings.maxCards) {
                    this.momentSettings.maxCards = this.momentSettings.minCards;
                    const maxSlider = document.getElementById('card-concat-moment-max-slider');
                    const maxValue = document.getElementById('card-concat-moment-max-value');
                    if (maxSlider) maxSlider.value = this.momentSettings.maxCards;
                    if (maxValue) maxValue.textContent = this.momentSettings.maxCards + '条';
                }
                this.saveSettings();
            });
        }

        // 朋友圈最多字卡
        const momentMaxSlider = document.getElementById('card-concat-moment-max-slider');
        const momentMaxValue = document.getElementById('card-concat-moment-max-value');
        if (momentMaxSlider && momentMaxValue) {
            momentMaxSlider.value = this.momentSettings.maxCards;
            momentMaxValue.textContent = this.momentSettings.maxCards + '条';
            momentMaxSlider.addEventListener('input', () => {
                this.momentSettings.maxCards = parseInt(momentMaxSlider.value);
                momentMaxValue.textContent = this.momentSettings.maxCards + '条';
                this.saveSettings();
            });
        }

        // 朋友圈图片概率
        const imgProbSlider = document.getElementById('card-concat-moment-img-prob-slider');
        const imgProbValue = document.getElementById('card-concat-moment-img-prob-value');
        if (imgProbSlider && imgProbValue) {
            imgProbSlider.value = this.momentSettings.imgProbability;
            imgProbValue.textContent = this.momentSettings.imgProbability + '%';
            imgProbSlider.addEventListener('input', () => {
                this.momentSettings.imgProbability = parseInt(imgProbSlider.value);
                imgProbValue.textContent = this.momentSettings.imgProbability + '%';
                this.saveSettings();
            });
        }
    }
};

// ==================== 朋友圈系统 ====================
const MomentSystem = {
    moments: [],
    settings: {
        cover: '',
        signature: '',
        avatar: ''
    },

    init() {
        this.loadData();
        this.initHeaderButton();
    },

    loadData() {
        try {
            const saved = localStorage.getItem('moments');
            if (saved) this.moments = JSON.parse(saved);

            const settings = localStorage.getItem('momentSettings');
            if (settings) this.settings = { ...this.settings, ...JSON.parse(settings) };
        } catch(e) {
            this.moments = [];
        }
    },

    saveData() {
        localStorage.setItem('moments', JSON.stringify(this.moments));
        localStorage.setItem('momentSettings', JSON.stringify(this.settings));
    },

    getMoments() {
        return this.moments;
    },

    saveMoments(moments) {
        this.moments = moments;
        this.saveData();
    },

    // 初始化顶部导航栏朋友圈按钮
    initHeaderButton() {
        const btn = document.getElementById('moment-header-btn');
        if (btn) {
            btn.onclick = () => this.openModal();
        }
    },

    openModal() {
        this.renderList();
        this.updateCover();
        const modal = document.getElementById('moment-modal');
        if (modal && typeof showModal === 'function') {
            showModal(modal);
        }
    },

    updateCover() {
        const cover = document.getElementById('moment-cover-bg');
        if (cover && this.settings.cover) {
            cover.style.backgroundImage = `url(${this.settings.cover})`;
            cover.style.backgroundSize = 'cover';
            cover.style.backgroundPosition = 'center';
        }

        const avatar = document.getElementById('moment-avatar');
        if (avatar && this.settings.avatar) {
            avatar.innerHTML = `<img src="${this.settings.avatar}" style="width:100%;height:100%;object-fit:cover;">`;
        }

        const username = document.getElementById('moment-username');
        if (username) {
            const partnerName = (typeof settings !== 'undefined' && settings.partnerName) ? settings.partnerName : '梦角';
            username.textContent = partnerName;
        }
    },

    renderList() {
        const list = document.getElementById('moment-list');
        if (!list) return;

        if (this.moments.length === 0) {
            list.innerHTML = `
                <div class="moment-empty">
                    <i class="fas fa-camera-retro"></i>
                    <p>还没有动态</p>
                    <p style="font-size:12px;opacity:0.6;">发布你的第一条朋友圈吧</p>
                </div>
            `;
            return;
        }

        list.innerHTML = this.moments.map(moment => {
            const date = new Date(moment.timestamp);
            const timeStr = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')} ${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`;

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

            const partnerName = (typeof settings !== 'undefined' && settings.partnerName) ? settings.partnerName : '梦角';

            return `
                <div class="moment-item" data-id="${moment.id}">
                    <div class="moment-item-avatar">
                        ${moment.author === 'partner' 
                            ? (this.settings.avatar ? `<img src="${this.settings.avatar}" style="width:100%;height:100%;object-fit:cover;">` : `<i class="fas fa-user" style="color:var(--accent-color);"></i>`)
                            : `<i class="fas fa-user-circle" style="color:var(--text-secondary);"></i>`
                        }
                    </div>
                    <div class="moment-item-content">
                        <div class="moment-item-name">${moment.authorName || (moment.author === 'partner' ? partnerName : '我')}</div>
                        <div class="moment-item-text">${this.escapeHtml(moment.text)}</div>
                        ${imagesHtml}
                        <div class="moment-item-meta">
                            <span>${timeStr}</span>
                            <div class="moment-item-actions">
                                <button class="${isLiked ? 'liked' : ''}" onclick="MomentSystem.toggleLike(${moment.id})">
                                    <i class="fas fa-heart"></i> ${moment.likes ? moment.likes.length : 0}
                                </button>
                                <button onclick="MomentSystem.addComment(${moment.id})">
                                    <i class="fas fa-comment"></i> ${moment.comments ? moment.comments.length : 0}
                                </button>
                            </div>
                        </div>
                        ${commentsHtml}
                    </div>
                </div>
            `;
        }).join('');
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    toggleLike(momentId) {
        const moment = this.moments.find(m => m.id === momentId);
        if (!moment) return;
        if (!moment.likes) moment.likes = [];
        const idx = moment.likes.indexOf('me');
        if (idx > -1) {
            moment.likes.splice(idx, 1);
        } else {
            moment.likes.push('me');
            AudioSystem.play('soft');
        }
        this.saveData();
        this.renderList();
    },

    addComment(momentId) {
        const text = prompt('输入评论:');
        if (!text || !text.trim()) return;

        const moment = this.moments.find(m => m.id === momentId);
        if (!moment) return;
        if (!moment.comments) moment.comments = [];

        moment.comments.push({
            name: '我',
            text: text.trim(),
            timestamp: Date.now()
        });

        this.saveData();
        this.renderList();
        AudioSystem.play('send');
    },

    publish() {
        const contentInput = document.getElementById('moment-content-input');
        const text = contentInput ? contentInput.value.trim() : '';
        if (!text) {
            alert('请输入内容');
            return;
        }

        this.moments.unshift({
            id: Date.now(),
            author: 'me',
            authorName: '我',
            text: text,
            images: [],
            likes: [],
            comments: [],
            timestamp: Date.now()
        });

        this.saveData();
        if (contentInput) contentInput.value = '';

        const modal = document.getElementById('publish-moment-modal');
        if (modal && typeof hideModal === 'function') hideModal(modal);

        this.renderList();
        AudioSystem.play('send');

        if (typeof showNotification === 'function') {
            showNotification('动态发布成功 ✦', 'success');
        }
    },
function renderStatsContent() {
            const statsContent = DOMElements.statsModal.content;

            const partnerMessages = messages.filter(msg =>
                msg.sender !== 'user' && msg.sender !== null &&
                msg.text &&
                msg.type !== 'system'
            );
            
            const myMessages = messages.filter(msg =>
                msg.sender === 'user' &&
                msg.text &&
                msg.type !== 'system'
            );

            if (partnerMessages.length === 0 && myMessages.length === 0) {
                statsContent.innerHTML = `
                    <div class="stats-empty-state">
                        <div class="stats-empty-icon"><i class="fas fa-chart-pie"></i></div>
                        <h3>暂无数据</h3>
                        <p>多聊几句再来看看吧...</p>
                    </div>`;
                return;
            }

            const getTopReplies = (msgs) => {
                const countMap = {};
                msgs.forEach(msg => {
                    const text = msg.text.trim();
                    if (text) {
                        countMap[text] = (countMap[text] || 0) + 1;
                    }
                });
                return Object.entries(countMap)
                    .map(([text, count]) => ({ text, count }))
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 5); 
            };

            const partnerTop = getTopReplies(partnerMessages);
            const myTop = getTopReplies(myMessages);

            const generateRankHTML = (list) => {
                if (list.length === 0) return '<div style="text-align:center;color:var(--text-secondary);font-size:12px;padding:10px;">暂无数据</div>';
                const maxVal = list[0].count;
                return list.map((item, index) => {
                    const percent = (item.count / maxVal) * 100;
                    return `
                    <div class="rank-item">
                        <div class="rank-progress-bg" style="width: ${percent}%; opacity: 0.1; background-color: var(--text-primary);"></div>
                        <div class="rank-info">
                            <div class="rank-number">#${index + 1}</div>
                            <div class="rank-text" title="${item.text}">${item.text}</div>
                            <div class="rank-count">${item.count}次</div>
                        </div>
                    </div>`;
                }).join('');
            };

            const allMsgs = messages.filter(m => m.timestamp);
            const firstMsg = allMsgs.length > 0 ? allMsgs[0] : { timestamp: new Date() };
            const lastMsg = allMsgs.length > 0 ? allMsgs[allMsgs.length - 1] : { timestamp: new Date() };

            const formatDate = (dateObj) => {
                return new Date(dateObj).toLocaleDateString('zh-CN', {
                    month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
                });
            };

            statsContent.innerHTML = `
                <div class="stats-dashboard">
                    <div class="stats-overview-grid">
                        <div class="overview-item overview-large">
                            <div class="overview-value">${messages.length}</div>
                            <div class="overview-label">总消息数</div>
                        </div>
                        <div class="overview-row-two">
                            <div class="overview-item">
                                <div class="overview-value">${myMessages.length}</div>
                                <div class="overview-label">我发送的</div>
                            </div>
                            <div class="overview-item">
                                <div class="overview-value">${partnerMessages.length}</div>
                                <div class="overview-label">对方发送的</div>
                            </div>
                        </div>
                        <div class="overview-row-dates">
                            <div class="overview-item overview-date">
                                <div class="overview-date-icon"><i class="fas fa-seedling"></i></div>
                                <div>
                                    <div class="overview-date-label">初次相遇</div>
                                    <div class="overview-date-value">${formatDate(firstMsg.timestamp)}</div>
                                </div>
                            </div>
                            <div class="overview-item overview-date">
                                <div class="overview-date-icon"><i class="fas fa-heart"></i></div>
                                <div>
                                    <div class="overview-date-label">最近联络</div>
                                    <div class="overview-date-value">${formatDate(lastMsg.timestamp)}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="stats-card">
                        <div style="display:flex; gap:8px; margin-bottom:12px;">
                            <button id="stats-toggle-partner" class="stats-toggle-btn active" onclick="switchStatsView('partner')">
                                <i class="fas fa-user-circle"></i> 对方
                            </button>
                            <button id="stats-toggle-me" class="stats-toggle-btn" onclick="switchStatsView('me')">
                                <i class="fas fa-user"></i> 我方
                            </button>
                        </div>
                        <div class="stats-card-title" id="stats-rank-title">
                            <i class="fas fa-user-circle"></i> 对方高频词 TOP 5
                        </div>
                        <div class="stats-rank-list" id="stats-rank-list">
                            ${generateRankHTML(partnerTop)}
                        </div>
                    </div>
                </div>
            `;

            statsContent._partnerHTML = generateRankHTML(partnerTop);
            statsContent._myHTML = generateRankHTML(myTop);
        }

        window.switchStatsView = function(who) {
            const statsContent = DOMElements.statsModal.content;
            const partnerBtn = document.getElementById('stats-toggle-partner');
            const meBtn = document.getElementById('stats-toggle-me');
            const title = document.getElementById('stats-rank-title');
            const list = document.getElementById('stats-rank-list');
            if (!partnerBtn || !meBtn || !list) return;

            if (who === 'partner') {
                partnerBtn.classList.add('active');
                meBtn.classList.remove('active');
                title.innerHTML = '<i class="fas fa-user-circle"></i> 对方高频词 TOP 5';
                list.innerHTML = statsContent._partnerHTML || '<div style="text-align:center;color:var(--text-secondary);font-size:12px;padding:10px;">暂无数据</div>';
            } else {
                meBtn.classList.add('active');
                partnerBtn.classList.remove('active');
                title.innerHTML = '<i class="fas fa-user"></i> 我方高频词 TOP 5';
                list.innerHTML = statsContent._myHTML || '<div style="text-align:center;color:var(--text-secondary);font-size:12px;padding:10px;">暂无数据</div>';
            }
        };
        function renderSessionList() {
            const listContainer = DOMElements.sessionModal.list;
            if (sessionList.length === 0) {
                listContainer.innerHTML = '<div class="stats-empty" style="padding: 20px 0;"><p>还没有会话</p></div>';
                return;
            }
            listContainer.innerHTML = sessionList.map(session => `
            <div class="session-item ${session.id === SESSION_ID ? 'active': ''}" data-id="${session.id}">
            <div class="session-info">
            <div class="session-name">${session.name}</div>
            <div class="session-meta">创建于 ${new Date(session.createdAt).toLocaleDateString()}</div>
            </div>
            <div class="session-actions">
            <button class="session-action-btn rename" title="重命名"><i class="fas fa-pen"></i></button>
            <button class="session-action-btn delete" title="删除"><i class="fas fa-trash"></i></button>
            </div>
            </div>
            `).join('');
        }


async function generateFortune() {
    const today = new Date();
    const todayKey = today.toDateString(); 
    const start = new Date(today.getFullYear(), 0, 1);
    const diff = today - start + (start.getTimezoneOffset() - today.getTimezoneOffset()) * 60000;
    const weekNum = Math.floor(diff / (1000 * 60 * 60 * 24) / 7);
    const weekKey = today.getFullYear() + '-W' + weekNum;

    const storageKey = `${APP_PREFIX}weekly_fortune`;
    let fortuneData = null;

    try {
        const savedData = await localforage.getItem(storageKey);
        if (savedData && savedData.week === weekKey) {
            fortuneData = savedData;
        }
    } catch (e) { console.warn("读取运势失败", e); }

const majorCards = CONSTANTS.TAROT_CARDS;
    if (!fortuneData) {
        const randomIndex = Math.floor(Math.random() * majorCards.length);
        const isUpright = Math.random() > 0.5;
        
        const fixedStars = isUpright ? (Math.floor(Math.random() * 2) + 4) : (Math.floor(Math.random() * 2) + 3);

        fortuneData = {
            week: weekKey,
            cardIndex: randomIndex,
            isUpright: isUpright,
            stars: fixedStars 
        };
        await localforage.setItem(storageKey, fortuneData);
    }

    renderFortunePanel(fortuneData, majorCards, todayKey);
}

function renderFortunePanel(weeklyData, majorCards, todayKey) {
    const content = document.getElementById('fortune-content');
    if (!content) return;

    content.innerHTML = `
        <div class="fortune-sub-tabs" style="display:flex;gap:8px;margin-bottom:14px;">
            <button id="fsub-weekly" class="modal-btn modal-btn-primary" style="flex:1;font-size:12px;padding:7px 0;" onclick="showFortuneSub('weekly')"><i class="fas fa-calendar-week"></i> 每周主牌</button>
            <button id="fsub-daily" class="modal-btn modal-btn-secondary" style="flex:1;font-size:12px;padding:7px 0;" onclick="showFortuneSub('daily')"><i class="fas fa-sun"></i> 每日运势</button>
        </div>
        <div id="fortune-sub-weekly"></div>
        <div id="fortune-sub-daily" style="display:none;"></div>
    `;

    renderWeeklyFortune(weeklyData, majorCards);
    renderDailyFortune(todayKey);

    showModal(document.getElementById('fortune-lenormand-modal'));
}

window.showFortuneSub = function(tab) {
    const weeklyEl = document.getElementById('fortune-sub-weekly');
    const dailyEl = document.getElementById('fortune-sub-daily');
    const weeklyBtn = document.getElementById('fsub-weekly');
    const dailyBtn = document.getElementById('fsub-daily');
    if (tab === 'weekly') {
        if (weeklyEl) weeklyEl.style.display = '';
        if (dailyEl) dailyEl.style.display = 'none';
        if (weeklyBtn) weeklyBtn.className = 'modal-btn modal-btn-primary';
        if (dailyBtn) dailyBtn.className = 'modal-btn modal-btn-secondary';
        weeklyBtn.style.flex = dailyBtn.style.flex = '1';
        weeklyBtn.style.fontSize = dailyBtn.style.fontSize = '12px';
        weeklyBtn.style.padding = dailyBtn.style.padding = '7px 0';
    } else {
        if (weeklyEl) weeklyEl.style.display = 'none';
        if (dailyEl) dailyEl.style.display = '';
        if (weeklyBtn) weeklyBtn.className = 'modal-btn modal-btn-secondary';
        if (dailyBtn) dailyBtn.className = 'modal-btn modal-btn-primary';
        weeklyBtn.style.flex = dailyBtn.style.flex = '1';
        weeklyBtn.style.fontSize = dailyBtn.style.fontSize = '12px';
        weeklyBtn.style.padding = dailyBtn.style.padding = '7px 0';
    }
};

function renderWeeklyFortune(data, majorCards) {
    const el = document.getElementById('fortune-sub-weekly');
    if (!el) return;

    const card = majorCards[data.cardIndex];
    const isUpright = data.isUpright;
    const starCount = data.stars || 3;

    let starsHtml = Array(5).fill(0).map((_, i) => 
        `<i class="fas fa-star" style="color: ${i < starCount ? 'var(--accent-color)' : 'var(--border-color)'}; font-size: 12px; margin: 0 2px;"></i>`
    ).join('');

    el.innerHTML = `
        <div style="text-align:center; margin-bottom:15px; color:var(--text-secondary); font-size:12px; letter-spacing: 1px;">
            <i class="fas fa-sparkles" style="color:var(--accent-color);"></i> 凭直觉点击翻开你的每周主牌
        </div>
        
        <div class="tarot-container-3d" onclick="this.classList.toggle('flipped');">
            <div class="tarot-card-inner">
                <div class="tarot-face tarot-front">
                    <div class="tarot-pattern"><i class="fas fa-star-and-crescent"></i></div>
                </div>
                <div class="tarot-face tarot-back" style="background: linear-gradient(135deg, var(--secondary-bg), rgba(var(--accent-color-rgb), 0.05)); border: 2px solid rgba(var(--accent-color-rgb), 0.3); padding: 14px 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; overflow-y: auto;">
                    <div class="tarot-visual ${isUpright ? '' : 'reversed'}" style="height:80px; flex-shrink:0;">
                        <i class="fas ${card.icon} tarot-icon-vector" style="font-size:42px; color: var(--accent-color);"></i>
                    </div>
                    <div style="text-align:center; width:100%;">
                        <div class="tarot-card-name" style="font-size:18px; font-weight: 700; margin-bottom:3px;">${card.name}</div>
                        <div style="font-size:10px; color:var(--text-secondary); margin-bottom:6px;">${isUpright ? '正位' : '逆位'}</div>
                        <div style="font-size:12px; color: var(--accent-color); font-weight:600; margin-bottom:6px;">「${card.keyword}」</div>
                        <div style="margin-bottom:8px;">${starsHtml}</div>
                        <div style="font-size:11px; color:var(--text-secondary); line-height:1.6; text-align:left;">${card.meaning}</div>
                    </div>
                </div>
            </div>
        </div>

    `;
}

async function renderDailyFortune(todayKey) {
    const el = document.getElementById('fortune-sub-daily');
    if (!el) return;

    const storageKey = `${APP_PREFIX}daily_fortune_3`;
    let dailyData = null;

    try {
        const saved = await localforage.getItem(storageKey);
        if (saved && saved.day === todayKey) {
            dailyData = saved;
        }
    } catch(e) {}

    if (!dailyData) {
        const deck = [...ALL_78_TAROT_CARDS];
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        const drawn = deck.slice(0, 3).map(card => ({
            name: card.name,
            type: card.type || 'major',
            keyword: card.keyword,
            upright: card.upright || card.meaning,
            reversed: card.reversed || card.meaning,
            icon: card.icon || 'fa-star',
            img: card.img || null,
            isUpright: Math.random() > 0.5
        }));
        dailyData = { day: todayKey, cards: drawn };
        try { await localforage.setItem(storageKey, dailyData); } catch(e) {}
    }

    const positionLabels = ['过去 · 根源', '现在 · 核心', '未来 · 启示'];
    const positionColors = ['rgba(var(--accent-color-rgb),0.6)', 'var(--accent-color)', 'rgba(var(--accent-color-rgb),0.8)'];

    el.innerHTML = `
        <div style="text-align:center; margin-bottom:14px; color:var(--text-secondary); font-size:12px; letter-spacing:1px;">
            <i class="fas fa-moon" style="color:var(--accent-color);"></i> ${new Date().toLocaleDateString('zh-CN', {month:'long',day:'numeric'})} · 三牌展开
        </div>
        <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap; margin-bottom:16px;">
            ${dailyData.cards.map((card, i) => `
                <div style="flex:1;min-width:90px;max-width:130px;text-align:center;">
                    <div style="font-size:10px;color:${positionColors[i]};margin-bottom:6px;font-weight:600;letter-spacing:0.5px;">${positionLabels[i]}</div>
                    <div class="tarot-container-3d tarot-responsive" style="cursor:pointer;margin-bottom:8px;" onclick="this.classList.toggle('flipped'); document.getElementById('daily-interp-${i}').style.display = this.classList.contains('flipped') ? 'block' : 'none';">
                        <div class="tarot-card-inner">
                            <div class="tarot-face tarot-front"><div class="tarot-pattern" style="font-size:18px;"><i class="fas fa-star-and-crescent"></i></div></div>
                            <div class="tarot-face tarot-back" style="background:linear-gradient(135deg,var(--secondary-bg),rgba(var(--accent-color-rgb),0.07));border:1.5px solid rgba(var(--accent-color-rgb),0.3);padding:0;overflow:hidden;">
                                <div class="tarot-visual ${card.isUpright ? '' : 'reversed'}" style="height:100%;width:100%;margin:0;padding:0;">
                                    ${card.img ? `<img src="${card.img}" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"><div style="display:none;height:100%;align-items:center;justify-content:center;"><i class="fas ${card.icon}" style="font-size:28px;color:var(--accent-color);"></i></div>` : `<div style="height:100%;display:flex;align-items:center;justify-content:center;"><i class="fas ${card.icon}" style="font-size:28px;color:var(--accent-color);"></i></div>`}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="daily-interp-${i}" style="display:none;text-align:left;margin-top:6px;padding:8px 10px;background:rgba(var(--accent-color-rgb),0.06);border-radius:10px;border:1px solid rgba(var(--accent-color-rgb),0.15);">
                        <div style="font-size:11px;font-weight:700;color:var(--accent-color);margin-bottom:4px;">${card.keyword}</div>
                        <div style="font-size:11px;color:var(--text-secondary);line-height:1.6;">${card.isUpright ? (card.upright || card.meaning || '') : (card.reversed || card.meaning || '')}</div>
                    </div>
                </div>
            `).join('')}
        </div>
      <div style="margin-bottom:10px;">
            <div style="font-size:11px;color:var(--text-secondary);margin-bottom:6px;font-weight:500;">✍️ 今日解读</div>
            <textarea id="daily-fortune-notes" placeholder="写下你对今日牌阵的感悟..." style="width:100%;box-sizing:border-box;padding:10px 12px;border:1.5px solid var(--border-color);border-radius:10px;background:var(--primary-bg);color:var(--text-primary);font-size:12px;font-family:var(--font-family);resize:vertical;min-height:72px;outline:none;transition:border 0.18s;line-height:1.6;" onfocus="this.style.borderColor='var(--accent-color)'" onblur="this.style.borderColor='var(--border-color)'">${(function(){try{return localStorage.getItem('dailyFortuneNotes_'+todayKey)||''}catch(e){return ''}}())}</textarea>
            <div style="display:flex;justify-content:flex-end;margin-top:4px;">
                <button onclick="(function(){var t=document.getElementById('daily-fortune-notes');try{localStorage.setItem('dailyFortuneNotes_'+'${todayKey}',t.value);}catch(e){}this.textContent='已保存 ✓';var self=this;setTimeout(function(){self.textContent='保存';},1500);}).call(this)" style="font-size:11px;padding:4px 12px;border:1.5px solid var(--accent-color);border-radius:8px;background:transparent;color:var(--accent-color);cursor:pointer;font-family:var(--font-family);">保存</button>
            </div>
        </div>
        <div style="font-size:11px;color:var(--text-secondary);text-align:center;padding:8px;background:rgba(var(--accent-color-rgb),0.05);border-radius:8px;">
            <i class="fas fa-sync-alt" style="color:var(--accent-color);margin-right:4px;"></i>每日零时自动更新 · 点击牌背翻开查看解读
        </div>
    `;
}

let lenormandSystem = 36;
let lenormandCount = 1;

const LENORMAND_CARDS_40 = [
    { num: 1, name: "骑士", icon: "🏇", keyword: "消息·速度", meaning: "快速到来的消息，行动迅速，使者，短途旅行。" },
    { num: 2, name: "四叶草", icon: "🍀", keyword: "幸运·机遇", meaning: "小幸运，偶然的好运，短暂的喜悦，乐观面对生活。" },
    { num: 3, name: "帆船", icon: "⛵", keyword: "旅行·方向", meaning: "旅行，冒险，追寻目标，人生的航向。" },
    { num: 4, name: "房屋", icon: "🏠", keyword: "家庭·安稳", meaning: "家，稳定，安全感，家庭关系，房产。" },
    { num: 5, name: "大树", icon: "🌳", keyword: "健康·根基", meaning: "健康，生命力，成长，根基，长久稳固。" },
    { num: 6, name: "乌云", icon: "☁️", keyword: "困惑·障碍", meaning: "困惑，不确定，暂时的阴霾，需要耐心等待。" },
    { num: 7, name: "蛇", icon: "🐍", keyword: "诱惑·迂回", meaning: "竞争者，诱惑，迂回的道路，复杂的女性。" },
    { num: 8, name: "棺材", icon: "⚰️", keyword: "结束·转变", meaning: "结束，转变，某事告一段落，低落期，疾病。" },
    { num: 9, name: "花束", icon: "💐", keyword: "礼物·喜悦", meaning: "礼物，惊喜，喜悦，美好的关系，感激之情。" },
    { num: 10, name: "镰刀", icon: "🌾", keyword: "决断·收割", meaning: "突然的决定，危险，收割，结束，手术。" },
    { num: 11, name: "鞭子", icon: "⚡", keyword: "争执·激情", meaning: "争论，冲突，重复，激情，体育运动。" },
    { num: 12, name: "鸟儿", icon: "🐦", keyword: "对话·焦虑", meaning: "对话，流言，消息，焦虑，一对情侣。" },
    { num: 13, name: "孩童", icon: "🧒", keyword: "新开始·纯真", meaning: "新的开始，纯真，孩子，小事，新鲜感。" },
    { num: 14, name: "狐狸", icon: "🦊", keyword: "狡猾·工作", meaning: "狡猾，策略，工作，谨防欺骗，自我保护。" },
    { num: 15, name: "熊", icon: "🐻", keyword: "力量·权威", meaning: "强大的力量，老板，财务，母性，保护者。" },
    { num: 16, name: "星星", icon: "⭐", keyword: "希望·指引", meaning: "希望，梦想，灵感，指引，清晰，美好未来。" },
    { num: 17, name: "鹳鸟", icon: "🕊️", keyword: "变化·移动", meaning: "变化，移动，适应，新的生活阶段，迁徙。" },
    { num: 18, name: "狗", icon: "🐕", keyword: "友谊·忠诚", meaning: "忠诚的朋友，友谊，可靠，支持，宠物。" },
    { num: 19, name: "高塔", icon: "🏰", keyword: "孤独·机构", meaning: "孤独，边界，机构，官方，距离，自我保护。" },
    { num: 20, name: "花园", icon: "🌺", keyword: "社交·公众", meaning: "社交场合，公众，聚会，开放的空间。" },
    { num: 21, name: "山丘", icon: "⛰️", keyword: "障碍·挑战", meaning: "障碍，挑战，延迟，竞争，需要攀越的困难。" },
    { num: 22, name: "十字路口", icon: "🛤️", keyword: "选择·方向", meaning: "选择，岔路，可能性，多条道路，决策时刻。" },
    { num: 23, name: "老鼠", icon: "🐀", keyword: "损耗·压力", meaning: "损失，压力，焦虑，偷走，逐渐减少，担忧。" },
    { num: 24, name: "心", icon: "❤️", keyword: "爱情·感情", meaning: "爱，感情，关怀，真心，情感的核心。" },
    { num: 25, name: "指环", icon: "💍", keyword: "承诺·契约", meaning: "承诺，契约，婚姻，合作，循环往复。" },
    { num: 26, name: "书", icon: "📚", keyword: "秘密·知识", meaning: "秘密，知识，学习，隐藏的信息，需要深入了解。" },
    { num: 27, name: "信件", icon: "✉️", keyword: "沟通·文件", meaning: "通讯，文件，信息，书面合同，重要的消息。" },
    { num: 28, name: "男士", icon: "👨", keyword: "男性·当事人", meaning: "主要男性人物，男性提问者或重要男性。" },
    { num: 29, name: "女士", icon: "👩", keyword: "女性·当事人", meaning: "主要女性人物，女性提问者或重要女性。" },
    { num: 30, name: "百合", icon: "🌸", keyword: "纯洁·平静", meaning: "纯洁，平静，和谐，成熟的感情，高尚的品格。" },
    { num: 31, name: "太阳", icon: "☀️", keyword: "成功·活力", meaning: "成功，活力，快乐，温暖，光明，积极能量。" },
    { num: 32, name: "月亮", icon: "🌙", keyword: "荣誉·直觉", meaning: "荣誉，名声，直觉，情感波动，创造力，梦境。" },
    { num: 33, name: "钥匙", icon: "🔑", keyword: "答案·解锁", meaning: "答案，解决方案，重要发现，开启新的可能。" },
    { num: 34, name: "鱼", icon: "🐟", keyword: "财富·流动", meaning: "财富，生意，流动，丰盛，商业活动，资源。" },
    { num: 35, name: "锚", icon: "⚓", keyword: "稳定·坚持", meaning: "稳定，坚持，目标，长期，踏实，工作。" },
    { num: 36, name: "十字架", icon: "✝️", keyword: "命运·担当", meaning: "命运，责任，痛苦，信仰，接受，精神使命。" },
    { num: 37, name: "灵体", icon: "💭", keyword: "高我·感受", meaning: "直觉，感受，觉察，因果规律，灵魂伴侣，。" },
    { num: 38, name: "香炉", icon: "⚖️", keyword: "清除·归零", meaning: "清除，净化，消散，弥漫，清净之地，氛围感。" },
    { num: 39, name: "床", icon: "🛏", keyword: "舒适·休息", meaning: "睡觉，回避，躺平，舒适，卧室，性关系。" },
    { num: 40, name: "市场", icon: "🏪", keyword: "交易·工作", meaning: "工作，交易，维护，运营，势均力敌，出去游玩。" }
];

function getLenormandCards() {
    return LENORMAND_CARDS_40.slice(0, lenormandSystem);
}

function setLenormandSystem(n) {
    lenormandSystem = n;
}

function setLenormandCount(n) {
    lenormandCount = n;
    document.querySelectorAll('.lenormand-num-btn').forEach(btn => {
        const numEl = btn.querySelector('.leno-btn-num');
        btn.classList.toggle('active', numEl && parseInt(numEl.textContent) === n);
    });
    updateLenoNumDesc(n);
}

function updateLenoNumDesc(n) {
    const desc = document.getElementById('leno-num-desc');
    if (!desc) return;
    if (n === 1) desc.textContent = '单张牌 · 直达答案';
    else if (n === 3) desc.textContent = '三张牌 · 洞察全局';
}

function switchFLTab(tab) {
    document.querySelectorAll('.fl-tab').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.fl-panel').forEach(panel => panel.classList.remove('fl-panel-active'));
    const activeTab = document.getElementById('fl-tab-' + tab);
    const activePanel = document.getElementById('fl-panel-' + tab);
    if (activeTab) activeTab.classList.add('active');
    if (activePanel) activePanel.classList.add('fl-panel-active');
}

function openLenormandModal() {
    resetLenormand();
    switchFLTab('lenormand');
    showModal(document.getElementById('fortune-lenormand-modal'));
}

function resetLenormand() {
    const setup = document.getElementById('lenormand-setup');
    const result = document.getElementById('lenormand-result');
    const resetBtn = document.getElementById('lenormand-reset-btn');
    const qInput = document.getElementById('lenormand-question');
    if (setup) setup.style.display = '';
    if (result) result.style.display = 'none';
    if (resetBtn) resetBtn.style.display = 'none';
    if (qInput) qInput.value = '';
    lenormandSystem = 40;
    lenormandCount = 1;
    document.querySelectorAll('.lenormand-num-btn').forEach(btn => {
        const num = btn.querySelector('.leno-btn-num');
        btn.classList.toggle('active', num && num.textContent.trim() === '1');
    });
    updateLenoNumDesc(1);
}

function startLenormandDraw() {
    const cards = getLenormandCards();
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    const drawn = shuffled.slice(0, lenormandCount);
    const question = document.getElementById('lenormand-question').value.trim();

    let cardsHTML = drawn.map((card, i) => `
        <div class="lenormand-card-item" style="animation-delay:${i * 0.1}s;">
            <span class="lenormand-card-icon">${card.icon}</span>
            <div class="lenormand-card-name">${card.name}</div>
            <div class="lenormand-card-num">No.${card.num}</div>
            <div class="lenormand-card-keyword">「${card.keyword}」</div>
            <div class="lenormand-card-meaning">${card.meaning}</div>
        </div>
    `).join('');

    let synthesisHTML = '';
    if (drawn.length > 1) {
        const keywords = drawn.map(c => c.keyword.split('·')[0]).join('、');
        const energies = drawn.map(c => c.name).join(' + ');
        const m0 = drawn[0].meaning.split('，')[0];
        const m2 = drawn.length >= 3 ? drawn[2].meaning.split('，')[0] : '';
        const n0 = drawn[0].name, n1 = drawn[1].name, n2 = drawn.length >= 3 ? drawn[2].name : '';
        
        const templates3 = [
            `「${n0}」的能量如同${m0}的底色，与「${n1}」相互呼应；「${n2}」则带来${m2}的质感。三张牌的能量流动，共同编织出一段关于${keywords}的故事。`,
            `星盘之上，「${n0}」、「${n1}」、「${n2}」三张牌依次展开——各自携带的能量在此汇聚，悄悄低语。${keywords}，是此刻需要关注的核心能量。`,
            `「${n0}」与「${n1}」、「${n2}」共同呈现：${m0}的力量与${m2}的方向在这里交织，等待你迈出那一步。愿三张牌的能量，成为你此刻的指引。`,
            `三张牌共同呈现了一段旅程：「${n0}」、「${n1}」、「${n2}」依次展开，${keywords}的主题贯穿其中，指引着前行的方向。`,
            `宇宙借${energies}的能量，向你传递信息：${m0}的力量与${m2}的可能性已悄然开启，请相信这段旅程有其深意。`
        ];
        const templates2 = [
            `「${n0}」与「${n1}」的能量相遇，${keywords}的主题在此交汇。${m0}的力量遇见了新的可能，共同描绘出当下局势的面貌。`,
            `两张牌携手而来：「${n0}」带着${m0}的底色，「${n1}」带来新的视角。它们共同指向一个关于${keywords}的答案，等待你细细品味。`,
            `${energies}——两种能量在你的问题上留下印记。${m0}与对方的能量相互作用，当前局面因此充满了${keywords}的质感。静下心来，答案已在其中。`,
            `牌与牌之间总有呼应。「${n0}」和「${n1}」的组合，像是宇宙特意为你排列的密码，${keywords}便是解读这段缘分的钥匙。`
        ];
        
        const templates = drawn.length === 3 ? templates3 : templates2;
        const chosenText = templates[Math.floor(Math.random() * templates.length)];
        
        synthesisHTML = `
        <div class="lenormand-synthesis">
            <div class="lenormand-synthesis-title">✦ 综合解读</div>
            ${chosenText}
        </div>`;
    }

    const questionDisplay = question ? `<div class="lenormand-question-show">「${question}」</div>` : '';

    document.getElementById('lenormand-result').innerHTML = `
        ${questionDisplay}
        <div style="text-align:center; font-size:12px; color:var(--text-secondary); margin-bottom:12px;">
            <i class="fas fa-moon"></i> 雷诺曼轻声说 · 爱能克服远距离
        </div>
        <div class="lenormand-cards-row">${cardsHTML}</div>
        ${synthesisHTML}
    `;

    document.getElementById('lenormand-setup').style.display = 'none';
    document.getElementById('lenormand-result').style.display = '';
    document.getElementById('lenormand-reset-btn').style.display = '';

    const lCards = drawn.map(c => ({ name: c.name, keyword: c.keyword, position: '', isReversed: false, meaning: c.meaning }));
    saveDiviHistory({ type: `雷诺曼${lenormandCount === 1 ? '单张' : '三张'}`, question, cards: lCards });
}

const ALL_78_TAROT_CARDS = [
    { name: "愚人", num: "0", type: "major", eng: "The Fool", keyword: "流浪", upright: "全新的开始、冒险精神、天真无邪、活在当下、无限可能、信任直觉、大胆尝试、不受约束", reversed: "愚蠢的决定、鲁莽行事、逃避责任、犹豫不决、缺乏方向感、错失良机、不切实际", img: "https://i.postimg.cc/hGv9scYL/96e54bea7c980b53d1f2904d6de1139b.jpg" },
    { name: "魔术师", num: "I", type: "major", eng: "The Magician", keyword: "创造", upright: "创造力爆发、技能娴熟、意志力强大、化腐朽为神奇、行动力强、专注目标、资源整合、自信满满", reversed: "欺骗手段、操纵他人、能力未充分发挥、意图不纯、缺乏自信、拖延行动、滥用天赋", img: "https://i.postimg.cc/156PgF5Q/bb1a94f3f1b8beaae766
/**
 * 统一备份/恢复：v5 默认 ZIP（结构 JSON + media/ 二进制），避免单文件巨型 JSON 无法解析；
 * v4 单文件 JSON 仍可导入。依赖：localforage、JSZip（CDN）、全局 APP_PREFIX / SESSION_ID。
 */
(function (global) {
    'use strict';

    var MIN_MEDIA_CHARS = 800;

    function escapeRe(s) {
        return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function isDataMediaUrl(s) {
        return typeof s === 'string' && s.length > MIN_MEDIA_CHARS && /^data:(image|video)\//i.test(s);
    }

    function isZipArrayBuffer(ab) {
        if (!ab || ab.byteLength < 4) return false;
        var u = new Uint8Array(ab);
        return u[0] === 0x50 && u[1] === 0x4b && (u[2] === 0x03 || u[2] === 0x05 || u[2] === 0x07) &&
            (u[3] === 0x04 || u[3] === 0x06 || u[3] === 0x08);
    }

    function dataUrlToBinary(dataUrl) {
        if (typeof dataUrl !== 'string') return null;
        var m = /^data:([^,]+),([\s\S]*)$/.exec(dataUrl);
        if (!m) return null;
        var header = m[1];
        var body = m[2].replace(/\s/g, '');
        var mime = header.split(';')[0].trim();
        var isB64 = /;base64/i.test(header);
        if (isB64) {
            try {
                var binary = atob(body);
                var len = binary.length;
                var bytes = new Uint8Array(len);
                for (var i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
                return { mime: mime, bytes: bytes };
            } catch (e) {
                return null;
            }
        }
        try {
            return { mime: mime, bytes: new TextEncoder().encode(decodeURIComponent(body)) };
        } catch (e2) {
            return null;
        }
    }

    function uint8ToBase64Chunked(u8) {
        var CHUNK = 0x8000;
        var str = '';
        for (var i = 0; i < u8.length; i += CHUNK) {
            str += String.fromCharCode.apply(null, u8.subarray(i, Math.min(i + CHUNK, u8.length)));
        }
        return btoa(str);
    }

    function binaryToDataUrl(mime, u8) {
        return 'data:' + (mime || 'application/octet-stream') + ';base64,' + uint8ToBase64Chunked(u8);
    }

    function deepCloneJsonSafe(obj) {
        try {
            return JSON.parse(JSON.stringify(obj, function (k, v) {
                if (v instanceof Date) return v.toISOString();
                return v;
            }));
        } catch (e) {
            return obj;
        }
    }

    /**
     * 将大树中的 data: 媒体字符串抽离到 store，原处替换为 { __mRef: id }（导入时再展开）
     */
    function extractMediaTree(node, state) {
        if (!state) state = { store: {}, map: new Map(), n: 0 };
        if (node === null || node === undefined) return node;
        if (typeof node === 'string') {
            if (isDataMediaUrl(node)) {
                var id = state.map.get(node);
                if (!id) {
                    id = 'm' + state.n++;
                    state.map.set(node, id);
                    state.store[id] = node;
                }
                return { __mRef: id };
            }
            return node;
        }
        if (Array.isArray(node)) return node.map(function (x) { return extractMediaTree(x, state); });
        if (typeof node === 'object') {
            if (node instanceof Date) return node.toISOString();
            var out = {};
            for (var k in node) {
                if (!Object.prototype.hasOwnProperty.call(node, k)) continue;
                out[k] = extractMediaTree(node[k], state);
            }
            return out;
        }
        return node;
    }

    function inlineMediaTree(node, store) {
        if (!store) store = {};
        if (node === null || node === undefined) return node;
        if (typeof node === 'object' && !Array.isArray(node) && node.__mRef && typeof node.__mRef === 'string') {
            var blob = store[node.__mRef];
            return blob !== undefined && blob !== null ? blob : node;
        }
        if (Array.isArray(node)) return node.map(function (x) { return inlineMediaTree(x, store); });
        if (typeof node === 'object') {
            var o = {};
            for (var k in node) {
                if (!Object.prototype.hasOwnProperty.call(node, k)) continue;
                o[k] = inlineMediaTree(node[k], store);
            }
            return o;
        }
        return node;
    }

    function processLocalStorageValueForExport(str, state) {
        if (str == null) return str;
        if (typeof str !== 'string') return str;
        if (isDataMediaUrl(str)) {
            var id = state.map.get(str);
            if (!id) {
                id = 'm' + state.n++;
                state.map.set(str, id);
                state.store[id] = str;
            }
            return JSON.stringify({ __mRef: id });
        }
        try {
            var parsed = JSON.parse(str);
            var extracted = extractMediaTree(parsed, state);
            return JSON.stringify(extracted);
        } catch (e) {
            return str;
        }
    }

    function processLocalStorageValueForImport(str, store) {
        if (str == null) return str;
        if (typeof str !== 'string') return str;
        try {
            var parsed = JSON.parse(str);
            return JSON.stringify(inlineMediaTree(parsed, store));
        } catch (e) {
            return str;
        }
    }

    function inferBackupSessionId(lfKeys, appPrefix) {
        var pfx = appPrefix || (typeof APP_PREFIX !== 'undefined' ? APP_PREFIX : 'CHAT_APP_V3_');
        var skipParts = ['MIGRATION', 'sessionList', 'lastSessionId', 'customThemes', 'themeSchemes'];
        for (var i = 0; i < lfKeys.length; i++) {
            var sk = lfKeys[i];
            if (!sk || !sk.startsWith(pfx)) continue;
            if (skipParts.some(function (s) { return sk.startsWith(pfx + s); })) continue;
            var after = sk.slice(pfx.length);
            var u = after.indexOf('_');
            if (u > 0) return after.slice(0, u);
        }
        return null;
    }

    function remapLfKey(key, oldSid, newSid, appPrefix) {
        if (!oldSid || !newSid || oldSid === newSid || !key) return key;
        var re = new RegExp(escapeRe(oldSid), 'g');
        return key.replace(re, newSid);
    }

    /** 与 group-chat 导出勾选项一致：未勾选的模块对应键名子串会被排除 */
    function buildModuleSkipPatterns(flags) {
        flags = flags || {};
        var p = [];
        if (!flags.inclStickers) p.push('stickerLibrary', 'myStickerLibrary');
        if (!flags.inclThemes) p.push('backgroundGallery', 'chatBackground', 'partnerAvatar', 'myAvatar', 'playerCover');
        if (!flags.inclMsgs) p.push('chatMessages');
        if (!flags.inclSet) p.push('chatSettings', 'partnerPersonas', 'showPartnerNameInChat');
        if (!flags.inclCustom) p.push('customReplies', 'customPokes', 'customStatuses', 'customMottos', 'customIntros', 'customEmojis', 'customReplyGroups', 'customPokeGroups', 'customStatusGroups');
        if (!flags.inclAnn) p.push('anniversaries');
        if (!flags.inclThemes) p.push('customThemes', 'themeSchemes');
        if (!flags.inclDg) p.push('dg_custom_data', 'dg_status_pool', 'weekly_fortune', 'daily_fortune', 'customWeather_');
        return p;
    }

    function shouldSkipKeyGroupChat(key, flags) {
        if (!key) return true;
        if (key.startsWith('annHeaderBg_')) return true;
        if (key.indexOf('dg_header_bg') !== -1 || key.indexOf('dg_overlay_bg') !== -1) return true;
        var patterns = buildModuleSkipPatterns(flags || {});
        return patterns.some(function (p) { return key.indexOf(p) !== -1; });
    }

    /**
     * 从当前环境收集备份数据并打包为 v4（紧凑 JSON + mediaStore）
     */
    async function buildBackupPayload(flags) {
        flags = flags || {
            inclMsgs: true, inclSet: true, inclCustom: true, inclAnn: true,
            inclThemes: true, inclDg: true, inclStickers: false
        };
        var lfData = {};
        var keys = await localforage.keys();
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (shouldSkipKeyGroupChat(key, flags)) continue;
            try {
                var rawVal = await localforage.getItem(key);
                if (rawVal === null || rawVal === undefined) continue;
                lfData[key] = deepCloneJsonSafe(rawVal);
            } catch (e) { console.warn('[backup] 读取失败', key, e); }
        }
        var lsData = {};
        for (var j = 0; j < localStorage.length; j++) {
            var lk = localStorage.key(j);
            if (!lk || shouldSkipKeyGroupChat(lk, flags)) continue;
            try {
                lsData[lk] = localStorage.getItem(lk);
            } catch (e2) {}
        }
        var state = { store: {}, map: new Map(), n: 0 };
        var lfOut = {};
        for (var k in lfData) {
            if (!Object.prototype.hasOwnProperty.call(lfData, k)) continue;
            lfOut[k] = extractMediaTree(lfData[k], state);
        }
        var lsOut = {};
        for (var k2 in lsData) {
            if (!Object.prototype.hasOwnProperty.call(lsData, k2)) continue;
            lsOut[k2] = processLocalStorageValueForExport(lsData[k2], state);
        }
        return {
            type: 'chatapp-backup-v4',
            formatVersion: 4,
            appName: 'ChatApp',
            timestamp: new Date().toISOString(),
            sessionId: typeof SESSION_ID !== 'undefined' ? SESSION_ID : null,
            appPrefix: typeof APP_PREFIX !== 'undefined' ? APP_PREFIX : 'CHAT_APP_V3_',
            modules: flags,
            mediaStore: state.store,
            localforage: lfOut,
            localStorage: lsOut
        };
    }

    function serializeBackupV4(payload) {
        var bom = '\uFEFF';
        return bom + JSON.stringify(payload);
    }

    function downloadBlob(blob, fileName) {
        if (typeof downloadFileFallback === 'function') {
            downloadFileFallback(blob, fileName);
            return;
        }
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
    }

    /**
     * 从 ZIP 解析备份（v5）；若包内为旧版单 JSON（仅改扩展名等）则按其中 JSON 原样返回。
     */
    async function parseZipBackup(arrayBuffer) {
        if (typeof JSZip === 'undefined') throw new Error('JSZip 未加载，无法读取 ZIP 备份，请检查网络后刷新页面');
        var zip = await JSZip.loadAsync(arrayBuffer);
        var jsonFile = zip.file('backup.json');
        if (!jsonFile) {
            var names = Object.keys(zip.files).filter(function (n) {
                var e = zip.files[n];
                return e && !e.dir && /\.json$/i.test(n);
            });
            if (names.length === 1) jsonFile = zip.file(names[0]);
        }
        if (!jsonFile) throw new Error('ZIP 内未找到 backup.json');
        var raw = await jsonFile.async('string');
        if (raw.length && raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
        var data = JSON.parse(raw);
        var idx = data.mediaIndex;
        if (data.formatVersion === 5 && data.type === 'chatapp-backup-v5' && idx && typeof idx === 'object') {
            var built = {};
            var ids = Object.keys(idx);
            for (var i = 0; i < ids.length; i++) {
                var id = ids[i];
                var meta = idx[id];
                var path = (meta && meta.path) ? meta.path : ('media/' + id);
                var zf = zip.file(path);
                if (!zf) {
                    console.warn('[backup] ZIP 缺少媒体文件', path);
                    continue;
                }
                var mimeMeta = (meta && meta.mime) ? meta.mime : 'application/octet-stream';
                if (mimeMeta === 'text/plain+dataurl') {
                    built[id] = await zf.async('string');
                } else {
                    var ab = await zf.async('arraybuffer');
                    built[id] = binaryToDataUrl(mimeMeta, new Uint8Array(ab));
                }
            }
            var ms = data.mediaStore || {};
            for (var k in ms) {
                if (Object.prototype.hasOwnProperty.call(ms, k) && built[k] == null) built[k] = ms[k];
            }
            data.mediaStore = built;
        }
        return data;
    }

    async function loadBackupFromArrayBuffer(ab) {
        if (isZipArrayBuffer(ab)) return await parseZipBackup(ab);
        var text = new TextDecoder('utf-8', { fatal: false }).decode(ab);
        if (text.length && text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
        return JSON.parse(text);
    }

    async function loadBackupFromFile(file) {
        var ab = await file.arrayBuffer();
        return await loadBackupFromArrayBuffer(ab);
    }

    async function exportBackupToFile(flags) {
        if (typeof showNotification === 'function') showNotification('正在打包备份（ZIP：结构与媒体分离）…', 'info', 4000);
        var payload = await buildBackupPayload(flags);
        var dateStr = new Date().toISOString().slice(0, 10);
        var fileNameZip = 'chatapp-backup-' + dateStr + '.zip';

        if (typeof JSZip !== 'undefined') {
            try {
                var zip = new JSZip();
                var store = payload.mediaStore || {};
                var mediaIndex = {};
                for (var sid in store) {
                    if (!Object.prototype.hasOwnProperty.call(store, sid)) continue;
                    var url = store[sid];
                    var parts = dataUrlToBinary(url);
                    var path = 'media/' + sid;
                    if (parts && parts.bytes && parts.bytes.length) {
                        zip.file(path, parts.bytes, { binary: true });
                        mediaIndex[sid] = { path: path, mime: parts.mime };
                    } else {
                        var txtPath = path + '.txt';
                        zip.file(txtPath, String(url));
                        mediaIndex[sid] = { path: txtPath, mime: 'text/plain+dataurl' };
                    }
                }
                var jsonBody = {
                    type: 'chatapp-backup-v5',
                    formatVersion: 5,
                    appName: payload.appName || 'ChatApp',
                    timestamp: payload.timestamp,
                    sessionId: payload.sessionId,
                    appPrefix: payload.appPrefix,
                    modules: payload.modules,
                    localforage: payload.localforage,
                    localStorage: payload.localStorage,
                    mediaIndex: mediaIndex
                };
                zip.file('backup.json', '\uFEFF' + JSON.stringify(jsonBody));
                var zipBlob = await zip.generateAsync({
                    type: 'blob',
                    compression: 'DEFLATE',
                    compressionOptions: { level: 6 }
                });
                if (navigator.share && /Mobile|Android|iPhone|iPad/.test(navigator.userAgent)) {
                    try {
                        var shareFile = new File([zipBlob], fileNameZip, { type: 'application/zip' });
                        if (navigator.canShare && navigator.canShare({ files: [shareFile] })) {
                            await navigator.share({
                                files: [shareFile],
                                title: '传讯全量备份',
                                text: 'ZIP 备份：' + new Date().toLocaleDateString()
                            });
                            if (typeof showNotification === 'function') showNotification('备份导出成功', 'success');
                            return;
                        }
                    } catch (e) { /* fall through */ }
                }
                downloadBlob(zipBlob, fileNameZip);
                if (typeof showNotification === 'function') {
                    showNotification('已导出 ZIP：主 JSON 不含大图，导入更不易失败', 'success', 3500);
                }
                return;
            } catch (zipErr) {
                console.error('[backup] ZIP 导出失败，回退单文件 JSON', zipErr);
                if (typeof showNotification === 'function') {
                    showNotification('ZIP 打包失败，已改为单文件 JSON（大备份可能较难解析）', 'warning', 4500);
                }
            }
        } else if (typeof showNotification === 'function') {
            showNotification('JSZip 未加载，将导出单文件 JSON', 'warning', 3000);
        }

        var str = serializeBackupV4(payload);
        var blob = new Blob([str], { type: 'application/json;charset=utf-8' });
        var fileName = 'chatapp-backup-' + dateStr + '.json';
        if (navigator.share && /Mobile|Android|iPhone|iPad/.test(navigator.userAgent)) {
            try {
                var f = new File([blob], fileName, { type: 'application/json' });
                if (navigator.canShare && navigator.canShare({ files: [f] })) {
                    await navigator.share({ files: [f], title: '传讯全量备份', text: '备份日期：' + new Date().toLocaleDateString() });
                    if (typeof showNotification === 'function') showNotification('备份导出成功', 'success');
                    return;
                }
            } catch (e2) { /* fall through */ }
        }
        downloadBlob(blob, fileName);
        if (typeof showNotification === 'function') showNotification('备份导出成功（JSON）', 'success');
    }

    function getLfSource(data) {
        if (!data || typeof data !== 'object') return {};
        var a = data.indexedDB || {};
        var b = data.localforage || {};
        var out = {};
        for (var k in a) {
            if (Object.prototype.hasOwnProperty.call(a, k)) out[k] = a[k];
        }
        for (var k2 in b) {
            if (Object.prototype.hasOwnProperty.call(b, k2)) out[k2] = b[k2];
        }
        return out;
    }

    function matchAnyNeedles(key, needles) {
        if (!key || !needles || !needles.length) return false;
        for (var i = 0; i < needles.length; i++) {
            if (key.indexOf(needles[i]) !== -1) return true;
        }
        return false;
    }

    function matchLsKey(key, cat) {
        if (!cat) return false;
        if (cat.localStorageNeedles && matchAnyNeedles(key, cat.localStorageNeedles)) return true;
        if (cat.localStoragePrefixes && cat.localStoragePrefixes.some(function (p) { return key.indexOf(p) === 0; })) return true;
        return false;
    }

    function filterLfByCategories(lf, selectedIds, categories) {
        if (!selectedIds || !selectedIds.length) return {};
        var selected = categories.filter(function (c) { return selectedIds.indexOf(c.id) !== -1; });
        var out = {};
        for (var k in lf) {
            if (!Object.prototype.hasOwnProperty.call(lf, k)) continue;
            var ok = selected.some(function (c) { return matchAnyNeedles(k, c.indexedDBNeedles); });
            if (ok) out[k] = lf[k];
        }
        return out;
    }

    function filterLsByCategories(ls, selectedIds, categories) {
        if (!selectedIds || !selectedIds.length) return {};
        var selected = categories.filter(function (c) { return selectedIds.indexOf(c.id) !== -1; });
        var out = {};
        for (var k in ls) {
            if (!Object.prototype.hasOwnProperty.call(ls, k)) continue;
            var ok = selected.some(function (c) { return matchLsKey(k, c); });
            if (ok) out[k] = ls[k];
        }
        return out;
    }

    /**
     * 将备份写入存储（已解析的对象）
     * @param {object} data 原始备份 JSON
     * @param {{ selective?: boolean, selectedCategoryIds?: string[], categories?: array }} opt
     */
    async function applyBackupToStorage(data, opt) {
        opt = opt || {};
        var selective = !!opt.selective;
        var mediaStore = data.mediaStore || {};
        var lfRaw = getLfSource(data);
        var lsRaw = data.localStorage || {};

        if (selective && opt.selectedCategoryIds && opt.categories) {
            lfRaw = filterLfByCategories(lfRaw, opt.selectedCategoryIds, opt.categories);
            lsRaw = filterLsByCategories(lsRaw, opt.selectedCategoryIds, opt.categories);
        }

        var lfKeys = Object.keys(lfRaw);
        var backupSid = data.sessionId || inferBackupSessionId(lfKeys, data.appPrefix);
        var curSid = typeof SESSION_ID !== 'undefined' ? SESSION_ID : null;
        var appPfx = data.appPrefix || (typeof APP_PREFIX !== 'undefined' ? APP_PREFIX : 'CHAT_APP_V3_');
        var needRemap = backupSid && curSid && backupSid !== curSid;

        for (var i = 0; i < lfKeys.length; i++) {
            var lk = lfKeys[i];
            var targetKey = needRemap ? remapLfKey(lk, backupSid, curSid, appPfx) : lk;
            var val = inlineMediaTree(lfRaw[lk], mediaStore);
            try {
                await localforage.setItem(targetKey, val);
            } catch (e) {
                console.warn('[backup] 写入失败', targetKey, e);
            }
        }

        for (var k in lsRaw) {
            if (!Object.prototype.hasOwnProperty.call(lsRaw, k)) continue;
            var targetLsKey = needRemap ? remapLfKey(k, backupSid, curSid, appPfx) : k;
            try {
                var lsv = processLocalStorageValueForImport(lsRaw[k], mediaStore);
                if (typeof lsv === 'string' && lsv.indexOf('data:image/') === 0 && lsv.length > 2000) continue;
                localStorage.setItem(targetLsKey, lsv);
            } catch (e2) {
                console.warn('[backup] localStorage 恢复失败', targetLsKey, e2);
            }
        }

        // 修复 sessionList 中的会话 ID：键已被 remap，但值里的 id 字段还是旧 sessionId
        if (needRemap) {
            try {
                var slKey = appPfx + 'sessionList';
                var sl = await localforage.getItem(slKey);
                if (Array.isArray(sl)) {
                    var remappedSl = sl.map(function(s) {
                        if (s && s.id === backupSid) {
                            var copy = {};
                            for (var p in s) { if (Object.prototype.hasOwnProperty.call(s, p)) copy[p] = s[p]; }
                            copy.id = curSid;
                            return copy;
                        }
                        return s;
                    });
                    await localforage.setItem(slKey, remappedSl);
                }
            } catch (e4) {}
        }

        if (typeof APP_PREFIX !== 'undefined' && typeof SESSION_ID !== 'undefined') {
            try { await localforage.setItem(APP_PREFIX + 'lastSessionId', SESSION_ID); } catch (e3) {}
        }
    }

    function isFullBackupShape(d) {
        if (!d || typeof d !== 'object') return false;
        if (d.formatVersion === 5 && d.type === 'chatapp-backup-v5') return true;
        if (d.formatVersion === 4 && d.type === 'chatapp-backup-v4') return true;
        if (d.type === 'full' || (typeof d.type === 'string' && d.type.indexOf('full-backup') !== -1)) return true;
        if (d.indexedDB && typeof d.indexedDB === 'object') return true;
        if (d.localforage && typeof d.localforage === 'object') return true;
        return false;
    }

    global.ChatBackup = {
        MIN_MEDIA_CHARS: MIN_MEDIA_CHARS,
        extractMediaTree: extractMediaTree,
        inlineMediaTree: inlineMediaTree,
        buildBackupPayload: buildBackupPayload,
        exportBackupToFile: exportBackupToFile,
        loadBackupFromFile: loadBackupFromFile,
        loadBackupFromArrayBuffer: loadBackupFromArrayBuffer,
        applyBackupToStorage: applyBackupToStorage,
        serializeBackupV4: serializeBackupV4,
        getLfSource: getLfSource,
        isFullBackupShape: isFullBackupShape,
        shouldSkipKeyGroupChat: shouldSkipKeyGroupChat,
        buildModuleSkipPatterns: buildModuleSkipPatterns
    };
})(typeof window !== 'undefined' ? window : this);
    