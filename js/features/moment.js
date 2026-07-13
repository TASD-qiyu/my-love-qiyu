// 点赞
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

    // 评论
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

    // 打开发布朋友圈
    window.openPublishMoment = function() {
        const modal = document.getElementById('publish-moment-modal');
        if (modal) showModal(modal);
    };

    // 发布朋友圈
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

    // 打开朋友圈设置
    window.openMomentSettings = function() {
        const modal = document.getElementById('moment-settings-modal');
        if (modal) showModal(modal);
    };

    // 保存朋友圈设置
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

    // 打开朋友圈
    window.openMomentModal = function() {
        const modal = document.getElementById('moment-modal');
        if (modal) {
            renderMomentList();
            showModal(modal);
        }
    };

    // 初始化
    document.addEventListener('DOMContentLoaded', function() {
        initCardConcatUI();
        const settings = getCardConcatSettings();
        if (settings.momentEnabled) {
            startMomentTimer();
        }
    });

})();