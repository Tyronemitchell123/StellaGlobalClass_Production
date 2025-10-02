'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Home() {
  const [bookingForm, setBookingForm] = useState({
    pickup: '',
    destination: '',
    date: '',
    time: '',
    vehicleType: 'executive',
    passengers: 1
  });

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Booking submitted:', bookingForm);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setBookingForm({
      ...bookingForm,
      [e.target.name]: e.target.value
    });
  };

  // Vehicle data
  const vehicles = [
    {
      id: 'executive',
      name: 'Tesla Model S',
      description: 'All-electric executive sedan with autopilot',
      features: ['Autopilot', 'Premium Sound', 'WiFi', 'Climate Control'],
      image: '/tesla-model-s.jpg'
    },
    {
      id: 'luxury',
      name: 'BMW i7',
      description: 'Ultimate luxury electric sedan',
      features: ['Executive Lounge', 'Theater Screen', 'Massage Seats', 'Ambient Lighting'],
      image: '/bmw-i7.jpg'
    },
    {
      id: 'ultra',
      name: 'Rolls Royce Spectre',
      description: 'Ultra-luxury electric coupe',
      features: ['Starlight Headliner', 'Whisper Quiet', 'Bespoke Interior', 'Coach Doors'],
      image: '/rolls-royce-spectre.jpg'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Advanced Tech Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/95 backdrop-blur-md border-b border-cyan-500/20' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex items-center space-x-2"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                VELOCITIES
              </span>
            </motion.div>

            <div className="hidden md:flex items-center space-x-8">
              {['Fleet', 'Services', 'Pricing', 'About'].map((item, index) => (
                <motion.a
                  key={item}
                  href="#"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-gray-300 hover:text-cyan-400 transition-colors relative group"
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 group-hover:w-full"></span>
                </motion.a>
              ))}
            </div>

            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Book Now
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Tech Elements */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Floating Tech Elements */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 1, 0.2],
                scale: [0.5, 1.5, 0.5],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.h1
              className="text-6xl md:text-8xl font-bold mb-6"
              initial={{ backgroundPosition: '0% 50%' }}
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              style={{
                background: 'linear-gradient(-45deg, #00ffff, #0080ff, #00ffff, #0080ff)',
                backgroundSize: '400% 400%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              ADVANCED
              <br />
              <span className="text-white">MOBILITY</span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              Experience the future of luxury transportation with AI-powered routing,
              autonomous-ready vehicles, and premium chauffeur services.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <button className="group relative px-8 py-4 bg-black border border-cyan-500/50 rounded-xl overflow-hidden">
                <span className="relative z-10 text-cyan-400 font-semibold">
                  Explore Fleet
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </button>

              <button className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl overflow-hidden">
                <span className="relative z-10 text-black font-semibold">
                  Book Ride
                </span>
                <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </button>
            </motion.div>
          </motion.div>

          {/* Tech Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
          >
            {[
              { label: 'AI Routes', value: '99.9%' },
              { label: 'Response Time', value: '< 2min' },
              { label: 'Cities', value: '50+' },
              { label: 'Vehicles', value: '500+' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
              >
                <div className="text-3xl font-bold text-cyan-400 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-cyan-500/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-cyan-400 rounded-full mt-2"></div>
          </div>
        </motion.div>
      </section>

      {/* Vehicle Fleet Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-white">PREMIUM </span>
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">FLEET</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Our cutting-edge vehicles combine luxury, technology, and sustainability
              for the ultimate transportation experience.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {vehicles.map((vehicle, index) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="relative bg-gradient-to-br from-gray-800 to-black border border-gray-700 rounded-2xl p-6 h-full overflow-hidden">
                  {/* Tech Border Animation */}
                  <div className="absolute inset-0 rounded-2xl p-px bg-gradient-to-br from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/50 group-hover:to-blue-500/50 transition-all duration-500">
                    <div className="absolute inset-0 bg-black rounded-2xl"></div>
                  </div>

                  <div className="relative z-10">
                    <div className="w-full h-48 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl mb-6 flex items-center justify-center">
                      <div className="text-4xl">
                        {vehicle.id === 'executive' && '🚗'}
                        {vehicle.id === 'luxury' && '🏎️'}
                        {vehicle.id === 'ultra' && '✨'}
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-2">{vehicle.name}</h3>
                    <p className="text-gray-400 mb-4">{vehicle.description}</p>

                    <div className="space-y-2 mb-6">
                      {vehicle.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm text-cyan-400">
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          {feature}
                        </div>
                      ))}
                    </div>

                    <button className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 rounded-lg font-semibold text-black transition-all duration-300 transform hover:scale-105">
                      Select Vehicle
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI-Powered Booking Section */}
      <section className="py-20 px-6 relative overflow-hidden">
        {/* Background Tech Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(0, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(0, 128, 255, 0.1) 0%, transparent 50%)`,
          }}></div>
        </div>

        <div className="container mx-auto max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">AI-POWERED</span>
              <br />
              <span className="text-white">BOOKING</span>
            </h2>
            <p className="text-xl text-gray-400">
              Our intelligent system optimizes your route, predicts traffic, and ensures
              the most efficient journey possible.
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="bg-gradient-to-br from-gray-900 to-black border border-cyan-500/20 rounded-2xl p-8 backdrop-blur-lg"
          >
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {[
                { name: 'pickup', placeholder: 'Pickup Location', icon: '📍' },
                { name: 'destination', placeholder: 'Destination', icon: '🎯' },
                { name: 'date', placeholder: 'Date', type: 'date', icon: '📅' },
                { name: 'time', placeholder: 'Time', type: 'time', icon: '⏰' },
              ].map((field, index) => (
                <motion.div
                  key={field.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">
                    {field.icon}
                  </div>
                  <input
                    type={field.type || 'text'}
                    name={field.name}
                    value={bookingForm[field.name as keyof typeof bookingForm]}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-black/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder={field.placeholder}
                    required
                  />
                </motion.div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <label className="block text-sm font-medium text-gray-400 mb-2">Vehicle Class</label>
                <select
                  name="vehicleType"
                  value={bookingForm.vehicleType}
                  onChange={handleChange}
                  className="w-full px-4 py-4 bg-black/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition-colors appearance-none"
                >
                  <option value="executive">Executive Sedan</option>
                  <option value="luxury">Luxury Vehicle</option>
                  <option value="ultra">Ultra-Luxury</option>
                </select>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <label className="block text-sm font-medium text-gray-400 mb-2">Passengers</label>
                <select
                  name="passengers"
                  value={bookingForm.passengers}
                  onChange={handleChange}
                  className="w-full px-4 py-4 bg-black/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition-colors appearance-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Passenger' : 'Passengers'}</option>
                  ))}
                </select>
              </motion.div>
            </div>

            <motion.button
