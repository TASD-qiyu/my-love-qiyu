/**
 * voice.js - 长按录音发送语音消息
 * 依赖：core.js 中的 addMessage, showNotification, playSound 等
 */

(function() {
    'use strict';

    // DOM 元素
    const voiceBtn = document.getElementById('voice-btn');
    if (!voiceBtn) {
        console.warn('[voice] 未找到 #voice-btn，语音功能不可用');
        return;
    }

    // 配置
    const MAX_RECORD_SECONDS = 60;          // 最长录音 60 秒
    const LONG_PRESS_THRESHOLD = 400;       // 长按判定阈值 (ms)

    // 状态变量
    let mediaRecorder = null;
    let audioChunks = [];
    let isRecording = false;
    let recordStartTime = 0;
    let recordTimer = null;                 // 自动停止定时器
    let pressTimer = null;                  // 长按判定定时器
    let isLongPress = false;                // 是否触发了长按

    // 录音提示浮层（固定于屏幕底部）
    let hintElement = null;

    // ─── 初始化提示浮层 ──────────────────────────────
    function initHint() {
        if (!hintElement) {
            hintElement = document.createElement('div');
            hintElement.className = 'voice-recording-hint';
            hintElement.style.cssText = `
                position: fixed;
                bottom: 120px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0,0,0,0.75);
                color: #fff;
                padding: 10px 24px;
                border-radius: 30px;
                font-size: 15px;
                font-family: var(--font-family);
                z-index: 9999;
                display: none;
                pointer-events: none;
                backdrop-filter: blur(10px);
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                letter-spacing: 1px;
            `;
            document.body.appendChild(hintElement);
        }
        return hintElement;
    }

    function showHint(text) {
        const el = initHint();
        el.textContent = text;
        el.style.display = 'block';
    }

    function hideHint() {
        if (hintElement) hintElement.style.display = 'none';
    }

    // ─── 获取麦克风权限并创建 MediaRecorder ─────────
    async function initRecorder() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            audioChunks = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) audioChunks.push(e.data);
            };

            mediaRecorder.onstop = () => {
                // 如果录音时长太短，不发送
                const duration = (Date.now() - recordStartTime) / 1000;
                if (duration < 0.8) {
                    showHint('录音太短，已取消');
                    setTimeout(hideHint, 1200);
                    // 释放流
                    stream.getTracks().forEach(t => t.stop());
                    return;
                }

                // 构建音频 Blob 并转为 base64
                const blob = new Blob(audioChunks, { type: 'audio/webm' });
                const reader = new FileReader();
                reader.onload = () => {
                    const base64Data = reader.result; // data:audio/webm;base64,...
                    const roundedDuration = Math.round(duration);
                    sendVoiceMessage(base64Data, roundedDuration);
                    // 释放流
                    stream.getTracks().forEach(t => t.stop());
                };
                reader.readAsDataURL(blob);
            };

            return true;
        } catch (err) {
            console.error('[voice] getUserMedia 失败:', err);
            showNotification('无法访问麦克风，请检查浏览器权限', 'error');
            return false;
        }
    }

    // ─── 发送语音消息 ──────────────────────────────
    function sendVoiceMessage(base64Data, duration) {
        // 使用全局 addMessage（来自 core.js）
        if (typeof addMessage !== 'function') {
            console.error('[voice] addMessage 未定义');
            return;
        }
        addMessage({
            id: Date.now() + Math.random(),
            sender: 'user',
            text: '',
            timestamp: new Date(),
            voice: {
                url: base64Data,
                duration: duration,
                fakeText: ''   // 若后续支持语音转文字可填入
            },
            status: 'sent',
            favorited: false,
            note: null,
            replyTo: typeof currentReplyTo !== 'undefined' ? currentReplyTo : null,
            type: 'normal'
        });

        // 播放发送音效
        if (typeof playSound === 'function') playSound('send');

        // 清空回复引用
        if (typeof currentReplyTo !== 'undefined') {
            currentReplyTo = null;
            if (typeof updateReplyPreview === 'function') updateReplyPreview();
        }

        // 触发对方回复（非批量模式）
        if (typeof isBatchMode !== 'undefined' && !isBatchMode) {
            if (typeof window._triggerDelayedReply === 'function') {
                window._triggerDelayedReply(true);
            }
        }
    }

    // ─── 开始录音 ──────────────────────────────────
    async function startRecording() {
        const ok = await initRecorder();
        if (!ok) return;

        mediaRecorder.start();
        isRecording = true;
        recordStartTime = Date.now();

        // 按钮样式变化
        voiceBtn.classList.add('recording');
        showHint('🎤 录音中... 松开发送');

        // 自动停止定时器（防止过长时间）
        recordTimer = setTimeout(() => {
            if (isRecording) {
                stopRecording(true); // 自动停止
            }
        }, MAX_RECORD_SECONDS * 1000);
    }

    // ─── 停止录音 ──────────────────────────────────
    function stopRecording(auto = false) {
        if (!isRecording) return;
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
        }
        isRecording = false;
        voiceBtn.classList.remove('recording');
        clearTimeout(recordTimer);
        hideHint();
        if (!auto) {
            // 手动松开停止时，在 onstop 里判断时长是否足够
            // 但 onstop 里会处理，此处无需额外逻辑
        }
    }

    // ─── 取消录音（丢弃本次录音）───────────────────
    function cancelRecording() {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop(); // 会触发 onstop，但我们可以通过标志忽略
        }
        isRecording = false;
        voiceBtn.classList.remove('recording');
        clearTimeout(recordTimer);
        hideHint();
        audioChunks = [];
        // 注意：onstop 仍会执行，但我们会通过判断 duration < 0.8 忽略
    }

    // ─── 事件绑定 ──────────────────────────────────
    // 鼠标事件（桌面）
    voiceBtn.addEventListener('mousedown', (e) => {
        e.preventDefault();
        // 如果已经在录音中，则取消录音（类似微信：再次点击停止）
        if (isRecording) {
            cancelRecording();
            showHint('已取消录音');
            setTimeout(hideHint, 1000);
            return;
        }
        isLongPress = false;
        pressTimer = setTimeout(() => {
            isLongPress = true;
            startRecording();
        }, LONG_PRESS_THRESHOLD);
    });

    voiceBtn.addEventListener('mouseup', (e) => {
        e.preventDefault();
        clearTimeout(pressTimer);
        if (isRecording && isLongPress) {
            stopRecording();
        }
        // 如果只是短按（点击）不触发任何操作
    });

    voiceBtn.addEventListener('mouseleave', (e) => {
        // 鼠标移出按钮，若正在录音则停止并发送
        if (isRecording && isLongPress) {
            stopRecording();
        }
        clearTimeout(pressTimer);
    });

    // 触摸事件（移动端）
    voiceBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (isRecording) {
            cancelRecording();
            showHint('已取消录音');
            setTimeout(hideHint, 1000);
            return;
        }
        isLongPress = false;
        pressTimer = setTimeout(() => {
            isLongPress = true;
            startRecording();
        }, LONG_PRESS_THRESHOLD);
    }, { passive: false });

    voiceBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        clearTimeout(pressTimer);
        if (isRecording && isLongPress) {
            stopRecording();
        }
    }, { passive: false });

    voiceBtn.addEventListener('touchcancel', (e) => {
        e.preventDefault();
        clearTimeout(pressTimer);
        if (isRecording && isLongPress) {
            cancelRecording();
            showHint('录音已取消');
            setTimeout(hideHint, 1000);
        }
    }, { passive: false });

    // ─── 额外：全局暴露录音取消（便于外部调用）─────
    window.cancelVoiceRecording = cancelRecording;

    console.log('[voice] 长按录音模块已初始化');
})();
