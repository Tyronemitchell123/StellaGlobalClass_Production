'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Truck, Shield, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookingForm } from '@/components/BookingForm';
import { TrackingInterface } from '@/components/TrackingInterface';
import { RouteMap } from '@/components/RouteMap';
import { PricingSection } from '@/components/PricingSection';
import { BookingFormData, PricingTier } from '@/types';

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll for navbar effect
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      setIsScrolled(window.scrollY > 50);
    });
  }

  const handleBookingSubmit = (data: BookingFormData) => {
    console.log('Booking submitted:', data);
    // Handle booking submission
  };

  const handlePricingSelect = (tier: PricingTier) => {
    console.log('Pricing tier selected:', tier);
    // Handle pricing selection
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-quantum-dark shadow-lg border-b border-quantum-primary' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Truck className="h-8 w-8 text-quantum-primary mr-2" />
              <span className="text-xl font-bold text-quantum-light">OnTarget Couriers</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#services" className="text-quantum-light hover:text-quantum-primary transition-colors">
                Services
              </a>
              <a href="#booking" className="text-quantum-light hover:text-quantum-primary transition-colors">
                Book Delivery
              </a>
              <a href="#tracking" className="text-quantum-light hover:text-quantum-primary transition-colors">
                Tracking
              </a>
              <a href="#pricing" className="text-quantum-light hover:text-quantum-primary transition-colors">
                Pricing
              </a>
              <a href="#contact" className="text-quantum-light hover:text-quantum-primary transition-colors">
                Contact
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="outline" className="border-quantum-primary text-quantum-primary hover:bg-quantum-primary hover:text-quantum-dark">Sign In</Button>
              <Button className="bg-quantum-primary hover:bg-quantum-primary/80 text-quantum-dark">Get Started</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-quantum-dark via-quantum-dark/90 to-quantum-primary/20">
        <div className="absolute inset-0 bg-gradient-to-r from-quantum-primary/10 via-transparent to-quantum-secondary/10"></div>

        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-4 animate-pulse-slow bg-quantum-primary/20 text-quantum-primary border-quantum-primary">
              <Zap className="w-4 h-4 mr-1" />
              AI-Powered Delivery
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold text-quantum-light mb-6">
              Ultra-Premium <span className="quantum-gradient-text">Courier Service</span>
            </h1>

            <p className="text-xl text-quantum-light/80 mb-8 max-w-3xl mx-auto">
              Experience world-class logistics with AI-powered route optimization, real-time tracking,
              and guaranteed on-time arrivals for discerning clients.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-4 bg-quantum-primary hover:bg-quantum-primary/80 text-quantum-dark">
                Book Exclusive Delivery
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-quantum-primary text-quantum-primary hover:bg-quantum-primary hover:text-quantum-dark">
                Track Your Package
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="absolute bottom-8 left-0 right-0">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="text-3xl font-bold text-quantum-primary">99.9%</div>
                <div className="text-quantum-light/70">On-Time Delivery</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div className="text-3xl font-bold text-quantum-primary">15min</div>
                <div className="text-quantum-light/70">Average Pickup</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <div className="text-3xl font-bold text-quantum-primary">24/7</div>
                <div className="text-quantum-light/70">Concierge Service</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <div className="text-3xl font-bold text-quantum-primary">$10M+</div>
                <div className="text-quantum-light/70">Insurance Coverage</div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-quantum-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-quantum-light mb-4">
              AI-Powered Premium Services
            </h2>
            <p className="text-xl text-quantum-light/80 max-w-3xl mx-auto">
              Leveraging cutting-edge artificial intelligence to deliver exceptional service for the world's most discerning clients
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: MapPin,
                title: "Real-Time GPS Tracking",
                description: "Track your valuable packages in real-time with AI-powered location prediction and security monitoring",
                color: "text-quantum-primary"
              },
              {
                icon: Clock,
                title: "Dynamic Route Optimization",
                description: "Machine learning algorithms calculate the most efficient routes for faster, more reliable deliveries",
                color: "text-quantum-secondary"
              },
              {
                icon: Truck,
                title: "Professional Dispatch",
                description: "Expert drivers with background checks and specialized training for high-value shipments",
                color: "text-quantum-accent"
              },
              {
                icon: Shield,
                title: "Fort Knox Security",
                description: "Military-grade security protocols with real-time monitoring and comprehensive insurance coverage",
                color: "text-quantum-primary"
              },
              {
                icon: Users,
                title: "VIP Client Portal",
                description: "Exclusive platform for managing deliveries with dedicated account managers and priority support",
                color: "text-quantum-secondary"
              },
              {
                icon: Zap,
                title: "Predictive Intelligence",
                description: "AI predicts delivery times, potential delays, and optimal scheduling with 95%+ accuracy",
                color: "text-quantum-accent"
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 bg-quantum-dark/50 border-quantum-primary/30 hover:border-quantum-primary hover:shadow-lg hover:shadow-quantum-primary/20 transition-all duration-300">
                  <service.icon className={`h-12 w-12 ${service.color} mb-4`} />
                  <h3 className="text-xl font-semibold text-quantum-light mb-2">
                    {service.title}
                  </h3>
                  <p className="text-quantum-light/70">
                    {service.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="booking" className="py-20 bg-quantum-dark/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-quantum-light mb-4">
              Arrange Your Exclusive Delivery
            </h2>
            <p className="text-xl text-quantum-light/80 max-w-3xl mx-auto">
              Experience concierge-level service with our premium booking system
            </p>
          </div>

          <BookingForm onSubmit={handleBookingSubmit} />
        </div>
      </section>

      {/* Route Optimization Demo */}
      <section className="py-20 bg-quantum-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-quantum-light mb-4">
              AI Route Optimization
            </h2>
            <p className="text-xl text-quantum-light/80 max-w-3xl mx-auto">
              See how our machine learning algorithms optimize delivery routes in real-time
            </p>
          </div>

          <RouteMap />
        </div>
      </section>

      {/* Tracking Section */}
      <section id="tracking" className="py-20 bg-quantum-dark/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-quantum-light mb-4">
              Premium Package Tracking
            </h2>
            <p className="text-xl text-quantum-light/80 max-w-3xl mx-auto">
              Experience our real-time tracking system with AI-powered predictions and insights
            </p>
          </div>

          <TrackingInterface />
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing">
        <PricingSection onSelectPlan={handlePricingSelect} />
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Experience Ultra-Premium Delivery?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Join the world's most discerning clients who trust OnTarget Couriers for their most valuable shipments.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                Start Your Journey
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-primary-600">
                Speak to Concierge
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Truck className="h-8 w-8 text-primary-400 mr-2" />
                <span className="text-xl font-bold">OnTarget Couriers</span>
              </div>
              <p className="text-gray-400">
                Ultra-premium AI-powered delivery service for the world's elite.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Premium Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">VIP Same-Day Delivery</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Express Concierge Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">International Luxury Shipping</a></li>
                <li><a href="#" className="hover:text-white transition-colors">High-Value Asset Transport</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Our World</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Our Excellence</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Elite Partnerships</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press & Recognition</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Concierge Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Client Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">24/7 VIP Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy & Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Service Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">System Status</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 OnTarget Couriers. Serving the world's most discerning clients with unparalleled excellence.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
