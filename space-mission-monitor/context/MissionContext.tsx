import React, { createContext, useContext, useEffect, useReducer, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Mission, MissionState, SensorData } from '../constants/types';

const STORAGE_KEY = '@space_mission_state';

// ─── Initial State ────────────────────────────────────────────────────────────
const initialSensors: SensorData = {
  energy: 87,
  communication: 94,
  orbital: 78,
  temperature: -54,
  radiation: 212,
  oxygen: 91,
};

const initialMissions: Mission[] = [
  {
    id: '1',
    name: 'ARTEMIS VII',
    destination: 'Lua - Polo Sul',
    launchDate: '2026-03-15',
    status: 'active',
    crew: 4,
    notes: 'Missão de exploração do polo sul lunar.',
  },
];

const initialState: MissionState = {
  missions: initialMissions,
  currentMissionId: '1',
  sensors: initialSensors,
  alerts: [],
  lastUpdated: Date.now(),
};

// ─── Actions ──────────────────────────────────────────────────────────────────
type Action =
  | { type: 'LOAD_STATE'; payload: MissionState }
  | { type: 'UPDATE_SENSORS'; payload: SensorData }
  | { type: 'ADD_ALERT'; payload: Alert }
  | { type: 'ACKNOWLEDGE_ALERT'; payload: string }
  | { type: 'CLEAR_ALERTS' }
  | { type: 'ADD_MISSION'; payload: Mission }
  | { type: 'UPDATE_MISSION'; payload: Mission }
  | { type: 'DELETE_MISSION'; payload: string }
  | { type: 'SET_CURRENT_MISSION'; payload: string };

