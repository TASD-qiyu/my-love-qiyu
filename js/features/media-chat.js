/**
 * 语音库 / 视频库 管理
 * 用于字卡回复、朋友圈等模块随机调用
 * 存储键: voiceLibrary, videoLibrary (分别存储)
 */
(function() {
    'use strict';

    const VOICE_KEY = 'voiceLibrary';
    const VIDEO_KEY = 'videoLibrary';

    let voiceLibrary = [];
    let videoLibrary = [];

    // 加载数据
    function loadData() {
        return Promise.all([
            localforage.getItem(getStorageKey(VOICE_KEY)),
            localforage.getItem(getStorageKey(VIDEO_KEY))
        ]).then(([voices, videos]) => {
            voiceLibrary = voices || [];
            videoLibrary = videos || [];
        }).catch(() => {
            voiceLibrary = [];
            videoLibrary = [];
        });
    }

    function saveData() {
        return Promise.all([
            localforage.setItem(getStorageKey(VOICE_KEY), voiceLibrary),
            localforage.setItem(getStorageKey(VIDEO_KEY), videoLibrary)
        ]);
    }

    // 添加语音
    function addVoice(name, url) {
        if (!name || !url) return;
        voiceLibrary.push({ id: 'v_' + Date.now(), name, url });
        saveData();
    }

    // 添加视频
    function addVideo(name, url) {
        if (!name || !url) return;
        videoLibrary.push({ id: 'vid_' + Date.now(), name, url });
        saveData();
    }

    // 删除
    function deleteVoice(id) {
        voiceLibrary = voiceLibrary.filter(item => item.id !== id);
        saveData();
    }
    function deleteVideo(id) {
        videoLibrary = videoLibrary.filter(item => item.id !== id);
        saveData();
    }

    // 随机获取
    function getRandomVoice() {
        if (!voiceLibrary.length) return null;
        return voiceLibrary[Math.floor(Math.random() * voiceLibrary.length)];
    }
    function getRandomVideo() {
        if (!videoLibrary.length) return null;
        return videoLibrary[Math.floor(Math.random() * videoLibrary.length)];
    }

    // 渲染 UI（在回复库面板中显示）
    function renderMediaLibrary(type, container) {
        // type: 'voice' 或 'video'
        const items = type === 'voice' ? voiceLibrary : videoLibrary;
        if (!container) return;
        if (!items.length) {
            container.innerHTML = `<div class="empty-sticker-tip"><i class="fas fa-${type === 'voice' ? 'microphone-slash' : 'film'}"></i><span>暂无${type === 'voice' ? '语音' : '视频'}</span></div>`;
            return;
        }
        let html = `<div style="display:flex;flex-direction:column;gap:8px;">`;
        items.forEach(item => {
            const isAudio = type === 'voice';
            html += `
                <div class="media-item" data-id="${item.id}" style="display:flex;align-items:center;gap:10px;padding:8px 12px;background:var(--secondary-bg);border-radius:8px;border:1px solid var(--border-color);">
                    <i class="fas fa-${isAudio ? 'music' : 'video'}" style="color:var(--accent-color);"></i>
                    <span style="flex:1;font-size:13px;color:var(--text-primary);">${escapeHtml(item.name)}</span>
                    <button class="media-play-btn" data-url="${item.url}" title="播放" style="background:none;border:none;cursor:pointer;color:var(--accent-color);"><i class="fas fa-play"></i></button>
                    <button class="media-delete-btn" data-id="${item.id}" title="删除" style="background:none;border:none;cursor:pointer;color:#ff4757;"><i class="fas fa-trash-alt"></i></button>
                </div>
            `;
        });
        html += `</div>`;
        container.innerHTML = html;

        // 事件绑定
        container.querySelectorAll('.media-play-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const url = this.dataset.url;
                if (isAudio) {
                    const audio = new Audio(url);
                    audio.play();
                } else {
                    // 视频弹窗播放
                    const overlay = document.createElement('div');
                    overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;';
                    overlay.innerHTML = `<video controls src="${url}" style="max-width:90vw;max-height:90vh;border-radius:10px;" autoplay></video><button onclick="this.parentElement.remove()" style="position:absolute;top:20px;right:20px;background:none;border:none;color:#fff;font-size:24px;cursor:pointer;">✕</button>`;
                    document.body.appendChild(overlay);
                }
            });
        });
        container.querySelectorAll('.media-delete-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                if (!confirm('确定删除吗？')) return;
                const id = this.dataset.id;
                if (type === 'voice') deleteVoice(id);
                else deleteVideo(id);
                renderMediaLibrary(type, container);
            });
        });
    }

    // 添加上传按钮
    function createUploadUI(container, type) {
        const uploadDiv = document.createElement('div');
        uploadDiv.style.cssText = 'display:flex;gap:8px;padding:8px 0;flex-wrap:wrap;';
        uploadDiv.innerHTML = `
            <input type="text" class="media-name-input" placeholder="名称" style="flex:1;padding:8px;border:1px solid var(--border-color);border-radius:8px;background:var(--primary-bg);color:var(--text-primary);font-size:13px;">
            <input type="text" class="media-url-input" placeholder="URL 或 上传文件" style="flex:2;padding:8px;border:1px solid var(--border-color);border-radius:8px;background:var(--primary-bg);color:var(--text-primary);font-size:13px;">
            <button class="media-upload-btn" style="padding:8px 16px;background:var(--accent-color);color:#fff;border:none;border-radius:8px;cursor:pointer;">上传</button>
            <button class="media-file-btn" style="padding:8px 12px;background:var(--secondary-bg);border:1px solid var(--border-color);border-radius:8px;cursor:pointer;">📁</button>
            <input type="file" class="media-file-input" accept="${type === 'voice' ? 'audio/*' : 'video/*'}" style="display:none;">
        `;
        container.appendChild(uploadDiv);

        const nameInput = uploadDiv.querySelector('.media-name-input');
        const urlInput = uploadDiv.querySelector('.media-url-input');
        const uploadBtn = uploadDiv.querySelector('.media-upload-btn');
        const fileBtn = uploadDiv.querySelector('.media-file-btn');
        const fileInput = uploadDiv.querySelector('.media-file-input');

        uploadBtn.addEventListener('click', function() {
            const name = nameInput.value.trim();
            let url = urlInput.value.trim();
            if (!name) { alert('请输入名称'); return; }
            if (!url) { alert('请输入URL或先上传文件'); return; }
            if (type === 'voice') addVoice(name, url);
            else addVideo(name, url);
            nameInput.value = '';
            urlInput.value = '';
            renderMediaLibrary(type, container);
        });

        fileBtn.addEventListener('click', function() {
            fileInput.click();
        });
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function(ev) {
                const base64 = ev.target.result;
                urlInput.value = base64;
                // 自动填充名称（取文件名）
                if (!nameInput.value.trim()) {
                    nameInput.value = file.name.replace(/\.[^.]+$/, '');
                }
            };
            reader.readAsDataURL(file);
            this.value = '';
        });
    }

    // 注册到回复库面板（由 reply-library.js 调用）
    window.switchToMediaLibrary = function(type) {
        // type: 'voice' 或 'video'
        // 隐藏其他面板，显示 media 面板
        const listArea = document.getElementById('custom-replies-list');
        const annPanel = document.getElementById('announcement-panel');
        if (annPanel) annPanel.style.display = 'none';
        if (listArea) {
            listArea.style.display = 'block';
            listArea.innerHTML = '';
            // 添加上传UI
            createUploadUI(listArea, type);
            // 渲染列表
            renderMediaLibrary(type, listArea);
        }
        // 更新标题
        const titleEl = document.getElementById('cr-modal-title');
        if (titleEl) titleEl.textContent = type === 'voice' ? '语音库' : '视频库';
        // 隐藏原有的子tab和新增按钮
        const subTabs = document.getElementById('cr-sub-tabs');
        if (subTabs) subTabs.style.display = 'none';
        const addBtn = document.getElementById('add-custom-reply');
        if (addBtn) addBtn.style.display = 'none';
    };

    // 在侧边栏增加按钮（在 reply-library.js 的 sidebar 中加入）
    // 注意：需要在 HTML 中添加对应按钮，或由 reply-library.js 动态添加
    // 这里提供函数，供外部调用

    // 工具
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 初始化加载
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadData);
    } else {
        loadData();
    }

    // 暴露给全局
    window.voiceLibrary = voiceLibrary;
    window.videoLibrary = videoLibrary;
    window.addVoice = addVoice;
    window.addVideo = addVideo;
    window.getRandomVoice = getRandomVoice;
    window.getRandomVideo = getRandomVideo;
    window.renderMediaLibrary = renderMediaLibrary;
    window.deleteVoice = deleteVoice;
    window.deleteVideo = deleteVideo;
})();
