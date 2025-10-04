'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

// Types for our dashboard state
interface DashboardMetrics {
  totalCameras: number;
  activeCameras: number;
  detectionsToday: number;
  systemUptime: number;
  activeUsers: number;
  alertsResolved: number;
}

interface Camera {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'maintenance';
  location: string;
  lastActivity: Date;
  detections: number;
}

interface Alert {
  id: string;
  type: 'motion' | 'intrusion' | 'technical';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  resolved: boolean;
  cameraId?: string;
}

interface DashboardState {
  metrics: DashboardMetrics;
  cameras: Camera[];
  alerts: Alert[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  userPreferences: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    autoRefresh: boolean;
    refreshInterval: number;
  };
}

// Action types
type DashboardAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_METRICS'; payload: Partial<DashboardMetrics> }
  | { type: 'UPDATE_CAMERAS'; payload: Camera[] }
  | { type: 'ADD_ALERT'; payload: Alert }
  | { type: 'RESOLVE_ALERT'; payload: string }
  | { type: 'UPDATE_USER_PREFERENCES'; payload: Partial<DashboardState['userPreferences']> }
  | { type: 'SET_LAST_UPDATED'; payload: Date }
  | { type: 'RESET_STATE' };

// Initial state
const initialState: DashboardState = {
  metrics: {
    totalCameras: 0,
    activeCameras: 0,
    detectionsToday: 0,
    systemUptime: 0,
    activeUsers: 0,
    alertsResolved: 0,
  },
  cameras: [],
  alerts: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
  userPreferences: {
    theme: 'dark',
    notifications: true,
    autoRefresh: true,
    refreshInterval: 30000,
  },
};

// Reducer function
function dashboardReducer(state: DashboardState, action: DashboardAction): DashboardState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };

    case 'UPDATE_METRICS':
      return {
        ...state,
        metrics: { ...state.metrics, ...action.payload },
        lastUpdated: new Date(),
      };

    case 'UPDATE_CAMERAS':
      return {
        ...state,
        cameras: action.payload,
        lastUpdated: new Date(),
      };

    case 'ADD_ALERT':
      return {
        ...state,
        alerts: [action.payload, ...state.alerts].slice(0, 100), // Keep last 100 alerts
      };

    case 'RESOLVE_ALERT':
      return {
        ...state,
        alerts: state.alerts.map(alert =>
          alert.id === action.payload ? { ...alert, resolved: true } : alert
        ),
      };

    case 'UPDATE_USER_PREFERENCES':
      const newPreferences = { ...state.userPreferences, ...action.payload };
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('dashboard-preferences', JSON.stringify(newPreferences));
      }
      return {
        ...state,
        userPreferences: newPreferences,
      };

    case 'SET_LAST_UPDATED':
      return { ...state, lastUpdated: action.payload };

    case 'RESET_STATE':
      return initialState;

    default:
      return state;
  }
}

// Context
const DashboardContext = createContext<{
  state: DashboardState;
  dispatch: React.Dispatch<DashboardAction>;
  // Helper functions
  updateMetrics: (metrics: Partial<DashboardMetrics>) => void;
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp'>) => void;
  resolveAlert: (alertId: string) => void;
  updatePreferences: (preferences: Partial<DashboardState['userPreferences']>) => void;
  refreshData: () => Promise<void>;
} | null>(null);

// Provider component
export function DashboardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  // Load preferences from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dashboard-preferences');
      if (saved) {
        try {
          const preferences = JSON.parse(saved);
          dispatch({ type: 'UPDATE_USER_PREFERENCES', payload: preferences });
        } catch (error) {
          console.error('Failed to load dashboard preferences:', error);
        }
      }
    }
  }, []);

  // Auto-refresh functionality
  useEffect(() => {
    if (!state.userPreferences.autoRefresh) return;

    const interval = setInterval(() => {
      refreshData();
    }, state.userPreferences.refreshInterval);

    return () => clearInterval(interval);
  }, [state.userPreferences.autoRefresh, state.userPreferences.refreshInterval]);

  // Helper functions
  const updateMetrics = (metrics: Partial<DashboardMetrics>) => {
    dispatch({ type: 'UPDATE_METRICS', payload: metrics });
  };

  const addAlert = (alertData: Omit<Alert, 'id' | 'timestamp'>) => {
    const alert: Alert = {
      ...alertData,
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };
    dispatch({ type: 'ADD_ALERT', payload: alert });
  };

  const resolveAlert = (alertId: string) => {
    dispatch({ type: 'RESOLVE_ALERT', payload: alertId });
  };

  const updatePreferences = (preferences: Partial<DashboardState['userPreferences']>) => {
    dispatch({ type: 'UPDATE_USER_PREFERENCES', payload: preferences });
  };

  const refreshData = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock data updates
      const mockMetrics: Partial<DashboardMetrics> = {
        totalCameras: Math.floor(Math.random() * 10) + 20,
        activeCameras: Math.floor(Math.random() * 8) + 15,
        detectionsToday: Math.floor(Math.random() * 500) + 1000,
        systemUptime: 99.9,
        activeUsers: Math.floor(Math.random() * 5) + 10,
        alertsResolved: Math.floor(Math.random() * 20) + 80,
      };

      const mockCameras: Camera[] = Array.from({ length: mockMetrics.totalCameras || 20 }, (_, i) => ({
        id: `cam-${i + 1}`,
        name: `Camera ${i + 1}`,
        status: Math.random() > 0.1 ? 'online' : 'offline' as const,
        location: ['Front Door', 'Back Yard', 'Garage', 'Hallway', 'Parking'][Math.floor(Math.random() * 5)],
        lastActivity: new Date(Date.now() - Math.random() * 3600000), // Within last hour
        detections: Math.floor(Math.random() * 50),
      }));

      dispatch({ type: 'UPDATE_METRICS', payload: mockMetrics });
      dispatch({ type: 'UPDATE_CAMERAS', payload: mockCameras });
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to refresh dashboard data' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Initial data load
  useEffect(() => {
    refreshData();
  }, []);

  const value = {
    state,
    dispatch,
    updateMetrics,
    addAlert,
    resolveAlert,
    updatePreferences,
    refreshData,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

// Custom hook to use the dashboard context
export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}

// Selector hooks for specific parts of state
export function useDashboardMetrics() {
  const { state } = useDashboard();
  return state.metrics;
}

export function useDashboardCameras() {
  const { state } = useDashboard();
  return state.cameras;
}

export function useDashboardAlerts() {
  const { state } = useDashboard();
  return state.alerts;
}

export function useDashboardLoading() {
  const { state } = useDashboard();
  return state.isLoading;
}

export function useDashboardError() {
  const { state } = useDashboard();
  return state.error;
}

export function useDashboardPreferences() {
  const { state } = useDashboard();
  return state.userPreferences;
}
