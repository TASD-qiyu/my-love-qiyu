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
    return (prefix || 'id') + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function formatTime(timestamp, format) {
    const date = new Date(timestamp);
    const fmt = format || AppState.settings.timeFormat;

    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    switch (fmt) {
        case 'HH:mm':
            return `${hours.toString().padStart(2, '0')}:${minutes}`;
        case 'HH:mm:ss':
            return `${hours.toString().padStart(2, '0')}:${minutes}:${seconds}`;
        case 'h:mm AM/PM':
            const h = hours % 12 || 12;
            const ampm = hours < 12 ? 'AM' : 'PM';
            return `${h}:${minutes} ${ampm}`;
        case 'h:mm:ss AM/PM':
            const h2 = hours % 12 || 12;
            const ampm2 = hours < 12 ? 'AM' : 'PM';
            return `${h2}:${minutes}:${seconds} ${ampm2}`;
        case 'off':
            return '';
        default:
            return `${hours.toString().padStart(2, '0')}:${minutes}`;
    }
}

function formatDate(date, fmt) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');

    if (fmt === 'YYYY-MM-DD') return `${year}-${month}-${day}`;
    if (fmt === 'YYYY/MM/DD') return `${year}/${month}/${day}`;
    if (fmt === 'MM-DD') return `${month}-${day}`;
    return `${year}年${month}月${day}日`;
}

function getDaysDiff(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diff = d2 - d1;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}

// ==================== 导出/导入 ====================
function exportAllData() {
    const data = {
        version: '2.0',
        exportTime: Date.now(),
        settings: AppState.settings,
        customReplies: AppState.customReplies,
        dailyGreeting: AppState.dailyGreeting,
        sessions: AppState.sessions,
        moments: AppState.moments,
        moodRecords: AppState.moodRecords,
        customMoods: AppState.customMoods,
        anniversaries: AppState.anniversaries,
        envelopes: AppState.envelopes,
        companionDiary: AppState.companionDiary,
        divinationHistory: AppState.divinationHistory,
        groupChat: AppState.groupChat,
        favorites: AppState.favorites,
        backgrounds: AppState.backgrounds,
        currentBg: AppState.currentBg,
        themeSchemes: AppState.themeSchemes,
        playlist: AppState.playlist,
        companion: AppState.companion,
        accounting: AppState.accounting,
    };
    return JSON.stringify(data, null, 2);
}

function importAllData(jsonStr) {
    try {
        const data = JSON.parse(jsonStr);

        if (data.settings) AppState.settings = { ...DEFAULT_SETTINGS, ...data.settings };
        if (data.customReplies) AppState.customReplies = data.customReplies;
        if (data.dailyGreeting) AppState.dailyGreeting = data.dailyGreeting;
        if (data.sessions) AppState.sessions = data.sessions;
        if (data.moments) AppState.moments = data.moments;
        if (data.moodRecords) AppState.moodRecords = data.moodRecords;
        if (data.customMoods) AppState.customMoods = data.customMoods;
        if (data.anniversaries) AppState.anniversaries = data.anniversaries;
        if (data.envelopes) AppState.envelopes = data.envelopes;
        if (data.companionDiary) AppState.companionDiary = data.companionDiary;
        if (data.divinationHistory) AppState.divinationHistory = data.divinationHistory;
        if (data.groupChat) AppState.groupChat = data.groupChat;
        if (data.favorites) AppState.favorites = data.favorites;
        if (data.backgrounds) AppState.backgrounds = data.backgrounds;
        if (data.currentBg !== undefined) AppState.currentBg = data.currentBg;
        if (data.themeSchemes) AppState.themeSchemes = data.themeSchemes;
        if (data.playlist) AppState.playlist = data.playlist;
        if (data.companion) AppState.companion = data.companion;
        if (data.accounting) AppState.accounting = data.accounting;

        // 恢复当前会话
        if (AppState.sessions.length > 0) {
            const savedSessionId = loadData(STORAGE_KEYS.currentSessionId, null);
            if (savedSessionId && AppState.sessions.find(s => s.id === savedSessionId)) {
                AppState.currentSessionId = savedSessionId;
            } else {
                AppState.currentSessionId = AppState.sessions[0].id;
            }
            const session = AppState.sessions.find(s => s.id === AppState.currentSessionId);
            AppState.messages = session ? (session.messages || []) : [];
        }

        saveAllData();
        return true;
    } catch (e) {
        console.error('[State] 导入数据失败:', e);
        return false;
    }
}

// 导出字卡库
function exportReplyLibrary() {
    return JSON.stringify(AppState.customReplies, null, 2);
}

// 导入字卡库
function importReplyLibrary(jsonStr) {
    try {
        const data = JSON.parse(jsonStr);
        if (data.reply || data.emoji || data.sticker) {
            AppState.customReplies = { ...AppState.customReplies, ...data };
            throttledSaveData();
            return true;
        }
        return false;
    } catch (e) {
        console.error('[State] 导入字卡库失败:', e);
        return false;
    }
}

