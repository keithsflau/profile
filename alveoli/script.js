// 肺泡空氣互換實驗 - 互動式動畫

// 實驗狀態
let experimentState = {
    breathingRate: 12, // 次/分鐘
    o2Concentration: 21, // %
    co2Concentration: 5, // %
    animationSpeed: 1.0,
    isPlaying: true,
    phase: 'inhale' // 'inhale' 或 'exhale'
};

// 動畫相關
let animationInterval = null;
let breathCycleDuration = 5000; // 毫秒
let animationFrame = null;

// 初始化實驗
document.addEventListener('DOMContentLoaded', () => {
    initializeExperiment();
    setupControls();
    startAnimation();
});

// 初始化實驗
function initializeExperiment() {
    updateDisplay();
    updateBreathCycle();
    createO2Molecules();
    createCO2Molecules();
}

// 設置控制面板
function setupControls() {
    const breathingSlider = document.getElementById('breathingRate');
    const o2Slider = document.getElementById('o2Concentration');
    const co2Slider = document.getElementById('co2Concentration');
    const speedSlider = document.getElementById('animationSpeed');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const resetBtn = document.getElementById('resetBtn');

    breathingSlider.addEventListener('input', (e) => {
        experimentState.breathingRate = parseInt(e.target.value);
        document.getElementById('breathValue').textContent = experimentState.breathingRate;
        updateBreathCycle();
        updateDisplay();
    });

    o2Slider.addEventListener('input', (e) => {
        experimentState.o2Concentration = parseInt(e.target.value);
        document.getElementById('o2Value').textContent = experimentState.o2Concentration;
        updateDisplay();
    });

    co2Slider.addEventListener('input', (e) => {
        experimentState.co2Concentration = parseInt(e.target.value);
        document.getElementById('co2Value').textContent = experimentState.co2Concentration;
        updateDisplay();
    });

    speedSlider.addEventListener('input', (e) => {
        experimentState.animationSpeed = parseFloat(e.target.value);
        document.getElementById('speedValue').textContent = experimentState.animationSpeed.toFixed(1);
        updateBreathCycle();
    });

    playPauseBtn.addEventListener('click', () => {
        experimentState.isPlaying = !experimentState.isPlaying;
        if (experimentState.isPlaying) {
            playPauseBtn.textContent = '⏸ 暫停';
            startAnimation();
        } else {
            playPauseBtn.textContent = '▶ 播放';
            stopAnimation();
        }
    });

    resetBtn.addEventListener('click', () => {
        experimentState.breathingRate = 12;
        experimentState.o2Concentration = 21;
        experimentState.co2Concentration = 5;
        experimentState.animationSpeed = 1.0;
        
        breathingSlider.value = 12;
        o2Slider.value = 21;
        co2Slider.value = 5;
        speedSlider.value = 1.0;
        
        updateDisplay();
        updateBreathCycle();
    });
}

// 更新呼吸週期
function updateBreathCycle() {
    // 計算每個呼吸週期的持續時間（毫秒）
    breathCycleDuration = (60 / experimentState.breathingRate) * 1000 / experimentState.animationSpeed;
    
    if (animationInterval) {
        clearInterval(animationInterval);
    }
    
    if (experimentState.isPlaying) {
        startAnimation();
    }
}

// 開始動畫
function startAnimation() {
    if (animationInterval) {
        clearInterval(animationInterval);
    }
    
    // 呼吸週期循環
    animationInterval = setInterval(() => {
        if (experimentState.phase === 'inhale') {
            performInhale();
            setTimeout(() => {
                experimentState.phase = 'exhale';
            }, breathCycleDuration / 2);
        } else {
            performExhale();
            setTimeout(() => {
                experimentState.phase = 'inhale';
            }, breathCycleDuration / 2);
        }
    }, breathCycleDuration / 2);
    
    // 連續動畫
    animateLoop();
}

// 停止動畫
function stopAnimation() {
    if (animationInterval) {
        clearInterval(animationInterval);
    }
    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
    }
}

// 執行吸氣動畫
function performInhale() {
    // 創建氧氣分子從氣道進入肺泡
    createInhaleO2Molecules();
    
    // 更新肺泡大小（吸氣時擴張）
    expandAlveoli();
    
    // 顯示氧氣進入血液的動畫
    animateO2ToBlood();
    
    // 更新狀態顯示
    document.getElementById('o2Count').textContent = '吸入中...';
    document.getElementById('co2Count').textContent = '等待呼出';
}

// 執行呼氣動畫
function performExhale() {
    // 創建二氧化碳分子從肺泡排出
    createExhaleCO2Molecules();
    
    // 更新肺泡大小（呼氣時收縮）
    contractAlveoli();
    
    // 顯示二氧化碳從血液進入肺泡的動畫
    animateCO2FromBlood();
    
    // 更新狀態顯示
    document.getElementById('o2Count').textContent = '已完成交換';
    document.getElementById('co2Count').textContent = '呼出中...';
}

// 創建吸入的氧氣分子
function createInhaleO2Molecules() {
    const moleculesIn = document.getElementById('moleculesIn');
    const count = Math.floor(experimentState.o2Concentration / 5);
    
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const molecule = document.createElement('div');
            molecule.className = 'o2-molecule-in';
            molecule.style.cssText = `
                position: absolute;
                width: 15px;
                height: 15px;
                background: radial-gradient(circle, #2196f3 0%, #1976d2 100%);
                border-radius: 50%;
                box-shadow: 0 0 6px rgba(33, 150, 243, 0.6);
                left: 50%;
                bottom: 100%;
                animation: inhale-o2 ${breathCycleDuration / 4}ms ease-out forwards;
            `;
            moleculesIn.appendChild(molecule);
            
            setTimeout(() => molecule.remove(), breathCycleDuration / 4);
        }, i * 50);
    }
}

