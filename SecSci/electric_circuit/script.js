// Circuit state
let circuitState = {
    components: [],
    connections: [],
    voltage: 9,
    resistance: 100,
    current: 0,
    isClosed: false,
    switchClosed: true,
    animationId: null,
    geminiModel: null,
    apiKey: null
};

// Component positions and types
let draggedComponent = null;
let selectedComponent = null;
let componentCounter = 0;
let animationIntervals = [];

// Initialize the experiment
document.addEventListener('DOMContentLoaded', () => {
    initializeExperiment();
    setupEventListeners();
    setupPresetCircuits();
    loadApiKey();
});

function initializeExperiment() {
    updateMeasurements();
    updateCircuitStatus();
    checkApiKeyStatus();
}

function loadApiKey() {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
        circuitState.apiKey = savedKey;
        initializeGemini(savedKey);
        document.getElementById('apiKeyInput').value = '••••••••••••';
        document.getElementById('apiConfigPanel').style.display = 'none';
    }
}

function checkApiKeyStatus() {
    if (circuitState.apiKey && circuitState.geminiModel) {
        document.getElementById('analyzeCircuitBtn').disabled = false;
        document.getElementById('aiStatus').textContent = 'Ready';
        document.getElementById('aiStatus').style.color = '#00ff88';
    } else {
        document.getElementById('analyzeCircuitBtn').disabled = true;
        document.getElementById('aiStatus').textContent = 'API key required';
        document.getElementById('aiStatus').style.color = '#ff4444';
    }
}

function initializeGemini(apiKey) {
    try {
        if (typeof google !== 'undefined' && google.generativeai) {
            const genAI = new google.generativeai.GenerativeAI(apiKey);
            circuitState.geminiModel = genAI.getGenerativeModel({ model: 'gemini-pro' });
            circuitState.apiKey = apiKey;
            checkApiKeyStatus();
        }
    } catch (error) {
        console.error('Error initializing Gemini:', error);
        document.getElementById('aiStatus').textContent = 'API initialization failed';
        document.getElementById('aiStatus').style.color = '#ff4444';
    }
}

function setupEventListeners() {
    // API Key configuration
    document.getElementById('saveApiKeyBtn').addEventListener('click', saveApiKey);
    
    // Component palette drag
    const componentItems = document.querySelectorAll('.component-item');
    componentItems.forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
    });

    // Circuit canvas drop
    const circuitCanvas = document.getElementById('circuitCanvas');
    circuitCanvas.addEventListener('dragover', handleDragOver);
    circuitCanvas.addEventListener('drop', handleDrop);
    circuitCanvas.addEventListener('click', handleCanvasClick);

    // Voltage and resistance sliders
    const voltageSlider = document.getElementById('voltage');
    const resistanceSlider = document.getElementById('resistance');
    
    voltageSlider.addEventListener('input', (e) => {
        circuitState.voltage = parseFloat(e.target.value);
        document.getElementById('voltageValue').textContent = circuitState.voltage;
        analyzeCircuitWithGemini();
        updateMeasurements();
    });

    resistanceSlider.addEventListener('input', (e) => {
        circuitState.resistance = parseFloat(e.target.value);
        document.getElementById('resistanceValue').textContent = circuitState.resistance;
        analyzeCircuitWithGemini();
        updateMeasurements();
    });

    // Switch state toggle
    const switchToggle = document.getElementById('switchState');
    switchToggle.addEventListener('change', (e) => {
        circuitState.switchClosed = e.target.checked;
        document.getElementById('switchLabel').textContent = e.target.checked ? 'Closed' : 'Open';
        checkCircuitClosure();
        analyzeCircuitWithGemini();
        updateMeasurements();
    });

    // AI Analysis button
    document.getElementById('analyzeCircuitBtn').addEventListener('click', analyzeCircuitWithGemini);

    // Data logging
    document.getElementById('logDataBtn').addEventListener('click', logDataPoint);
    document.getElementById('clearLogBtn').addEventListener('click', clearLog);
}

