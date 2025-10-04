'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Star, Zap, Gem, Check, CreditCard, Calendar, DollarSign } from 'lucide-react';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  icon: React.ComponentType<any>;
  popular?: boolean;
  premium?: boolean;
  elite?: boolean;
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: '$199',
    period: '/month',
    description: 'Essential features for getting started',
    icon: Star,
    features: [
      'Core AI Assistance',
      'Basic Analytics',
      'Email Support',
      'EQ Mode: Basic Emotional Intelligence Insights'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$999',
    period: '/month',
    description: 'Advanced features for professionals',
    icon: Zap,
    popular: true,
    features: [
      'Advanced AI Features',
      'Real-time Processing',
      'Priority Support',
      'Custom Integrations',
      'EQ Mode: Enhanced Emotional Intelligence with Sentiment Analysis',
      'G4 Mode: High-Performance Processing',
      'Mobile Bot Calling: Direct Access via Phone Device'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$5,000',
    period: '/month',
    description: 'Tailored solutions for large organizations',
    icon: Crown,
    features: [
      'All Pro Features',
      'Dedicated Server',
      '24/7 Support',
      'Custom Development',
      'EQ Mode: Advanced Emotional Intelligence with Personalized Empathy Responses',
      'G4 Mode: Optimized AI Performance',
      'Mobile Bot Calling: Seamless Integration for Voice Commands'
    ]
  },
  {
    id: 'ultra-premium',
    name: 'Ultra Premium',
    price: '$15,000',
    period: '/month',
    description: 'Luxury concierge for high-net-worth individuals',
    icon: Gem,
    premium: true,
    features: [
      'All Enterprise Features',
      'UHNWI Lifestyle Concierge',
      'Private Jet Bookings',
      'Yacht Charters',
      'Exclusive Event Access',
      'Personal Wealth Advisor',
      'EQ Mode: Deep Emotional Intelligence for Lifestyle Coaching',
      'G4 Mode: Ultra-Fast Decision Making',
      'Mobile Bot Calling: 24/7 Voice Access to Concierge Bot',
      'Bluetooth Premium Module: Hands-Free Wearable Integration',
      '30-Day Money-Back Guarantee'
    ]
  },
  {
    id: 'elite',
    name: 'Elite',
    price: '$30,000',
    period: '/month',
    description: 'Ultimate luxury and security services',
    icon: Crown,
    elite: true,
    features: [
      'All Ultra Premium Features',
      '24/7 Dedicated Concierge',
      'Global Security Services',
      'Luxury Property Management',
      'High-Profile Networking',
      'Custom AI Lifestyle Coach',
      'Daily High-Profile Activity Planning',
      'EQ Mode: Full Emotional Intelligence Suite for Personalized Interactions',
      'G4 Mode: Quantum-Level Processing Speed',
      'Mobile Bot Calling: Instant Voice Connection to AI Bot on Any Device',
      'Bluetooth Premium Module: Hands-Free Wearable Integration',
      '30-Day Money-Back Guarantee'
    ]
  },
  {
    id: 'vip',
    name: 'VIP Concierge',
    price: 'Custom',
    period: '',
    description: 'Bespoke services for ultra-high-net-worth individuals',
    icon: Crown,
    features: [
      'All Elite Features',
      'Personal Concierge Team',
      'Private Aviation Fleet Access',
      'Luxury Yacht Fleet Management',
      'Exclusive Global Event Access',
      'Personal Security Detail',
      'Custom AI Development',
      'Quantum-Level Processing Priority',
      '24/7 Global Support Network',
      'Legacy Planning & Estate Management'
    ]
  }
];

