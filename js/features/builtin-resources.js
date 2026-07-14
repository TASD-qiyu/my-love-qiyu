// ==================== 内置音效库 ====================
const BUILTIN_SOUNDS = {
    tone_default: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YQAAAAA=',
    tone_soft: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YQAAAAA=',
    tone_low: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YQAAAAA=',
    tone_warm: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YQAAAAA=',
    tone_dark: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YQAAAAA=',
    tone_haze: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YQAAAAA=',
    kakaotalk: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YQAAAAA=',
    poke: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YQAAAAA=',
    videocall: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YQAAAAA=',
    invite_study: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YQAAAAA=',
    invite_work: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YQAAAAA=',
    invite_exercise: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YQAAAAA=',
    invite_sleep: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YQAAAAA='
};

function playBuiltinSound(soundKey, volume) {
    volume = volume || 0.5;
    var soundData = BUILTIN_SOUNDS[soundKey] || BUILTIN_SOUNDS.tone_default;
    try {
        var audio = new Audio(soundData);
        audio.volume = volume;
        audio.play().catch(function(e) { console.log('音效播放失败:', e); });
    } catch(e) { console.log('音效初始化失败:', e); }
}

// ==================== 内置字卡库 ====================
const BUILTIN_CARD_LIBRARY = {
    main: [
        { text: "今天也想你了", tags: ["日常", "思念"] },
        { text: "在忙吗？记得休息", tags: ["关心", "日常"] },
        { text: "刚刚看到一朵云，很像你", tags: ["分享", "浪漫"] },
        { text: "晚上吃什么好呢", tags: ["日常", "生活"] },
        { text: "今天天气很好，适合见面", tags: ["邀约", "浪漫"] },
        { text: "听到一首歌，想起你了", tags: ["分享", "思念"] },
        { text: "工作累了吗？抱抱", tags: ["关心", "安慰"] },
        { text: "我在呢，一直都在", tags: ["陪伴", "承诺"] },
        { text: "今天有好好吃饭吗", tags: ["关心", "日常"] },
        { text: "想听你声音了", tags: ["思念", "亲密"] },
        { text: "刚刚路过我们去过的地方", tags: ["回忆", "分享"] },
        { text: "你在干嘛呀", tags: ["日常", "好奇"] },
        { text: "有点困了，但还想和你聊", tags: ["亲密", "日常"] },
        { text: "今天也很喜欢你", tags: ["表白", "日常"] },
        { text: "梦到你了，是美梦", tags: ["分享", "浪漫"] },
        { text: "记得多喝水", tags: ["关心", "日常"] },
        { text: "想和你一起看星星", tags: ["邀约", "浪漫"] },
        { text: "你的消息是我今天的惊喜", tags: ["表白", "日常"] },
        { text: "在等你回复的时候看了会书", tags: ["分享", "日常"] },
        { text: "今天也要加油哦", tags: ["鼓励", "日常"] },
        { text: "想牵你的手", tags: ["亲密", "表白"] },
        { text: "你笑起来的样子最好看", tags: ["赞美", "表白"] },
        { text: "刚刚打了个喷嚏，是不是你在想我", tags: ["俏皮", "思念"] },
        { text: "今天遇到了有趣的事，想讲给你听", tags: ["分享", "日常"] },
        { text: "想和你一起吃火锅", tags: ["邀约", "生活"] },
        { text: "你的存在就是我的安心", tags: ["表白", "承诺"] },
        { text: "今天也很感谢有你", tags: ["感恩", "日常"] },
        { text: "想抱你，很紧很紧的那种", tags: ["亲密", "思念"] },
        { text: "你在的时候，时间会变慢", tags: ["浪漫", "表白"] },
        { text: "刚刚看到一只猫，很像你傲娇的样子", tags: ["俏皮", "分享"] }
    ],
    poke: [
        { text: "拍了拍你的头说乖", action: "拍了拍" },
        { text: "捏了捏你的脸", action: "捏了捏" },
        { text: "抱了抱你", action: "抱了抱" },
        { text: "戳了戳你的腰", action: "戳了戳" },
        { text: "揉了揉你的头发", action: "揉了揉" }
    ],
    atmosphere: [
        { text: "正在连接我们的思绪", type: "status" },
        { text: "Love", type: "header" },
        { text: "若要由我来谈论爱的话", type: "sub" },
        { text: "Echo", type: "header" },
        { text: "听见我的回音了吗？", type: "sub" },
        { text: "Soulmate", type: "header" },
        { text: "灵魂共振", type: "sub" }
    ]
};

function initBuiltinLibrary() {
    var saved = localStorage.getItem('customReplies');
    if (!saved) {
        localStorage.setItem('customReplies', JSON.stringify(BUILTIN_CARD_LIBRARY));
        console.log('内置字卡库已初始化');
        return;
    }
    try {
        var data = JSON.parse(saved);
        if (!data.main || data.main.length === 0) {
            localStorage.setItem('customReplies', JSON.stringify(BUILTIN_CARD_LIBRARY));
            console.log('字卡库为空，已填充内置数据');
        }
    } catch(e) {
        localStorage.setItem('customReplies', JSON.stringify(BUILTIN_CARD_LIBRARY));
    }
}

