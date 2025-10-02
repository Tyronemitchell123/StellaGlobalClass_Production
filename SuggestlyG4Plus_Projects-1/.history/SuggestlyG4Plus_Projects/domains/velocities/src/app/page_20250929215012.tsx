'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Home() {
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
