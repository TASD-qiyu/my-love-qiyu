/**
 * mood.js - 心晴手账 (Mood Tracker)
 * 功能：日历心情记录、统计、回收站、双角色支持
 */

(function() {
    'use strict';

    // ==================== 默认配置 ====================
    const DEFAULT_MOODS = [
        { emoji: '😊', label: '开心', color: '#FFD93D' },
        { emoji: '🥰', label: '幸福', color: '#FF6B9D' },
        { emoji: '😌', label: '平静', color: '#A8E6CF' },
        { emoji: '😴', label: '困倦', color: '#B4A7D6' },
        { emoji: '😢', label: '难过', color: '#74B9FF' },
        { emoji: '😤', label: '生气', color: '#FF7675' },
        { emoji: '😰', label: '焦虑', color: '#FAB1A0' },
        { emoji: '🤔', label: '思考', color: '#81ECEC' },
        { emoji: '😎', label: '酷', color: '#55EFC4' },
        { emoji: '🥺', label: '委屈', color: '#DDA0DD' },
        { emoji: '😍', label: '喜欢', color: '#FF69B4' },
        { emoji: '🤗', label: '温暖', color: '#FDCB6E' }
    ];

    const MOOD_COLORS = [
        '#FFD93D', '#FF6B9D', '#A8E6CF', '#B4A7D6',
        '#74B9FF', '#FF7675', '#FAB1A0', '#81ECEC',
        '#55EFC4', '#DDA0DD', '#FF69B4', '#FDCB6E',
        '#00B894', '#E17055', '#636E72', '#B2BEC3'
    ];

    // ==================== 状态管理 ====================
    let moodData = {};
    let customMoods = [];
    let deletedMoods = [];
    let currentMoodPage = 1;
    let selectedDateStr = null;
    let currentEditTarget = 'me';
    let currentViewMonth = new Date();

    // ==================== 数据持久化 ====================
    function loadMoodData() {
        try {
            const saved = localStorage.getItem('moodData');
            if (saved) moodData = JSON.parse(saved);
        } catch(e) { moodData = {}; }
        try {
            const savedCustom = localStorage.getItem('customMoods');
            if (savedCustom) customMoods = JSON.parse(savedCustom);
        } catch(e) { customMoods = []; }
        try {
            const savedDeleted = localStorage.getItem('deletedMoods');
            if (savedDeleted) deletedMoods = JSON.parse(savedDeleted);
        } catch(e) { deletedMoods = []; }
    }

    function saveMoodData() {
        localStorage.setItem('moodData', JSON.stringify(moodData));
        localStorage.setItem('customMoods', JSON.stringify(customMoods));
        localStorage.setItem('deletedMoods', JSON.stringify(deletedMoods));
    }

    // ==================== 工具函数 ====================
    function getDateStr(date) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    function getMonthLabel(date) {
        return `${date.getFullYear()}年${date.getMonth() + 1}月`;
    }

    function getAllMoods() {
        return [...DEFAULT_MOODS, ...customMoods];
    }

    function getMoodRecord(dateStr, target) {
        if (!moodData[dateStr]) return null;
        return moodData[dateStr][target] || null;
    }

    function setMoodRecord(dateStr, target, record) {
        if (!moodData[dateStr]) moodData[dateStr] = {};
        moodData[dateStr][target] = record;
        saveMoodData();
    }

    // ==================== 日历渲染 ====================
    function renderCalendar() {
        const grid = document.getElementById('calendar-grid');
        const label = document.getElementById('calendar-month-label');
        if (!grid || !label) return;

        label.textContent = getMonthLabel(currentViewMonth);
        grid.innerHTML = '';

        const year = currentViewMonth.getFullYear();
        const month = currentViewMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startOffset = firstDay.getDay();
        const daysInMonth = lastDay.getDate();

        // 空白占位
        for (let i = 0; i < startOffset; i++) {
            const empty = document.createElement('div');
            empty.className = 'calendar-day empty';
            grid.appendChild(empty);
        }

        const todayStr = getDateStr(new Date());

        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const cell = document.createElement('div');
            cell.className = 'calendar-day';
            if (dateStr === todayStr) cell.classList.add('today');

            const dayNum = document.createElement('span');
            dayNum.className = 'day-number';
            dayNum.textContent = day;
            cell.appendChild(dayNum);

            // 渲染心情标记
            const record = moodData[dateStr];
            if (record) {
                const moodContainer = document.createElement('div');
                moodContainer.className = 'day-moods';

                ['me', 'partner'].forEach(target => {
                    if (record[target]) {
                        const mood = getAllMoods().find(m => m.label === record[target].label) || 
                                     { emoji: record[target].emoji || '😊', color: record[target].color || '#FFD93D' };
                        const dot = document.createElement('span');
                        dot.className = `mood-dot mood-dot-${target}`;
                        dot.textContent = mood.emoji;
                        dot.title = target === 'me' ? '我的' : (window.settings?.partnerName || '梦角');
                        moodContainer.appendChild(dot);
                    }
                });
                cell.appendChild(moodContainer);
            }

            cell.addEventListener('click', () => openMoodEditor(dateStr));
            grid.appendChild(cell);
        }
    }

    // ==================== 心情编辑器 ====================
    function openMoodEditor(dateStr) {
        selectedDateStr = dateStr;
        const overlay = document.getElementById('mood-selector-overlay');
        const editor = document.getElementById('mood-editor-view');
        const detail = document.getElementById('mood-detail-view');
        const customDialog = document.getElementById('custom-mood-dialog');

        if (overlay) overlay.style.display = 'flex';
        if (editor) editor.style.display = 'block';
        if (detail) detail.style.display = 'none';
        if (customDialog) customDialog.style.display = 'none';

        // 设置日期标题
        const dateTitle = document.getElementById('mood-selector-date');
        if (dateTitle) {
            const d = new Date(dateStr);
            dateTitle.textContent = `${d.getMonth() + 1}月${d.getDate()}日`;
        }

        // 更新标签名
        updateMoodEditorLabels();

        // 重置到第一页
        currentMoodPage = 1;
        switchMoodPage(0);

        // 预填充已有数据
        const record = getMoodRecord(dateStr, currentEditTarget);
        const noteInput = document.getElementById('mood-note-input');
        const weatherInput = document.getElementById('mood-weather-input');

        if (noteInput) noteInput.value = record ? (record.note || '') : '';
        if (weatherInput) weatherInput.value = record ? (record.weather || '') : '';

        // 高亮已选心情
        highlightSelectedMood(record);
    }

    function updateMoodEditorLabels() {
        const meTab = document.getElementById('mood-tab-me');
        const partnerTab = document.getElementById('mood-tab-partner');
        const noteLabel = document.getElementById('mood-note-label');
        const weatherLabel = document.getElementById('mood-weather-label');
        const partnerName = window.settings?.partnerName || '梦角';
        const myName = window.settings?.myName || '我';

        if (meTab) meTab.textContent = `${myName}的记录`;
        if (partnerTab) partnerTab.textContent = `${partnerName}的记录`;
        if (noteLabel) noteLabel.textContent = currentEditTarget === 'me' ? '我的随记:' : `${partnerName}的随记:`;
        if (weatherLabel) weatherLabel.textContent = currentEditTarget === 'me' ? '我的天气:' : `${partnerName}的天气:`;
    }

    function switchMoodEditTarget(target) {
        currentEditTarget = target;
        const meTab = document.getElementById('mood-tab-me');
        const partnerTab = document.getElementById('mood-tab-partner');

        if (meTab) meTab.classList.toggle('active', target === 'me');
        if (partnerTab) partnerTab.classList.toggle('active', target === 'partner');

        updateMoodEditorLabels();

        // 重新预填充数据
        const record = getMoodRecord(selectedDateStr, target);
        const noteInput = document.getElementById('mood-note-input');
        const weatherInput = document.getElementById('mood-weather-input');

        if (noteInput) noteInput.value = record ? (record.note || '') : '';
        if (weatherInput) weatherInput.value = record ? (record.weather || '') : '';

        highlightSelectedMood(record);
    }

    function switchMoodPage(direction) {
        currentMoodPage += direction;
        if (currentMoodPage < 1) currentMoodPage = 1;
        if (currentMoodPage > 2) currentMoodPage = 2;

        const page1 = document.getElementById('mood-page-1');
        const page2 = document.getElementById('mood-page-2');
        const indicator = document.getElementById('mood-page-indicator');
        const prevBtn = document.getElementById('mood-page-prev');
        const nextBtn = document.getElementById('mood-page-next');

        if (page1) page1.style.display = currentMoodPage === 1 ? 'block' : 'none';
        if (page2) page2.style.display = currentMoodPage === 2 ? 'block' : 'none';
        if (indicator) indicator.textContent = currentMoodPage === 1 ? '第 1 页 · 心情' : '第 2 页 · 随记';
        if (prevBtn) prevBtn.style.opacity = currentMoodPage === 1 ? '0.3' : '1';
        if (nextBtn) nextBtn.style.opacity = currentMoodPage === 2 ? '0.3' : '1';

        if (currentMoodPage === 1) {
            renderMoodOptions();
        }
    }

    function renderMoodOptions() {
        const grid = document.getElementById('mood-options-grid');
        if (!grid) return;

        grid.innerHTML = '';
        const allMoods = getAllMoods();
        const record = getMoodRecord(selectedDateStr, currentEditTarget);

        allMoods.forEach((mood, index) => {
            const btn = document.createElement('button');
            btn.className = 'mood-option-btn';
            btn.dataset.label = mood.label;
            if (record && record.label === mood.label) {
                btn.classList.add('selected');
            }
            btn.innerHTML = `
                <span class="mood-emoji" style="font-size:28px;">${mood.emoji}</span>
                <span class="mood-label" style="font-size:11px;color:var(--text-secondary);margin-top:4px;">${mood.label}</span>
            `;
            btn.addEventListener('click', () => selectMood(mood));
            grid.appendChild(btn);
        });
    }

    function highlightSelectedMood(record) {
        const buttons = document.querySelectorAll('.mood-option-btn');
        buttons.forEach(btn => {
            btn.classList.toggle('selected', record && btn.dataset.label === record.label);
        });
    }

    let selectedMoodTemp = null;

    function selectMood(mood) {
        selectedMoodTemp = mood;
        highlightSelectedMood({ label: mood.label });
    }

    function saveMoodEdit() {
        const noteInput = document.getElementById('mood-note-input');
        const weatherInput = document.getElementById('mood-weather-input');

        const note = noteInput ? noteInput.value.trim() : '';
        const weather = weatherInput ? weatherInput.value.trim() : '';

        if (!selectedMoodTemp && !getMoodRecord(selectedDateStr, currentEditTarget)) {
            showNotification('请选择一种心情 ✦', 'warning');
            return;
        }

        const existing = getMoodRecord(selectedDateStr, currentEditTarget);
        const moodToSave = selectedMoodTemp || (existing ? { 
            emoji: existing.emoji, 
            label: existing.label, 
            color: existing.color 
        } : null);

        if (!moodToSave) {
            showNotification('请选择一种心情 ✦', 'warning');
            return;
        }

        const record = {
            emoji: moodToSave.emoji,
            label: moodToSave.label,
            color: moodToSave.color,
            note: note,
            weather: weather,
            timestamp: Date.now()
        };

        setMoodRecord(selectedDateStr, currentEditTarget, record);
        selectedMoodTemp = null;

        renderCalendar();
        closeMoodOverlay();
        showNotification('心情已记录 ✦', 'success');
    }

    // ==================== 自定义心情 ====================
    function openCustomMoodDialog() {
        const dialog = document.getElementById('custom-mood-dialog');
        if (dialog) dialog.style.display = 'block';

        // 渲染颜色选择
        const colorContainer = document.getElementById('custom-mood-colors');
        if (colorContainer) {
            colorContainer.innerHTML = '';
            MOOD_COLORS.forEach(color => {
                const dot = document.createElement('div');
                dot.style.cssText = `width:24px;height:24px;border-radius:50%;background:${color};cursor:pointer;border:2px solid transparent;`;
                dot.addEventListener('click', function() {
                    document.querySelectorAll('#custom-mood-colors div').forEach(d => d.style.borderColor = 'transparent');
                    this.style.borderColor = 'var(--accent-color)';
                    this.dataset.selected = color;
                });
                colorContainer.appendChild(dot);
            });
        }
    }

    function closeCustomMoodDialog() {
        const dialog = document.getElementById('custom-mood-dialog');
        if (dialog) dialog.style.display = 'none';

        const emojiInput = document.getElementById('custom-mood-emoji');
        const labelInput = document.getElementById('custom-mood-label');
        if (emojiInput) emojiInput.value = '';
        if (labelInput) labelInput.value = '';
    }

    function saveCustomMood() {
        const emojiInput = document.getElementById('custom-mood-emoji');
        const labelInput = document.getElementById('custom-mood-label');
        const selectedColorDot = document.querySelector('#custom-mood-colors div[data-selected]');

        const emoji = emojiInput ? emojiInput.value.trim() : '';
        const label = labelInput ? labelInput.value.trim() : '';
        const color = selectedColorDot ? selectedColorDot.dataset.selected : MOOD_COLORS[0];

        if (!emoji || !label) {
            showNotification('请填写完整信息 ✦', 'warning');
            return;
        }

        if (customMoods.length >= 20) {
            showNotification('自定义心情已达上限 ✦', 'warning');
            return;
        }

        customMoods.push({ emoji, label, color });
        saveMoodData();
        renderMoodOptions();
        closeCustomMoodDialog();
        showNotification('自定义心情已添加 ✦', 'success');
    }

    // ==================== 详情查看 ====================
    function viewMoodDetailFromEditor() {
        const editor = document.getElementById('mood-editor-view');
        const detail = document.getElementById('mood-detail-view');

        if (editor) editor.style.display = 'none';
        if (detail) detail.style.display = 'block';

        renderMoodDetail();
    }

    function renderMoodDetail() {
        const dateEl = document.getElementById('detail-date');
        const mySection = document.getElementById('detail-my-section');
        const partnerSection = document.getElementById('detail-partner-section');
        const partnerNoRecord = document.getElementById('detail-partner-no-record');

        if (dateEl) dateEl.textContent = selectedDateStr;

        const myRecord = getMoodRecord(selectedDateStr, 'me');
        const partnerRecord = getMoodRecord(selectedDateStr, 'partner');
        const partnerName = window.settings?.partnerName || '梦角';

        // 我的记录
        if (myRecord) {
            if (mySection) mySection.style.display = 'block';
            const mood = getAllMoods().find(m => m.label === myRecord.label) || myRecord;
            const kaomojiEl = document.getElementById('detail-kaomoji');
            const labelEl = document.getElementById('detail-label');
            const textEl = document.getElementById('detail-text');
            const weatherEl = document.getElementById('detail-my-weather');
            const weatherValEl = document.getElementById('detail-my-weather-val');

            if (kaomojiEl) kaomojiEl.textContent = mood.emoji || myRecord.emoji;
            if (labelEl) labelEl.textContent = mood.label || myRecord.label;
            if (textEl) textEl.textContent = myRecord.note || '没有留下随记';
            if (weatherEl) weatherEl.style.display = myRecord.weather ? 'block' : 'none';
            if (weatherValEl) weatherValEl.textContent = myRecord.weather || '';
        } else {
            if (mySection) mySection.style.display = 'none';
        }

        // 梦角的记录
        const partnerTitle = document.getElementById('detail-partner-title');
        if (partnerTitle) partnerTitle.textContent = `${partnerName}的`;

        if (partnerRecord) {
            if (partnerSection) partnerSection.style.display = 'block';
            if (partnerNoRecord) partnerNoRecord.style.display = 'none';

            const mood = getAllMoods().find(m => m.label === partnerRecord.label) || partnerRecord;
            const kaomojiEl = document.getElementById('detail-partner-kaomoji');
            const labelEl = document.getElementById('detail-partner-label');
            const textEl = document.getElementById('detail-partner-text');
            const weatherEl = document.getElementById('detail-partner-weather');
            const weatherValEl = document.getElementById('detail-partner-weather-val');

            if (kaomojiEl) kaomojiEl.textContent = mood.emoji || partnerRecord.emoji;
            if (labelEl) labelEl.textContent = mood.label || partnerRecord.label;
            if (textEl) textEl.textContent = partnerRecord.note || '没有留下随记';
            if (weatherEl) weatherEl.style.display = partnerRecord.weather ? 'block' : 'none';
            if (weatherValEl) weatherValEl.textContent = partnerRecord.weather || '';
        } else {
            if (partnerSection) partnerSection.style.display = 'none';
            if (partnerNoRecord) partnerNoRecord.style.display = 'block';
            const noRecordMsg = document.getElementById('detail-partner-no-record-msg');
            if (noRecordMsg) noRecordMsg.textContent = `${partnerName}这天还没有留下记录`;
        }

        // 更新删除按钮标签
        const deleteMeBtn = document.getElementById('delete-my-mood');
        const deletePartnerBtn = document.getElementById('delete-partner-mood');
        const editPartnerBtn = document.getElementById('edit-partner-mood');

        if (deleteMeBtn) deleteMeBtn.textContent = '删除我的';
        if (deletePartnerBtn) deletePartnerBtn.textContent = `删除${partnerName}`;
        if (editPartnerBtn) editPartnerBtn.textContent = `修改${partnerName}`;
    }

    function deleteDailyMood(dateStr, target) {
        if (!moodData[dateStr]) return;

        const record = moodData[dateStr][target];
        if (!record) return;

        // 移到回收站
        deletedMoods.push({
            ...record,
            dateStr: dateStr,
            target: target,
            deletedAt: Date.now()
        });

        delete moodData[dateStr][target];

        // 如果当天没有任何记录，删除该日期
        if (Object.keys(moodData[dateStr]).length === 0) {
            delete moodData[dateStr];
        }

        saveMoodData();
        renderCalendar();

        // 如果在详情页，重新渲染
        const detail = document.getElementById('mood-detail-view');
        if (detail && detail.style.display !== 'none') {
            renderMoodDetail();
        }

        showNotification('记录已移到回收站 ✦', 'info');
    }

    function editPartnerMoodRecord() {
        currentEditTarget = 'partner';
        const detail = document.getElementById('mood-detail-view');
        const editor = document.getElementById('mood-editor-view');

        if (detail) detail.style.display = 'none';
        if (editor) editor.style.display = 'block';

        updateMoodEditorLabels();
        switchMoodEditTarget('partner');
    }

    // ==================== 统计视图 ====================
    function renderMoodStats() {
        const container = document.getElementById('mood-stats-container');
        if (!container) return;

        const stats = { me: {}, partner: {} };
        const allMoods = getAllMoods();

        Object.entries(moodData).forEach(([dateStr, dayData]) => {
            ['me', 'partner'].forEach(target => {
                if (dayData[target]) {
                    const label = dayData[target].label;
                    stats[target][label] = (stats[target][label] || 0) + 1;
                }
            });
        });

        const partnerName = window.settings?.partnerName || '梦角';
        const myName = window.settings?.myName || '我';

        let html = '';

        // 我的心情统计
        const myTotal = Object.values(stats.me).reduce((a, b) => a + b, 0);
        if (myTotal > 0) {
            html += `<div style="margin-bottom:20px;">`;
            html += `<div style="font-size:14px;font-weight:600;color:var(--text-primary);margin-bottom:10px;">${myName}的心情分布</div>`;
            html += `<div style="display:flex;flex-direction:column;gap:8px;">`;

            Object.entries(stats.me)
                .sort((a, b) => b[1] - a[1])
                .forEach(([label, count]) => {
                    const mood = allMoods.find(m => m.label === label) || { emoji: '😊', color: '#FFD93D' };
                    const pct = Math.round((count / myTotal) * 100);
                    html += `
                        <div style="display:flex;align-items:center;gap:8px;">
                            <span style="font-size:20px;">${mood.emoji}</span>
                            <span style="font-size:12px;flex:1;">${label}</span>
                            <div style="flex:2;height:8px;background:var(--border-color);border-radius:4px;overflow:hidden;">
                                <div style="width:${pct}%;height:100%;background:${mood.color};border-radius:4px;"></div>
                            </div>
                            <span style="font-size:11px;color:var(--text-secondary);min-width:40px;text-align:right;">${count}次</span>
                        </div>
                    `;
                });

            html += `</div></div>`;
        }

        // 梦角的心情统计
        const partnerTotal = Object.values(stats.partner).reduce((a, b) => a + b, 0);
        if (partnerTotal > 0) {
            html += `<div style="margin-bottom:20px;">`;
            html += `<div style="font-size:14px;font-weight:600;color:var(--text-primary);margin-bottom:10px;">${partnerName}的心情分布</div>`;
            html += `<div style="display:flex;flex-direction:column;gap:8px;">`;

            Object.entries(stats.partner)
                .sort((a, b) => b[1] - a[1])
                .forEach(([label, count]) => {
                    const mood = allMoods.find(m => m.label === label) || { emoji: '😊', color: '#FFD93D' };
                    const pct = Math.round((count / partnerTotal) * 100);
                    html += `
                        <div style="display:flex;align-items:center;gap:8px;">
                            <span style="font-size:20px;">${mood.emoji}</span>
                            <span style="font-size:12px;flex:1;">${label}</span>
                            <div style="flex:2;height:8px;background:var(--border-color);border-radius:4px;overflow:hidden;">
                                <div style="width:${pct}%;height:100%;background:${mood.color};border-radius:4px;"></div>
                            </div>
                            <span style="font-size:11px;color:var(--text-secondary);min-width:40px;text-align:right;">${count}次</span>
                        </div>
                    `;
                });

            html += `</div></div>`;
        }

        if (myTotal === 0 && partnerTotal === 0) {
            html = `<div style="text-align:center;padding:40px;color:var(--text-secondary);">
                <i class="fas fa-chart-pie" style="font-size:32px;opacity:0.3;display:block;margin-bottom:12px;"></i>
                还没有心情记录<br><span style="font-size:11px;opacity:0.6;">在日历上点击日期开始记录吧</span>
            </div>`;
        }

        container.innerHTML = html;
    }

    // ==================== 回收站 ====================
    function renderTrashList() {
        const list = document.getElementById('mood-trash-list');
        if (!list) return;

        if (deletedMoods.length === 0) {
            list.innerHTML = `<div style="text-align:center;padding:40px;color:var(--text-secondary);">
                <i class="fas fa-recycle" style="font-size:32px;opacity:0.3;display:block;margin-bottom:12px;"></i>
                回收站是空的
            </div>`;
            return;
        }

        const allMoods = getAllMoods();
        const partnerName = window.settings?.partnerName || '梦角';

        list.innerHTML = deletedMoods.map((item, index) => {
            const mood = allMoods.find(m => m.label === item.label) || item;
            const targetName = item.target === 'me' ? (window.settings?.myName || '我') : partnerName;

            return `
                <div style="display:flex;align-items:center;gap:10px;padding:10px;background:var(--primary-bg);border-radius:10px;margin-bottom:8px;">
                    <span style="font-size:24px;">${mood.emoji || item.emoji}</span>
                    <div style="flex:1;">
                        <div style="font-size:13px;font-weight:500;">${targetName} · ${mood.label || item.label}</div>
                        <div style="font-size:11px;color:var(--text-secondary);">${item.dateStr}</div>
                    </div>
                    <button onclick="restoreMoodRecord(${index})" style="background:var(--accent-color);color:#fff;border:none;border-radius:8px;padding:6px 12px;font-size:12px;cursor:pointer;font-family:var(--font-family);">
                        <i class="fas fa-undo"></i> 恢复
                    </button>
                    <button onclick="permanentlyDeleteMood(${index})" style="background:rgba(255,107,107,0.1);color:#ff6b6b;border:1px solid rgba(255,107,107,0.3);border-radius:8px;padding:6px 12px;font-size:12px;cursor:pointer;font-family:var(--font-family);">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        }).join('');
    }

    function restoreMoodRecord(index) {
        const item = deletedMoods[index];
        if (!item) return;

        if (!moodData[item.dateStr]) moodData[item.dateStr] = {};
        moodData[item.dateStr][item.target] = {
            emoji: item.emoji,
            label: item.label,
            color: item.color,
            note: item.note,
            weather: item.weather,
            timestamp: item.timestamp
        };

        deletedMoods.splice(index, 1);
        saveMoodData();
        renderTrashList();
        renderCalendar();
        showNotification('记录已恢复 ✦', 'success');
    }

    function permanentlyDeleteMood(index) {
        if (!confirm('确定永久删除这条记录吗？此操作不可撤销。')) return;
        deletedMoods.splice(index, 1);
        saveMoodData();
        renderTrashList();
        showNotification('记录已永久删除 ✦', 'info');
    }

    // ==================== 视图切换 ====================
    function switchMoodView(view) {
        const calendarView = document.getElementById('mood-calendar-view');
        const statsView = document.getElementById('mood-stats-view');
        const trashView = document.getElementById('mood-trash-view');
        const btnCalendar = document.getElementById('btn-view-calendar');
        const btnStats = document.getElementById('btn-view-stats');
        const btnTrash = document.getElementById('btn-view-trash');

        if (calendarView) calendarView.classList.add('hidden-view');
        if (statsView) statsView.classList.add('hidden-view');
        if (trashView) trashView.classList.add('hidden-view');

        if (btnCalendar) btnCalendar.classList.remove('active');
        if (btnStats) btnStats.classList.remove('active');
        if (btnTrash) btnTrash.classList.remove('active');

        switch(view) {
            case 'calendar':
                if (calendarView) calendarView.classList.remove('hidden-view');
                if (btnCalendar) btnCalendar.classList.add('active');
                renderCalendar();
                break;
            case 'stats':
                if (statsView) statsView.classList.remove('hidden-view');
                if (btnStats) btnStats.classList.add('active');
                renderMoodStats();
                break;
            case 'trash':
                if (trashView) trashView.classList.remove('hidden-view');
                if (btnTrash) btnTrash.classList.add('active');
                renderTrashList();
                break;
        }
    }

    // ==================== 导入导出 ====================
    function exportMoodData() {
        const data = {
            moodData: moodData,
            customMoods: customMoods,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mood-data-${getDateStr(new Date())}.json`;
        a.click();
        URL.revokeObjectURL(url);

        showNotification('心情数据已导出 ✦', 'success');
    }

    function importMoodData(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                if (data.moodData) {
                    // 合并数据
                    Object.entries(data.moodData).forEach(([dateStr, dayData]) => {
                        if (!moodData[dateStr]) moodData[dateStr] = {};
                        Object.entries(dayData).forEach(([target, record]) => {
                            moodData[dateStr][target] = record;
                        });
                    });
                }
                if (data.customMoods) {
                    customMoods = [...customMoods, ...data.customMoods];
                }
                saveMoodData();
                renderCalendar();
                showNotification('心情数据已导入 ✦', 'success');
            } catch(err) {
                showNotification('导入失败，文件格式错误 ✦', 'error');
            }
        };
        reader.readAsText(file);
    }

    // ==================== UI 控制 ====================
    function closeMoodOverlay() {
        const overlay = document.getElementById('mood-selector-overlay');
        if (overlay) overlay.style.display = 'none';
        selectedMoodTemp = null;
    }

    function openMoodModal() {
        const modal = document.getElementById('mood-modal');
        if (modal) {
            showModal(modal);
            switchMoodView('calendar');
            renderCalendar();
        }
    }

    // ==================== 事件绑定 ====================
    function initMoodEvents() {
        // 月份导航
        const prevBtn = document.getElementById('prev-month');
        const nextBtn = document.getElementById('next-month');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentViewMonth.setMonth(currentViewMonth.getMonth() - 1);
                renderCalendar();
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentViewMonth.setMonth(currentViewMonth.getMonth() + 1);
                renderCalendar();
            });
        }

        // 视图切换
        const btnCalendar = document.getElementById('btn-view-calendar');
        const btnStats = document.getElementById('btn-view-stats');
        const btnTrash = document.getElementById('btn-view-trash');

        if (btnCalendar) btnCalendar.addEventListener('click', () => switchMoodView('calendar'));
        if (btnStats) btnStats.addEventListener('click', () => switchMoodView('stats'));
        if (btnTrash) btnTrash.addEventListener('click', () => switchMoodView('trash'));

        // 编辑器按钮
        const cancelBtn = document.getElementById('cancel-mood-edit');
        const saveBtn = document.getElementById('confirm-mood-save');
        const viewDetailBtn = document.getElementById('view-mood-detail-btn');

        if (cancelBtn) cancelBtn.addEventListener('click', closeMoodOverlay);
        if (saveBtn) saveBtn.addEventListener('click', saveMoodEdit);
        if (viewDetailBtn) viewDetailBtn.addEventListener('click', viewMoodDetailFromEditor);

        // 关闭弹窗
        const closeMoodBtn = document.getElementById('close-mood');
        if (closeMoodBtn) closeMoodBtn.addEventListener('click', () => {
            hideModal(document.getElementById('mood-modal'));
        });

        // 导出导入
        const exportBtn = document.getElementById('mood-export-btn');
        const importBtn = document.getElementById('mood-import-btn');
        const importFile = document.getElementById('mood-import-file-input');

        if (exportBtn) exportBtn.addEventListener('click', exportMoodData);
        if (importBtn) importBtn.addEventListener('click', () => {
            if (importFile) importFile.click();
        });
        if (importFile) {
            importFile.addEventListener('change', (e) => {
                if (e.target.files[0]) {
                    importMoodData(e.target.files[0]);
                    e.target.value = '';
                }
            });
        }

        // 编辑已有记录
        const editExistingBtn = document.getElementById('edit-existing-mood');
        if (editExistingBtn) {
            editExistingBtn.addEventListener('click', () => {
                currentEditTarget = 'me';
                const detail = document.getElementById('mood-detail-view');
                const editor = document.getElementById('mood-editor-view');
                if (detail) detail.style.display = 'none';
                if (editor) editor.style.display = 'block';
                updateMoodEditorLabels();
                switchMoodEditTarget('me');
            });
        }
    }

    // ==================== 初始化 ====================
    function initMood() {
        loadMoodData();
        initMoodEvents();
    }

    // ==================== 全局暴露 ====================
    window.initMood = initMood;
    window.openMoodModal = openMoodModal;
    window.switchMoodPage = switchMoodPage;
    window.switchMoodEditTarget = switchMoodEditTarget;
    window.openCustomMoodDialog = openCustomMoodDialog;
    window.closeCustomMoodDialog = closeCustomMoodDialog;
    window.saveCustomMood = saveCustomMood;
    window.selectMood = selectMood;
    window.saveMoodEdit = saveMoodEdit;
    window.viewMoodDetailFromEditor = viewMoodDetailFromEditor;
    window.deleteDailyMood = deleteDailyMood;
    window.editPartnerMoodRecord = editPartnerMoodRecord;
    window.closeMoodOverlay = closeMoodOverlay;
    window.restoreMoodRecord = restoreMoodRecord;
    window.permanentlyDeleteMood = permanentlyDeleteMood;
    window.exportMoodData = exportMoodData;
    window.importMoodData = importMoodData;
    window.switchMoodView = switchMoodView;
    window.renderMoodStats = renderMoodStats;
    window.renderTrashList = renderTrashList;

    // DOM加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMood);
    } else {
        initMood();
    }

})();
/**
 * ============================================================
 * 信封投递模块 (Envelope Module)
 * ============================================================
 * 功能：寄信、收信、时空来信、信件管理
 * 包含：
 *   - 寄出的信 / 收到的信 / 时空来信 三个标签页
 *   - 写信与发送
 *   - 信件详情查看与回复
 *   - 自动回信（时空来信）
 *   - 信件导入导出
 *   - 本地存储持久化
 * ============================================================
 */

