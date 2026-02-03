"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
    Code2,
    Terminal,
    Boxes,
    BookOpen,
    ArrowRight,
    Copy,
    Check,
    Zap,
    Globe,
    Shield,
    Webhook
} from 'lucide-react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';



const codeExamples = {
    javascript: `import Deliva from '@deliva/sdk';

const client = new Deliva('your_api_key');

// Create a food delivery order
const order = await client.orders.create({
  customer: {
    name: 'Sarah Miller',
    phone: '+1234567890',
    address: '456 Oak Street, Apt 3B'
  },
  restaurant_id: 'rest_abc123',
  items: [
    { name: 'Margherita Pizza', quantity: 2 },
    { name: 'Caesar Salad', quantity: 1 }
  ],
  special_instructions: 'Ring doorbell'
});

// Get branded tracking link for customer
const trackingUrl = order.customer_tracking_url;
await client.notifications.sendSMS({
  to: '+1234567890',
  message: \`Your order is on the way! Track it: \${trackingUrl}\`
});`,
    python: `from deliva import Deliva

client = Deliva(api_key='your_api_key')

# Create a food delivery order
order = client.orders.create(
    customer={
        'name': 'Sarah Miller',
        'phone': '+1234567890',
        'address': '456 Oak Street, Apt 3B'
    },
    restaurant_id='rest_abc123',
    items=[
        {'name': 'Margherita Pizza', 'quantity': 2},
        {'name': 'Caesar Salad', 'quantity': 1}
    ],
    special_instructions='Ring doorbell'
)

# Send tracking link to customer
tracking_url = order.customer_tracking_url
client.notifications.send_sms(
    to='+1234567890',
    message=f'Your order is on the way! Track it: {tracking_url}'
)`,
    curl: `curl -X POST https://api.deliva.io/v1/orders \\
  -H "Authorization: Bearer your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "customer": {
      "name": "Sarah Miller",
      "phone": "+1234567890",
      "address": "456 Oak Street, Apt 3B"
    },
    "restaurant_id": "rest_abc123",
    "items": [
      {"name": "Margherita Pizza", "quantity": 2},
      {"name": "Caesar Salad", "quantity": 1}
    ],
    "special_instructions": "Ring doorbell"
  }'`
};

const features = [
    {
        icon: Zap,
        title: 'RESTful API',
        description: 'Simple REST API for creating orders and generating customer tracking links.'
    },
    {
        icon: Webhook,
        title: 'Webhooks',
        description: 'Real-time notifications for order status changes and delivery updates.'
    },
    {
        icon: Globe,
        title: 'Tracking URLs',
        description: 'Branded tracking pages for each restaurant with custom domains supported.'
    },
    {
        icon: Shield,
        title: 'Multi-tenant',
        description: 'Isolated data per restaurant with secure API key authentication.'
    }
];

const sdks = [
    { name: 'JavaScript', version: 'v3.2.1', color: 'bg-yellow-500' },
    { name: 'Python', version: 'v2.8.0', color: 'bg-blue-500' },
    { name: 'Ruby', version: 'v1.5.2', color: 'bg-red-500' },
    { name: 'Go', version: 'v1.3.0', color: 'bg-cyan-500' },
    { name: 'PHP', version: 'v2.1.0', color: 'bg-indigo-500' },
    { name: 'Java', version: 'v1.9.1', color: 'bg-orange-500' },
];


