document.addEventListener('DOMContentLoaded', async () => {
    const loaderBar = document.getElementById('loader-tech-bar');
    const welcomeSubtitle = document.querySelector('.welcome-subtitle-scramble');
    const welcomeScreen = document.getElementById('welcome-animation');
    const disclaimerModal = document.getElementById('disclaimer-modal');
    const acceptDisclaimerBtn = document.getElementById('accept-disclaimer');

    const updateLoader = (text, width) => {
        if (welcomeSubtitle) welcomeSubtitle.textContent = text;
        if (loaderBar) loaderBar.style.width = width;
    };

    const hideWelcomeScreen = () => {
        if (!welcomeScreen) return;
        welcomeScreen.classList.add('hidden');
        setTimeout(() => {
            welcomeScreen.style.display = 'none';
        }, 800);
    };

    const safeAwait = async (promise, fallback = null) => {
        try {
            return await promise;
        } catch (error) {
            console.error('操作失败:', error);
            return fallback;
        }
    };

    try {
        // ---------- 关键修改：等待 DOMElements 就绪后再绑定事件 ----------
        try {
            if (typeof DOMElements !== 'undefined' && DOMElements) {
                setupEventListeners?.();
            } else {
                console.warn('[app] DOMElements not ready, waiting...');
                const waitForDOM = setInterval(() => {
                    if (typeof DOMElements !== 'undefined' && DOMElements) {
                        clearInterval(waitForDOM);
                        setupEventListeners?.();
                    }
                }, 200);
            }
        } catch(e) {
            console.error('setupEventListeners 执行失败:', e);
        }

        if (typeof localforage === 'undefined') {
            console.warn('LocalForage 未加载，将使用 localStorage 降级方案');
        }

        try {
            const emergencyBackupRaw = localStorage.getItem('BACKUP_V1_critical');
            if (emergencyBackupRaw) {
                const emergencyBackup = JSON.parse(emergencyBackupRaw);
                if (emergencyBackup && Array.isArray(emergencyBackup.messages) && emergencyBackup.messages.length > 0) {
                    console.warn('[boot] 检测到紧急备份，可用于异常恢复');
                }
            }
        } catch (e) {
            console.warn('[boot] 紧急备份检查失败:', e);
        }

        updateLoader('正在建立安全连接...', '10%');
        await safeAwait(initializeSession());

        updateLoader('正在读取记忆存档...', '40%');
        await safeAwait(loadData());

        updateLoader('正在渲染我们的世界...', '70%');
        
        await Promise.allSettled([
            safeAwait(initializeRandomUI?.()),
            safeAwait(initMusicPlayer?.())
        ]);

        setInterval(checkStatusChange, 60000);

        if (disclaimerModal) {
            const tourSeen = await safeAwait(localforage?.getItem(APP_PREFIX + 'tour_seen'), false);
            
            if (!tourSeen) {
                showModal(disclaimerModal);
                
                if (acceptDisclaimerBtn && !acceptDisclaimerBtn._bound) {
                    acceptDisclaimerBtn._bound = true;
                    acceptDisclaimerBtn.addEventListener('click', () => {
                        hideModal(disclaimerModal);
                        localforage?.setItem(APP_PREFIX + 'tour_seen', true).catch(() => {});
                        startTour?.();
                    }, { once: true });
                }
            }
        }

        updateLoader('连接成功，欢迎回来。', '100%');
        setTimeout(hideWelcomeScreen, 3500);

        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                try {
                    if (typeof saveTimeout !== 'undefined') clearTimeout(saveTimeout);
                } catch (e) {}
                try { _backupCriticalData(); } catch (e) { console.warn('[visibilitychange] 紧急备份失败:', e); }
                try {
                    const p = saveData();
                    if (p && typeof p.catch === 'function') {
                        p.catch(e => console.error('[visibilitychange] 保存失败:', e));
                    }
                } catch (e) {
                    console.error('[visibilitychange] 保存失败:', e);
                }
            } else if (document.visibilityState === 'visible') {
                try {
                    const backup = typeof _tryRecoverFromBackup === 'function' ? _tryRecoverFromBackup() : null;
                    if (backup && Array.isArray(backup.messages) && backup.messages.length > 0 && Array.isArray(messages) && backup.messages.length > messages.length) {
                        console.warn('[visibilitychange] 检测到备份消息比当前更多，自动尝试恢复');
                        try {
                            messages = backup.messages.map(m => ({
                                ...m,
                                timestamp: new Date(m.timestamp)
                            }));
                            if (backup.settings) Object.assign(settings, backup.settings);
                            if (typeof updateUI === 'function') updateUI();
                            if (typeof throttledSaveData === 'function') throttledSaveData();
                            showNotification('已自动恢复本地临时备份内容', 'warning', 3500);
                        } catch (restoreErr) {
                            console.warn('[visibilitychange] 自动恢复失败，保留当前页面内容:', restoreErr);
                        }
                    }
                } catch (e) {
                    console.warn('[visibilitychange] 恢复备份失败:', e);
                }
            }
        });

        window.addEventListener('pagehide', () => {
            try { _backupCriticalData(); } catch (e) {}
        });

        window.addEventListener('beforeunload', () => {
            try { _backupCriticalData(); } catch (e) {}
        });

        setInterval(() => {
            saveData().catch(e => console.warn('[autoBackup] 定时保存失败:', e));
        }, 3 * 60 * 1000);

        (() => {
            const REMIND_KEY = 'exportReminderLastShown';
            const last = parseInt(localStorage.getItem(REMIND_KEY) || '0', 10);
            const daysSince = (Date.now() - last) / (1000 * 60 * 60 * 24);
            if (daysSince >= 7) {
                setTimeout(() => {
                    showNotification('建议定期导出备份，防止数据意外丢失', 'info', 7000);
                    localStorage.setItem(REMIND_KEY, String(Date.now()));
                }, 8000);
            }
        })();

        setTimeout(async () => {
            if ('Notification' in window && Notification.permission === 'default') {
                try {
                    const permission = await Notification.requestPermission();
                    if (permission === 'granted') {
                        showNotification('已开启系统通知，收到消息时会提醒你', 'success', 3000);
                    }
                } catch(e) {
                    console.warn('通知权限请求失败:', e);
                }
            }
        }, 3000);

    } catch (err) {
        console.error('严重初始化错误:', err);
        try {
            const backup = typeof _tryRecoverFromBackup === 'function' ? _tryRecoverFromBackup() : null;
            if (backup && Array.isArray(backup.messages) && backup.messages.length > 0) {
                messages = backup.messages.map(m => ({
                    ...m,
                    timestamp: new Date(m.timestamp)
                }));
                if (backup.settings) Object.assign(settings, backup.settings);
                if (typeof updateUI === 'function') updateUI();
                showNotification('初始化异常，已使用本地紧急备份恢复', 'warning', 5000);
            }
        } catch (recoverErr) {
            console.warn('[boot] 初始化失败后的恢复也失败:', recoverErr);
        }
        updateLoader('加载遇到问题，已强制进入...', '100%');
        setTimeout(hideWelcomeScreen, 3500);
    }
});

