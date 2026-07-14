// ==================== 字卡拼接功能 ====================
(function() {
    'use strict';

    // 默认设置
    const defaultCardConcatSettings = {
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

    // 获取设置
    function getCardConcatSettings() {
        try {
            const saved = localStorage.getItem('cardConcatSettings');
            if (saved) {
                return { ...defaultCardConcatSettings, ...JSON.parse(saved) };
            }
        } catch(e) {}
        return { ...defaultCardConcatSettings };
    }

    // 保存设置
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
        try {
            const saved = localStorage.getItem('customReplies');
            if (saved) {
                const data = JSON.parse(saved);
                if (data.reply && data.reply.main) {
                    return data.reply.main.filter(item => item && (typeof item === 'string' ? item.trim() : (item.text || item.content)));
                }
            }
        } catch(e) {}
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
        return { text: text, hasImage: hasImage, images: [] };
    }

    // 初始化设置UI
    function initCardConcatUI() {
        const settings = getCardConcatSettings();
        const toggle = document.getElementById('card-concat-toggle');
        const control = document.getElementById('card-concat-control');
        if (toggle && control) {
            const switchEl = toggle.querySelector('.setting-pill-switch');
            const knob = toggle.querySelector('.setting-pill-knob');
            if (settings.enabled) {
                switchEl.style.background = 'var(--accent-color)';
                knob.style.left = '23px';
                control.style.display = 'block';
            }
            toggle.addEventListener('click', function() {
                settings.enabled = !settings.enabled;
                switchEl.style.background = settings.enabled ? 'var(--accent-color)' : 'var(--border-color)';
                knob.style.left = settings.enabled ? '23px' : '3px';
                control.style.display = settings.enabled ? 'block' : 'none';
                saveCardConcatSettings(settings);
            });
        }
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
        const momentToggle = document.getElementById('card-concat-moment-toggle');
        const momentControl = document.getElementById('card-concat-moment-control');
        if (momentToggle && momentControl) {
            const switchEl = momentToggle.querySelector('.setting-pill-switch');
            const knob = momentToggle.querySelector('.setting-pill-knob');
            if (settings.momentEnabled) {
                switchEl.style.background = 'var(--accent-color)';
                knob.style.left = '23px';
                momentControl.style.display = 'block';
            }
            momentToggle.addEventListener('click', function() {
                settings.momentEnabled = !settings.momentEnabled;
                switchEl.style.background = settings.momentEnabled ? 'var(--accent-color)' : 'var(--border-color)';
                knob.style.left = settings.momentEnabled ? '23px' : '3px';
                momentControl.style.display = settings.momentEnabled ? 'block' : 'none';
                saveCardConcatSettings(settings);
                if (settings.momentEnabled) startMomentTimer();
                else stopMomentTimer();
            });
        }
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

    function autoPublishMoment() {
        const content = generateMomentConcatContent();
        if (!content || !content.text) return;
        const moments = getMoments();
        const newMoment = {
            id: Date.now(),
            author: 'partner',
            authorName: (typeof settings !== 'undefined' && settings.partnerName) ? settings.partnerName : '梦角',
            text: content.text,
            images: content.images,
            likes: [],
            comments: [],
            timestamp: Date.now()
        };
        moments.unshift(newMoment);
        saveMoments(moments);
        if (document.getElementById('moment-modal') && 
            document.getElementById('moment-modal').classList.contains('active')) {
            renderMomentList();
        }
        if (typeof showNotification === 'function') {
            showNotification('梦角发布了新动态 ✦', 'info');
        }
    }

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

    window.getCardConcatSettings = getCardConcatSettings;
    window.generateConcatMessage = generateConcatMessage;
    window.generateMomentConcatContent = generateMomentConcatContent;
    window.initCardConcatUI = initCardConcatUI;
    window.startMomentTimer = startMomentTimer;
    window.stopMomentTimer = stopMomentTimer;
    window.getMoments = getMoments;
    window.saveMoments = saveMoments;
    window.renderMomentList = renderMomentList;
    window.autoPublishMoment = autoPublishMoment;

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
        if (modal) showModal(modal);
    };

    window.publishMoment = function() {
        const contentInput = document.getElementById('moment-content-input');
        const text = contentInput ? contentInput.value.trim() : '';
        if (!text) {
            alert('请输入内容');
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
        contentInput.value = '';
        hideModal(document.getElementById('publish-moment-modal'));
        renderMomentList();
        if (typeof showNotification === 'function') {
            showNotification('动态发布成功 ✦', 'success');
        }
    };

    window.openMomentSettings = function() {
        const modal = document.getElementById('moment-settings-modal');
        if (modal) showModal(modal);
    };

    window.saveMomentSettings = function() {
        const signature = document.getElementById('moment-signature-input');
        if (signature) {
            localStorage.setItem('momentSignature', signature.value);
        }
        hideModal(document.getElementById('moment-settings-modal'));
        if (typeof showNotification === 'function') {
            showNotification('设置已保存 ✦', 'success');
        }
    };

    window.openMomentModal = function() {
        const modal = document.getElementById('moment-modal');
        if (modal) {
            renderMomentList();
            showModal(modal);
        }
    };

    document.addEventListener('DOMContentLoaded', function() {
        initCardConcatUI();
        const settings = getCardConcatSettings();
        if (settings.momentEnabled) {
            startMomentTimer();
        }
    });
})();

