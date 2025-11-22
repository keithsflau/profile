// Photosynthesis Experiment - Interactive Simulation

// Experiment state
let experimentState = {
    lightIntensity: 50,
    co2Concentration: 500,
    temperature: 25,
    waterAvailability: 50,
    photosynthesisRate: 0,
    o2Production: 0,
    glucoseProduction: 0
};

// Graph data
let graphData = [];
const maxDataPoints = 50;

// Initialize experiment
document.addEventListener('DOMContentLoaded', () => {
    initializeExperiment();
    setupControls();
    setupPresets();
    startSimulation();
});

// Initialize experiment
function initializeExperiment() {
    updateDisplay();
    initializeGraph();
}

// Setup control sliders
function setupControls() {
    const lightSlider = document.getElementById('lightIntensity');
    const co2Slider = document.getElementById('co2Concentration');
    const tempSlider = document.getElementById('temperature');
    const waterSlider = document.getElementById('waterAvailability');

    lightSlider.addEventListener('input', (e) => {
        experimentState.lightIntensity = parseInt(e.target.value);
        document.getElementById('lightValue').textContent = experimentState.lightIntensity;
        updateDisplay();
    });

    co2Slider.addEventListener('input', (e) => {
        experimentState.co2Concentration = parseInt(e.target.value);
        document.getElementById('co2Value').textContent = experimentState.co2Concentration;
        updateDisplay();
    });

    tempSlider.addEventListener('input', (e) => {
        experimentState.temperature = parseInt(e.target.value);
        document.getElementById('tempValue').textContent = experimentState.temperature;
        updateDisplay();
    });

    waterSlider.addEventListener('input', (e) => {
        experimentState.waterAvailability = parseInt(e.target.value);
        document.getElementById('waterValue').textContent = experimentState.waterAvailability;
        updateDisplay();
    });
}

// Setup preset buttons
function setupPresets() {
    const presetButtons = document.querySelectorAll('.preset-btn');
    
    presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const preset = btn.dataset.preset;
            applyPreset(preset);
        });
    });
}

// Apply preset scenarios
function applyPreset(preset) {
    switch(preset) {
        case 'optimal':
            experimentState.lightIntensity = 80;
            experimentState.co2Concentration = 600;
            experimentState.temperature = 25;
            experimentState.waterAvailability = 70;
            break;
        case 'lowlight':
            experimentState.lightIntensity = 20;
            experimentState.co2Concentration = 500;
            experimentState.temperature = 25;
            experimentState.waterAvailability = 50;
            break;
        case 'hightemp':
            experimentState.lightIntensity = 50;
            experimentState.co2Concentration = 500;
            experimentState.temperature = 38;
            experimentState.waterAvailability = 50;
            break;
        case 'reset':
            experimentState.lightIntensity = 50;
            experimentState.co2Concentration = 500;
            experimentState.temperature = 25;
            experimentState.waterAvailability = 50;
            break;
    }
    
    // Update sliders
    document.getElementById('lightIntensity').value = experimentState.lightIntensity;
    document.getElementById('co2Concentration').value = experimentState.co2Concentration;
    document.getElementById('temperature').value = experimentState.temperature;
    document.getElementById('waterAvailability').value = experimentState.waterAvailability;
    
    // Update display values
    document.getElementById('lightValue').textContent = experimentState.lightIntensity;
    document.getElementById('co2Value').textContent = experimentState.co2Concentration;
    document.getElementById('tempValue').textContent = experimentState.temperature;
    document.getElementById('waterValue').textContent = experimentState.waterAvailability;
    
    updateDisplay();
}

// Calculate photosynthesis rate based on conditions
function calculatePhotosynthesisRate() {
    // Base rate calculation
    // Light intensity effect (0-1)
    const lightEffect = experimentState.lightIntensity / 100;
    
    // CO2 effect (saturates around 600 ppm)
    const co2Effect = Math.min(experimentState.co2Concentration / 600, 1);
    
    // Temperature effect (optimal around 25-30°C)
    let tempEffect;
    if (experimentState.temperature < 10) {
        tempEffect = 0;
    } else if (experimentState.temperature <= 30) {
        tempEffect = 1 - Math.abs(experimentState.temperature - 25) / 20;
    } else {
        tempEffect = Math.max(0, 1 - (experimentState.temperature - 30) / 15);
    }
    
    // Water effect (0-1)
    const waterEffect = experimentState.waterAvailability / 100;
    
    // Combined rate (molecules per minute)
    const baseRate = 100;
    const rate = baseRate * lightEffect * co2Effect * tempEffect * waterEffect;
    
    return Math.max(0, Math.round(rate));
}

// Update all displays
function updateDisplay() {
    // Calculate new rate
    experimentState.photosynthesisRate = calculatePhotosynthesisRate();
    
    // Update rate display
    document.getElementById('rateValue').textContent = experimentState.photosynthesisRate;
    
    // Update molecule counts
    experimentState.o2Production = Math.round(experimentState.photosynthesisRate * 6);
    experimentState.glucoseProduction = Math.round(experimentState.photosynthesisRate / 6);
    
    document.getElementById('o2Count').textContent = experimentState.o2Production;
    document.getElementById('glucoseCount').textContent = experimentState.glucoseProduction;
    document.getElementById('co2Count').textContent = `${experimentState.co2Concentration} ppm`;
    
    // Update plant appearance based on conditions
    updatePlantVisualization();
    
    // Update bubbles
    updateBubbles();
}

