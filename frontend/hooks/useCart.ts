"use client";

export interface CartItem {
    id: number;
    name: string;
    sale_price: number;
    main_image: string;
    slug: string;
    quantity: number;
}

import { useState, useEffect } from "react";

const useCart = () => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isClient, setIsClient] = useState(false);

    // Load cart from localStorage on component mount (client-side)
    useEffect(() => {
        setIsClient(true);
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
            try {
                setCart(JSON.parse(storedCart));
            } catch (error) {
                console.error(
                    "Error parsing cart data from localStorage:",
                    error,
                );
            }
        }
    }, []); // Empty dependency array ensures this runs once on mount

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (isClient) {
            localStorage.setItem("cart", JSON.stringify(cart));
        }
    }, [cart, isClient]); // Run whenever `cart` or `isClient` changes

    const addToCart = (item: CartItem) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((i) => i.id === item.id);
            if (existingItem) {
                // Update quantity if item already exists
                return prevCart.map((i) =>
                    i.id === item.id
                        ? { ...i, quantity: item.quantity }
                        : i,
                );

    
            }
            // Add new item if it doesn't exist
            return [...prevCart, item];
        });
    };

    const removeFromCart = (itemId: number) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
    };

    const clearCart = () => {
        setCart([]);
    };
const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return { cart, addToCart, removeFromCart, clearCart, cartCount };
};

export default useCart;