function reducer(state: MissionState, action: Action): MissionState {
  switch (action.type) {
    case 'LOAD_STATE':
      return action.payload;
    case 'UPDATE_SENSORS':
      return { ...state, sensors: action.payload, lastUpdated: Date.now() };
    case 'ADD_ALERT':
      return { ...state, alerts: [action.payload, ...state.alerts].slice(0, 50) };
    case 'ACKNOWLEDGE_ALERT':
      return {
        ...state,
        alerts: state.alerts.map(a =>
          a.id === action.payload ? { ...a, acknowledged: true } : a,
        ),
      };
    case 'CLEAR_ALERTS':
      return { ...state, alerts: [] };
    case 'ADD_MISSION':
      return { ...state, missions: [...state.missions, action.payload] };
    case 'UPDATE_MISSION':
      return {
        ...state,
        missions: state.missions.map(m =>
          m.id === action.payload.id ? action.payload : m,
        ),
      };
    case 'DELETE_MISSION':
      return {
        ...state,
        missions: state.missions.filter(m => m.id !== action.payload),
        currentMissionId:
          state.currentMissionId === action.payload ? null : state.currentMissionId,
      };
    case 'SET_CURRENT_MISSION':
      return { ...state, currentMissionId: action.payload };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
interface MissionContextType {
  state: MissionState;
  currentMission: Mission | null;
  updateSensors: (sensors: SensorData) => void;
  addAlert: (type: Alert['type'], message: string) => void;
  acknowledgeAlert: (id: string) => void;
  clearAlerts: () => void;
  addMission: (mission: Omit<Mission, 'id'>) => void;
  updateMission: (mission: Mission) => void;
  deleteMission: (id: string) => void;
  setCurrentMission: (id: string) => void;
}

const MissionContext = createContext<MissionContextType | null>(null);

export function MissionProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          dispatch({ type: 'LOAD_STATE', payload: JSON.parse(saved) });
        }
      } catch (e) {
        console.warn('Failed to load state:', e);
      }
    })();
  }, []);

  // Persist to AsyncStorage whenever state changes
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(e =>
      console.warn('Failed to save state:', e),
    );
  }, [state]);

  // Auto-update sensors every 5 seconds (simulated telemetry)
  useEffect(() => {
    const interval = setInterval(() => {
      const fluctuate = (val: number, min: number, max: number, delta: number) => {
        const next = val + (Math.random() - 0.5) * delta;
        return Math.min(max, Math.max(min, parseFloat(next.toFixed(1))));
      };
      const s = state.sensors;
      const next: SensorData = {
        energy: fluctuate(s.energy, 0, 100, 3),
        communication: fluctuate(s.communication, 0, 100, 4),
        orbital: fluctuate(s.orbital, 50, 100, 2),
        temperature: fluctuate(s.temperature, -100, 100, 5),
        radiation: fluctuate(s.radiation, 0, 1000, 20),
        oxygen: fluctuate(s.oxygen, 0, 100, 1),
      };
      dispatch({ type: 'UPDATE_SENSORS', payload: next });
    }, 5000);
    return () => clearInterval(interval);
  }, [state.sensors]);

  // Auto-generate alerts based on sensor values
  useEffect(() => {
    const s = state.sensors;
    const check = (
      cond: boolean,
      type: Alert['type'],
      message: string,
    ) => {
      if (cond) {
        const recentSimilar = state.alerts.find(
          a => a.message === message && Date.now() - a.timestamp < 30000,
        );
        if (!recentSimilar) {
          dispatch({
            type: 'ADD_ALERT',
            payload: {
              id: `${Date.now()}-${Math.random()}`,
              type,
              message,
              timestamp: Date.now(),
              acknowledged: false,
            },
          });
        }
      }
    };

    check(s.energy < 20, 'critical', '⚡ ENERGIA CRÍTICA: Nível abaixo de 20%');
    check(s.energy < 40 && s.energy >= 20, 'warning', '⚡ Energia baixa: Abaixo de 40%');
    check(s.communication < 30, 'critical', '📡 COMUNICAÇÃO CRÍTICA: Sinal abaixo de 30%');
    check(s.orbital < 60, 'warning', '🛰️ Estabilidade orbital comprometida');
    check(s.oxygen < 25, 'critical', '💨 OXIGÊNIO CRÍTICO: Nível abaixo de 25%');
    check(s.radiation > 750, 'critical', '☢️ RADIAÇÃO CRÍTICA: Exposição perigosa detectada');
    check(s.radiation > 500 && s.radiation <= 750, 'warning', '☢️ Nível de radiação elevado');
    check(s.temperature > 80, 'warning', '🌡️ Temperatura elevada: Acima de 80°C');
    check(s.temperature < -80, 'warning', '🌡️ Temperatura muito baixa: Abaixo de -80°C');
  }, [state.sensors]);

  const currentMission =
    state.missions.find(m => m.id === state.currentMissionId) ?? null;

  const updateSensors = useCallback((sensors: SensorData) => {
    dispatch({ type: 'UPDATE_SENSORS', payload: sensors });
  }, []);

  const addAlert = useCallback((type: Alert['type'], message: string) => {
    dispatch({
      type: 'ADD_ALERT',
      payload: {
        id: `${Date.now()}-${Math.random()}`,
        type,
        message,
        timestamp: Date.now(),
        acknowledged: false,
      },
    });
  }, []);

  const acknowledgeAlert = useCallback((id: string) => {
    dispatch({ type: 'ACKNOWLEDGE_ALERT', payload: id });
  }, []);

  const clearAlerts = useCallback(() => {
    dispatch({ type: 'CLEAR_ALERTS' });
  }, []);

  const addMission = useCallback((mission: Omit<Mission, 'id'>) => {
    dispatch({
      type: 'ADD_MISSION',
      payload: { ...mission, id: `${Date.now()}` },
    });
  }, []);

  const updateMission = useCallback((mission: Mission) => {
    dispatch({ type: 'UPDATE_MISSION', payload: mission });
  }, []);

  const deleteMission = useCallback((id: string) => {
    dispatch({ type: 'DELETE_MISSION', payload: id });
  }, []);

  const setCurrentMission = useCallback((id: string) => {
    dispatch({ type: 'SET_CURRENT_MISSION', payload: id });
  }, []);

  return (
    <MissionContext.Provider
      value={{
        state,
        currentMission,
        updateSensors,
        addAlert,
        acknowledgeAlert,
        clearAlerts,
        addMission,
        updateMission,
        deleteMission,
        setCurrentMission,
      }}
    >
      {children}
    </MissionContext.Provider>
  );
}

export function useMission() {
  const ctx = useContext(MissionContext);
  if (!ctx) throw new Error('useMission must be used inside MissionProvider');
  return ctx;
}
