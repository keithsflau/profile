// Circuit state
let circuitState = {
    components: [],
    connections: [],
    voltage: 9,
    resistance: 100,
    current: 0,
    isClosed: false,
    animationId: null
};

// Component positions and types
let draggedComponent = null;
let selectedComponent = null;
let componentCounter = 0;

// Initialize the experiment
document.addEventListener('DOMContentLoaded', () => {
    initializeExperiment();
    setupEventListeners();
    setupPresetCircuits();
});

function initializeExperiment() {
    updateMeasurements();
    updateCircuitStatus();
}

function setupEventListeners() {
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
        calculateCircuit();
        updateMeasurements();
    });

    resistanceSlider.addEventListener('input', (e) => {
        circuitState.resistance = parseFloat(e.target.value);
        document.getElementById('resistanceValue').textContent = circuitState.resistance;
        calculateCircuit();
        updateMeasurements();
    });

    // Data logging
    document.getElementById('logDataBtn').addEventListener('click', logDataPoint);
    document.getElementById('clearLogBtn').addEventListener('click', clearLog);
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
    calculateCircuit();
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
            symbol.innerHTML = '🔘';
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
    // Simple connection logic: components are connected if they're close enough
    const svg = document.getElementById('circuitSvg');
    svg.innerHTML = '<defs><marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><polygon points="0 0, 10 3, 0 6" fill="#ff4444" /></marker><marker id="electron" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><circle cx="4" cy="4" r="3" fill="#00aaff" /></marker></defs>';

    const hasBattery = circuitState.components.some(c => c.type === 'battery');
    const hasResistor = circuitState.components.some(c => c.type === 'resistor');
    const hasSwitch = circuitState.components.some(c => c.type === 'switch');
    
    // Check if switch is closed (simplified: assume closed if switch exists)
    circuitState.isClosed = hasBattery && (hasResistor || hasSwitch);

    if (circuitState.isClosed && circuitState.components.length >= 2) {
        // Draw connections between components
        for (let i = 0; i < circuitState.components.length - 1; i++) {
            const comp1 = circuitState.components[i];
            const comp2 = circuitState.components[i + 1];
            const distance = Math.sqrt(
                Math.pow(comp2.x - comp1.x, 2) + Math.pow(comp2.y - comp1.y, 2)
            );

            if (distance < 200) {
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', comp1.x);
                line.setAttribute('y1', comp1.y);
                line.setAttribute('x2', comp2.x);
                line.setAttribute('y2', comp2.y);
                line.setAttribute('stroke', '#333');
                line.setAttribute('stroke-width', '3');
                svg.appendChild(line);
            }
        }

        // Draw complete circuit path
        if (hasBattery && hasResistor) {
            const battery = circuitState.components.find(c => c.type === 'battery');
            const resistor = circuitState.components.find(c => c.type === 'resistor');
            
            if (battery && resistor) {
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', battery.x);
                line.setAttribute('y1', battery.y);
                line.setAttribute('x2', resistor.x);
                line.setAttribute('y2', resistor.y);
                line.setAttribute('stroke', '#333');
                line.setAttribute('stroke-width', '3');
                svg.appendChild(line);
            }
        }
    }
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
    const resistor = circuitState.components.find(c => c.type === 'resistor');

    if (!battery || !resistor) return;

    // Create current flow animation (conventional current: + to -)
    const currentSpeed = Math.max(100, 1000 - (circuitState.current * 50));
    
    function animateCurrent() {
        const arrow = document.createElement('div');
        arrow.className = 'current-arrow';
        arrow.style.left = battery.x + 'px';
        arrow.style.top = battery.y + 'px';
        arrow.style.width = '20px';
        arrow.style.height = '20px';
        arrow.style.background = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 20 20\'%3E%3Cpolygon points=\'0,0 20,10 0,20\' fill=\'%23ff4444\'/%3E%3C/svg%3E")';
        arrow.style.backgroundSize = 'contain';
        arrow.style.backgroundRepeat = 'no-repeat';
        
        currentFlow.appendChild(arrow);

        const startX = battery.x;
        const startY = battery.y;
        const endX = resistor.x;
        const endY = resistor.y;
        const distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
        const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;

        arrow.style.transform = `rotate(${angle}deg)`;
        
        let progress = 0;
        const animate = () => {
            progress += 2;
            if (progress > distance) {
                arrow.remove();
                return;
            }
            
            const currentX = startX + (endX - startX) * (progress / distance);
            const currentY = startY + (endY - startY) * (progress / distance);
            arrow.style.left = (currentX - 10) + 'px';
            arrow.style.top = (currentY - 10) + 'px';
            
            requestAnimationFrame(animate);
        };
        animate();
    }

    // Create electron flow animation (electrons: - to +)
    function animateElectrons() {
        const electron = document.createElement('div');
        electron.className = 'electron-dot';
        electron.style.left = resistor.x + 'px';
        electron.style.top = resistor.y + 'px';
        electron.style.width = '8px';
        electron.style.height = '8px';
        electron.style.borderRadius = '50%';
        electron.style.background = '#00aaff';
        electron.style.boxShadow = '0 0 8px #00aaff';
        
        electronFlow.appendChild(electron);

        const startX = resistor.x;
        const startY = resistor.y;
        const endX = battery.x;
        const endY = battery.y;
        const distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
        const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;

        electron.style.transform = `rotate(${angle}deg)`;
        
        let progress = 0;
        const animate = () => {
            progress += 2;
            if (progress > distance) {
                electron.remove();
                return;
            }
            
            const currentX = startX + (endX - startX) * (progress / distance);
            const currentY = startY + (endY - startY) * (progress / distance);
            electron.style.left = (currentX - 4) + 'px';
            electron.style.top = (currentY - 4) + 'px';
            
            requestAnimationFrame(animate);
        };
        animate();
    }

    // Start animations
    setInterval(animateCurrent, currentSpeed);
    setInterval(animateElectrons, currentSpeed * 1.2);
}