// ==================== 重置功能 ====================
function resetAllData() {
    // 清除所有本地存储
    Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
    });

    // 重置状态
    AppState.settings = { ...DEFAULT_SETTINGS };
    AppState.customReplies = deepClone(DEFAULT_REPLY_LIBRARY);
    AppState.dailyGreeting = { ...DEFAULT_DAILY_GREETING };
    AppState.messages = [];
    AppState.sessions = [createSession('默认会话')];
    AppState.currentSessionId = AppState.sessions[0].id;
    AppState.moments = [];
    AppState.moodRecords = {};
    AppState.customMoods = [];
    AppState.anniversaries = [];
    AppState.envelopes = { outbox: [], inbox: [] };
    AppState.companionDiary = [];
    AppState.divinationHistory = [];
    AppState.groupChat = { enabled: false, showNames: true, members: [] };
    AppState.favorites = [];
    AppState.backgrounds = [];
    AppState.currentBg = null;
    AppState.themeSchemes = [];
    AppState.playlist = [];
    AppState.companion = { bg: { study: [], work: [], exercise: [], sleep: [] }, noise: { study: [], work: [], exercise: [], sleep: [] }, voices: [] };
    AppState.accounting = { records: [], tags: [] };

    saveAllData();
    return true;
}

function resetSettings() {
    AppState.settings = { ...DEFAULT_SETTINGS };
    throttledSaveData();
}

function resetReplyLibrary() {
    AppState.customReplies = deepClone(DEFAULT_REPLY_LIBRARY);
    throttledSaveData();
}

// ==================== 计算存储用量 ====================
function calculateStorageUsage() {
    let total = 0;
    const details = {};

    for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            const size = localStorage[key].length * 2; // UTF-16
            total += size;
            details[key] = size;
        }
    }

    return {
        total: total,
        totalMB: (total / 1024 / 1024).toFixed(2),
        details: details,
    };
}

// ==================== 初始化执行 ====================
// 页面加载时自动初始化
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        initState();
    });
}

// 导出到全局
if (typeof window !== 'undefined') {
    window.AppState = AppState;
    window.DEFAULT_SETTINGS = DEFAULT_SETTINGS;
    window.DEFAULT_REPLY_LIBRARY = DEFAULT_REPLY_LIBRARY;
    window.DEFAULT_DAILY_GREETING = DEFAULT_DAILY_GREETING;
    window.BUILT_IN_SOUNDS = BUILT_IN_SOUNDS;
    window.THEME_PRESETS = THEME_PRESETS;
    window.STORAGE_KEYS = STORAGE_KEYS;

    // 函数导出
    window.initState = initState;
    window.saveData = saveData;
    window.loadData = loadData;
    window.removeData = removeData;
    window.throttledSaveData = throttledSaveData;
    window.saveAllData = saveAllData;
    window.createSession = createSession;
    window.switchSession = switchSession;
    window.deleteSession = deleteSession;
    window.renameSession = renameSession;
    window.addMessage = addMessage;
    window.deleteMessage = deleteMessage;
    window.editMessage = editMessage;
    window.toggleFavorite = toggleFavorite;
    window.getReplyLibrary = getReplyLibrary;
    window.addReply = addReply;
    window.deleteReply = deleteReply;
    window.editReply = editReply;
    window.getRandomReply = getRandomReply;
    window.generateConcatMessage = generateConcatMessage;
    window.concatCards = concatCards;
    window.addMoment = addMoment;
    window.deleteMoment = deleteMoment;
    window.toggleLikeMoment = toggleLikeMoment;
    window.addComment = addComment;
    window.deleteComment = deleteComment;
    window.autoPublishMoment = autoPublishMoment;
    window.setMood = setMood;
    window.getMood = getMood;
    window.deleteMood = deleteMood;
    window.addAnniversary = addAnniversary;
    window.deleteAnniversary = deleteAnniversary;
    window.editAnniversary = editAnniversary;
    window.sendEnvelope = sendEnvelope;
    window.receiveEnvelope = receiveEnvelope;
    window.replyEnvelope = replyEnvelope;
    window.addDivinationRecord = addDivinationRecord;
    window.clearDivinationHistory = clearDivinationHistory;
    window.addGroupMember = addGroupMember;
    window.removeGroupMember = removeGroupMember;
    window.editGroupMember = editGroupMember;
    window.saveThemeScheme = saveThemeScheme;
    window.deleteThemeScheme = deleteThemeScheme;
    window.applyThemeScheme = applyThemeScheme;
    window.deepClone = deepClone;
    window.generateId = generateId;
    window.formatTime = formatTime;
    window.formatDate = formatDate;
    window.getDaysDiff = getDaysDiff;
    window.exportAllData = exportAllData;
    window.importAllData = importAllData;
    window.exportReplyLibrary = exportReplyLibrary;
    window.importReplyLibrary = importReplyLibrary;
    window.resetAllData = resetAllData;
    window.resetSettings = resetSettings;
    window.resetReplyLibrary = resetReplyLibrary;
    window.calculateStorageUsage = calculateStorageUsage;
}
