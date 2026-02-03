"use client"
import React, { useState } from 'react';
import {
    Layers,
    Users,
    Globe,
    ShieldCheck,
    Zap,
    LayoutGrid,
    ChevronRight,
    Menu,
    X,
    Check,
    Terminal,
    Server
} from 'lucide-react';

// --- UI Components (Shadcn-inspired) ---
const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    const variants = {
        primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm',
        outline: 'border border-zinc-200 bg-transparent hover:bg-zinc-50 text-zinc-900',
        ghost: 'hover:bg-zinc-100 text-zinc-600',
    };
    return (
        <button className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${variants[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
};

const Card = ({ children, className = '' }) => (
    <div className={`bg-white border border-zinc-100 rounded-xl p-6 shadow-sm hover:shadow-lg hover:border-indigo-100 transition-all ${className}`}>
        {children}
    </div>
);

const Badge = ({ children }) => (
    <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider">
        {children}
    </span>
);

// --- Sections ---

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-zinc-100">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-2xl tracking-tighter text-indigo-600">
                    <Layers className="fill-indigo-600/20" /> Deliva
                </div>
                <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                    <a href="#features" className="text-zinc-500 hover:text-indigo-600">Platform</a>
                    <a href="#tenants" className="text-zinc-500 hover:text-indigo-600">Tenants</a>
                    <a href="#developers" className="text-zinc-500 hover:text-indigo-600">Docs</a>
                    <Button variant="outline">Log In</Button>
                    <Button>Create Network</Button>
                </div>
                <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X /> : <Menu />}</button>
            </div>
        </nav>
    );
};

const Hero = () => (
    <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-8">
            <Badge>Multi-Tenant Logistics Infrastructure</Badge>
            <h1 className="text-6xl md:text-7xl font-black text-zinc-900 tracking-tight leading-[1.1]">
                One Platform. <br />
                <span className="text-indigo-600">Infinite Organizations.</span>
            </h1>
            <p className="text-xl text-zinc-600 max-w-2xl mx-auto leading-relaxed">
                Deliva provides the multi-tenant backbone for your delivery business.
                Onboard vendors, isolate data, and scale to thousands of sub-organizations with a single API.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button className="px-10 py-7 text-lg rounded-2xl">Deploy Your Instance <ChevronRight /></Button>
                <Button variant="outline" className="px-10 py-7 text-lg rounded-2xl">Talk to Sales</Button>
            </div>
        </div>
    </section>
);

const MultiTenantFeatures = () => (
    <section id="features" className="py-24 bg-zinc-50 px-6">
        <div className="max-w-7xl mx-auto">
            <div className="mb-16">
                <h2 className="text-3xl font-bold tracking-tight">Enterprise Multi-Tenancy</h2>
                <p className="text-zinc-500 mt-2">Engineered for security and massive scale.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
                {[
                    { icon: <ShieldCheck className="text-indigo-600" />, title: "Data Isolation", desc: "Each tenant’s customers, drivers, and orders are logically siloed at the database level." },
                    { icon: <Globe className="text-indigo-600" />, title: "Custom Domains", desc: "Allow tenants to point their own subdomains (e.g., delivery.tenant-brand.com) to your instance." },
                    { icon: <Users className="text-indigo-600" />, title: "Org Management", desc: "A master admin dashboard to manage tenant subscriptions, usage limits, and global settings." },
                    { icon: <LayoutGrid className="text-indigo-600" />, title: "White Labeling", desc: "Tenants can customize themes, logos, and notifications to match their own branding." },
                    { icon: <Server className="text-indigo-600" />, title: "Tenant APIs", desc: "Provision unique API keys for every organization on your platform with scoped permissions." },
                    { icon: <Zap className="text-indigo-600" />, title: "Shared Resources", desc: "Optimize costs by sharing a courier pool across multiple tenants in a specific region." }
                ].map((f, i) => (
                    <Card key={i}>
                        <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mb-4">{f.icon}</div>
                        <h3 className="font-bold text-xl mb-2">{f.title}</h3>
                        <p className="text-zinc-600 text-sm leading-relaxed">{f.desc}</p>
                    </Card>
                ))}
            </div>
        </div>
    </section>
);

