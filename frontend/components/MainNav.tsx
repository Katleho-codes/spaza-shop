"use client"

import { ShoppingCartIcon, StoreIcon, UserCircleIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from "@/components/ui/sheet";
import { useCartContext } from "@/contexts/CartContext";
import { CartItem } from "@/hooks/carts/useCart";
import { useSession } from "@/lib/auth-client";
import axios from "axios";
import { useRouter } from "next/navigation";
import CartItemCard from "./CartItemCard";

function MainNav() {
    const {
        data: session,
        isPending, //loading state
        error, //error object
        refetch //refetch the session
    } = useSession()
    const [scrolled, setScrolled] = useState(false);
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
    const router = useRouter()
    const createOrder = async () => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders/from-cart`, {}, {
                withCredentials: true
            })
            console.log("create order from cart response", response)
            router.push("/checkout")
        } catch (error) {
            console.error("create order from cart error", error)

        }
    }
    return (
        <>
            {/* sticky wrapper for both */}
            <div className="fixed top-0 left-0 right-0 z-50">
                {/* huawei banner */}
                <div className="w-full bg-[#CF0A2C] py-1.5 px-4 flex items-center justify-center gap-2">
                    <div className="w-3.5 h-3.5 rounded-sm bg-white flex items-center justify-center shrink-0">
                        <span className="text-[#CF0A2C] font-bold" style={{ fontSize: "7px" }}>H</span>
                    </div>
                    <p className="text-xs text-white">
                        Powered by <span className="font-semibold">Huawei Cloud</span> · Object Storage Service (OBS)
                    </p>
                </div>

                {/* nav */}
                <nav className="bg-white border-b">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <Link href={"/"} className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#F86624] to-[#F15025] flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">D</span>
                                </div>
                                <span className="text-xl font-semibold text-[#191919]">Deliva</span>
                            </Link>

                            {/* right side */}
                            <>
                                {isPending ? (
                                    <p>Loading user...</p>
                                ) : session ? (
                                    <div className="flex items-center gap-4">
                                        <Link className="font-medium text-[#191919]" href="/orders">Orders</Link>
                                        <Link href="/account">
                                            <button className="cursor-pointer rounded-full p-2 bg-slate-100 hover:bg-slate-100 transition">
                                                <UserCircleIcon className="w-6 h-6" />
                                            </button>
                                        </Link>
                                        <Link href="/stores/my-stores">
                                            <Button size="icon" className="bg-[#F15025] hover:bg-[#F86624] text-white rounded-full">
                                                <StoreIcon className="w-6 h-6" />
                                            </Button>
                                        </Link>
                                        <button
                                            onClick={() => setSheetOpen(true)}
                                            className="relative cursor-pointer p-2 rounded-full bg-slate-100 hover:bg-slate-100 transition"
                                        >
                                            <ShoppingCartIcon className="w-6 h-6" />
                                            {cartCount > 0 && (
                                                <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-xs font-bold text-white">
                                                    {cartCount}
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                ) : (
                                    <Link href={"/auth/login"}>
                                        <Button className="bg-[#F15025] hover:bg-[#F86624] rounded-sm text-white p-6 cursor-pointer font-medium">
                                            Login/signup
                                        </Button>
                                    </Link>
                                )}
                            </>
                        </div>
                    </div>
                </nav>
            </div>

            {/* spacer — banner (~32px) + nav (64px) */}
            <div className="h-24" />

            {/* offset for fixed header — banner (32px) + nav (64px) */}

            {/* <nav className="fixed top-0 left-0 right-0 z-50 bg-white h-22 mb-2 border">
                <div className="lg:mx-auto lg:container max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <Link href={"/"} className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#F86624] to-[#F15025] flex items-center justify-center">
                                <span className="text-white font-bold text-lg">D</span>
                            </div>
                            <span className="text-xl font-semibold text-[#191919]">Deliva</span>
                        </Link>

                        <>
                            {
                                isPending ? (
                                    <p>Loading user...</p>
                                ) : session ? (
                                    <div className="flex items-center gap-4">
                                        <Link className="font-medium text-[#191919]" href="orders">Orders</Link>
                                        <Link href="/account">
                                            <button className="cursor-pointer rounded-full p-2 bg-slate-100 hover:bg-slate-100 transition">
                                                <UserCircleIcon className="w-6 h-6" />
                                            </button>
                                        </Link>
                                        <Link href="/stores/my-stores">
                                            <Button
                                                size="icon"
                                                    className="bg-[#F15025] hover:bg-[#F86624] text-white rounded-full"
                                            >
                                                <StoreIcon className="w-6 h-6" />
                                            </Button>
                                        </Link>

                                        <button
                                            onClick={() => setSheetOpen(true)}
                                            className="relative cursor-pointer p-2 rounded-full bg-slate-100 hover:bg-slate-100 transition"
                                        >
                                            <ShoppingCartIcon className="w-6 h-6" />

                                            {cartCount > 0 && (
                                                <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-xs font-bold text-white">
                                                    {cartCount}
                                                </span>
                                            )}
                                        </button>
                                    </div>

                                ) : (
                                    <Link href={"/auth/login"}>
                                        <Button className="bg-[#F15025] hover:bg-[#F86624] rounded-sm text-white p-6 cursor-pointer font-medium">
                                            Login/signup
                                        </Button>
                                    </Link>
                                )
                            }
                        </>

                    </div>
                </div>

            </nav> */}

            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetContent className="px-4 flex flex-col h-full">
                    <SheetHeader>
                        <SheetTitle>Your Cart</SheetTitle>
                        <SheetDescription>
                            Items you’ve added to your cart
                        </SheetDescription>
                    </SheetHeader>

                    {/* Scrollable cart items */}
                    <div className="flex-1 overflow-y-auto py-4">
                        {cart?.items.map((item) => (
                            <CartItemCard
                                key={item.product_id}
                                image={item.image}
                                name={item.name}
                                price={item.price}
                                quantity={item.quantity}
                                onQuantityChange={(qty) =>
                                    handleQuantityChange(item, qty)
                                }
                                onRemove={() => removeFromCart(item.product_id)}
                            />
                        ))}
                    </div>

                    {/* Sticky checkout button */}
                    {cart && cart.items.length > 0 && (
                        <div className="sticky bottom-0 bg-white border-t pt-4 pb-2">

                            <Button className="w-full" type="button" onClick={createOrder}>
                                Checkout
                            </Button>
                        </div>
                    )}
                </SheetContent>
            </Sheet>


        </>
    )
}

export default MainNav