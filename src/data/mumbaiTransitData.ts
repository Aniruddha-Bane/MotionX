import { TransitRoute, Recommendation, ModelMetrics, BottleneckAlert, DemandLevel } from '../types';

export function calculateDemandLevel(occupancy: number): DemandLevel {
  if (occupancy > 100) return 'CRITICAL';
  if (occupancy >= 80) return 'HIGH';
  if (occupancy >= 60) return 'MODERATE';
  return 'LOW';
}

export const MUMBAI_COORDINATES = {
  center: [19.0760, 72.8777] as [number, number],
  bounds: [
    [18.90, 72.75],
    [19.28, 73.05],
  ],
};

export const INITIAL_ROUTES: TransitRoute[] = [
  {
    id: '302',
    name: '302 — Dadar → Mulund',
    origin: 'Dadar',
    destination: 'Mulund',
    mode: 'TRAIN',
    capacity: 1000,
    currentDemand: 960,
    predictedDemand: 1420,
    occupancyPercentage: 142.0,
    status: 'CRITICAL',
    averageOccupancy: 86.4,
    peakOccupancy: 142.0,
    peakTime: '08:30 AM',
    weeklyGrowth: 12.4,
    distanceKm: 21.5,
    color: '#ef4444', // Red / Critical
    stops: [
      { id: 'dadar', name: 'Dadar Central Terminus', lat: 19.0178, lng: 72.8478, sequence: 1, currentDemand: 960, capacity: 1000, predictedDemand: 1420, occupancyPercentage: 142.0, status: 'CRITICAL' },
      { id: 'matunga', name: 'Matunga Station', lat: 19.0270, lng: 72.8550, sequence: 2, currentDemand: 820, capacity: 1000, predictedDemand: 1180, occupancyPercentage: 118.0, status: 'CRITICAL' },
      { id: 'sion', name: 'Sion Junction', lat: 19.0400, lng: 72.8620, sequence: 3, currentDemand: 790, capacity: 1000, predictedDemand: 1050, occupancyPercentage: 105.0, status: 'CRITICAL' },
      { id: 'kurla', name: 'Kurla Interchange', lat: 19.0660, lng: 72.8800, sequence: 4, currentDemand: 880, capacity: 1000, predictedDemand: 1290, occupancyPercentage: 129.0, status: 'CRITICAL' },
      { id: 'ghatkopar', name: 'Ghatkopar Metro Connect', lat: 19.0860, lng: 72.9080, sequence: 5, currentDemand: 740, capacity: 1000, predictedDemand: 950, occupancyPercentage: 95.0, status: 'HIGH' },
      { id: 'vikhroli', name: 'Vikhroli Tech Park', lat: 19.1110, lng: 72.9280, sequence: 6, currentDemand: 630, capacity: 1000, predictedDemand: 810, occupancyPercentage: 81.0, status: 'HIGH' },
      { id: 'bhandup', name: 'Bhandup Industrial Area', lat: 19.1430, lng: 72.9370, sequence: 7, currentDemand: 520, capacity: 1000, predictedDemand: 690, occupancyPercentage: 69.0, status: 'MODERATE' },
      { id: 'mulund', name: 'Mulund Check Naka', lat: 19.1726, lng: 72.9565, sequence: 8, currentDemand: 450, capacity: 1000, predictedDemand: 580, occupancyPercentage: 58.0, status: 'LOW' }
    ]
  },
  {
    id: '421',
    name: '421 — Thane → Ghatkopar',
    origin: 'Thane',
    destination: 'Ghatkopar',
    mode: 'TRAIN',
    capacity: 1100,
    currentDemand: 920,
    predictedDemand: 1210,
    occupancyPercentage: 110.0,
    status: 'CRITICAL',
    averageOccupancy: 81.5,
    peakOccupancy: 110.0,
    peakTime: '08:45 AM',
    weeklyGrowth: 9.8,
    distanceKm: 18.2,
    color: '#f97316',
    stops: [
      { id: 'thane', name: 'Thane Junction', lat: 19.1860, lng: 72.9759, sequence: 1, currentDemand: 920, capacity: 1100, predictedDemand: 1210, occupancyPercentage: 110.0, status: 'CRITICAL' },
      { id: 'mulund_e', name: 'Mulund East', lat: 19.1680, lng: 72.9520, sequence: 2, currentDemand: 850, capacity: 1100, predictedDemand: 1040, occupancyPercentage: 94.5, status: 'HIGH' },
      { id: 'kanjurmarg', name: 'Kanjurmarg Commercial Hub', lat: 19.1290, lng: 72.9300, sequence: 3, currentDemand: 790, capacity: 1100, predictedDemand: 980, occupancyPercentage: 89.1, status: 'HIGH' },
      { id: 'ghatkopar_t', name: 'Ghatkopar Station', lat: 19.0860, lng: 72.9080, sequence: 4, currentDemand: 680, capacity: 1100, predictedDemand: 870, occupancyPercentage: 79.1, status: 'MODERATE' }
    ]
  },
  {
    id: '101',
    name: '101 — Borivali → Andheri',
    origin: 'Borivali',
    destination: 'Andheri',
    mode: 'BUS',
    capacity: 700,
    currentDemand: 610,
    predictedDemand: 695,
    occupancyPercentage: 99.3,
    status: 'HIGH',
    averageOccupancy: 76.2,
    peakOccupancy: 99.3,
    peakTime: '09:00 AM',
    weeklyGrowth: 6.5,
    distanceKm: 14.8,
    color: '#eab308',
    stops: [
      { id: 'borivali_w', name: 'Borivali West Depot', lat: 19.2307, lng: 72.8567, sequence: 1, currentDemand: 610, capacity: 700, predictedDemand: 695, occupancyPercentage: 99.3, status: 'HIGH' },
      { id: 'kandivali', name: 'Kandivali Link Road', lat: 19.2045, lng: 72.8420, sequence: 2, currentDemand: 580, capacity: 700, predictedDemand: 640, occupancyPercentage: 91.4, status: 'HIGH' },
      { id: 'malad', name: 'Malad Inorbit', lat: 19.1820, lng: 72.8360, sequence: 3, currentDemand: 540, capacity: 700, predictedDemand: 610, occupancyPercentage: 87.1, status: 'HIGH' },
      { id: 'goregaon', name: 'Goregaon Hub', lat: 19.1550, lng: 72.8490, sequence: 4, currentDemand: 490, capacity: 700, predictedDemand: 550, occupancyPercentage: 78.6, status: 'MODERATE' },
      { id: 'andheri_w', name: 'Andheri West Terminal', lat: 19.1197, lng: 72.8464, sequence: 5, currentDemand: 410, capacity: 700, predictedDemand: 480, occupancyPercentage: 68.6, status: 'MODERATE' }
    ]
  },
  {
    id: '202',
    name: '202 — Bandra → Kurla (BKC Express)',
    origin: 'Bandra',
    destination: 'Kurla',
    mode: 'BUS',
    capacity: 650,
    currentDemand: 590,
    predictedDemand: 630,
    occupancyPercentage: 96.9,
    status: 'HIGH',
    averageOccupancy: 79.1,
    peakOccupancy: 96.9,
    peakTime: '09:15 AM',
    weeklyGrowth: 14.2,
    distanceKm: 8.5,
    color: '#eab308',
    stops: [
      { id: 'bandra_stn', name: 'Bandra Station West', lat: 19.0544, lng: 72.8402, sequence: 1, currentDemand: 590, capacity: 650, predictedDemand: 630, occupancyPercentage: 96.9, status: 'HIGH' },
      { id: 'bkc_financial', name: 'BKC Financial District', lat: 19.0657, lng: 72.8643, sequence: 2, currentDemand: 560, capacity: 650, predictedDemand: 610, occupancyPercentage: 93.8, status: 'HIGH' },
      { id: 'kurla_bkc', name: 'Kurla Station South', lat: 19.0660, lng: 72.8800, sequence: 3, currentDemand: 440, capacity: 650, predictedDemand: 490, occupancyPercentage: 75.4, status: 'MODERATE' }
    ]
  },
  {
    id: '610',
    name: '610 — Andheri → Dadar',
    origin: 'Andheri',
    destination: 'Dadar',
    mode: 'TRAIN',
    capacity: 1200,
    currentDemand: 980,
    predictedDemand: 1090,
    occupancyPercentage: 90.8,
    status: 'HIGH',
    averageOccupancy: 82.0,
    peakOccupancy: 90.8,
    peakTime: '08:15 AM',
    weeklyGrowth: 5.1,
    distanceKm: 12.3,
    color: '#eab308',
    stops: [
      { id: 'andheri_c', name: 'Andheri Station Hub', lat: 19.1197, lng: 72.8464, sequence: 1, currentDemand: 980, capacity: 1200, predictedDemand: 1090, occupancyPercentage: 90.8, status: 'HIGH' },
      { id: 'vile_parle', name: 'Vile Parle East', lat: 19.0990, lng: 72.8430, sequence: 2, currentDemand: 890, capacity: 1200, predictedDemand: 980, occupancyPercentage: 81.7, status: 'HIGH' },
      { id: 'santacruz', name: 'Santacruz Highway', lat: 19.0810, lng: 72.8410, sequence: 3, currentDemand: 820, capacity: 1200, predictedDemand: 910, occupancyPercentage: 75.8, status: 'MODERATE' },
      { id: 'bandra_e', name: 'Bandra East Junction', lat: 19.0590, lng: 72.8440, sequence: 4, currentDemand: 760, capacity: 1200, predictedDemand: 850, occupancyPercentage: 70.8, status: 'MODERATE' },
      { id: 'dadar_w', name: 'Dadar Western Line', lat: 19.0178, lng: 72.8478, sequence: 5, currentDemand: 690, capacity: 1200, predictedDemand: 780, occupancyPercentage: 65.0, status: 'MODERATE' }
    ]
  },
  {
    id: '715',
    name: '715 — Borivali → Bandra',
    origin: 'Borivali',
    destination: 'Bandra',
    mode: 'TRAIN',
    capacity: 1150,
    currentDemand: 830,
    predictedDemand: 920,
    occupancyPercentage: 80.0,
    status: 'HIGH',
    averageOccupancy: 73.5,
    peakOccupancy: 80.0,
    peakTime: '08:50 AM',
    weeklyGrowth: 7.3,
    distanceKm: 22.0,
    color: '#eab308',
    stops: [
      { id: 'borivali_s', name: 'Borivali Fast Platform', lat: 19.2307, lng: 72.8567, sequence: 1, currentDemand: 830, capacity: 1150, predictedDemand: 920, occupancyPercentage: 80.0, status: 'HIGH' },
      { id: 'malad_s', name: 'Malad Station', lat: 19.1860, lng: 72.8480, sequence: 2, currentDemand: 770, capacity: 1150, predictedDemand: 860, occupancyPercentage: 74.8, status: 'MODERATE' },
      { id: 'andheri_f', name: 'Andheri Fast Link', lat: 19.1197, lng: 72.8464, sequence: 3, currentDemand: 710, capacity: 1150, predictedDemand: 800, occupancyPercentage: 69.6, status: 'MODERATE' },
      { id: 'bandra_term', name: 'Bandra Terminus', lat: 19.0544, lng: 72.8402, sequence: 4, currentDemand: 620, capacity: 1150, predictedDemand: 710, occupancyPercentage: 61.7, status: 'MODERATE' }
    ]
  },
  {
    id: '820',
    name: '820 — Ghatkopar → Thane',
    origin: 'Ghatkopar',
    destination: 'Thane',
    mode: 'BUS',
    capacity: 550,
    currentDemand: 390,
    predictedDemand: 410,
    occupancyPercentage: 74.5,
    status: 'MODERATE',
    averageOccupancy: 67.2,
    peakOccupancy: 74.5,
    peakTime: '18:15 PM',
    weeklyGrowth: 4.0,
    distanceKm: 16.4,
    color: '#3b82f6',
    stops: [
      { id: 'ghatkopar_dep', name: 'Ghatkopar Bus Depot', lat: 19.0860, lng: 72.9080, sequence: 1, currentDemand: 390, capacity: 550, predictedDemand: 410, occupancyPercentage: 74.5, status: 'MODERATE' },
      { id: 'vikhroli_eeh', name: 'Eastern Express Vikhroli', lat: 19.1110, lng: 72.9280, sequence: 2, currentDemand: 360, capacity: 550, predictedDemand: 380, occupancyPercentage: 69.1, status: 'MODERATE' },
      { id: 'bhandup_w', name: 'Bhandup Highway Gate', lat: 19.1430, lng: 72.9370, sequence: 3, currentDemand: 310, capacity: 550, predictedDemand: 340, occupancyPercentage: 61.8, status: 'MODERATE' },
      { id: 'thane_teen', name: 'Thane Teen Hath Naka', lat: 19.1860, lng: 72.9759, sequence: 4, currentDemand: 260, capacity: 550, predictedDemand: 290, occupancyPercentage: 52.7, status: 'LOW' }
    ]
  },
  {
    id: '505',
    name: '505 — Navi Mumbai → Kurla',
    origin: 'Navi Mumbai',
    destination: 'Kurla',
    mode: 'BUS',
    capacity: 600,
    currentDemand: 280,
    predictedDemand: 290,
    occupancyPercentage: 48.3,
    status: 'LOW',
    averageOccupancy: 52.1,
    peakOccupancy: 68.0,
    peakTime: '18:45 PM',
    weeklyGrowth: -1.8,
    distanceKm: 24.5,
    color: '#10b981',
    stops: [
      { id: 'vashi_depot', name: 'Vashi Sector 17', lat: 19.0770, lng: 72.9980, sequence: 1, currentDemand: 280, capacity: 600, predictedDemand: 290, occupancyPercentage: 48.3, status: 'LOW' },
      { id: 'mankhurd', name: 'Mankhurd Link Bridge', lat: 19.0490, lng: 72.9320, sequence: 2, currentDemand: 240, capacity: 600, predictedDemand: 260, occupancyPercentage: 43.3, status: 'LOW' },
      { id: 'chembur', name: 'Chembur Naka', lat: 19.0580, lng: 72.9020, sequence: 3, currentDemand: 210, capacity: 600, predictedDemand: 230, occupancyPercentage: 38.3, status: 'LOW' },
      { id: 'kurla_term', name: 'Kurla East Terminal', lat: 19.0660, lng: 72.8800, sequence: 4, currentDemand: 170, capacity: 600, predictedDemand: 190, occupancyPercentage: 31.7, status: 'LOW' }
    ]
  }
];