(function() {
    'use strict';

    // ==================== 配置与常量 ====================
    const ENV_STORAGE_KEY = 'envelopeData';
    const ENV_SETTINGS_KEY = 'envelopeSettings';
    const ENV_AUTO_REPLY_KEY = 'envelopeAutoReply';

    // 时空来信默认回复库（内置）
    const DEFAULT_TIME_LETTER_REPLIES = [
        "收到你的信了，我也一直在想你。",
        "纸短情长，心意已收到。",
        "你的文字让我今天的心情变得很好。",
        "我也在远方牵挂着你。",
        "每一封信都是一次心灵的触碰，谢谢你。",
        "时光流转，但这份心意我会好好珍藏。",
        "读着你的信，仿佛你就在身边。",
        "愿这封信能带给你温暖和力量。",
        "你的话语像春风一样温柔。",
        "无论相隔多远，心始终在一起。",
        "这封信我反复读了好几遍。",
        "期待下一次收到你的消息。",
        "你的信是我今天最好的礼物。",
        "字里行间，都是满满的心意呢。",
        "我也正想给你写点什么，心有灵犀。",
        "收到信的那一刻，嘴角不自觉上扬了。",
        "愿我们的故事，像这些信件一样绵长。",
        "每一封信都是时光胶囊，珍藏着美好。",
        "谢谢你愿意分享你的心情给我。",
        "我会把这份心意，好好收藏在心底。"
    ];

    // 信件模板（用于时空来信）
    const TIME_LETTER_TEMPLATES = [
        { greeting: "见信如晤", sign: "思念你的" },
        { greeting: "展信安", sign: "牵挂你的" },
        { greeting: "亲启", sign: "远方的" },
        { greeting: "你好呀", sign: "一直陪着你的" },
        { greeting: "又给你写信了", sign: "爱你的" }
    ];

    // ==================== 状态管理 ====================
    let envelopeData = {
        outbox: [],      // 寄出的信
        inbox: [],       // 收到的信
        timeLetters: [], // 时空来信
        lastReplyTime: 0 // 上次自动回信时间
    };

    let envelopeSettings = {
        autoReplyEnabled: true,      // 是否开启自动回信
        autoReplyDelay: 5,           // 自动回信延迟（分钟）
        timeLetterEnabled: true,     // 是否开启时空来信
        timeLetterInterval: 30,      // 时空来信间隔（分钟）
        showNotification: true,      // 新信通知
        customReplies: []            // 自定义回信库
    };

    let autoReplyTimer = null;
    let timeLetterTimer = null;
    let currentViewingLetter = null; // 当前查看的信件
    let isComposing = false;         // 是否正在写信

    // ==================== 初始化 ====================
    function initEnvelope() {
        loadEnvelopeData();
        loadEnvelopeSettings();
        initEventListeners();
        startAutoReplyTimer();
        startTimeLetterTimer();
        console.log('[Envelope] 信封模块初始化完成');
    }

    // ==================== 数据持久化 ====================
    function loadEnvelopeData() {
        try {
            const saved = localStorage.getItem(ENV_STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                envelopeData.outbox = parsed.outbox || [];
                envelopeData.inbox = parsed.inbox || [];
                envelopeData.timeLetters = parsed.timeLetters || [];
                envelopeData.lastReplyTime = parsed.lastReplyTime || 0;
            }
        } catch (e) {
            console.warn('[Envelope] 加载数据失败:', e);
        }
    }

    function saveEnvelopeData() {
        try {
            localStorage.setItem(ENV_STORAGE_KEY, JSON.stringify(envelopeData));
        } catch (e) {
            console.warn('[Envelope] 保存数据失败:', e);
        }
    }

    function loadEnvelopeSettings() {
        try {
            const saved = localStorage.getItem(ENV_SETTINGS_KEY);
            if (saved) {
                envelopeSettings = { ...envelopeSettings, ...JSON.parse(saved) };
            }
        } catch (e) {
            console.warn('[Envelope] 加载设置失败:', e);
        }
    }

    function saveEnvelopeSettings() {
        try {
            localStorage.setItem(ENV_SETTINGS_KEY, JSON.stringify(envelopeSettings));
        } catch (e) {
            console.warn('[Envelope] 保存设置失败:', e);
        }
    }

    // ==================== 事件监听 ====================
    function initEventListeners() {
        // 关闭信封弹窗
        const cancelBtn = document.getElementById('cancel-envelope');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', closeEnvelopeModal);
        }

        // 发送信件
        const sendBtn = document.getElementById('send-envelope');
        if (sendBtn) {
            sendBtn.addEventListener('click', sendEnvelope);
        }

        // 取消写信
        const cancelComposeBtn = document.getElementById('cancel-compose');
        if (cancelComposeBtn) {
            cancelComposeBtn.addEventListener('click', cancelEnvelopeCompose);
        }

        // 监听设置变化（从其他模块）
        window.addEventListener('envelopeSettingsChanged', function(e) {
            if (e.detail) {
                envelopeSettings = { ...envelopeSettings, ...e.detail };
                saveEnvelopeSettings();
                restartTimers();
            }
        });
    }

    // ==================== 标签切换 ====================
    window.switchEnvTab = function(tabName) {
        // 更新标签按钮状态
        document.querySelectorAll('.env-tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        const tabBtn = document.getElementById('env-tab-' + tabName);
        if (tabBtn) tabBtn.classList.add('active');

        // 隐藏所有内容区
        const outboxSection = document.getElementById('env-outbox-section');
        const inboxSection = document.getElementById('env-inbox-section');
        const timeSection = document.getElementById('env-time-section');
        const composeForm = document.getElementById('env-compose-form');

        if (outboxSection) outboxSection.style.display = 'none';
        if (inboxSection) inboxSection.style.display = 'none';
        if (timeSection) timeSection.style.display = 'none';
        if (composeForm) composeForm.style.display = 'none';

        // 显示对应内容
        isComposing = false;
        if (tabName === 'outbox') {
            if (outboxSection) outboxSection.style.display = 'block';
            renderOutboxList();
        } else if (tabName === 'inbox') {
            if (inboxSection) inboxSection.style.display = 'block';
            renderInboxList();
            // 标记所有收件为已读
            markInboxAsRead();
        } else if (tabName === 'time') {
            if (timeSection) timeSection.style.display = 'block';
            renderTimeLetterList();
            markTimeLettersAsRead();
        }

        // 更新底部按钮
        updateBottomButtons(tabName);
    };

    function updateBottomButtons(tabName) {
        const sendArea = document.getElementById('env-main-close-btn');
        if (!sendArea) return;

        if (tabName === 'compose') {
            sendArea.style.display = 'none';
        } else {
            sendArea.style.display = 'flex';
            const writeBtn = document.getElementById('new-envelope-btn');
            if (writeBtn) {
                writeBtn.style.display = tabName === 'outbox' ? 'flex' : 'none';
            }
        }
    }

    // ==================== 写信功能 ====================
    window.openNewEnvelopeForm = function() {
        isComposing = true;

        // 隐藏列表区域
        const outboxSection = document.getElementById('env-outbox-section');
        const inboxSection = document.getElementById('env-inbox-section');
        const timeSection = document.getElementById('env-time-section');

        if (outboxSection) outboxSection.style.display = 'none';
        if (inboxSection) inboxSection.style.display = 'none';
        if (timeSection) timeSection.style.display = 'none';

        // 显示写信表单
        const composeForm = document.getElementById('env-compose-form');
        if (composeForm) {
            composeForm.style.display = 'block';
            composeForm.style.animation = 'fadeInUp 0.3s ease';
        }

        // 清空输入
        const input = document.getElementById('envelope-input');
        if (input) {
            input.value = '';
            input.focus();
        }

        // 重置"同时发送到聊天记录"
        const sendToChat = document.getElementById('env-send-to-chat');
        if (sendToChat) sendToChat.checked = false;

        // 更新底部按钮
        updateBottomButtons('compose');

        // 更新标题
        const composeTitle = document.getElementById('env-compose-title');
        if (composeTitle) composeTitle.textContent = '写一封信';

        // 更新回复信息
        const replyInfo = document.getElementById('env-reply-time-info');
        if (replyInfo) {
            const partnerName = (typeof settings !== 'undefined' && settings.partnerName) ? settings.partnerName : '梦角';
            replyInfo.textContent = '寄出后，' + partnerName + '会在 ' + envelopeSettings.autoReplyDelay + ' 分钟左右回信';
        }
    };

    window.cancelEnvelopeCompose = function() {
        isComposing = false;
        const composeForm = document.getElementById('env-compose-form');
        if (composeForm) composeForm.style.display = 'none';

        // 返回寄出的信标签
        switchEnvTab('outbox');
    };

    function sendEnvelope() {
        const input = document.getElementById('envelope-input');
        if (!input) return;

        const content = input.value.trim();
        if (!content) {
            showNotification('请先写点什么吧 ✦', 'warning');
            return;
        }

        const partnerName = (typeof settings !== 'undefined' && settings.partnerName) ? settings.partnerName : '梦角';
        const myName = (typeof settings !== 'undefined' && settings.myName) ? settings.myName : '我';

        // 创建信件对象
        const letter = {
            id: Date.now(),
            content: content,
            timestamp: Date.now(),
            from: myName,
            to: partnerName,
            isRead: true,
            hasReply: false,
            replyContent: null,
            replyTimestamp: null,
            type: 'normal'
        };

        // 添加到寄件箱
        envelopeData.outbox.unshift(letter);
        saveEnvelopeData();

        // 检查是否需要同时发送到聊天记录
        const sendToChat = document.getElementById('env-send-to-chat');
        if (sendToChat && sendToChat.checked) {
            sendLetterToChat(content);
        }

        // 显示成功提示
        showNotification('信件已寄出 ✦', 'success');

        // 触发自动回信（如果开启）
        if (envelopeSettings.autoReplyEnabled) {
            scheduleAutoReply(letter.id);
        }

        // 返回列表
        cancelEnvelopeCompose();
        renderOutboxList();
        updateBadges();
    }

    function sendLetterToChat(content) {
        // 将信件内容发送到聊天窗口
        if (typeof addMessage === 'function') {
            addMessage(content, 'sent');
        }

        // 添加特殊标记
        const partnerName = (typeof settings !== 'undefined' && settings.partnerName) ? settings.partnerName : '梦角';
        const letterNotice = `[信件] 已寄给 ${partnerName}`;

        if (typeof addSystemMessage === 'function') {
            addSystemMessage(letterNotice);
        }
    }

    // ==================== 自动回信 ====================
    function scheduleAutoReply(letterId) {
        const delay = envelopeSettings.autoReplyDelay * 60 * 1000;
        // 添加一些随机性 (±30%)
        const randomDelay = delay * (0.7 + Math.random() * 0.6);

        setTimeout(() => {
            generateAutoReply(letterId);
        }, randomDelay);
    }

    function generateAutoReply(letterId) {
        const partnerName = (typeof settings !== 'undefined' && settings.partnerName) ? settings.partnerName : '梦角';

        // 获取回复内容
        let replyContent;
        const customReplies = envelopeSettings.customReplies || [];
        const allReplies = customReplies.length > 0
            ? customReplies
            : DEFAULT_TIME_LETTER_REPLIES;

        replyContent = allReplies[Math.floor(Math.random() * allReplies.length)];

        // 创建回信
        const replyLetter = {
            id: Date.now(),
            content: replyContent,
            timestamp: Date.now(),
            from: partnerName,
            to: '我',
            isRead: false,
            isReply: true,
            replyTo: letterId,
            type: 'normal'
        };

        // 添加到收件箱
        envelopeData.inbox.unshift(replyLetter);

        // 更新原信件状态
        const originalLetter = envelopeData.outbox.find(l => l.id === letterId);
        if (originalLetter) {
            originalLetter.hasReply = true;
            originalLetter.replyContent = replyContent;
            originalLetter.replyTimestamp = Date.now();
        }

        saveEnvelopeData();

        // 显示通知
        if (envelopeSettings.showNotification) {
            showNotification(`收到 ${partnerName} 的回信 ✦`, 'info');
        }

        // 更新UI
        updateBadges();

        // 如果当前在收件箱页面，刷新列表
        const inboxSection = document.getElementById('env-inbox-section');
        if (inboxSection && inboxSection.style.display !== 'none') {
            renderInboxList();
        }

        // 触发事件
        window.dispatchEvent(new CustomEvent('newEnvelopeReceived', {
            detail: { letter: replyLetter }
        }));
    }

    // ==================== 时空来信 ====================
    function startTimeLetterTimer() {
        if (!envelopeSettings.timeLetterEnabled) return;

        // 检查是否需要立即发送一封
        const now = Date.now();
        const interval = envelopeSettings.timeLetterInterval * 60 * 1000;
        const lastTimeLetter = envelopeData.timeLetters[0];

        if (!lastTimeLetter || (now - lastTimeLetter.timestamp > interval)) {
            // 可以发送，但延迟一下避免初始化时立即发送
            setTimeout(() => {
                if (Math.random() < 0.3) { // 30%概率立即发送
                    generateTimeLetter();
                }
            }, 60000);
        }

        // 设置定时器
        timeLetterTimer = setInterval(() => {
            if (envelopeSettings.timeLetterEnabled && Math.random() < 0.5) {
                generateTimeLetter();
            }
        }, interval);
    }

    function generateTimeLetter() {
        const partnerName = (typeof settings !== 'undefined' && settings.partnerName) ? settings.partnerName : '梦角';

        // 选择模板
        const template = TIME_LETTER_TEMPLATES[Math.floor(Math.random() * TIME_LETTER_TEMPLATES.length)];

        // 生成内容
        const replies = envelopeSettings.customReplies.length > 0
            ? envelopeSettings.customReplies
            : DEFAULT_TIME_LETTER_REPLIES;
        const content = replies[Math.floor(Math.random() * replies.length)];

        // 构建完整信件
        const fullContent = `${template.greeting}，\n\n${content}\n\n${template.sign}\n${partnerName}`;

        const timeLetter = {
            id: Date.now(),
            content: fullContent,
            timestamp: Date.now(),
            from: partnerName,
            to: '我',
            isRead: false,
            type: 'time',
            template: template
        };

        envelopeData.timeLetters.unshift(timeLetter);
        saveEnvelopeData();

        // 通知
        if (envelopeSettings.showNotification) {
            showNotification(`收到来自 ${partnerName} 的时空来信 ✦`, 'info');
        }

        updateBadges();
    }

    // ==================== 渲染列表 ====================
    function renderOutboxList() {
        const container = document.getElementById('env-outbox-list');
        if (!container) return;

        if (envelopeData.outbox.length === 0) {
            container.innerHTML = renderEmptyState('还没有寄出的信', '提笔写一封信吧');
            return;
        }

        container.innerHTML = envelopeData.outbox.map(letter => renderLetterItem(letter, 'outbox')).join('');
    }

    function renderInboxList() {
        const container = document.getElementById('env-inbox-list');
        if (!container) return;

        if (envelopeData.inbox.length === 0) {
            container.innerHTML = renderEmptyState('还没有收到的信', '寄一封信，等待回信吧');
            return;
        }

        container.innerHTML = envelopeData.inbox.map(letter => renderLetterItem(letter, 'inbox')).join('');
    }

    function renderTimeLetterList() {
        const container = document.getElementById('env-time-list');
        if (!container) {
            // 如果没有时空来信容器，创建一个
            createTimeLetterSection();
            return;
        }

        if (envelopeData.timeLetters.length === 0) {
            container.innerHTML = renderEmptyState('还没有时空来信', '开启后，对方会随机给你写信');
            return;
        }

        container.innerHTML = envelopeData.timeLetters.map(letter => renderLetterItem(letter, 'time')).join('');
    }

    function createTimeLetterSection() {
        const envBody = document.querySelector('.env-body');
        if (!envBody) return;

        // 创建时空来信内容区
        const timeSection = document.createElement('div');
        timeSection.id = 'env-time-section';
        timeSection.style.display = 'none';
        timeSection.innerHTML = '<div id="env-time-list"></div>';

        // 插入到收件箱之后
        const inboxSection = document.getElementById('env-inbox-section');
        if (inboxSection) {
            inboxSection.after(timeSection);
        }

        // 添加时空来信标签
        const tabBar = document.querySelector('.env-tab-bar');
        if (tabBar) {
            const timeTab = document.createElement('button');
            timeTab.className = 'env-tab-btn';
            timeTab.id = 'env-tab-time';
            timeTab.onclick = function() { switchEnvTab('time'); };
            timeTab.innerHTML = `
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-1px;margin-right:4px;">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                </svg>时空来信
                <span id="env-time-badge" class="env-badge" style="display:none;"></span>
            `;
            tabBar.appendChild(timeTab);
        }

        renderTimeLetterList();
    }

    function renderLetterItem(letter, type) {
        const date = new Date(letter.timestamp);
        const dateStr = formatLetterDate(date);
        const isUnread = !letter.isRead;
        const partnerName = (typeof settings !== 'undefined' && settings.partnerName) ? settings.partnerName : '梦角';

        let preview = letter.content;
        if (preview.length > 60) {
            preview = preview.substring(0, 60) + '...';
        }
        // 去除换行显示
        preview = preview.replace(/\n/g, ' ');

        let icon, title, badge;
        if (type === 'outbox') {
            icon = 'fa-paper-plane';
            title = '寄给 ' + letter.to;
            badge = letter.hasReply ? '<span class="env-reply-badge">已回信</span>' : '';
        } else if (type === 'inbox') {
            icon = 'fa-envelope';
            title = letter.from;
            badge = isUnread ? '<span class="env-unread-badge">新</span>' : '';
        } else {
            icon = 'fa-clock';
            title = '时空来信';
            badge = isUnread ? '<span class="env-unread-badge">新</span>' : '';
        }

        return `
            <div class="env-letter-item ${isUnread ? 'unread' : ''}" data-id="${letter.id}" data-type="${type}" onclick="openLetterDetail(${letter.id}, '${type}')">
                <div class="env-letter-icon">
                    <i class="fas ${icon}"></i>
                </div>
                <div class="env-letter-info">
                    <div class="env-letter-header">
                        <span class="env-letter-title">${title}</span>
                        <span class="env-letter-date">${dateStr}</span>
                    </div>
                    <div class="env-letter-preview">${preview}</div>
                    <div class="env-letter-badges">${badge}</div>
                </div>
                <div class="env-letter-arrow">
                    <i class="fas fa-chevron-right"></i>
                </div>
            </div>
        `;
    }

    function renderEmptyState(title, subtitle) {
        return `
            <div class="env-empty-state">
                <i class="fas fa-envelope-open"></i>
                <p class="env-empty-title">${title}</p>
                <p class="env-empty-subtitle">${subtitle}</p>
            </div>
        `;
    }

    function formatLetterDate(date) {
        const now = new Date();
        const diff = now - date;
        const day = 24 * 60 * 60 * 1000;

        if (diff < day && now.getDate() === date.getDate()) {
            return date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');
        } else if (diff < 2 * day) {
            return '昨天';
        } else if (diff < 7 * day) {
            const days = ['日', '一', '二', '三', '四', '五', '六'];
            return '周' + days[date.getDay()];
        } else {
            return (date.getMonth() + 1) + '/' + date.getDate();
        }
    }

    // ==================== 信件详情 ====================
    window.openLetterDetail = function(letterId, type) {
        let letter;
        if (type === 'outbox') {
            letter = envelopeData.outbox.find(l => l.id === letterId);
        } else if (type === 'inbox') {
            letter = envelopeData.inbox.find(l => l.id === letterId);
        } else {
            letter = envelopeData.timeLetters.find(l => l.id === letterId);
        }

        if (!letter) return;
        currentViewingLetter = letter;

        // 标记为已读
        if (!letter.isRead) {
            letter.isRead = true;
            saveEnvelopeData();
            updateBadges();
        }

        // 构建详情HTML
        const partnerName = (typeof settings !== 'undefined' && settings.partnerName) ? settings.partnerName : '梦角';
        const myName = (typeof settings !== 'undefined' && settings.myName) ? settings.myName : '我';

        const date = new Date(letter.timestamp);
        const dateStr = date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日 ' +
            date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');

        let detailHTML = `
            <div class="env-detail-overlay" id="env-detail-overlay" onclick="closeLetterDetail(event)">
                <div class="env-detail-card" onclick="event.stopPropagation()">
                    <div class="env-detail-header">
                        <button class="env-detail-back" onclick="closeLetterDetail()">
                            <i class="fas fa-arrow-left"></i>
                        </button>
                        <span class="env-detail-title">信件详情</span>
                        <button class="env-detail-delete" onclick="deleteLetter(${letterId}, '${type}')" title="删除">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                    <div class="env-detail-meta">
                        <div class="env-detail-from">
                            <span class="env-detail-label">寄件人：</span>
                            <span class="env-detail-value">${letter.from}</span>
                        </div>
                        <div class="env-detail-to">
                            <span class="env-detail-label">收件人：</span>
                            <span class="env-detail-value">${letter.to}</span>
                        </div>
                        <div class="env-detail-time">
                            <span class="env-detail-label">时间：</span>
                            <span class="env-detail-value">${dateStr}</span>
                        </div>
                    </div>
                    <div class="env-detail-content">
                        ${formatLetterContent(letter.content)}
                    </div>
        `;

        // 如果是寄出的信且有回信，显示回信
        if (type === 'outbox' && letter.hasReply && letter.replyContent) {
            const replyDate = new Date(letter.replyTimestamp);
            const replyDateStr = replyDate.getFullYear() + '年' + (replyDate.getMonth() + 1) + '月' + replyDate.getDate() + '日 ' +
                replyDate.getHours().toString().padStart(2, '0') + ':' + replyDate.getMinutes().toString().padStart(2, '0');

            detailHTML += `
                <div class="env-detail-reply-section">
                    <div class="env-detail-reply-header">
                        <i class="fas fa-reply"></i>
                        <span>${partnerName} 的回信</span>
                        <span class="env-detail-reply-time">${replyDateStr}</span>
                    </div>
                    <div class="env-detail-reply-content">
                        ${letter.replyContent}
                    </div>
                </div>
            `;
        }

        // 如果是收到的信，显示回复按钮
        if (type === 'inbox' || type === 'time') {
            detailHTML += `
                <div class="env-detail-actions">
                    <button class="modal-btn modal-btn-primary" onclick="replyToLetter(${letterId}, '${type}')">
                        <i class="fas fa-reply"></i> 写回信
                    </button>
                </div>
            `;
        }

        detailHTML += `
                </div>
            </div>
        `;

        // 插入到body
        const existing = document.getElementById('env-detail-overlay');
        if (existing) existing.remove();

        const div = document.createElement('div');
        div.innerHTML = detailHTML;
        document.body.appendChild(div.firstElementChild);

        // 刷新列表
        if (type === 'outbox') renderOutboxList();
        else if (type === 'inbox') renderInboxList();
        else renderTimeLetterList();
    };

    window.closeLetterDetail = function(event) {
        if (event && event.target !== event.currentTarget) return;
        const overlay = document.getElementById('env-detail-overlay');
        if (overlay) {
            overlay.style.animation = 'fadeOut 0.2s ease';
            setTimeout(() => overlay.remove(), 200);
        }
        currentViewingLetter = null;
    };

    function formatLetterContent(content) {
        // 将换行符转换为<br>
        return content.replace(/\n/g, '<br>').replace(/\n/g, '<br>');
    }

    // ==================== 删除信件 ====================
    window.deleteLetter = function(letterId, type) {
        if (!confirm('确定要删除这封信吗？')) return;

        if (type === 'outbox') {
            envelopeData.outbox = envelopeData.outbox.filter(l => l.id !== letterId);
        } else if (type === 'inbox') {
            envelopeData.inbox = envelopeData.inbox.filter(l => l.id !== letterId);
        } else {
            envelopeData.timeLetters = envelopeData.timeLetters.filter(l => l.id !== letterId);
        }

        saveEnvelopeData();
        closeLetterDetail();

        // 刷新对应列表
        if (type === 'outbox') renderOutboxList();
        else if (type === 'inbox') renderInboxList();
        else renderTimeLetterList();

        updateBadges();
        showNotification('信件已删除', 'success');
    };

    // ==================== 回信功能 ====================
    window.replyToLetter = function(letterId, type) {
        closeLetterDetail();

        // 打开写信表单，预填充
        openNewEnvelopeForm();

        const composeTitle = document.getElementById('env-compose-title');
        if (composeTitle) composeTitle.textContent = '写回信';

        const replyInfo = document.getElementById('env-reply-time-info');
        if (replyInfo) replyInfo.textContent = '这是一封回信，对方会优先回复';

        // 标记原信件
        let letter;
        if (type === 'inbox') {
            letter = envelopeData.inbox.find(l => l.id === letterId);
        } else {
            letter = envelopeData.timeLetters.find(l => l.id === letterId);
        }

        if (letter) {
            letter.isReplied = true;
            saveEnvelopeData();
        }
    };

    // ==================== 标记已读 ====================
    function markInboxAsRead() {
        let changed = false;
        envelopeData.inbox.forEach(letter => {
            if (!letter.isRead) {
                letter.isRead = true;
                changed = true;
            }
        });
        if (changed) {
            saveEnvelopeData();
            updateBadges();
        }
    }

    function markTimeLettersAsRead() {
        let changed = false;
        envelopeData.timeLetters.forEach(letter => {
            if (!letter.isRead) {
                letter.isRead = true;
                changed = true;
            }
        });
        if (changed) {
            saveEnvelopeData();
            updateBadges();
        }
    }

    // ==================== 徽章更新 ====================
    function updateBadges() {
        const unreadInbox = envelopeData.inbox.filter(l => !l.isRead).length;
        const unreadTime = envelopeData.timeLetters.filter(l => !l.isRead).length;

        const inboxBadge = document.getElementById('env-inbox-badge');
        if (inboxBadge) {
            if (unreadInbox > 0) {
                inboxBadge.textContent = unreadInbox > 99 ? '99+' : unreadInbox;
                inboxBadge.style.display = 'inline-flex';
            } else {
                inboxBadge.style.display = 'none';
            }
        }

        const timeBadge = document.getElementById('env-time-badge');
        if (timeBadge) {
            if (unreadTime > 0) {
                timeBadge.textContent = unreadTime > 99 ? '99+' : unreadTime;
                timeBadge.style.display = 'inline-flex';
            } else {
                timeBadge.style.display = 'none';
            }
        }

        // 更新信封按钮上的红点
        const totalUnread = unreadInbox + unreadTime;
        const envelopeBtn = document.getElementById('envelope-header-btn');
        if (envelopeBtn) {
            let badge = envelopeBtn.querySelector('.header-badge');
            if (totalUnread > 0) {
                if (!badge) {
                    badge = document.createElement('span');
                    badge.className = 'header-badge';
                    envelopeBtn.appendChild(badge);
                }
                badge.textContent = totalUnread > 99 ? '99+' : totalUnread;
                badge.style.display = 'flex';
            } else if (badge) {
                badge.style.display = 'none';
            }
        }
    }

    // ====
// ==================== 回复库管理 (reply-library.js) ====================
(function() {
    'use strict';

    // ========== 默认字卡库 ==========
    const DEFAULT_REPLY_LIBRARY = {
        reply: {
            main: [
                "想你了",
                "今天过得怎么样",
                "我在呢",
                "抱抱你",
                "要开心哦",
                "记得按时吃饭",
                "好想见到你",
                "你是最棒的",
                "我一直在",
                "爱你",
                "想和你一起看星星",
                "今天也很想你",
                "你笑起来的样子最好看",
                "我会一直陪着你",
                "不管发生什么我都在",
                "你是我最重要的人",
                "想听你说话",
                "和你在一起的时光最珍贵",
                "希望你一切都好",
                "想牵着你的手",
                "你的消息是我一天中最期待的事",
                "想和你一起去旅行",
                "你是我心里的光",
                "想给你最好的",
                "有你在真好",
                "想和你分享一切",
                "你是我最特别的存在",
                "想和你一起变老",
                "你的声音是我最喜欢的音乐",
                "想和你度过每一个节日",
                "你是我最美的遇见",
                "想和你一起吃很多顿饭",
                "你的笑容能治愈一切",
                "想和你看遍世间风景",
                "你是我最温暖的依靠",
                "想和你一直走下去",
                "你的存在让我的世界更美好",
                "想和你创造更多回忆",
                "你是我最珍贵的宝藏",
                "想和你分享喜怒哀乐",
                "你的一举一动都牵动着我的心",
                "想和你共度余生",
                "你是我生命中最美的意外",
                "想和你一起慢慢变老",
                "你的温柔是我最大的幸福",
                "想和你永远在一起",
                "你是我最坚定的选择",
                "想和你一起面对未来",
                "你的爱是我最大的勇气",
                "想和你携手走过每一天",
                "你是我最想要守护的人"
            ],
            kaomoji: [
                "(｡♥‿♥｡)",
                "(◕‿◕✿)",
                "(｡◕‿◕｡)",
                "(◍•ᴗ•◍)",
                "(｡･ω･｡)ﾉ♡",
                "(◕ᴗ◕✿)",
                "(｡♥‿♥｡)",
                "(◍•ᴗ•◍)❤",
                "(｡･ω･｡)ﾉ♡",
                "(◕‿◕)♡",
                "(｡♥‿♥｡)",
                "(◍•ᴗ•◍)✧",
                "(｡･ω･｡)ﾉ",
                "(◕ᴗ◕✿)",
                "(｡♥‿♥｡)ﾉ",
                "(◍•ᴗ•◍)♡",
                "(｡･ω･｡)ﾉ♡",
                "(◕‿◕✿)",
                "(｡♥‿♥｡)",
                "(◍•ᴗ•◍)❤"
            ],
            emoji: [
                "😊", "😍", "🥰", "😘", "💕",
                "💖", "💗", "💓", "💞", "💝",
                "❤️", "🧡", "💛", "💚", "💙",
                "💜", "🖤", "🤍", "🤎", "❣️",
                "💌", "🌹", "🌸", "🌺", "🌻",
                "🌷", "🌼", "🍀", "🌈", "⭐",
                "✨", "🎀", "🎁", "💐", "🦋"
            ]
        },
        atmosphere: {
            poke: [
                "拍了拍你的肩膀",
                "捏了捏你的脸",
                "摸了摸你的头",
                "戳了戳你的腰",
                "抱了抱你",
                "亲了亲你的额头",
                "牵了牵你的手",
                "揉了揉你的头发",
                "拍了拍你的背",
                "握了握你的手"
            ],
            status: [
                "正在想你",
                "等待你的消息",
                "看着你的照片发呆",
                "听着你喜欢的歌",
                "想象着和你见面的场景",
                "回忆着我们的点点滴滴",
                "期待着你的回复",
                "想着你的笑容",
                "感受着有你的幸福",
                "珍惜着和你在一起的每一刻"
            ],
            header: [
                "爱是我们的思绪 ✧",
                "Love",
                "Echo",
                "Soulmate",
                "Forever",
                "Together",
                "Dream",
                "Wish",
                "Hope",
                "Believe"
            ],
            opening: [
                "正在连接我们的思绪 ✧",
                "Love",
                "若爱由我来谈爱的话",
                "听见我的回音了吗？",
                "灵魂共振"
            ]
        },
        announcement: {
            titles: [
                "早上好",
                "中午好",
                "晚上好",
                "晚安",
                "想你"
            ],
            notes: [
                "今天也要元气满满，我在这里陪着你 ✦",
                "想你了，你有没有在想我呢",
                "记得照顾好自己，我会担心的",
                "不管多忙，都要记得想我哦",
                "你是我一天中最美好的期待",
                "希望今天的你也能开心",
                "我会一直在这里等你",
                "你的笑容是我最大的动力",
                "想和你一起度过每一天",
                "有你在，每一天都是美好的"
            ],
            statusPool: [
                { text: "在想你", label: "MISSING YOU", icon: "💭" },
                { text: "等你消息", label: "WAITING", icon: "📱" },
                { text: "很开心", label: "HAPPY", icon: "😊" },
                { text: "有点困", label: "SLEEPY", icon: "😴" },
                { text: "在发呆", label: "DAYDREAMING", icon: "✨" }
            ]
        }
    };

    // ========== 默认音效库 ==========
    const DEFAULT_SOUNDS = {
        mySend: { preset: 'tone_default', customUrl: '', volume: 15 },
        partnerMessage: { preset: 'tone_soft', customUrl: '', volume: 15 },
        myPoke: { preset: 'tone_warm', customUrl: '', volume: 15 },
        partnerPoke: { preset: 'tone_low', customUrl: '', volume: 15 },
        inviteStudy: { preset: 'default', customUrl: '', volume: 15 },
        inviteWork: { preset: 'default', customUrl: '', volume: 15 },
        inviteExercise: { preset: 'default', customUrl: '', volume: 15 },
        inviteSleep: { preset: 'default', customUrl: '', volume: 15 },
        inviteVideocall: { preset: 'default', customUrl: '', volume: 15 }
    };

    // 内置音效数据 (Base64编码的短音频)
    const BUILTIN_SOUNDS = {
        tone_default: generateTone(800, 0.1, 'sine'),
        tone_soft: generateTone(600, 0.15, 'sine'),
        tone_low: generateTone(400, 0.2, 'sine'),
        tone_warm: generateTone(700, 0.12, 'triangle'),
        tone_dark: generateTone(300, 0.25, 'sine'),
        tone_haze: generateTone(500, 0.18, 'sine'),
        kakaotalk: generateTone(900, 0.08, 'sine'),
        default: generateTone(650, 0.1, 'sine')
    };

    // 生成简单音调
    function generateTone(frequency, duration, type) {
        // 返回一个可以播放的音频数据对象
        return { frequency, duration, type, builtin: true };
    }

    // ========== 数据持久化 ==========
    function getReplyLibrary() {
        try {
            const saved = localStorage.getItem('customReplies');
            if (saved) {
                const parsed = JSON.parse(saved);
                // 合并默认值，确保新字段存在
                return mergeDeep(JSON.parse(JSON.stringify(DEFAULT_REPLY_LIBRARY)), parsed);
            }
        } catch (e) {
            console.error('读取回复库失败:', e);
        }
        return JSON.parse(JSON.stringify(DEFAULT_REPLY_LIBRARY));
    }

    function saveReplyLibrary(library) {
        localStorage.setItem('customReplies', JSON.stringify(library));
    }

    function getSoundSettings() {
        try {
            const saved = localStorage.getItem('soundSettings');
            if (saved) return JSON.parse(saved);
        } catch (e) {}
        return JSON.parse(JSON.stringify(DEFAULT_SOUNDS));
    }

    function saveSoundSettings(settings) {
        localStorage.setItem('soundSettings', JSON.stringify(settings));
    }

    // 深度合并对象
    function mergeDeep(target, source) {
        const output = Object.assign({}, target);
        if (isObject(target) && isObject(source)) {
            Object.keys(source).forEach(key => {
                if (isObject(source[key])) {
                    if (!(key in target)) Object.assign(output, { [key]: source[key] });
                    else output[key] = mergeDeep(target[key], source[key]);
                } else {
                    Object.assign(output, { [key]: source[key] });
                }
            });
        }
        return output;
    }

    function isObject(item) {
        return item && typeof item === 'object' && !Array.isArray(item);
    }

    // ========== 字卡拼接功能 ==========
    const DEFAULT_CARD_CONCAT_SETTINGS = {
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
                return { ...DEFAULT_CARD_CONCAT_SETTINGS, ...JSON.parse(saved) };
            }
        } catch(e) {}
        return { ...DEFAULT_CARD_CONCAT_SETTINGS };
    }

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
        const library = getReplyLibrary();
        if (library.reply && library.reply.main) {
            return library.reply.main.filter(item => item && (typeof item === 'string' ? item.trim() : (item.text || item.content)));
        }
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

        return { text, hasImage, images: [] };
    }

    // ========== 朋友圈数据管理 ==========
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

    // ========== 音效播放 ==========
    let audioContext = null;

    function getAudioContext() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        return audioContext;
    }

    function playBuiltinSound(soundKey, volume = 0.15) {
        const sound = BUILTIN_SOUNDS[soundKey];
        if (!sound || !sound.builtin) return false;

        try {
            const ctx = getAudioContext();
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.type = sound.type;
            oscillator.frequency.setValueAtTime(sound.frequency, ctx.currentTime);

            gainNode.gain.setValueAtTime(volume, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + sound.duration);

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + sound.duration);

            return true;
        } catch (e) {
            console.error('播放音效失败:', e);
            return false;
        }
    }

    function playSound(soundType) {
        const settings = getSoundSettings();
        const soundConfig = settings[soundType];
        if (!soundConfig) return;

        if (soundConfig.preset === 'mute') return;

        const volume = (soundConfig.volume || 15) / 100;

        // 优先播放自定义URL
        if (soundConfig.customUrl) {
            const audio = new Audio(soundConfig.customUrl);
            audio.volume = volume;
            audio.play().catch(() => {
                // 如果自定义播放失败，回退到内置音效
                playBuiltinSound(soundConfig.preset, volume);
            });
            return;
        }

        // 播放内置音效
        playBuiltinSound(soundConfig.preset, volume);
    }

    // ========== UI 初始化 ==========
    function initReplyLibraryUI() {
        // 确保默认数据存在
        if (!localStorage.getItem('customReplies')) {
            saveReplyLibrary(DEFAULT_REPLY_LIBRARY);
        }
        if (!localStorage.getItem('soundSettings')) {
            saveSoundSettings(DEFAULT_SOUNDS);
        }

        initCardConcatUI();
        initMomentUI();
    }

    // 字卡拼接UI初始化
    function initCardConcatUI() {
        const settings = getCardConcatSettings();

        // 主开关
        const toggle = document.getElementById('card-concat-toggle');
        const control = document.getElementById('card-concat-control');
        if (toggle) {
            const switchEl = toggle.querySelector('.setting-pill-switch');
            const knob = toggle.querySelector('.setting-pill-knob');
            if (settings.enabled) {
                if (switchEl) switchEl.style.background = 'var(--accent-color)';
                if (knob) knob.style.left = '23px';
                if (control) control.style.display = 'block';
            }
            toggle.addEventListener('click', function() {
                settings.enabled = !settings.enabled;
                if (switchEl) switchEl.style.background = settings.enabled ? 'var(--accent-color)' : 'var(--border-color)';
                if (knob) knob.style.left = settings.enabled ? '23px' : '3px';
                if (control) control.style.display = settings.enabled ? 'block' : 'none';
                saveCardConcatSettings(settings);
            });
        }

        // 最少条数
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

        // 最多条数
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

        // 概率
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

        // 朋友圈开关
        const momentToggle = document.getElementById('card-concat-moment-toggle');
        const momentControl = document.getElementById('card-concat-moment-control');
        if (momentToggle) {
            const switchEl = momentToggle.querySelector('.setting-pill-switch');
            const knob = momentToggle.querySelector('.setting-pill-knob');
            if (settings.momentEnabled) {
                if (switchEl) switchEl.style.background = 'var(--accent-color)';
                if (knob) knob.style.left = '23px';
                if (momentControl) momentControl.style.display = 'block';
            }
            momentToggle.addEventListener('click', function() {
                settings.momentEnabled = !settings.momentEnabled;
                if (switchEl) switchEl.style.background = settings.momentEnabled ? 'var(--accent-color)' : 'var(--border-color)';
                if (knob) knob.style.left = settings.momentEnabled ? '23px' : '3px';
                if (momentControl) momentControl.style.display = settings.momentEnabled ? 'block' : 'none';
                saveCardConcatSettings(settings);
                if (settings.momentEnabled) startMomentTimer();
                else stopMomentTimer();
            });
        }

        // 朋友圈间隔
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

        // 朋友圈最少字卡
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

        // 朋友圈最多字卡
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

        // 朋友圈图片概率
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

    // ========== 朋友圈定时器 ==========
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

    // 自动发布朋友圈
    function autoPublishMoment() {
        const content = generateMomentConcatContent();
        if (!content || !content.text) return;

        const moments = getMoments();
        const partnerName = (typeof settings !== 'undefined' && settings.partnerName) ? settings.partnerName : '梦角';
        const newMoment = {
            id: Date.now(),
            author: 'partner',
            authorName: partnerName,
            text: content.text,
            images: content.images,
            likes: [],
            comments: [],
            timestamp: Date.now()
        };
        moments.unshift(newMoment);
        saveMoments(moments);

        // 刷新朋友圈列表
        const momentModal = document.getElementById('moment-modal');
        if (momentModal && momentModal.classList.contains('active')) {
            renderMomentList();
        }

        // 显示通知
        if (typeof showNotification === 'function') {
            showNotification(partnerName + '发布了新动态 ✦', 'info');
        }
    }

    // ========== 朋友圈UI ==========
    function initMomentUI() {
        // 初始化朋友圈设置
        const savedSignature = localStorage.getItem('momentSignature');
        const signatureInput = document.getElementById('moment-signature-input');
        if (signatureInput && savedSignature) {
            signatureInput.value = savedSignature;
        }
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

    // ========== 导出/导入功能 ==========
    function exportData() {
        const data = {
            customReplies: getReplyLibrary(),
            soundSettings: getSoundSettings(),
            cardConcatSettings: getCardConcatSettings(),
            moments: getMoments(),
            exportTime: new Date().toISOString(),
            version: '1.0'
        };
        return JSON.stringify(data, null, 2);
    }

    function importData(jsonStr) {
        try {
            const data = JSON.parse(jsonStr);
            if (data.customReplies) saveReplyLibrary(data.customReplies);
            if (data.soundSettings) saveSoundSettings(data.soundSettings);
            if (data.cardConcatSettings) saveCardConcatSettings(data.cardConcatSettings);
            if (data.moments) saveMoments(data.moments);
            return true;
        } catch (e) {
            console.error('导入数据失败:', e);
            return false;
        }
    }

    // ========== 全局暴露 ==========
    window.getReplyLibrary = getReplyLibrary;
    window.saveReplyLibrary = saveReplyLibrary;
    window.getSoundSettings = getSoundSettings;
    window.saveSoundSettings = saveSoundSettings;
    window.playSound = playSound;
    window.getCardConcatSettings = getCardConcatSettings;
    window.saveCardConcatSettings = saveCardConcatSettings;
    window.generateConcatMessage = generateConcatMessage;
    window.generateMomentConcatContent = generateMomentConcatContent;
    window.getMoments = getMoments;
    window.saveMoments = saveMoments;
    window.renderMomentList = renderMomentList;
    window.autoPublishMoment = autoPublishMoment;
    window.startMomentTimer = startMomentTimer;
    window.stopMomentTimer = stopMomentTimer;
    window.exportData = exportData;
    window.importData = importData;
    window.initReplyLibraryUI = initReplyLibraryUI;

    // 朋友圈交互
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
        if (modal && typeof showModal === 'function') showModal(modal);
    };

    window.publishMoment = function() {
        const contentInput
/**
 * theme-editor.js - 主题编辑器模块
 * 提供完整的主题配色自定义编辑、快捷换肤、主题方案保存/切换功能
 */

(function() {
    'use strict';

    // ========== 默认主题变量 ==========
    const DEFAULT_THEME_VARS = {
        '--accent-color': '#c5a47e',
        '--accent-color-rgb': '197,164,126',
        '--primary-bg': '#faf8f5',
        '--secondary-bg': '#ffffff',
        '--chat-bg': '#f5f0eb',
        '--text-primary': '#2c2c2c',
        '--text-secondary': '#8a8a8a',
        '--border-color': 'rgba(0,0,0,0.08)',
        '--message-sent-bg': '#c5a47e',
        '--message-sent-text': '#ffffff',
        '--message-received-bg': '#f0ebe5',
        '--message-received-text': '#2c2c2c',
        '--welcome-bg': '#1a1a2e',
        '--welcome-text': '#e8e0d5',
        '--welcome-text-sub': '#a09080',
    };

    // 预设主题配色
    const PRESET_THEMES = {
        'gold': {
            '--accent-color': '#c5a47e',
            '--accent-color-rgb': '197,164,126',
            '--primary-bg': '#faf8f5',
            '--secondary-bg': '#ffffff',
            '--chat-bg': '#f5f0eb',
            '--text-primary': '#2c2c2c',
            '--text-secondary': '#8a8a8a',
            '--border-color': 'rgba(0,0,0,0.08)',
            '--message-sent-bg': '#c5a47e',
            '--message-sent-text': '#ffffff',
            '--message-received-bg': '#f0ebe5',
            '--message-received-text': '#2c2c2c',
            '--welcome-bg': '#1a1a2e',
            '--welcome-text': '#e8e0d5',
            '--welcome-text-sub': '#a09080',
        },
        'blue': {
            '--accent-color': '#6b8cae',
            '--accent-color-rgb': '107,140,174',
            '--primary-bg': '#f5f7fa',
            '--secondary-bg': '#ffffff',
            '--chat-bg': '#eef2f7',
            '--text-primary': '#2c2c2c',
            '--text-secondary': '#7a8a9a',
            '--border-color': 'rgba(0,0,0,0.08)',
            '--message-sent-bg': '#6b8cae',
            '--message-sent-text': '#ffffff',
            '--message-received-bg': '#e8eef5',
            '--message-received-text': '#2c2c2c',
            '--welcome-bg': '#1a1a2e',
            '--welcome-text': '#e8e0d5',
            '--welcome-text-sub': '#a09080',
        },
        'purple': {
            '--accent-color': '#9b7cb6',
            '--accent-color-rgb': '155,124,182',
            '--primary-bg': '#f8f5fa',
            '--secondary-bg': '#ffffff',
            '--chat-bg': '#f2eef5',
            '--text-primary': '#2c2c2c',
            '--text-secondary': '#8a7a9a',
            '--border-color': 'rgba(0,0,0,0.08)',
            '--message-sent-bg': '#9b7cb6',
            '--message-sent-text': '#ffffff',
            '--message-received-bg': '#ede8f2',
            '--message-received-text': '#2c2c2c',
            '--welcome-bg': '#1a1a2e',
            '--welcome-text': '#e8e0d5',
            '--welcome-text-sub': '#a09080',
        },
        'green': {
            '--accent-color': '#7cb69b',
            '--accent-color-rgb': '124,182,155',
            '--primary-bg': '#f5faf8',
            '--secondary-bg': '#ffffff',
            '--chat-bg': '#eef5f2',
            '--text-primary': '#2c2c2c',
            '--text-secondary': '#7a9a8a',
            '--border-color': 'rgba(0,0,0,0.08)',
            '--message-sent-bg': '#7cb69b',
            '--message-sent-text': '#ffffff',
            '--message-received-bg': '#e8f2ee',
            '--message-received-text': '#2c2c2c',
            '--welcome-bg': '#1a1a2e',
            '--welcome-text': '#e8e0d5',
            '--welcome-text-sub': '#a09080',
        },
        'pink': {
            '--accent-color': '#d4a5a5',
            '--accent-color-rgb': '212,165,165',
            '--primary-bg': '#faf5f5',
            '--secondary-bg': '#ffffff',
            '--chat-bg': '#f5eeee',
            '--text-primary': '#2c2c2c',
            '--text-secondary': '#9a8a8a',
            '--border-color': 'rgba(0,0,0,0.08)',
            '--message-sent-bg': '#d4a5a5',
            '--message-sent-text': '#ffffff',
            '--message-received-bg': '#f2e8e8',
            '--message-received-text': '#2c2c2c',
            '--welcome-bg': '#1a1a2e',
            '--welcome-text': '#e8e0d5',
            '--welcome-text-sub': '#a09080',
        },
        'black-white': {
            '--accent-color': '#333333',
            '--accent-color-rgb': '51,51,51',
            '--primary-bg': '#ffffff',
            '--secondary-bg': '#f5f5f5',
            '--chat-bg': '#f0f0f0',
            '--text-primary': '#1a1a1a',
            '--text-secondary': '#666666',
            '--border-color': 'rgba(0,0,0,0.1)',
            '--message-sent-bg': '#333333',
            '--message-sent-text': '#ffffff',
            '--message-received-bg': '#e8e8e8',
            '--message-received-text': '#1a1a1a',
            '--welcome-bg': '#0a0a0a',
            '--welcome-text': '#e0e0e0',
            '--welcome-text-sub': '#808080',
        },
        'pastel': {
            '--accent-color': '#e8a0a0',
            '--accent-color-rgb': '232,160,160',
            '--primary-bg': '#fdf8f8',
            '--secondary-bg': '#ffffff',
            '--chat-bg': '#f9f0f0',
            '--text-primary': '#3c3c3c',
            '--text-secondary': '#9a8a8a',
            '--border-color': 'rgba(0,0,0,0.06)',
            '--message-sent-bg': '#e8a0a0',
            '--message-sent-text': '#ffffff',
            '--message-received-bg': '#f5e8e8',
            '--message-received-text': '#3c3c3c',
            '--welcome-bg': '#2a1a1a',
            '--welcome-text': '#f0e0e0',
            '--welcome-text-sub': '#b0a0a0',
        },
        'sunset': {
            '--accent-color': '#d4a574',
            '--accent-color-rgb': '212,165,116',
            '--primary-bg': '#faf6f0',
            '--secondary-bg': '#ffffff',
            '--chat-bg': '#f5efe8',
            '--text-primary': '#2c2c2c',
            '--text-secondary': '#9a8a7a',
            '--border-color': 'rgba(0,0,0,0.08)',
            '--message-sent-bg': '#d4a574',
            '--message-sent-text': '#ffffff',
            '--message-received-bg': '#f2ebe3',
            '--message-received-text': '#2c2c2c',
            '--welcome-bg': '#2a1a0a',
            '--welcome-text': '#f0e8d8',
            '--welcome-text-sub': '#b0a080',
        },
        'forest': {
            '--accent-color': '#5a8a6a',
            '--accent-color-rgb': '90,138,106',
            '--primary-bg': '#f5f8f6',
            '--secondary-bg': '#ffffff',
            '--chat-bg': '#eef2ef',
            '--text-primary': '#2c2c2c',
            '--text-secondary': '#6a8a7a',
            '--border-color': 'rgba(0,0,0,0.08)',
            '--message-sent-bg': '#5a8a6a',
            '--message-sent-text': '#ffffff',
            '--message-received-bg': '#e5eee8',
            '--message-received-text': '#2c2c2c',
            '--welcome-bg': '#0a1a0e',
            '--welcome-text': '#d8e8dc',
            '--welcome-text-sub': '#80a088',
        },
        'ocean': {
            '--accent-color': '#4a7a9a',
            '--accent-color-rgb': '74,122,154',
            '--primary-bg': '#f5f7f9',
            '--secondary-bg': '#ffffff',
            '--chat-bg': '#eef2f5',
            '--text-primary': '#2c2c2c',
            '--text-secondary': '#6a8aaa',
            '--border-color': 'rgba(0,0,0,0.08)',
            '--message-sent-bg': '#4a7a9a',
            '--message-sent-text': '#ffffff',
            '--message-received-bg': '#e5eef2',
            '--message-received-text': '#2c2c2c',
            '--welcome-bg': '#0a1420',
            '--welcome-text': '#d8e4f0',
            '--welcome-text-sub': '#80a0b8',
        },
    };

    // 编辑器变量定义
    const EDITOR_VARS = [
        { key: '--accent-color', label: '强调色', type: 'color' },
        { key: '--primary-bg', label: '主背景', type: 'color' },
        { key: '--secondary-bg', label: '次背景', type: 'color' },
        { key: '--chat-bg', label: '聊天背景', type: 'color' },
        { key: '--text-primary', label: '主文字', type: 'color' },
        { key: '--text-secondary', label: '次文字', type: 'color' },
        { key: '--border-color', label: '边框色', type: 'color' },
        { key: '--message-sent-bg', label: '发送气泡', type: 'color' },
        { key: '--message-sent-text', label: '发送文字', type: 'color' },
        { key: '--message-received-bg', label: '接收气泡', type: 'color' },
        { key: '--message-received-text', label: '接收文字', type: 'color' },
        { key: '--welcome-bg', label: '欢迎背景', type: 'color' },
        { key: '--welcome-text', label: '欢迎文字', type: 'color' },
        { key: '--welcome-text-sub', label: '欢迎副文字', type: 'color' },
    ];

    // ========== 状态管理 ==========
    let currentThemeVars = { ...DEFAULT_THEME_VARS };
    let savedSchemes = [];
    let currentSchemeId = null;

    // ========== 工具函数 ==========
    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}` : null;
    }

    function getComputedVar(varName) {
        return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    }

    function setCssVar(varName, value) {
        document.documentElement.style.setProperty(varName, value);
        currentThemeVars[varName] = value;
        if (varName === '--accent-color') {
            const rgb = hexToRgb(value);
            if (rgb) {
                document.documentElement.style.setProperty('--accent-color-rgb', rgb);
                currentThemeVars['--accent-color-rgb'] = rgb;
            }
        }
    }

    function applyThemeVars(vars) {
        Object.entries(vars).forEach(([key, value]) => {
            document.documentElement.style.setProperty(key, value);
        });
        currentThemeVars = { ...vars };
    }

    // ========== 预设主题应用 ==========
    function applyPresetTheme(themeName) {
        const theme = PRESET_THEMES[themeName];
        if (!theme) return;
        applyThemeVars(theme);
        saveCurrentTheme();
        updateEditorInputs();
        updatePresetButtons(themeName);
        if (typeof showNotification === 'function') {
            showNotification(`已切换到「${getThemeLabel(themeName)}」主题 ✦`, 'success');
        }
    }

    function getThemeLabel(themeName) {
        const labels = {
            'gold': '金色', 'blue': '蓝色', 'purple': '紫色', 'green': '绿色',
            'pink': '粉色', 'black-white': '黑白', 'pastel': '红色', 'sunset': '橙色',
            'forest': '深绿', 'ocean': '深蓝'
        };
        return labels[themeName] || themeName;
    }

    function updatePresetButtons(activeTheme) {
        document.querySelectorAll('.theme-color-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === activeTheme);
        });
    }

    // ========== 编辑器功能 ==========
    function initThemeEditor() {
        const grid = document.getElementById('theme-editor-grid');
        if (!grid) return;

        grid.innerHTML = EDITOR_VARS.map(v => `
            <div class="theme-editor-item" data-var="${v.key}">
                <label class="theme-editor-label">${v.label}</label>
                <div class="theme-editor-input-wrap">
                    <input type="color" class="theme-editor-color-input" data-var="${v.key}" value="${currentThemeVars[v.key] || '#000000'}">
                    <input type="text" class="theme-editor-text-input" data-var="${v.key}" value="${currentThemeVars[v.key] || ''}" placeholder="CSS值">
                </div>
            </div>
        `).join('');

        // 绑定颜色输入事件
        grid.querySelectorAll('.theme-editor-color-input').forEach(input => {
            input.addEventListener('input', function() {
                const varName = this.dataset.var;
                const value = this.value;
                setCssVar(varName, value);
                const textInput = grid.querySelector(`.theme-editor-text-input[data-var="${varName}"]`);
                if (textInput) textInput.value = value;
                if (typeof throttledSaveData === 'function') throttledSaveData();
            });
        });

        // 绑定文本输入事件
        grid.querySelectorAll('.theme-editor-text-input').forEach(input => {
            input.addEventListener('change', function() {
                const varName = this.dataset.var;
                const value = this.value;
                setCssVar(varName, value);
                const colorInput = grid.querySelector(`.theme-editor-color-input[data-var="${varName}"]`);
                if (colorInput && value.startsWith('#')) colorInput.value = value;
                if (typeof throttledSaveData === 'function') throttledSaveData();
            });
        });
    }

    function updateEditorInputs() {
        const grid = document.getElementById('theme-editor-grid');
        if (!grid) return;
        grid.querySelectorAll('.theme-editor-color-input').forEach(input => {
            const varName = input.dataset.var;
            const val = currentThemeVars[varName];
            if (val && val.startsWith('#')) input.value = val;
        });
        grid.querySelectorAll('.theme-editor-text-input').forEach(input => {
            const varName = input.dataset.var;
            input.value = currentThemeVars[varName] || '';
        });
    }

    // ========== 主题方案管理 ==========
    function loadSavedSchemes() {
        try {
            const saved = localStorage.getItem('themeSchemes');
            if (saved) savedSchemes = JSON.parse(saved);
        } catch (e) { savedSchemes = []; }
        renderSchemesList();
    }

    function saveSchemes() {
        localStorage.setItem('themeSchemes', JSON.stringify(savedSchemes));
    }

    function saveCurrentAsScheme() {
        const name = prompt('为当前主题方案命名：');
        if (!name || !name.trim()) return;

        const scheme = {
            id: Date.now().toString(),
            name: name.trim(),
            vars: { ...currentThemeVars },
            timestamp: Date.now()
        };

        savedSchemes.push(scheme);
        saveSchemes();
        renderSchemesList();

        if (typeof showNotification === 'function') {
            showNotification(`主题方案「${name}」已保存 ✦`, 'success');
        }
    }

    function overwriteCurrentScheme() {
        if (!currentSchemeId) {
            saveCurrentAsScheme();
            return;
        }
        const scheme = savedSchemes.find(s => s.id === currentSchemeId);
        if (scheme) {
            scheme.vars = { ...currentThemeVars };
            scheme.timestamp = Date.now();
            saveSchemes();
            renderSchemesList();
            if (typeof showNotification === 'function') {
                showNotification(`已覆盖保存「${scheme.name}」✦`, 'success');
            }
        }
    }

    function renameScheme(id) {
        const scheme = savedSchemes.find(s => s.id === id);
        if (!scheme) return;
        const newName = prompt('重命名方案：', scheme.name);
        if (newName && newName.trim()) {
            scheme.name = newName.trim();
            saveSchemes();
            renderSchemesList();
        }
    }

    function deleteScheme(id) {
        if (!confirm('确定要删除这个主题方案吗？')) return;
        savedSchemes = savedSchemes.filter(s => s.id !== id);
        if (currentSchemeId === id) currentSchemeId = null;
        saveSchemes();
        renderSchemesList();
    }

    function applyScheme(id) {
        const scheme = savedSchemes.find(s => s.id === id);
        if (!scheme) return;
        applyThemeVars(scheme.vars);
        currentSchemeId = id;
        saveCurrentTheme();
        updateEditorInputs();
        renderSchemesList();
        if (typeof showNotification === 'function') {
            showNotification(`已应用主题方案「${scheme.name}」✦`, 'success');
        }
    }

    function renderSchemesList() {
        const container = document.getElementById('theme-schemes-list');
        const empty = document.getElementById('theme-schemes-empty');
        if (!container) return;

        if (savedSchemes.length === 0) {
            container.innerHTML = '';
            if (empty) empty.style.display = 'flex';
            return;
        }
        if (empty) empty.style.display = 'none';

        container.innerHTML = savedSchemes.map(scheme => {
            const isActive = scheme.id === currentSchemeId;
            const accentColor = scheme.vars['--accent-color'] || '#c5a47e';
            const primaryBg = scheme.vars['--primary-bg'] || '#faf8f5';
            const textPrimary = scheme.vars['--text-primary'] || '#2c2c2c';

            return `
                <div class="theme-scheme-card ${isActive ? 'active' : ''}" data-id="${scheme.id}" onclick="window.applyThemeScheme('${scheme.id}')">
                    <div class="theme-scheme-preview" style="background:${primaryBg};border-color:${accentColor}40;">
                        <div class="theme-scheme-dot" style="background:${accentColor};"></div>
                        <div class="theme-scheme-bar" style="background:${scheme.vars['--message-sent-bg'] || accentColor};"></div>
                        <div class="theme-scheme-bar2" style="background:${scheme.vars['--message-received-bg'] || '#f0ebe5'};"></div>
                    </div>
                    <div class="theme-scheme-info">
                        <div class="theme-scheme-name" style="color:${textPrimary};">${escapeHtml(scheme.name)}</div>
                        <div class="theme-scheme-date">${formatDate(scheme.timestamp)}</div>
                    </div>
                    <div class="theme-scheme-actions" onclick="event.stopPropagation()">
                        ${isActive ? '<i class="fas fa-check" style="color:var(--accent-color);"></i>' : ''}
                        <button onclick="window.renameThemeScheme('${scheme.id}')" title="重命名"><i class="fas fa-pen"></i></button>
                        <button onclick="window.deleteThemeScheme('${scheme.id}')" title="删除"><i class="fas fa-times"></i></button>
                    </div>
                </div>
            `;
        }).join('');
    }

    // ========== 全局CSS功能 ==========
    function applyGlobalCSS(css) {
        let styleEl = document.getElementById('global-custom-css');
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'global-custom-css';
            document.head.appendChild(styleEl);
        }
        styleEl.textContent = css || '';
    }

    function getGlobalCSS() {
        const styleEl = document.getElementById('global-custom-css');
        return styleEl ? styleEl.textContent : '';
    }

    // ========== 气泡CSS功能 ==========
    function applyBubbleCSS(css) {
        let styleEl = document.getElementById('bubble-custom-css');
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'bubble-custom-css';
            document.head.appendChild(styleEl);
        }
        styleEl.textContent = css || '';
    }

    function getBubbleCSS() {
        const styleEl = document.getElementById('bubble-custom-css');
        return styleEl ? styleEl.textContent : '';
    }

    // ========== 数据持久化 ==========
    function saveCurrentTheme() {
        try {
            localStorage.setItem('currentThemeVars', JSON.stringify(currentThemeVars));
        } catch (e) {}
    }

    function loadSavedTheme() {
        try {
            const saved = localStorage.getItem('currentThemeVars');
            if (saved) {
                const vars = JSON.parse(saved);
                applyThemeVars(vars);
            }
        } catch (e) {
            applyThemeVars(DEFAULT_THEME_VARS);
        }
    }

    // ========== 辅助函数 ==========
    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function formatDate(ts) {
        const d = new Date(ts);
        return `${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()}`;
    }

    // ========== 初始化 ==========
    function init() {
        loadSavedTheme();
        loadSavedSchemes();

        // 预设按钮事件
        document.querySelectorAll('.theme-color-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                applyPresetTheme(this.dataset.theme);
            });
        });

        // 保存方案按钮
        const saveBtn = document.getElementById('save-theme-scheme-btn');
        if (saveBtn) saveBtn.addEventListener('click', saveCurrentAsScheme);

        // 打开编辑器
        const openEditorBtn = document.getElementById('open-theme-editor');
        if (openEditorBtn) {
            openEditorBtn.addEventListener('click', function() {
                initThemeEditor();
                const modal = document.getElementById('theme-editor-modal');
                if (modal && typeof showModal === 'function') showModal(modal);
            });
        }

        // 编辑器内按钮
        const applyCloseBtn = document.getElementById('apply-close-theme-editor');
        if (applyCloseBtn) {
            applyCloseBtn.addEventListener('click', function() {
                saveCurrentTheme();
                const modal = document.getElementById('theme-editor-modal');
                if (modal && typeof hideModal === 'function') hideModal(modal);
            });
        }

        const resetEditorBtn = document.getElementById('reset-theme-editor');
        if (resetEditorBtn) {
            resetEditorBtn.addEventListener('click', function() {
                if (confirm('确定要重置为默认主题吗？')) {
                    applyThemeVars(DEFAULT_THEME_VARS);
                    updateEditorInputs();
                    saveCurrentTheme();
                }
            });
        }

        const closeEditorBtn = document.getElementById('close-theme-editor');
        if (closeEditorBtn) {
            closeEditorBtn.addEventListener('click', function() {
                const modal = document.getElementById('theme-editor-modal');
                if (modal && typeof hideModal === 'function') hideModal(modal);
            });
        }

        const overwriteBtn = document.getElementById('overwrite-theme-preset-btn');
        if (overwriteBtn) overwriteBtn.addEventListener('click', overwriteCurrentScheme);

        const savePresetBtn = document.getElementById('save-theme-preset-btn');
        if (savePresetBtn) savePresetBtn.addEventListener('click', saveCurrentAsScheme);

        const renamePresetBtn = document.getElementById('rename-theme-preset-btn');
        if (renamePresetBtn) renamePresetBtn.addEventListener('click', function() {
            if (currentSchemeId) renameScheme(currentSchemeId);
            else saveCurrentAsScheme();
        });

        const deletePresetBtn = document.getElementById('delete-theme-preset-btn');
        if (deletePresetBtn) {
            deletePresetBtn.addEventListener('click', function() {
                if (currentSchemeId) deleteScheme(currentSchemeId);
                else if (typeof showNotification === 'function') showNotification('请先选择一个方案', 'info');
            });
        }

        // 全局CSS
        const applyGlobalCssBtn = document.getElementById('apply-global-css-btn');
        if (applyGlobalCssBtn) {
            applyGlobalCssBtn.addEventListener('click', function() {
                const textarea = document.getElementById('custom-global-css');
                if (textarea) {
                    applyGlobalCSS(textarea.value);
                    localStorage.setItem('customGlobalCSS', textarea.value);
                    const status = document.getElementById('global-css-status');
                    if (status) {
                        status.style.display = 'block';
                        status.textContent = 'CSS 已应用 ✦';
                        setTimeout(() => status.style.display = 'none', 2000);
                    }
                }
            });
        }

        const resetGlobalCssBtn = document.getElementById('reset-global-css-btn');
        if (resetGlobalCssBtn) {
            resetGlobalCssBtn.addEventListener('click', function() {
                const textarea = document.getElementById('custom-global-css');
                if (textarea) textarea.value = '';
                applyGlobalCSS('');
                localStorage.removeItem('customGlobalCSS');
            });
        }

        const globalCssLiveToggle = document.getElementById('global-css-live-toggle');
        if (globalCssLiveToggle) {
            globalCssLiveToggle.addEventListener('change', function() {
                localStorage.setItem('globalCssLive', this.checked ? '1' : '0');
            });
            const liveEnabled = localStorage.getItem('globalCssLive') === '1';
            globalCssLiveToggle.checked = liveEnabled;
        }

        // 气泡CSS
        const applyCssBtn = document.getElementById('apply-css-btn');
        if (applyCssBtn) {
            applyCssBtn.addEventListener('click', function() {
                const textarea = document.getElementById('custom-bubble-css');
                if (textarea) {
                    applyBubbleCSS(textarea.value);
                    localStorage.setItem('customBubbleCSS', textarea.value);
                }
            });
        }

        const resetCssBtn = document.getElementById('reset-css-btn');
        if (resetCssBtn) {
            resetCssBtn.addEventListener('click', function() {
                const textarea = document.getElementById('custom-bubble-css');
                if (textarea) textarea.value = '';
                applyBubbleCSS('');
                localStorage.removeItem('customBubbleCSS');
            });
        }

        // 加载保存的CSS
        const savedGlobalCss = localStorage.getItem('customGlobalCSS');
        if (savedGlobalCss) {
            const textarea = document.getElementById('custom-global-css');
            if (textarea) textarea.value = savedGlobalCss;
            applyGlobalCSS(savedGlobalCss);
        }

        const savedBubbleCss = localStorage.getItem('customBubbleCSS');
        if (savedBubbleCss) {
            const textarea = document.getElementById('custom-bubble-css');
            if (textarea) textarea.value = savedBubbleCss;
            applyBubbleCSS(savedBubbleCss);
        }

        // 预设下拉框
        const presetSelector = document.getElementById('theme-preset-selector');
        if (presetSelector) {
            presetSelector.innerHTML = `
                <option value="">-- 选择预设 --</option>
                ${Object.keys(PRESET_THEMES).map(k => `<option value="${k}">${getThemeLabel(k)}</option>`).join('')}
            `;
            presetSelector.addEventListener('change', function() {
                if (this.value) applyPresetTheme(this.value);
            });
        }
    }

    // ========== 全局暴露 ==========
    window.applyPresetTheme = applyPresetTheme;
    window.applyThemeScheme = applyScheme;
    window.renameThemeScheme = renameScheme;
    window.deleteThemeScheme = deleteScheme;
    window.saveThemeScheme = saveCurrentAsScheme;
    window.getCurrentThemeVars = () => ({ ...currentThemeVars });
    window.getDefaultThemeVars = () => ({ ...DEFAULT_THEME_VARS });
    window.getPresetThemes = () => ({ ...PRESET_THEMES });
    window.applyGlobalCSS = applyGlobalCSS;
    window.applyBubbleCSS = applyBubbleCSS;

    // DOMReady初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
window.switchStatsTab = function(tab) {
    var statsPanel = document.getElementById('stats-panel');
    var favoritesPanel = document.getElementById('favorites-panel');
    var searchPanel = document.getElementById('search-panel');
    var wordcloudPanel = document.getElementById('wordcloud-panel');
    var allBtns = document.querySelectorAll('.stats-nav-btn');
    allBtns.forEach(function(b) { b.classList.remove('active'); });
    var activeBtn = document.querySelector('.stats-nav-btn[data-tab="' + tab + '"]');
    if (activeBtn) activeBtn.classList.add('active');

    if (statsPanel) statsPanel.style.display = 'none';
    if (favoritesPanel) favoritesPanel.style.display = 'none';
    if (searchPanel) searchPanel.style.display = 'none';
    if (wordcloudPanel) wordcloudPanel.style.display = 'none';

    if (tab === 'stats') {
        if (statsPanel) statsPanel.style.display = 'block';
    } else if (tab === 'search') {
        if (searchPanel) searchPanel.style.display = 'block';
        setTimeout(function() {
            var inp = document.getElementById('msg-search-input');
            if (inp) inp.focus();
        }, 100);
    } else if (tab === 'wordcloud') {
        if (wordcloudPanel) wordcloudPanel.style.display = 'block';
        requestAnimationFrame(function() {
            if (typeof renderWordCloud === 'function') renderWordCloud();
        });
    } else {
        if (favoritesPanel) favoritesPanel.style.display = 'block';
        if (typeof renderFavorites === 'function') renderFavorites();
    }
};

var groupChatSettings = (function() {
    try {
        var saved = JSON.parse(localStorage.getItem('groupChatSettings') || 'null');
        if (!saved) return { enabled: false, showAvatar: true, showName: true, members: [] };
        if (!saved.members) saved.members = [];
        return saved;
    } catch(e) { return { enabled: false, showAvatar: true, showName: true, members: [] }; }
})();
(function loadGroupAvatars() {
    if (!window.localforage) return;
    var members = groupChatSettings.members || [];
    if (members.length === 0) return;
    var promises = members.map(function(m, i) {
        var ref = m.avatarRef || (m.id ? 'gca_' + m.id : 'gca_' + i);
        return localforage.getItem(ref).then(function(avatar) {
            m.avatar = avatar || null;
        }).catch(function() { m.avatar = null; });
    });
    Promise.all(promises).then(function() {
        if (typeof renderGroupMembersList === 'function') renderGroupMembersList();
    });
})();
var _groupMemberAvatarDataUrl = null;

function saveGroupChatSettings() {
    var members = groupChatSettings.members || [];
    var toSave = {
        enabled: groupChatSettings.enabled,
        showAvatar: groupChatSettings.showAvatar,
        showName: groupChatSettings.showName,
        members: members.map(function(m) {
            if (!m.id) m.id = 'gcm_' + Date.now() + '_' + Math.random().toString(36).slice(2,7);
            return { name: m.name, id: m.id, avatarRef: 'gca_' + m.id };
        })
    };
    try {
        localStorage.setItem('groupChatSettings', JSON.stringify(toSave));
    } catch(e) {
        console.warn('groupChatSettings localStorage保存失败:', e);
    }
    if (window.localforage) {
        members.forEach(function(m) {
            if (!m.id) m.id = 'gcm_' + Date.now() + '_' + Math.random().toString(36).slice(2,7);
            localforage.setItem('gca_' + m.id, m.avatar || null).catch(function(e) {
                console.warn('头像存储失败 id=' + m.id, e);
            });
        });
    }
}

function renderGroupMembersList() {
    var list = document.getElementById('group-members-list');
    if (!list) return;
    if (!groupChatSettings.members || groupChatSettings.members.length === 0) {
        list.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text-secondary);font-size:13px;">暂无成员，点击添加按钮添加</div>';
        return;
    }
    list.innerHTML = groupChatSettings.members.map(function(m, i) {
        var avatarHtml = m.avatar
            ? '<img src="' + m.avatar + '" style="width:36px;height:36px;border-radius:50%;object-fit:cover;">'
            : '<div style="width:36px;height:36px;border-radius:50%;background:rgba(var(--accent-color-rgb),0.15);display:flex;align-items:center;justify-content:center;"><i class="fas fa-user" style="font-size:14px;color:var(--accent-color);"></i></div>';
        return '<div style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:var(--primary-bg);border:1px solid var(--border-color);border-radius:10px;">'
            + avatarHtml
            + '<span style="flex:1;font-size:13px;font-weight:500;">' + (m.name || '成员' + (i+1)) + '</span>'
            + '<button onclick="openEditGroupMember(' + i + ')" style="background:none;border:none;cursor:pointer;color:var(--accent-color);font-size:14px;padding:4px 8px;"><i class="fas fa-edit"></i></button>'
            + '<button onclick="deleteGroupMember(' + i + ')" style="background:none;border:none;cursor:pointer;color:#ff4757;font-size:14px;padding:4px 8px;"><i class="fas fa-trash-alt"></i></button>'
            + '</div>';
    }).join('');
}

function updateGroupModeUI() {
    var pill = document.getElementById('group-mode-pill');
    var knob = document.getElementById('group-mode-knob');
    var status = document.getElementById('group-mode-status');
    var displaySection = document.getElementById('group-display-section');
    var membersSection = document.getElementById('group-members-section');
    if (!pill) return;
    if (groupChatSettings.enabled) {
        pill.style.background = 'var(--accent-color)';
        knob.style.left = '22px';
        status.textContent = '已开启 — 收到的消息随机显示成员';
        displaySection.style.display = 'block';
        membersSection.style.display = 'block';
    } else {
        pill.style.background = 'var(--border-color)';
        knob.style.left = '3px';
        status.textContent = '已关闭 — 点击开启';
        displaySection.style.display = 'none';
        membersSection.style.display = 'none';
    }
    var avatarPill = document.getElementById('group-show-avatar-pill');
    var avatarKnob = document.getElementById('group-show-avatar-knob');
    if (avatarPill) {
        avatarPill.style.background = groupChatSettings.showAvatar ? 'var(--accent-color)' : 'var(--border-color)';
        avatarKnob.style.right = groupChatSettings.showAvatar ? '3px' : '19px';
    }
    var namePill = document.getElementById('group-show-name-pill');
    var nameKnob = document.getElementById('group-show-name-knob');
    if (namePill) {
        namePill.style.background = groupChatSettings.showName ? 'var(--accent-color)' : 'var(--border-color)';
        nameKnob.style.right = groupChatSettings.showName ? '3px' : '19px';
    }
    renderGroupMembersList();
}

document.addEventListener('DOMContentLoaded', function() {
    var groupModeToggle = document.getElementById('group-mode-toggle');
    if (groupModeToggle) {
        groupModeToggle.addEventListener('click', function() {
            groupChatSettings.enabled = !groupChatSettings.enabled;
            saveGroupChatSettings();
            updateGroupModeUI();
        });
    }
    var showAvatarToggle = document.getElementById('group-show-avatar-toggle');
    if (showAvatarToggle) {
        showAvatarToggle.addEventListener('click', function() {
            groupChatSettings.showAvatar = !groupChatSettings.showAvatar;
            saveGroupChatSettings();
            updateGroupModeUI();
        });
    }
    var showNameToggle = document.getElementById('group-show-name-toggle');
    if (showNameToggle) {
        showNameToggle.addEventListener('click', function() {
            groupChatSettings.showName = !groupChatSettings.showName;
            saveGroupChatSettings();
            updateGroupModeUI();
        });
    }
    var closeGroupChat = document.getElementById('close-group-chat');
    if (closeGroupChat) {
        closeGroupChat.addEventListener('click', function() {
            var m = document.getElementById('group-chat-modal');
            if (m && typeof hideModal === 'function') hideModal(m);
        });
    }
    setTimeout(updateGroupModeUI, 200);
});

window.openAddGroupMember = function() {
    _groupMemberAvatarDataUrl = null;
    document.getElementById('group-member-edit-title').textContent = '添加成员';
    document.getElementById('group-member-name-input').value = '';
    document.getElementById('group-member-edit-index').value = '';
    var preview = document.getElementById('group-member-avatar-preview');
    preview.innerHTML = '<i class="fas fa-camera" style="font-size:20px;color:var(--text-secondary);"></i>';
    var m = document.getElementById('group-member-edit-modal');
    if (m && typeof showModal === 'function') showModal(m);
};

window.openEditGroupMember = function(idx) {
    var member = groupChatSettings.members[idx];
    if (!member) return;
    _groupMemberAvatarDataUrl = member.avatar || null;
    document.getElementById('group-member-edit-title').textContent = '编辑成员';
    document.getElementById('group-member-name-input').value = member.name || '';
    document.getElementById('group-member-edit-index').value = idx;
    var preview = document.getElementById('group-member-avatar-preview');
    if (member.avatar) {
        preview.innerHTML = '<img src="' + member.avatar + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">';
    } else {
        preview.innerHTML = '<i class="fas fa-camera" style="font-size:20px;color:var(--text-secondary);"></i>';
    }
    var m = document.getElementById('group-member-edit-modal');
    if (m && typeof showModal === 'function') showModal(m);
};

window.closeGroupMemberEdit = function() {
    var m = document.getElementById('group-member-edit-modal');
    if (m && typeof hideModal === 'function') hideModal(m);
};

window.previewGroupMemberAvatar = function(input) {
    var file = input.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(e) {
        _groupMemberAvatarDataUrl = e.target.result;
        var preview = document.getElementById('group-member-avatar-preview');
        preview.innerHTML = '<img src="' + e.target.result + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">';
    };
    reader.readAsDataURL(file);
};

window.saveGroupMember = function() {
    var name = (document.getElementById('group-member-name-input').value || '').trim();
    if (!name) { alert('请输入成员名字'); return; }
    var idxVal = document.getElementById('group-member-edit-index').value;
    var member = { name: name, avatar: _groupMemberAvatarDataUrl };
    if (idxVal !== '') {
        groupChatSettings.members[parseInt(idxVal)] = member;
    } else {
        if (!groupChatSettings.members) groupChatSettings.members = [];
        groupChatSettings.members.push(member);
    }
    saveGroupChatSettings();
    renderGroupMembersList();
    window.closeGroupMemberEdit();
};

window.deleteGroupMember = function(idx) {
    if (!confirm('确定删除该成员吗？')) return;
    groupChatSettings.members.splice(idx, 1);
    saveGroupChatSettings();
    renderGroupMembersList();
};

window.getGroupMemberForMessage = function(msgId) {
    if (!groupChatSettings.enabled || !groupChatSettings.members || groupChatSettings.members.length === 0) return null;
    var seed = 0;
    var idStr = String(msgId);
    for (var i = 0; i < idStr.length; i++) seed += idStr.charCodeAt(i) * (i + 1);
    return groupChatSettings.members[seed % groupChatSettings.members.length];
};

document.addEventListener('DOMContentLoaded', function() {
    var exportAllBtn = document.getElementById('export-all-settings');
    var importAllBtn = document.getElementById('import-all-settings');
if (exportAllBtn) {
        exportAllBtn.addEventListener('click', async function() {
            const overlay = document.createElement('div');
            overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.55);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;animation:fadeIn 0.2s ease;';
            overlay.innerHTML = `
                <div style="background:var(--secondary-bg);border-radius:20px;padding:24px;width:88%;max-width:380px;box-shadow:0 20px 60px rgba(0,0,0,0.4);animation:modalContentSlideIn 0.3s ease forwards;">
                    <div style="font-size:15px;font-weight:700;color:var(--text-primary);margin-bottom:4px;display:flex;align-items:center;gap:8px;">
                        <i class="fas fa-archive" style="color:var(--accent-color);font-size:14px;"></i>全量备份导出
                    </div>
                    <div style="font-size:12px;color:var(--text-secondary);margin-bottom:16px;">默认导出为 <strong>ZIP</strong>：<code style="font-size:11px;">backup.json</code> 仅存结构与引用，大图在 <code style="font-size:11px;">media/</code>，避免单文件 JSON 过大导致无法解析。<br><span style="display:inline-block;margin-top:6px;color:var(--accent-color);">✓ 陪伴数据、陪伴日记、所有图片素材已自动包含</span></div>
                    <div style="display:flex;flex-direction:column;gap:9px;margin-bottom:20px;">
                        <label style="display:flex;align-items:center;gap:10px;cursor:pointer;padding:10px 12px;border:1px solid var(--border-color);border-radius:12px;background:var(--primary-bg);font-size:13px;color:var(--text-primary);">
                            <input type="checkbox" id="_bk_msgs" checked style="accent-color:var(--accent-color);width:15px;height:15px;">
                            <i class="fas fa-comments" style="color:var(--accent-color);width:16px;text-align:center;"></i>
                            <span>聊天记录 <span style="font-size:11px;color:var(--text-secondary);">(${messages.length} 条)</span></span>
                        </label>
                        <label style="display:flex;align-items:center;gap:10px;cursor:pointer;padding:10px 12px;border:1px solid var(--border-color);border-radius:12px;background:var(--primary-bg);font-size:13px;color:var(--text-primary);">
                            <input type="checkbox" id="_bk_settings" checked style="accent-color:var(--accent-color);width:15px;height:15px;">
                            <i class="fas fa-sliders-h" style="color:var(--accent-color);width:16px;text-align:center;"></i>
                            <span>外观与聊天设置</span>
                        </label>
                        <label style="display:flex;align-items:center;gap:10px;cursor:pointer;padding:10px 12px;border:1px solid var(--border-color);border-radius:12px;background:var(--primary-bg);font-size:13px;color:var(--text-primary);">
                            <input type="checkbox" id="_bk_custom" checked style="accent-color:var(--accent-color);width:15px;height:15px;">
                            <i class="fas fa-reply" style="color:var(--accent-color);width:16px;text-align:center;"></i>
                            <span>字卡 / 拍一拍 / 状态 / 格言</span>
                        </label>
                        <label style="display:flex;align-items:center;gap:10px;cursor:pointer;padding:10px 12px;border:1px solid var(--border-color);border-radius:12px;background:var(--primary-bg);font-size:13px;color:var(--text-primary);">
                            <input type="checkbox" id="_bk_ann" checked style="accent-color:var(--accent-color);width:15px;height:15px;">
                            <i class="fas fa-calendar-heart" style="color:var(--accent-color);width:16px;text-align:center;"></i>
                            <span>纪念日 / 倒计时</span>
                        </label>
                        <label style="display:flex;align-items:center;gap:10px;cursor:pointer;padding:10px 12px;border:1px solid var(--border-color);border-radius:12px;background:var(--primary-bg);font-size:13px;color:var(--text-primary);">
                            <input type="checkbox" id="_bk_themes" checked style="accent-color:var(--accent-color);width:15px;height:15px;">
                            <i class="fas fa-palette" style="color:var(--accent-color);width:16px;text-align:center;"></i>
                            <span>自定义主题 / 方案</span>
                        </label>
                        <label style="display:flex;align-items:center;gap:10px;cursor:pointer;padding:10px 12px;border:1px solid var(--border-color);border-radius:12px;background:var(--primary-bg);font-size:13px;color:var(--text-primary);">
                            <input type="checkbox" id="_bk_dg" checked style="accent-color:var(--accent-color);width:15px;height:15px;">
                            <i class="fas fa-sun" style="color:var(--accent-color);width:16px;text-align:center;"></i>
                            <span>每日公告 / 心情数据</span>
                        </label>
                        <label style="display:flex;align-items:center;gap:10px;cursor:pointer;padding:10px 12px;border:1px solid var(--border-color);border-radius:12px;background:var(--primary-bg);font-size:13px;color:var(--text-primary);">
                            <input type="checkbox" id="_bk_stickers" style="accent-color:var(--accent-color);width:15px;height:15px;">
                            <i class="fas fa-sticky-note" style="color:var(--accent-color);width:16px;text-align:center;"></i>
                            <span>表情库 <span style="font-size:11px;color:var(--text-secondary);">(默认关，勾选后去重打包)</span></span>
                        </label>
                    </div>
                    <div style="display:flex;gap:10px;">
                        <button id="_bk_cancel" style="flex:1;padding:11px;border:1px solid var(--border-color);border-radius:12px;background:none;color:var(--text-secondary);font-size:13px;cursor:pointer;font-family:var(--font-family);">取消</button>
                        <button id="_bk_confirm" style="flex:2;padding:11px;border:none;border-radius:12px;background:var(--accent-color);color:#fff;font-size:13px;font-weight:600;cursor:pointer;font-family:var(--font-family);display:flex;align-items:center;justify-content:center;gap:7px;">
                            <i class="fas fa-download"></i>导出备份
                        </button>
                    </div>
                </div>`;
            document.body.appendChild(overlay);

            function closeBkDialog() { overlay.remove(); }
            overlay.addEventListener('click', ev => { if (ev.target === overlay) closeBkDialog(); });
            const bkCancelBtn = document.getElementById('_bk_cancel');
            const bkConfirmBtn = document.getElementById('_bk_confirm');
            if (bkCancelBtn) bkCancelBtn.onclick = closeBkDialog;

            if (bkConfirmBtn) bkConfirmBtn.onclick = async function() {
                const inclMsgs    = document.getElementById('_bk_msgs').checked;
                const inclSet     = document.getElementById('_bk_settings').checked;
                const inclCustom  = document.getElementById('_bk_custom').checked;
                const inclAnn     = document.getElementById('_bk_ann').checked;
                const inclThemes  = document.getElementById('_bk_themes').checked;
                const inclDg      = document.getElementById('_bk_dg').checked;
                const inclStickers = document.getElementById('_bk_stickers') && document.getElementById('_bk_stickers').checked;

                if (!inclMsgs && !inclSet && !inclCustom && !inclAnn && !inclThemes && !inclDg && !inclStickers) {
                    showNotification('请至少选择一项', 'error');
                    return;
                }
                closeBkDialog();

                try {
                    if (typeof ChatBackup !== 'undefined' && ChatBackup.buildBackupPayload && ChatBackup.serializeBackupV4) {
                        const payload = await ChatBackup.buildBackupPayload({
                            inclMsgs: inclMsgs,
                            inclSet: inclSet,
                            inclCustom: inclCustom,
                            inclAnn: inclAnn,
                            inclThemes: inclThemes,
                            inclDg: inclDg,
                            inclStickers: inclStickers
                        });
                        const jsonString = ChatBackup.serializeBackupV4(payload);
                        const dateStr = new Date().toISOString().slice(0, 10);
                        const fileName = `chatapp-backup-${dateStr}.json`;
                        const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
                        downloadFileFallback(blob, fileName);
                        if (typeof showNotification === 'function') showNotification('已导出 JSON 备份', 'success');
                    } else {
                        if (typeof showNotification === 'function') showNotification('备份模块或函数未加载，请刷新页面', 'error');
                    }
                } catch(e) {
                    console.error('全量备份导出失败:', e);
                    if (typeof showNotification === 'function') showNotification('导出失败，请重试', 'error');
                }
            };
        });
    }
if (importAllBtn) {
        importAllBtn.addEventListener('click', function() {
            var input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json,.zip,application/json,application/zip';
            input.onchange = async function(e) {
                var file = e.target.files[0];
                if (!file) return;

                if (file.size > 220 * 1024 * 1024) {
                    if (typeof showNotification === 'function') showNotification('文件过大，请检查是否是正确的备份文件', 'error');
                    return;
                }

                try {
                    if (typeof ChatBackup === 'undefined' || !ChatBackup.loadBackupFromFile || !ChatBackup.applyBackupToStorage) {
                        throw new Error('备份模块未加载，请刷新页面');
                    }
                    var backup = await ChatBackup.loadBackupFromFile(file);

                    var okShape = backup.type === 'chatapp-backup-v5' ||
                        backup.type === 'full' ||
                        (backup.type && backup.type.indexOf('backup') !== -1) ||
                        backup.formatVersion === 4 ||
                        backup.formatVersion === 5 ||
                        backup.localforage ||
                        backup.indexedDB;
                    if (!okShape) throw new Error('不是有效的传讯备份文件');

                    if (!confirm('导入全量备份将覆盖备份文件中包含的数据（按文件内容写入）。\n\nv5 ZIP：从 media/ 还原图片；v4 JSON：从 mediaStore 还原。\n\n确定继续吗？')) return;

                    await ChatBackup.applyBackupToStorage(backup, { selective: false });

                    if (typeof showNotification === 'function') showNotification('数据恢复成功，即将刷新页面应用更改', 'success', 2000);
                    setTimeout(function() { location.reload(); }, 2000);
                } catch (err) {
                    var msg = err && err.message ? err.message : '未知错误';
                    if (typeof showNotification === 'function') showNotification('导入失败：' + msg, 'error', 5000);
                    console.error('导入报错:', err);
                }
            };
            document.body.appendChild(input);
            input.click();
            document.body.removeChild(input);
        });
    }
});

window.startEditDgWeather = function(el) {
    var current = el.textContent.trim();
    var input = document.createElement('input');
    input.type = 'text';
    input.value = current;
    input.maxLength = 20;
    input.style.cssText = 'width:120px;padding:2px 6px;border:1px solid var(--accent-color);border-radius:6px;font-size:13px;background:var(--primary-bg);color:var(--text-primary);outline:none;';
    el.style.display = 'none';
    el.parentNode.insertBefore(input, el.nextSibling);
    input.focus();
    input.select();
    function saveWeather() {
        var val = input.value.trim() || current;
        el.textContent = val;
        el.style.display = '';
        input.remove();
        var now = new Date();
        var dateKey = 'customWeather_' + now.getFullYear() + '_' + (now.getMonth()+1) + '_' + now.getDate();
        localStorage.setItem(dateKey, val);
    }
    input.addEventListener('blur', saveWeather);
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') { e.preventDefault(); saveWeather(); }
        if (e.key === 'Escape') { el.style.display = ''; input.remove(); }
    });
};

    document.addEventListener('focusin', function(e) {
        if (e.target && (e.target.classList.contains('message-input') || e.target.tagName === 'TEXTAREA')) {
            setTimeout(function() {
                var chat = document.querySelector('.chat-container');
                if (chat) chat.scrollTop = chat.scrollHeight;
            }, 100);
        }
    });


window._runMsgSearch = function() {
    var input = document.getElementById('msg-search-input');
    var dateFrom = document.getElementById('msg-search-date-from');
    var dateTo = document.getElementById('msg-search-date-to');
    var resultsEl = document.getElementById('msg-search-results');
    if (!input || !resultsEl) return;

    var q = input.value.trim().toLowerCase();
    var from = dateFrom && dateFrom.value ? new Date(dateFrom.value) : null;
    var to = dateTo && dateTo.value ? new Date(dateTo.value + 'T23:59:59') : null;

    var allMessages = (typeof messages !== 'undefined' ? messages : [])
        .filter(function(m) { return m.type !== 'system'; });

    var filtered = allMessages.filter(function(m) {
        var matchText = !q || (m.text && m.text.toLowerCase().includes(q)) || (m.image && !q);
        if (q && m.image && !m.text) matchText = false;
        if (q) matchText = m.text && m.text.toLowerCase().includes(q);
        var ts = m.timestamp ? new Date(m.timestamp) : null;
        var matchFrom = !from || (ts && ts >= from);
        var matchTo = !to || (ts && ts <= to);
        return matchText && matchFrom && matchTo;
    });

    if (!q && !from && !to) {
        resultsEl.innerHTML = '<div style="text-align:center;padding:24px;color:var(--text-secondary);font-size:13px;">输入关键词或选择日期开始搜索</div>';
        return;
    }

    if (filtered.length === 0) {
        resultsEl.innerHTML = '<div style="text-align:center;padding:24px;color:var(--text-secondary);font-size:13px;">未找到相关消息</div>';
        return;
    }

    var myAvatarEl = document.querySelector('#my-avatar img');
    var partnerAvatarEl = document.querySelector('#partner-avatar img');
    var myAvatar = myAvatarEl ? myAvatarEl.src : '';
    var partnerAvatar = partnerAvatarEl ? partnerAvatarEl.src : '';
    var myName = (typeof settings !== 'undefined' && settings.myName) || '我';
    var partnerName = (typeof settings !== 'undefined' && settings.partnerName) || '对方';

    function highlight(text) {
        if (!q || !text) return (text || '').replace(/</g,'&lt;').replace(/>/g,'&gt;');
        var safe = text.replace(/</g,'&lt;').replace(/>/g,'&gt;');
        var safeQ = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return safe.replace(new RegExp('(' + safeQ + ')', 'gi'), '<mark style="background:rgba(var(--accent-color-rgb,180,140,100),0.3);border-radius:2px;padding:0 1px;">$1</mark>');
    }

    resultsEl.innerHTML = filtered.map(function(msg) {
        var isUser = msg.sender === 'user';
        var name = isUser ? myName : partnerName;
        var avatar = isUser ? myAvatar : partnerAvatar;

        if (!isUser && typeof groupChatSettings !== 'undefined' && groupChatSettings.enabled && groupChatSettings.members) {
            var member = groupChatSettings.members.find(function(m) { return m.name === msg.sender; });
            if (member) {
                name = member.name;
                avatar = member.avatar || '';
            }
        }

        var ts = msg.timestamp ? new Date(msg.timestamp).toLocaleString('zh-CN', {
            month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit'
        }) : '';

        var avatarHtml = avatar
            ? '<img src="' + avatar + '" style="width:34px;height:34px;border-radius:50%;object-fit:cover;flex-shrink:0;">'
            : '<div style="width:34px;height:34px;border-radius:50%;background:rgba(var(--accent-color-rgb,180,140,100),0.18);display:flex;align-items:center;justify-content:center;flex-shrink:0;"><i class="fas fa-user" style="font-size:14px;color:var(--accent-color);"></i></div>';

        var contentHtml = '';
        if (msg.text) contentHtml += '<div style="font-size:13px;color:var(--text-primary);line-height:1.5;word-break:break-word;margin-top:3px;">' + highlight(msg.text) + '</div>';
        if (msg.image) contentHtml += '<img src="' + msg.image + '" style="max-width:120px;max-height:90px;border-radius:8px;display:block;margin-top:5px;cursor:pointer;" onclick="if(typeof viewImage===\'function\')viewImage(\'' + msg.image.replace(/'/g,"\\'") + '\')" loading="lazy">';

        return '<div style="display:flex;align-items:flex-start;gap:10px;padding:10px 12px;border-radius:12px;background:var(--primary-bg);border:1px solid var(--border-color);margin-bottom:8px;cursor:pointer;" onclick="if(typeof scrollToMessage===\'function\')scrollToMessage(' + msg.id + ')">'
            + avatarHtml
            + '<div style="flex:1;min-width:0;">'
            + '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">'
            + '<span style="font-size:12px;font-weight:600;color:var(--accent-color);">' + name + '</span>'
            + '<span style="font-size:11px;color:var(--text-secondary);white-space:nowrap;">' + ts + '</span>'
            + '</div>'
            + contentHtml
            + '</div></div>';
    }).join('');

    resultsEl.insertAdjacentHTML('afterbegin',
        '<div style="font-size:12px;color:var(--text-secondary);margin-bottom:8px;padding:0 2px;">共找到 ' + filtered.length + ' 条结果</div>'
    );
};

window.scrollToMessage = function(msgId) {
    var el = document.querySelector('[data-id="' + msgId + '"]');
    if (el) {
        el.sc
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
    function add
/**
 * companion.js - 陪伴功能模块
 * 功能：一起学习、一起工作、一起运动、一起睡觉
 * 包含：模式选择、时间设置、全屏陪伴、背景音、气泡对话、陪伴日记
 */

(function() {
    'use strict';

    // ==================== 配置常量 ====================
    const COMPANION_MODES = {
        study: { icon: 'fa-book-open', label: '学习', hint: 'STUDY', color: '#8B7EC8' },
        work: { icon: 'fa-laptop-code', label: '工作', hint: 'WORK', color: '#6B8E9F' },
        exercise: { icon: 'fa-person-running', label: '运动', hint: 'EXERCISE', color: '#E07A5F' },
        sleep: { icon: 'fa-moon', label: '睡觉', hint: 'SLEEP', color: '#4A5568' }
    };

    const TIME_OPTIONS = [
        { label: '15分钟', value: 15 * 60 },
        { label: '30分钟', value: 30 * 60 },
        { label: '45分钟', value: 45 * 60 },
        { label: '1小时', value: 60 * 60 },
        { label: '1.5小时', value: 90 * 60 },
        { label: '2小时', value: 120 * 60 },
        { label: '3小时', value: 180 * 60 },
        { label: '自定义', value: -1 }
    ];

    const HINT_TEXTS = {
        study: ['正在一起学习 · 加油', '专注当下，效率翻倍', '知识在积累，未来在靠近'],
        work: ['正在一起工作 · 高效', '专注任务，稳步推进', '工作虽忙，有我在旁'],
        exercise: ['正在一起运动 · 坚持', '动起来，更健康', '每一滴汗水都算数'],
        sleep: ['正在一起休息 · 晚安', '放下手机，安心入睡', '好梦，明天见']
    };

    // ==================== 状态管理 ====================
    let companionState = {
        mode: null,
        duration: 0,
        remaining: 0,
        isRunning: false,
        timerId: null,
        startTime: null,
        bgDataUrl: null,
        voices: [],
        noiseAudio: null,
        noiseEnabled: false,
        messages: [],
        initBy: 'user' // 'user' | 'partner'
    };

    // ==================== DOM 引用缓存 ====================
    let $ = {};

    function cacheDOM() {
        $.companionModal = document.getElementById('companion-modal');
        $.setupModal = document.getElementById('setup-modal');
        $.timeModal = document.getElementById('time-modal');
        $.companionPage = document.getElementById('companion-page');
        $.companionBgContainer = document.getElementById('companion-bg-container');
        $.companionTimerDisplay = document.getElementById('companion-timer-display');
        $.companionTimerLabel = document.getElementById('companion-timer-label');
        $.companionHintText = document.getElementById('companion-hint-text');
        $.companionBubbleArea = document.getElementById('companion-bubble-area');
        $.companionInputBar = document.getElementById('companion-input-bar');
        $.companionInputField = document.getElementById('companion-input-field');
        $.companionTypingIndicator = document.getElementById('companion-typing-indicator');
        $.companionExitConfirm = document.getElementById('companion-exit-confirm');
        $.companionNoiseBtn = document.getElementById('companion-noise-btn');
        $.companionHistoryBtn = document.getElementById('companion-history-btn');
        $.companionKeyboardBtn = document.getElementById('companion-keyboard-btn');
        $.setupBgPreview = document.getElementById('setup-bg-preview');
        $.setupBgTrigger = document.getElementById('setup-bg-trigger');
        $.setupBgInput = document.getElementById('setup-bg-input');
        $.setupVoiceTrigger = document.getElementById('setup-voice-trigger');
        $.setupVoiceInput = document.getElementById('setup-voice-input');
        $.setupVoiceList = document.getElementById('setup-voice-list');
        $.setupBtnNext = document.getElementById('setup-btn-next');
        $.setupBtnFinish = document.getElementById('setup-btn-finish');
        $.setupBtnSkip = document.getElementById('setup-btn-skip');
        $.setupBtnCancel = document.getElementById('setup-btn-cancel');
        $.setupStepBg = document.getElementById('setup-step-bg');
        $.setupStepVoice = document.getElementById('setup-step-voice');
        $.timeOptionsGrid = document.getElementById('time-options-grid');
        $.timeModalTitle = document.getElementById('time-modal-title');
        $.timeModalIcon = document.getElementById('time-modal-icon');
        $.setupModalTitle = document.getElementById('setup-modal-title');
        $.setupModalIcon = document.getElementById('setup-modal-icon');
    }

    // ==================== 工具函数 ====================
    function formatTime(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        if (h > 0) {
            return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
        }
        return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    }

    function showNotification(msg, type) {
        if (window.showNotification) {
            window.showNotification(msg, type);
        } else {
            console.log(`[${type}] ${msg}`);
        }
    }

    function showModal(modal) {
        if (!modal) return;
        modal.style.display = 'flex';
        modal.classList.add('active');
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.style.transform = 'scale(1)';
        }, 10);
    }

    function hideModal(modal) {
        if (!modal) return;
        modal.style.opacity = '0';
        modal.style.transform = 'scale(0.95)';
        setTimeout(() => {
            modal.style.display = 'none';
            modal.classList.remove('active');
        }, 250);
    }

    function getCompanionData() {
        try {
            const data = localStorage.getItem('companionData');
            return data ? JSON.parse(data) : {};
        } catch(e) {
            return {};
        }
    }

    function saveCompanionData(data) {
        localStorage.setItem('companionData', JSON.stringify(data));
    }

    function getCompanionDiary() {
        try {
            const data = localStorage.getItem('companionDiary');
            return data ? JSON.parse(data) : [];
        } catch(e) {
            return [];
        }
    }

    function saveCompanionDiary(diary) {
        localStorage.setItem('companionDiary', JSON.stringify(diary));
    }

    // ==================== 模式选择 ====================
    function initModeSelection() {
        const cards = document.querySelectorAll('.companion-mode-card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const mode = card.dataset.mode;
                openCompanionSetup(mode);
            });
        });

        // 关闭按钮
        const closeBtn = document.getElementById('companion-modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => hideModal($.companionModal));
        }
    }

    // ==================== 初始化设置弹窗 ====================
    function openCompanionSetup(mode) {
        companionState.mode = mode;
        const config = COMPANION_MODES[mode];

        // 更新弹窗标题
        if ($.setupModalTitle) $.setupModalTitle.textContent = `陪我${config.label}`;
        if ($.setupModalIcon) $.setupModalIcon.className = `fas ${config.icon}`;

        // 重置步骤
        if ($.setupStepBg) $.setupStepBg.style.display = 'block';
        if ($.setupStepVoice) $.setupStepVoice.style.display = 'none';
        if ($.setupBtnNext) $.setupBtnNext.style.display = 'none';

        // 重置预览
        companionState.bgDataUrl = null;
        companionState.voices = [];
        if ($.setupBgPreview) {
            $.setupBgPreview.style.display = 'none';
            $.setupBgPreview.innerHTML = '';
        }
        if ($.setupVoiceList) $.setupVoiceList.innerHTML = '';

        // 加载已保存的背景
        const savedData = getCompanionData();
        if (savedData[mode] && savedData[mode].bg) {
            companionState.bgDataUrl = savedData[mode].bg;
            showBgPreview(savedData[mode].bg);
            if ($.setupBtnNext) $.setupBtnNext.style.display = 'inline-flex';
        }

        showModal($.setupModal);
    }

    // ==================== 背景上传 ====================
    function initBgUpload() {
        if (!$.setupBgTrigger || !$.setupBgInput) return;

        $.setupBgTrigger.addEventListener('click', () => $.setupBgInput.click());

        $.setupBgInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            if (file.size > 100 * 1024 * 1024) {
                showNotification('文件过大，请控制在100MB以内', 'error');
                return;
            }

            const reader = new FileReader();
            reader.onload = (ev) => {
                companionState.bgDataUrl = ev.target.result;
                showBgPreview(ev.target.result);
                if ($.setupBtnNext) $.setupBtnNext.style.display = 'inline-flex';

                // 保存到对应模式
                const savedData = getCompanionData();
                if (!savedData[companionState.mode]) savedData[companionState.mode] = {};
                savedData[companionState.mode].bg = ev.target.result;
                saveCompanionData(savedData);
            };
            reader.readAsDataURL(file);
        });
    }

    function showBgPreview(dataUrl) {
        if (!$.setupBgPreview) return;
        $.setupBgPreview.style.display = 'block';

        const isVideo = dataUrl.startsWith('data:video');
        if (isVideo) {
            $.setupBgPreview.innerHTML = `<video src="${dataUrl}" autoplay loop muted playsinline style="width:100%;height:100%;object-fit:cover;border-radius:12px;"></video>`;
        } else {
            $.setupBgPreview.innerHTML = `<img src="${dataUrl}" style="width:100%;height:100%;object-fit:cover;border-radius:12px;">`;
        }
    }

    // ==================== 语音上传 ====================
    function initVoiceUpload() {
        if (!$.setupVoiceTrigger || !$.setupVoiceInput) return;

        $.setupVoiceTrigger.addEventListener('click', () => $.setupVoiceInput.click());

        $.setupVoiceInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            files.forEach(file => {
                if (file.size > 50 * 1024 * 1024) {
                    showNotification('语音文件过大', 'error');
                    return;
                }
                const reader = new FileReader();
                reader.onload = (ev) => {
                    const voice = {
                        id: Date.now() + Math.random(),
                        name: file.name,
                        dataUrl: ev.target.result
                    };
                    companionState.voices.push(voice);
                    renderVoiceList();

                    // 保存
                    const savedData = getCompanionData();
                    if (!savedData[companionState.mode]) savedData[companionState.mode] = {};
                    if (!savedData[companionState.mode].voices) savedData[companionState.mode].voices = [];
                    savedData[companionState.mode].voices.push(voice);
                    saveCompanionData(savedData);
                };
                reader.readAsDataURL(file);
            });
        });
    }

    function renderVoiceList() {
        if (!$.setupVoiceList) return;
        $.setupVoiceList.innerHTML = companionState.voices.map((v, i) => `
            <div class="companion-voice-item" data-id="${v.id}">
                <i class="fas fa-music"></i>
                <span>${v.name}</span>
                <button class="companion-voice-play" onclick="window.playCompanionVoice('${v.id}')">
                    <i class="fas fa-play"></i>
                </button>
                <button class="companion-voice-remove" onclick="window.removeCompanionVoice('${v.id}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
    }

    window.playCompanionVoice = function(voiceId) {
        const voice = companionState.voices.find(v => String(v.id) === String(voiceId));
        if (!voice) return;
        const audio = new Audio(voice.dataUrl);
        audio.play();
    };

    window.removeCompanionVoice = function(voiceId) {
        companionState.voices = companionState.voices.filter(v => String(v.id) !== String(voiceId));
        renderVoiceList();

        const savedData = getCompanionData();
        if (savedData[companionState.mode]) {
            savedData[companionState.mode].voices = companionState.voices;
            saveCompanionData(savedData);
        }
    };

    // ==================== 设置步骤导航 ====================
    function initSetupNavigation() {
        // 下一步
        if ($.setupBtnNext) {
            $.setupBtnNext.addEventListener('click', () => {
                if ($.setupStepBg) $.setupStepBg.style.display = 'none';
                if ($.setupStepVoice) $.setupStepVoice.style.display = 'block';

                // 加载已保存的语音
                const savedData = getCompanionData();
                if (savedData[companionState.mode] && savedData[companionState.mode].voices) {
                    companionState.voices = savedData[companionState.mode].voices;
                    renderVoiceList();
                }
            });
        }

        // 跳过
        if ($.setupBtnSkip) {
            $.setupBtnSkip.addEventListener('click', () => {
                hideModal($.setupModal);
                openTimeSelection();
            });
        }

        // 完成
        if ($.setupBtnFinish) {
            $.setupBtnFinish.addEventListener('click', () => {
                hideModal($.setupModal);
                openTimeSelection();
            });
        }

        // 取消
        if ($.setupBtnCancel) {
            $.setupBtnCancel.addEventListener('click', () => hideModal($.setupModal));
        }
    }

    // ==================== 时间选择 ====================
    function openTimeSelection() {
        const config = COMPANION_MODES[companionState.mode];
        if ($.timeModalTitle) $.timeModalTitle.textContent = `陪我${config.label}`;
        if ($.timeModalIcon) $.timeModalIcon.className = `fas ${config.icon}`;

        // 生成时间选项
        if ($.timeOptionsGrid) {
            $.timeOptionsGrid.innerHTML = TIME_OPTIONS.map(opt => `
                <button class="companion-time-btn" data-value="${opt.value}">
                    <span class="companion-time-btn-label">${opt.label}</span>
                </button>
            `).join('');

            // 绑定点击
            $.timeOptionsGrid.querySelectorAll('.companion-time-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const value = parseInt(btn.dataset.value);
                    if (value === -1) {
                        // 自定义时间
                        const custom = prompt('请输入分钟数:', '60');
                        if (custom && !isNaN(custom)) {
                            startCompanion(parseInt(custom) * 60);
                        }
                    } else {
                        startCompanion(value);
                    }
                    hideModal($.timeModal);
                });
            });
        }

        showModal($.timeModal);
    }

    // 关闭时间弹窗
    function initTimeModalClose() {
        const closeBtn = document.getElementById('time-modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => hideModal($.timeModal));
        }
    }

    // ==================== 开始陪伴 ====================
    function startCompanion(durationSeconds) {
        companionState.duration = durationSeconds;
        companionState.remaining = durationSeconds;
        companionState.isRunning = true;
        companionState.startTime = Date.now();
        companionState.messages = [];
        companionState.initBy = 'user';

        const config = COMPANION_MODES[companionState.mode];

        // 设置背景
        if ($.companionBgContainer && companionState.bgDataUrl) {
            const isVideo = companionState.bgDataUrl.startsWith('data:video');
            if (isVideo) {
                $.companionBgContainer.innerHTML = `<video src="${companionState.bgDataUrl}" autoplay loop muted playsinline style="width:100%;height:100%;object-fit:cover;"></video>`;
            } else {
                $.companionBgContainer.innerHTML = `<img src="${companionState.bgDataUrl}" style="width:100%;height:100%;object-fit:cover;">`;
            }
        } else if ($.companionBgContainer) {
            // 默认渐变背景
            $.companionBgContainer.innerHTML = `<div style="width:100%;height:100%;background:linear-gradient(135deg, ${config.color}22, ${config.color}44);"></div>`;
        }

        // 设置标签
        if ($.companionTimerLabel) $.companionTimerLabel.textContent = config.hint;

        // 更新提示文字
        updateHintText();

        // 显示页面
        if ($.companionPage) {
            $.companionPage.style.display = 'flex';
            setTimeout(() => $.companionPage.style.opacity = '1', 10);
        }

        // 启动计时器
        updateTimerDisplay();
        companionState.timerId = setInterval(() => {
            companionState.remaining--;
            updateTimerDisplay();

            if (companionState.remaining <= 0) {
                finishCompanion();
            }
        }, 1000);

        // 随机气泡
        startRandomBubbles();

        showNotification(`开始陪伴 - ${config.label}模式 ✦`, 'success');
    }

    function updateTimerDisplay() {
        if ($.companionTimerDisplay) {
            $.companionTimerDisplay.textContent = formatTime(companionState.remaining);
        }
    }

    function updateHintText() {
        const hints = HINT_TEXTS[companionState.mode] || ['陪伴中...'];
        const hint = hints[Math.floor(Math.random() * hints.length)];
        if ($.companionHintText) $.companionHintText.textContent = hint;
    }

    // ==================== 随机气泡 ====================
    function startRandomBubbles() {
        // 每30-90秒随机显示一个气泡
        const scheduleNextBubble = () => {
            if (!companionState.isRunning) return;
            const delay = 30000 + Math.random() * 60000;
            setTimeout(() => {
                if (companionState.isRunning) {
                    showCompanionBubble();
                    scheduleNextBubble();
                }
            }, delay);
        };
        scheduleNextBubble();
    }

    function showCompanionBubble(text) {
        if (!$.companionBubbleArea) return;

        const bubble = document.createElement('div');
        bubble.className = 'companion-bubble';

        // 如果没有提供文字，从字卡库随机获取
        if (!text) {
            text = getRandomReplyText();
        }

        const partnerName = (window.settings && window.settings.partnerName) || '梦角';
        bubble.innerHTML = `
            <div class="companion-bubble-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="companion-bubble-content">
                <div class="companion-bubble-name">${partnerName}</div>
                <div class="companion-bubble-text">${text}</div>
            </div>
        `;

        $.companionBubbleArea.appendChild(bubble);

        // 动画进入
        requestAnimationFrame(() => {
            bubble.style.opacity = '1';
            bubble.style.transform = 'translateY(0)';
        });

        // 5秒后自动消失
        setTimeout(() => {
            bubble.style.opacity = '0';
            bubble.style.transform = 'translateY(-20px)';
            setTimeout(() => bubble.remove(), 500);
        }, 5000);
    }

    function getRandomReplyText() {
        // 从主字卡库获取
        try {
            const saved = localStorage.getItem('customReplies');
            if (saved) {
                const data = JSON.parse(saved);
                if (data.reply && data.reply.main && data.reply.main.length > 0) {
                    const items = data.reply.main;
                    const item = items[Math.floor(Math.random() * items.length)];
                    return typeof item === 'string' ? item : (item.text || item.content || '...');
                }
            }
        } catch(e) {}

        // 默认文案
        const defaults = {
            study: ['加油，你可以的！', '专注当下，效率翻倍', '我在旁边陪着你'],
            work: ['工作顺利吗？', '注意休息，别太累', '有我在，不孤单'],
            exercise: ['坚持就是胜利！', '动起来，更健康', '你运动的样子很帅'],
            sleep: ['晚安，好梦', '放下手机，安心睡吧', '明天见']
        };
        const list = defaults[companionState.mode] || ['...'];
        return list[Math.floor(Math.random() * list.length)];
    }

    // ==================== 输入区 ====================
    function initCompanionInput() {
        if (!$.companionInputField) return;

        $.companionInputField.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendCompanionMessage();
            }
        });

        // 发送按钮（如果有）
        const sendBtn = document.getElementById('companion-send-btn');
        if (sendBtn) {
            sendBtn.addEventListener('click', sendCompanionMessage);
        }

        // 表情按钮
        const emojiBtn = document.getElementById('companion-emoji-btn');
        if (emojiBtn) {
            emojiBtn.addEventListener('click', () => {
                // 简化：直接发送一个表情
                sendCompanionMessage('😊');
            });
        }

        // 图片按钮
        const imageBtn = document.getElementById('companion-image-btn');
        if (imageBtn) {
            imageBtn.addEventListener('click', () => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                            sendCompanionMessage(null, ev.target.result);
                        };
                        reader.readAsDataURL(file);
                    }
                };
                input.click();
            });
        }
    }

    function sendCompanionMessage(text, imageUrl) {
        if (!text && !imageUrl && $.companionInputField) {
            text = $.companionInputField.value.trim();
            $.companionInputField.value = '';
        }
        if (!text && !imageUrl) return;

        // 显示用户消息
        showUserBubble(text, imageUrl);

        // 保存到消息记录
        companionState.messages.push({
            role: 'user',
            text: text,
            image: imageUrl,
            time: Date.now()
        });

        // 模拟对方正在输入
        showTypingIndicator();

        // 延迟回复
        const delay = 2000 + Math.random() * 3000;
        setTimeout(() => {
            hideTypingIndicator();
            const reply = getRandomReplyText();
            showCompanionBubble(reply);
            companionState.messages.push({
                role: 'partner',
                text: reply,
                time: Date.now()
            });
        }, delay);

        // 随机播放语音
        if (companionState.voices.length > 0 && Math.random() < 0.3) {
            const voice = companionState.voices[Math.floor(Math.random() * companionState.voices.length)];
            const audio = new Audio(voice.dataUrl);
            audio.play().catch(() => {});
        }
    }

    function showUserBubble(text, imageUrl) {
        if (!$.companionBubbleArea) return;

        const bubble = document.createElement('div');
        bubble.className = 'companion-bubble companion-bubble-user';

        let content = '';
        if (imageUrl) {
            content = `<img src="${imageUrl}" style="max-width:150px;border-radius:8px;">`;
        } else {
            content = `<div class="companion-bubble-text">${text}</div>`;
        }

        bubble.innerHTML = `
            <div class="companion-bubble-content" style="margin-left:auto;">
                ${content}
            </div>
        `;

        $.companionBubbleArea.appendChild(bubble);
        requestAnimationFrame(() => {
            bubble.style.opacity = '1';
            bubble.style.transform = 'translateY(0)';
        });

        setTimeout(() => {
            bubble.style.opacity = '0';
            setTimeout(() => bubble.remove(), 500);
        }, 5000);
    }

    function showTypingIndicator() {
        if (!$.companionTypingIndicator) return;
        const partnerName = (window.settings && window.settings.partnerName) || '梦角';
        const nameEl = $.companionTypingIndicator.querySelector('.companion-typing-name');
        if (nameEl) nameEl.textContent = partnerName;
        $.companionTypingIndicator.style.display = 'flex';
    }

    function hideTypingIndicator() {
        if (!$.companionTypingIndicator) return;
        $.companionTypingIndicator.style.display = 'none';
    }

    // ==================== 键盘切换 ====================
    function initKeyboardToggle() {
        if (!$.companionKeyboardBtn || !$.companionInputBar) return;

        $.companionKeyboardBtn.addEventListener('click', () => {
            const isVisible = $.companionInputBar.style.display !== 'none';
            $.companionInputBar.style.display = isVisible ? 'none' : 'flex';
            if (!isVisible && $.companionInputField) {
                setTimeout(() => $.companionInputField.focus(), 100);
            }
        });

        // 默认隐藏输入栏
        $.companionInputBar.style.display = 'none';
    }

    // ==================== 历史记录 ====================
    function initHistoryButton() {
        if (!$.companionHistoryBtn) return;

        $.companionHistoryBtn.addEventListener('click', () => {
            showCompanionHistory();
        });
    }

    function showCompanionHistory() {
        if (companionState.messages.length === 0) {
            showNotification('还没有对话记录', 'info');
            return;
        }

        const partnerName = (window.settings && window.settings.partnerName) || '梦角';
        const html = companionState.messages.map(msg => {
            const time = new Date(msg.time).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
            if (msg.role === 'user') {
                return `<div style="text-align:right;margin:6px 0;"><span style="background:rgba(var(--accent-color-rgb),0.2);padding:6px 12px;border-radius:12px;font-size:13px;">${msg.text || '[图片]'}</span><span style="font-size:10px;color:var(--text-secondary);margin-left:6px;">${time}</span></div>`;
            } else {
                return `<div style="text-align:left;margin:6px 0;"><span style="font-size:10px;color:var(--text-secondary);margin-right:6px;">${time}</span><span style="background:rgba(255,255,255,0.1);padding:6px 12px;border-radius:12px;font-size:13px;">${msg.text}</span></div>`;
            }
        }).join('');

        // 创建临时弹窗
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.style.cssText = 'display:flex;z-index:3000;';
        modal.innerHTML = `
            <div class="modal-content" style="max-height:70vh;display:flex;flex-direction:column;">
                <div class="modal-title"><i class="fas fa-comment-dots"></i><span>本次对话</span></div>
                <div style="flex:1;overflow-y:auto;padding:10px;">${html}</div>
                <div class="modal-buttons">
                    <button class="modal-btn modal-btn-secondary" onclick="this.closest('.modal').remove()">关闭</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // ==================== 背景音 ====================
    function initNoiseButton() {
        if (!$.companionNoiseBtn) return;

        $.companionNoiseBtn.addEventListener('click', () => {
            toggleNoise();
        });
    }

    function toggleNoise() {
        if (companionState.noiseEnabled && companionState.noiseAudio) {
            companionState.noiseAudio.pause();
            companionState.noiseEnabled = false;
            if ($.companionNoiseBtn) $.companionNoiseBtn.style.opacity = '0.6';
            showNotification('背景音已关闭', 'info');
        } else {
            // 尝试播放内置白噪音或用户上传的音乐
            playNoise();
        }
    }

    function playNoise() {
        // 检查是否有用户上传的该场景音乐
        const savedData = getCompanionData();
        const modeData = savedData[companionState.mode];
        if (modeData && modeData.noise) {
            companionState.noiseAudio = new Audio(modeData.noise);
            companionState.noiseAudio.loop = true;
            companionState.noiseAudio.play().then(() => {
                companionState.noiseEnabled = true;
                if ($.companionNoiseBtn) $.companionNoiseBtn.style.opacity = '1';
                showNotification('背景音已开启', 'success');
            }).catch(() => {
                showNotification('无法播放背景音', 'error');
            });
        } else {
            // 生成简单的白噪音
            try {
                const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                const bufferSize = 2 * audioCtx.sampleRate;
                const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
                const output = noiseBuffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    output[i] = Math.random() * 2 - 1;
                }
                const whiteNoise = audioCtx.createBufferSource();
                whiteNoise.buffer = noiseBuffer;
                whiteNoise.loop = true;
                const gainNode = audioCtx.createGain();
                gainNode.gain.value = 0.05;
                whiteNoise.connect(gainNode);
                gainNode.connect(audioCtx.destination);
                whiteNoise.start();
                companionState.noiseAudio = { pause: () => { whiteNoise.stop(); audioCtx.close(); } };
                companionState.noiseEnabled = true;
                if ($.companionNoiseBtn) $.companionNoiseBtn.style.opacity = '1';
                showNotification('白噪音已开启', 'success');
            } catch(e) {
                showNotification('无法播放背景音', 'error');
/* ============================================
 * 陪伴日记 (Companion Diary)
 * 数据结构：
 * {
 *   id: 时间戳,
 *   ts: 开始时间戳（用于排序、日期计算）,
 *   mode: 'study' | 'work' | 'exercise' | 'sleep',
 *   duration: 秒数,
 *   initiator: 'partner' | 'user',
 *   partnerNote: 字卡内容（梦角自动生成）,
 *   userNote: 用户手动写的备注
 * }
 * ============================================ */
(function() {
    'use strict';

    // ─── 全局状态 ──────────────────────────────────
    let _diaryEntries = [];          // 内存中的所有记录（按 ts 倒序）
    let _curYear = new Date().getFullYear();
    let _curMonth = new Date().getMonth() + 1;
    let _calYear = _curYear;
    let _filterMode = 'all';
    let _filterInit = 'all';
    let _editingEntryId = null;
    let _diaryBgGallery = [];   // 用户上传的日记背景列表

    // ─── 模式配置（图标、中文名） ────────────────────
    const MODE_CONFIG = {
        study:    { name: '学习', shortName: '学习', icon: 'fa-book-open',  sticker: '🌿' },
        work:     { name: '工作', shortName: '工作', icon: 'fa-briefcase',  sticker: '☕' },
        exercise: { name: '运动', shortName: '运动', icon: 'fa-running',    sticker: '☀️' },
        sleep:    { name: '睡觉', shortName: '睡觉', icon: 'fa-moon',       sticker: '🌙' }
    };

    // ─── 存储 ───────────────────────────────────────
    function getKey() {
        const prefix = window.APP_PREFIX || '';
        return prefix + 'companionDiary';
    }
    async function loadDiary() {
        try {
            const data = await localforage.getItem(getKey());
            _diaryEntries = Array.isArray(data) ? data : [];
        } catch (e) {
            console.warn('[companion-diary] load failed:', e);
            _diaryEntries = [];
        }
        // 确保按时间倒序
        _diaryEntries.sort((a, b) => b.ts - a.ts);
        window._companionDiaryEntries = _diaryEntries; // 暴露给外部（companion.js 写入用）
    }
    async function saveDiary() {
        try {
            await localforage.setItem(getKey(), _diaryEntries);
        } catch (e) {
            console.warn('[companion-diary] save failed:', e);
        }
    }
    // 暴露给 companion.js 调用：添加一条新记录
    window.addCompanionDiaryEntry = async function(entry) {
        if (!entry || !entry.mode) return;
        const rec = {
            id: entry.id || Date.now(),
            ts: entry.ts || Date.now(),
            mode: entry.mode,
            duration: entry.duration || 0,
            initiator: entry.initiator || 'user',
            partnerNote: entry.partnerNote || '',
            userNote: entry.userNote || ''
        };
        _diaryEntries.unshift(rec);
        await saveDiary();
        window._companionDiaryEntries = _diaryEntries;
    };

    // ─── 字卡随机抽取（梦角的备注） ──────────────────
    // 抽 1~2 句，从启用的字卡库里随机；30% 概率返回空（梦角不记录）
    window.pickCompanionDiaryCards = function() {
        // 30% 概率不记录
        if (Math.random() < 0.3) return '';

        try {
            // 字卡库变量是模块作用域的 customReplies，全局暴露在 window._customReplies
            const replies = (typeof customReplies !== 'undefined' && Array.isArray(customReplies))
                ? customReplies
                : (window._customReplies || []);
            if (!Array.isArray(replies) || replies.length === 0) return '';

            // 过滤掉被禁用的字卡（兼容 listeners.js 的 disabledReplyItems）
            let disabledItems = new Set();
            try {
                const raw = localStorage.getItem('disabledReplyItems');
                if (raw) disabledItems = new Set(JSON.parse(raw));
            } catch (e) {}

            // 过滤掉被禁用分组里的字卡
            const disabledGroupItems = new Set();
            (window.customReplyGroups || []).forEach(g => {
                if (g.disabled && Array.isArray(g.items)) {
                    g.items.forEach(item => disabledGroupItems.add(item));
                }
            });

            const pool = replies
                .filter(r => !disabledItems.has(r) && !disabledGroupItems.has(r))
                .map(r => String(r || '').trim())
                .filter(Boolean);

            if (pool.length === 0) return '';

            // 抽 1 ~ 2 句
            const count = pool.length === 1 ? 1 : (Math.random() < 0.5 ? 1 : 2);
            const picked = [];
            const used = new Set();
            for (let i = 0; i < count && picked.length < pool.length; i++) {
                let idx;
                let tries = 0;
                do {
                    idx = Math.floor(Math.random() * pool.length);
                    tries++;
                } while (used.has(idx) && tries < 20);
                used.add(idx);
                picked.push(pool[idx]);
            }
            return picked.join('；');
        } catch (e) {
            console.warn('[companion-diary] pickCards error:', e);
            return '';
        }
    };

    // ─── 日记背景：应用到 modal 的 .cd-pages 上 ────────
    window.applyCompanionDiaryBg = function(bgValue) {
        const pages = document.getElementById('cd-pages');
        if (!pages) return;
        if (!bgValue) {
            pages.style.backgroundImage = '';
            pages.style.backgroundColor = '';
            pages.classList.remove('cd-has-bg');
            return;
        }
        if (bgValue.startsWith('linear-gradient') || bgValue.startsWith('#') || bgValue.startsWith('rgb')) {
            pages.style.backgroundImage = '';
            pages.style.backgroundColor = bgValue;
        } else {
            pages.style.backgroundImage = 'url(' + JSON.stringify(bgValue) + ')';
            pages.style.backgroundSize = 'cover';
            pages.style.backgroundPosition = 'center';
            pages.style.backgroundRepeat = 'no-repeat';
        }
        pages.classList.add('cd-has-bg');
    };

    // ─── 工具函数 ───────────────────────────────────
    function getPartnerName() {
        try {
            const s = (typeof settings !== 'undefined') ? settings : window.settings;
            if (s && s.partnerName) return s.partnerName;
        } catch (e) {}
        return '梦角';
    }
    function getUserName() {
        try {
            const s = (typeof settings !== 'undefined') ? settings : window.settings;
            if (s && s.myName) return s.myName;
        } catch (e) {}
        return '我';
    }
    function formatDuration(seconds) {
        seconds = Math.max(0, Math.floor(seconds || 0));
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        if (h > 0 && m > 0) return h + 'h ' + (m < 10 ? '0' + m : m) + 'min';
        if (h > 0) return h + 'h';
        if (m > 0) return m + 'min';
        return '< 1min';
    }
    function formatDurationTotal(totalSeconds) {
        totalSeconds = Math.max(0, Math.floor(totalSeconds || 0));
        const totalMinutes = Math.floor(totalSeconds / 60);
        if (totalMinutes >= 60) {
            // 大于等于 1 小时 → 用十进制小时显示（保留 1 位小数，去掉末尾 .0）
            const hours = totalMinutes / 60;
            let str = hours.toFixed(1);
            if (str.endsWith('.0')) str = str.slice(0, -2);
            return str + 'h';
        }
        return totalMinutes + 'min';
    }
    function pad2(n) { return n < 10 ? '0' + n : '' + n; }
    function formatTime(ts) {
        const d = new Date(ts);
        return pad2(d.getHours()) + ':' + pad2(d.getMinutes());
    }
    function getWeekdayCN(ts) {
        const wd = ['周日','周一','周二','周三','周四','周五','周六'];
        return wd[new Date(ts).getDay()];
    }

    // ─── 渲染：列表（全部月份）──────────────────────
    // 一次性渲染从最早记录到当前月之间的所有月份
    // 滚动时同步顶部月份显示；切换月份时滚动到对应位置
    let _scrollSyncBusy = false;       // 防止"切月→滚动→滚动事件再次切月"循环
    let _scrollObserver = null;

    function renderList() {
        const container = document.getElementById('cd-pages');
        if (!container) return;

        const partnerName = getPartnerName();
        const userName = getUserName();

        // 计算需要展示的月份范围（最早记录月 ~ 当前月，二者取较远者）
        const now = new Date();
        const nowY = now.getFullYear();
        const nowM = now.getMonth() + 1;

        // 找最早的记录
        let earliestY = nowY, earliestM = nowM;
        if (_diaryEntries.length > 0) {
            const minTs = _diaryEntries.reduce((min, e) => Math.min(min, e.ts), Infinity);
            const minD = new Date(minTs);
            earliestY = minD.getFullYear();
            earliestM = minD.getMonth() + 1;
        }
        // 同时也要包含用户切到的 _curYear/_curMonth 范围
        const startKey = earliestY * 100 + earliestM;
        const endKey = nowY * 100 + nowM;
        const curKey = _curYear * 100 + _curMonth;
        const realStart = Math.min(startKey, curKey);
        const realEnd = Math.max(endKey, curKey);

        // 生成月份列表（从新到旧）
        const months = [];
        let y = Math.floor(realEnd / 100), m = realEnd % 100;
        const sy = Math.floor(realStart / 100), sm = realStart % 100;
        while (y > sy || (y === sy && m >= sm)) {
            months.push({ year: y, month: m });
            m--;
            if (m < 1) { m = 12; y--; }
        }

        // 应用筛选后的所有条目
        const filteredEntries = _diaryEntries.filter(e => {
            if (_filterMode !== 'all' && e.mode !== _filterMode) return false;
            if (_filterInit !== 'all' && e.initiator !== _filterInit) return false;
            return true;
        });

        // 按月份分组
        const byMonth = {};
        filteredEntries.forEach(e => {
            const d = new Date(e.ts);
            const key = d.getFullYear() + '-' + (d.getMonth() + 1);
            if (!byMonth[key]) byMonth[key] = [];
            byMonth[key].push(e);
        });

        // 拼接 HTML
        let html = '';
        months.forEach(mo => {
            const key = mo.year + '-' + mo.month;
            const entries = byMonth[key] || [];
            html += '<div class="cd-month-section" data-year="' + mo.year + '" data-month="' + mo.month + '">';
            html += '<div class="cd-month-label" data-year="' + mo.year + '" data-month="' + mo.month + '">· ' + mo.year + '年' + mo.month + '月 ·</div>';
            if (entries.length === 0) {
                html += '<div class="cd-empty cd-empty-month"><i class="fas fa-book-open"></i><div>这个月还没有陪伴记录</div></div>';
            } else {
                entries.forEach(e => {
                    const cfg = MODE_CONFIG[e.mode] || MODE_CONFIG.study;
                    const d = new Date(e.ts);
                    const day = d.getDate();
                    const weekday = getWeekdayCN(e.ts);
                    const time = formatTime(e.ts);
                    const dur = formatDuration(e.duration);

                    const initiatorLabel = e.initiator === 'partner' ? (partnerName + '邀请') : (userName + '邀请');
                    const initiatorClass = e.initiator === 'partner' ? '' : 'cd-init-user';

                    const hasPartnerNote = !!e.partnerNote;
                    const partnerRowHtml = hasPartnerNote
                        ? '<div class="cd-note-row">' +
                            '<span class="cd-note-who">' + escapeHtml(partnerName) + '：</span>' +
                            '<span class="cd-note-text">' + escapeHtml(e.partnerNote) + '</span>' +
                          '</div>'
                        : '<div class="cd-note-row">' +
                            '<span class="cd-note-empty">' + escapeHtml(partnerName) + '没有记录</span>' +
                          '</div>';
                    const userNoteHtml = e.userNote
                        ? '<span class="cd-note-text">' + escapeHtml(e.userNote) + '</span>'
                        : '<span class="cd-note-empty">点击此处添加备注…</span>';

                    html += '<div class="cd-entry" data-id="' + e.id + '">' +
                        '<div class="cd-date-col">' +
                          '<div class="cd-day">' + day + '</div>' +
                          '<div class="cd-weekday">' + weekday + '</div>' +
                        '</div>' +
                        '<div class="cd-entry-content">' +
                          '<div class="cd-top-row">' +
                            '<span class="cd-initiator ' + initiatorClass + '">' + escapeHtml(initiatorLabel) + '</span>' +
                            '<span class="cd-mode-tag"><i class="fas ' + cfg.icon + '"></i>' + cfg.shortName + '</span>' +
                            '<span class="cd-time-dur">' + time + ' · ' + dur + '</span>' +
                          '</div>' +
                          '<div class="cd-notes">' +
                            partnerRowHtml +
                            '<div class="cd-note-row">' +
                              '<span class="cd-note-who" style="color:var(--text-secondary)">' + escapeHtml(userName) + '：</span>' +
                              userNoteHtml +
                            '</div>' +
                          '</div>' +
                        '</div>' +
                        '<div class="cd-sticker">' + cfg.sticker + '</div>' +
                      '</div>';
                });
            }
            html += '</div>';
        });

        container.innerHTML = html;

        // 绑定每条点击事件 → 弹出备注编辑
        container.querySelectorAll('.cd-entry').forEach(el => {
            el.addEventListener('click', () => {
                const id = el.dataset.id;
                openNoteEditor(id);
            });
        });

        // 滚动到当前选中月份
        scrollToMonth(_curYear, _curMonth);

        // 设置滚动监听 → 同步顶部月份显示
        setupScrollSync();
    }

    function scrollToMonth(year, month) {
        const container = document.getElementById('cd-pages');
        if (!container) return;
        const target = container.querySelector('.cd-month-section[data-year="' + year + '"][data-month="' + month + '"]');
        if (!target) return;
        _scrollSyncBusy = true;
        // 用 instant 不闪屏；滚动位置 = target.offsetTop（相对 container）
        const top = target.offsetTop - container.offsetTop;
        container.scrollTop = top;
        // 防抖：滚动平稳后再开启监听
        setTimeout(() => { _scrollSyncBusy = false; }, 300);
    }

    function setupScrollSync() {
        const container = document.getElementById('cd-pages');
        if (!container) return;
        // 清理旧 observer
        if (_scrollObserver) {
            try { _scrollObserver.disconnect(); } catch (e) {}
            _scrollObserver = null;
        }

        // 用 IntersectionObserver 监听月份标签，第一个进入视口顶部的就是当前月
        const labels = container.querySelectorAll('.cd-month-label');
        if (!labels.length) return;

        _scrollObserver = new IntersectionObserver((entries) => {
            if (_scrollSyncBusy) return;
            // 找到最靠近顶部的可见月份
            let topMost = null;
            let topMostY = Infinity;
            entries.forEach(entry => {
                const rect = entry.target.getBoundingClientRect();
                const containerRect = container.getBoundingClientRect();
                const relY = rect.top - containerRect.top;
                // 只关心进入视口、且位置在容器上半部分的标签
                if (entry.isIntersecting && relY < containerRect.height * 0.5 && relY < topMostY) {
                    topMost = entry.target;
                    topMostY = relY;
                }
            });
            if (topMost) {
                const year = parseInt(topMost.dataset.year, 10);
                const month = parseInt(topMost.dataset.month, 10);
                if (year && month && (year !== _curYear || month !== _curMonth)) {
                    _curYear = year;
                    _curMonth = month;
                    updateMonthDisplay();
                }
            }
        }, {
            root: container,
            rootMargin: '0px 0px -70% 0px',  // 只关注顶部 30% 区域
            threshold: [0, 0.5, 1]
        });

        labels.forEach(label => _scrollObserver.observe(label));
    }

    function escapeHtml(s) {
        if (s == null) return '';
        return String(s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // ─── 月份选择 ───────────────────────────────────
    function updateMonthDisplay() {
        const el = document.getElementById('cd-month-text');
        if (el) el.textContent = _curYear + '年' + _curMonth + '月';
    }
    function toggleCalPopup() {
        const popup = document.getElementById('cd-cal-popup');
        if (!popup) return;
        _calYear = _curYear;
        popup.classList.toggle('open');
        if (popup.classList.contains('open')) renderCalPopup();
    }
    function closeCalPopup() {
        const popup = document.getElementById('cd-cal-popup');
        if (popup) popup.classList.remove('open');
    }
    function renderCalPopup() {
        const yearLabel = document.getElementById('cd-cal-year-label');
        const grid = document.getElementById('cd-cal-months');
        if (!yearLabel || !grid) return;
        yearLabel.textContent = _calYear;
        let html = '';
        for (let m = 1; m <= 12; m++) {
            const isActive = (_calYear === _curYear && m === _curMonth);
            html += '<div class="cd-cal-m ' + (isActive ? 'active' : '') + '" data-m="' + m + '">' + m + '月</div>';
        }
        grid.innerHTML = html;
        grid.querySelectorAll('.cd-cal-m').forEach(el => {
            el.addEventListener('click', () => {
                _curYear = _calYear;
                _curMonth = parseInt(el.dataset.m, 10);
                updateMonthDisplay();
                // 如果该月份已在已渲染的列表里，直接滚动；否则重新渲染（重新计算范围）
                const container = document.getElementById('cd-pages');
                const exists = container && container.querySelector('.cd-month-section[data-year="' + _curYear + '"][data-month="' + _curMonth + '"]');
                if (exists) {
                    scrollToMonth(_curYear, _curMonth);
                } else {
                    renderList();
                }
                closeCalPopup();
            });
        });
    }

    // ─── 筛选 chip ──────────────────────────────────
    function updateChipLabel(type, val) {
        const labelMap = {
            all: { mode: '种类', init: '邀请' },
            study:    '学习',
            work:     '工作',
            exercise: '运动',
            sleep:    '睡觉',
            partner:  getPartnerName() + '邀请',
            user:     getUserName() + '邀请'
        };
        if (type === 'mode') {
            const label = document.getElementById('cd-chip-mode-label');
            const chip = document.getElementById('cd-chip-mode');
            if (val === 'all') {
                label.textContent = labelMap.all.mode;
                chip.classList.remove('active');
            } else {
                label.textContent = labelMap[val] || val;
                chip.classList.add('active');
            }
        } else {
            const label = document.getElementById('cd-chip-init-label');
            const chip = document.getElementById('cd-chip-init');
            if (val === 'all') {
                label.textContent = labelMap.all.init;
                chip.classList.remove('active');
            } else {
                label.textContent = labelMap[val] || val;
                chip.classList.add('active');
            }
        }
    }

    // ─── 备注编辑弹窗 ─────────────────────────────────
    function openNoteEditor(entryId) {
        const id = String(entryId);
        const entry = _diaryEntries.find(e => String(e.id) === id);
        if (!entry) return;
        _editingEntryId = id;

        const cfg = MODE_CONFIG[entry.mode] || MODE_CONFIG.study;
        const d = new Date(entry.ts);
        const info = (d.getMonth() + 1) + '月' + d.getDate() + '日 · ' + cfg.shortName + ' · ' + formatDuration(entry.duration);
        document.getElementById('cd-note-edit-info').textContent = info;
        document.getElementById('cd-note-edit-textarea').value = entry.userNote || '';

        const modal = document.getElementById('cd-note-edit-modal');
        if (typeof showModal === 'function') showModal(modal);
        else modal.style.display = 'flex';
    }
    async function saveNoteFromEditor() {
        if (!_editingEntryId) return;
        const entry = _diaryEntries.find(e => String(e.id) === _editingEntryId);
        if (!entry) return;
        entry.userNote = (document.getElementById('cd-note-edit-textarea').value || '').trim();
        await saveDiary();
        const modal = document.getElementById('cd-note-edit-modal');
        if (typeof hideModal === 'function') hideModal(modal);
        else modal.style.display = 'none';
        _editingEntryId = null;
        renderList();
    }

    // ─── 统计视图 ───────────────────────────────────
    function openStatsView() {
        const view = document.getElementById('cd-stats-view');
        if (view) view.classList.add('open');
        renderStats();
    }
    function closeStatsView() {
        const view = document.getElementById('cd-stats-view');
        if (view) view.classList.remove('open');
    }
    function renderStats() {
        const totalCount = _diaryEntries.length;
        const totalDur = _diaryEntries.reduce((s, e) => s + (e.duration || 0), 0);
        document.getElementById('cd-total-count').textContent = totalCount;
        document.getElementById('cd-total-duration').textContent = totalDur > 0 ? formatDurationTotal(totalDur) : '0min';

        // 邀请来源
        let partnerCnt = 0, userCnt = 0;
        _diaryEntries.forEach(e => {
            if (e.initiator === 'partner') partnerCnt++;
            else userCnt++;
        });

        // 种类
        const modeCnt = { study: 0, work: 0, exercise: 0, sleep: 0 };
        _diaryEntries.forEach(e => {
            if (modeCnt.hasOwnProperty(e.mode)) modeCnt[e.mode]++;
        });

        // 取主题色 RGB（用于邀请来源派生颜色）
        const accentRgb = getAccentRgb();
        const initColors = [
            'rgb(' + accentRgb + ')',                       // 梦角邀请 = 主题色
            'rgba(' + accentRgb + ', 0.45)'                 // 用户邀请 = 主题色浅一些
        ];
        // 种类用固定的柔和马卡龙色
        const modeColors = {
            study:    '#C3EB8E',   // 学习 - 嫩绿
            work:     '#FFF891',   // 工作 - 鹅黄
            exercise: '#FFBB9B',   // 运动 - 蜜桃橙
            sleep:    '#A4D6FF'    // 睡觉 - 浅蓝
        };

        // 邀请来源图
        const initData = [
            { label: getPartnerName() + '邀请', value: partnerCnt, color: initColors[0] },
            { label: getUserName() + '邀请',    value: userCnt,    color: initColors[1] }
        ];
        drawPie('cd-pie-init', initData, totalCount);
        renderLegend('cd-legend-init', initData, totalCount);

        // 种类分布图
        const modeData = [
            { label: '学习', value: modeCnt.study,    color: modeColors.study },
            { label: '工作', value: modeCnt.work,     color: modeColors.work },
            { label: '运动', value: modeCnt.exercise, color: modeColors.exercise },
            { label: '睡觉', value: modeCnt.sleep,    color: modeColors.sleep }
        ];
        drawPie('cd-pie-mode', modeData, totalCount);
        renderLegend('cd-legend-mode', modeData, totalCount);
    }

    function getAccentRgb() {
        try {
            const v = getComputedStyle(document.documentElement).getPropertyValue('--accent-color-rgb').trim();
            if (v) return v;
        } catch (e) {}
        return '197, 164, 126';
    }

    function drawPie(canvasId, segments, total) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width, h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        const cx = w / 2, cy = h / 2;
        const outerR = Math.min(w, h) / 2 - 2;
        const innerR = outerR * 0.6;

        // 空数据时画灰色圈
        const sum = segments.reduce((s, x) => s + x.value, 0);
        if (sum === 0) {
            ctx.beginPath();
            ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
            ctx.arc(cx, cy, innerR, 0, Math.PI * 2, true);
            ctx.fillStyle = 'rgba(' + getAccentRgb() + ', 0.1)';
            ctx.fill();
            return;
        }

        let startAngle = -Math.PI / 2;
        segments.forEach(seg => {
            if (seg.value === 0) return;
            const angle = (seg.value / sum) * Math.PI * 2;
            const endAngle = startAngle + angle;
            ctx.beginPath();
            ctx.moveTo(cx + Math.cos(startAngle) * outerR, cy + Math.sin(startAngle) * outerR);
            ctx.arc(cx, cy, outerR, startAngle, endAngle);
            ctx.lineTo(cx + Math.cos(endAngle) * innerR, cy + Math.sin(endAngle) * innerR);
            ctx.arc(cx, cy, innerR, endAngle, startAngle, true);
            ctx.closePath();
            ctx.fillStyle = seg.color;
            ctx.fill();
            startAngle = endAngle;
        });
    }

    function renderLegend(containerId, segments, total) {
        const container = document.getElementById(containerId);
        if (!container) return;
        const sum = segments.reduce((s, x) => s + x.value, 0);
        if (sum === 0) {
            container.innerHTML = '<div style="color:var(--text-secondary);font-size:12px;">暂无数据</div>';
            return;
        }
        let html = '';
        segments.forEach(seg => {
            const pct = sum > 0 ? Math.round(seg.value / sum * 100) : 0;
            html +=
                '<div class="cd-legend-item">' +
                '<div class="cd-legend-dot" style="background:' + seg.color + '"></div>' +
                '<span>' + escapeHtml(seg.label) + '</span>' +
                '<span class="cd-legend-pct">' + pct + '%</span>' +
                '</div>';
        });
        container.innerHTML = html;
    }

    // 刷新下拉项里的动态昵称（梦角邀请 / 我邀请）
    function refreshDropdownNames() {
        const partnerName = getPartnerName();
        const userName = getUserName();
        const partnerItem = document.querySelector('.cd-dropdown-item[data-name-partner]');
        const userItem = document.querySelector('.cd-dropdown-item[data-name-me]');
        if (partnerItem) partnerItem.textContent = partnerName + '邀请';
        if (userItem) userItem.textContent = userName + '邀请';
    }

    // ─── 主入口：打开日记 modal ──────────────────────
    async function openDiaryModal() {
        await loadDiary();

        // 默认显示当前月份
        const now = new Date();
        _curYear = now.getFullYear();
        _curMonth = now.getMonth() + 1;
        _filterMode = 'all';
        _filterInit = 'all';
        updateMonthDisplay();
        refreshDropdownNames();
        updateChipLabel('mode', 'all');
        updateChipLabel('init', 'all');

        // 重置下拉项高亮
        document.querySelectorAll('.cd-dropdown-item').forEach(i => i.classList.remove('active'));
        document.querySelectorAll('.cd-dropdown-item[data-val="all"]').forEach(i => i.classList.add('active'));

        // 关闭所有下拉
        document.querySelectorAll('.cd-dropdown.open').forEach(d => d.classList.remove('open'));

        closeStatsView();
        renderList();

        // 应用日记背景（如果用户在外观设置里选择了）
        try {
            const prefix = window.APP_PREFIX || '';
            const bg = await localforage.getItem(prefix + 'companionDiaryBg');
            window.applyCompanionDiaryBg(bg || '');
        } catch (e) {
            window.applyCompanionDiaryBg('');
        }

        const modal = document.getElementById('companion-diary-modal');
        if (typeof showModal === 'function') showModal(modal);
        else modal.style.display = 'flex';
    }

    // ─── 绑定事件 ───────────────────────────────────
    function bindEvents() {
        // 入口按钮
        const entryBtn = document.getElementById('companion-diary-function');
        if (entryBtn && !entryBtn.dataset.cdBound) {
            entryBtn.dataset.cdBound = 'true';
            entryBtn.addEventListener('click', () => {
                const advModal = document.getElementById('advanced-modal');
                if (advModal && typeof hideModal === 'function') hideModal(advModal);
                setTimeout(() => openDiaryModal(), 150);
            });
        }

        // 关闭按钮
        const closeBtn = document.getElementById('close-companion-diary');
        if (closeBtn && !closeBtn.dataset.cdBound) {
            closeBtn.dataset.cdBound = 'true';
            closeBtn.addEventListener('click', () => {
                const modal = document.getElementById('companion-diary-modal');
                if (typeof hideModal === 'function') hideModal(modal);
                else modal.style.display = 'none';
            });
        }

        // 月份切换器点击
        const monthDisplay = document.getElementById('cd-month-display');
        if (monthDisplay && !monthDisplay.dataset.cdBound) {
            monthDisplay.dataset.cdBound = 'true';
            monthDisplay.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleCalPopup();
            });
        }

        // 月历年份切换
        const prevYearBtn = document.getElementById('cd-cal-prev-year');
        const nextYearBtn = document.getElementById('cd-cal-next-year');
        if (prevYearBtn && !prevYearBtn.dataset.cdBound) {
            prevYearBtn.dataset.cdBound = 'true';
            prevYearBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                _calYear--;
                renderCalPopup();
            });
        }
        if (nextYearBtn && !nextYearBtn.dataset.cdBound) {
            nextYearBtn.dataset.cdBound = 'true';
            nextYearBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                _calYear++;
                renderCalPopup();
            });
        }

        // 筛选下拉 - 自定义实现
        document.querySelectorAll('.cd-chip').forEach(chip => {
            if (chip.dataset.cdBound) return;
            chip.dataset.cdBound = 'true';
            const dropdown = chip.querySelector('.cd-dropdown');
            if (!dropdown) return;

            // 点击 chip 切换下拉
            chip.addEventListener('click', (e) => {
                e.stopPropagation();
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
    function initRhythmListeners() 
/**
 * games.js - 游戏与娱乐功能模块
 * 包含：抉择助手（抛硬币、随机抽签）、运势占卜等
 */

// ==================== 抉择助手 ====================

// 抛硬币功能
let coinTossResult = null;

function initCoinToss() {
    const overlay = document.getElementById('coin-toss-overlay');
    const coin = document.getElementById('animated-coin');
    const resultText = document.getElementById('coin-result-text');
    const sendBtn = document.getElementById('send-coin-result');
    const retryBtn = document.getElementById('retry-coin-toss');
    const cancelBtn = document.getElementById('cancel-coin-result');

    if (!overlay || !coin) return;

    // 抛硬币动画
    function tossCoin() {
        coin.style.animation = 'none';
        coin.offsetHeight; // 触发重排

        const isYes = Math.random() < 0.5;
        coinTossResult = isYes ? '是' : '否';

        // 设置旋转圈数（随机 3-6 圈）
        const rotations = 3 + Math.floor(Math.random() * 4);
        const finalRotation = isYes ? rotations * 360 : rotations * 360 + 180;

        coin.style.transition = 'transform 2s cubic-bezier(0.25, 0.1, 0.25, 1)';
        coin.style.transform = `rotateY(${finalRotation}deg)`;

        // 显示结果
        setTimeout(() => {
            resultText.textContent = coinTossResult;
            resultText.style.opacity = '1';
            resultText.style.transform = 'translateY(0)';
            sendBtn.style.display = 'inline-block';
            retryBtn.style.display = 'inline-block';
        }, 2000);
    }

    // 打开抛硬币
    window.openCoinToss = function() {
        overlay.style.display = 'flex';
        coin.style.transform = 'rotateY(0deg)';
        resultText.style.opacity = '0';
        resultText.style.transform = 'translateY(20px)';
        sendBtn.style.display = 'none';
        retryBtn.style.display = 'none';

        // 自动开始
        setTimeout(tossCoin, 300);
    };

    // 再来一次
    retryBtn.onclick = function() {
        resultText.style.opacity = '0';
        resultText.style.transform = 'translateY(20px)';
        sendBtn.style.display = 'none';
        retryBtn.style.display = 'none';
        setTimeout(tossCoin, 300);
    };

    // 发送结果到聊天
    sendBtn.onclick = function() {
        if (coinTossResult && typeof addMessage === 'function') {
            addMessage({
                text: `🪙 抛硬币结果：**${coinTossResult}**`,
                sender: 'system',
                type: 'text'
            });
        }
        closeCoinToss();
    };

    // 取消
    cancelBtn.onclick = closeCoinToss;

    // 点击遮罩关闭
    overlay.onclick = function(e) {
        if (e.target === overlay) closeCoinToss();
    };
}

function closeCoinToss() {
    const overlay = document.getElementById('coin-toss-overlay');
    if (overlay) overlay.style.display = 'none';
}

// ==================== 随机抽签（转盘） ====================

let wheelOptions = [];
let wheelResult = null;
let isSpinning = false;

function initWheel() {
    const modal = document.getElementById('wheel-modal');
    const optionsList = document.getElementById('wheel-options-list');
    const addBtn = document.getElementById('add-wheel-option');
    const spinBtn = document.getElementById('spin-wheel-btn');
    const sendBtn = document.getElementById('send-wheel-result');
    const closeBtn = document.getElementById('close-wheel');
    const resultText = document.getElementById('wheel-result');

    if (!modal || !optionsList) return;

    // 加载保存的选项
    loadWheelOptions();
    renderWheelOptions();

    // 添加选项
    addBtn.onclick = function() {
        if (wheelOptions.length >= 20) {
            if (typeof showNotification === 'function') {
                showNotification('最多支持20个选项', 'warning');
            }
            return;
        }
        const defaultNames = ['选项A', '选项B', '选项C', '选项D', '选项E'];
        const name = defaultNames[wheelOptions.length] || `选项${wheelOptions.length + 1}`;
        wheelOptions.push({ id: Date.now(), name: name });
        renderWheelOptions();
        saveWheelOptions();
    };

    // 开始抽签
    spinBtn.onclick = function() {
        if (isSpinning) return;
        if (wheelOptions.length < 2) {
            if (typeof showNotification === 'function') {
                showNotification('请至少添加2个选项', 'warning');
            }
            return;
        }
        startWheelSpin();
    };

    // 发送结果
    sendBtn.onclick = function() {
        if (wheelResult && typeof addMessage === 'function') {
            addMessage({
                text: `🎲 随机抽签结果：**${wheelResult.name}**`,
                sender: 'system',
                type: 'text'
            });
        }
        hideModal(modal);
    };

    // 关闭
    closeBtn.onclick = function() {
        hideModal(modal);
    };

    // 打开转盘
    window.openWheel = function() {
        showModal(modal);
        resultText.textContent = '';
        sendBtn.style.display = 'none';
        spinBtn.style.display = 'inline-block';
        renderWheelCards();
    };
}

function renderWheelOptions() {
    const list = document.getElementById('wheel-options-list');
    if (!list) return;

    if (wheelOptions.length === 0) {
        list.innerHTML = '<div style="text-align:center;color:var(--text-secondary);padding:20px;font-size:13px;">点击"添加选项"开始创建</div>';
        return;
    }

    list.innerHTML = wheelOptions.map((opt, index) => `
        <div class="picker-option-item" data-id="${opt.id}">
            <span class="picker-option-num">${index + 1}</span>
            <input type="text" value="${escapeHtml(opt.name)}" 
                onchange="updateWheelOption(${opt.id}, this.value)"
                placeholder="选项名称">
            <button class="picker-option-del" onclick="removeWheelOption(${opt.id})" title="删除">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

function renderWheelCards() {
    const row = document.getElementById('picker-cards-row');
    if (!row || wheelOptions.length === 0) return;

    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
        '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
        '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2',
        '#A9DFBF', '#F9E79F', '#AED6F1', '#F5B7B1', '#A3E4D7'
    ];

    row.innerHTML = wheelOptions.map((opt, i) => `
        <div class="picker-card" data-index="${i}" style="background:${colors[i % colors.length]}20; border-color:${colors[i % colors.length]}60;">
            <div class="picker-card-inner">
                <span class="picker-card-num">${i + 1}</span>
                <span class="picker-card-name">${escapeHtml(opt.name)}</span>
            </div>
        </div>
    `).join('');
}

