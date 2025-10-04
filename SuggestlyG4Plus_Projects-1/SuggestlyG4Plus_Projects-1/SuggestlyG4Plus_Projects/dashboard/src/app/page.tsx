'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { DashboardLayout } from '../components/dashboard-layout';
import { EnhancedOverviewMetrics } from '../components/enhanced-overview-metrics';
import { EnhancedCameraGrid } from '../components/enhanced-camera-grid';
import { AnalyticsCharts } from '../components/analytics-charts';
import { LoginForm } from '../components/login-form';
import { AuthProvider, useAuth } from '../contexts/auth-context';
import { EnhancedWebSocketProvider, useWebSocket } from '../components/enhanced-websocket-provider';

// Lazy load heavy components
const AIAssistant = dynamic(() => import('@/components/ai-assistant').then(mod => ({ default: mod.AIAssistant })), {
  loading: () => <div className="animate-pulse bg-slate-800 rounded-lg h-96 flex items-center justify-center">Loading AI Assistant...</div>
});

// Protected dashboard component
function ProtectedDashboard() {
  const { isAuthenticated, isLoading, user, token, logout } = useAuth();
  const { connect, disconnect, isConnected } = useWebSocket();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isAuthenticated && token && !isInitialized) {
      // Connect to WebSocket with authentication token
      connect(token);
      setIsInitialized(true);
    }

    return () => {
      if (isInitialized) {
        disconnect();
      }
    };
  }, [isAuthenticated, token, isInitialized, connect, disconnect]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <DashboardLayout>
      {/* User info header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {user?.username?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <h2 className="text-white font-medium">Welcome back, {user?.username}</h2>
            <p className="text-slate-400 text-sm">
              {isConnected ? 'Connected to real-time updates' : 'Connecting...'}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
        >
          Sign Out
        </button>
      </div>

      <div className="space-y-6">
        {/* Enhanced Overview Metrics */}
        <EnhancedOverviewMetrics />

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Camera Feeds */}
          <div className="lg:col-span-2">
            <EnhancedCameraGrid />
          </div>

          {/* Analytics Charts */}
          <div className="space-y-6">
            <AnalyticsCharts />
          </div>
        </div>

        {/* AI Assistant */}
        <Suspense fallback={<div className="animate-pulse bg-slate-800 rounded-lg h-96 flex items-center justify-center">Loading AI Assistant...</div>}>
          <AIAssistant />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}

// Main page component with providers
export default function DashboardPage() {
  return (
    <AuthProvider>
      <EnhancedWebSocketProvider>
        <ProtectedDashboard />
      </EnhancedWebSocketProvider>
    </AuthProvider>
  );
}