// 創建呼出的二氧化碳分子
function createExhaleCO2Molecules() {
    const moleculesOut = document.getElementById('moleculesOut');
    const count = Math.floor(experimentState.co2Concentration * 2);
    
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const molecule = document.createElement('div');
            molecule.className = 'co2-molecule-out';
            molecule.style.cssText = `
                position: absolute;
                width: 15px;
                height: 15px;
                background: radial-gradient(circle, #ff9800 0%, #f57c00 100%);
                border-radius: 50%;
                box-shadow: 0 0 6px rgba(255, 152, 0, 0.6);
                left: 50%;
                top: 100%;
                animation: exhale-co2 ${breathCycleDuration / 4}ms ease-out forwards;
            `;
            moleculesOut.appendChild(molecule);
            
            setTimeout(() => molecule.remove(), breathCycleDuration / 4);
        }, i * 50);
    }
}

// 擴張肺泡
function expandAlveoli() {
    const alveoli = document.querySelectorAll('.alveolus');
    alveoli.forEach(alveolus => {
        alveolus.style.animation = `breathing ${breathCycleDuration}ms ease-in-out infinite`;
    });
}

// 收縮肺泡
function contractAlveoli() {
    // 由 CSS 動畫處理
}

// 動畫 O₂ 進入血液
function animateO2ToBlood() {
    for (let i = 1; i <= 3; i++) {
        const o2ToBlood = document.getElementById(`o2ToBlood${i}`);
        const particle = document.createElement('div');
        particle.className = 'o2-particle';
        particle.style.cssText = `
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            animation: o2-to-blood ${breathCycleDuration / 4}ms ease-in forwards;
        `;
        o2ToBlood.appendChild(particle);
        
        setTimeout(() => particle.remove(), breathCycleDuration / 4);
    }
}

// 動畫 CO₂ 從血液出來
function animateCO2FromBlood() {
    for (let i = 1; i <= 3; i++) {
        const co2FromBlood = document.getElementById(`co2FromBlood${i}`);
        const particle = document.createElement('div');
        particle.className = 'co2-particle';
        particle.style.cssText = `
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            animation: co2-from-blood ${breathCycleDuration / 4}ms ease-out forwards;
        `;
        co2FromBlood.appendChild(particle);
        
        setTimeout(() => particle.remove(), breathCycleDuration / 4);
    }
}

// 創建肺泡內的 O₂ 分子
function createO2Molecules() {
    for (let i = 1; i <= 3; i++) {
        const container = document.getElementById(`o2Molecules${i}`);
        const count = 8;
        
        for (let j = 0; j < count; j++) {
            const molecule = document.createElement('div');
            molecule.className = 'o2-molecule';
            const angle = (360 / count) * j;
            const radius = 60;
            const x = 90 + Math.cos(angle * Math.PI / 180) * radius;
            const y = 90 + Math.sin(angle * Math.PI / 180) * radius;
            molecule.style.left = x + 'px';
            molecule.style.top = y + 'px';
            molecule.style.animationDelay = (j * 0.2) + 's';
            container.appendChild(molecule);
        }
    }
}

// 創建肺泡內的 CO₂ 分子
function createCO2Molecules() {
    for (let i = 1; i <= 3; i++) {
        const container = document.getElementById(`co2Molecules${i}`);
        const count = 6;
        
        for (let j = 0; j < count; j++) {
            const molecule = document.createElement('div');
            molecule.className = 'co2-molecule';
            const angle = (360 / count) * j + 30;
            const radius = 50;
            const x = 90 + Math.cos(angle * Math.PI / 180) * radius;
            const y = 90 + Math.sin(angle * Math.PI / 180) * radius;
            molecule.style.left = x + 'px';
            molecule.style.top = y + 'px';
            molecule.style.animationDelay = (j * 0.25) + 's';
            container.appendChild(molecule);
        }
    }
}

// 動畫循環
function animateLoop() {
    if (!experimentState.isPlaying) return;
    
    // 持續的動畫效果
    animationFrame = requestAnimationFrame(animateLoop);
}

// 更新顯示
function updateDisplay() {
    document.getElementById('breathRateValue').textContent = experimentState.breathingRate;
    
    // 計算交換率（基於濃度）
    const o2ExchangeRate = Math.min(95 + (experimentState.o2Concentration - 21) * 2, 100);
    const co2ClearanceRate = Math.min(88 + (experimentState.co2Concentration - 5) * 3, 100);
    
    document.getElementById('o2ExchangeRate').textContent = Math.round(o2ExchangeRate);
    document.getElementById('co2ClearanceRate').textContent = Math.round(co2ClearanceRate);
}

// 添加 CSS 動畫樣式
const style = document.createElement('style');
style.textContent = `
    @keyframes inhale-o2 {
        0% {
            bottom: 100%;
            opacity: 1;
            transform: translateX(-50%) scale(1);
        }
        50% {
            opacity: 0.8;
            transform: translateX(-50%) scale(1.2);
        }
        100% {
            bottom: -20px;
            opacity: 0;
            transform: translateX(-50%) scale(0.8);
        }
    }
    
    @keyframes exhale-co2 {
        0% {
            top: 100%;
            opacity: 1;
            transform: translateX(-50%) scale(1);
        }
        50% {
            opacity: 0.8;
            transform: translateX(-50%) scale(1.2);
        }
        100% {
            top: -20px;
            opacity: 0;
            transform: translateX(-50%) scale(0.8);
        }
    }
`;
document.head.appendChild(style);

// 初始執行
performInhale();
setTimeout(() => {
    experimentState.phase = 'exhale';
}, breathCycleDuration / 2);
