import { useSession } from "@/lib/auth-client";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import socket from "../socket";
export type TGetUserOrder = {
    order_id: number;
    order_number: string;
    created_at: string;
    status: string;
    total_amount: number;
    items: {
        product_id: number;
        product_name: string;
        product_image: string;
        quantity: number;
        product_price: number;
    }[];
};

export type TCancelOrder = {
    order_id: number;
    status: string;
};

const useGetUserOrder = () => {
    const [userOrdersList, setData] = useState<TGetUserOrder[]>([]);
    const [userOrdersListLoading, setUserOrdersListLoading] = useState(false);
    const [cancelOrderLoading, setCancelOrderLoading] = useState(false);
    const [cancelOrderDialog, setCancelOrderDialog] = useState(false);

    const [currentUserOrderPage, setCurrentPage] = useState(1);
    const [totalUserOrderPages, setTotalPages] = useState(1);
    const {
        data: session,
        isPending, //loading state
        error, //error object
        refetch, //refetch the session
    } = useSession();
    const fetchUserOrders = async (
        page = 1,
        filter = "all",
        from: string | null = null,
        to: string | null = null,
        limit = 10,
    ) => {
        try {
            setUserOrdersListLoading(true);

            const params = new URLSearchParams({
                page: String(page),
                limit: String(limit),
                filter,
                ...(from && { from }),
                ...(to && { to }),
            });
            const { data } = await axios.get(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders/user/${session?.user?.id}?${params}`,
                { withCredentials: true },
            );

            if (data) {
                console.log("get user orders data", data);
                setData(data?.data);
                setCurrentPage(data.meta.currentPage);
                setTotalPages(data.meta.totalPages);
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.error);
        } finally {
            setUserOrdersListLoading(false);
        }
    };

    const cancelOrder = async (order_id: number | string) => {
        setCancelOrderLoading(true);
        const values = {
            status: "canceled",
        };
        try {
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders/cancel/${order_id}`,
                values,
                {
                    withCredentials: true,
                },
            );

            if (response?.data) {
                toast.success(response?.data?.message);
                setCancelOrderDialog(false);
            }
        } catch (error: any) {
            console.error("error canceling order", error);
            toast.error(error?.response.data.message);
        } finally {
            setCancelOrderLoading(false);
            setCancelOrderDialog(false);
        }
    };

    useEffect(() => {
        if (session?.user?.id) {
            fetchUserOrders(1);
        }
    }, [session]);

    // realtime cart updates via socket
    // realtime order updates via socket
    useEffect(() => {
        // update the specific order in the list when status changes
        socket.on("order:updated", (updatedOrder: TGetUserOrder) => {
            setData((prev) =>
                prev.map((order) =>
                    order.order_id === updatedOrder.order_id
                        ? { ...order, status: updatedOrder.status }
                        : order,
                ),
            );
        });

        socket.on("order:canceled", (updatedOrder: TGetUserOrder) => {
            setData((prev) =>
                prev.map((order) =>
                    order.order_id === updatedOrder.order_id
                        ? { ...order, status: "canceled" }
                        : order,
                ),
            );
        });

        return () => {
            socket.off("order:updated");
            socket.off("order:canceled");
        };
    }, []);
    return {
        userOrdersList,
        userOrdersListLoading,
        currentUserOrderPage,
        totalUserOrderPages,
        fetchUserOrders,
    };
};;

export default useGetUserOrder;