function saveApiKey() {
    const apiKey = document.getElementById('apiKeyInput').value.trim();
    if (apiKey && apiKey.length > 0) {
        localStorage.setItem('gemini_api_key', apiKey);
        initializeGemini(apiKey);
        document.getElementById('apiConfigPanel').style.display = 'none';
    } else {
        alert('Please enter a valid API key');
    }
}

function handleDragStart(e) {
    draggedComponent = e.target.closest('.component-item').dataset.component;
    e.dataTransfer.effectAllowed = 'copy';
}

function handleDragEnd(e) {
    draggedComponent = null;
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
}

function handleDrop(e) {
    e.preventDefault();
    if (!draggedComponent) return;

    const canvas = document.getElementById('circuitCanvas');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    addComponent(draggedComponent, x, y);
    checkCircuitClosure();
    analyzeCircuitWithGemini();
    updateMeasurements();
}

function handleCanvasClick(e) {
    if (e.target.closest('.circuit-component')) {
        const component = e.target.closest('.circuit-component');
        selectComponent(component);
    } else {
        deselectComponent();
    }
}

function addComponent(type, x, y) {
    const component = {
        id: componentCounter++,
        type: type,
        x: x,
        y: y,
        connected: false
    };

    circuitState.components.push(component);
    renderComponent(component);
    updateConnections();
}

function renderComponent(component) {
    const container = document.getElementById('circuitComponents');
    const componentDiv = document.createElement('div');
    componentDiv.className = 'circuit-component';
    componentDiv.dataset.id = component.id;
    componentDiv.style.left = (component.x - 40) + 'px';
    componentDiv.style.top = (component.y - 40) + 'px';

    const symbol = document.createElement('div');
    symbol.className = `component-symbol ${component.type}`;
    
    // Set symbol content based on type
    switch(component.type) {
        case 'battery':
            symbol.innerHTML = '🔋';
            break;
        case 'resistor':
            symbol.innerHTML = '⬛';
            break;
        case 'led':
            symbol.innerHTML = '💡';
            break;
        case 'switch':
            symbol.innerHTML = circuitState.switchClosed ? '🔘' : '⚪';
            break;
        case 'ammeter':
            symbol.innerHTML = 'A';
            break;
        case 'voltmeter':
            symbol.innerHTML = 'V';
            break;
    }

    componentDiv.appendChild(symbol);
    container.appendChild(componentDiv);

    // Make component draggable
    makeDraggable(componentDiv, component);
}

function makeDraggable(element, component) {
    let isDragging = false;
    let startX, startY, initialX, initialY;

    element.addEventListener('mousedown', (e) => {
        if (e.target === element || e.target.closest('.component-symbol')) {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            const rect = element.getBoundingClientRect();
            initialX = component.x;
            initialY = component.y;
            element.style.cursor = 'grabbing';
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            component.x = initialX + dx;
            component.y = initialY + dy;
            element.style.left = (component.x - 40) + 'px';
            element.style.top = (component.y - 40) + 'px';
            updateConnections();
            checkCircuitClosure();
            analyzeCircuitWithGemini();
            calculateCircuit();
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            element.style.cursor = 'move';
        }
    });
}

