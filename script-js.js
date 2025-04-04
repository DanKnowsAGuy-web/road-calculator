// Constants and Data Tables
const soilTypeImpactFactors = {
    // Standard Soil Types
    'GW': 1.00, // Well-graded gravel
    'GM': 1.00, // Silty gravel
    'SW': 0.95, // Well-graded sand
    'SM': 0.95, // Silty sand
    
    // Moderately Challenging Soil Types
    'GP': 1.15, // Poorly-graded gravel
    'GC': 1.20, // Clayey gravel
    'SP': 1.15, // Poorly-graded sand
    'SC': 1.20, // Clayey sand
    
    // Highly Challenging Soil Types
    'ML': 1.30, // Low plasticity silt
    'CL': 1.35, // Low plasticity clay
    'OL': 1.40, // Low plasticity organic soil
    'MH': 1.45, // High plasticity silt
    'CH': 1.50, // High plasticity clay
    'OH': 1.60  // High plasticity organic soil
};

const projectTypeCostDistribution = {
    'Rural Road': {
        subgrade: 0.35, // 35% of total project cost
        subbase: 0.20,  // 20% of total project cost
        base: 0.175,    // 17.5% of total project cost
        surface: 0.275  // 27.5% of total project cost
    },
    'Local Road': {
        subgrade: 0.30, // 30% of total project cost
        subbase: 0.175, // 17.5% of total project cost
        base: 0.20,     // 20% of total project cost
        surface: 0.325  // 32.5% of total project cost
    },
    'Highway': {
        subgrade: 0.175, // 17.5% of total project cost
        subbase: 0.125,  // 12.5% of total project cost
        base: 0.225,     // 22.5% of total project cost
        surface: 0.475   // 47.5% of total project cost
    }
};

const traditionalMethodFactors = {
    subgrade: {
        costIncrease: 0.425 // Midpoint of 35-50%
    },
    subbase: {
        costIncrease: 0.40 // Cost increase due to issues
    },
    base: {
        costIncrease: 0.30 // Cost increase due to issues
    },
    surface: {
        costIncrease: 0.30 // Cost increase due to issues
    }
};

const ourSolutionSavings = {
    'Rural Road': {
        subgrade: 0.85,  // 85% excavation/replacement savings (midpoint of 80-90%)
        subbase: 0.50,   // 50% material cost reduction (midpoint of 40-60%)
        base: 0.60,      // 60% material cost reduction (midpoint of 50-70%)
        surface: 0.70    // 70% material cost reduction (midpoint of 60-80%)
    },
    'Local Road': {
        subgrade: 0.80,  // 80% excavation/replacement savings (midpoint of 75-85%)
        subbase: 0.45,   // 45% material cost reduction (midpoint of 35-55%)
        base: 0.55,      // 55% material cost reduction (midpoint of 45-65%)
        surface: 0.50    // 50% material cost reduction (midpoint of 40-60%)
    },
    'Highway': {
        subgrade: 0.75,  // 75% excavation/replacement savings (midpoint of 70-80%)
        subbase: 0.40,   // 40% material cost reduction (midpoint of 30-50%)
        base: 0.50,      // 50% material cost reduction (midpoint of 40-60%)
        surface: 0.25    // 25% material cost reduction (midpoint of 20-30%)
    }
};

const projectImpacts = {
    'Rural Road': {
        costReduction: 0.40,    // 40% overall cost reduction (midpoint of 35-45%)
        timeReduction: 0.65,    // 65% faster completion (midpoint of 60-70%)
        lifespanExtension: 0.45, // 45% longer life (midpoint of 40-50%)
        maintenanceReduction: 0.40 // 40% maintenance reduction
    },
    'Local Road': {
        costReduction: 0.35,    // 35% overall cost reduction (midpoint of 30-40%)
        timeReduction: 0.55,    // 55% faster completion (midpoint of 50-60%)
        lifespanExtension: 0.40, // 40% longer life (midpoint of 35-45%)
        maintenanceReduction: 0.35 // 35% maintenance reduction
    },
    'Highway': {
        costReduction: 0.30,    // 30% overall cost reduction (midpoint of 25-35%)
        timeReduction: 0.45,    // 45% faster completion (midpoint of 40-50%)
        lifespanExtension: 0.35, // 35% longer life (midpoint of 30-40%)
        maintenanceReduction: 0.30 // 30% maintenance reduction
    }
};

// DOM elements
const soilTypeSelect = document.getElementById('soil-type');
const projectTypeButtons = document.querySelectorAll('.project-type-btn');

// Summary elements
const costSavingsEl = document.getElementById('cost-savings');
const timeReductionEl = document.getElementById('time-reduction');
const lifespanExtensionEl = document.getElementById('lifespan-extension');
const maintenanceReductionEl = document.getElementById('maintenance-reduction');

// Environmental impact elements
const carbonReductionEl = document.getElementById('carbon-reduction');
const materialTransportEl = document.getElementById('material-transport');
const resourceConservationEl = document.getElementById('resource-conservation');

// Layer elements
const layers = ['subgrade', 'subbase', 'base', 'surface'];
const layerElements = {};

layers.forEach(layer => {
    layerElements[layer] = {
        costPercent: document.querySelector(`#${layer}-layer .layer-cost-percent`),
        dollarSavings: document.querySelector(`#${layer}-layer .layer-dollar-savings`),
        savingsPercent: document.querySelector(`#${layer}-layer .layer-savings-percent`)
    };
});

// Current state
let currentSoilType = 'GW'; // Default: Well-graded gravel
let currentProjectType = 'Highway'; // Default: Highway

