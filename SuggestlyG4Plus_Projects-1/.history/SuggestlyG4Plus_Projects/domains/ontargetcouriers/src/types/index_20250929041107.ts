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
}

export interface TrackingData {
  trackingNumber: string;
  status: 'pickup' | 'in-transit' | 'delivered' | 'delayed';
  currentLocation: string;
  estimatedDelivery: Date;
  progress: number;
  confidence: number;
  updates: TrackingUpdate[];
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