function updateConnections() {
    const svg = document.getElementById('circuitSvg');
    svg.innerHTML = '<defs><marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><polygon points="0 0, 10 3, 0 6" fill="#ff4444" /></marker><marker id="electron" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><circle cx="4" cy="4" r="3" fill="#00aaff" /></marker></defs>';

    if (circuitState.components.length < 2) return;

    // Draw connections between nearby components
    for (let i = 0; i < circuitState.components.length; i++) {
        for (let j = i + 1; j < circuitState.components.length; j++) {
            const comp1 = circuitState.components[i];
            const comp2 = circuitState.components[j];
            const distance = Math.sqrt(
                Math.pow(comp2.x - comp1.x, 2) + Math.pow(comp2.y - comp1.y, 2)
            );

            if (distance < 150) {
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', comp1.x);
                line.setAttribute('y1', comp1.y);
                line.setAttribute('x2', comp2.x);
                line.setAttribute('y2', comp2.y);
                line.setAttribute('stroke', circuitState.isClosed ? '#00ff88' : '#666');
                line.setAttribute('stroke-width', '3');
                line.setAttribute('stroke-dasharray', circuitState.isClosed ? '0' : '5,5');
                svg.appendChild(line);
            }
        }
    }
}

function checkCircuitClosure() {
    const hasBattery = circuitState.components.some(c => c.type === 'battery');
    const hasResistor = circuitState.components.some(c => c.type === 'resistor' || c.type === 'led');
    const hasSwitch = circuitState.components.some(c => c.type === 'switch');
    
    // Circuit is closed only if:
    // 1. Has a battery (power source)
    // 2. Has a load (resistor or LED)
    // 3. Switch is closed (if switch exists)
    // 4. Components are connected (close enough)
    const componentsConnected = areComponentsConnected();
    
    circuitState.isClosed = hasBattery && 
                            hasResistor && 
                            (!hasSwitch || circuitState.switchClosed) && 
                            componentsConnected;

    // Show/hide warning
    const warning = document.getElementById('circuitWarning');
    if (!circuitState.isClosed && circuitState.components.length > 0) {
        warning.style.display = 'block';
    } else {
        warning.style.display = 'none';
    }

    updateConnections();
    updateCircuitStatus();
}

function areComponentsConnected() {
    if (circuitState.components.length < 2) return false;
    
    const battery = circuitState.components.find(c => c.type === 'battery');
    const load = circuitState.components.find(c => c.type === 'resistor' || c.type === 'led');
    
    if (!battery || !load) return false;
    
    // Check if battery and load are close enough (connected)
    const distance = Math.sqrt(
        Math.pow(load.x - battery.x, 2) + Math.pow(load.y - battery.y, 2)
    );
    
    return distance < 300; // Components within 300px are considered connected
}

async function analyzeCircuitWithGemini() {
    if (!circuitState.geminiModel || !circuitState.isClosed) {
        document.getElementById('aiAnalysisResult').style.display = 'none';
        return;
    }

    const analyzeBtn = document.getElementById('analyzeCircuitBtn');
    const aiStatus = document.getElementById('aiStatus');
    const resultDiv = document.getElementById('aiAnalysisResult');
    const resultContent = document.getElementById('aiResultContent');

    analyzeBtn.disabled = true;
    aiStatus.textContent = 'Analyzing...';
    aiStatus.style.color = '#ffaa00';

    try {
        // Build circuit description for Gemini
        const circuitDescription = buildCircuitDescription();
        
        const prompt = `You are an expert electrical engineer. Analyze this electric circuit and provide calculations using Ohm's Law.

Circuit Configuration:
${circuitDescription}

Voltage (V): ${circuitState.voltage}V
Resistance (R): ${circuitState.resistance}Ω

Please calculate and explain:
1. Current (I) using Ohm's Law: I = V / R
2. Power (P) using: P = V × I
3. Whether this is a valid closed circuit
4. Any safety considerations or recommendations

Format your response in clear, educational language suitable for students learning about circuits.`;

        const result = await circuitState.geminiModel.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        resultContent.innerHTML = `<div class="ai-response">${formatGeminiResponse(text)}</div>`;
        resultDiv.style.display = 'block';
        aiStatus.textContent = 'Analysis complete';
        aiStatus.style.color = '#00ff88';

    } catch (error) {
        console.error('Gemini API error:', error);
        aiStatus.textContent = 'Analysis failed';
        aiStatus.style.color = '#ff4444';
        resultContent.innerHTML = `<div class="ai-error">Error: ${error.message}</div>`;
        resultDiv.style.display = 'block';
    } finally {
        analyzeBtn.disabled = false;
    }
}

