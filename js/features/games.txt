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
        closeDiviHistory.onclick = function() {
            hideModal(document.getElementById('fortune-lenormand-modal'));
        };
    }
}

// 工具函数
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// DOM 加载完成后初始化
document.addEventListener('DOMContentLoaded', initGames);

// 导出到全局
window.initGames = initGames;
window.generateFortune = generateFortune;
window.renderFortune = renderFortune;
