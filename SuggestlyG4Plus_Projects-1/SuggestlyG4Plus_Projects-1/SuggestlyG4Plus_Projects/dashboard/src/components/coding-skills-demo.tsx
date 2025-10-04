'use client';

import React, { useState, useEffect } from 'react';
import { DashboardProvider, useDashboard, useDashboardMetrics, useDashboardCameras } from '../contexts/dashboard-context';
import { SEOHead } from './seo-head';
import { EnhancedErrorBoundary, useErrorHandler } from './enhanced-error-boundary';
import {
  Container,
  Flex,
  Grid,
  Stack,
  Section,
  AspectRatio,
  Spacer,
  Layout,
  useBreakpoint
} from './layout-primitive';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Activity,
  Camera,
  AlertTriangle,
  TrendingUp,
  RefreshCw,
  Settings,
  Zap,
  Shield
} from 'lucide-react';

// Demo component showing advanced state management
function StateManagementDemo() {
  const {
    state,
    updateMetrics,
    addAlert,
    resolveAlert,
    updatePreferences,
    refreshData
  } = useDashboard();

  const metrics = useDashboardMetrics();
  const cameras = useDashboardCameras();

  const handleAddTestAlert = () => {
    addAlert({
      type: 'motion',
      severity: 'medium',
      message: 'Test motion detected in zone A',
      cameraId: cameras[0]?.id,
      resolved: false,
    });
  };

  const handleResolveAlert = (alertId: string) => {
    resolveAlert(alertId);
  };

  const handleToggleTheme = () => {
    updatePreferences({
      theme: state.userPreferences.theme === 'dark' ? 'light' : 'dark'
    });
  };

  return (
    <Section title="Advanced State Management Demo" description="Context API with persistence and recovery">
      <Grid cols={{ default: 1, md: 2, lg: 3 }} gap="md">
        {/* Metrics Card */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400" />
              Live Metrics
            </CardTitle>
            <CardDescription>Real-time dashboard metrics with persistence</CardDescription>
          </CardHeader>
          <CardContent>
            <Stack spacing="sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Active Cameras:</span>
                <Badge variant="secondary">{metrics.activeCameras}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Detections Today:</span>
                <Badge variant="secondary">{metrics.detectionsToday}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">System Uptime:</span>
                <Badge variant="secondary">{metrics.systemUptime}%</Badge>
              </div>
            </Stack>
            <Spacer size="sm" />
            <Button onClick={refreshData} disabled={state.isLoading} className="w-full">
              <RefreshCw className={`w-4 h-4 mr-2 ${state.isLoading ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
          </CardContent>
        </Card>

        {/* Preferences Card */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-purple-400" />
              User Preferences
            </CardTitle>
            <CardDescription>Persistent user settings with localStorage</CardDescription>
          </CardHeader>
          <CardContent>
            <Stack spacing="sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Theme:</span>
                <Badge variant="outline">{state.userPreferences.theme}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Notifications:</span>
                <Badge variant={state.userPreferences.notifications ? "default" : "secondary"}>
                  {state.userPreferences.notifications ? 'On' : 'Off'}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Auto Refresh:</span>
                <Badge variant={state.userPreferences.autoRefresh ? "default" : "secondary"}>
                  {state.userPreferences.autoRefresh ? 'On' : 'Off'}
                </Badge>
              </div>
            </Stack>
            <Spacer size="sm" />
            <Button onClick={handleToggleTheme} variant="outline" className="w-full">
              Toggle Theme
            </Button>
          </CardContent>
        </Card>

        {/* Alerts Management Card */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
              Alert Management
            </CardTitle>
            <CardDescription>Real-time alert handling with state updates</CardDescription>
          </CardHeader>
          <CardContent>
            <Stack spacing="sm">
              <div className="text-sm text-slate-400">
                Active Alerts: {state.alerts.filter(a => !a.resolved).length}
              </div>
              <Button onClick={handleAddTestAlert} variant="outline" className="w-full">
                Add Test Alert
              </Button>
              {state.alerts.filter(a => !a.resolved).slice(0, 2).map((alert) => (
                <div key={alert.id} className="bg-slate-700 p-2 rounded text-xs">
                  <div className="font-medium text-orange-400">{alert.message}</div>
                  <Button
                    onClick={() => handleResolveAlert(alert.id)}
                    size="sm"
                    variant="ghost"
                    className="mt-1 h-6 text-xs"
                  >
                    Resolve
                  </Button>
                </div>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Section>
  );
}

// Demo component showing responsive layout primitives
function LayoutPrimitivesDemo() {
  const isMd = useBreakpoint('md');
  const isLg = useBreakpoint('lg');

  return (
    <Section title="Layout Primitives Demo" description="Responsive layout system with accessibility">
      <Stack spacing="lg">
        {/* Container and Flex Demo */}
        <Container>
          <Flex direction="col" responsive gap="md" align="center">
            <div className="bg-slate-800 p-4 rounded-lg flex-1">
              <h3 className="text-white font-medium mb-2">Flex Layout</h3>
              <p className="text-slate-400 text-sm">
                Responsive flexbox with direction changes at breakpoints.
                Current breakpoint: {isMd ? (isLg ? 'Large' : 'Medium') : 'Small'}
              </p>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg flex-1">
              <h3 className="text-white font-medium mb-2">Container</h3>
              <p className="text-slate-400 text-sm">
                Centered container with responsive padding and max-width constraints.
              </p>
            </div>
          </Flex>
        </Container>

        {/* Grid Demo */}
        <Grid cols={{ default: 1, sm: 2, lg: 4 }} gap="md">
          {Array.from({ length: 4 }, (_, i) => (
            <AspectRatio key={i} ratio={1} className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg p-4">
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-white">
                  <div className="text-2xl font-bold mb-2">{i + 1}</div>
                  <div className="text-sm opacity-90">Grid Item</div>
                </div>
              </div>
            </AspectRatio>
          ))}
        </Grid>

        {/* Stack with Divider Demo */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle>Stack with Dividers</CardTitle>
            <CardDescription>Vertical layout with consistent spacing and dividers</CardDescription>
          </CardHeader>
          <CardContent>
            <Stack
              spacing="md"
              divider={<div className="border-t border-slate-600" />}
            >
              <div className="text-slate-300">
                <strong>Item 1:</strong> First item in the stack with divider below
              </div>
              <div className="text-slate-300">
                <strong>Item 2:</strong> Second item with automatic divider insertion
              </div>
              <div className="text-slate-300">
                <strong>Item 3:</strong> Third item demonstrating the pattern
              </div>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Section>
  );
}

// Demo component showing error boundary features
function ErrorBoundaryDemo() {
  const [shouldError, setShouldError] = useState(false);
  const errorHandler = useErrorHandler();

  const triggerError = () => {
    setShouldError(true);
  };

  const triggerHandledError = () => {
    try {
      throw new Error('This is a handled error for demonstration');
    } catch (error) {
      errorHandler(error as Error);
    }
  };

  // This will cause an error when shouldError is true
  if (shouldError) {
    throw new Error('Demo error triggered by user interaction');
  }

  return (
    <Section title="Error Boundary Demo" description="Advanced error handling with recovery strategies">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-400" />
            Error Handling Features
          </CardTitle>
          <CardDescription>
            Test error boundaries, recovery strategies, and error reporting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Stack spacing="md">
            <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg">
              <h4 className="text-yellow-400 font-medium mb-2">⚠️ Warning</h4>
              <p className="text-yellow-200 text-sm">
                Clicking "Trigger Error" will cause this component to throw an error,
                demonstrating the error boundary functionality.
              </p>
            </div>

            <Flex gap="sm" wrap="wrap">
              <Button onClick={triggerError} variant="destructive">
                Trigger Error
              </Button>
              <Button onClick={triggerHandledError} variant="outline">
                Trigger Handled Error
              </Button>
              <Button onClick={() => setShouldError(false)} variant="secondary">
                Reset
              </Button>
            </Flex>
          </Stack>
        </CardContent>
      </Card>
    </Section>
  );
}

// Main demo component that combines everything
function CodingSkillsDemoContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <SEOHead
        title="Coding Skills Demo - Advanced React Patterns"
        description="Demonstration of advanced React patterns including state management, SEO, error boundaries, and layout primitives"
        keywords={['React', 'Next.js', 'State Management', 'SEO', 'Error Boundaries', 'Layout']}
        type="article"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'TechArticle',
          headline: 'Advanced React Development Patterns',
          description: 'Comprehensive demonstration of modern React development techniques',
          author: {
            '@type': 'Person',
            name: 'Quantum Vision AI Team',
          },
          datePublished: new Date().toISOString(),
          keywords: 'React, Next.js, State Management, SEO, Error Boundaries',
        }}
      />

      <Container className="py-8">
        <Stack spacing="xl">
          {/* Header */}
          <Section variant="default">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-4">
                Advanced React Development Demo
              </h1>
              <p className="text-xl text-slate-300 mb-6">
                Showcasing modern React patterns and best practices
              </p>
              <Flex gap="md" justify="center" wrap="wrap">
                <Badge variant="secondary" className="px-3 py-1">
                  <Zap className="w-3 h-3 mr-1" />
                  State Management
                </Badge>
                <Badge variant="secondary" className="px-3 py-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  SEO Optimization
                </Badge>
                <Badge variant="secondary" className="px-3 py-1">
                  <Shield className="w-3 h-3 mr-1" />
                  Error Boundaries
                </Badge>
                <Badge variant="secondary" className="px-3 py-1">
                  <Activity className="w-3 h-3 mr-1" />
                  Layout Primitives
                </Badge>
              </Flex>
            </div>
          </Section>

          {/* State Management Demo */}
          <StateManagementDemo />

          {/* Layout Primitives Demo */}
          <LayoutPrimitivesDemo />

          {/* Error Boundary Demo */}
          <ErrorBoundaryDemo />
        </Stack>
      </Container>
    </div>
  );
}

// Wrapped demo with all providers and error boundaries
export function CodingSkillsDemo() {
  return (
    <EnhancedErrorBoundary
      enableReporting={true}
      showDetails={process.env.NODE_ENV === 'development'}
      recoveryStrategies={[
        {
          id: 'reset-demo',
          label: 'Reset Demo',
          description: 'Reset the demo to initial state',
          action: () => {
            window.location.reload();
          },
          priority: 1,
        },
      ]}
    >
      <DashboardProvider>
        <CodingSkillsDemoContent />
      </DashboardProvider>
    </EnhancedErrorBoundary>
  );
}