function buildCircuitDescription() {
    const components = circuitState.components.map(c => {
        return `- ${c.type} at position (${Math.round(c.x)}, ${Math.round(c.y)})`;
    }).join('\n');

    return `Components:
${components}

Switch State: ${circuitState.switchClosed ? 'Closed' : 'Open'}
Circuit Status: ${circuitState.isClosed ? 'Closed Circuit' : 'Open Circuit'}`;
}

function formatGeminiResponse(text) {
    // Format the response with proper line breaks and styling
    return text
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
}

function calculateCircuit() {
    if (!circuitState.isClosed) {
        circuitState.current = 0;
        stopAnimations();
        return;
    }

    // Calculate current using Ohm's Law: I = V / R
    circuitState.current = circuitState.voltage / circuitState.resistance;
    
    // Start animations if circuit is closed
    startAnimations();
}

function startAnimations() {
    stopAnimations();
    
    const currentFlow = document.getElementById('currentFlow');
    const electronFlow = document.getElementById('electronFlow');
    
    // Clear previous animations
    currentFlow.innerHTML = '';
    electronFlow.innerHTML = '';

    if (!circuitState.isClosed || circuitState.components.length < 2) return;

    // Find battery and resistor for flow path
    const battery = circuitState.components.find(c => c.type === 'battery');
    const load = circuitState.components.find(c => c.type === 'resistor' || c.type === 'led');

    if (!battery || !load) return;

    // Create current flow animation (conventional current: + to -)
    const currentSpeed = Math.max(200, 1500 - (circuitState.current * 30));
    
    const currentInterval = setInterval(() => {
        if (!circuitState.isClosed) {
            clearInterval(currentInterval);
            return;
        }
        animateCurrent(battery, load);
    }, currentSpeed);
    animationIntervals.push(currentInterval);

    // Create electron flow animation (electrons: - to +)
    const electronInterval = setInterval(() => {
        if (!circuitState.isClosed) {
            clearInterval(electronInterval);
            return;
        }
        animateElectrons(battery, load);
    }, currentSpeed * 1.2);
    animationIntervals.push(electronInterval);
}

function animateCurrent(battery, load) {
    const currentFlow = document.getElementById('currentFlow');
    const arrow = document.createElement('div');
    arrow.className = 'current-arrow';
    arrow.style.position = 'absolute';
    arrow.style.left = battery.x + 'px';
    arrow.style.top = battery.y + 'px';
    arrow.style.width = '20px';
    arrow.style.height = '20px';
    arrow.style.background = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 20 20\'%3E%3Cpolygon points=\'0,0 20,10 0,20\' fill=\'%23ff4444\'/%3E%3C/svg%3E")';
    arrow.style.backgroundSize = 'contain';
    arrow.style.backgroundRepeat = 'no-repeat';
    arrow.style.pointerEvents = 'none';
    arrow.style.zIndex = '5';
    
    currentFlow.appendChild(arrow);

    const startX = battery.x;
    const startY = battery.y;
    const endX = load.x;
    const endY = load.y;
    const distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
    const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;

    arrow.style.transform = `rotate(${angle}deg)`;
    
    let progress = 0;
    const animate = () => {
        if (!circuitState.isClosed || progress > distance) {
            arrow.remove();
            return;
        }
        
        progress += 3;
        const currentX = startX + (endX - startX) * (progress / distance);
        const currentY = startY + (endY - startY) * (progress / distance);
        arrow.style.left = (currentX - 10) + 'px';
        arrow.style.top = (currentY - 10) + 'px';
        
        requestAnimationFrame(animate);
    };
    animate();
}

