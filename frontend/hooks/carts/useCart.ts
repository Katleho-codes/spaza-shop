"use client";

export interface CartItem {
    product_id: number;
    name: string;
    price: number;
    image: string;
    slug: string;
    quantity: number;
}
export interface IGetCart {
    cart_id: number;
    status: string;
    items: {
        product_id: number;
        name: string;
        slug: string;
        price: number;
        quantity: number;
        image: string;
    }[];
}
import { useSession } from "@/lib/auth-client";
import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import socket from "../socket";

const useCart = () => {
    // const [cart, setCart] = useState<IGetCart[]>([]);
    const [cart, setCart] = useState<IGetCart | null>(null);

    const [isCartLoading, setIsCartLoading] = useState(false);

    const {
        data: session,
        isPending, //loading state
        error, //error object
        refetch, //refetch the session
    } = useSession();
    // Load cart from localStorage on component mount (client-side)
    // if does not exist, it will pull from backend (redis first) then db if nothing on redis
    const fetchUserCart = async () => {
        if (!session) return;
        try {
            setIsCartLoading(true);
            const { data } = await axios.get(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/carts`,
                {
                    withCredentials: true,
                },
            );

            if (data) {
                // console.log("user cart", data);
                setCart(data);
            }
        } catch (error: any) {
            console.error("useCart.js fetch user Cart error", error);
            if (axios.isAxiosError(error) && error.response?.status !== 401) {
                console.error("useCart.js fetch user Cart error", error);
            }
            toast.error(error?.response?.data?.error);
        } finally {
            setIsCartLoading(false);
        }
    };

    useEffect(() => {
        fetchUserCart();
    }, [session?.user?.id]);

    // realtime cart updates via socket
    useEffect(() => {
        socket.on("cart:updated", (updatedCart: IGetCart) => {
            setCart(updatedCart);
        });

        return () => {
            socket.off("cart:updated");
        };
    }, []);

    // this will handle both add and update since we only update the quantity
    const addToCart = async (item: CartItem) => {
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/carts`,
                item,
                {
                    withCredentials: true,
                },
            );
            if (response.status === 201) {
                toast.success(`${response?.data?.message}`);
            }
        } catch (error: any) {
            console.error("addToCart error", error?.response?.data?.message); // shows actual backend error
            toast.error(
                error?.response?.data?.message ?? "Could not add to cart",
            );
        }
    };

    const removeFromCart = async (productId: number) => {
        // optimistically update UI first
        setCart((prevCart) => {
            if (!prevCart) return prevCart;
            return {
                ...prevCart,
                items: prevCart.items.filter(
                    (item) => item.product_id !== productId,
                ),
            };
        });

        try {
            await axios.delete(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/carts/item/${productId}`,
                { withCredentials: true },
            );
        } catch (error: any) {
            // revert on failure by refetching
            fetchUserCart();
            toast.error(
                error?.response?.data?.message ?? "Could not remove item",
            );
        }
    };

    const clearCart = () => {
        setCart((prev) => (prev ? { ...prev, items: [] } : prev));
    };

    const cartCount =
        cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

    // const cartCount = cart?.reduce(
    //     (sum, cart) =>
    //         sum +
    //         cart.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
    //     0,
    // );

    return {
        cart,
        addToCart,
        isCartLoading,
        removeFromCart,
        clearCart,
        cartCount,
    };
};

export default useCart;
