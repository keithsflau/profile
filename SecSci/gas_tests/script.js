// Gas Tests Experiment - Interactive Simulation

// Experiment state
let experimentState = {
    currentGas: 'oxygen',
    currentTest: null,
    testPerformed: false,
    observationCount: 0
};

// Test results for different gas-test combinations
const testResults = {
    oxygen: {
        glowingSplint: {
            result: 'positive',
            observation: 'Glowing splint relights with a bright flame',
            explanation: 'Oxygen supports combustion, causing the glowing splint to relight.'
        },
        burningSplint: {
            result: 'positive',
            observation: 'Burning splint burns much more brightly and rapidly',
            explanation: 'High oxygen concentration accelerates combustion.'
        }
    },
    carbondioxide: {
        limeWater: {
            result: 'positive',
            observation: 'Clear lime water turns milky white',
            explanation: 'CO₂ reacts with calcium hydroxide to form insoluble calcium carbonate.'
        },
        hydrogencarbonate: {
            result: 'positive',
            observation: 'Indicator changes from red to yellow',
            explanation: 'CO₂ dissolves to form carbonic acid, lowering the pH.'
        }
    },
    watervapour: {
        cobaltChloride: {
            result: 'positive',
            observation: 'Dry blue cobalt chloride paper turns pink',
            explanation: 'Cobalt chloride is hydrated by water vapour, changing color.'
        }
    },
    air: {
        glowingSplint: {
            result: 'partial',
            observation: 'Splint may glow slightly but does not fully relight',
            explanation: 'Air contains ~21% oxygen, not enough for complete relighting.'
        },
        burningSplint: {
            result: 'partial',
            observation: 'Splint continues burning at normal rate',
            explanation: 'Normal combustion in air with 21% oxygen.'
        },
        limeWater: {
            result: 'negative',
            observation: 'Lime water remains clear',
            explanation: 'Air contains only ~0.04% CO₂, insufficient to cause a visible reaction.'
        },
        hydrogencarbonate: {
            result: 'negative',
            observation: 'Indicator remains red',
            explanation: 'CO₂ concentration too low to affect pH significantly.'
        },
        cobaltChloride: {
            result: 'variable',
            observation: 'Paper may turn slightly pink if humidity is high',
            explanation: 'Depends on relative humidity of the air.'
        }
    },
    nitrogen: {
        glowingSplint: {
            result: 'negative',
            observation: 'Glowing splint extinguishes',
            explanation: 'Nitrogen does not support combustion.'
        },
        burningSplint: {
            result: 'negative',
            observation: 'Burning splint extinguishes',
            explanation: 'Nitrogen does not support combustion and may smother the flame.'
        },
        limeWater: {
            result: 'negative',
            observation: 'Lime water remains clear',
            explanation: 'Nitrogen does not react with lime water.'
        },
        hydrogencarbonate: {
            result: 'negative',
            observation: 'Indicator remains red',
            explanation: 'Nitrogen is inert and does not affect pH.'
        },
        cobaltChloride: {
            result: 'negative',
            observation: 'Paper remains blue',
            explanation: 'Nitrogen does not contain water vapour.'
        }
    }
};

// Initialize experiment
document.addEventListener('DOMContentLoaded', () => {
    initializeExperiment();
    setupControls();
});

// Initialize experiment
function initializeExperiment() {
    updateGasDisplay();
    updateTestButtons();
    setupObservationButton();
}

// Setup control handlers
function setupControls() {
    // Gas selection dropdown
    const gasSelect = document.getElementById('gasType');
    gasSelect.addEventListener('change', (e) => {
        experimentState.currentGas = e.target.value;
        experimentState.currentTest = null;
        experimentState.testPerformed = false;
        updateGasDisplay();
        updateTestButtons();
        resetTestSetup();
    });

    // Oxygen tests
    document.getElementById('glowingSplintBtn').addEventListener('click', () => {
        performTest('glowingSplint');
    });

    document.getElementById('burningSplintBtn').addEventListener('click', () => {
        performTest('burningSplint');
    });

    // Carbon dioxide tests
    document.getElementById('limeWaterBtn').addEventListener('click', () => {
        performTest('limeWater');
    });

    document.getElementById('hydrogencarbonateBtn').addEventListener('click', () => {
        performTest('hydrogencarbonate');
    });

    // Water vapour test
    document.getElementById('cobaltChlorideBtn').addEventListener('click', () => {
        performTest('cobaltChloride');
    });

    // Reset button
    document.getElementById('resetBtn').addEventListener('click', () => {
        resetExperiment();
    });
}

