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
