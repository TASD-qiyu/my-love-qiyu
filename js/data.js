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
                localStorage.setItem('customReplies', JSON.stringify({
                    reply: BUILTIN_CARD_LIBRARY,
                    groups: [
                        { id: 'default', name: '全部', count: BUILTIN_CARD_LIBRARY.main.length },
                        { id: 'ungrouped', name: '未分组', count: 0 }
                    ]
                }));
            }
        } catch(e) {}

        // 初始化默认音效设置
        try {
            const sounds = localStorage.getItem('soundSettings');
            if (!sounds) {
                localStorage.setItem('soundSettings', JSON.stringify({
                    enabled: true,
                    volume: 15,
                    mySend: { preset: 'tone_default', customUrl: '' },
                    partnerMessage: { preset: 'tone_soft', customUrl: '' },
                    myPoke: { preset: 'kakaotalk', customUrl: '' },
                    partnerPoke: { preset: 'tone_warm', customUrl: '' }
                }));
            }
        } catch(e) {}
    }

    /* ───────────────────── 全局暴露 ───────────────────── */
    window.DataManager = {
        // 内置库
        BUILTIN_SOUNDS: BUILTIN_SOUNDS,
        BUILTIN_CARD_LIBRARY: BUILTIN_CARD_LIBRARY,

        // 音效
        SoundGenerator: SoundGenerator,
        playSound: function(preset, volume) {
            SoundGenerator.playBuiltin(preset, volume);
        },

        // 导出
        exportAll: function() { return DataExporter.exportAll(); },
        exportCardLibrary: function() { return DataExporter.exportCardLibrary(); },
        exportSoundSettings: function() { return DataExporter.exportSoundSettings(); },
        downloadJSON: function(data, filename) { return DataExporter.downloadJSON(data, filename); },

        // 导入
        importData: function(data, options) { return DataImporter.importData(data, options); },

        // 存储统计
        getStorageStats: function() { return StorageStats.calculate(); },

        // 清理
        clearSession: function() { return DataCleaner.clearSession(); },
        clearAll: function() { return DataCleaner.clearAll(); },

        // 初始化
        init: initBuiltinData
    };

    // 自动初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBuiltinData);
    } else {
        initBuiltinData();
    }

})();