function startWheelSpin() {
    if (isSpinning) return;
    isSpinning = true;

    const cards = document.querySelectorAll('.picker-card');
    const resultText = document.getElementById('wheel-result');
    const spinBtn = document.getElementById('spin-wheel-btn');
    const sendBtn = document.getElementById('send-wheel-result');

    if (cards.length === 0) return;

    spinBtn.style.display = 'none';
    resultText.textContent = '抽签中...';
    resultText.style.opacity = '1';

    let currentIndex = 0;
    let speed = 50;
    let rounds = 0;
    const totalRounds = 3 + Math.floor(Math.random() * 3); // 3-5圈
    const winnerIndex = Math.floor(Math.random() * wheelOptions.length);

    function step() {
        // 移除之前的高亮
        cards.forEach(c => c.classList.remove('picker-card-active'));

        // 高亮当前
        if (cards[currentIndex]) {
            cards[currentIndex].classList.add('picker-card-active');
        }

        currentIndex++;
        if (currentIndex >= cards.length) {
            currentIndex = 0;
            rounds++;
        }

        // 减速逻辑
        if (rounds >= totalRounds) {
            speed += 30;
        }

        // 结束条件
        if (rounds >= totalRounds && currentIndex === winnerIndex && speed > 300) {
            setTimeout(() => {
                cards.forEach(c => c.classList.remove('picker-card-active'));
                if (cards[winnerIndex]) {
                    cards[winnerIndex].classList.add('picker-card-winner');
                }

                wheelResult = wheelOptions[winnerIndex];
                resultText.innerHTML = `✨ 抽中了：<strong>${escapeHtml(wheelResult.name)}</strong>`;
                sendBtn.style.display = 'inline-block';
                isSpinning = false;
            }, speed);
            return;
        }

        setTimeout(step, speed);
    }

    step();
}

