export interface BookingFormData {
  pickupAddress: string;
  deliveryAddress: string;
  packageDescription: string;
  packageWeight: number;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  specialInstructions?: string;
  serviceType: 'same-day' | 'express' | 'standard';
  uhnwAssetValue?: number; // For high-value declarations
  securityLevel: 'basic' | 'enhanced' | 'blockchain';
  preferredCurrency: 'USD' | 'EUR' | 'GBP';
  conciergePreferences?: string; // e.g., "private jet integration"
}

export interface TrackingData {
  trackingNumber: string;
  status: 'pickup' | 'in-transit' | 'delivered' | 'delayed';
  currentLocation: string;
  estimatedDelivery: Date;
  progress: number;
  confidence: number;
  updates: TrackingUpdate[];
  blockchainHash?: string; // For tamper-proof tracking
  uhnwPrivacyMode: boolean; // Enhanced privacy for wealthy clients
  predictiveEliteETA?: Date[]; // Multiple ETA scenarios for UHNW
}

export interface TrackingUpdate {
  timestamp: Date;
  status: string;
  location: string;
  description: string;
}

export interface RoutePoint {
  lat: number;
  lng: number;
  type: 'pickup' | 'delivery' | 'waypoint';
  address: string;
}

export interface OptimizedRoute {
  points: RoutePoint[];
  distance: number;
  estimatedTime: number;
  efficiency: number;
}

export interface PricingTier {
  name: string;
  price: number;
  features: string[];
  popular?: boolean;
}
