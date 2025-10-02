import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Code, Smartphone, Zap, Award, Users } from 'lucide-react';

const WebDesignLanding = () => {
  const services = [
    {
      icon: <Palette className="w-12 h-12" />,
      title: "UI/UX Design",
      description: "Beautiful, intuitive user interfaces that delight and engage your audience.",
      features: ["User Research", "Wireframing", "Prototyping", "Design Systems"]
    },
    {
      icon: <Code className="w-12 h-12" />,
      title: "Web Development",
      description: "Cutting-edge development with modern frameworks and best practices.",
      features: ["Next.js", "React", "TypeScript", "Performance Optimization"]
    },
    {
      icon: <Smartphone className="w-12 h-12" />,
      title: "Responsive Design",
      description: "Seamless experiences across all devices and screen sizes.",
      features: ["Mobile-First", "Cross-Browser", "Accessibility", "Progressive Web Apps"]
    },
    {
      icon: <Zap className="w-12 h-12" />,
      title: "AI-Powered Solutions",
      description: "Leverage artificial intelligence for smarter, faster web experiences.",
      features: ["Automated Testing", "Content Generation", "Personalization", "Analytics"]
    }
  ];

  const stats = [
    { value: "200+", label: "Projects Completed" },
    { value: "50+", label: "Happy Clients" },
    { value: "99%", label: "Client Satisfaction" },
    { value: "24/7", label: "Support Available" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Code className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">OnTarget Web Design</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#services" className="text-gray-300 hover:text-white transition-colors">Services</a>
              <a href="#portfolio" className="text-gray-300 hover:text-white transition-colors">Portfolio</a>