window.updateWheelOption = function(id, name) {
    const opt = wheelOptions.find(o => o.id === id);
    if (opt) {
        opt.name = name.trim() || '未命名';
        saveWheelOptions();
        renderWheelCards();
    }
};

window.removeWheelOption = function(id) {
    wheelOptions = wheelOptions.filter(o => o.id !== id);
    renderWheelOptions();
    renderWheelCards();
    saveWheelOptions();
};

function saveWheelOptions() {
    try {
        localStorage.setItem('wheelOptions', JSON.stringify(wheelOptions));
    } catch(e) {}
}

function loadWheelOptions() {
    try {
        const saved = localStorage.getItem('wheelOptions');
        if (saved) {
            wheelOptions = JSON.parse(saved);
        } else {
            // 默认选项
            wheelOptions = [
                { id: 1, name: '选项A' },
                { id: 2, name: '选项B' }
            ];
        }
    } catch(e) {
        wheelOptions = [
            { id: 1, name: '选项A' },
            { id: 2, name: '选项B' }
        ];
    }
}

// ==================== 抉择菜单 ====================

function initDecisionMenu() {
    const menuModal = document.getElementById('decision-menu-modal');
    const coinCard = document.getElementById('open-coin-toss');
    const wheelCard = document.getElementById('open-wheel');
    const closeBtn = document.getElementById('close-decision-menu');

    if (!menuModal) return;

    coinCard.onclick = function() {
        hideModal(menuModal);
        setTimeout(() => {
            if (typeof openCoinToss === 'function') openCoinToss();
        }, 300);
    };

    wheelCard.onclick = function() {
        hideModal(menuModal);
        setTimeout(() => {
            if (typeof openWheel === 'function') openWheel();
        }, 300);
    };

    closeBtn.onclick = function() {
        hideModal(menuModal);
    };

    // 从高级功能打开
    const decisionBtn = document.getElementById('decision-function');
    if (decisionBtn) {
        decisionBtn.onclick = function() {
            const advancedModal = document.getElementById('advanced-modal');
            if (advancedModal) hideModal(advancedModal);
            setTimeout(() => showModal(menuModal), 300);
        };
    }
}

