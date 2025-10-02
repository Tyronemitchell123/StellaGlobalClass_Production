'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Truck, Shield, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookingForm } from '@/components/BookingForm';
import { TrackingInterface } from '@/components/TrackingInterface';
import { RouteMap } from '@/components/RouteMap';
import { PricingSection } from '@/components/PricingSection';
import { AIConcierge } from '@/components/AIConcierge';
import { BlockchainTracker } from '@/components/BlockchainTracker';
import { BookingFormData, PricingTier, TrackingData } from '@/types';

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);

  const sampleTrackingData: TrackingData = {
    trackingNumber: 'UHNW-2024-001',
    blockchainHash: '0x123abc...def456',
    status: 'in-transit',
    currentLocation: 'En route to secure facility',
    estimatedDelivery: new Date(Date.now() + 86400000), // Tomorrow
    progress: 65,
    confidence: 95,
    uhnwPrivacyMode: true,
    updates: [
      {
        status: 'pickup',
        description: 'Package collected from client residence',
        location: 'New York, NY',
        timestamp: new Date(Date.now() - 86400000), // Yesterday
      },
      {
        status: 'in-transit',
        description: 'Secure transport initiated',
        location: 'Airborne - Private Jet',
        timestamp: new Date(),
      },
    ],
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    if (typeof window !== 'undefined') {
      const element = document.getElementById(sectionId);
      if (element) {
        const navHeight = 64; // Approximate nav height
        const offsetTop = element.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    }
  };

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
              <button onClick={() => scrollToSection('services')} className="text-quantum-light hover:text-quantum-primary transition-colors">
                Services
              </button>
              <button onClick={() => scrollToSection('booking')} className="text-quantum-light hover:text-quantum-primary transition-colors">
                Book Delivery
              </button>
              <button onClick={() => scrollToSection('tracking')} className="text-quantum-light hover:text-quantum-primary transition-colors">
                Tracking
              </button>
              <button onClick={() => scrollToSection('pricing')} className="text-quantum-light hover:text-quantum-primary transition-colors">
                Pricing
              </button>
              <button onClick={() => scrollToSection('contact')} className="text-quantum-light hover:text-quantum-primary transition-colors">
                Contact
              </button>
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
              Quantum-AI Powered Delivery
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold text-quantum-light mb-6">
              Ultra-Premium <span className="quantum-gradient-text">Courier Service</span>
            </h1>

            <p className="text-xl text-quantum-light/80 mb-8 max-w-3xl mx-auto">
              Experience world-class logistics with quantum computing, AI-powered route optimization, real-time tracking,
              and guaranteed on-time arrivals for the world's most discerning clients.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => scrollToSection('booking')} className="text-lg px-8 py-4 bg-quantum-primary hover:bg-quantum-primary/80 text-quantum-dark">
                Book Exclusive Delivery
              </Button>
              <Button variant="outline" size="lg" onClick={() => scrollToSection('tracking')} className="text-lg px-8 py-4 border-quantum-primary text-quantum-primary hover:bg-quantum-primary hover:text-quantum-dark">
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
                title: "Quantum-Enhanced GPS Tracking",
                description: "Track your valuable packages in real-time with quantum-secured GPS and AI-powered location prediction",
                color: "text-quantum-primary"
              },
              {
                icon: Clock,
                title: "Quantum Dynamic Route Optimization",
                description: "Quantum computing algorithms evaluate millions of routes simultaneously for instantaneous, optimal deliveries",
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
                title: "Quantum Fort Knox Security",
                description: "Post-quantum cryptography and unbreakable encryption protocols with real-time monitoring and comprehensive insurance",
                color: "text-quantum-primary"
              },
              {
                icon: Users,
                title: "VIP Quantum Client Portal",
                description: "Exclusive quantum-secured platform for managing deliveries with dedicated account managers and priority support",
                color: "text-quantum-secondary"
              },
              {
                icon: Zap,
                title: "Quantum Predictive Intelligence",
                description: "Quantum AI predicts delivery times, potential delays, and optimal scheduling with 99.999% accuracy",
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

      {/* Quantum Logistics Section */}
      <section className="py-20 bg-gradient-to-br from-quantum-dark via-quantum-primary/10 to-quantum-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-quantum-primary/20 text-quantum-primary border-quantum-primary">
              <Zap className="w-4 h-4 mr-1" />
              Quantum Computing Integration
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-quantum-light mb-4">
              Quantum-Powered Global Logistics
            </h2>
            <p className="text-xl text-quantum-light/80 max-w-3xl mx-auto">
              Harnessing quantum computing for instantaneous route optimization, predictive analytics,
              and unbreakable security protocols that redefine global delivery standards.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-quantum-dark/50 p-8 rounded-lg border border-quantum-primary/30">
                <div className="text-4xl font-bold text-quantum-primary mb-2">10^6x</div>
                <div className="text-quantum-light/70">Faster Route Calculation</div>
                <p className="text-sm text-quantum-light/50 mt-2">
                  Quantum superposition enables simultaneous evaluation of millions of routes
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-quantum-dark/50 p-8 rounded-lg border border-quantum-primary/30">
                <div className="text-4xl font-bold text-quantum-primary mb-2">99.999%</div>
                <div className="text-quantum-light/70">Predictive Accuracy</div>
                <p className="text-sm text-quantum-light/50 mt-2">
                  Quantum entanglement predicts disruptions before they occur
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-quantum-dark/50 p-8 rounded-lg border border-quantum-primary/30">
                <div className="text-4xl font-bold text-quantum-primary mb-2">Unbreakable</div>
                <div className="text-quantum-light/70">Quantum Encryption</div>
                <p className="text-sm text-quantum-light/50 mt-2">
                  Post-quantum cryptography secures your most valuable assets
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Elite Global Network */}
      <section className="py-20 bg-gradient-to-br from-quantum-dark via-quantum-primary/5 to-quantum-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-quantum-primary/20 text-quantum-primary border-quantum-primary">
              <Users className="w-4 h-4 mr-1" />
              Elite Global Partnerships
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-quantum-light mb-4">
              Connected to the World's Most Exclusive Networks
            </h2>
            <p className="text-xl text-quantum-light/80 max-w-3xl mx-auto">
              Our unparalleled partnerships with luxury brands, private aviation, and elite transportation
              providers ensure your deliveries arrive with the sophistication they deserve.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Private Aviation Alliance",
                description: "Direct access to Gulfstream, Bombardier, and Dassault private jets for transcontinental deliveries with seamless global handoffs—no local drivers needed, coordinated via trusted international networks",
                icon: "✈️"
              },
              {
                name: "Luxury Yacht Consortium",
                description: "Exclusive partnerships with superyacht operators for coastal and island deliveries via trusted international maritime networks, ensuring secure transfers without local personnel",
                icon: "⛵"
              },
              {
                name: "Elite Automotive Network",
                description: "Armored Mercedes-Maybach, Rolls-Royce, and Bentley vehicles for urban premium transport, coordinated with global partner fleets abroad for end-to-end delivery chains",
                icon: "🚗"
              },
              {
                name: "High-Security Vault Partners",
                description: "Fortress-grade storage facilities in Zurich, Singapore, and New York for maximum asset protection, with secure international transfer protocols and vetted partner couriers worldwide",
                icon: "🏛️"
              }
            ].map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="bg-quantum-dark/50 p-8 rounded-lg border border-quantum-primary/30 hover:border-quantum-primary transition-all duration-300">
                  <div className="text-4xl mb-4">{partner.icon}</div>
                  <h3 className="text-xl font-semibold text-quantum-light mb-2">
                    {partner.name}
                  </h3>
                  <p className="text-quantum-light/70 text-sm">
                    {partner.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className="inline-flex items-center space-x-8 text-quantum-light/60">
              <span className="text-lg font-semibold">Trusted by:</span>
              <div className="flex items-center space-x-6">
                {["Rolex", "Cartier", "Christie's", "Sotheby's", "Phillips"].map((brand, index) => (
                  <span key={index} className="text-quantum-light/40 hover:text-quantum-primary transition-colors cursor-pointer">
                    {brand}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quantum Neural Interface */}
      <section className="py-20 bg-gradient-to-br from-quantum-primary/10 via-quantum-dark to-quantum-secondary/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-quantum-primary/20 text-quantum-primary border-quantum-primary animate-pulse-slow">
              <Zap className="w-4 h-4 mr-1" />
      <section className="py-20 bg-quantum-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-quantum-light mb-4">
              Quantum Route Optimization
            </h2>
            <p className="text-xl text-quantum-light/80 max-w-3xl mx-auto">
              See how our quantum computing algorithms optimize delivery routes in real-time
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
          <div className="mt-8">
            <BlockchainTracker trackingData={sampleTrackingData} />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing">
        <PricingSection onSelectPlan={handlePricingSelect} />
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-quantum-dark/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-quantum-light mb-4">
              Contact Our Concierge Team
            </h2>
            <p className="text-xl text-quantum-light/80 max-w-3xl mx-auto">
              Speak with our dedicated concierge service for personalized assistance
            </p>
          </div>
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-quantum-light/70 mb-8">
              For immediate assistance or to discuss your premium delivery needs, contact our 24/7 concierge team.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-center space-x-2">
                <Truck className="h-5 w-5 text-quantum-primary" />
                <span className="text-quantum-light">Phone: +1 (800) ELITE-DEL</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <MapPin className="h-5 w-5 text-quantum-primary" />
                <span className="text-quantum-light">Global Headquarters: New York, NY</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Clock className="h-5 w-5 text-quantum-primary" />
                <span className="text-quantum-light">Available 24/7 for VIP Clients</span>
              </div>
            </div>
            <Button size="lg" className="bg-quantum-primary hover:bg-quantum-primary/80 text-quantum-dark">
              Request Concierge Call
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-quantum-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-quantum-dark mb-4">
              Ready to Experience Ultra-Premium Delivery?
            </h2>
            <p className="text-xl text-quantum-dark/80 mb-8 max-w-3xl mx-auto">
              Join the world's most discerning clients who trust OnTarget Couriers for their most valuable shipments.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => scrollToSection('booking')} variant="secondary" className="text-lg px-8 py-4 bg-quantum-dark hover:bg-quantum-dark/80 text-quantum-light">
                Start Your Journey
              </Button>
              <Button size="lg" onClick={() => setIsConciergeOpen(true)} className="text-lg px-8 py-4 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800">
                Chat with AI Concierge
              </Button>
              <Button size="lg" onClick={() => scrollToSection('contact')} variant="outline" className="text-lg px-8 py-4 border-quantum-dark text-quantum-dark hover:bg-quantum-dark hover:text-quantum-light">
                Speak to Concierge
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {isConciergeOpen && (
        <AIConcierge isOpen={isConciergeOpen} onClose={() => setIsConciergeOpen(false)} />
      )}

      {/* Footer */}
      <footer className="bg-quantum-dark text-quantum-light py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Truck className="h-8 w-8 text-quantum-primary mr-2" />
                <span className="text-xl font-bold text-quantum-light">OnTarget Couriers</span>
              </div>
              <p className="text-quantum-light/70">
                Ultra-premium quantum-AI powered delivery service for the world's elite.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-quantum-light">Premium Services</h3>
              <ul className="space-y-2 text-quantum-light/70">
                <li><button onClick={() => scrollToSection('booking')} className="hover:text-quantum-primary transition-colors">VIP Same-Day Delivery</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="hover:text-quantum-primary transition-colors">Express Concierge Service</button></li>
                <li><button onClick={() => scrollToSection('booking')} className="hover:text-quantum-primary transition-colors">International Luxury Shipping</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="hover:text-quantum-primary transition-colors">High-Value Asset Transport</button></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-quantum-light">Our World</h3>
              <ul className="space-y-2 text-quantum-light/70">
                <li><button onClick={() => scrollToSection('contact')} className="hover:text-quantum-primary transition-colors">About Our Excellence</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="hover:text-quantum-primary transition-colors">Elite Partnerships</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="hover:text-quantum-primary transition-colors">Press & Recognition</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="hover:text-quantum-primary transition-colors">Concierge Contact</button></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-quantum-light">Client Support</h3>
              <ul className="space-y-2 text-quantum-light/70">
                <li><button onClick={() => scrollToSection('contact')} className="hover:text-quantum-primary transition-colors">24/7 VIP Support</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="hover:text-quantum-primary transition-colors">Privacy & Security</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="hover:text-quantum-primary transition-colors">Service Terms</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="hover:text-quantum-primary transition-colors">System Status</button></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-quantum-primary/30 mt-8 pt-8 text-center">
            <p className="text-quantum-light/70">
              © 2024 OnTarget Couriers. Serving the world's most discerning clients with unparalleled excellence.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
