// ==================== 朋友圈功能 ====================
(function() {
    'use strict';
    
    // 朋友圈数据管理
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

    // 渲染朋友圈列表
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

    // 全局暴露函数
    window.getMoments = getMoments;
    window.saveMoments = saveMoments;
    window.renderMomentList = renderMomentList;

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
        if (contentInput) contentInput.value = '';
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
        // 初始化朋友圈相关事件
    });
})();