// Function to calculate results
function calculateResults() {
    const soilFactor = soilTypeImpactFactors[currentSoilType];
    const costDistribution = projectTypeCostDistribution[currentProjectType];
    const solutionSavings = ourSolutionSavings[currentProjectType];
    
    // Calculate layer-by-layer savings
    const subgradeSavings = costDistribution.subgrade * traditionalMethodFactors.subgrade.costIncrease * solutionSavings.subgrade * soilFactor;
    const subbaseSavings = costDistribution.subbase * traditionalMethodFactors.subbase.costIncrease * solutionSavings.subbase * soilFactor;
    const baseSavings = costDistribution.base * traditionalMethodFactors.base.costIncrease * solutionSavings.base * soilFactor;
    const surfaceSavings = costDistribution.surface * traditionalMethodFactors.surface.costIncrease * solutionSavings.surface * soilFactor;
    
    // Calculate total savings percentage
    let totalSavings = subgradeSavings + subbaseSavings + baseSavings + surfaceSavings;
    
    // Apply realistic caps based on soil type
    let maxSavings = 0.45; // Base maximum
    if (soilFactor > 1.3) {
        // For highly challenging soils
        maxSavings = 0.60;
    } else if (soilFactor > 1.1) {
        // For moderately challenging soils
        maxSavings = 0.50;
    }
    
    if (totalSavings > maxSavings) {
        totalSavings = maxSavings;
    }
    
    // Calculate project impact metrics
    const baseTimeReduction = projectImpacts[currentProjectType].timeReduction * soilFactor;
    const timeReduction = Math.min(baseTimeReduction, 0.90); // Cap at 90%
    
    const lifespanExtension = projectImpacts[currentProjectType].lifespanExtension * soilFactor;
    const maintenanceReduction = projectImpacts[currentProjectType].maintenanceReduction * soilFactor;
    
    // Environmental impact metrics
    const carbonReduction = ((totalSavings + lifespanExtension) / 2 * 100).toFixed(1);
    const materialTransport = (totalSavings * 0.8 * 100).toFixed(1);
    const resourceConservation = (totalSavings * 0.9 * 100).toFixed(1);
    
    // Update summary values
    costSavingsEl.textContent = `~${(totalSavings * 100).toFixed(1)}%`;
    timeReductionEl.textContent = `~${(timeReduction * 100).toFixed(1)}%`;
    lifespanExtensionEl.textContent = `~${(lifespanExtension * 100).toFixed(1)}%`;
    maintenanceReductionEl.textContent = `~${(maintenanceReduction * 100).toFixed(1)}%`;
    
    // Update environmental impact values
    carbonReductionEl.textContent = `~${carbonReduction}%`;
    materialTransportEl.textContent = `~${materialTransport}%`;
    resourceConservationEl.textContent = `~${resourceConservation}%`;
    
    // Update layer-specific values
    layerElements.subgrade.costPercent.textContent = `~${(costDistribution.subgrade * 100).toFixed(1)}%`;
    layerElements.subgrade.dollarSavings.textContent = `~${(subgradeSavings * 100).toFixed(1)}%`;
    layerElements.subgrade.savingsPercent.textContent = `~${(solutionSavings.subgrade * 100).toFixed(1)}%`;
    
    layerElements.subbase.costPercent.textContent = `~${(costDistribution.subbase * 100).toFixed(1)}%`;
    layerElements.subbase.dollarSavings.textContent = `~${(subbaseSavings * 100).toFixed(1)}%`;
    layerElements.subbase.savingsPercent.textContent = `~${(solutionSavings.subbase * 100).toFixed(1)}%`;
    
    layerElements.base.costPercent.textContent = `~${(costDistribution.base * 100).toFixed(1)}%`;
    layerElements.base.dollarSavings.textContent = `~${(baseSavings * 100).toFixed(1)}%`;
    layerElements.base.savingsPercent.textContent = `~${(solutionSavings.base * 100).toFixed(1)}%`;
    
    layerElements.surface.costPercent.textContent = `~${(costDistribution.surface * 100).toFixed(1)}%`;
    layerElements.surface.dollarSavings.textContent = `~${(surfaceSavings * 100).toFixed(1)}%`;
    layerElements.surface.savingsPercent.textContent = `~${(solutionSavings.surface * 100).toFixed(1)}%`;
}

// Update surface layer advantages based on project type
function updateSurfaceAdvantages() {
    const ruralAdvantages = document.querySelector('.layer-advantages.rural-road');
    const localAdvantages = document.querySelector('.layer-advantages.local-road');
    const highwayAdvantages = document.querySelector('.layer-advantages.highway');
    
    // Hide all
    ruralAdvantages.style.display = 'none';
    localAdvantages.style.display = 'none';
    highwayAdvantages.style.display = 'none';
    
    // Show the selected one
    if (currentProjectType === 'Rural Road') {
        ruralAdvantages.style.display = 'block';
    } else if (currentProjectType === 'Local Road') {
        localAdvantages.style.display = 'block';
    } else {
        highwayAdvantages.style.display = 'block';
    }
}

// Event listeners
soilTypeSelect.addEventListener('change', function() {
    currentSoilType = this.value;
    calculateResults();
});

projectTypeButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Remove selected class from all buttons
        projectTypeButtons.forEach(btn => {
            btn.classList.remove('project-type-selected');
        });
        
        // Add selected class to clicked button
        this.classList.add('project-type-selected');
        
        // Update current project type
        currentProjectType = this.dataset.type;
        
        // Update surface advantages
        updateSurfaceAdvantages();
        
        // Recalculate results
        calculateResults();
    });
});

// Initial calculation
calculateResults();
