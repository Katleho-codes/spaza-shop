"use client"
import { Button } from '@/components/ui/button';
import { Store, Upload } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function CreateStoreScreen() {
    const [logoPreview, setLogoPreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleLogoChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            // Handle form submission
            console.log('Store data:', data);
            // Add your submission logic here
        } catch (error) {
            console.error('Error creating store:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-b from-neutral-50 to-white py-12 px-4">
            <div className="mx-auto max-w-2xl">
                <Link href="/"><Button className='cursor-pointer'>Back</Button></Link>
                {/* Header */}
                <div className="mb-8 text-center">
                    {/* <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-900">
                        <Store className="h-8 w-8 text-white" />
                    </div> */}
                    <Link href={"/"} className="flex items-center gap-2 text-center justify-center mb-4">
                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">D</span>
                        </div>
                        <span className="text-xl font-semibold text-slate-900">Deliva</span>
                    </Link>
                    <h1 className="text-3xl font-bold text-neutral-900">Create your store</h1>
                    <p className="mt-2 text-neutral-600">Fill in the details to get started</p>
                </div>

                {/* Form */}
                <form className="space-y-6">
                    <div className="rounded-xl bg-white p-8 shadow-sm border border-neutral-200">
                        {/* Store Information */}
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Store Information</h2>
                            <div className="space-y-6">
                                {/* Name */}
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="name"
                                        className="peer w-full rounded-sm border border-neutral-300 px-4 pt-6 pb-2 text-neutral-900 placeholder-transparent focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                                        placeholder="Store name"
                                    />
                                    <label
                                        htmlFor="name"
                                        className="absolute left-4 top-2 text-xs text-neutral-600 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-neutral-900"
                                    >
                                        Store name
                                    </label>
                                </div>

                                {/* Description */}
                                <div className="relative">
                                    <textarea
                                        id="description"
                                        rows={3}
                                        className="peer w-full rounded-lg border border-neutral-300 px-4 pt-6 pb-2 text-neutral-900 placeholder-transparent focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 resize-none"
                                        placeholder="Description"
                                    />
                                    <label
                                        htmlFor="description"
                                        className="absolute left-4 top-2 text-xs text-neutral-600 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-neutral-900"
                                    >
                                        Description
                                    </label>
                                </div>

                                {/* Logo Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                                        Store Logo
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="file"
                                            id="logo"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleLogoChange}
                                        />
                                        <label
                                            htmlFor="logo"
                                            className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed border-neutral-300 px-4 py-3 text-sm text-neutral-600 transition-colors hover:border-neutral-400 hover:bg-neutral-50"
                                        >
                                            <Upload className="h-4 w-4" />
                                            Choose file
                                        </label>
                                        {logoPreview && (
                                            <div className="h-16 w-16 overflow-hidden rounded-lg border border-neutral-200">
                                                <img src={logoPreview} alt="Logo preview" className="h-full w-full object-contain" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Contact Information</h2>
                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Email */}
                                <div className="relative">
                                    <input
                                        type="email"
                                        id="email"
                                        className="peer w-full rounded-lg border border-neutral-300 px-4 pt-6 pb-2 text-neutral-900 placeholder-transparent focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                                        placeholder="Email"
                                    />
                                    <label
                                        htmlFor="email"
                                        className="absolute left-4 top-2 text-xs text-neutral-600 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-neutral-900"
                                    >
                                        Email
                                    </label>
                                </div>

                                {/* Phone */}
                                <div className="relative">
                                    <input
                                        type="tel"
                                        id="phone"
                                        className="peer w-full rounded-lg border border-neutral-300 px-4 pt-6 pb-2 text-neutral-900 placeholder-transparent focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                                        placeholder="Phone"
                                    />
                                    <label
                                        htmlFor="phone"
                                        className="absolute left-4 top-2 text-xs text-neutral-600 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-neutral-900"
                                    >
                                        Phone
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Address */}
                        <div>
                            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Address</h2>
                            <div className="space-y-6">
                                {/* Address Line 1 */}
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="address_line1"
                                        className="peer w-full rounded-lg border border-neutral-300 px-4 pt-6 pb-2 text-neutral-900 placeholder-transparent focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                                        placeholder="Address line 1"
                                    />
                                    <label
                                        htmlFor="address_line1"
                                        className="absolute left-4 top-2 text-xs text-neutral-600 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-neutral-900"
                                    >
                                        Address line 1
                                    </label>
                                </div>

                                {/* Address Line 2 */}
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="address_line2"
                                        className="peer w-full rounded-lg border border-neutral-300 px-4 pt-6 pb-2 text-neutral-900 placeholder-transparent focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                                        placeholder="Address line 2"
                                    />
                                    <label
                                        htmlFor="address_line2"
                                        className="absolute left-4 top-2 text-xs text-neutral-600 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-neutral-900"
                                    >
                                        Address line 2 (optional)
                                    </label>
                                </div>

                                {/* City, Province */}
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            id="city"
                                            className="peer w-full rounded-lg border border-neutral-300 px-4 pt-6 pb-2 text-neutral-900 placeholder-transparent focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                                            placeholder="City"
                                        />
                                        <label
                                            htmlFor="city"
                                            className="absolute left-4 top-2 text-xs text-neutral-600 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-neutral-900"
                                        >
                                            City
                                        </label>
                                    </div>

                                    <div className="relative">
                                        <select
                                            id="province"
                                            className="peer w-full rounded-lg border border-neutral-300 px-4 pt-6 pb-2 text-neutral-900 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 appearance-none bg-white"
                                        >
                                            <option value="">Select province</option>
                                            <option value="Eastern Cape">Eastern Cape</option>
                                            <option value="Free State">Free State</option>
                                            <option value="Gauteng">Gauteng</option>
                                            <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                                            <option value="Limpopo">Limpopo</option>
                                            <option value="Mpumalanga">Mpumalanga</option>
                                            <option value="Northern Cape">Northern Cape</option>
                                            <option value="North West">North West</option>
                                            <option value="Western Cape">Western Cape</option>
                                        </select>
                                        <label
                                            htmlFor="province"
                                            className="absolute left-4 top-2 text-xs text-neutral-600 peer-focus:text-neutral-900"
                                        >
                                            Province
                                        </label>
                                    </div>
                                </div>

                                {/* Postal Code, Country */}
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            id="postal_code"
                                            className="peer w-full rounded-lg border border-neutral-300 px-4 pt-6 pb-2 text-neutral-900 placeholder-transparent focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                                            placeholder="Postal code"
                                        />
                                        <label
                                            htmlFor="postal_code"
                                            className="absolute left-4 top-2 text-xs text-neutral-600 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-neutral-900"
                                        >
                                            Postal code
                                        </label>
                                    </div>

                                    <div className="relative">
                                        <input
                                            type="text"
                                            id="country"
                                            className="peer w-full rounded-lg border border-neutral-300 px-4 pt-6 pb-2 text-neutral-900 placeholder-transparent focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                                            placeholder="Country"
                                        />
                                        <label
                                            htmlFor="country"
                                            className="absolute left-4 top-2 text-xs text-neutral-600 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-neutral-900"
                                        >
                                            Country
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-neutral-900 py-6 text-base font-semibold hover:bg-neutral-800"
                    >
                        {isSubmitting ? 'Creating Store...' : 'Create Store'}
                    </Button>
                </form>
            </div>
        </div>
    );
}