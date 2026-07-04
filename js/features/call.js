/* ============================================================
   传讯 - 视频通话功能模块 (装饰性功能)
   说明：本功能仅作为界面装饰存在，不具备实际通话或数据采集能力。
   本模块不包含任何摄像头调用逻辑，亦不存在隐私窥探行为。
   ============================================================ */

(function() {
    'use strict';

    // ============ 配置与状态 ============
    const CALL_CONFIG = {
        // 通话邀请超时时间 (毫秒)
        INVITE_TIMEOUT: 30000,
        // 振铃间隔 (毫秒)
        RING_INTERVAL: 1500,
        // 默认通话音效
        DEFAULT_RINGTONE: 'default',
        // 最大通话时长显示 (用于UI)
        MAX_DISPLAY_DURATION: 359999 // 99:59:59
    };

    // 通话状态
    const CallState = {
        IDLE: 'idle',           // 空闲
        INVITING: 'inviting',   // 邀请中
        RINGING: 'ringing',     // 响铃中
        CONNECTING: 'connecting', // 连接中
        CONNECTED: 'connected',   // 已连接
        ENDED: 'ended'            // 已结束
    };

    // 当前通话状态
    let currentState = CallState.IDLE;
    let callTimer = null;
    let ringTimer = null;
    let inviteTimer = null;
    let callStartTime = null;
    let callDuration = 0;
    let isAudioMuted = false;
    let isVideoMuted = false;
    let isSpeakerOn = true;
    let currentCallType = 'video'; // 'video' | 'audio'
    let isIncoming = false;
    let callPartnerName = '';

    // 通话记录
    let callHistory = [];

    // 音效对象
    let ringtoneAudio = null;
    let connectSoundAudio = null;
    let endSoundAudio = null;

    // ============ DOM 缓存 ============
    let callOverlay = null;
    let callContainer = null;

    // ============ 初始化 ============
    function initCallFeature() {
        createCallOverlay();
        loadCallHistory();
        initCallSounds();
        bindCallEvents();
    }

    // ============ 创建通话界面 ============
    function createCallOverlay() {
        if (document.getElementById('call-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'call-overlay';
        overlay.className = 'call-overlay';
        overlay.style.cssText = `
            position: fixed;
            inset: 0;
            z-index: 9999;
            background: #000;
            display: none;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        `;

        overlay.innerHTML = `
            <!-- 背景装饰 -->
            <div class="call-bg-decoration">
                <div class="call-bg-gradient"></div>
                <div class="call-bg-particles" id="call-particles"></div>
            </div>

            <!-- 通话主界面 -->
            <div class="call-main-container" id="call-main-container">
                <!-- 顶部信息栏 -->
                <div class="call-top-bar">
                    <div class="call-status-indicator">
                        <span id="call-status-text">正在呼叫...</span>
                    </div>
                    <div class="call-duration" id="call-duration" style="display:none;">00:00</div>
                </div>

                <!-- 对方信息区 -->
                <div class="call-partner-info" id="call-partner-info">
                    <div class="call-partner-avatar-large" id="call-partner-avatar-large">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="call-partner-name-large" id="call-partner-name-large">梦角</div>
                    <div class="call-partner-status" id="call-partner-status">等待对方接听</div>
                </div>

                <!-- 装饰性视频区域 (无实际视频功能) -->
                <div class="call-video-area" id="call-video-area" style="display:none;">
                    <div class="call-video-placeholder">
                        <div class="call-video-avatar" id="call-video-avatar">
                            <i class="fas fa-user"></i>
                        </div>
                        <div class="call-video-name" id="call-video-name">梦角</div>
                        <div class="call-video-hint">
                            <i class="fas fa-info-circle"></i>
                            视频通话为装饰功能，不涉及真实视频传输
                        </div>
                    </div>
                    <!-- 本地画面占位 (无实际摄像头调用) -->
                    <div class="call-local-preview" id="call-local-preview">
                        <div class="call-local-avatar">
                            <i class="fas fa-user"></i>
                        </div>
                        <div class="call-local-label">我</div>
                    </div>
                </div>

                <!-- 波形动画 (装饰) -->
                <div class="call-wave-animation" id="call-wave-animation">
                    <div class="call-wave-bar"></div>
                    <div class="call-wave-bar"></div>
                    <div class="call-wave-bar"></div>
                    <div class="call-wave-bar"></div>
                    <div class="call-wave-bar"></div>
                </div>

                <!-- 底部控制栏 -->
                <div class="call-controls" id="call-controls">
                    <!-- 邀请中/响铃中的控制 -->
                    <div class="call-controls-invite" id="call-controls-invite">
                        <button class="call-btn call-btn-decline" id="call-btn-decline" title="挂断">
                            <i class="fas fa-phone-slash"></i>
                            <span>挂断</span>
                        </button>
                        <button class="call-btn call-btn-accept" id="call-btn-accept" title="接听" style="display:none;">
                            <i class="fas fa-phone"></i>
                            <span>接听</span>
                        </button>
                    </div>

                    <!-- 通话中的控制 -->
                    <div class="call-controls-active" id="call-controls-active" style="display:none;">
                        <button class="call-btn call-btn-mute" id="call-btn-mute" title="静音">
                            <i class="fas fa-microphone"></i>
                            <span>静音</span>
                        </button>
                        <button class="call-btn call-btn-video" id="call-btn-video" title="视频">
                            <i class="fas fa-video"></i>
                            <span>视频</span>
                        </button>
                        <button class="call-btn call-btn-speaker" id="call-btn-speaker" title="扬声器">
                            <i class="fas fa-volume-up"></i>
                            <span>扬声器</span>
                        </button>
                        <button class="call-btn call-btn-end" id="call-btn-end" title="结束通话">
                            <i class="fas fa-phone-slash"></i>
                            <span>结束</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- 通话结束提示 -->
            <div class="call-ended-overlay" id="call-ended-overlay" style="display:none;">
                <div class="call-ended-content">
                    <div class="call-ended-icon">
                        <i class="fas fa-phone-slash"></i>
                    </div>
                    <div class="call-ended-text" id="call-ended-text">通话已结束</div>
                    <div class="call-ended-duration" id="call-ended-duration"></div>
                    <button class="call-ended-close" id="call-ended-close">关闭</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        callOverlay = overlay;
        callContainer = document.getElementById('call-main-container');

        // 创建粒子效果
        createCallParticles();
    }

    // 创建背景粒子
    function createCallParticles() {
        const container = document.getElementById('call-particles');
        if (!container) return;

        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'call-particle';
            const size = Math.random() * 4 + 2;
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: rgba(255,255,255,${Math.random() * 0.3 + 0.1});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: callParticleFloat ${Math.random() * 10 + 10}s linear infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
            container.appendChild(particle);
        }
    }

    // ============ 音效初始化 ============
    function initCallSounds() {
        // 使用内置的音频数据 (Base64 编码的短音效)
        // 振铃音效 - 柔和的提示音
        const ringtoneData = buildRingtoneSound();
        ringtoneAudio = new Audio(ringtoneData);
        ringtoneAudio.loop = true;

        // 连接音效
        const connectData = buildConnectSound();
        connectSoundAudio = new Audio(connectData);

        // 结束音效
        const endData = buildEndSound();
        endSoundAudio = new Audio(endData);
    }

    // 构建振铃音效 (使用 Web Audio API 生成)
    function buildRingtoneSound() {
        // 返回一个 data URI 格式的音频
        // 这里使用一个简单的提示音作为占位
        // 实际应用中可以替换为更丰富的音效
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const sampleRate = audioCtx.sampleRate;
            const duration = 2.0;
            const frameCount = sampleRate * duration;
            const buffer = audioCtx.createBuffer(1, frameCount, sampleRate);
            const data = buffer.getChannelData(0);

            for (let i = 0; i < frameCount; i++) {
                const t = i / sampleRate;
                // 双音调振铃效果
                const freq1 = 440; // A4
                const freq2 = 554; // C#5
                const envelope = Math.exp(-t * 2);
                const pulse = Math.sin(t * Math.PI * 4) > 0 ? 1 : 0.1;
                data[i] = (Math.sin(2 * Math.PI * freq1 * t) * 0.3 +
                          Math.sin(2 * Math.PI * freq2 * t) * 0.2) *
                          envelope * pulse * 0.3;
            }

            // 转换为 WAV 格式
            return bufferToWave(buffer, frameCount);
        } catch (e) {
            console.warn('无法生成振铃音效:', e);
            return '';
        }
    }

    // 构建连接音效
    function buildConnectSound() {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const sampleRate = audioCtx.sampleRate;
            const duration = 0.5;
            const frameCount = sampleRate * duration;
            const buffer = audioCtx.createBuffer(1, frameCount, sampleRate);
            const data = buffer.getChannelData(0);

            for (let i = 0; i < frameCount; i++) {
                const t = i / sampleRate;
                const freq = 880 + t * 440; // 频率上升
                const envelope = Math.exp(-t * 4);
                data[i] = Math.sin(2 * Math.PI * freq * t) * envelope * 0.3;
            }

            return bufferToWave(buffer, frameCount);
        } catch (e) {
            return '';
        }
    }

    // 构建结束音效
    function buildEndSound() {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const sampleRate = audioCtx.sampleRate;
            const duration = 0.3;
            const frameCount = sampleRate * duration;
            const buffer = audioCtx.createBuffer(1, frameCount, sampleRate);
            const data = buffer.getChannelData(0);

            for (let i = 0; i < frameCount; i++) {
                const t = i / sampleRate;
                const freq = 440 - t * 200; // 频率下降
                const envelope = Math.exp(-t * 6);
                data[i] = Math.sin(2 * Math.PI * freq * t) * envelope * 0.3;
            }

            return bufferToWave(buffer, frameCount);
        } catch (e) {
            return '';
        }
    }

    // AudioBuffer 转 WAV Data URI
    function bufferToWave(buffer, len) {
        const numOfChan = buffer.numberOfChannels;
        const length = len * numOfChan * 2 + 44;
        const arrayBuffer = new ArrayBuffer(length);
        const view = new DataView(arrayBuffer);
        const channels = [];
        let i, sample, offset = 0;
        let pos = 0;

        // 写入 WAV 头部
        setUint32(0x46464952); // "RIFF"
        setUint32(length - 8); // file length
        setUint32(0x45564157); // "WAVE"
        setUint32(0x20746d66); // "fmt " chunk
        setUint32(16); // length = 16
        setUint16(1); // PCM
        setUint16(numOfChan);
        setUint32(buffer.sampleRate);
        setUint32(buffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
        setUint16(numOfChan * 2); // block-align
        setUint16(16); // 16-bit
        setUint32(0x61746164); // "data" - chunk
        setUint32(length - pos - 4); // chunk length

        for (i = 0; i < buffer.numberOfChannels; i++) {
            channels.push(buffer.getChannelData(i));
        }

        while (pos < length) {
            for (i = 0; i < numOfChan; i++) {
                sample = Math.max(-1, Math.min(1, channels[i][offset]));
                sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
                view.setInt16(pos, sample, true);
                pos += 2;
            }
            offset++;
        }

        function setUint16(data) {
            view.setUint16(pos, data, true);
            pos += 2;
        }
        function setUint32(data) {
            view.setUint32(pos, data, true);
            pos += 4;
        }

        const blob = new Blob([arrayBuffer], { type: 'audio/wav' });
        return URL.createObjectURL(blob);
    }

    // ============ 事件绑定 ============
    function bindCallEvents() {
        // 接听按钮
        const acceptBtn = document.getElementById('call-btn-accept');
        if (acceptBtn) {
            acceptBtn.addEventListener('click', acceptCall);
        }

        // 挂断/拒绝按钮
        const declineBtn = document.getElementById('call-btn-decline');
        if (declineBtn) {
            declineBtn.addEventListener('click', declineCall);
        }

        // 结束通话按钮
        const endBtn = document.getElementById('call-btn-end');
        if (endBtn) {
            endBtn.addEventListener('click', endCall);
        }

        // 静音按钮
        const muteBtn = document.getElementById('call-btn-mute');
        if (muteBtn) {
            muteBtn.addEventListener('click', toggleMute);
        }

        // 视频按钮
        const videoBtn = document.getElementById('call-btn-video');
        if (videoBtn) {
            videoBtn.addEventListener('click', toggleVideo);
        }

        // 扬声器按钮
        const speakerBtn = document.getElementById('call-btn-speaker');
        if (speakerBtn) {
            speakerBtn.addEventListener('click', toggleSpeaker);
        }

        // 关闭结束提示
        const closeEndedBtn = document.getElementById('call-ended-close');
        if (closeEndedBtn) {
            closeEndedBtn.addEventListener('click', hideCallOverlay);
        }

        // 视频通话按钮 (输入区域)
        const videocallBtn = document.getElementById('videocall-btn');
        if (videocallBtn) {
            videocallBtn.addEventListener('click', () => startCall(false));
        }
    }

    // ============ 通话控制 ============

    /**
     * 发起通话
     * @param {boolean} isAudioOnly - 是否仅音频通话
     */
    function startCall(isAudioOnly = false) {
        if (currentState !== CallState.IDLE) {
            showNotification('当前已有通话进行中', 'warning');
            return;
        }

        currentCallType = isAudioOnly ? 'audio' : 'video';
        isIncoming = false;
        callPartnerName = window.settings && window.settings.partnerName ? window.settings.partnerName : '梦角';

        // 更新UI
        updateCallUI('inviting');
        showCallOverlay();

        // 设置状态
        currentState = CallState.INVITING;

        // 播放邀请音效
        playInviteSound();

        // 模拟对方接听 (随机延迟 2-5 秒)
        const answerDelay = Math.random() * 3000 + 2000;
        inviteTimer = setTimeout(() => {
            if (currentState === CallState.INVITING) {
                simulatePartnerAnswer();
            }
        }, answerDelay);

        // 超时处理
        inviteTimer = setTimeout(() => {
            if (currentState === CallState.INVITING) {
                endCall('no_answer');
            }
        }, CALL_CONFIG.INVITE_TIMEOUT);

        // 记录通话日志
        logCallEvent('outgoing', currentCallType);

        // 发送系统消息到聊天
        addCallSystemMessage('invite');
    }

    /**
     * 模拟来电 (用于测试或特定场景)
     */
    function simulateIncomingCall(isAudioOnly = false) {
        if (currentState !== CallState.IDLE) return;

        currentCallType = isAudioOnly ? 'audio' : 'video';
        isIncoming = true;
        callPartnerName = window.settings && window.settings.partnerName ? window.settings.partnerName : '梦角';

        // 更新UI
        updateCallUI('incoming');
        showCallOverlay();

        currentState = CallState.RINGING;

        // 播放振铃
        playRingtone();

        // 自动接听 (如果设置了自动接听) 或等待用户操作
        // 这里默认等待用户操作

        logCallEvent('incoming', currentCallType);
    }

    /**
     * 模拟对方接听
     */
    function simulatePartnerAnswer() {
        stopRingtone();
        currentState = CallState.CONNECTED;
        callStartTime = Date.now();

        // 播放连接音效
        if (connectSoundAudio) {
            connectSoundAudio.play().catch(() => {});
        }

        // 更新UI
        updateCallUI('connected');

        // 开始计时
        startCallTimer();

        // 发送系统消息
        addCallSystemMessage('connected');
    }

    /**
     * 接听来电
     */
    function acceptCall() {
        if (currentState !== CallState.RINGING) return;

        stopRingtone();
        currentState = CallState.CONNECTED;
        callStartTime = Date.now();

        // 播放连接音效
        if (connectSoundAudio) {
            connectSoundAudio.play().catch(() => {});
        }

        // 更新UI
        updateCallUI('connected');

        // 开始计时
        startCallTimer();

        // 清除超时定时器
        if (inviteTimer) {
            clearTimeout(inviteTimer);
            inviteTimer = null;
        }

        addCallSystemMessage('accepted');
    }

    /**
     * 拒绝/挂断通话
     */
    function declineCall() {
        if (currentState === CallState.IDLE) return;

        const wasIncoming = isIncoming;
        const reason = wasIncoming ? 'declined' : 'cancelled';

        stopRingtone();
        stopCallTimer();

        // 播放结束音效
        if (endSoundAudio) {
            endSoundAudio.play().catch(() => {});
        }

        currentState = CallState.ENDED;

        // 显示结束界面
        showCallEnded(reason);

        addCallSystemMessage(reason);
    }

    /**
     * 结束通话
     */
    function endCall(reason = 'ended') {
        if (currentState === CallState.IDLE || currentState === CallState.ENDED) return;

        stopRingtone();
        stopCallTimer();

        // 计算通话时长
        if (callStartTime) {
            callDuration = Date.now() - callStartTime;
        }

        // 播放结束音效
        if (endSoundAudio) {
            endSoundAudio.play().catch(() => {});
        }

        currentState = CallState.ENDED;

        // 显示结束界面
        showCallEnded(reason);

        // 保存通话记录
        saveCallRecord({
            type: currentCallType,
            direction: isIncoming ? 'incoming' : 'outgoing',
            duration: callDuration,
            timestamp: Date.now(),
            status: reason
        });

        addCallSystemMessage('ended');
    }

    // ============ UI 更新 ============
    function updateCallUI(state) {
        const statusText = document.getElementById('call-status-text');
        const partnerStatus = document.getElementById('call-partner-status');
        const partnerName = document.getElementById('call-partner-name-large');
        const partnerAvatar = document.getElementById('call-partner-avatar-large');
        const inviteControls = document.getElementById('call-controls-invite');
        const activeControls = document.getElementById('call-controls-active');
        const acceptBtn = document.getElementById('call-btn-accept');
        const declineBtn = document.getElementById('call-btn-decline');
        const videoArea = document.getElementById('call-video-area');
        const waveAnimation = document.getElementById('call-wave-animation');
        const partnerInfo = document.getElementById('call-partner-info');

        // 设置名字
        if (partnerName) partnerName.textContent = callPartnerName;

        // 设置头像
        const avatarUrl = window.settings && window.settings.partnerAvatar;
        if (partnerAvatar) {
            if (avatarUrl) {
                partnerAvatar.innerHTML = `<img src="${avatarUrl}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
            } else {
                partnerAvatar.innerHTML = '<i class="fas fa-user"></i>';
            }
        }

        switch (state) {
            case 'inviting':
                if (statusText) statusText.textContent = '正在呼叫...';
                if (partnerStatus) partnerStatus.textContent = '等待对方接听';
                if (inviteControls) inviteControls.style.display = 'flex';
                if (activeControls) activeControls.style.display = 'none';
                if (acceptBtn) acceptBtn.style.display = 'none';
                if (declineBtn) declineBtn.innerHTML = '<i class="fas fa-phone-slash"></i><span>挂断</span>';
                if (videoArea) videoArea.style.display = 'none';
                if (waveAnimation) waveAnimation.style.display = 'flex';
                if (partnerInfo) partnerInfo.style.display = 'flex';
                break;

            case 'incoming':
                if (statusText) statusText.textContent = '来电';
                if (partnerStatus) partnerStatus.textContent = '邀请你进行视频通话';
                if (inviteControls) inviteControls.style.display = 'flex';
                if (activeControls) activeControls.style.display = 'none';
                if (acceptBtn) acceptBtn.style.display = 'flex';
                if (declineBtn) declineBtn.innerHTML = '<i class="fas fa-phone-slash"></i><span>拒绝</span>';
                if (videoArea) videoArea.style.display = 'none';
                if (waveAnimation) waveAnimation.style.display = 'flex';
                if (partnerInfo) partnerInfo.style.display = 'flex';
                break;

            case 'connected':
                if (statusText) statusText.textContent = '通话中';
                if (partnerStatus) partnerStatus.textContent = '00:00';
                if (inviteControls) inviteControls.style.display = 'none';
                if (activeControls) activeControls.style.display = 'flex';
                if (videoArea && currentCallType === 'video') {
                    videoArea.style.display = 'flex';
                    // 更新视频区域头像
                    const videoAvatar = document.getElementById('call-video-avatar');
                    const videoName = document.getElementById('call-video-name');
                    if (videoName) videoName.textContent = callPartnerName;
                    if (videoAvatar && avatarUrl) {
                        videoAvatar.innerHTML = `<img src="${avatarUrl}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
                    }
                }
                if (waveAnimation) waveAnimation.style.display = 'none';
                if (partnerInfo) partnerInfo.style.display = 'none';
                break;
        }
    }

    function showCallEnded(reason) {
        const endedOverlay = document.getElementById('call-ended-overlay');
        const endedText = document.getElementById('call-ended-text');
        const endedDuration = document.getElementById('call-ended-duration');
        const mainContainer = document.getElementById('call-main-container');

        const reasonTexts = {
            'ended': '通话已结束',
            'declined': '对方已拒绝',
            'cancelled': '已取消',
            'no_answer': '对方未接听',
            'busy': '对方忙线中'
        };

        if (endedText) endedText.textContent = reasonTexts[reason] || '通话已结束';

        if (callDuration > 0) {
            const durationStr = formatDuration(callDuration);
            if (endedDuration) endedDuration.textContent = `通话时长: ${durationStr}`;
        } else {
            if (endedDuration) endedDuration.textContent = '';
        }

        if (mainContainer) mainContainer.style.display = 'none';
        if (endedOverlay) endedOverlay.style.display = 'flex';

        // 3秒后自动关闭
        setTimeout(() => {
            hideCallOverlay();
        }, 3000);
    }

    function showCallOverlay() {
        if (callOverlay) {
            callOverlay.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    function hideCallOverlay() {
        if (callOverlay) {
            callOverlay.style.display = 'none';
            document.body.style.overflow = '';
        }

        // 重置状态
        const mainContainer = document.getElementById('call-main-container');
        const endedOverlay = document.getElementById('call-ended-overlay');
        if (mainContainer) mainContainer.style.display = 'flex';
        if (endedOverlay) endedOverlay.style.display = 'none';

        currentState = CallState.IDLE;
        callDuration = 0;
        callStartTime = null;
        isAudioMuted = false;
        isVideoMuted = false;
    }

    // ============ 通话控制按钮 ============
    function toggleMute() {
        isAudioMuted = !isAudioMuted;
        const btn = document.getElementById('call-btn-mute');
        const icon = btn ? btn.querySelector('i') : null;

        if (btn) {
            if (isAudioMuted) {
                btn.classList.add('call-btn-active');
                if (icon) icon.className = 'fas fa-microphone-slash';
            } else {
                btn.classList.remove('call-btn-active');
                if (icon) icon.className = 'fas fa-microphone';
            }
        }
    }

    function toggleVideo() {
        isVideoMuted = !isVideoMuted;
        const btn = document.getElementById('call-btn-video');
        const icon = btn ? btn.querySelector('i') : null;

        if (btn) {
            if (isVideoMuted) {
                btn.classList.add('call-btn-active');
                if (icon) icon.className = 'fas fa-video-slash';
            } else {
                btn.classList.remove('call-btn-active');
                if (icon) icon.className = 'fas fa-video';
            }
        }

        // 切换本地预览显示 (装饰性)
        const localPreview = document.getElementById('call-local-preview');
        if (localPreview) {
            localPreview.style.opacity = isVideoMuted ? '0.3' : '1';
        }
    }

    function toggleSpeaker() {
        isSpeakerOn = !isSpeakerOn;
        const btn = document.getElementById('call-btn-speaker');
        const icon = btn ? btn.querySelector('i') : null;

        if (btn) {
            if (!isSpeakerOn) {
                btn.classList.add('call-btn-active');
                if (icon) icon.className = 'fas fa-volume-mute';
            } else {
                btn.classList.remove('call-btn-active');
                if (icon) icon.className = 'fas fa-volume-up';
            }
        }
    }

    // ============ 计时器 ============
    function startCallTimer() {
        const durationEl = document.getElementById('call-duration');
        const partnerStatus = document.getElementById('call-partner-status');

        if (durationEl) durationEl.style.display = 'block';

        callTimer = setInterval(() => {
            if (callStartTime) {
                const elapsed = Date.now() - callStartTime;
                const timeStr = formatDuration(elapsed);

                if (durationEl) durationEl.textContent = timeStr;
                if (partnerStatus) partnerStatus.textContent = timeStr;
            }
        }, 1000);
    }

    function stopCallTimer() {
        if (callTimer) {
            clearInterval(callTimer);
            callTimer = null;
        }
    }

    function formatDuration(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (hours > 0) {
            return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    // ============ 音效控制 ============
    function playRingtone() {
        if (ringtoneAudio) {
            ringtoneAudio.currentTime = 0;
            ringtoneAudio.play().catch(() => {});
        }
    }

    function stopRingtone() {
        if (ringtoneAudio) {
            ringtoneAudio.pause();
            ringtoneAudio.currentTime = 0;
        }
    }

    function playInviteSound() {
        // 使用简单的提示音代替
        if (connectSoundAudio) {
            connectSoundAudio.currentTime = 0;
            connectSoundAudio.play().catch(() => {});
        }
    }

    // ============ 通话记录 ============
    function saveCallRecord(record) {
        callHistory.unshift(record);
        // 最多保留 100 条
        if (callHistory.length > 100) {
            callHistory = callHistory.slice(0, 100);
        }
        localStorage.setItem('callHistory', JSON.stringify(callHistory));
    }

    function loadCallHistory() {
        try {
            const saved = localStorage.getItem('callHistory');
            if (saved) {
                callHistory = JSON.parse(saved);
            }
        } catch (e) {
            callHistory = [];
        }
    }

    function getCallHistory() {
        return callHistory;
    }

    function clearCallHistory() {
        callHistory = [];
        localStorage.removeItem('callHistory');
    }

    // ============ 系统消息 ============
    function addCallSystemMessage(type) {
        if (typeof addSystemMessage !== 'function') return;

        const messages = {
            'invite': `📞 发起${currentCallType === 'video' ? '视频' : '语音'}通话邀请`,
            'connected': `📞 ${currentCallType === 'video' ? '视频' : '语音'}通话已接通`,
            'accepted': `📞 已接听${currentCallType === 'video' ? '视频' : '语音'}通话`,
            'declined': `📞 对方拒绝了通话邀请`,
            'cancelled': `📞 已取消通话`,
            'ended': `📞 通话结束${callDuration > 0 ? ' · ' + formatDuration(callDuration) : ''}`,
            'no_answer': `📞 对方未接听`
        };

        const msg = messages[type];
        if (msg && typeof addSystemMessage === 'function') {
            addSystemMessage(msg);
        }
    }

    function logCallEvent(direction, type) {
        console.log(`[Call] ${direction} ${type} call at ${new Date().toLocaleString()}`);
    }

    // ============ 导出接口 ============
    window.callFeature = {
        init: initCallFeature,
        startCall: startCall,
        simulateIncomingCall: simulateIncomingCall,
        acceptCall: acceptCall,
        declineCall: declineCall,
        endCall: endCall,
        getCallHistory: getCallHistory,
        clearCallHistory: clearCallHistory,
        getState: () => currentState,
        isInCall: () => currentState === CallState.CONNECTED || currentState === CallState.INVITING || currentState === CallState.RINGING
    };

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCallFeature);
    } else {
        initCallFeature();
    }

})();