// ===== 以下为 sticker 相关事件绑定和陪伴恢复逻辑，保持不变 =====
const stickerInput = document.getElementById('sticker-file-input');
if (stickerInput) {
    stickerInput.addEventListener('change', async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        const oversized = files.filter(f => f.size > 2 * 1024 * 1024);
        if (oversized.length > 0) {
            showNotification(oversized.length + ' 张图片超过 2MB 限制，已跳过', 'warning');
        }

        const validFiles = files.filter(f => f.size <= 2 * 1024 * 1024);
        if (!validFiles.length) return;

        showNotification('正在批量处理 ' + validFiles.length + ' 张图片...', 'info');

        let successCount = 0;
        let failCount = 0;

        for (const file of validFiles) {
            try {
                const base64 = await optimizeImage(file, 300, 0.8);
                stickerLibrary.push(base64);
                successCount++;
            } catch (err) {
                console.error(err);
                failCount++;
            }
        }

        throttledSaveData();
        renderReplyLibrary();

        if (failCount > 0) {
            showNotification('上传完成：' + successCount + ' 张成功，' + failCount + ' 张失败', 'warning');
        } else {
            showNotification('上传成功，共 ' + successCount + ' 张', 'success');
        }

        e.target.value = '';
    });
}

const myStickerQuickUpload = document.getElementById('my-sticker-quick-upload');
if (myStickerQuickUpload) {
    myStickerQuickUpload.addEventListener('change', async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        const oversized = files.filter(f => f.size > 2 * 1024 * 1024);
        if (oversized.length > 0) showNotification(oversized.length + ' 张图片超过 2MB，已跳过', 'warning');
        const validFiles = files.filter(f => f.size <= 2 * 1024 * 1024);
        if (!validFiles.length) return;
        showNotification('正在处理 ' + validFiles.length + ' 张...', 'info');
        let ok = 0, fail = 0;
        const newStickers = [];
        for (const file of validFiles) {
            try {
                const base64 = await optimizeImage(file, 300, 0.8);
                newStickers.push(base64);
                ok++;
            } catch(err) { fail++; }
        }
        myStickerLibrary.unshift(...newStickers);
        throttledSaveData();
        if (typeof renderComboContent === 'function') renderComboContent('my-sticker');
        showNotification(fail > 0 ? `上传完成：${ok} 成功 ${fail} 失败` : `✓ 已添加 ${ok} 张到我的表情库`, fail > 0 ? 'warning' : 'success');
        e.target.value = '';
    });
}