function stopAnimations() {
    document.getElementById('currentFlow').innerHTML = '';
    document.getElementById('electronFlow').innerHTML = '';
}

function updateMeasurements() {
    // Update current display
    const currentDisplay = document.getElementById('currentValue');
    currentDisplay.textContent = circuitState.current.toFixed(2);

    // Update voltage display
    const voltageDisplay = document.getElementById('voltageDisplay');
    voltageDisplay.textContent = circuitState.isClosed ? circuitState.voltage.toFixed(2) : '0.00';

    // Update resistance display
    const resistanceDisplay = document.getElementById('resistanceDisplay');
    resistanceDisplay.textContent = circuitState.isClosed ? circuitState.resistance : '0';

    // Calculate and update power: P = V × I
    const power = circuitState.voltage * circuitState.current;
    const powerDisplay = document.getElementById('powerValue');
    powerDisplay.textContent = power.toFixed(2);

    // Update ammeter and voltmeter readings if they exist
    updateMeterReadings();
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
    
    if (circuitState.isClosed) {
        statusDot.classList.add('active');
        statusText.textContent = 'Circuit Closed';
    } else {
        statusDot.classList.remove('active');
        statusText.textContent = 'Circuit Open';
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

    const canvas = document.getElementById('circuitCanvas');
    const centerX = canvas.offsetWidth / 2;
    const centerY = canvas.offsetHeight / 2;

    switch(preset) {
        case 'simple':
            addComponent('battery', centerX - 100, centerY);
            addComponent('resistor', centerX + 100, centerY);
            addComponent('switch', centerX, centerY - 50);
            break;
        case 'series':
            addComponent('battery', centerX - 150, centerY);
            addComponent('resistor', centerX, centerY);
            addComponent('led', centerX + 150, centerY);
            addComponent('ammeter', centerX - 75, centerY - 50);
            break;
        case 'parallel':
            addComponent('battery', centerX - 150, centerY);
            addComponent('resistor', centerX, centerY - 80);
            addComponent('led', centerX, centerY + 80);
            addComponent('voltmeter', centerX + 150, centerY);
            break;
        case 'clear':
            // Already cleared above
            break;
    }

    calculateCircuit();
    updateMeasurements();
    updateCircuitStatus();
}

function logDataPoint() {
    if (!circuitState.isClosed) {
        alert('Please close the circuit first to take measurements.');
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
        updateConnections();
        calculateCircuit();
        updateMeasurements();
        updateCircuitStatus();
    }
}, 500);