// ==================== 导出导入系统 ====================
var DataExporter = {
    exportAll: function() {
        var data = {
            timestamp: new Date().toISOString(),
            version: '1.0',
            customReplies: JSON.parse(localStorage.getItem('customReplies') || '{}'),
            moments: JSON.parse(localStorage.getItem('moments') || '[]'),
            moodData: JSON.parse(localStorage.getItem('moodData') || '{}'),
            anniversaries: JSON.parse(localStorage.getItem('anniversaries') || '[]'),
            chatSettings: JSON.parse(localStorage.getItem('chatSettings') || '{}'),
            companionDiary: JSON.parse(localStorage.getItem('companionDiary') || '[]'),
            envelopeOutbox: JSON.parse(localStorage.getItem('envelopeOutbox') || '[]'),
            envelopeInbox: JSON.parse(localStorage.getItem('envelopeInbox') || '[]'),
            themeSchemes: JSON.parse(localStorage.getItem('themeSchemes') || '[]'),
            diviHistory: JSON.parse(localStorage.getItem('diviHistory') || '[]')
        };
        var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = '传讯备份_' + new Date().toLocaleDateString() + '.json';
        a.click();
        URL.revokeObjectURL(url);
        if (typeof showNotification === 'function') showNotification('数据导出成功 ✦', 'success');
    },
    importAll: function(file) {
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function(e) {
            try {
                var data = JSON.parse(e.target.result);
                if (!data.version) throw new Error('无效的备份文件格式');
                if (data.customReplies) localStorage.setItem('customReplies', JSON.stringify(data.customReplies));
                if (data.moments) localStorage.setItem('moments', JSON.stringify(data.moments));
                if (data.moodData) localStorage.setItem('moodData', JSON.stringify(data.moodData));
                if (data.anniversaries) localStorage.setItem('anniversaries', JSON.stringify(data.anniversaries));
                if (data.chatSettings) localStorage.setItem('chatSettings', JSON.stringify(data.chatSettings));
                if (data.companionDiary) localStorage.setItem('companionDiary', JSON.stringify(data.companionDiary));
                if (data.envelopeOutbox) localStorage.setItem('envelopeOutbox', JSON.stringify(data.envelopeOutbox));
                if (data.envelopeInbox) localStorage.setItem('envelopeInbox', JSON.stringify(data.envelopeInbox));
                if (data.themeSchemes) localStorage.setItem('themeSchemes', JSON.stringify(data.themeSchemes));
                if (data.diviHistory) localStorage.setItem('diviHistory', JSON.stringify(data.diviHistory));
                if (typeof showNotification === 'function') showNotification('数据导入成功，页面将刷新 ✦', 'success');
                setTimeout(function() { location.reload(); }, 1500);
            } catch(err) {
                if (typeof showNotification === 'function') showNotification('导入失败：' + err.message, 'error');
            }
        };
        reader.readAsText(file);
    },
    exportCards: function() {
        var data = JSON.parse(localStorage.getItem('customReplies') || '{}');
        var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = '字卡库_' + new Date().toLocaleDateString() + '.json';
        a.click();
        URL.revokeObjectURL(url);
        if (typeof showNotification === 'function') showNotification('字卡库导出成功 ✦', 'success');
    },
    importCards: function(file) {
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function(e) {
            try {
                var data = JSON.parse(e.target.result);
                localStorage.setItem('customReplies', JSON.stringify(data));
                if (typeof showNotification === 'function') showNotification('字卡库导入成功 ✦', 'success');
            } catch(err) {
                if (typeof showNotification === 'function') showNotification('字卡库导入失败', 'error');
            }
        };
        reader.readAsText(file);
    }
};

// ==================== 存储用量计算 ====================
function calculateStorage() {
    var total = 0;
    for (var key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            total += localStorage[key].length * 2;
        }
    }
    var usedMB = (total / 1024 / 1024).toFixed(2);
    var maxMB = 5;
    var percent = Math.min((usedMB / maxMB) * 100, 100);
    var usedEl = document.getElementById('storage-used');
    var barEl = document.getElementById('storage-bar');
    if (usedEl) usedEl.textContent = usedMB + ' MB / ~' + maxMB + ' MB (' + percent.toFixed(1) + '%)';
    if (barEl) {
        barEl.style.width = percent + '%';
        if (percent > 80) barEl.style.background = '#ff6b6b';
        else if (percent > 50) barEl.style.background = '#ffa502';
        else barEl.style.background = 'var(--accent-color)';
    }
}

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', function() {
    initBuiltinLibrary();
    var dataBtn = document.getElementById('data-settings');
    if (dataBtn) {
        dataBtn.addEventListener('click', function() {
            setTimeout(calculateStorage, 100);
        });
    }
});

