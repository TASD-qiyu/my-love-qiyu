/**
 * 朋友圈模块 (Moments)
 * 依赖: settings, messages, customReplies, stickerLibrary, voiceLibrary, videoLibrary
 * 存储键: momentsData (包含 posts, comments, likes, visitors)
 */
(function() {
    'use strict';

    const STORAGE_KEY = 'momentsData';
    let momentsData = {
        posts: [],
        comments: {},
        likes: {},
        visitors: []
    };
    let autoPostTimer = null;
    let isMomentsOpen = false;
    let currentCommentPostId = null;

    // 暴露全局对象
    window.MomentsApp = {
        init,
        open,
        close,
        publishMoment,
        renderPosts,
        toggleLike,
        addComment,
        startAutoPost,
        stopAutoPost,
        loadData,
        saveData,
        getMomentsData: () => momentsData
    };

    // ---------- 初始化 ----------
    function init() {
        loadData();
        // 如果朋友圈未打开，不需要渲染，但定时器始终运行（根据设置）
        startAutoPost();
        // 监听设置变化（外部调用时重新启动）
        if (typeof settings !== 'undefined') {
            // 可定期检查设置
            setInterval(() => {
                // 如果设置变化，重启定时器（可由外部触发）
            }, 60000);
        }
        // 绑定入口按钮
        const entryBtn = document.getElementById('moments-entry-btn');
        if (entryBtn) {
            entryBtn.addEventListener('click', () => {
                if (!isMomentsOpen) open();
                else close();
            });
        }
        // 绑定关闭按钮（已有的返回按钮）
        document.querySelector('.moments-back-btn')?.addEventListener('click', close);
        // 绑定发布按钮（如果有）
        document.getElementById('moments-publish-btn')?.addEventListener('click', () => {
            // 可以调出发布面板，这里简单示例
            const text = prompt('输入动态内容：');
            if (text) publishMoment('user', text);
        });
        // 监听评论提交
        document.addEventListener('click', function(e) {
            const sendBtn = e.target.closest('.moment-comment-send');
            if (sendBtn) {
                const input = sendBtn.closest('.moment-comment-input').querySelector('input');
                const postId = sendBtn.dataset.postId;
                if (input && input.value.trim() && postId) {
                    addComment(postId, input.value.trim(), 'user');
                    input.value = '';
                }
            }
            const likeBtn = e.target.closest('.moment-like-btn');
            if (likeBtn) {
                const postId = likeBtn.dataset.postId;
                if (postId) toggleLike(postId);
            }
            const commentBtn = e.target.closest('.moment-comment-btn');
            if (commentBtn) {
                const postId = commentBtn.dataset.postId;
                if (postId) {
                    const inputBox = document.querySelector(`.moment-comment-input[data-post-id="${postId}"]`);
                    if (inputBox) {
                        inputBox.classList.toggle('active');
                        if (inputBox.classList.contains('active')) {
                            inputBox.querySelector('input').focus();
                        }
                    }
                }
            }
        });
        // 初始渲染（如果首页不显示，可不渲染）
        if (document.getElementById('moments-container')?.style.display !== 'none') {
            renderPosts();
        }
    }

    // ---------- 打开/关闭朋友圈 ----------
    function open() {
        const container = document.getElementById('moments-container');
        if (!container) return;
        container.style.display = 'block';
        isMomentsOpen = true;
        renderPosts();
        // 记录访客（可选）
        recordVisitor('user');
    }

    function close() {
        const container = document.getElementById('moments-container');
        if (!container) return;
        container.style.display = 'none';
        isMomentsOpen = false;
    }

    // ---------- 数据持久化 ----------
    function loadData() {
        return localforage.getItem(getStorageKey(STORAGE_KEY)).then(data => {
            if (data) {
                momentsData = data;
                // 确保每个字段存在
                if (!momentsData.posts) momentsData.posts = [];
                if (!momentsData.comments) momentsData.comments = {};
                if (!momentsData.likes) momentsData.likes = {};
                if (!momentsData.visitors) momentsData.visitors = [];
            }
        }).catch(() => {
            // 默认空
            momentsData = { posts: [], comments: {}, likes: {}, visitors: [] };
        });
    }

    function saveData() {
        return localforage.setItem(getStorageKey(STORAGE_KEY), momentsData);
    }

    // ---------- 自动发动态 ----------
    function startAutoPost() {
        stopAutoPost();
        const cfg = getMomentsConfig();
        if (!cfg.autoPostEnabled) return;
        const min = cfg.autoPostIntervalMin * 1000;
        const max = cfg.autoPostIntervalMax * 1000;
        const delay = min + Math.random() * (max - min);
        autoPostTimer = setTimeout(() => {
            generateAutoPost();
            startAutoPost(); // 递归循环
        }, delay);
    }

    function stopAutoPost() {
        if (autoPostTimer) {
            clearTimeout(autoPostTimer);
            autoPostTimer = null;
        }
    }

    function generateAutoPost() {
        const cfg = getMomentsConfig();
        // 从字卡库取 N 条
        let replies = [];
        if (typeof customReplies !== 'undefined' && customReplies.length) {
            const count = cfg.cardCountMin + Math.floor(Math.random() * (cfg.cardCountMax - cfg.cardCountMin + 1));
            for (let i = 0; i < count; i++) {
                const idx = Math.floor(Math.random() * customReplies.length);
                replies.push(customReplies[idx]);
            }
        }
        const text = replies.join(' ');
        // 随机媒体
        const media = pickMedia(cfg);
        publishMoment('partner', text, media);
    }

    function pickMedia(cfg) {
        const rand = Math.random() * 100;
        let media = { images: [], video: null, voice: null };
        // 图片
        if (rand < cfg.imageChance && typeof stickerLibrary !== 'undefined' && stickerLibrary.length) {
            const count = 1 + Math.floor(Math.random() * 3);
            const shuffled = [...stickerLibrary].sort(() => Math.random() - 0.5);
            media.images = shuffled.slice(0, Math.min(count, 9));
        }
        // 视频
        if (rand < cfg.imageChance + cfg.videoChance && typeof videoLibrary !== 'undefined' && videoLibrary.length) {
            const v = videoLibrary[Math.floor(Math.random() * videoLibrary.length)];
            media.video = v.url;
        }
        // 语音
        if (rand < cfg.imageChance + cfg.videoChance + cfg.voiceChance && typeof voiceLibrary !== 'undefined' && voiceLibrary.length) {
            const v = voiceLibrary[Math.floor(Math.random() * voiceLibrary.length)];
            media.voice = v.url;
        }
        return media;
    }

    function getMomentsConfig() {
        const def = {
            autoPostEnabled: true,
            autoPostIntervalMin: 600,
            autoPostIntervalMax: 1800,
            cardCountMin: 1,
            cardCountMax: 3,
            imageChance: 30,
            videoChance: 10,
            voiceChance: 15,
            commentReplyDelayMin: 5,
            commentReplyDelayMax: 15
        };
        if (typeof settings !== 'undefined' && settings.moments) {
            return { ...def, ...settings.moments };
        }
        return def;
    }

    // ---------- 发布动态 ----------
    function publishMoment(sender, text, media) {
        if (!text && !media) return;
        const post = {
            id: 'm_' + Date.now(),
            sender: sender, // 'user' 或 'partner'
            text: text || '',
            images: media?.images || [],
            video: media?.video || null,
            voice: media?.voice || null,
            timestamp: new Date().toISOString(),
            likes: [],
            comments: []
        };
        momentsData.posts.unshift(post);
        saveData();
        if (isMomentsOpen) renderPosts();
        // 如果发送者是 partner，可触发通知
        if (sender === 'partner' && typeof showNotification === 'function') {
            showNotification('梦角发布了新动态 ✦', 'info', 3000);
        }
        // 如果发送者是 user，则触发梦角评论（随机）
        if (sender === 'user') {
            schedulePartnerComment(post.id);
        }
        return post;
    }

    // ---------- 渲染动态列表 ----------
    function renderPosts() {
        const container = document.getElementById('moments-list');
        if (!container) return;
        if (!momentsData.posts.length) {
            container.innerHTML = `<div class="moments-empty"><i class="fas fa-images"></i><p>还没有动态，说点什么吧</p></div>`;
            return;
        }
        let html = '';
        momentsData.posts.forEach(post => {
            const isUser = post.sender === 'user';
            const avatarSrc = isUser ? getMyAvatar() : getPartnerAvatar();
            const userName = isUser ? (settings?.myName || '我') : (settings?.partnerName || '梦角');
            const timeStr = new Date(post.timestamp).toLocaleString('zh-CN');
            const likesCount = post.likes ? post.likes.length : 0;
            const comments = post.comments || [];
            const liked = post.likes && post.likes.includes(getCurrentUser());

            // 媒体渲染
            let mediaHtml = '';
            if (post.images && post.images.length) {
                const imgClass = post.images.length === 1 ? 'single' : '';
                mediaHtml = `<div class="media-grid">`;
                post.images.forEach((img, idx) => {
                    const cls = post.images.length === 1 ? 'single' : (idx === 0 && post.images.length === 2 ? 'double' : '');
                    mediaHtml += `<img src="${img}" class="${cls}" loading="lazy" onclick="MomentsApp.viewMedia(this.src)">`;
                });
                mediaHtml += `</div>`;
            }
            if (post.video) {
                mediaHtml += `<video controls src="${post.video}" style="max-width:100%;border-radius:10px;"></video>`;
            }
            if (post.voice) {
                mediaHtml += `<div class="moment-voice" onclick="MomentsApp.playVoice('${post.voice}')"><i class="fas fa-headphones"></i><span>语音消息</span></div>`;
            }

            // 评论列表
            let commentsHtml = '';
            if (comments.length) {
                commentsHtml = `<div class="moment-comments">`;
                comments.forEach(c => {
                    const cSender = c.sender === 'user' ? (settings?.myName || '我') : (settings?.partnerName || '梦角');
                    commentsHtml += `<div class="moment-comment"><span class="comment-sender">${cSender}</span><span class="comment-text">${c.text}</span><span class="comment-time">${new Date(c.timestamp).toLocaleTimeString('zh-CN', {hour:'2-digit', minute:'2-digit'})}</span></div>`;
                });
                commentsHtml += `</div>`;
            }

            // 评论输入框（带 postId）
            const inputHtml = `
                <div class="moment-comment-input" data-post-id="${post.id}">
                    <input type="text" placeholder="说点什么..." maxlength="200">
                    <button class="moment-comment-send" data-post-id="${post.id}">发送</button>
                </div>
            `;

            html += `
                <div class="moment-card" data-post-id="${post.id}">
                    <div class="moment-header">
                        <img class="moment-avatar ${isUser ? 'self' : ''}" src="${avatarSrc}" alt="${userName}">
                        <span class="moment-username">${userName}</span>
                        <span class="moment-time">${timeStr}</span>
                    </div>
                    ${post.text ? `<div class="moment-text">${escapeHtml(post.text)}</div>` : ''}
                    ${mediaHtml}
                    <div class="moment-actions">
                        <button class="moment-like-btn ${liked ? 'liked' : ''}" data-post-id="${post.id}">
                            <i class="fas fa-heart"></i> <span>${likesCount}</span>
                        </button>
                        <button class="moment-comment-btn" data-post-id="${post.id}">
                            <i class="fas fa-comment"></i> <span>${comments.length}</span>
                        </button>
                    </div>
                    ${commentsHtml}
                    ${inputHtml}
                </div>
            `;
        });
        container.innerHTML = html;
    }

    // ---------- 点赞 ----------
    function toggleLike(postId) {
        const post = momentsData.posts.find(p => p.id === postId);
        if (!post) return;
        const user = getCurrentUser();
        if (!post.likes) post.likes = [];
        const idx = post.likes.indexOf(user);
        if (idx > -1) {
            post.likes.splice(idx, 1);
        } else {
            post.likes.push(user);
        }
        saveData();
        renderPosts();
        // 如果被点赞的是 partner，且点赞者是 user，可触发感谢评论
        if (post.sender === 'partner' && user === 'user') {
            // 可选：梦角回复感谢
        }
    }

    // ---------- 评论 ----------
    function addComment(postId, text, sender) {
        const post = momentsData.posts.find(p => p.id === postId);
        if (!post) return;
        if (!post.comments) post.comments = [];
        const comment = {
            sender: sender, // 'user' 或 'partner'
            text: text,
            timestamp: new Date().toISOString()
        };
        post.comments.push(comment);
        saveData();
        renderPosts();
        // 如果 sender 是 user，安排梦角自动回复（随机延迟）
        if (sender === 'user' && post.sender === 'partner') {
            schedulePartnerReply(postId);
        }
        // 如果 sender 是 partner，且当前有人看到，可通知
        if (sender === 'partner' && isMomentsOpen && typeof showNotification === 'function') {
            showNotification('梦角回复了你的评论 ✦', 'info', 2000);
        }
    }

    // 梦角自动回复（延迟）
    function schedulePartnerReply(postId) {
        const cfg = getMomentsConfig();
        const delay = (cfg.commentReplyDelayMin + Math.random() * (cfg.commentReplyDelayMax - cfg.commentReplyDelayMin)) * 1000;
        setTimeout(() => {
            // 从字卡库取一条
            let replyText = '';
            if (typeof customReplies !== 'undefined' && customReplies.length) {
                replyText = customReplies[Math.floor(Math.random() * customReplies.length)];
            }
            if (replyText) {
                addComment(postId, replyText, 'partner');
            }
        }, delay);
    }

    // 当用户发动态时，梦角评论（随机）
    function schedulePartnerComment(postId) {
        const cfg = getMomentsConfig();
        const delay = (cfg.commentReplyDelayMin + Math.random() * (cfg.commentReplyDelayMax - cfg.commentReplyDelayMin)) * 1000;
        setTimeout(() => {
            let replyText = '';
            if (typeof customReplies !== 'undefined' && customReplies.length) {
                replyText = customReplies[Math.floor(Math.random() * customReplies.length)];
            }
            if (replyText) {
                addComment(postId, replyText, 'partner');
            }
        }, delay);
    }

    // ---------- 辅助函数 ----------
    function getCurrentUser() {
        return settings?.myName || '我';
    }

    function getMyAvatar() {
        const img = document.querySelector('#my-avatar img');
        return img ? img.src : 'https://api.dicebear.com/7.x/avataaars/svg?seed=me';
    }

    function getPartnerAvatar() {
        const img = document.querySelector('#partner-avatar img');
        return img ? img.src : 'https://api.dicebear.com/7.x/avataaars/svg?seed=partner';
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 媒体查看（可复用现有图片查看逻辑）
    window.MomentsApp.viewMedia = function(src) {
        if (typeof viewImage === 'function') {
            viewImage(src);
        } else {
            window.open(src, '_blank');
        }
    };

    window.MomentsApp.playVoice = function(url) {
        const audio = new Audio(url);
        audio.play();
    };

    // 访客记录（可选）
    function recordVisitor(name) {
        // 简易去重
        const today = new Date().toDateString();
        if (!momentsData.visitors) momentsData.visitors = [];
        const existing = momentsData.visitors.find(v => v.name === name && new Date(v.timestamp).toDateString() === today);
        if (!existing) {
            momentsData.visitors.push({ name, timestamp: new Date().toISOString() });
            saveData();
            // 更新小红点
            updateVisitorBadge();
        }
    }

    function updateVisitorBadge() {
        const badge = document.getElementById('visitorBadge');
        if (!badge) return;
        const today = new Date().toDateString();
        const count = (momentsData.visitors || []).filter(v => new Date(v.timestamp).toDateString() === today).length;
        if (count > 0) {
            badge.style.display = 'block';
            badge.textContent = count > 9 ? '9+' : count;
        } else {
            badge.style.display = 'none';
        }
    }

    // ---------- 对外接口 ----------
    // 外部可调用，比如设置变化后重启定时器
    window.reloadMomentsConfig = function() {
        stopAutoPost();
        startAutoPost();
    };

    // ---------- 启动 ----------
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
