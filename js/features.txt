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

    saveSettings() {
        const signature = document.getElementById('moment-signature-input');
        if (signature) {
            this.settings.signature = signature.value;
        }
        this.saveData();

        const modal = document.getElementById('moment-settings-modal');
        if (modal && typeof hideModal === 'function') hideModal(modal);

        if (typeof showNotification === 'function') {
            showNotification('设置已保存 ✦', 'success');
        }
    },

    // 处理封面上传
    handleCoverUpload(input) {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.settings.cover = e.target.result;
                this.saveData();
                this.updateCover();
            };
            reader.readAsDataURL(input.files[0]);
        }
    }
};

// ==================== 数据导出导入系统 ====================
const DataManager = {
    // 导出所有数据
    exportAll() {
        const data = {
            version: '2.0',
            exportTime: new Date().toISOString(),
            settings: this.getSettings(),
            messages: this.getMessages(),
            moments: MomentSystem.getMoments(),
            momentSettings: MomentSystem.settings,
            cardConcat: {
                settings: CardConcat.settings,
                momentSettings: CardConcat.momentSettings
            },
            audio: {
                volume: AudioSystem.volume,
                enabled: AudioSystem.enabled
            },
            builtInLibrary: BuiltInCardLibrary
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `传讯备份_${new Date().toLocaleDateString()}.json`;
        a.click();
        URL.revokeObjectURL(url);

        if (typeof showNotification === 'function') {
            showNotification('数据导出成功 ✦', 'success');
        }
    },

    // 导入数据
    importAll(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);

                if (data.settings) this.setSettings(data.settings);
                if (data.messages) this.setMessages(data.messages);
                if (data.moments) MomentSystem.saveMoments(data.moments);
                if (data.momentSettings) {
                    MomentSystem.settings = { ...MomentSystem.settings, ...data.momentSettings };
                    MomentSystem.saveData();
                }
                if (data.cardConcat) {
                    CardConcat.settings = { ...CardConcat.settings, ...data.cardConcat.settings };
                    CardConcat.momentSettings = { ...CardConcat.momentSettings, ...data.cardConcat.momentSettings };
                    CardConcat.saveSettings();
                }
                if (data.audio) {
                    AudioSystem.volume = data.audio.volume ?? 0.15;
                    AudioSystem.enabled = data.audio.enabled ?? true;
                    AudioSystem.saveSettings();
                }

                if (typeof showNotification === 'function') {
                    showNotification('数据导入成功 ✦', 'success');
                }

                // 刷新页面以应用
                setTimeout(() => location.reload(), 1000);
            } catch(err) {
                alert('导入失败：文件格式错误');
            }
        };
        reader.readAsText(file);
    },

    // 导出字卡库
    exportCardLibrary() {
        const data = {
            version: '2.0',
            type: 'cardLibrary',
            exportTime: new Date().toISOString(),
            library: BuiltInCardLibrary
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `字卡库_${new Date().toLocaleDateString()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    },

    // 导入字卡库
    importCardLibrary(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.type === 'cardLibrary' && data.library) {
                    // 合并到自定义库
                    const custom = JSON.parse(localStorage.getItem('customReplies') || '{}');
                    if (!custom.reply) custom.reply = {};

                    Object.keys(data.library).forEach(key => {
                        if (!custom.reply[key]) custom.reply[key] = [];
                        custom.reply[key] = [...new Set([...custom.reply[key], ...data.library[key]])];
                    });

                    localStorage.setItem('customReplies', JSON.stringify(custom));

                    if (typeof showNotification === 'function') {
                        showNotification('字卡库导入成功 ✦', 'success');
                    }
                }
            } catch(err) {
                alert('导入失败：文件格式错误');
            }
        };
        reader.readAsText(file);
    },

    getSettings() {
        try {
            return JSON.parse(localStorage.getItem('settings') || '{}');
        } catch(e) { return {}; }
    },

    setSettings(s) {
        localStorage.setItem('settings', JSON.stringify(s));
    },

    getMessages() {
        try {
            return JSON.parse(localStorage.getItem('messages') || '[]');
        } catch(e) { return []; }
    },

    setMessages(m) {
        localStorage.setItem('messages', JSON.stringify(m));
    },

    // 计算存储用量
    getStorageUsage() {
        let total = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length * 2; // UTF-16
            }
        }
        return {
            total: total,
            totalMB: (total / 1024 / 1024).toFixed(2),
            breakdown: {
                messages: (localStorage.getItem('messages') || '').length * 2,
                settings: (localStorage.getItem('settings') || '').length * 2,
                moments: (localStorage.getItem('moments') || '').length * 2,
                customReplies: (localStorage.getItem('customReplies') || '').length * 2
            }
        };
    }
};

// ==================== 聊天设置 - 节奏面板增强 ====================
const ChatSettingsRhythm = {
    init() {
        this.initSliders();
        this.initToggles();
    },

    initSliders() {
        // 回复速度 - 最短等待
        const minDelaySlider = document.getElementById('reply-delay-min-slider');
        const minDelayValue = document.getElementById('reply-delay-min-value');
        if (minDelaySlider && minDelayValue) {
            minDelaySlider.addEventListener('input', () => {
                const val = parseInt(minDelaySlider.value);
                minDelayValue.textContent = (val / 1000) + 's';
            });
        }

        // 回复速度 - 最长等待
        const maxDelaySlider = document.getElementById('reply-delay-max-slider');
        const maxDelayValue = document.getElementById('reply-delay-max-value');
        if (maxDelaySlider && maxDelayValue) {
            maxDelaySlider.addEventListener('input', () => {
                const val = parseInt(maxDelaySlider.value);
                maxDelayValue.textContent = (val / 1000) + 's';
            });
        }

        // 主动发送间隔
        const autoSendSlider = document.getElementById('auto-send-slider');
        const autoSendValue = document.getElementById('auto-send-value');
        if (autoSendSlider && autoSendValue) {
            autoSendSlider.addEventListener('input', () => {
                autoSendValue.textContent = autoSendSlider.value + '分钟';
            });
        }
    },

    initToggles() {
        // 主动发消息
        const autoSendToggle = document.getElementById('auto-send-toggle');
        const autoSendControl = document.getElementById('auto-send-control');
        if (autoSendToggle && autoSendControl) {
            autoSendToggle.addEventListener('click', () => {
                const isOn = autoSendControl.style.display !== 'none';
                autoSendControl.style.display = isOn ? 'none' : 'block';
                const switchEl = autoSendToggle.querySelector('.setting-pill-switch');
                const knob = autoSendToggle.querySelector('.setting-pill-knob');
                if (switchEl && knob) {
                    switchEl.style.background = isOn ? 'var(--border-color)' : 'var(--accent-color)';
                    knob.style.left = isOn ? '3px' : '23px';
                }
            });
        }

        // 表情混入
        const emojiMixToggle = document.getElementById('emoji-mix-toggle');
        if (emojiMixToggle) {
            emojiMixToggle.addEventListener('click', () => {
                const switchEl = emojiMixToggle.querySelector('.setting-pill-switch');
                const knob = emojiMixToggle.querySelector('.setting-pill-knob');
                if (switchEl && knob) {
                    const isOn = knob.style.left === '23px';
                    switchEl.style.background = isOn ? 'var(--border-color)' : 'var(--accent-color)';
                    knob.style.left = isOn ? '3px' : '23px';
                }
            });
        }
    }
};

// ==================== 音效设置面板 ====================
const SoundSettings = {
    init() {
        this.initToggles();
        this.initSliders();
        this.initPresets();
    },

    initToggles() {
        const soundToggle = document.getElementById('sound-toggle');
        const soundDetail = document.getElementById('sound-detail-section');
        if (soundToggle && soundDetail) {
            soundToggle.addEventListener('click', () => {
                const enabled = AudioSystem.toggle();
                const switchEl = soundToggle.querySelector('.setting-pill-switch');
                const knob = soundToggle.querySelector('.setting-pill-knob');
                if (switchEl && knob) {
                    switchEl.style.background = enabled ? 'var(--accent-color)' : 'var(--border-color)';
                    knob.style.left = enabled ? '23px' : '3px';
                }
                soundDetail.style.display = enabled ? 'block' : 'none';
            });
        }
    },

    initSliders() {
        const volumeSlider = document.getElementById('sound-volume-slider');
        const volumeValue = document.getElementById('sound-volume-value');
        if (volumeSlider && volumeValue) {
            volumeSlider.value = AudioSystem.volume * 100;
            volumeValue.textContent = Math.round(AudioSystem.volume * 100) + '%';
            volumeSlider.addEventListener('input', () => {
                const val = parseInt(volumeSlider.value) / 100;
                AudioSystem.setVolume(val);
                volumeValue.textContent = volumeSlider.value + '%';
            });
        }
    },

    initPresets() {
        // 绑定各音效预设选择器和试听按钮
        const presets = [
            { select: 'sound-my-send-preset', test: 'test-sound-my-send-btn', type: 'send' },
            { select: 'sound-partner-message-preset', test: 'test-sound-partner-message-btn', type: 'receive' },
            { select: 'sound-my-poke-preset', test: 'test-sound-my-poke-btn', type: 'poke' },
            { select: 'sound-partner-poke-preset', test: 'test-sound-partner-poke-btn', type: 'poke' }
        ];

        presets.forEach(({ select, test, type }) => {
            const testBtn = document.getElementById(test);
            if (testBtn) {
                testBtn.addEventListener('click', () => {
                    const selectEl = document.getElementById(select);
                    const preset = selectEl ? selectEl.value : type;
                    AudioSystem.play(preset === 'mute' ? null : (preset === 'kakaotalk' ? 'kakaotalk' : type));
                });
            }
        });
    }
};

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', () => {
    AudioSystem.init();
    CardConcat.init();
    MomentSystem.init();
    ChatSettingsRhythm.init();
    SoundSettings.init();

    // 绑定全局函数
    window.AudioSystem = AudioSystem;
    window.BuiltInCardLibrary = BuiltInCardLibrary;
    window.CardConcat = CardConcat;
    window.MomentSystem = MomentSystem;
    window.DataManager = DataManager;

    // 朋友圈全局函数
    window.openMomentModal = () => MomentSystem.openModal();
    window.toggleLikeMoment = (id) => MomentSystem.toggleLike(id);
    window.commentMoment = (id) => MomentSystem.addComment(id);
    window.openPublishMoment = () => {
        const modal = document.getElementById('publish-moment-modal');
        if (modal && typeof showModal === 'function') showModal(modal);
    };
    window.publishMoment = () => MomentSystem.publish();
    window.openMomentSettings = () => {
        const modal = document.getElementById('moment-settings-modal');
        if (modal && typeof showModal === 'function') showModal(modal);
    };
    window.saveMomentSettings = () => MomentSystem.saveSettings();

    // 数据管理全局函数
    window.exportAllData = () => DataManager.exportAll();
    window.importAllData = (file) => DataManager.importAll(file);
    window.exportCardLibrary = () => DataManager.exportCardLibrary();
    window.importCardLibrary = (file) => DataManager.importCardLibrary(file);

    // 字卡拼接全局函数
    window.generateConcatMessage = () => CardConcat.generateMessage();
    window.getCardConcatSettings = () => ({
        settings: CardConcat.settings,
        momentSettings: CardConcat.momentSettings
    });

    // 处理朋友圈封面上传
    const coverInput = document.getElementById('moment-cover-input');
    if (coverInput) {
        coverInput.addEventListener('change', function() {
            MomentSystem.handleCoverUpload(this);
        });
    }
});

// ==================== 导出模块 ====================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AudioSystem,
        BuiltInCardLibrary,
        CardConcat,
        MomentSystem,
        DataManager,
        ChatSettingsRhythm,
        SoundSettings
    };
}