// Update gas display
function updateGasDisplay() {
    const gasLabel = document.getElementById('gasLabel');
    const gasMolecules = document.getElementById('gasMolecules');
    
    const gasNames = {
        oxygen: 'Oxygen (O₂)',
        carbondioxide: 'Carbon Dioxide (CO₂)',
        watervapour: 'Water Vapour (H₂O)',
        air: 'Air',
        nitrogen: 'Nitrogen (N₂)'
    };

    const gasColors = {
        oxygen: '#2196F3',
        carbondioxide: '#757575',
        watervapour: '#03A9F4',
        air: '#9E9E9E',
        nitrogen: '#FF9800'
    };

    gasLabel.textContent = gasNames[experimentState.currentGas] || 'Unknown Gas';
    gasMolecules.innerHTML = '';
    
    // Create animated molecules
    const moleculeCount = experimentState.currentGas === 'air' ? 5 : 8;
    for (let i = 0; i < moleculeCount; i++) {
        const molecule = document.createElement('div');
        molecule.className = 'molecule';
        molecule.style.backgroundColor = gasColors[experimentState.currentGas] || '#666';
        molecule.style.left = `${Math.random() * 80 + 10}%`;
        molecule.style.top = `${Math.random() * 70 + 15}%`;
        molecule.style.animationDelay = `${Math.random() * 2}s`;
        gasMolecules.appendChild(molecule);
    }

    // Update jar background color hint
    const gasJar = document.getElementById('gasJar');
    const color = gasColors[experimentState.currentGas] || '#E0E0E0';
    gasJar.style.borderColor = color;
}

// Update test buttons based on selected gas
function updateTestButtons() {
    const oxygenTests = document.getElementById('oxygenTests');
    const co2Tests = document.getElementById('co2Tests');
    const waterVapourTests = document.getElementById('waterVapourTests');

    // Hide all first
    oxygenTests.style.display = 'none';
    co2Tests.style.display = 'none';
    waterVapourTests.style.display = 'none';

    // Show relevant tests
    if (experimentState.currentGas === 'oxygen' || experimentState.currentGas === 'air' || experimentState.currentGas === 'nitrogen') {
        oxygenTests.style.display = 'block';
    }
    if (experimentState.currentGas === 'carbondioxide' || experimentState.currentGas === 'air' || experimentState.currentGas === 'nitrogen') {
        co2Tests.style.display = 'block';
    }
    if (experimentState.currentGas === 'watervapour' || experimentState.currentGas === 'air' || experimentState.currentGas === 'nitrogen') {
        waterVapourTests.style.display = 'block';
    }

    updateExpectedResults();
}

// Update expected results panel
function updateExpectedResults() {
    const expectedResults = document.getElementById('expectedResults');
    const gas = experimentState.currentGas;
    
    if (!gas || !testResults[gas]) {
        expectedResults.innerHTML = '<p>Select a gas to see expected results.</p>';
        return;
    }

    let html = '<div class="expected-list">';
    const gasTests = testResults[gas];
    
    Object.keys(gasTests).forEach(test => {
        const result = gasTests[test];
        const testName = getTestDisplayName(test);
        const resultClass = result.result === 'positive' ? 'positive' : 
                          result.result === 'negative' ? 'negative' : 'partial';
        html += `
            <div class="expected-item ${resultClass}">
                <strong>${testName}:</strong> ${result.observation}
            </div>
        `;
    });
    
    html += '</div>';
    expectedResults.innerHTML = html;
}

