// Alveolar Gas Exchange Experiment - Interactive Animation

// Experiment state
let experimentState = {
    breathingRate: 12, // breaths per minute
    o2Concentration: 21, // %
    co2Concentration: 5, // %
    animationSpeed: 1.0,
    isPlaying: true,
    phase: 'inhale' // 'inhale' or 'exhale'
};

// Animation related
let animationInterval = null;
let breathCycleDuration = 5000; // milliseconds
let animationFrame = null;

// Initialize experiment
document.addEventListener('DOMContentLoaded', () => {
    initializeExperiment();
    setupControls();
    startAnimation();
});

// Initialize experiment
function initializeExperiment() {
    updateDisplay();
    updateBreathCycle();
    createO2Molecules();
    createCO2Molecules();
    createBloodFlow();
    createExchangeArrows();
}

// Setup control panel
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
            playPauseBtn.textContent = '⏸ Pause';
            startAnimation();
        } else {
            playPauseBtn.textContent = '▶ Play';
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

// Update breath cycle
function updateBreathCycle() {
    // Calculate duration of each breath cycle (milliseconds)
    breathCycleDuration = (60 / experimentState.breathingRate) * 1000 / experimentState.animationSpeed;
    
    if (animationInterval) {
        clearInterval(animationInterval);
    }
    
    if (experimentState.isPlaying) {
        startAnimation();
    }
}

// Start animation
function startAnimation() {
    if (animationInterval) {
        clearInterval(animationInterval);
    }
    
    // Breath cycle loop
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
    
    // Continuous animation
    animateLoop();
}

// Stop animation
function stopAnimation() {
    if (animationInterval) {
        clearInterval(animationInterval);
    }
    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
    }
}

// Perform inhale animation
function performInhale() {
    // Create oxygen molecules entering from airway into alveolus
    createInhaleO2Molecules();
    
    // Expand alveolus (inhale expands)
    expandAlveolus();
    
    // Update status display
    const o2Count = document.getElementById('o2Count');
    const co2Count = document.getElementById('co2Count');
    if (o2Count) o2Count.textContent = 'Inhaling...';
    if (co2Count) co2Count.textContent = 'Waiting to exhale';
}

// Perform exhale animation
function performExhale() {
    // Create carbon dioxide molecules exiting from alveolus
    createExhaleCO2Molecules();
    
    // Contract alveolus (exhale contracts)
    contractAlveolus();
    
    // Update status display
    const o2Count = document.getElementById('o2Count');
    const co2Count = document.getElementById('co2Count');
    if (o2Count) o2Count.textContent = 'Exchange complete';
    if (co2Count) co2Count.textContent = 'Exhaling...';
}

// Create inhaled oxygen molecules
function createInhaleO2Molecules() {
    const moleculesIn = document.getElementById('moleculesIn');
    if (!moleculesIn) return;
    
    const count = Math.floor(experimentState.o2Concentration / 5);
    
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const molecule = document.createElement('div');
            molecule.className = 'o2-molecule-in';
            molecule.style.cssText = `
                position: absolute;
                width: 12px;
                height: 12px;
                background: radial-gradient(circle, #64b5f6 0%, #2196f3 100%);
                border-radius: 50%;
                box-shadow: 0 0 6px rgba(33, 150, 243, 0.8);
                left: 50%;
                bottom: 90%;
                animation: inhale-o2 ${breathCycleDuration / 4}ms ease-out forwards;
            `;
            moleculesIn.appendChild(molecule);
            
            setTimeout(() => molecule.remove(), breathCycleDuration / 4);
        }, i * 80);
    }
}

// Create exhaled carbon dioxide molecules
function createExhaleCO2Molecules() {
    const moleculesOut = document.getElementById('moleculesOut');
    if (!moleculesOut) return;
    
    const count = Math.floor(experimentState.co2Concentration * 2);
    
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const molecule = document.createElement('div');
            molecule.className = 'co2-molecule-out';
            molecule.style.cssText = `
                position: absolute;
                width: 12px;
                height: 12px;
                background: radial-gradient(circle, #ffb74d 0%, #ff9800 100%);
                border-radius: 50%;
                box-shadow: 0 0 6px rgba(255, 152, 0, 0.8);
                left: 50%;
                top: 90%;
                animation: exhale-co2 ${breathCycleDuration / 4}ms ease-out forwards;
            `;
            moleculesOut.appendChild(molecule);
            
            setTimeout(() => molecule.remove(), breathCycleDuration / 4);
        }, i * 80);
    }
}

// Expand alveolus
function expandAlveolus() {
    const alveolus = document.getElementById('alveolus');
    if (alveolus) {
        alveolus.style.animation = `breathing ${breathCycleDuration}ms ease-in-out infinite`;
    }
}

// Contract alveolus
function contractAlveolus() {
    // Handled by CSS animation
}

// Create blood flow animation in capillary
function createBloodFlow() {
    const bloodFlowContainer = document.getElementById('bloodFlowContainer');
    if (!bloodFlowContainer) return;
    
    // Create multiple blood cells flowing through the capillary
    const cellCount = 4;
    for (let i = 0; i < cellCount; i++) {
        const bloodCell = document.createElement('div');
        bloodCell.className = 'blood-cell';
        bloodCell.style.cssText = `
            animation: blood-flow ${6 + i * 0.5}s linear infinite;
            animation-delay: ${i * 1.5}s;
        `;
        bloodFlowContainer.appendChild(bloodCell);
    }
}

// Create exchange arrows
function createExchangeArrows() {
    // O₂ arrow (red arrow from alveolus to capillary)
    const o2ArrowContainer = document.getElementById('o2ArrowContainer');
    if (o2ArrowContainer) {
        // Arrow is created in HTML, we just animate it
        o2ArrowContainer.style.animation = `pulse-arrow 3s ease-in-out infinite`;
    }
    
    // CO₂ arrow (blue arrow from capillary to alveolus)
    const co2ArrowContainer = document.getElementById('co2ArrowContainer');
    if (co2ArrowContainer) {
        co2ArrowContainer.style.animation = `pulse-arrow 3s ease-in-out infinite 1.5s`;
    }
}

// Create O₂ molecules inside alveolus
function createO2Molecules() {
    const container = document.getElementById('o2Molecules');
    if (!container) return;
    
    const count = 10;
    
    for (let j = 0; j < count; j++) {
        const molecule = document.createElement('div');
        molecule.className = 'o2-molecule';
        const angle = (360 / count) * j;
        const radiusX = 100;
        const radiusY = 120;
        const centerX = 140;
        const centerY = 160;
        const x = centerX + Math.cos(angle * Math.PI / 180) * radiusX;
        const y = centerY + Math.sin(angle * Math.PI / 180) * radiusY;
        molecule.style.left = x + 'px';
        molecule.style.top = y + 'px';
        molecule.style.animationDelay = (j * 0.2) + 's';
        container.appendChild(molecule);
    }
}

// Create CO₂ molecules inside alveolus
function createCO2Molecules() {
    const container = document.getElementById('co2Molecules');
    if (!container) return;
    
    const count = 8;
    
    for (let j = 0; j < count; j++) {
        const molecule = document.createElement('div');
        molecule.className = 'co2-molecule';
        const angle = (360 / count) * j + 22.5;
        const radiusX = 90;
        const radiusY = 110;
        const centerX = 140;
        const centerY = 160;
        const x = centerX + Math.cos(angle * Math.PI / 180) * radiusX;
        const y = centerY + Math.sin(angle * Math.PI / 180) * radiusY;
        molecule.style.left = x + 'px';
        molecule.style.top = y + 'px';
        molecule.style.animationDelay = (j * 0.25) + 's';
        container.appendChild(molecule);
    }
}

// Animation loop
function animateLoop() {
    if (!experimentState.isPlaying) return;
    
    // Continuous animation effects
    animationFrame = requestAnimationFrame(animateLoop);
}

// Update display
function updateDisplay() {
    const breathRateEl = document.getElementById('breathRateValue');
    if (breathRateEl) {
        breathRateEl.textContent = experimentState.breathingRate;
    }
    
    // Calculate exchange rate (based on concentration)
    const o2ExchangeRate = Math.min(95 + (experimentState.o2Concentration - 21) * 2, 100);
    const co2ClearanceRate = Math.min(88 + (experimentState.co2Concentration - 5) * 3, 100);
    
    const o2RateEl = document.getElementById('o2ExchangeRate');
    const co2RateEl = document.getElementById('co2ClearanceRate');
    if (o2RateEl) o2RateEl.textContent = Math.round(o2ExchangeRate);
    if (co2RateEl) co2RateEl.textContent = Math.round(co2ClearanceRate);
}

// Add CSS animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes inhale-o2 {
        0% {
            bottom: 90%;
            opacity: 1;
            transform: translateX(-50%) scale(1);
        }
        50% {
            opacity: 0.9;
            transform: translateX(-50%) scale(1.2);
        }
        100% {
            bottom: -10px;
            opacity: 0;
            transform: translateX(-50%) scale(0.9);
        }
    }
    
    @keyframes exhale-co2 {
        0% {
            top: 90%;
            opacity: 1;
            transform: translateX(-50%) scale(1);
        }
        50% {
            opacity: 0.9;
            transform: translateX(-50%) scale(1.2);
        }
        100% {
            top: -10px;
            opacity: 0;
            transform: translateX(-50%) scale(0.9);
        }
    }
    
    @keyframes pulse-arrow {
        0%, 100% {
            opacity: 0.7;
            transform: scale(1);
        }
        50% {
            opacity: 1;
            transform: scale(1.1);
        }
    }
`;
document.head.appendChild(style);

// Initial execution
performInhale();
setTimeout(() => {
    experimentState.phase = 'exhale';
}, breathCycleDuration / 2);