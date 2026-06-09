export interface SensorData {
  energy: number;       // 0-100%
  communication: number; // 0-100%
  orbital: number;      // 0-100%
  temperature: number;  // -200 to 200 Celsius
  radiation: number;    // 0-1000 mSv
  oxygen: number;       // 0-100%
}

export interface Alert {
  id: string;
  type: 'warning' | 'critical' | 'info';
  message: string;
  timestamp: number;
  acknowledged: boolean;
}

export interface Mission {
  id: string;
  name: string;
  destination: string;
  launchDate: string;
  status: 'active' | 'paused' | 'completed' | 'aborted';
  crew: number;
  notes: string;
}

export interface MissionState {
  missions: Mission[];
  currentMissionId: string | null;
  sensors: SensorData;
  alerts: Alert[];
  lastUpdated: number;
}