// ==================== 运势占卜 ====================

const fortuneData = {
    stars: ['★☆☆☆☆', '★★☆☆☆', '★★★☆☆', '★★★★☆', '★★★★★'],
    aspects: ['爱情', '事业', '财运', '健康', '学业', '人际'],
    colors: ['红色', '橙色', '黄色', '绿色', '青色', '蓝色', '紫色', '粉色', '白色', '黑色'],
    numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    directions: ['东', '南', '西', '北', '东南', '东北', '西南', '西北'],
    advice: [
        '今日宜静不宜动，保持平和心态',
        '抓住机会，勇敢迈出第一步',
        '与人为善，会有意外收获',
        '注意休息，劳逸结合',
        '保持自信，好运自然来',
        '多倾听他人意见，会有启发',
        '今日适合学习新技能',
        '财运亨通，可适当投资',
        '感情升温，适合表达心意',
        '健康第一，记得运动',
        '贵人相助，事半功倍',
        '保持耐心，好事多磨'
    ]
};

function generateFortune() {
    const today = new Date();
    const dateStr = today.toLocaleDateString('zh-CN');

    // 使用日期作为种子，保证同一天结果一致
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const rng = seededRandom(seed);

    const fortune = {
        date: dateStr,
        overall: fortuneData.stars[Math.floor(rng() * 5)],
        aspects: {},
        luckyColor: fortuneData.colors[Math.floor(rng() * fortuneData.colors.length)],
        luckyNumber: fortuneData.numbers[Math.floor(rng() * fortuneData.numbers.length)],
        luckyDirection: fortuneData.directions[Math.floor(rng() * fortuneData.directions.length)],
        advice: fortuneData.advice[Math.floor(rng() * fortuneData.advice.length)]
    };

    fortuneData.aspects.forEach(aspect => {
        fortune.aspects[aspect] = fortuneData.stars[Math.floor(rng() * 5)];
    });

    return fortune;
}

