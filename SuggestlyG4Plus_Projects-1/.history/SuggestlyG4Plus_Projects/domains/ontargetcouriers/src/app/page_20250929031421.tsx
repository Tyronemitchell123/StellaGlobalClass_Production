'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Truck, Shield, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll for navbar effect
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      setIsScrolled(window.scrollY > 50);
    });
  }

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Truck className="h-8 w-8 text-primary-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">OnTarget Couriers</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#services" className="text-gray-700 hover:text-primary-600 transition-colors">
                Services
              </a>
              <a href="#tracking" className="text-gray-700 hover:text-primary-600 transition-colors">
                Tracking
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-primary-600 transition-colors">
                Pricing
              </a>
              <a href="#contact" className="text-gray-700 hover:text-primary-600 transition-colors">
                Contact
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="outline">Sign In</Button>
              <Button>Get Started</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="absolute inset-0 bg-black opacity-10"></div>

        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-4 animate-pulse-slow">
              <Zap className="w-4 h-4 mr-1" />
              AI-Powered Delivery
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Fast, Reliable <span className="gradient-text">Courier Service</span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Experience the future of delivery with AI-powered route optimization, real-time tracking,
              and guaranteed on-time arrivals.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-4">
                Book a Delivery
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                Track Package
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
                <div className="text-3xl font-bold text-primary-600">99.9%</div>
                <div className="text-gray-600">On-Time Delivery</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div className="text-3xl font-bold text-primary-600">30min</div>
                <div className="text-gray-600">Average Pickup</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <div className="text-3xl font-bold text-primary-600">24/7</div>
                <div className="text-gray-600">Available</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <div className="text-3xl font-bold text-primary-600">1M+</div>
                <div className="text-gray-600">Deliveries</div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our AI-Powered Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Leveraging cutting-edge artificial intelligence to deliver exceptional service
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: MapPin,
                title: "Real-Time Tracking",
                description: "Track your packages in real-time with AI-powered location prediction",
                color: "text-primary-600"
              },
              {
                icon: Clock,
                title: "Route Optimization",
                description: "AI calculates the most efficient routes for faster deliveries",
                color: "text-secondary-600"
              },
              {
                icon: Truck,
                title: "Smart Dispatch",
                description: "Intelligent driver assignment based on location and expertise",
                color: "text-success-600"
              },
              {
                icon: Shield,
                title: "Secure Delivery",
                description: "Advanced security measures with real-time monitoring",
                color: "text-danger-600"
              },
              {
                icon: Users,
                title: "Customer Portal",
                description: "Easy-to-use platform for managing all your deliveries",
                color: "text-purple-600"
              },
              {
                icon: Zap,
                title: "Predictive Analytics",
                description: "AI predicts delivery times and potential delays",
                color: "text-indigo-600"
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
                  <service.icon className={`h-12 w-12 ${service.color} mb-4`} />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600">
                    {service.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tracking Demo Section */}
      <section id="tracking" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Live Package Tracking
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience our real-time tracking system with AI-powered predictions
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Track Your Package
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Enter your tracking number to see real-time updates and AI-powered delivery predictions.
                  </p>

                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Enter tracking number"
                      className="input w-full"
                    />
                    <Button className="w-full">Track Package</Button>
                  </div>
                </div>

                <div className="bg-gray-100 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-600">Status</span>
                    <Badge className="bg-success-100 text-success-800">
                      In Transit
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Estimated Delivery</span>
                      <span className="text-sm font-medium">Today, 3:45 PM</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Current Location</span>
                      <span className="text-sm font-medium">Distribution Center</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Confidence</span>
                      <span className="text-sm font-medium">94%</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div className="bg-primary-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-xs text-gray-500">Pickup</span>
                      <span className="text-xs text-gray-500">In Transit</span>
                      <span className="text-xs text-gray-500">Delivered</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
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
              Ready to Experience AI-Powered Delivery?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Join thousands of businesses and individuals who trust OnTarget Couriers for their delivery needs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                Start Shipping
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-primary-600">
                Contact Sales
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
                AI-powered delivery service for the modern world.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Same Day Delivery</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Express Shipping</a></li>
                <li><a href="#" className="hover:text-white transition-colors">International</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Business Solutions</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb
