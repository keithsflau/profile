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
    // Create oxygen molecules entering from airway into alveoli
    createInhaleO2Molecules();
    
    // Expand alveoli (inhale expands)
    expandAlveoli();
    
    // Show oxygen entering blood (O₂ flows into capillary)
    animateO2ToBlood();
    
    // Update status display
    document.getElementById('o2Count').textContent = 'Inhaling...';
    document.getElementById('co2Count').textContent = 'Waiting to exhale';
}

// Perform exhale animation
function performExhale() {
    // Create carbon dioxide molecules exiting from alveoli
    createExhaleCO2Molecules();
    
    // Contract alveoli (exhale contracts)
    contractAlveoli();
    
    // Show carbon dioxide from blood entering alveoli (CO₂ flows out of capillary)
    animateCO2FromBlood();
    
    // Update status display
    document.getElementById('o2Count').textContent = 'Exchange complete';
    document.getElementById('co2Count').textContent = 'Exhaling...';
}

// Create inhaled oxygen molecules
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

// Create exhaled carbon dioxide molecules
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

// Expand alveoli
function expandAlveoli() {
    const alveoli = document.querySelectorAll('.alveolus');
    alveoli.forEach(alveolus => {
        alveolus.style.animation = `breathing ${breathCycleDuration}ms ease-in-out infinite`;
    });
}

// Contract alveoli
function contractAlveoli() {
    // Handled by CSS animation
}

// Animate O₂ entering blood (flowing into capillary network)
function animateO2ToBlood() {
    for (let i = 1; i <= 3; i++) {
        const o2ToBlood = document.getElementById(`o2ToBlood${i}`);
        if (!o2ToBlood) continue;
        
        // Create O₂ molecules flowing from center of alveolus to surrounding capillaries
        const directions = ['top', 'right', 'bottom', 'left'];
        const positions = [
            { x: '50%', y: '50%', offsetX: '0', offsetY: '-90px' }, // top
            { x: '50%', y: '50%', offsetX: '90px', offsetY: '0' },  // right
            { x: '50%', y: '50%', offsetX: '0', offsetY: '90px' },  // bottom
            { x: '50%', y: '50%', offsetX: '-90px', offsetY: '0' }  // left
        ];
        
        directions.forEach((direction, idx) => {
            for (let j = 0; j < 2; j++) {
                setTimeout(() => {
                    const particle = document.createElement('div');
                    particle.className = `o2-particle ${direction}`;
                    particle.style.cssText = `
                        position: absolute;
                        left: ${positions[idx].x};
                        top: ${positions[idx].y};
                        transform: translate(-50%, -50%);
                        animation: o2-${direction} ${breathCycleDuration / 4}ms ease-in forwards;
                    `;
                    
                    o2ToBlood.appendChild(particle);
                    setTimeout(() => particle.remove(), breathCycleDuration / 4);
                }, (idx * 150) + (j * 50));
            }
        });
    }
}

// Animate CO₂ from blood entering alveoli (flowing out of capillary network)
function animateCO2FromBlood() {
    for (let i = 1; i <= 3; i++) {
        const co2FromBlood = document.getElementById(`co2FromBlood${i}`);
        if (!co2FromBlood) continue;
        
        // Create CO₂ molecules flowing from surrounding capillaries to center of alveolus
        const directions = ['top', 'right', 'bottom', 'left'];
        const positions = [
            { x: '50%', y: '0%', offsetX: '0', offsetY: '-90px' },     // from top
            { x: '100%', y: '50%', offsetX: '90px', offsetY: '0' },    // from right
            { x: '50%', y: '100%', offsetX: '0', offsetY: '90px' },    // from bottom
            { x: '0%', y: '50%', offsetX: '-90px', offsetY: '0' }      // from left
        ];
        
        directions.forEach((direction, idx) => {
            for (let j = 0; j < 2; j++) {
                setTimeout(() => {
                    const particle = document.createElement('div');
                    particle.className = `co2-particle ${direction}`;
                    particle.style.cssText = `
                        position: absolute;
                        left: ${positions[idx].x};
                        top: ${positions[idx].y};
                        transform: translate(-50%, -50%);
                        animation: co2-to-${direction} ${breathCycleDuration / 4}ms ease-out forwards;
                    `;
                    
                    co2FromBlood.appendChild(particle);
                    setTimeout(() => particle.remove(), breathCycleDuration / 4);
                }, (idx * 150) + (j * 50));
            }
        });
    }
}

// Create blood flow animation in capillary network
function createBloodFlow() {
    for (let i = 1; i <= 3; i++) {
        const bloodCellsContainer = document.getElementById(`bloodCells${i}`);
        if (!bloodCellsContainer) continue;
        
        // Create multiple blood cells flowing around the alveolus
        const cellCount = 6;
        for (let j = 0; j < cellCount; j++) {
            const bloodCell = document.createElement('div');
            bloodCell.className = 'blood-cell';
            bloodCell.style.cssText = `
                animation: blood-flow-around ${8 + j}s linear infinite;
                animation-delay: ${j * 1.3}s;
            `;
            bloodCellsContainer.appendChild(bloodCell);
        }
    }
}

// Create O₂ molecules inside alveoli
function createO2Molecules() {
    for (let i = 1; i <= 3; i++) {
        const container = document.getElementById(`o2Molecules${i}`);
        if (!container) continue;
        
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

// Create CO₂ molecules inside alveoli
function createCO2Molecules() {
    for (let i = 1; i <= 3; i++) {
        const container = document.getElementById(`co2Molecules${i}`);
        if (!container) continue;
        
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
    
    @keyframes o2-into-capillary {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(0, 70px) scale(0.7);
            opacity: 0.8;
        }
    }
    
    @keyframes co2-out-of-capillary {
        0% {
            transform: translate(0, 0) scale(0.7);
            opacity: 0.8;
        }
        100% {
            transform: translate(0, -70px) scale(1);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Initial execution
performInhale();
setTimeout(() => {
    experimentState.phase = 'exhale';
}, breathCycleDuration / 2);