export const INITIAL_BOTTLENECK: BottleneckAlert = {
  routeId: '302',
  routeName: '302 — Dadar → Mulund',
  predictedPeak: 1420,
  capacity: 1000,
  occupancy: 142,
  suggestedAction: '+2 Extra Trains / Feeder Buses',
  timeWindow: '08:00 – 09:30 AM',
  urgency: 'CRITICAL'
};

export const INITIAL_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'rec-302-morning',
    routeId: '302',
    routeName: 'Route 302 — Dadar → Mulund',
    mode: 'TRAIN',
    timeWindow: '08:00 – 09:30 AM',
    currentDemand: 960,
    capacity: 1000,
    predictedDemand: 1420,
    occupancy: 142,
    priority: 'CRITICAL',
    problem: 'Extreme morning peak demand will exceed safe physical train throughput by 42% between Dadar and Kurla junctions.',
    recommendedAction: 'Deploy 2 additional fast suburban trains or feeder express buses between 08:00 and 09:30 AM.',
    additionalVehicles: 2,
    expectedImpact: 'Reduce predicted overcrowding by approximately 29.5%, bringing peak occupancy down to 100.2%.',
    impactPercentage: 29.5,
    reasoning: [
      'Demand is predicted to increase by +47.9% over current morning baseline.',
      'Current pre-peak occupancy is already running at 96% of rated coach capacity.',
      'Peak surge is concentrated between 08:00–09:30 AM due to central office commutes.',
      'Available platform headway on Central Line allows inserting 2 short-loop trains between Dadar and Mulund.'
    ]
  },
  {
    id: 'rec-421-morning',
    routeId: '421',
    routeName: 'Route 421 — Thane → Ghatkopar',
    mode: 'TRAIN',
    timeWindow: '08:30 – 10:00 AM',
    currentDemand: 920,
    capacity: 1100,
    predictedDemand: 1210,
    occupancy: 110,
    priority: 'CRITICAL',
    problem: 'Sustained influx of suburban commuters at Thane Junction will push rolling stock 10% past design limits.',
    recommendedAction: 'Increase peak frequency from 8-minute headway to 5-minute headway and dispatch 1 standby rake.',
    additionalVehicles: 1,
    expectedImpact: 'Disperse platform accumulation and reduce coach occupancy from 110% to 92.4%.',
    impactPercentage: 16.0,
    reasoning: [
      'Predicted demand of 1,210 riders against 1,100 rated capacity creates station choke-points.',
      'Ghatkopar metro interchange creates simultaneous outflow bottlenecks.',
      'Rerouting 1 standby rake from Kurla depot provides immediate relief within 15 minutes.'
    ]
  },
  {
    id: 'rec-101-morning',
    routeId: '101',
    routeName: 'Route 101 — Borivali → Andheri',
    mode: 'BUS',
    timeWindow: '08:45 – 10:15 AM',
    currentDemand: 610,
    capacity: 700,
    predictedDemand: 695,
    occupancy: 99.3,
    priority: 'HIGH',
    problem: 'Western highway congestion is slowing turnaround times, driving bus occupancy to 99.3%.',
    recommendedAction: 'Deploy 2 supplemental electric feeder buses on the Kandivali-Malad corridor.',
    additionalVehicles: 2,
    expectedImpact: 'Drop peak bus occupancy from 99.3% to 81.7%, eliminating passenger pass-bys at midway stops.',
    impactPercentage: 17.6,
    reasoning: [
      'Stops at Inorbit Malad and Goregaon Hub report passengers unable to board due to full vehicles.',
      'Predicted surge reaches 695 passengers on 700 fleet capacity.',
      'Short-turn trips originating at Kandivali avoid northern depot travel delays.'
    ]
  },
  {
    id: 'rec-202-bkc',
    routeId: '202',
    routeName: 'Route 202 — Bandra → Kurla (BKC Express)',
    mode: 'BUS',
    timeWindow: '09:00 – 10:30 AM',
    currentDemand: 590,
    capacity: 650,
    predictedDemand: 630,
    occupancy: 96.9,
    priority: 'HIGH',
    problem: 'High concentration of BKC corporate workers will saturate 96.9% of bus line capacity.',
    recommendedAction: 'Synchronize 2 dedicated double-decker electric buses during the 09:00 AM corporate shift.',
    additionalVehicles: 2,
    expectedImpact: 'Expand route capacity by 180 seats and maintain comfortable 76% occupancy.',
    impactPercentage: 21.5,
    reasoning: [
      'High business density in BKC causes rapid surges within tight 30-minute arrival windows.',
      'Turnaround loop time between Bandra Station and BKC is short (22 minutes), maximizing vehicle reuse.',
      'Double-decker buses utilize existing stop infrastructure without adding roadway vehicle footprint.'
    ]
  },
  {
    id: 'rec-505-night',
    routeId: '505',
    routeName: 'Route 505 — Navi Mumbai → Kurla',
    mode: 'BUS',
    timeWindow: '22:00 – 00:30 AM',
    currentDemand: 160,
    capacity: 600,
    predictedDemand: 140,
    occupancy: 23.3,
    priority: 'LOW',
    problem: 'Nighttime passenger demand drops under 25% capacity, causing fuel and driver hours inefficiency.',
    recommendedAction: 'Reduce service frequency from 15 minutes to 30 minutes after 22:00, reallocating 2 drivers to morning shifts.',
    additionalVehicles: 0,
    expectedImpact: 'Saves 240 km of empty running per night while maintaining guaranteed 30-minute night transit.',
    impactPercentage: 0,
    reasoning: [
      'Demand drops to 140 riders across the entire 4-hour night window.',
      'Capacity of 600 seats results in wasteful 23.3% utilization.',
      'Driver reallocation bolsters morning rush-hour staffing without overtime budget.'
    ]
  }
];

