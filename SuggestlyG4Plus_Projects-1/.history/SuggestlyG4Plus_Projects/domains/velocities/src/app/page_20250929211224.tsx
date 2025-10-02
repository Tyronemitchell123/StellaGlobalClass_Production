'use client';

import { useState } from 'react';

export default function Home() {
  const [bookingForm, setBookingForm] = useState({
    pickup: '',
    destination: '',
    date: '',
    time: '',
    vehicleType: 'standard',
    passengers: 1
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle booking logic here
    console.log('Booking submitted:', bookingForm);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setBookingForm({
      ...bookingForm,
      [e.target.name]: e.target.value
    });
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900"></div>
        <div className="absolute inset-0 bg-black opacity-50"></div>

        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 quantum-text">
            Velocities
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300">
            Luxury Chauffeur Service Redefined
          </p>
          <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto text-gray-400">
            Experience premium transportation with our fleet of luxury vehicles and professional chauffeurs.
            Arrive in style, comfort, and absolute reliability.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="quantum-btn primary large">
              Book Your Ride
            </button>
            <button className="quantum-btn secondary large">
              View Fleet
            </button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Our Premium Services
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              From airport transfers to corporate events, we provide exceptional chauffeur services
              tailored to your specific needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="quantum-card text-center">
              <div className="card-visual mb-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Airport Transfers</h3>
              <p className="text-gray-400 mb-6">
                Seamless airport pickups and drop-offs with flight monitoring and meet & greet services.
              </p>
              <div className="card-features flex flex-wrap gap-2 justify-center">
                <span className="feature">Flight Tracking</span>
                <span className="feature">Meet & Greet</span>
                <span className="feature">Luggage Assist</span>
              </div>
            </div>

            <div className="quantum-card text-center">
              <div className="card-visual mb-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Corporate Travel</h3>
              <p className="text-gray-400 mb-6">
                Professional transportation for business meetings, corporate events, and executive travel.
              </p>
              <div className="card-features flex flex-wrap gap-2 justify-center">
                <span className="feature">Executive Cars</span>
                <span className="feature">WiFi Included</span>
                <span className="feature">Priority Service</span>
              </div>
            </div>

            <div className="quantum-card text-center">
              <div className="card-visual mb-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Special Events</h3>
              <p className="text-gray-400 mb-6">
                Luxury transportation for weddings, galas, concerts, and other special occasions.
              </p>
              <div className="card-features flex flex-wrap gap-2 justify-center">
                <span className="feature">Red Carpet</span>
                <span className="feature">Decor Options</span>
                <span className="feature">Event Coordination</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section className="py-20 px-4 bg-gray-800">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Book Your Luxury Ride
            </h2>
            <p className="text-xl text-gray-400">
              Reserve your premium chauffeur service in just a few clicks
            </p>
          </div>

          <form onSubmit={handleSubmit} className="quantum-card p-8">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-white mb-2">Pickup Location</label>
                <input
                  type="text"
                  name="pickup"
                  value={bookingForm.pickup}
                  onChange={handleChange}
                  className="input w-full bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter pickup address"
                  required
                />
              </div>
              <div>
                <label className="block text-white mb-2">Destination</label>
                <input
                  type="text"
                  name="destination"
                  value={bookingForm.destination}
                  onChange={handleChange}
                  className="input w-full bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter destination"
                  required
                />
              </div>
              <div>
                <label className="block text-white mb-2">Date</label>
                <input
                  type="date"
                  name="date"
                  value={bookingForm.date}
                  onChange={handleChange}
                  className="input w-full bg-gray-700 border-gray-600 text-white"
                  placeholder="Select date"
                  required
                />
              </div>
              <div>
                <label className="block text-white mb-2">Time</label>
                <input
                  type="time"
                  name="time"
                  value={bookingForm.time}
                  onChange={handleChange}
                  className="input w-full bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-white mb-2">Vehicle Type</label>
                <select
                  name="vehicleType"
                  value={bookingForm.vehicleType}
                  onChange={handleChange}
                  className="input w-full bg-gray-700 border-gray-600 text-white"
                >
                  <option value="standard">Standard Luxury Sedan</option>
                  <option value="executive">Executive SUV</option>
                  <option value="premium">Premium Luxury</option>
                  <option value="limousine">Stretch Limousine</option>
                </select>
              </div>
              <div>
                <label className="block text-white mb-2">Passengers</label>
                <select
                  name="passengers"
                  value={bookingForm.passengers}
                  onChange={handleChange}
                  className="input w-full bg-gray-700 border-gray-600 text-white"
                >
                  <option value={1}>1 Passenger</option>
                  <option value={2}>2 Passengers</option>
                  <option value={3}>3 Passengers</option>
                  <option value={4}>4 Passengers</option>
                  <option value={5}>5+ Passengers</option>
                </select>
              </div>
            </div>
            <button type="submit" className="quantum-btn primary large w-full">
              Book Now - Instant Confirmation
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 quantum-text">Velocities</h3>
              <p className="text-gray-400">
                Premium chauffeur service providing luxury transportation solutions
                for discerning clients worldwide.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Airport Transfers</li>
                <li>Corporate Travel</li>
                <li>Special Events</li>
                <li>City Tours</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Phone: +1 (555) 123-4567</li>
                <li>Email: info@velocities.ltd</li>
                <li>24/7 Support Available</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Velocities Ltd. All rights reserved. |
              <a href="#" className="hover:text-white transition-colors ml-1">Privacy Policy</a> |
              <a href="#" className="hover:text-white transition-colors ml-1">Terms of Service</a>
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