export default function DeveloperScreen() {
    const [copied, setCopied] = useState(false);
    const [selectedLang, setSelectedLang] = useState('javascript');

    const copyCode = () => {
        navigator.clipboard.writeText(codeExamples[selectedLang]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero */}
            <section className="pt-32 pb-20 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="inline-flex items-center gap-2 text-sm font-medium text-indigo-400 mb-4"
                            >
                                <Code2 className="w-4 h-4" />
                                DEVELOPERS
                            </motion.span>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-4xl lg:text-6xl font-bold tracking-tight"
                            >
                                Build with{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
                                    Deliva
                                </span>
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="mt-6 text-xl text-slate-300 leading-relaxed"
                            >
                                Integrate food delivery and customer tracking into your restaurant platform.
                                Comprehensive docs, SDKs, and a powerful API built for restaurants.
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="mt-10 flex flex-wrap gap-4"
                            >
                                <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 rounded-full px-8 h-14">
                                    <BookOpen className="mr-2 w-5 h-5" />
                                    Read the docs
                                </Button>
                                <Button size="lg" variant="outline" className="border-slate-600 text-white hover:bg-slate-800 rounded-full px-8 h-14">
                                    <Terminal className="mr-2 w-5 h-5" />
                                    API Reference
                                </Button>
                            </motion.div>
                        </div>

                        {/* Code Preview */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-violet-500/20 rounded-3xl blur-2xl" />
                            <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 overflow-hidden">
                                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
                                    <Tabs value={selectedLang} onValueChange={setSelectedLang}>
                                        <TabsList className="bg-slate-700/50">
                                            <TabsTrigger value="javascript" className="text-xs">JavaScript</TabsTrigger>
                                            <TabsTrigger value="python" className="text-xs">Python</TabsTrigger>
                                            <TabsTrigger value="curl" className="text-xs">cURL</TabsTrigger>
                                        </TabsList>
                                    </Tabs>
                                    <button
                                        onClick={copyCode}
                                        className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                                    >
                                        {copied ? (
                                            <Check className="w-4 h-4 text-emerald-400" />
                                        ) : (
                                            <Copy className="w-4 h-4 text-slate-400" />
                                        )}
                                    </button>
                                </div>
                                <pre className="p-6 text-sm text-slate-300 overflow-x-auto">
                                    <code>{codeExamples[selectedLang]}</code>
                                </pre>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">
                            Developer-first infrastructure
                        </h2>
                        <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                            Built by developers, for developers. Every API design decision prioritizes
                            simplicity and ease of use.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center mx-auto mb-4">
                                    <feature.icon className="w-7 h-7 text-indigo-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                                <p className="text-slate-600">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SDKs */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 mb-4">
                                <Boxes className="w-4 h-4" />
                                OFFICIAL SDKS
                            </span>
                            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">
                                Integrate in minutes with our SDKs
                            </h2>
                            <p className="mt-4 text-lg text-slate-600">
                                Official libraries for popular languages. Create orders, generate tracking links,
                                and manage deliveries with just a few lines of code.
                            </p>
                            <Button className="mt-8 rounded-full" variant="outline">
                                View all SDKs
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {sdks.map((sdk, index) => (
                                <motion.div
                                    key={sdk.name}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all cursor-pointer"
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className={`w-3 h-3 rounded-full ${sdk.color}`} />
                                        <span className="font-semibold text-slate-900">{sdk.name}</span>
                                    </div>
                                    <span className="text-sm text-slate-500">{sdk.version}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Links */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'Quick Start Guide',
                                description: 'Get up and running in 5 minutes with our step-by-step guide.',
                                icon: Zap,
                                link: '#'
                            },
                            {
                                title: 'API Reference',
                                description: 'Complete documentation for every endpoint, parameter, and response.',
                                icon: BookOpen,
                                link: '#'
                            },
                            {
                                title: 'Example Projects',
                                description: 'Explore full-featured example apps built with Deliva.',
                                icon: Code2,
                                link: '#'
                            }
                        ].map((item, index) => (
                            <motion.a
                                key={item.title}
                                href={item.link}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group block bg-slate-50 hover:bg-white rounded-2xl p-8 border border-slate-100 hover:border-slate-200 hover:shadow-xl transition-all"
                            >
                                <div className="w-12 h-12 rounded-xl bg-indigo-100 group-hover:bg-indigo-500 flex items-center justify-center mb-6 transition-colors">
                                    <item.icon className="w-6 h-6 text-indigo-600 group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="text-xl font-semibold text-slate-900 mb-2 flex items-center gap-2">
                                    {item.title}
                                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                </h3>
                                <p className="text-slate-600">{item.description}</p>
                            </motion.a>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
