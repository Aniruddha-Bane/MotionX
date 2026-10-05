export type TransportMode = 'BUS' | 'TRAIN';

export type DemandLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type WeatherCondition = 'clear' | 'cloudy' | 'rain' | 'heavy_rain';

export interface RouteStop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  sequence: number;
  currentDemand: number;
  capacity: number;
  predictedDemand: number;
  occupancyPercentage: number;
  status: DemandLevel;
}

export interface TransitRoute {
  id: string;
  name: string;
  origin: string;
  destination: string;
  mode: TransportMode;
  capacity: number;
  currentDemand: number;
  predictedDemand: number;
  occupancyPercentage: number;
  status: DemandLevel;
  averageOccupancy: number;
  peakOccupancy: number;
  peakTime: string;
  weeklyGrowth: number;
  distanceKm: number;
  color: string;
  stops: RouteStop[];
}

export interface HourlyDemandPoint {
  hour: number;
  label: string;
  actualDemand: number;
  predictedDemand: number;
  capacity: number;
  occupancyPercentage: number;
  isPeak: boolean;
}

export interface DailyTrendPoint {
  date: string;
  dayName: string;
  ridership: number;
  capacity: number;
  occupancy: number;
  isWeekend: boolean;
}

export interface Recommendation {
  id: string;
  routeId: string;
  routeName: string;
  mode: TransportMode;
  timeWindow: string;
  currentDemand: number;
  capacity: number;
  predictedDemand: number;
  occupancy: number;
  priority: DemandLevel;
  problem: string;
  recommendedAction: string;
  additionalVehicles: number;
  expectedImpact: string;
  impactPercentage: number;
  reasoning: string[];
  applied?: boolean;
}

export interface BottleneckAlert {
  routeId: string;
  routeName: string;
  predictedPeak: number;
  capacity: number;
  occupancy: number;
  suggestedAction: string;
  timeWindow: string;
  urgency: 'CRITICAL' | 'HIGH';
}

export interface ModelMetrics {
  r2Score: number;
  mae: number;
  rmse: number;
  trainingSamples: number;
  testSamples: number;
  modelType: string;
  featuresUsed: string[];
  lastTrained: string;
  datasetSize: string;
}

export interface SimulationState {
  currentHour: number;
  isWeekend: boolean;
  weather: WeatherCondition;
  hasSpecialEvent: boolean;
  eventDescription: string;
  dispatchedExtras: Record<string, number>; // routeId -> extra vehicles added
}