// 启动时检查闪退未结束的陪伴会话（独立于 load 事件，确保一定执行）
(function() {
    function _cdRecLog(msg, data) {
        try {
            const logs = JSON.parse(localStorage.getItem('_cdRecLogs') || '[]');
            logs.push({ t: new Date().toLocaleTimeString(), msg: msg, data: data === undefined ? '' : JSON.stringify(data) });
            if (logs.length > 50) logs.splice(0, logs.length - 50);
            localStorage.setItem('_cdRecLogs', JSON.stringify(logs));
        } catch (e) {}
        try { console.log('[cdRec]', msg, data !== undefined ? data : ''); } catch (e) {}
    }

    _cdRecLog('script 已加载，准备启动检查');

    async function doRecoverCheck(attempt) {
        attempt = attempt || 1;
        _cdRecLog('开始恢复检查，第 ' + attempt + ' 次');
        try {
            if (!window.localforage) {
                _cdRecLog('❌ localforage 未加载');
                if (attempt < 5) setTimeout(() => doRecoverCheck(attempt + 1), 2000);
                return;
            }

            const allKeys = await localforage.keys();
            _cdRecLog('localforage key 总数', allKeys.length);

            const sessionKeys = allKeys.filter(k => k.indexOf('companionLiveSession') !== -1);
            _cdRecLog('匹配的 session key', sessionKeys);

            if (sessionKeys.length === 0) {
                _cdRecLog('无未结束的会话');
                return;
            }

            let bestSession = null;
            let bestKey = null;
            for (const k of sessionKeys) {
                const s = await localforage.getItem(k);
                if (s && s.mode && s.heartbeatTs) {
                    if (!bestSession || s.heartbeatTs > bestSession.heartbeatTs) {
                        bestSession = s;
                        bestKey = k;
                    }
                }
            }

            _cdRecLog('最近的会话 key', bestKey);
            _cdRecLog('会话数据', bestSession);

            if (!bestSession) {
                _cdRecLog('所有 key 都是空数据，清理');
                for (const k of sessionKeys) {
                    await localforage.removeItem(k).catch(() => {});
                }
                return;
            }

            const elapsedSinceHeartbeat = Date.now() - bestSession.heartbeatTs;
            _cdRecLog('心跳距今秒数', Math.floor(elapsedSinceHeartbeat / 1000));

            if (elapsedSinceHeartbeat > 24 * 60 * 60 * 1000) {
                _cdRecLog('超过 24 小时，丢弃');
                await localforage.removeItem(bestKey).catch(() => {});
                return;
            }

            const realElapsedSec = Math.floor((Date.now() - bestSession.startTs) / 1000)
                                 + (bestSession.accumulatedExtendTime || 0);
            _cdRecLog('从开始时间到现在的真实秒数', realElapsedSec);

            window.__cdRecoverFoundKey = bestKey;
            window.__cdRecoverFoundSession = bestSession;
            bestSession._realElapsedSec = realElapsedSec;

            if (bestSession.isCountdown && realElapsedSec >= bestSession.totalSeconds) {
                _cdRecLog('✓ 倒计时已到，自动写入日记 + 弹结束提示');
                const partnerNote = (typeof window.pickCompanionDiaryCards === 'function')
                    ? window.pickCompanionDiaryCards()
                    : '';
                if (typeof window.addCompanionDiaryEntry === 'function') {
                    await window.addCompanionDiaryEntry({
                        ts: bestSession.startTs,
                        mode: bestSession.mode,
                        duration: bestSession.totalSeconds,
                        initiator: bestSession.initiator || 'user',
                        partnerNote: partnerNote,
                        userNote: ''
                    });
                    _cdRecLog('✓ 日记已写入');
                }
                await localforage.removeItem(bestKey).catch(() => {});
                if (typeof showCompanionCompletedDialog === 'function') {
                    showCompanionCompletedDialog(bestSession);
                    _cdRecLog('✓ 已结束提示已显示');
                } else {
                    setTimeout(() => {
                        if (typeof showCompanionCompletedDialog === 'function') {
                            showCompanionCompletedDialog(bestSession);
                        }
                    }, 2000);
                }
                return;
            }

            _cdRecLog('✓ 准备显示恢复弹窗');
            if (typeof showCompanionRecoverDialog === 'function') {
                showCompanionRecoverDialog(bestSession);
                _cdRecLog('✓ 弹窗函数已调用');
            } else {
                _cdRecLog('❌ showCompanionRecoverDialog 函数不存在，等待 2 秒后重试');
                setTimeout(() => {
                    if (typeof showCompanionRecoverDialog === 'function') {
                        showCompanionRecoverDialog(bestSession);
                        _cdRecLog('✓ 重试成功，弹窗函数已调用');
                    } else {
                        _cdRecLog('❌ 重试后仍无 showCompanionRecoverDialog');
                    }
                }, 2000);
            }
        } catch(e) {
            _cdRecLog('❌ 异常', String(e && e.message || e));
        }
    }

    setTimeout(() => doRecoverCheck(1), 8000);

    async function doCallRecoverCheck(attempt) {
        attempt = attempt || 1;
        try {
            if (!window.localforage) {
                if (attempt < 5) setTimeout(() => doCallRecoverCheck(attempt + 1), 2000);
                return;
            }
            if (!window._callModule || !window._callModule.getCallSessionKey) {
                if (attempt < 5) setTimeout(() => doCallRecoverCheck(attempt + 1), 2000);
                return;
            }

            const allKeys = await localforage.keys();
            const sessionKeys = allKeys.filter(k => k.indexOf('callLiveSession') !== -1);
            if (sessionKeys.length === 0) return;

            let bestSession = null;
            let bestKey = null;
            for (const k of sessionKeys) {
                const s = await localforage.getItem(k);
                if (s && s.startTs && s.heartbeatTs) {
                    if (!bestSession || s.heartbeatTs > bestSession.heartbeatTs) {
                        bestSession = s;
                        bestKey = k;
                    }
                }
            }

            if (!bestSession) {
                for (const k of sessionKeys) {
                    await localforage.removeItem(k).catch(() => {});
                }
                return;
            }

            const ok = window._callModule.resumeFromSession(bestSession);
            if (ok) {
                if (typeof showNotification === 'function') {
                    showNotification('通话已恢复', 'success', 3000);
                }
            } else {
                await localforage.removeItem(bestKey).catch(() => {});
            }
        } catch (e) {
            console.warn('[call-recover] error:', e);
        }
    }
    setTimeout(() => doCallRecoverCheck(1), 8500);
})();

