import { useSession } from "@/lib/auth-client";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
export type TUserOrder = {
    order_id: number;
    order_number: string;
    created_at: string;
    status: string;
    total_amount: number;
    product_name: string;
    product_image: string;
    product_price: number;
    quantity: number;
};

const useGetUserOrder = () => {
    const [userOrdersList, setData] = useState<TUserOrder[]>([]);
    const [userOrdersListLoading, setUserOrdersListLoading] = useState(false);

    const [currentUserOrderPage, setCurrentPage] = useState(1);
    const [totalUserOrderPages, setTotalPages] = useState(1);
    const {
        data: session,
        isPending, //loading state
        error, //error object
        refetch, //refetch the session
    } = useSession();
    const fetchUserOrders = async (page = 1, limit = 10) => {
        try {
            setUserOrdersListLoading(true);

            const { data } = await axios.get(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders/user/${session?.user?.id}?page=${page}&limit=${limit}`,
                {
                    withCredentials: true,
                },
            );

            if (data) {
                console.table(data);
                setData(data);
                setCurrentPage(data.meta.currentPage);
                setTotalPages(data.meta.totalPages);
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.error);
        } finally {
            setUserOrdersListLoading(false);
        }
    };

    useEffect(() => {
        fetchUserOrders(1);
    }, []);

    return {
        userOrdersList,
        userOrdersListLoading,
        currentUserOrderPage,
        totalUserOrderPages,
    };
};

export default useGetUserOrder;