export const MODEL_METRICS_DATA: ModelMetrics = {
  r2Score: 0.914,
  mae: 46.8,
  rmse: 64.2,
  trainingSamples: 20160,
  testSamples: 5040,
  modelType: 'RandomForestRegressor (n_estimators=100, max_depth=16)',
  featuresUsed: [
    'route_id',
    'mode',
    'hour',
    'day_of_week',
    'is_weekend',
    'is_holiday',
    'weather_condition',
    'temperature',
    'historical_ridership',
    'previous_hour_ridership',
    'route_capacity',
    'special_event',
    'distance_km'
  ],
  lastTrained: '2026-10-04 23:45:10 IST',
  datasetSize: '25,200 Observations (6-month synthetic Mumbai transit log)'
};

export const SEVEN_DAY_TREND = [
  { date: 'Sep 28', dayName: 'Mon', ridership: 1210000, capacity: 1550000, occupancy: 78.1, isWeekend: false },
  { date: 'Sep 29', dayName: 'Tue', ridership: 1245000, capacity: 1550000, occupancy: 80.3, isWeekend: false },
  { date: 'Sep 30', dayName: 'Wed', ridership: 1260000, capacity: 1550000, occupancy: 81.3, isWeekend: false },
  { date: 'Oct 01', dayName: 'Thu', ridership: 1238000, capacity: 1550000, occupancy: 79.9, isWeekend: false },
  { date: 'Oct 02', dayName: 'Fri (Gandhi Jayanti)', ridership: 980000, capacity: 1450000, occupancy: 67.6, isWeekend: false },
  { date: 'Oct 03', dayName: 'Sat', ridership: 1040000, capacity: 1450000, occupancy: 71.7, isWeekend: true },
  { date: 'Oct 04', dayName: 'Sun', ridership: 890000, capacity: 1400000, occupancy: 63.6, isWeekend: true },
];