// Get display name for test
function getTestDisplayName(test) {
    const names = {
        glowingSplint: 'Glowing Splint Test',
        burningSplint: 'Burning Splint Test',
        limeWater: 'Lime Water Test',
        hydrogencarbonate: 'Hydrogencarbonate Indicator Test',
        cobaltChloride: 'Cobalt Chloride Paper Test'
    };
    return names[test] || test;
}

// Perform test
function performTest(testType) {
    experimentState.currentTest = testType;
    experimentState.testPerformed = true;
    
    const gas = experimentState.currentGas;
    const result = testResults[gas] && testResults[gas][testType];
    
    if (!result) {
        showResult('error', 'This test is not applicable for the selected gas.');
        return;
    }

    // Show apparatus
    showApparatus(testType);
    
    // Animate test
    setTimeout(() => {
        showResult(result.result, result.observation, result.explanation);
        updateExpectedResults();
    }, 1500);
}

// Show test apparatus
function showApparatus(testType) {
    const container = document.getElementById('apparatusContainer');
    container.innerHTML = '';
    
    let apparatusHTML = '';
    
    switch(testType) {
        case 'glowingSplint':
            apparatusHTML = `
                <div class="apparatus splint-apparatus">
                    <div class="splint glowing-splint" id="splint">
                        <div class="splint-wood"></div>
                        <div class="splint-tip glowing" id="splintTip"></div>
                    </div>
                    <div class="test-label">Glowing Splint Test</div>
                </div>
            `;
            break;
        case 'burningSplint':
            apparatusHTML = `
                <div class="apparatus splint-apparatus">
                    <div class="splint burning-splint" id="splint">
                        <div class="splint-wood"></div>
                        <div class="splint-tip burning" id="splintTip"></div>
                    </div>
                    <div class="test-label">Burning Splint Test</div>
                </div>
            `;
            break;
        case 'limeWater':
            apparatusHTML = `
                <div class="apparatus lime-water-apparatus">
                    <div class="test-tube" id="testTube">
                        <div class="lime-water clear" id="limeWater"></div>
                        <div class="test-label">Lime Water Test</div>
                    </div>
                </div>
            `;
            break;
        case 'hydrogencarbonate':
            apparatusHTML = `
                <div class="apparatus indicator-apparatus">
                    <div class="indicator-container" id="indicatorContainer">
                        <div class="indicator red" id="indicator">
                            <div class="indicator-label">Hydrogencarbonate Indicator</div>
                        </div>
                    </div>
                </div>
            `;
            break;
        case 'cobaltChloride':
            apparatusHTML = `
                <div class="apparatus paper-apparatus">
                    <div class="cobalt-paper blue" id="cobaltPaper">
                        <div class="paper-label">Cobalt Chloride Paper</div>
                    </div>
                </div>
            `;
            break;
    }
    
    container.innerHTML = apparatusHTML;
    
    // Animate insertion into gas
    setTimeout(() => {
        const apparatus = container.querySelector('.apparatus');
        if (apparatus) {
            apparatus.classList.add('inserted');
        }
    }, 500);
}

// Show test result
function showResult(resultType, observation, explanation) {
    const resultDisplay = document.getElementById('resultDisplay');
    const resultContent = document.getElementById('resultContent');
    
    const resultLabels = {
        positive: '✅ Positive Result',
        negative: '❌ Negative Result',
        partial: '⚠️ Partial Result',
        variable: '⚡ Variable Result',
        error: '❌ Error'
    };

    resultContent.innerHTML = `
        <div class="result-type ${resultType}">
            <h4>${resultLabels[resultType] || 'Result'}</h4>
            <p class="observation"><strong>Observation:</strong> ${observation}</p>
            ${explanation ? `<p class="explanation"><strong>Explanation:</strong> ${explanation}</p>` : ''}
        </div>
    `;
    
    resultDisplay.style.display = 'block';
    
    // Update apparatus based on result
    updateApparatusForResult(resultType);
}