// 简单的 seeded random
function seededRandom(seed) {
    let s = seed;
    return function() {
        s = (s * 9301 + 49297) % 233280;
        return s / 233280;
    };
}

function renderFortune() {
    const content = document.getElementById('fortune-content');
    if (!content) return;

    const fortune = generateFortune();

    content.innerHTML = `
        <div class="fortune-card">
            <div class="fortune-date">${fortune.date}</div>
            <div class="fortune-overall">
                <div class="fortune-label">今日综合运势</div>
                <div class="fortune-stars">${fortune.overall}</div>
            </div>
            <div class="fortune-aspects">
                ${Object.entries(fortune.aspects).map(([name, stars]) => `
                    <div class="fortune-aspect-item">
                        <span class="fortune-aspect-name">${name}</span>
                        <span class="fortune-aspect-stars">${stars}</span>
                    </div>
                `).join('')}
            </div>
            <div class="fortune-lucky">
                <div class="fortune-lucky-item">
                    <i class="fas fa-palette"></i>
                    <span>幸运色：${fortune.luckyColor}</span>
                </div>
                <div class="fortune-lucky-item">
                    <i class="fas fa-hashtag"></i>
                    <span>幸运数字：${fortune.luckyNumber}</span>
                </div>
                <div class="fortune-lucky-item">
                    <i class="fas fa-compass"></i>
                    <span>幸运方位：${fortune.luckyDirection}</span>
                </div>
            </div>
            <div class="fortune-advice">
                <i class="fas fa-lightbulb"></i>
                <span>${fortune.advice}</span>
            </div>
        </div>
    `;
}