export function generate24HourProfile(routeId: string, weather: string = 'clear', hasEvent: boolean = false) {
  const route = INITIAL_ROUTES.find(r => r.id === routeId) || INITIAL_ROUTES[0];
  const cap = route.capacity;
  
  // Baseline curves for 24 hours
  // Peaks at 8-9am and 18-20pm
  const hourFactors = [
    0.08, 0.05, 0.03, 0.04, 0.12, 0.35, 0.65, 0.95, // 0-7
    1.42, 1.25, 0.88, 0.76, 0.72, 0.75, 0.78, 0.84, // 8-15
    1.05, 1.32, 1.38, 1.15, 0.82, 0.58, 0.32, 0.16  // 16-23
  ];

  let weatherMult = 1.0;
  if (weather === 'rain') weatherMult = 1.08;
  if (weather === 'heavy_rain') weatherMult = 1.18;

  const eventMult = hasEvent ? 1.22 : 1.0;

  return hourFactors.map((factor, hour) => {
    const isPeak = (hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 20);
    const baseDemand = Math.round(cap * factor);
    const noise = Math.sin(hour * 1.5) * 20;
    const actualDemand = Math.max(20, Math.round((baseDemand + noise) * weatherMult * (isPeak ? eventMult : 1.0)));
    
    // Predicted demand closely tracks actual with ML variance
    const mlDrift = Math.cos(hour * 1.1) * 15;
    const predictedDemand = Math.max(25, Math.round(actualDemand * 0.98 + mlDrift + (isPeak ? 25 : 0)));
    const occupancyPercentage = Number(((predictedDemand / cap) * 100).toFixed(1));

    const label = `${hour.toString().padStart(2, '0')}:00`;
    return {
      hour,
      label,
      actualDemand,
      predictedDemand,
      capacity: cap,
      occupancyPercentage,
      isPeak
    };
  });
}
