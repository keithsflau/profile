export interface SimulationState {
  lightIntensity: number; // 0-100
  photosynthesisRate: number; // 0-100 (relative units)
  respirationRate: number; // constant (~20 relative units)
  netExchange: number; // photo - resp
  indicatorColor: string; // Hex code
  statusMessage: string;
}