window.addEventListener('load', function() {
    setTimeout(function() {
        try {
            if (localStorage.getItem('dailyGreetingShown') === new Date().toDateString()) return;
            try { if (typeof checkPartnerDailyMood === 'function') checkPartnerDailyMood(); } catch(e2) { console.warn('checkPartnerDailyMood error:', e2); }
            if (typeof _buildDailyGreeting === 'function') _buildDailyGreeting();
            if (window.localforage && window.APP_PREFIX) {
                localforage.getItem(window.APP_PREFIX + 'tour_seen').then(function(seen) {
                    if (seen) {
                        var modal = document.getElementById('daily-greeting-modal');
                        if (modal) modal.classList.remove('hidden');
                        localStorage.setItem('dailyGreetingShown', new Date().toDateString());
                    }
                }).catch(function() {
                    var modal = document.getElementById('daily-greeting-modal');
                    if (modal) modal.classList.remove('hidden');
                    localStorage.setItem('dailyGreetingShown', new Date().toDateString());
                });
            } else {
                var modal = document.getElementById('daily-greeting-modal');
                if (modal) modal.classList.remove('hidden');
                localStorage.setItem('dailyGreetingShown', new Date().toDateString());
            }
        } catch(e) { console.warn('Daily greeting timing error:', e); }

        try {
            if (typeof checkEnvelopeStatus === 'function') {
                checkEnvelopeStatus().catch(function(e) { console.warn('envelope launch check error:', e); });
            }
        } catch(e) { console.warn('envelope launch check error:', e); }
    }, 4500);
}, { once: true });

// ----- 以下为陪伴恢复弹窗函数（保持不变） -----
function showCompanionRecoverDialog(session) {
    // ...（原内容不变，为避免冗余不再重复，请保留原文件中的完整实现）
    // 注：由于此函数未改动，实际代码中请保持原样
    // 我这里仅占位，实际你不需要替换这部分
    console.warn('showCompanionRecoverDialog 应保留原有实现');
}

function showCompanionCompletedDialog(session) {
    // ...（原内容不变）
    console.warn('showCompanionCompletedDialog 应保留原有实现');
}

function selectCompanionMode(mode) {
    // ...（原内容不变）
    console.warn('selectCompanionMode 应保留原有实现');
}