// ==================== 雷诺曼占卜 ====================

const lenormandCards = [
    { id: 1, name: '骑手', meaning: '消息、新开始、速度、来访', keywords: ['消息', '新开始', '速度'] },
    { id: 2, name: '四叶草', meaning: '幸运、机会、短暂的好运、小确幸', keywords: ['幸运', '机会', '短暂'] },
    { id: 3, name: '船', meaning: '旅行、商业、距离、冒险', keywords: ['旅行', '商业', '距离'] },
    { id: 4, name: '房子', meaning: '家庭、安全、根基、不动产', keywords: ['家庭', '安全', '根基'] },
    { id: 5, name: '树', meaning: '健康、成长、生命力、时间', keywords: ['健康', '成长', '生命力'] },
    { id: 6, name: '云', meaning: '困惑、不确定性、混乱、模糊', keywords: ['困惑', '不确定', '混乱'] },
    { id: 7, name: '蛇', meaning: '智慧、欺骗、诱惑、复杂', keywords: ['智慧', '欺骗', '诱惑'] },
    { id: 8, name: '棺材', meaning: '结束、转变、疾病、终结', keywords: ['结束', '转变', '疾病'] },
    { id: 9, name: '花束', meaning: '礼物、快乐、美丽、社交', keywords: ['礼物', '快乐', '美丽'] },
    { id: 10, name: '镰刀', meaning: '突然的决定、切割、危险、收获', keywords: ['决定', '切割', '危险'] },
    { id: 11, name: '鞭子', meaning: '冲突、重复、争论、运动', keywords: ['冲突', '重复', '争论'] },
    { id: 12, name: '鸟', meaning: '焦虑、沟通、情侣、紧张', keywords: ['焦虑', '沟通', '情侣'] },
    { id: 13, name: '孩子', meaning: '新的开始、纯真、小、 playful', keywords: ['新开始', '纯真', '小'] },
    { id: 14, name: '狐狸', meaning: '工作、狡猾、自私、技巧', keywords: ['工作', '狡猾', '自私'] },
    { id: 15, name: '熊', meaning: '力量、权威、母亲、财富', keywords: ['力量', '权威', '财富'] },
    { id: 16, name: '星星', meaning: '希望、指引、命运、网络', keywords: ['希望', '指引', '命运'] },
    { id: 17, name: '鹳', meaning: '改变、进步、迁移、提升', keywords: ['改变', '进步', '迁移'] },
    { id: 18, name: '狗', meaning: '忠诚、朋友、信任、陪伴', keywords: ['忠诚', '朋友', '信任'] },
    { id: 19, name: '塔', meaning: '孤独、权威、官方、隔离', keywords: ['孤独', '权威', '官方'] },
    { id: 20, name: '花园', meaning: '社交、公众、聚会、开放', keywords: ['社交', '公众', '聚会'] },
    { id: 21, name: '山', meaning: '障碍、延迟、挑战、停滞', keywords: ['障碍', '延迟', '挑战'] },
    { id: 22, name: '十字路口', meaning: '选择、决策、多重路径、变化', keywords: ['选择', '决策', '变化'] },
    { id: 23, name: '老鼠', meaning: '焦虑、损失、侵蚀、压力', keywords: ['焦虑', '损失', '侵蚀'] },
    { id: 24, name: '心', meaning: '爱情、感情、激情、浪漫', keywords: ['爱情', '感情', '激情'] },
    { id: 25, name: '戒指', meaning: '承诺、契约、循环、婚姻', keywords: ['承诺', '契约', '循环'] },
    { id: 26, name: '书', meaning: '秘密、知识、教育、隐藏', keywords: ['秘密', '知识', '教育'] },
    { id: 27, name: '信', meaning: '文件、消息、通信、文档', keywords: ['文件', '消息', '通信'] },
    { id: 28, name: '男人', meaning: '男性、主动、阳性能量', keywords: ['男性', '主动', '阳性能量'] },
    { id: 29, name: '女人', meaning: '女性、被动、阴性能量', keywords: ['女性', '被动', '阴性能量'] },
    { id: 30, name: '百合', meaning: '纯洁、和平、长辈、性', keywords: ['纯洁', '和平', '长辈'] },
    { id: 31, name: '太阳', meaning: '成功、活力、清晰、快乐', keywords: ['成功', '活力', '清晰'] },
    { id: 32, name: '月亮', meaning: '声誉、情绪、直觉、周期', keywords: ['声誉', '情绪', '直觉'] },
    { id: 33, name: '钥匙', meaning: '答案、重要、命运、解锁', keywords: ['答案', '重要', '命运'] },
    { id: 34, name: '鱼', meaning: '财富、商业、丰富、流动', keywords: ['财富', '商业', '丰富'] },
    { id: 35, name: '锚', meaning: '稳定、工作、安全、持久', keywords: ['稳定', '工作', '安全'] },
    { id: 36, name: '十字架', meaning: '负担、命运、痛苦、信仰', keywords: ['负担', '命运', '痛苦'] }
];