// Update apparatus visualization based on result
function updateApparatusForResult(resultType) {
    const gas = experimentState.currentGas;
    const test = experimentState.currentTest;
    
    // Glowing splint - relight animation
    if (test === 'glowingSplint' && (resultType === 'positive' || resultType === 'partial')) {
        const splintTip = document.getElementById('splintTip');
        if (splintTip) {
            splintTip.classList.remove('glowing');
            splintTip.classList.add('relit');
        }
    }
    
    // Burning splint - brighter flame
    if (test === 'burningSplint' && (resultType === 'positive' || resultType === 'partial')) {
        const splintTip = document.getElementById('splintTip');
        if (splintTip) {
            splintTip.classList.add('brighter');
        }
    }
    
    // Lime water - turn milky
    if (test === 'limeWater' && resultType === 'positive') {
        const limeWater = document.getElementById('limeWater');
        if (limeWater) {
            limeWater.classList.remove('clear');
            limeWater.classList.add('milky');
        }
    }
    
    // Hydrogencarbonate indicator - change color
    if (test === 'hydrogencarbonate' && resultType === 'positive') {
        const indicator = document.getElementById('indicator');
        if (indicator) {
            indicator.classList.remove('red');
            indicator.classList.add('yellow');
        }
    }
    
    // Cobalt chloride paper - turn pink
    if (test === 'cobaltChloride' && resultType === 'positive') {
        const cobaltPaper = document.getElementById('cobaltPaper');
        if (cobaltPaper) {
            cobaltPaper.classList.remove('blue');
            cobaltPaper.classList.add('pink');
        }
    }
    
    // Negative results - extinguishing animations
    if (resultType === 'negative') {
        if (test === 'glowingSplint' || test === 'burningSplint') {
            const splintTip = document.getElementById('splintTip');
            if (splintTip) {
                splintTip.classList.add('extinguished');
            }
        }
    }
}

// Reset test setup
function resetTestSetup() {
    const apparatusContainer = document.getElementById('apparatusContainer');
    const resultDisplay = document.getElementById('resultDisplay');
    
    apparatusContainer.innerHTML = `
        <div class="apparatus-placeholder">
            <p>Select a test method to begin</p>
        </div>
    `;
    
    resultDisplay.style.display = 'none';
}

// Reset entire experiment
function resetExperiment() {
    experimentState.currentGas = 'oxygen';
    experimentState.currentTest = null;
    experimentState.testPerformed = false;
    
    document.getElementById('gasType').value = 'oxygen';
    resetTestSetup();
    updateGasDisplay();
    updateTestButtons();
    clearObservations();
}

// Setup observation button
function setupObservationButton() {
    document.getElementById('addObservationBtn').addEventListener('click', () => {
        if (!experimentState.testPerformed) {
            alert('Please perform a test first before adding an observation.');
            return;
        }
        
        const gas = experimentState.currentGas;
        const test = experimentState.currentTest;
        const result = testResults[gas] && testResults[gas][test];
        
        if (result) {
            addObservation(result.observation, result.explanation);
        } else {
            addObservation('Test performed but no result recorded.', '');
        }
    });
}

// Add observation to log
function addObservation(observation, explanation) {
    const log = document.getElementById('observationsLog');
    const emptyLog = log.querySelector('.empty-log');
    
    if (emptyLog) {
        emptyLog.remove();
    }
    
    experimentState.observationCount++;
    const entry = document.createElement('div');
    entry.className = 'observation-entry';
    entry.innerHTML = `
        <div class="observation-header">
            <strong>Observation #${experimentState.observationCount}</strong>
            <span class="observation-time">${new Date().toLocaleTimeString()}</span>
        </div>
        <div class="observation-details">
            <p><strong>Gas:</strong> ${document.getElementById('gasLabel').textContent}</p>
            <p><strong>Test:</strong> ${getTestDisplayName(experimentState.currentTest)}</p>
            <p><strong>Observation:</strong> ${observation}</p>
            ${explanation ? `<p><strong>Explanation:</strong> ${explanation}</p>` : ''}
        </div>
    `;
    
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
}

// Clear observations
function clearObservations() {
    const log = document.getElementById('observationsLog');
    log.innerHTML = '<p class="empty-log">No observations yet. Perform a test to record observations.</p>';
    experimentState.observationCount = 0;
}