function animateElectrons(battery, load) {
    const electronFlow = document.getElementById('electronFlow');
    const electron = document.createElement('div');
    electron.className = 'electron-dot';
    electron.style.position = 'absolute';
    electron.style.left = load.x + 'px';
    electron.style.top = load.y + 'px';
    electron.style.width = '8px';
    electron.style.height = '8px';
    electron.style.borderRadius = '50%';
    electron.style.background = '#00aaff';
    electron.style.boxShadow = '0 0 8px #00aaff';
    electron.style.pointerEvents = 'none';
    electron.style.zIndex = '5';
    
    electronFlow.appendChild(electron);

    const startX = load.x;
    const startY = load.y;
    const endX = battery.x;
    const endY = battery.y;
    const distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
    const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;

    electron.style.transform = `rotate(${angle}deg)`;
    
    let progress = 0;
    const animate = () => {
        if (!circuitState.isClosed || progress > distance) {
            electron.remove();
            return;
        }
        
        progress += 3;
        const currentX = startX + (endX - startX) * (progress / distance);
        const currentY = startY + (endY - startY) * (progress / distance);
        electron.style.left = (currentX - 4) + 'px';
        electron.style.top = (currentY - 4) + 'px';
        
        requestAnimationFrame(animate);
    };
    animate();
}

function stopAnimations() {
    animationIntervals.forEach(interval => clearInterval(interval));
    animationIntervals = [];
    document.getElementById('currentFlow').innerHTML = '';
    document.getElementById('electronFlow').innerHTML = '';
}

function updateMeasurements() {
    // Update current display - only show if circuit is closed
    const currentDisplay = document.getElementById('currentValue');
    currentDisplay.textContent = circuitState.isClosed ? circuitState.current.toFixed(2) : '0.00';

    // Update voltage display
    const voltageDisplay = document.getElementById('voltageDisplay');
    voltageDisplay.textContent = circuitState.isClosed ? circuitState.voltage.toFixed(2) : '0.00';

    // Update resistance display
    const resistanceDisplay = document.getElementById('resistanceDisplay');
    resistanceDisplay.textContent = circuitState.isClosed ? circuitState.resistance : '0';

    // Calculate and update power: P = V × I
    const power = circuitState.isClosed ? circuitState.voltage * circuitState.current : 0;
    const powerDisplay = document.getElementById('powerValue');
    powerDisplay.textContent = power.toFixed(2);

    // Update ammeter and voltmeter readings if they exist
    updateMeterReadings();

    // Enable/disable log button based on circuit state
    document.getElementById('logDataBtn').disabled = !circuitState.isClosed;
}

function updateMeterReadings() {
    // Ammeter shows current
    const ammeters = circuitState.components.filter(c => c.type === 'ammeter');
    ammeters.forEach(ammeter => {
        const element = document.querySelector(`[data-id="${ammeter.id}"] .component-symbol`);
        if (element && circuitState.isClosed) {
            element.textContent = `A: ${circuitState.current.toFixed(2)}A`;
        } else if (element) {
            element.textContent = 'A';
        }
    });

    // Voltmeter shows voltage
    const voltmeters = circuitState.components.filter(c => c.type === 'voltmeter');
    voltmeters.forEach(voltmeter => {
        const element = document.querySelector(`[data-id="${voltmeter.id}"] .component-symbol`);
        if (element && circuitState.isClosed) {
            element.textContent = `V: ${circuitState.voltage.toFixed(2)}V`;
        } else if (element) {
            element.textContent = 'V';
        }
    });
}