let lenormandCount = 1;

window.setLenormandCount = function(count) {
    lenormandCount = count;
    document.querySelectorAll('.lenormand-num-btn').forEach(btn => {
        btn.classList.remove('active');
        if (parseInt(btn.querySelector('.leno-btn-num').textContent) === count) {
            btn.classList.add('active');
        }
    });

    const desc = document.getElementById('leno-num-desc');
    if (desc) {
        desc.textContent = count === 1 ? '单张牌 · 直达答案' : '三张牌 · 过去·现在·未来';
    }
};

window.startLenormandDraw = function() {
    const setup = document.getElementById('lenormand-setup');
    const result = document.getElementById('lenormand-result');
    const resetBtn = document.getElementById('lenormand-reset-btn');
    const question = document.getElementById('lenormand-question').value.trim();

    if (setup) setup.style.display = 'none';
    if (result) result.style.display = 'block';
    if (resetBtn) resetBtn.style.display = 'inline-block';

    // 随机抽牌
    const shuffled = [...lenormandCards].sort(() => Math.random() - 0.5);
    const drawn = shuffled.slice(0, lenormandCount);

    let html = '';
    if (question) {
        html += `<div class="leno-question-display">「${escapeHtml(question)}」</div>`;
    }

    html += '<div class="leno-cards-result">';

    const positions = lenormandCount === 3 ? ['过去', '现在', '未来'] : ['答案'];

    drawn.forEach((card, i) => {
        html += `
            <div class="leno-card-item">
                <div class="leno-card-position">${positions[i] || ''}</div>
                <div class="leno-card-number">${card.id}</div>
                <div class="leno-card-name">${card.name}</div>
                <div class="leno-card-meaning">${card.meaning}</div>
                <div class="leno-card-keywords">
                    ${card.keywords.map(k => `<span class="leno-keyword">${k}</span>`).join('')}
                </div>
            </div>
        `;
    });

    html += '</div>';

    // 综合解读
    if (lenormandCount === 3) {
        const combined = generateLenormandReading(drawn);
        html += `<div class="leno-reading">${combined}</div>`;
    }

    result.innerHTML = html;

    // 保存到历史
    saveDiviHistory({
        type: 'lenormand',
        count: lenormandCount,
        question: question,
        cards: drawn.map(c => ({ id: c.id, name: c.name })),
        timestamp: Date.now()
    });
};

function generateLenormandReading(cards) {
    const meanings = cards.map(c => c.meaning);
    return `综合解读：${cards[0].name}代表${meanings[0].split('、')[0]}，
        经由${cards[1].name}的${meanings[1].split('、')[0]}，
        最终导向${cards[2].name}所象征的${meanings[2].split('、')[0]}。
        整体能量流动提示你关注当下转变，顺势而为。`;
}

window.resetLenormand = function() {
    const setup = document.getElementById('lenormand-setup');
    const result = document.getElementById('lenormand-result');
    const resetBtn = document.getElementById('lenormand-reset-btn');
    const question = document.getElementById('lenormand-question');

    if (setup) setup.style.display = 'block';
    if (result) {
        result.style.display = 'none';
        result.innerHTML = '';
    }
    if (resetBtn) resetBtn.style.display = 'none';
    if (question) question.value = '';
};

// ==================== 塔罗占卜 ====================

const tarotCards = [
    { name: '愚者', meaning: '新的开始、冒险、天真、自由', upright: '新的开始、冒险精神、纯真信任', reversed: '鲁莽、缺乏计划、轻信' },
    { name: '魔术师', meaning: '创造力、意志力、显化、技能', upright: '创造力、资源整合、主动行动', reversed: '欺骗、操纵、技能不足' },
    { name: '女祭司', meaning: '直觉、潜意识、神秘、内在智慧', upright: '直觉指引、内在智慧、静观其变', reversed: '忽视直觉、表面化、秘密暴露' },
    { name: '皇后', meaning: '丰饶、母性、自然、创造力', upright: '丰盛、滋养、创造力、感官享受', reversed: '依赖、过度保护、 creative block' },
    { name: '皇帝', meaning: '权威、结构、父性、控制', upright: '稳定结构、领导力、自律', reversed: '专制、僵化、滥用权力' },
    { name: '教皇', meaning: '传统、信仰、教育、精神指引', upright: '传统智慧、精神指引、学习', reversed: '反叛、非传统、个人信仰' },
    { name: '恋人', meaning: '爱情、选择、和谐、价值观', upright: '爱情、重要选择、价值观一致', reversed: '不和谐、错误选择、价值观冲突' },
    { name: '战车', meaning: '意志力、胜利、决心、控制', upright: '意志力、胜利、克服障碍', reversed: '失控、挫败、缺乏方向' },
    { name: '力量', meaning: '勇气、耐心、内在力量、同情心', upright: '内在力量、耐心、以柔克刚', reversed: '软弱、失控、滥用力量' },
    { name: '隐士', meaning: '内省、独处、寻求真理、指引', upright: '内省、寻求真理、独处充电', reversed: '孤立、迷失、拒绝帮助' },
    { name: '命运之轮', meaning: '命运、周期、转折点、机遇', upright: '好运、转折点、顺应变化', reversed: '厄运、抗拒改变、恶性循环' },
    { name: '正义', meaning: '公正、真理、因果、平衡', upright: '公正、因果、理性决策', reversed: '不公、逃避责任、偏见' },
    { name: '倒吊人', meaning: '牺牲、暂停、新视角、放手', upright: '牺牲、新视角、暂停等待', reversed: '抗拒、无谓牺牲、停滞' },
    { name: '死神', meaning: '转变、结束、新生、释放', upright: '重大转变、结束与新生、释放', reversed: '抗拒改变、停滞、无法放手' },
    { name: '节制', meaning: '平衡、调和、耐心、中庸', upright: '平衡、调和、耐心', reversed: '极端、失衡、过度' },
    { name: '恶魔', meaning: '束缚、欲望、物质主义、阴影', upright: '物质束缚、欲望、成瘾', reversed: '解放、摆脱束缚、觉醒' },
    { name: '塔', meaning: '突变、觉醒、破坏、启示', upright: '突然改变、觉醒、打破幻象', reversed: '逃避改变、渐进式崩溃' },
    { name: '星星', meaning: '希望、灵感、宁静、指引', upright: '希望、灵感、精神指引', reversed: '绝望、失去信心、灵感枯竭' },
    { name: '月亮', meaning: '幻觉、恐惧、潜意识、直觉', upright: '直觉、潜意识、面对恐惧', reversed: '幻觉消散、恐惧释放、 clarity' },
    { name: '太阳', meaning: '快乐、成功、活力、真理', upright: '快乐、成功、活力、清晰', reversed: '暂时的阴霾、过度乐观' },
    { name: '审判', meaning: '重生、觉醒、评价、宽恕', upright: '重生、觉醒、宽恕', reversed: '自我怀疑、拒绝觉醒、逃避' },
    { name: '世界', meaning: '完成、成就、整合、圆满', upright: '完成、成就、圆满、整合', reversed: '未完成、延迟、缺乏 closure' }
];

let tarotSpread = 'single';

// 初始化塔罗牌阵选择
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.tarot-spread-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tarot-spread-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            tarotSpread = this.dataset.spread;

            const desc = document.getElementById('tarot-spread-desc');
            if (desc) {
                desc.textContent = tarotSpread === 'single' ? '单张牌 · 直指当下' : '三张牌 · 过去·现在·未来';
            }
        });
    });
});

window.startTarotDraw = function() {
    const setup = document.getElementById('tarot-setup');
    const result = document.getElementById('tarot-result');
    const resetBtn = document.getElementById('tarot-reset-btn');
    const question = document.getElementById('tarot-question').value.trim();

    if (setup) setup.style.display = 'none';
    if (result) result.style.display = 'block';
    if (resetBtn) resetBtn.style.display = 'inline-block';

    const count = tarotSpread === 'single' ? 1 : 3;
    const shuffled = [...tarotCards].sort(() => Math.random() - 0.5);
    const drawn = shuffled.slice(0, count);

    let html = '';
    if (question) {
        html += `<div class="leno-question-display">「${escapeHtml(question)}」</div>`;
    }

    html += '<div class="leno-cards-result">';

    const positions = count === 3 ? ['过去', '现在', '未来'] : ['当下'];

    drawn.forEach((card, i) => {
        const isReversed = Math.random() < 0.3; // 30% 概率逆位
        const meaning = isReversed ? card.reversed : card.upright;

        html += `
            <div class="leno-card-item ${isReversed ? 'reversed' : ''}">
                <div class="leno-card-position">${positions[i]}</div>
                <div class="leno-card-name">${card.name}${isReversed ? '（逆位）' : '（正位）'}</div>
                <div class="leno-card-meaning">${meaning}</div>
            </div>
        `;
    });

    html += '</div>';

    if (count === 3) {
        const combined = generateTarotReading(drawn);
        html += `<div class="leno-reading">${combined}</div>`;
    }

    result.innerHTML = html;

    saveDiviHistory({
        type: 'tarot',
        spread: tarotSpread,
        question: question,
        cards: drawn.map(c => c.name),
        timestamp: Date.now()
    });
};

function generateTarotReading(cards) {
    return `牌阵解读：从${cards[0].name}所代表的过去经历，
        你正步入${cards[1].name}呈现的当下能量中，
        而${cards[2].name}预示着未来的发展方向。
        建议保持觉察，顺应能量的自然流动。`;
}

window.resetTarotDivination = function() {
    const setup = document.getElementById('tarot-setup');
    const result = document.getElementById('tarot-result');
    const resetBtn = document.getElementById('tarot-reset-btn');
    const question = document.getElementById('tarot-question');

    if (setup) setup.style.display = 'block';
    if (result) {
        result.style.display = 'none';
        result.innerHTML = '';
    }
    if (resetBtn) resetBtn.style.display = 'none';
    if (question) question.value = '';
};

// ==================== 占卜历史 ====================

function saveDiviHistory(record) {
    try {
        let history = JSON.parse(localStorage.getItem('diviHistory') || '[]');
        history.unshift(record);
        if (history.length > 50) history = history.slice(0, 50);
        localStorage.setItem('diviHistory', JSON.stringify(history));
        renderDiviHistory();
    } catch(e) {}
}

window.clearDiviHistory = function() {
    if (!confirm('确定要清空所有占卜记录吗？')) return;
    localStorage.removeItem('diviHistory');
    renderDiviHistory();
};

function renderDiviHistory() {
    const list = document.getElementById('divi-history-list');
    const empty = document.getElementById('divi-history-empty');
    if (!list || !empty) return;

    try {
        const history = JSON.parse(localStorage.getItem('diviHistory') || '[]');

        if (history.length === 0) {
            list.style.display = 'none';
            empty.style.display = 'block';
            return;
        }

        list.style.display = 'flex';
        empty.style.display = 'none';

        list.innerHTML = history.map(item => {
            const date = new Date(item.timestamp);
            const dateStr = `${date.getMonth()+1}/${date.getDate()} ${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`;

            let typeLabel = item.type === 'lenormand' ? '雷诺曼' : '塔罗';
            let typeIcon = item.type === 'lenormand' ? '🌙' : '⭐';
            let cardsText = item.cards ? item.cards.map(c => typeof c === 'string' ? c : c.name).join(' · ') : '';

            return `
                <div class="divi-history-item">
                    <div class="divi-history-header">
                        <span class="divi-history-type">${typeIcon} ${typeLabel}${item.count === 3 ? '三张' : (item.spread === 'single' ? '单张' : '')}</span>
                        <span class="divi-history-date">${dateStr}</span>
                    </div>
                    ${item.question ? `<div class="divi-history-question">「${escapeHtml(item.question)}」</div>` : ''}
                    <div class="divi-history-cards">${cardsText}</div>
                </div>
            `;
        }).join('');
    } catch(e) {
        list.style.display = 'none';
        empty.style.display = 'block';
    }
}

// ==================== 标签切换 ====================

window.switchFLTab = function(tab) {
    document.querySelectorAll('.fl-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.fl-panel').forEach(p => p.classList.remove('fl-panel-active'));

    const tabEl = document.getElementById('fl-tab-' + tab);
    const panelEl = document.getElementById('fl-panel-' + tab);

    if (tabEl) tabEl.classList.add('active');
    if (panelEl) panelEl.classList.add('fl-panel-active');

    if (tab === 'fortune') {
        renderFortune();
    } else if (tab === 'divihistory') {
        renderDiviHistory();
    }
};

// ==================== 初始化 ====================

function initGames() {
    initCoinToss();
    initWheel();
    initDecisionMenu();

    // 运势按钮
    const fortuneBtn = document.getElementById('fortune-lenormand-function');
    if (fortuneBtn) {
        fortuneBtn.onclick = function() {
            const advancedModal = document.getElementById('advanced-modal');
            if (advancedModal) hideModal(advancedModal);

            const modal = document.getElementById('fortune-lenormand-modal');
            if (modal) {
                showModal(modal);
                renderFortune();
            }
        };
    }

    // 关闭按钮
    const closeFortune = document.getElementById('close-fortune');
    if (closeFortune) {
        closeFortune.onclick = function() {
            hideModal(document.getElementById('fortune-lenormand-modal'));
        };
    }

    const closeLenormand = document.getElementById('close-lenormand');
    if (closeLenormand) {
        closeLenormand.onclick = function() {
            hideModal(document.getElementById('fortune-lenormand-modal'));
        };
    }

    const closeTarot = document.getElementById('close-tarot-divination');
    if (closeTarot) {
        closeTarot.onclick = function() {
            hideModal(document.getElementById('fortune-lenormand-modal'));
        };
    }

    const closeDiviHistory = document.getElementById('close-divihistory');
    if (closeDiviHistory) {
    
      
     