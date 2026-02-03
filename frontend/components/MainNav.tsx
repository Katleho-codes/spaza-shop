"use client"

import { X, Menu, ShoppingCartIcon, CircleUserRoundIcon, UserCircleIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import useCart, { CartItem } from "@/hooks/useCart";
import CartItemCard from "./CartItemCard";
import { useCartContext } from "@/contexts/CartContext";

function MainNav() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [sheetOpen, setSheetOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const { cart, addToCart, removeFromCart, cartCount } = useCartContext();

    const handleQuantityChange = (item: CartItem, newQuantity: number) => {
        addToCart({
            ...item,
            quantity: newQuantity,
        });
    };

    return (
        <>

            <nav className="fixed top-0 left-0 right-0 z-50 bg-white">
                <div className="lg:mx-auto lg:container max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <Link href={"/"} className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                                <span className="text-white font-bold text-lg">D</span>
                            </div>
                            <span className="text-xl font-semibold text-slate-900">Deliva</span>
                        </Link>

                        {/* Desktop Nav */}
                        {/* <div className="hidden md:flex items-center gap-8">

                            <Link
                                href={"/"}
                                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                            >
                                Link 1
                            </Link>
                            <Link
                                href={"/"}
                                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                            >
                                Link 2
                            </Link>

                        </div> */}

                        <div className="hidden md:flex items-center gap-4">
                            <button className="cursor-pointer">
                                <UserCircleIcon className="w-6 h-6" />
                            </button>
                            <Link href={"/create-store"}>
                                <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-6 cursor-pointer">
                                    Create store
                                </Button>
                            </Link>
                            <button
                                onClick={() => setSheetOpen(true)}
                                className="relative cursor-pointer p-2 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                                <ShoppingCartIcon className="w-6 h-6" />

                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-xs font-bold text-white">
                                        {cartCount}
                                    </span>
                                )}
                            </button>

                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>



                {mobileOpen && (
                    <div
                        className="md:hidden bg-white border-t"
                    >
                        <div className="px-6 py-4 space-y-4">
                            {/* {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="block text-lg font-medium text-slate-600 hover:text-slate-900"
                            >
                                {link.name}
                            </Link>
                        ))} */}
                            <div className="pt-4 border-t space-y-3">
                                <Button variant="outline" className="w-full cursor-pointer">Log in</Button>
                                {/* <Link href={createPageUrl('Product')}>
                                <Button className="w-full bg-slate-900">Get Started</Button>
                            </Link> */}
                            </div>
                        </div>
                    </div>
                )}

            </nav>
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetContent className="px-4">
                    <SheetHeader>
                        <SheetTitle>Your Cart</SheetTitle>
                        <SheetDescription>
                            Items you’ve added to your cart
                        </SheetDescription>
                    </SheetHeader>


                    <div className="min-h-80 overflow-y-auto">
                        {cart.map((item) => (
                            // <li key={item.id}>
                            //     {item.name} - Quantity: {item.quantity} - Price: ${item.sale_price * item.quantity}
                            //     <button onClick={() => removeFromCart(item.id)}>Remove</button>
                            // </li>
                            <CartItemCard
                                key={item.id}
                                image={item.main_image}
                                name={item.name}
                                price={item.sale_price}
                                quantity={item.quantity}
                                onQuantityChange={(qty) =>
                                    handleQuantityChange(item, qty)
                                }
                                onRemove={() => removeFromCart(item.id)}
                            />
                        ))}
                    </div>
                        <Button className="block w-full my-2">Checkout</Button>
                </SheetContent>
            </Sheet>

        </>
    )
}

export default MainNav