function updateCircuitStatus() {
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.getElementById('statusText');
    const pathInfo = document.getElementById('circuitPathInfo');
    
    if (circuitState.isClosed) {
        statusDot.classList.add('active');
        statusText.textContent = 'Circuit Closed ✓';
        pathInfo.innerHTML = '<p style="color: #00ff88; margin-top: 10px;">Complete circuit path detected. Current can flow.</p>';
    } else {
        statusDot.classList.remove('active');
        statusText.textContent = 'Circuit Open ✗';
        const reasons = [];
        if (!circuitState.components.some(c => c.type === 'battery')) reasons.push('Missing battery');
        if (!circuitState.components.some(c => c.type === 'resistor' || c.type === 'led')) reasons.push('Missing load');
        const switchComp = circuitState.components.find(c => c.type === 'switch');
        if (switchComp && !circuitState.switchClosed) reasons.push('Switch is open');
        if (circuitState.components.length >= 2 && !areComponentsConnected()) reasons.push('Components not connected');
        
        pathInfo.innerHTML = reasons.length > 0 
            ? `<p style="color: #ff4444; margin-top: 10px;">Issues: ${reasons.join(', ')}</p>`
            : '<p style="color: #ffaa00; margin-top: 10px;">Build a complete circuit to enable current flow.</p>';
    }
}

function selectComponent(element) {
    deselectComponent();
    selectedComponent = element;
    element.style.outline = '3px solid #667eea';
}

function deselectComponent() {
    if (selectedComponent) {
        selectedComponent.style.outline = 'none';
    }
    selectedComponent = null;
}

function setupPresetCircuits() {
    const presetButtons = document.querySelectorAll('.preset-btn');
    presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const preset = btn.dataset.preset;
            applyPreset(preset);
        });
    });
}

function applyPreset(preset) {
    // Clear existing components
    circuitState.components = [];
    document.getElementById('circuitComponents').innerHTML = '';
    document.getElementById('circuitSvg').innerHTML = '<defs><marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><polygon points="0 0, 10 3, 0 6" fill="#ff4444" /></marker><marker id="electron" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><circle cx="4" cy="4" r="3" fill="#00aaff" /></marker></defs>';
    stopAnimations();
    circuitState.switchClosed = true;
    document.getElementById('switchState').checked = true;
    document.getElementById('switchLabel').textContent = 'Closed';

    const canvas = document.getElementById('circuitCanvas');
    const centerX = canvas.offsetWidth / 2;
    const centerY = canvas.offsetHeight / 2;

    switch(preset) {
        case 'simple':
            addComponent('battery', centerX - 120, centerY);
            addComponent('resistor', centerX + 120, centerY);
            addComponent('switch', centerX, centerY - 60);
            break;
        case 'series':
            addComponent('battery', centerX - 180, centerY);
            addComponent('resistor', centerX, centerY);
            addComponent('led', centerX + 180, centerY);
            addComponent('ammeter', centerX - 90, centerY - 60);
            break;
        case 'parallel':
            addComponent('battery', centerX - 180, centerY);
            addComponent('resistor', centerX, centerY - 100);
            addComponent('led', centerX, centerY + 100);
            addComponent('voltmeter', centerX + 180, centerY);
            break;
        case 'clear':
            // Already cleared above
            break;
    }

    checkCircuitClosure();
    analyzeCircuitWithGemini();
    calculateCircuit();
    updateMeasurements();
}

function logDataPoint() {
    if (!circuitState.isClosed) {
        alert('Circuit must be closed to record measurements!');
        return;
    }

    const logEntries = document.getElementById('logEntries');
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    
    const timestamp = new Date().toLocaleTimeString();
    entry.textContent = `${timestamp} - V: ${circuitState.voltage.toFixed(2)}V, I: ${circuitState.current.toFixed(2)}A, R: ${circuitState.resistance}Ω, P: ${(circuitState.voltage * circuitState.current).toFixed(2)}W`;
    
    logEntries.appendChild(entry);
    logEntries.scrollTop = logEntries.scrollHeight;
}

function clearLog() {
    document.getElementById('logEntries').innerHTML = '';
}

// Recalculate circuit when components are moved
setInterval(() => {
    if (circuitState.components.length > 0) {
        checkCircuitClosure();
        calculateCircuit();
        updateMeasurements();
    }
}, 500);
