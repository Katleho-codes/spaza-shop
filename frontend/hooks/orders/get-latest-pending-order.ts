import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
export type TLatestPendingOrder = {
    order_id: number;
    order_number: string;
    status: string;
    delivery_fee: number;
    sub_total: number;
    total_amount: number;
    items: {
        product_id: number;
        name: string;
        quantity: number;
        price: number;
    }[];
};

const useGetLatestPendingOrder = () => {
    const [latestPendingOrderList, setData] =
        useState<TLatestPendingOrder | null>(null);
    const [latestPendingOrderListLoading, setLatestOrderPendingListLoading] =
        useState(false);

    const [order_number, setOrderNumber] = useState("");
    const [order_id, setOrderId] = useState(0);
    const [total_amount, setTotalAmount] = useState(0);
    const [sub_total, setSubTotal] = useState(0);
    const [delivery_fee, setDeliveryFee] = useState(0);
    const [status, setStatus] = useState("");

    const fetchLatestPendingOrder = async () => {
        try {
            setLatestOrderPendingListLoading(true);

            const { data } = await axios.get(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders/latest-pending`,
                {
                    withCredentials: true,
                },
            );

            if (data) {
                console.table(data);
                setData(data);
                setOrderId(data?.order_id);
                setOrderNumber(data?.order_number);
                setTotalAmount(data?.total_amount);
                setSubTotal(data?.sub_total);
                setDeliveryFee(data?.delivery_fee);
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.error);
        } finally {
            setLatestOrderPendingListLoading(false);
        }
    };

    useEffect(() => {
        fetchLatestPendingOrder();
    }, []);

    // const orderTotalAmountCount =
    //     latestPendingOrderList?.items?.reduce(
    //         (sum, item) => sum + Number(item.price) * item.quantity,
    //         0,
    //     ) ?? 0;

    // store cents
    // const orderTotalAmountCount =
    //     (latestPendingOrderList?.items?.reduce(
    //         (sum, item) =>
    //             sum + Math.round(Number(item.price) * 100) * item.quantity,
    //         0,
    //     ) ?? 0) / 100;

    const itemsCount = latestPendingOrderList?.items?.length ?? 0;
    return {
        latestPendingOrderList,
        latestPendingOrderListLoading,
        order_number,
        order_id,
        sub_total,
        total_amount,
        delivery_fee,
        itemsCount,
    };
};

export default useGetLatestPendingOrder;
