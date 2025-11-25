import { SimulationState } from '../types';

export const calculateRates = (time: number): SimulationState => {
  // Day is roughly 06:00 to 18:00
  // Peak at 12:00
  
  // Create a bell curve for light intensity
  // Sin wave shifted so positive part is between 6 and 18
  let lightIntensity = 0;
  
  if (time > 5 && time < 19) {
    // Normalize time to 0-PI for the daylight hours
    const x = (time - 5) / 14 * Math.PI; // 14 hours of 'light' for smoother transition
    lightIntensity = Math.sin(x) * 100;
  }
  
  // Clamp negative values to 0 (Night)
  lightIntensity = Math.max(0, lightIntensity);

  // Photosynthesis is proportional to light intensity (limiting factor here)
  const photosynthesisRate = lightIntensity; 
  
  // Respiration is relatively constant in this model
  const respirationRate = 25; 

  const netExchange = photosynthesisRate - respirationRate;

  // Determine Indicator Color
  // High CO2 (Net Respiration) -> Yellow (#FACC15)
  // Equilibrium (Compensation Point) -> Red (#EF4444)
  // Low CO2 (Net Photosynthesis) -> Purple (#A855F7)
  
  let indicatorColor = '#EF4444'; // Default Red
  let statusMessage = "Compensation Point";

  if (netExchange < -5) {
    // Respiration Dominant (CO2 Accumulates)
    indicatorColor = '#FACC15'; // Yellow
    statusMessage = "Respiration Dominant (Net CO2 Output)";
  } else if (netExchange > 5) {
    // Photosynthesis Dominant (CO2 Depleted)
    indicatorColor = '#A855F7'; // Purple
    statusMessage = "Photosynthesis Dominant (Net CO2 Uptake)";
  } else {
    // Roughly Equal
    indicatorColor = '#EF4444'; // Red
    statusMessage = "Equilibrium (No Net Exchange)";
  }

  // Smooth interpolation for color could be added, but discrete states are often clearer for teaching this specific concept (Yellow/Red/Purple phases).
  // However, let's return the discrete target color for the CSS transition to handle.

  return {
    lightIntensity,
    photosynthesisRate,
    respirationRate,
    netExchange,
    indicatorColor,
    statusMessage
  };
};