const DeveloperPage = () => (
    <section id="developers" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <div className="bg-zinc-900 rounded-3xl p-8 shadow-2xl relative">
                <div className="flex gap-2 mb-6">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                </div>
                <pre className="text-sm font-mono text-indigo-300 overflow-x-auto">
                    {`// Initialize for a specific tenant
const client = new Deliva('PLATFORM_SECRET');

const tenant = await client.tenants.create({
  name: "City Express Logistics",
  branding: { primary: "#4f46e5" }
});

// Create order for that tenant
await client.orders.create({
  tenant_id: tenant.id,
  pickup: "Warehouse A",
  dropoff: "Client Site B"
});`}
                </pre>
            </div>
            <div className="space-y-6">
                <h2 className="text-4xl font-bold tracking-tight">Built for Developers, <br />By Developers</h2>
                <p className="text-zinc-600 text-lg leading-relaxed">
                    Our SDK allows you to programmatically spawn new organizations, manage their permissions, and monitor their delivery traffic.
                </p>
                <ul className="space-y-4">
                    {['GraphQL & REST Support', 'Per-tenant Webhooks', 'Stripe Connect Integration'].map(item => (
                        <li key={item} className="flex items-center gap-3 font-medium">
                            <div className="bg-emerald-100 p-1 rounded-full"><Check size={14} className="text-emerald-600" /></div>
                            {item}
                        </li>
                    ))}
                </ul>
                <Button className="px-8 py-4">Read Documentation <Terminal size={18} /></Button>
            </div>
        </div>
    </section>
);

const MultiTenantPricing = () => (
    <section id="pricing" className="py-24 bg-zinc-900 text-white px-6">
        <div className="max-w-7xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold">Scaling that makes sense</h2>
            <p className="text-zinc-400 mt-4">Platform fees plus usage-based scaling per tenant.</p>
        </div>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            <Card className="bg-zinc-800 border-zinc-700 text-left p-10">
                <h3 className="text-xl font-bold mb-4">Launch</h3>
                <div className="text-5xl font-black mb-6">$199<span className="text-xl text-zinc-500">/mo</span></div>
                <ul className="space-y-4 text-zinc-400 mb-8">
                    <li>• Up to 10 Tenants</li>
                    <li>• 5,000 Orders total</li>
                    <li>• Shared Infrastructure</li>
                    <li>• Basic Custom Branding</li>
                </ul>
                <Button className="w-full py-4 bg-white text-black hover:bg-zinc-200">Get Started</Button>
            </Card>
            <Card className="bg-indigo-600 border-none text-left p-10 shadow-indigo-500/20 shadow-2xl">
                <h3 className="text-xl font-bold mb-4 text-white">Scale</h3>
                <div className="text-5xl font-black mb-6 text-white">$599<span className="text-xl text-indigo-200">/mo</span></div>
                <ul className="space-y-4 text-indigo-100 mb-8">
                    <li>• Unlimited Tenants</li>
                    <li>• 50,000 Orders total</li>
                    <li>• Isolated Database Instance</li>
                    <li>• Full White-Labeling & Domains</li>
                </ul>
                <Button className="w-full py-4 bg-zinc-900 text-white border-none">Contact Sales</Button>
            </Card>
        </div>
    </section>
);

export default function Page() {
    return (
        <div className="min-h-screen bg-white font-sans text-zinc-900 antialiased selection:bg-indigo-500 selection:text-white">
            <Navbar />
            <Hero />
            <MultiTenantFeatures />
            <DeveloperPage />
            <MultiTenantPricing />
            <footer className="py-12 border-t border-zinc-100 text-center text-zinc-400 text-sm">
                © 2026 Deliva Infrastructure Inc.
            </footer>
        </div>
    );
}