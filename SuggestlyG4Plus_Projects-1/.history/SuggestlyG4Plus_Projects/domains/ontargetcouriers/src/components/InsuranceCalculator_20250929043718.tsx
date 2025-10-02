'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Calculator, DollarSign, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface InsuranceOption {
  name: string;
  coverage: number;
  premium: number;
  deductible: number;
  features: string[];
  recommended?: boolean;
}

interface InsuranceCalculatorProps {
  packageValue?: number;
  onInsuranceSelect?: (option: InsuranceOption) => void;
}

export function InsuranceCalculator({ packageValue = 0, onInsuranceSelect }: InsuranceCalculatorProps) {
  const [declaredValue, setDeclaredValue] = useState(packageValue || 1000);
  const [selectedOption, setSelectedOption] = useState<InsuranceOption | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const insuranceOptions: InsuranceOption[] = [
    {
      name: 'Basic Coverage',
      coverage: Math.min(declaredValue, 1000),
      premium: Math.max(declaredValue * 0.005, 5), // 0.5% or $5 minimum
      deductible: 50,
      features: [
        'Coverage up to $1,000',
        'Lost or damaged packages',
        'Standard processing time',
        'Email support'
      ]
    },
    {
      name: 'Premium Protection',
      coverage: Math.min(declaredValue, 5000),
      premium: Math.max(declaredValue * 0.008, 15), // 0.8% or $15 minimum
      deductible: 25,
      recommended: declaredValue > 1000,
      features: [
        'Coverage up to $5,000',
        'Lost or damaged packages',
        'Priority claims processing',
        'Phone support',
        'Real-time tracking included'
      ]
    },
    {
      name: 'Elite Assurance',
      coverage: Math.min(declaredValue, 25000),
      premium: Math.max(declaredValue * 0.012, 50), // 1.2% or $50 minimum
      deductible: 0,
      recommended: declaredValue > 5000,
      features: [
        'Coverage up to $25,000',
        'Lost or damaged packages',
        'VIP claims processing (24h)',
        'Dedicated claims manager',
        'Premium tracking & monitoring',
        'International coverage',
        'Art/antique specialist handling'
      ]
    },
    {
      name: 'Fort Knox Security',
      coverage: declaredValue,
      premium: Math.max(declaredValue * 0.015, 100), // 1.5% or $100 minimum
      deductible: 0,
      recommended: declaredValue > 25000,
      features: [
        'Full declared value coverage',
        'Lost or damaged packages',
        'Immediate claims processing',
        'Personal security consultant',
        'Armored transport options',
        'Blockchain-verified tracking',
        'Global network coverage',
        'Emergency response team'
      ]
    }
  ];

  const calculateRisk = (value: number) => {
    if (value < 500) return { level: 'Low', color: 'text-green-600', bg: 'bg-green-100' };
    if (value < 2000) return { level: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (value < 10000) return { level: 'High', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { level: 'Critical', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const risk = calculateRisk(declaredValue);

  const handleSelectOption = (option: InsuranceOption) => {
    setSelectedOption(option);
    if (onInsuranceSelect) {
      onInsuranceSelect(option);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Card className="p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center">
              <Shield className="h-6 w-6 mr-2 text-primary-600" />
              Package Insurance Calculator
            </h3>
            <Button
              variant="outline"
              onClick={() => setShowDetails(!showDetails)}
            >
              <Info className="h-4 w-4 mr-2" />
              {showDetails ? 'Hide' : 'Show'} Details
            </Button>
          </div>

          <p className="text-gray-600">
            Calculate insurance costs based on your package's declared value.
            Protection covers loss, damage, and theft during transit.
          </p>
        </div>

        {/* Value Input */}
        <Card className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Package Declared Value
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="number"
                value={declaredValue}
                onChange={(e) => setDeclaredValue(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-lg font-semibold"
                placeholder="Enter package value"
                min="1"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-600">Risk Level:</span>
              <Badge className={`${risk.bg} ${risk.color}`}>
                {risk.level}
              </Badge>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Recommended Coverage</div>
              <div className="text-lg font-bold text-primary-600">
                ${Math.max(declaredValue * 0.01, 100).toLocaleString()}
              </div>
            </div>
          </div>
        </Card>

        {/* Insurance Options */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {insuranceOptions.map((option, index) => (
            <motion.div
              key={option.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card
                className={`p-6 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  selectedOption?.name === option.name
                    ? 'ring-2 ring-primary-500 shadow-lg'
                    : 'hover:shadow-md'
                } ${option.recommended ? 'border-2 border-secondary-300' : ''}`}
                onClick={() => handleSelectOption(option)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                      {option.name}
                      {option.recommended && (
                        <Badge className="ml-2 bg-secondary-100 text-secondary-800">
                          Recommended
                        </Badge>
                      )}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Coverage up to ${option.coverage.toLocaleString()}
                    </p>
                  </div>
                  {selectedOption?.name === option.name && (
                    <CheckCircle className="h-6 w-6 text-primary-600" />
                  )}
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Premium:</span>
                    <span className="text-lg font-bold text-primary-600">
                      ${option.premium.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Deductible:</span>
                    <span className="text-sm font-medium text-gray-900">
                      ${option.deductible}
                    </span>
                  </div>
                </div>

                <ul className="space-y-2 mb-4">
                  {option.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectOption(option);
                  }}
                  className={`w-full ${
                    selectedOption?.name === option.name
                      ? 'bg-primary-600 hover:bg-primary-700'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                  variant={selectedOption?.name === option.name ? 'default' : 'outline'}
                >
                  {selectedOption?.name === option.name ? 'Selected' : 'Select Coverage'}
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Selected Option Summary */}
        {selectedOption && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <div className="flex items-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
                <h4 className="text-lg font-semibold text-green-900">Insurance Selected</h4>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-sm text-green-700">Coverage</div>
                  <div className="text-xl font-bold text-green-900">
                    ${selectedOption.coverage.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-green-700">Premium</div>
                  <div className="text-xl font-bold text-green-900">
                    ${selectedOption.premium.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-green-700">Deductible</div>
                  <div className="text-xl font-bold text-green-900">
                    ${selectedOption.deductible}
                  </div>
                </div>
              </div>

              <div className="text-sm text-green-800">
                <strong>What this covers:</strong> Loss, theft, or damage to your package during transit.
                Claims processed within 24-48 hours for standard coverage, faster for premium options.
              </div>
            </Card>
          </motion.div>
        )}

        {/* Additional Information */}
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="p-6 bg-gray-50">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Insurance Details</h4>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">What's Covered</h5>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Loss or theft during transit</li>
                    <li>• Accidental damage</li>
                    <li>• Fire, flood, or natural disasters</li>
                    <li>• Vehicle accidents</li>
                    <li>• Handling errors</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">What's Not Covered</h5>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Pre-existing damage</li>
                    <li>• Inadequate packaging</li>
                    <li>• Acts of war or terrorism</li>
                    <li>• Nuclear incidents</li>
                    <li>• Illegal contents</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                  <div>
                    <h6 className="font-semibold text-blue-900 mb-1">Important Notes</h6>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Insurance is optional but recommended for valuable shipments</li>
                      <li>• Claims must be filed within 30 days of delivery</li>
                      <li>• Photo documentation improves claim processing</li>
                      <li>• Premium rates may vary based on destination and package type</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </Card>
    </div>
  );
}