// Update plant visualization
function updatePlantVisualization() {
    const plant = document.getElementById('plant');
    const leaves = plant.querySelectorAll('.leaf');
    
    // Plant health based on photosynthesis rate
    const health = Math.min(1, experimentState.photosynthesisRate / 100);
    
    // Color intensity (green)
    const greenIntensity = Math.min(255, 100 + (health * 155));
    const color = `rgb(34, ${Math.round(greenIntensity)}, 34)`;
    
    leaves.forEach((leaf) => {
        // Only update color and opacity, don't touch transform to preserve animations
        leaf.style.backgroundColor = color;
        leaf.style.opacity = Math.max(0.5, health);
    });
    
    // Plant size based on glucose production - use CSS variable
    const scale = 0.8 + (health * 0.4);
    plant.style.setProperty('--plant-scale', scale);
    // Use transform on plant container, not individual leaves
    plant.style.transform = `scale(${scale})`;
}

// Update oxygen bubbles
let bubbleUpdateInterval = null;

function updateBubbles() {
    const container = document.getElementById('bubblesContainer');
    
    // Number of bubbles based on O2 production
    const numBubbles = Math.min(20, Math.max(0, Math.floor(experimentState.o2Production / 10)));
    
    // Only update if number changed significantly or container is empty
    const currentBubbles = container.children.length;
    if (Math.abs(currentBubbles - numBubbles) > 2 || currentBubbles === 0) {
        // Clear and recreate bubbles
        container.innerHTML = '';
        
        for (let i = 0; i < numBubbles; i++) {
            const bubble = document.createElement('div');
            bubble.className = 'bubble';
            bubble.style.left = `${20 + Math.random() * 60}%`;
            bubble.style.animationDelay = `${Math.random() * 2}s`;
            bubble.style.animationDuration = `${2 + Math.random() * 2}s`;
            container.appendChild(bubble);
        }
    }
    
    // Continuously add new bubbles if photosynthesis is active
    if (experimentState.photosynthesisRate > 0 && !bubbleUpdateInterval) {
        bubbleUpdateInterval = setInterval(() => {
            if (experimentState.photosynthesisRate > 0 && container.children.length < numBubbles) {
                const bubble = document.createElement('div');
                bubble.className = 'bubble';
                bubble.style.left = `${20 + Math.random() * 60}%`;
                bubble.style.animationDelay = '0s';
                bubble.style.animationDuration = `${2 + Math.random() * 2}s`;
                container.appendChild(bubble);
                
                // Remove bubble after animation completes
                setTimeout(() => {
                    if (bubble.parentNode) {
                        bubble.remove();
                    }
                }, parseFloat(bubble.style.animationDuration) * 1000);
            }
        }, 1000);
    } else if (experimentState.photosynthesisRate === 0 && bubbleUpdateInterval) {
        clearInterval(bubbleUpdateInterval);
        bubbleUpdateInterval = null;
    }
}

// Initialize graph
function initializeGraph() {
    const canvas = document.getElementById('rateGraph');
    const ctx = canvas.getContext('2d');
    
    // Setup data logging
    document.getElementById('logDataBtn').addEventListener('click', () => {
        logDataPoint();
    });
    
    document.getElementById('clearLogBtn').addEventListener('click', () => {
        graphData = [];
        document.getElementById('logEntries').innerHTML = '';
        drawGraph();
    });
    
    // Start graph update loop
    setInterval(() => {
        graphData.push({
            time: Date.now(),
            rate: experimentState.photosynthesisRate
        });
        
        // Keep only last maxDataPoints
        if (graphData.length > maxDataPoints) {
            graphData.shift();
        }
        
        drawGraph();
    }, 1000);
}

// Draw graph
function drawGraph() {
    const canvas = document.getElementById('rateGraph');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    if (graphData.length < 2) return;
    
    // Draw axes
    ctx.strokeStyle = '#2e7d32';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(30, height - 20);
    ctx.lineTo(width - 10, height - 20);
    ctx.moveTo(30, 20);
    ctx.lineTo(30, height - 20);
    ctx.stroke();
    
    // Draw labels
    ctx.fillStyle = '#2e7d32';
    ctx.font = '12px sans-serif';
    ctx.fillText('Time', width / 2, height - 5);
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Rate (molecules/min)', 0, 0);
    ctx.restore();
    
    // Draw data line
    ctx.strokeStyle = '#4caf50';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    const maxRate = Math.max(...graphData.map(d => d.rate), 100);
    const timeRange = graphData[graphData.length - 1].time - graphData[0].time;
    
    graphData.forEach((point, index) => {
        const x = 30 + ((point.time - graphData[0].time) / timeRange) * (width - 40);
        const y = height - 20 - (point.rate / maxRate) * (height - 40);
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
    
    // Draw data points
    ctx.fillStyle = '#4caf50';
    graphData.forEach((point, index) => {
        const x = 30 + ((point.time - graphData[0].time) / timeRange) * (width - 40);
        const y = height - 20 - (point.rate / maxRate) * (height - 40);
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Log data point
function logDataPoint() {
    const logEntries = document.getElementById('logEntries');
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.innerHTML = `
        <strong>${new Date().toLocaleTimeString()}</strong><br>
        Light: ${experimentState.lightIntensity}% | 
        CO₂: ${experimentState.co2Concentration} ppm | 
        Temp: ${experimentState.temperature}°C | 
        Water: ${experimentState.waterAvailability}%<br>
        Rate: ${experimentState.photosynthesisRate} molecules/min
    `;
    logEntries.appendChild(entry);
    logEntries.scrollTop = logEntries.scrollHeight;
}

// Start simulation loop
function startSimulation() {
    setInterval(() => {
        updateDisplay();
    }, 500);
}
