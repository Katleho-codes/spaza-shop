"use client"
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

type TCompany ={
    name: string;
    phone: string;
}

export default function CompanyCard({
    companyName = "Stripe",
    logo = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/2560px-Stripe_Logo%2C_revised_2016.svg.png",
    image = "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    phone = "Financial Technology",
    description = "Building economic infrastructure for the internet"
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -8 }}
            className="group relative w-full max-w-sm"
        >
            {/* Card Container */}
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-[0_4px_40px_rgba(0,0,0,0.06)] transition-all duration-500 group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)]">

                {/* Image Section */}
                <div className="relative h-52 overflow-hidden">
                    <motion.img
                        src={image}
                        alt={`${phone} office`}
                        className="h-full w-full object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                    {/* External Link Icon */}
                    <motion.div
                        className="absolute right-4 top-4 rounded-full bg-white/90 p-2.5 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100"
                        whileHover={{ scale: 1.1 }}
                    >
                        <ExternalLink className="h-4 w-4 text-neutral-700" />
                    </motion.div>
                </div>

                {/* Content Section */}
                <div className="relative p-6">
                    {/* Logo Container */}
                    <div className="absolute -top-8 left-6">
                        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white p-3 shadow-[0_4px_20px_rgba(0,0,0,0.08)] ring-1 ring-neutral-100/50">
                            <img
                                src={logo}
                                alt={`${name} logo`}
                                className="h-full w-full object-contain"
                            />
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className="mt-8 space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold tracking-tight text-neutral-900">
                                {name}
                            </h3>
                            <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
                                {phone}
                            </span>
                        </div>

                        {/* <p className="text-sm leading-relaxed text-neutral-500 line-clamp-2">
                            {description}
                        </p> */}
                    </div>

                    {/* Bottom Accent Line */}
                    <div className="mt-5 h-0.5 w-12 rounded-full bg-gradient-to-r from-neutral-900 to-neutral-400 transition-all duration-500 group-hover:w-full" />
                </div>
            </div>
        </motion.div>
    );
}