export default function SubscriptionPage() {
  const [currentPlan, setCurrentPlan] = useState('pro');
  const [billingHistory] = useState([
    { date: '2025-01-15', amount: '$999', status: 'Paid', plan: 'Pro' },
    { date: '2024-12-15', amount: '$999', status: 'Paid', plan: 'Pro' },
    { date: '2024-11-15', amount: '$999', status: 'Paid', plan: 'Pro' },
  ]);

  const handleUpgrade = (planId: string) => {
    // In a real app, this would integrate with payment processor
    alert(`Upgrading to ${planId} plan. This would normally redirect to payment processing.`);
  };

  const currentPlanData = subscriptionPlans.find(plan => plan.id === currentPlan);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Subscription Management</h1>
          <p className="text-slate-400 mt-2">Manage your Veridian concierge subscription</p>
        </div>
        <Badge variant="secondary" className="bg-purple-600 text-white">
          Current Plan: {currentPlanData?.name}
        </Badge>
      </div>

      {/* Current Plan Overview */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Current Subscription
          </CardTitle>
          <CardDescription className="text-slate-400">
            Your active subscription details and benefits
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentPlanData && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white">{currentPlanData.name}</h3>
                <p className="text-2xl font-bold text-purple-400">
                  {currentPlanData.price}
                  <span className="text-sm text-slate-400">{currentPlanData.period}</span>
                </p>
                <p className="text-slate-300">{currentPlanData.description}</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-white">Next Billing</h4>
                <p className="text-slate-300 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  January 15, 2025
                </p>
                <p className="text-slate-300 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  {currentPlanData.price}
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-white">Plan Status</h4>
                <Badge className="bg-green-600 text-white">Active</Badge>
                <p className="text-slate-300 text-sm">Auto-renewal enabled</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Plans */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Available Plans</CardTitle>
          <CardDescription className="text-slate-400">
            Choose the perfect plan for your lifestyle needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subscriptionPlans.map((plan) => (
              <Card
                key={plan.id}
                className={`bg-slate-700 border-slate-600 relative ${
                  plan.popular ? 'ring-2 ring-purple-500' : ''
                } ${plan.premium ? 'ring-2 ring-gold-500' : ''} ${
                  plan.elite ? 'ring-2 ring-yellow-500' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-purple-600 text-white">Most Popular</Badge>
                  </div>
                )}
                {plan.premium && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-yellow-600 text-white">Premium</Badge>
                  </div>
                )}
                {plan.elite && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black">Elite</Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-2">
                    <plan.icon className={`h-8 w-8 ${
                      plan.elite ? 'text-yellow-400' :
                      plan.premium ? 'text-yellow-500' :
                      plan.popular ? 'text-purple-400' : 'text-slate-400'
                    }`} />
                  </div>
                  <CardTitle className="text-white">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold text-white">
                    {plan.price}
                    <span className="text-sm text-slate-400">{plan.period}</span>
                  </div>
                  <CardDescription className="text-slate-400">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-slate-300">
                        <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {plan.id === currentPlan ? (
                    <Button className="w-full bg-green-600 hover:bg-green-700" disabled>
                      Current Plan
                    </Button>
                  ) : plan.id === 'vip' ? (
                    <Button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-semibold">
                      Contact Sales
                    </Button>
                  ) : (
                    <Button
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      onClick={() => handleUpgrade(plan.id)}
                    >
                      {plan.id === 'basic' ? 'Downgrade' : 'Upgrade'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Billing History</CardTitle>
          <CardDescription className="text-slate-400">
            Your recent subscription payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {billingHistory.map((bill, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{bill.plan} Plan</p>
                    <p className="text-slate-400 text-sm">{bill.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">{bill.amount}</p>
                  <Badge className="bg-green-600 text-white">{bill.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* VIP Subscription Note */}
      <Card className="bg-gradient-to-r from-yellow-900 to-yellow-800 border-yellow-600">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Crown className="h-8 w-8 text-yellow-400" />
            <div>
              <h3 className="text-xl font-bold text-white">VIP Concierge Access</h3>
              <p className="text-yellow-200 mt-1">
                For ultra-high-net-worth individuals seeking the ultimate in personalized service,
                contact our elite concierge team for custom subscription arrangements.
              </p>
              <Button className="mt-4 bg-yellow-600 hover:bg-yellow-700 text-black font-semibold">
                Contact Elite Team
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
