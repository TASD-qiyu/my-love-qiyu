/**
 * listeners.js - 事件监听与交互处理
 * 传讯应用 - 全局事件绑定与UI交互
 */

(function() {
    'use strict';

    // ==================== 初始化 ====================
    document.addEventListener('DOMContentLoaded', function() {
        initAllListeners();
        initCardConcatUI();
        initMomentSystem();
    });

    function initAllListeners() {
        // 设置面板导航
        initSettingsNavigation();
        // 外观设置
        initAppearanceListeners();
        // 聊天设置
        initChatSettingsListeners();
        // 数据管理
        initDataManagementListeners();
        // 输入区域
        initInputAreaListeners();
        // 模态框通用
        initModalListeners();
        // 主题配色
        initThemeColorListeners();
        // 字体设置
        initFontListeners();
        // 气泡样式
        initBubbleStyleListeners();
        // 头像设置
        initAvatarListeners();
        // 字卡拼接
        initCardConcatListeners();
        // 朋友圈
        initMomentListeners();
        // 音效设置
        initSoundListeners();
        // 节奏设置
        initRhythmListeners();
        // 显示设置
        initDisplayListeners();
        // 昵称设置
        initNameListeners();
        // 消息统计
        initStatsListeners();
        // 心情手账
        initMoodListeners();
        // 信封投递
        initEnvelopeListeners();
        // 陪伴功能
        initCompanionListeners();
        // 群聊设置
        initGroupChatListeners();
        // 通话功能
        initCallListeners();
        // 音乐播放器
        initMusicPlayerListeners();
        // 底部栏收纳
        initCollapseListeners();
    }

    // ==================== 设置面板导航 ====================
    function initSettingsNavigation() {
        // 设置主面板 -> 外观设置
        bindClick('appearance-settings', function() {
            hideModal(document.getElementById('settings-modal'));
            showModal(document.getElementById('appearance-modal'));
        });

        // 设置主面板 -> 聊天设置
        bindClick('chat-settings', function() {
            hideModal(document.getElementById('settings-modal'));
            showModal(document.getElementById('chat-modal'));
        });

        // 设置主面板 -> 高级功能
        bindClick('advanced-settings', function() {
            hideModal(document.getElementById('settings-modal'));
            showModal(document.getElementById('advanced-modal'));
        });

        // 设置主面板 -> 数据管理
        bindClick('data-settings', function() {
            hideModal(document.getElementById('settings-modal'));
            showModal(document.getElementById('data-modal'));
            refreshDataManagementUI();
        });

        // 高级功能 -> 自定义回复
        bindClick('custom-replies-function', function() {
            hideModal(document.getElementById('advanced-modal'));
            showModal(document.getElementById('custom-replies-modal'));
            renderReplyLibrary();
        });

        // 高级功能 -> 消息统计
        bindClick('stats-function', function() {
            hideModal(document.getElementById('advanced-modal'));
            showModal(document.getElementById('stats-modal'));
            updateStatsDisplay();
        });

        // 高级功能 -> 心情手账
        bindClick('mood-function', function() {
            hideModal(document.getElementById('advanced-modal'));
            showModal(document.getElementById('mood-modal'));
            renderCalendar();
        });

        // 高级功能 -> 重要日
        bindClick('anniversary-function', function() {
            hideModal(document.getElementById('advanced-modal'));
            showModal(document.getElementById('anniversary-modal'));
            renderAnniversaryList();
        });

        // 高级功能 -> 运势占卜
        bindClick('fortune-lenormand-function', function() {
            hideModal(document.getElementById('advanced-modal'));
            showModal(document.getElementById('fortune-lenormand-modal'));
        });

        // 高级功能 -> 抉择
        bindClick('decision-function', function() {
            hideModal(document.getElementById('advanced-modal'));
            showModal(document.getElementById('decision-menu-modal'));
        });

        // 高级功能 -> 陪伴日记
        bindClick('companion-diary-function', function() {
            hideModal(document.getElementById('advanced-modal'));
            showModal(document.getElementById('companion-diary-modal'));
            renderCompanionDiary();
        });

        // 高级功能 -> 朋友圈
        bindClick('moment-function', function() {
            hideModal(document.getElementById('advanced-modal'));
            openMomentModal();
        });
    }

    // ==================== 外观设置 ====================
    function initAppearanceListeners() {
        // 画廊入口
        bindClick('gallery-banner-entry', function() {
            showNotification('传讯专属画廊功能开发中 ✦', 'info');
        });

        // 外观导航网格
        const navItems = document.querySelectorAll('#appearance-nav-grid .settings-card');
        navItems.forEach(function(item) {
            item.addEventListener('click', function() {
                const panel = this.getAttribute('onclick').match(/showAppearancePanel\('(.+?)'\)/);
                if (panel) showAppearancePanel(panel[1]);
            });
        });

        // 返回按钮
        bindClick('back-appearance', function() {
            const panelContainer = document.getElementById('appearance-panel-container');
            if (panelContainer && panelContainer.style.display !== 'none') {
                hideAppearancePanel();
            } else {
                hideModal(document.getElementById('appearance-modal'));
                showModal(document.getElementById('settings-modal'));
            }
        });

        bindClick('close-appearance', function() {
            hideModal(document.getElementById('appearance-modal'));
        });
    }

    // ==================== 聊天设置 ====================
    function initChatSettingsListeners() {
        // 标签切换
        const csTabs = document.querySelectorAll('#cs-tabs .cs-tab');
        csTabs.forEach(function(tab) {
            tab.addEventListener('click', function() {
                switchCsTab(this);
            });
        });

        // 返回按钮
        bindClick('back-chat', function() {
            hideModal(document.getElementById('chat-modal'));
            showModal(document.getElementById('settings-modal'));
        });

        bindClick('close-chat', function() {
            hideModal(document.getElementById('chat-modal'));
        });
    }

    // ==================== 数据管理 ====================
    function initDataManagementListeners() {
        bindClick('close-data', function() {
            hideModal(document.getElementById('data-modal'));
        });

        // 全量备份
        bindClick('full-backup-btn', function() {
            exportAllData();
        });

        // 聊天记录备份
        bindClick('chat-backup-btn', function() {
            exportChatData();
        });

        // 导入数据
        bindClick('import-data-btn', function() {
            document.getElementById('import-input').click();
        });

        // 导入文件选择
        const importInput = document.getElementById('import-input');
        if (importInput) {
            importInput.addEventListener('change', function(e) {
                if (e.target.files.length > 0) {
                    importDataFromFile(e.target.files[0]);
                }
            });
        }

        // 清除会话
        bindClick('clear-session-btn', function() {
            if (confirm('确定要删除本会话的所有消息吗？此操作不可撤销。')) {
                clearCurrentSession();
                showNotification('本会话已清空 ✦', 'success');
            }
        });

        // 重置数据
        bindClick('reset-all-btn', function() {
            if (confirm('确定要重置所有数据吗？此操作不可撤销，所有设置和聊天记录将被清除！')) {
                if (confirm('再次确认：你真的要清空所有数据吗？')) {
                    resetAllData();
                    showNotification('所有数据已重置 ✦', 'success');
                    location.reload();
                }
            }
        });
    }

    // ==================== 输入区域 ====================
    function initInputAreaListeners() {
        const messageInput = document.getElementById('message-input');
        const sendBtn = document.getElementById('send-btn');
        const continueBtn = document.getElementById('continue-btn');
        const batchBtn = document.getElementById('batch-btn');
        const attachmentBtn = document.getElementById('attachment-btn');
        const comboBtn = document.getElementById('combo-btn');
        const videocallBtn = document.getElementById('videocall-btn');
        const collapseExpandBtn = document.getElementById('collapse-expand-btn');

        // 消息输入
        if (messageInput) {
            messageInput.addEventListener('input', function() {
                this.style.height = 'auto';
                this.style.height = Math.min(this.scrollHeight, 120) + 'px';
            });

            messageInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                }
            });
        }

        // 发送按钮
        if (sendBtn) {
            sendBtn.addEventListener('click', function() {
                sendMessage();
            });
        }

        // 继续按钮
        if (continueBtn) {
            continueBtn.addEventListener('click', function() {
                triggerPartnerContinue();
            });
        }

        // 批量发送
        if (batchBtn) {
            batchBtn.addEventListener('click', function() {
                toggleBatchMode();
            });
        }

        // 附件/图片
        if (attachmentBtn) {
            attachmentBtn.addEventListener('click', function() {
                document.getElementById('image-input').click();
            });
        }

        // 图片选择
        const imageInput = document.getElementById('image-input');
        if (imageInput) {
            imageInput.addEventListener('change', function(e) {
                if (e.target.files.length > 0) {
                    handleImageUpload(e.target.files[0]);
                }
            });
        }

        // 表情拍一拍
        if (comboBtn) {
            comboBtn.addEventListener('click', function() {
                toggleStickerPicker();
            });
        }

        // 视频通话
        if (videocallBtn) {
            videocallBtn.addEventListener('click', function() {
                if (window.callFeature && typeof window.callFeature.startCall === 'function') {
                    window.callFeature.startCall(false);
                }
            });
        }

        // 展开更多按钮
        if (collapseExpandBtn) {
            collapseExpandBtn.addEventListener('click', function() {
                window.toggleCollapsedExtras && window.toggleCollapsedExtras();
            });
        }
    }

    // ==================== 模态框通用 ====================
    function initModalListeners() {
        // 点击模态框背景关闭
        document.querySelectorAll('.modal').forEach(function(modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    hideModal(this);
                }
            });
        });

        // ESC键关闭模态框
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const activeModal = document.querySelector('.modal.active');
                if (activeModal) {
                    hideModal(activeModal);
                }
            }
        });
    }

    // ==================== 主题配色 ====================
    function initThemeColorListeners() {
        const themeBtns = document.querySelectorAll('.theme-color-btn');
        themeBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                const theme = this.getAttribute('data-theme');
                applyTheme(theme);
                updateThemeActiveState(this);
            });
        });

        // 打开主题编辑器
        bindClick('open-theme-editor', function() {
            showModal(document.getElementById('theme-editor-modal'));
            initThemeEditor();
        });

        // 保存主题方案
        bindClick('save-theme-scheme-btn', function() {
            saveCurrentThemeScheme();
        });

        // 全局CSS
        bindClick('apply-global-css-btn', function() {
            applyGlobalCSS();
        });

        bindClick('reset-global-css-btn', function() {
            document.getElementById('custom-global-css').value = '';
            applyGlobalCSS();
        });

        const globalCssToggle = document.getElementById('global-css-live-toggle');
        if (globalCssToggle) {
            globalCssToggle.addEventListener('change', function() {
                if (this.checked) applyGlobalCSS();
            });
        }
    }

    // ==================== 字体设置 ====================
    function initFontListeners() {
        const fontSizeSlider = document.getElementById('font-size-slider');
        const fontSizeValue = document.getElementById('font-size-value');
        const customFontUrl = document.getElementById('custom-font-url');
        const applyFontBtn = document.getElementById('apply-font-btn');
        const followSystemFontBtn = document.getElementById('follow-system-font-btn');

        if (fontSizeSlider) {
            fontSizeSlider.addEventListener('input', function() {
                const size = this.value + 'px';
                if (fontSizeValue) fontSizeValue.textContent = size;
                document.documentElement.style.setProperty('--base-font-size', size);
                saveSetting('fontSize', this.value);
            });
        }

        if (applyFontBtn) {
            applyFontBtn.addEventListener('click', function() {
                const url = customFontUrl.value.trim();
                applyCustomFont(url);
            });
        }

        if (followSystemFontBtn) {
            followSystemFontBtn.addEventListener('click', function() {
                document.documentElement.style.removeProperty('--custom-font-family');
                if (customFontUrl) customFontUrl.value = '';
                saveSetting('customFontUrl', '');
                showNotification('已恢复系统字体 ✦', 'success');
            });
        }
    }

    // ==================== 气泡样式 ====================
    function initBubbleStyleListeners() {
        const bubbleItems = document.querySelectorAll('[data-bubble-style]');
        bubbleItems.forEach(function(item) {
            item.addEventListener('click', function() {
                const style = this.getAttribute('data-bubble-style');
                applyBubbleStyle(style);
                updateBubbleActiveState(this);
            });
        });

        // 气泡CSS
        bindClick('apply-css-btn', function() {
            applyBubbleCSS();
        });

        bindClick('reset-css-btn', function() {
            document.getElementById('custom-bubble-css').value = '';
            applyBubbleCSS();
        });
    }

    // ==================== 头像设置 ====================
    function initAvatarListeners() {
        // 显示聊天头像开关
        const avatarToggle = document.getElementById('in-chat-avatar-toggle-2');
        if (avatarToggle) {
            avatarToggle.addEventListener('click', function() {
                toggleInChatAvatar();
            });
        }

        // 每条消息显示头像开关
        const alwaysAvatarToggle = document.getElementById('always-avatar-toggle');
        if (alwaysAvatarToggle) {
            alwaysAvatarToggle.addEventListener('click', function() {
                toggleAlwaysAvatar();
            });
        }

        // 头像尺寸
        const avatarSizeSlider = document.getElementById('in-chat-avatar-size-slider-2');
        if (avatarSizeSlider) {
            avatarSizeSlider.addEventListener('input', function() {
                const size = this.value + 'px';
                document.getElementById('in-chat-avatar-size-value-2').textContent = size;
                document.documentElement.style.setProperty('--in-chat-avatar-size', size);
                saveSetting('inChatAvatarSize', this.value);
            });
        }

        // 头像对齐
        const avatarPosBtns = document.querySelectorAll('#avatar-pos-top-2, #avatar-pos-center-2, #avatar-pos-bottom-2, #avatar-pos-custom-2');
        avatarPosBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                const pos = this.getAttribute('data-pos');
                setAvatarPosition(pos);
                updateAvatarPosActiveState(this);
            });
        });

        // 头像形状
        const shapeBtns = document.querySelectorAll('.avatar-shape-btn-2');
        shapeBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                const shape = this.getAttribute('data-shape');
                setAvatarShape(shape);
                updateAvatarShapeActiveState(this);
            });
        });

        // 方形圆角
        const cornerSlider = document.getElementById('avatar-corner-radius-slider-2');
        if (cornerSlider) {
            cornerSlider.addEventListener('input', function() {
                const val = this.value + 'px';
                document.getElementById('avatar-corner-radius-value-2').textContent = val;
                document.documentElement.style.setProperty('--avatar-corner-radius', val);
                saveSetting('avatarCornerRadius', this.value);
            });
        }

        // 头像框上传
        initFrameUploadListeners();
    }

    function initFrameUploadListeners() {
        // 我的头像框
        bindClick('my-frame-upload-btn-2', function() {
            document.getElementById('my-frame-file-input-2').click();
        });

        bindClick('my-frame-url-btn-2', function() {
            const url = prompt('请输入头像框图片URL:');
            if (url) setMyFrame(url);
        });

        bindClick('my-frame-remove-btn-2', function() {
            removeMyFrame();
        });

        const myFrameInput = document.getElementById('my-frame-file-input-2');
        if (myFrameInput) {
            myFrameInput.addEventListener('change', function(e) {
                if (e.target.files[0]) uploadMyFrame(e.target.files[0]);
            });
        }

        // 头像框大小/偏移
        const myFrameSize = document.getElementById('my-frame-size-2');
        if (myFrameSize) {
            myFrameSize.addEventListener('input', function() {
                document.getElementById('my-frame-size-value-2').textContent = this.value + '%';
                updateFramePreview('my', 'size', this.value);
            });
        }

        const myFrameOffsetX = document.getElementById('my-frame-offset-x-2');
        if (myFrameOffsetX) {
            myFrameOffsetX.addEventListener('input', function() {
                document.getElementById('my-frame-offset-x-value-2').textContent = this.value + 'px';
                updateFramePreview('my', 'offsetX', this.value);
            });
        }

        const myFrameOffsetY = document.getElementById('my-frame-offset-y-2');
        if (myFrameOffsetY) {
            myFrameOffsetY.addEventListener('input', function() {
                document.getElementById('my-frame-offset-y-value-2').textContent = this.value + 'px';
                updateFramePreview('my', 'offsetY', this.value);
            });
        }

        // 梦角头像框
        bindClick('partner-frame-upload-btn-2', function() {
            document.getElementById('partner-frame-file-input-2').click();
        });

        bindClick('partner-frame-url-btn-2', function() {
            const url = prompt('请输入头像框图片URL:');
            if (url) setPartnerFrame(url);
        });

        bindClick('partner-frame-remove-btn-2', function() {
            removePartnerFrame();
        });

        const partnerFrameInput = document.getElementById('partner-frame-file-input-2');
        if (partnerFrameInput) {
            partnerFrameInput.addEventListener('change', function(e) {
                if (e.target.files[0]) uploadPartnerFrame(e.target.files[0]);
            });
        }

        const partnerFrameSize = document.getElementById('partner-frame-size-2');
        if (partnerFrameSize) {
            partnerFrameSize.addEventListener('input', function() {
                document.getElementById('partner-frame-size-value-2').textContent = this.value + '%';
                updateFramePreview('partner', 'size', this.value);
            });
        }

        const partnerFrameOffsetX = document.getElementById('partner-frame-offset-x-2');
        if (partnerFrameOffsetX) {
            partnerFrameOffsetX.addEventListener('input', function() {
                document.getElementById('partner-frame-offset-x-value-2').textContent = this.value + 'px';
                updateFramePreview('partner', 'offsetX', this.value);
            });
        }

        const partnerFrameOffsetY = document.getElementById('partner-frame-offset-y-2');
        if (partnerFrameOffsetY) {
            partnerFrameOffsetY.addEventListener('input', function() {
                document.getElementById('partner-frame-offset-y-value-2').textContent = this.value + 'px';
                updateFramePreview('partner', 'offsetY', this.value);
            });
        }
    }

    // ==================== 字卡拼接 ====================
    function initCardConcatListeners() {
        // 主开关
        const toggle = document.getElementById('card-concat-toggle');
        if (toggle) {
            toggle.addEventListener('click', function() {
                const settings = getCardConcatSettings();
                settings.enabled = !settings.enabled;
                saveCardConcatSettings(settings);
                updateCardConcatUI();
            });
        }

        // 最少条数
        const minSlider = document.getElementById('card-concat-min-slider');
        if (minSlider) {
            minSlider.addEventListener('input', function() {
                const settings = getCardConcatSettings();
                settings.minCards = parseInt(this.value);
                if (settings.minCards > settings.maxCards) {
                    settings.maxCards = settings.minCards;
                    const maxSlider = document.getElementById('card-concat-max-slider');
                    if (maxSlider) maxSlider.value = settings.maxCards;
                }
                saveCardConcatSettings(settings);
                updateCardConcatUI();
            });
        }

        // 最多条数
        const maxSlider = document.getElementById('card-concat-max-slider');
        if (maxSlider) {
            maxSlider.addEventListener('input', function() {
                const settings = getCardConcatSettings();
                settings.maxCards = parseInt(this.value);
                saveCardConcatSettings(settings);
                updateCardConcatUI();
            });
        }

        // 概率
        const probSlider = document.getElementById('card-concat-prob-slider');
        if (probSlider) {
            probSlider.addEventListener('input', function() {
                const settings = getCardConcatSettings();
                settings.probability = parseInt(this.value);
                saveCardConcatSettings(settings);
                updateCardConcatUI();
            });
        }

        // 朋友圈开关
        const momentToggle = document.getElementById('card-concat-moment-toggle');
        if (momentToggle) {
            momentToggle.addEventListener('click', function() {
                const settings = getCardConcatSettings();
                settings.momentEnabled = !settings.momentEnabled;
                saveCardConcatSettings(settings);
                updateCardConcatUI();
                if (settings.momentEnabled) {
                    startMomentTimer();
                } else {
                    stopMomentTimer();
                }
            });
        }

        // 朋友圈间隔
        const intervalSlider = document.getElementById('card-concat-moment-interval-slider');
        if (intervalSlider) {
            intervalSlider.addEventListener('input', function() {
                const settings = getCardConcatSettings();
                settings.momentInterval = parseInt(this.value);
                saveCardConcatSettings(settings);
                updateCardConcatUI();
                restartMomentTimer();
            });
        }

        // 朋友圈最少字卡
        const momentMinSlider = document.getElementById('card-concat-moment-min-slider');
        if (momentMinSlider) {
            momentMinSlider.addEventListener('input', function() {
                const settings = getCardConcatSettings();
                settings.momentMinCards = parseInt(this.value);
                if (settings.momentMinCards > settings.momentMaxCards) {
                    settings.momentMaxCards = settings.momentMinCards;
                    const maxSlider = document.getElementById('card-concat-moment-max-slider');
                    if (maxSlider) maxSlider.value = settings.momentMaxCards;
                }
                saveCardConcatSettings(settings);
                updateCardConcatUI();
            });
        }

        // 朋友圈最多字卡
        const momentMaxSlider = document.getElementById('card-concat-moment-max-slider');
        if (momentMaxSlider) {
            momentMaxSlider.addEventListener('input', function() {
                const settings = getCardConcatSettings();
                settings.momentMaxCards = parseInt(this.value);
                saveCardConcatSettings(settings);
                updateCardConcatUI();
            });
        }

        // 朋友圈图片概率
        const imgProbSlider = document.getElementById('card-concat-moment-img-prob-slider');
        if (imgProbSlider) {
            imgProbSlider.addEventListener('input', function() {
                const settings = getCardConcatSettings();
                settings.momentImgProbability = parseInt(this.value);
                saveCardConcatSettings(settings);
                updateCardConcatUI();
            });
        }
    }

    // ==================== 朋友圈系统 ====================
    function initMomentListeners() {
        // 顶部导航栏朋友圈按钮
        bindClick('moment-header-btn', function() {
            openMomentModal();
        });

        // 发布动态
        bindClick('publish-moment-btn', function() {
            openPublishMoment();
        });

        // 朋友圈设置
        bindClick('moment-settings-btn', function() {
            openMomentSettings();
        });

        // 封面更换
        const coverInput = document.getElementById('moment-cover-input');
        if (coverInput) {
            coverInput.addEventListener('change', function(e) {
                if (e.target.files[0]) {
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        localStorage.setItem('momentCover', event.target.result);
                        updateMomentCover();
                        showNotification('封面已更新 ✦', 'success');
                    };
                    reader.readAsDataURL(e.target.files[0]);
                }
            });
        }

        // 发布动态图片
        const momentImgInput = document.getElementById('moment-image-input');
        if (momentImgInput) {
            momentImgInput.addEventListener('change', function(e) {
                handleMomentImageSelect(e.target.files);
            });
        }
    }

    // ==================== 音效设置 ====================
    function initSoundListeners() {
        // 音效总开关
        const soundToggle = document.getElementById('sound-toggle');
        if (soundToggle) {
            soundToggle.addEventListener('click', function() {
                toggleSoundEnabled();
            });
        }

        // 音量
        const volumeSlider = document.getElementById('sound-volume-slider');
        if (volumeSlider) {
            volumeSlider.addEventListener('input', function() {
                const val = this.value;
                document.getElementById('sound-volume-value').textContent = val + '%';
                setSoundVolume(val / 100);
            });
        }

        // 各场景音效预设
        initSoundPresetListeners('my-send');
        initSoundPresetListeners('partner-message');
        initSoundPresetListeners('my-poke');
        initSoundPresetListeners('partner-poke');
        initSoundPresetListeners('invite-study');
        initSoundPresetListeners('invite-work');
        initSoundPresetListeners('invite-exercise');
        initSoundPresetListeners('invite-sleep');
        initSoundPresetListeners('invite-videocall');
    }

    function initSoundPresetListeners(prefix) {
        const presetSelect = document.getElementById('sound-' + prefix + '-preset');
        const testBtn = document.getElementById('test-sound-' + prefix + '-btn');
        const customUrl = document.getElementById('sound-' + prefix + '-custom-url');
        const uploadBtn = document.getElementById('upload-sound-' + prefix + '-btn');
        const fileInput = document.getElementById('upload-sound-' + prefix + '-file');

        if (presetSelect) {
            presetSelect.addEventListener('change', function() {
                saveSoundSetting(prefix, 'preset', this.value);
            });
        }

        if (testBtn) {
            testBtn.addEventListener('click', function() {
                testSound(prefix);
            });
        }

        if (customUrl) {
            customUrl.addEventListener('change', function() {
                saveSoundSetting(prefix, 'customUrl', this.value);
            });
        }

        if (uploadBtn && fileInput) {
            uploadBtn.addEventListener('click', function() {
                fileInput.click();
            });
            fileInput.addEventListener('change', function(e) {
                if (e.target.files[0]) {
                    uploadCustomSound(prefix, e.target.files[0]);
                }
            });
        }
    }

    // ==================== 节奏设置 ====================
    function initRhythmListeners() {
        // 回复速度
        const minDelaySlider = document.getElementById('reply-delay-min-slider');
        if (minDelaySlider) {
            minDelaySlider.addEventListener('input', function() {
                const val = this.value;
                document.getElementById('reply-delay-min-value').textContent = (val / 1000) + 's';
                saveSetting('replyDelayMin', parseInt(val));
            });
        }

        const maxDelaySlider = document.getElementById('reply-delay-max-slider');
        if (maxDelaySlider) {
            maxDelaySlider.addEventListener('input', function() {
                const val = this.value;
                document.getElementById('reply-delay-max-value').textContent = (val / 1000) + 's';
                saveSetting('replyDelayMax', parseInt(val));
            });
        }

        // 主动发送
        const autoSendToggle = document.getElementById('auto-send-toggle');
        if (autoSendToggle) {
            autoSendToggle.addEventListener('click', function() {
                toggleAutoSend();
            });
        }

        const autoSendSlider = document.getElementById('auto-send-slider');
        if (autoSendSlider) {
            autoSendSlider.addEventListener('input', function() {
                const val = this.value;
                document.getElementById('auto-send-value').textContent = val + '分钟';
                saveSetting('autoSendInterval', parseInt(val));
            });
        }

        // 表情混入
        const emojiMixToggle = document.getElementById('emoji-mix-toggle');
        if (emojiMixToggle) {
            emojiMixToggle.addEventListener('click', function() {
                toggleEmojiMix();
            });
        }
    }

    // ==================== 显示设置 ====================
    function initDisplayListeners() {
        // 沉浸式模式
        const immersiveToggle = document.getElementById('immersive-toggle');
        if (immersiveToggle) {
            immersiveToggle.addEventListener('click', function() {
                toggleImmersiveMode();
            });
        }

        // 底部栏收纳
        const bottomCollapseToggle = document.getElementById('bottom-collapse-cs-toggle');
        if (bottomCollapseToggle) {
            bottomCollapseToggle.addEventListener('click', function() {
                window._toggleBottomCollapse && window._toggleBottomCollapse();
            });
        }

        // 顶部栏常驻清晰
        const headerOpacityToggle = document.getElementById('header-opacity-toggle');
        if (headerOpacityToggle) {
            headerOpacityToggle.addEventListener('click', function() {
                window._toggleHeaderOpacity && window._toggleHeaderOpacity();
            });
        }

        // 戳一戳装饰符号
        const pokeSymbolToggle = document.getElementById('poke-symbol-toggle');
        if (pokeSymbolToggle) {
            pokeSymbolToggle.addEventListener('click', function() {
                window._openPokeSymSettings && window._openPokeSymSettings();
            });
        }
    }

    // ==================== 昵称设置 ====================
    function initNameListeners() {
        // 修改梦角名称
        bindClick('edit-partner-name-btn', function() {
            const modal = document.getElementById('edit-modal');
            const title = modal.querySelector('#edit-modal-title');
            const input = modal.querySelector('#name-input');
            const saveBtn = modal.querySelector('#save-name');

            title.textContent = '修改梦角的昵称';
            input.value = settings.partnerName || '梦角';
            saveBtn.disabled = !input.value.trim();

            saveBtn.onclick = function() {
                const name = input.value.trim();
                if (name) {
                    settings.partnerName = name;
                    document.querySelectorAll('.username[data-role=partner], .partner-name, .contact-name').forEach(function(el) {
                        el.textContent = name;
                    });
                    throttledSaveData && throttledSaveData();
                    updateUI && updateUI();
                    showNotification('梦角昵称已更新为「' + name + '」✦', 'success');
                }
                hideModal(modal);
            };
            showModal(modal, input);
        });

        // 修改我方名称
        bindClick('edit-my-name-btn', function() {
            const modal = document.getElementById('edit-modal');
            const title = modal.querySelector('#edit-modal-title');
            const input = modal.querySelector('#name-input');
            const saveBtn = modal.querySelector('#save-name');

            title.textContent = '修改我的昵称';
            input.value = settings.myName || '我';
            saveBtn.disabled = !input.value.trim();

            saveBtn.onclick = function() {
                const name = input.value.trim();
                if (name) {
                    settings.myName = name;
                    throttledSaveData && throttledSaveData();
                    updateUI && updateUI();
                    showNotification('我的昵称已更新为「' + name + '」✦', 'success');
                }
                hideModal(modal);
            };
            showModal(modal, input);
        });
    }

    // ==================== 消息统计 ====================
    function initStatsListeners() {
        bindClick('close-stats', function() {
            hideModal(document.getElementById('stats-modal'));
        });

        // 统计标签切换
        const statsTabBtns = document.querySelectorAll('.stats-nav-btn');
        statsTabBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                const tab = this.getAttribute('data-tab');
                switchStatsTab(tab);
            });
        });
    }

    // ==================== 心情手账 ====================
    function initMoodListeners() {
        bindClick('close-mood', function() {
            hideModal(document.getElementById('mood-modal'));
        });

        bindClick('mood-export-btn', function() {
            exportMoodData();
        });

        bindClick('mood-import-btn', function() {
            document.getElementById('mood-import-file-input').click();
        });

        const moodImportInput = document.getElementById('mood-import-file-input');
        if (moodImportInput) {
            moodImportInput.addEventListener('change', function(e) {
                if (e.target.files[0]) importMoodData(e.target.files[0]);
            });
        }

        // 日历导航
        bindClick('prev-month', function() {
            navigateCalendar(-1);
        });

        bindClick('next-month', function() {
            navigateCalendar(1);
        });

        // 视图切换
        bindClick('btn-view-calendar', function() {
            switchMoodView('calendar');
        });

        bindClick('btn-view-stats', function() {
            switchMoodView('stats');
        });

        bindClick('btn-view-trash', function() {
            switchMoodView('trash');
        });
    }

    // ==================== 信封投递 ====================
    function initEnvelopeListeners() {
        bindClick('envelope-header-btn', function() {
            showModal(document.getElementById('envelope-modal'));
            renderEnvelopeList();
        });

        bindClick('cancel-envelope', function() {
            hideModal(document.getElementById('envelope-modal'));
        });

        bindClick('new-envelope-btn', function() {
            openNewEnvelopeForm();
        });

        bindClick('send-envelope', function() {
            sendEnvelope();
        });

        bindClick('close-env-view', function() {
            closeEnvViewModal();
        });
    }

    // ==================== 陪伴功能 ====================
    function initCompanionListeners() {
        bindClick('companion-btn', function() {
            showModal(document.getElementById('companion-modal'));
        });

        bindClick('companion-modal-close', function() {
            hideModal(document.getElementById('companion-modal'));
        });

        // 陪伴模式选择
        const modeCards = document.querySelectorAll('.companion-mode-card');
        modeCards.forEach(function(card) {
            card.addEventListener('click', function() {
                const mode = this.getAttribute('data-mode');
                selectCompanionMode(mode);
            });
        });

        // 设置弹窗
        bindClick('setup-btn-cancel', function() {
            hideModal(document.getElementById('setup-modal'));
        });

        bindClick('setup-btn-next', function() {
            showSetupStep('voice');
        });

        bindClick('setup-btn-skip', function() {
            finishCompanionSetup();
        });

        bindClick('setup-btn-finish', function() {
            finishCompanionSetup();
        });

        // 时间选择
        bindClick('time-modal-close', function() {
            hideModal(document.getElementById('time-modal'));
        });

        // 陪伴页面控制
        bindClick('companion-exit-btn', function() {
            showExitConfirm();
        });

        bindClick('exit-confirm-no', function() {
            hideExitConfirm();
        });

        bindClick('exit-confirm-yes', function() {
            exitCompanionMode();
        });

        bindClick('companion-noise-btn', function() {
            toggleCompanionNoise();
        });

        bindClick('companion-history-btn', function() {
            toggleCompanionHistory();
        });

        bindClick('companion-keyboard-btn', function() {
            toggleCompanionInput();
        });
    }

    // ==================== 群聊设置 ====================
    function initGroupChatListeners() {
        bindClick('group-chat-btn', function() {
            showModal(document.getElementById('group-chat-modal'));
            renderGroupMembers();
        });

        bindClick('close-group-chat', function() {
            hideModal(document.getElementById('group-chat-modal'));
        });

        // 群聊模式开关
        const groupModeToggle = document.getElementById('group-mode-toggle');
        if (groupModeToggle) {
            groupModeToggle.addEventListener('click', function() {
                toggleGroupMode();
            });
        }

        // 显示成员名称
        const showNameToggle = document.getElementById('group-show-name-toggle');
        if (showNameToggle) {
            showNameToggle.addEventListener('click', function() {
                toggleGroupShowName();
            });
        }
    }

    // ==================== 通话功能 ====================
    function initCallListeners() {
        // 通话功能开关
        const callToggle = document.getElementById('call-feature-toggle-row');
        if (callToggle) {
            callToggle.addEventListener('click', function() {
                toggleCallFeature();
            });
        }
    }

    // ==================== 音乐播放器 ====================
    function initMusicPlayerListeners() {
        const player = document.getElementById('player');
        const miniView = document.getElementById('mini-view');
        const minimizeBtn = document.getElementById('minimize-btn');
        const playBtn = document.getElementById('play-btn');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const modeBtn = document.getElementById('mode-btn');
        const listBtn = document.getElementById('list-btn');
        const progressArea = document.getElementById('progress-area');

        if (miniView) {
            miniView.addEventListener('click', function() {
                player.classList.add('expanded');
            });
        }

        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                player.classList.remove('expanded');
            });
        }

        if (playBtn) {
            playBtn.addEventListener('click', function() {
                togglePlay();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                playPrevious();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                playNext();
            });
        }

        if (modeBtn) {
            modeBtn.addEventListener('click', function() {
                cyclePlayMode();
            });
        }

        if (listBtn) {
            listBtn.addEventListener('click', function() {
                togglePlaylist();
            });
        }

        if (progressArea) {
            progressArea.addEventListener('click', function(e) {
                seekTo(e);
            });
        }

        // 添加歌曲
        bindClick('confirm-add-song', function() {
            addCustomSong();
        });

        bindClick('cancel-add-song', function() {
            hideModal(document.getElementById('add-song-modal'));
        });
    }

    // ==================== 底部栏收纳 ====================
    function initCollapseListeners() {
        // 收纳面板中的按钮
        const collapsedBtns = document.querySelectorAll('.collapsed-extra-btn');
        collapsedBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                const action = this.getAttribute('onclick');
                if (action) {
                    // 执行内联onclick中的逻辑
                    eval(action);
                }
            });
        });
    }

    // ==================== 辅助函数 ====================
    function bindClick(id, handler) {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('click', handler);
        }
    }

    // ==================== 字卡拼接功能 ====================
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

    function getCardConcatSettings() {
        try {
            const saved = localStorage.getItem('cardConcatSettings');
            if (saved) {
                return Object.assign({}, defaultCardConcatSettings, JSON.parse(saved));
            }
        } catch (e) {}
        return Object.assign({}, defaultCardConcatSettings);
    }

    function saveCardConcatSettings(settings) {
        localStorage.setItem('cardConcatSettings', JSON.stringify(settings));
    }

    function updateCardConcatUI() {
        const settings = getCardConcatSettings();

        // 主开关
        const toggle = document.getElementById('card-concat-toggle');
        const control = document.getElementById('card-concat-control');
        if (toggle) {
            const switchEl = toggle.querySelector('.setting-pill-switch');
            const knob = toggle.querySelector('.setting-pill-knob');
            if (switchEl) switchEl.style.background = settings.enabled ? 'var(--accent-color)' : 'var(--border-color)';
            if (knob) knob.style.left = settings.enabled ? '23px' : '3px';
            if (control) control.style.display = settings.enabled ? 'block' : 'none';
        }

        // 最少条数
        const minSlider = document.getElementById('card-concat-min-slider');
        const minValue = document.getElementById('card-concat-min-value');
        if (minSlider) minSlider.value = settings.minCards;
        if (minValue) minValue.textContent = settings.minCards + '条';

        // 最多条数
        const maxSlider = document.getElementById('card-concat-max-slider');
        const maxValue = document.getElementById('card-concat-max-value');
        if (maxSlider) maxSlider.value = settings.maxCards;
        if (maxValue) maxValue.textContent = settings.maxCards + '条';

        // 概率
        const probSlider = document.getElementById('card-concat-prob-slider');
        const probValue = document.getElementById('card-concat-prob-value');
        if (probSlider) probSlider.value = settings.probability;
        if (probValue) probValue.textContent = settings.probability + '%';

        // 朋友圈开关
        const momentToggle = document.getElementById('card-concat-moment-toggle');
        const momentControl = document.getElementById('card-concat-moment-control');
        if (momentToggle) {
            const switchEl = momentToggle.querySelector('.setting-pill-switch');
            const knob = momentToggle.querySelector('.setting-pill-knob');
            if (switchEl) switchEl.style.background = settings.momentEnabled ? 'var(--accent-color)' : 'var(--border-color)';
            if (knob) knob.style.left = settings.momentEnabled ? '23px' : '3px';
            if (momentControl) momentControl.style.display = settings.momentEnabled ? 'block' : 'none';
        }

        // 朋友圈间隔
        const intervalSlider = document.getElementById('card-concat-moment-interval-slider');
        const intervalValue = document.getElementById('card-concat-moment-interval-value');
        if (intervalSlider) intervalSlider.value = settings.momentInterval;
        if (intervalValue) intervalValue.textContent = settings.momentInterval + '分钟';

        // 朋友圈最少字卡
        const momentMinSlider = document.getElementById('card-concat-moment-min-slider');
        const momentMinValue = document.getElementById('card-concat-moment-min-value');
        if (momentMinSlider) momentMinSlider.value = settings.momentMinCards;
        if (momentMinValue) momentMinValue.textContent = settings.momentMinCards + '条';

        // 朋友圈最多字卡
        const momentMaxSlider = document.getElementById('card-concat-moment-max-slider');
        const momentMaxValue = document.getElementById('card-concat-moment-max-value');
        if (momentMaxSlider) momentMaxSlider.value = settings.momentMaxCards;
        if (momentMaxValue) momentMaxValue.textContent = settings.momentMaxCards + '条';

        // 朋友圈图片概率
        const imgProbSlider = document.getElementById('card-concat-moment-img-prob-slider');
        const imgProbValue = document.getElementById('card-concat-moment-img-prob-value');
        if (imgProbSlider) imgProbSlider.value = settings.momentImgProbability;
        if (imgProbValue) imgProbValue.textContent = settings.momentImgProbability + '%';
    }

    function initCardConcatUI() {
        updateCardConcatUI();
    }

    // 从字卡库随机抽取
    function drawRandomCards(count, library) {
        if (!library || library.length === 0) return [];
        const shuffled = library.slice().sort(function() { return Math.random() - 0.5; });
        return shuffled.slice(0, Math.min(count, shuffled.length));
    }

    // 拼接字卡为一句话
    function concatCards(cards) {
        if (!cards || cards.length === 0) return '';
        const connectors = ['，', '。', '！', '？', '……', '；', ''];
        let result = '';
        cards.forEach(function(card, index) {
            let text = typeof card === 'string' ? card : (card.text || card.content || '');
            if (!text) return;
            text = text.replace(/^[，。！？…；]+|[，。！？…；]+$/g, '');
            if (index === 0) {
                result = text;
            } else {
                const connector = connectors[Math.floor(Math.random() * connectors.length)];
                result += connector + text;
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
                    return data.reply.main.filter(function(item) {
                        return item && (typeof item === 'string' ? item.trim() : (item.text || item.content));
                    });
                }
            }
        } catch (e) {}
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

        return {
            text: text,
            hasImage: hasImage,
            images: []
        };
    }

    // ==================== 朋友圈系统 ====================
    let momentTimer = null;

    function getMoments() {
        try {
            const saved = localStorage.getItem('moments');
            if (saved) return JSON.parse(saved);
        } catch (e) {}
        return [];
    }

    function saveMoments(moments) {
        localStorage.setItem('moments', JSON.stringify(moments));
    }

    function openMomentModal() {
        const modal = document.getElementById('moment-modal');
        if (modal) {
            renderMomentList();
            showModal(modal);
        }
    }

    function openPublishMoment() {
        const modal = document.getElementById('publish-moment-modal');
        if (modal) {
            showModal(modal);
            // 清空输入
            const input = document.getElementById('moment-content-input');
            if (input) input.value = '';
            const preview = document.getElementById('moment-image-preview');
            if (preview) {
                preview.innerHTML = '';
                preview.style.display = 'none';
            }
        }
    }

    function openMomentSettings() {
        const modal = document.getElementById('moment-settings-modal');
        if (modal) {
            // 加载当前设置
            const signature = localStorage.getItem('momentSignature') || '';
            const sigInput = document.getElementById('moment-signature-input');
            if (sigInput) sigInput.value = signature;
            showModal(modal);
        }
    }

    function saveMomentSettings() {
        const signature = document.getElementById('moment-signature-input');
        if (signature) {
            localStorage.setItem('momentSignature', signature.value);
        }
        hideModal(document.getElementById('moment-settings-modal'));
        showNotification('设置已保存 ✦', 'success');
    }

    function publishMoment() {
        const contentInput = document.getElementById('moment-content-input');
        const text = contentInput ? contentInput.value.trim() : '';
        if (!text) {
            showNotification('请输入内容', 'warning');
            return;
        }

        const moments = getMoments();
        moments.unshift({
            id: Date.now(),
            author: 'me',
            authorName: settings.myName || '我',
            text: text,
            images: window._momentSelectedImages || [],
            likes: [],
            comments: [],
            timestamp: Date.now()
        });
        saveMoments(moments);

        if (contentInput) contentInput.value = '';
        window._momentSelectedImages = [];
        const preview = document.getElementById('moment-image-preview');
        if (preview) {
            preview.innerHTML = '';
            preview.style.display = 'none';
        }

        hideModal(document.getElementById('publish-moment-modal'));
        renderMomentList();
        showNotification('动态发布成功 ✦', 'success');
    }

    function handleMomentImageSelect(files) {
        if (!files || files.length === 0) return;
        window._momentSelectedImages = window._momentSelectedImages || [];

        Array.from(files).forEach(function(file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                window._momentSelectedImages.push(e.target.result);
                updateMomentImagePreview();
            };
            reader.readAsDataURL(file);
        });
    }

    function updateMomentImagePreview() {
        const preview = document.getElementById('moment-image-preview');
        if (!preview) return;

        const images = window._momentSelectedImages || [];
        if (images.length === 0) {
            preview.style.display = 'none';
            return;
        }

        preview.style.display = 'flex';
        preview.innerHTML = images.map(function(img, idx) {
            return '<div style="position:relative;">' +
                '<img src="' + img + '" style="width:60px;height:60px;object-fit:cover;border-radius:8px;">' +
                '<button onclick="removeMomentImage(' + idx + ')" style="position:absolute;top:-4px;right:-4px;width:18px;height:18px;border-radius:50%;background:#ff6b6b;color:#fff;border:none;font-size:10px;cursor:pointer;">×</button>' +
                '</div>';
        }).join('');
    }

    window.removeMomentImage = function(idx) {
        if (window._momentSelectedImages) {
            window._momentSelectedImages.splice(idx, 1);
            updateMomentImagePreview();
        }
    };

    function renderMomentList() {
        const list = document.getElementById('moment-list');
        if (!list) return;

        const moments = getMoments();
        const partnerName = settings.partnerName || '梦角';

        if (moments.length === 0) {
            list.innerHTML = '<div class="moment-empty">' +
                '<i class="fas fa-camera-retro"></i>' +
                '<p>还没有动态</p>' +
                '<p style="font-size:12px;opacity:0.6;">发布你的第一条朋友圈吧</p>' +
                '</div>';
            return;
        }

        list.innerHTML = moments.map(function(moment) {
            const date = new Date(moment.timestamp);
            const timeStr = date.getFullYear() + '-' +
                String(date.getMonth() + 1).padStart(2, '0') + '-' +
                String(date.getDate()).padStart(2, '0') + ' ' +
                String(date.getHours()).padStart(2, '0') + ':' +
                String(date.getMinutes()).padStart(2, '0');

            let imagesHtml = '';
            if (moment.images && moment.images.length > 0) {
                const imgClass = moment.images.length === 1 ? 'single' :
                    (moment.images.length === 2 ? 'double' : 'multiple');
                imagesHtml = '<div class="moment-item-images ' + imgClass + '">' +
                    moment.images.map(function(img) {
                        return '<img src="' + img + '" onclick="window.open(\'' + img + '\')">';
                    }).join('') +
                    '</div>';
            }

            const isLiked = moment.likes && moment.likes.indexOf('me') > -1;
            const likeCount = moment.likes ? moment.likes.length : 0;
            const commentCount = moment.comments ? moment.comments.length : 0;

            let commentsHtml = '';
            if (moment.comments && moment.comments.length > 0) {
                commentsHtml = '<div class="moment-comments">' +
                    moment.comments.map(function(c) {
                        return '<div class="moment-comment-item">' +
                            '<span class="moment-comment-name">' + c.name + ':</span> ' + c.text +
                            '</div>';
                    }).join('') +
                    '</div>';
            }

            const isPartner = moment.author === 'partner';
            const avatarIcon = isPartner ?
                '<i class="fas fa-user" style="color:var(--accent-color);"></i>' :
                '<i class="fas fa-user-circle" style="color:var(--text-secondary);"></i>';

            return '<div class="moment-item" data-id="' + moment.id + '">' +
                '<div class="moment-item-avatar">' + avatarIcon + '</div>' +
                '<div class="moment-item-content">' +
                '<div class="moment-item-name">' + (moment.authorName || (isPartner ? partnerName : '我')) + '</div>' +
                '<div class="moment-item-text">' + moment.text + '</div>' +
                imagesHtml +
                '<div class="moment-item-meta">' +
                '<span>' + timeStr + '</span>' +
                '<div class="moment-item-actions">' +
                '<button class="' + (isLiked ? 'liked' : '') + '" onclick="toggleLikeMoment(' + moment.id + ')">' +
                '<i class="fas fa-heart"></i> ' + likeCount +
                '</button>' +
                '<button onclick="commentMoment(' + moment.id + ')">' +
                '<i class="fas fa-comment"></i> ' + commentCount +
                '</button>' +
                '</div>' +
                '</div>' +
                commentsHtml +
                '</div>' +
                '</div>';
        }).join('');
    }

    function updateMomentCover() {
        const cover = localStorage.getItem('momentCover');
        const coverEl = document.getElementById('moment-cover-bg');
        if (coverEl && cover) {
            coverEl.style.backgroundImage = 'url(' + cover + ')';
        }
    }

    function initMomentSystem() {
        updateMomentCover();
        const settings = getCardConcatSettings();
        if (settings.momentEnabled) {
            startMomentTimer();
        }
    }

    function startMomentTimer() {
        stopMomentTimer();
        const settings = getCardConcatSettings();
        if (!settings.momentEnabled) return;

        const intervalMs = settings.momentInterval * 60 * 1000;
        momentTimer = setInterval(function() {
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
        const partnerName = settings.partnerName || '梦角';
        const newMoment = {
            id: Date.now(),
            author: 'partner',
            authorName: partnerName,
            text: content.text,
            images: content.images || [],
            likes: [],
            comments: [],
            timestamp: Date.now()
        };
        moments.unshift(newMoment);
        saveMoments(moments);

        // 刷新朋友圈列表
        const modal = document.getElementById('moment-modal');
        if (modal && modal.classList.contains('active')) {
            renderMomentList();
        }

        showNotification(partnerName + '发布了新动态 ✦', 'info');
    }

    // 全局暴露函数
    window.getCardConcatSettings = getCardConcatSettings;
    window.saveCardConcatSettings = saveCardConcatSettings;
    window.generateConcatMessage = generateConcatMessage;
    window.generateMomentConcatContent = generateMomentConcatContent;
    window.initCardConcatUI = initCardConcatUI;
    window.startMomentTimer = startMomentTimer;
    window.stopMomentTimer = stopMomentTimer;
    window.getMoments = getMoments;
    window.saveMoments = saveMoments;
    window.renderMomentList = renderMomentList;
    window.autoPublishMoment = autoPublishMoment;
    window.openMomentModal = openMomentModal;
    window.openPublishMoment = openPublishMoment;
    window.openMomentSettings = openMomentSettings;
    window.saveMomentSettings = saveMomentSettings;
    window.publishMoment = publishMoment;
    window.updateMomentCover = updateMomentCover;

    window.toggleLikeMoment = function(momentId) {
        const moments = getMoments();
        const moment = moments.find(function(m) { return m.id === momentId; });
        if (!moment) return;
        if (!moment.likes) moment.likes = [];
        const idx = moment.likes.indexOf('me');
        if (idx > -1) {
            moment.likes.splice(idx, 1);
        } else {
            moment.likes.push('me');
        }
        saveMoments(moments);
        renderMomentList();
    };

    window.commentMoment = function(momentId) {
        const text = prompt('输入评论:');
        if (!text || !text.trim()) return;
        const moments = getMoments();
        const moment = moments.find(function(m) { return m.id === momentId; });
        if (!moment) return;
        if (!moment.comments) moment.comments = [];
        moment.comments.push({
            name: settings.myName || '我',
            text: text.trim(),
            timestamp: Date.now()
        });
        saveMoments(moments);
        renderMomentList();
    };

})();
