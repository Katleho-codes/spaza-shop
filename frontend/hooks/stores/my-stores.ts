import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import socket from "../socket";
export type TMyStores = {
    id: number;
    name: string;
    description: string;
    slug: string;
    banner_url: string | null;
};

const useGetMyStores = () => {
    const [myStoresList, setData] = useState<TMyStores[]>([]);
    const [myStoresListLoading, setMyStoresListLoading] = useState(false);

    const fetchMyStores = async () => {
        try {
            setMyStoresListLoading(true);

            const { data } = await axios.get(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/stores/my-stores`,
                {
                    withCredentials: true,
                },
            );

            if (data) {
                setData(data);
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.error.message);
        } finally {
            setMyStoresListLoading(false);
        }
    };

    useEffect(() => {
        fetchMyStores();
    }, []);
    // realtime products updates via socket
    useEffect(() => {
        socket.on("store:created", (addedStore: TMyStores) => {
            setData((prev) => [addedStore, ...prev]); // prepend to top of list
        });

        return () => {
            socket.off("store:created");
        };
    }, []);

    return {
        myStoresList,
        myStoresListLoading,
    };
};

export default useGetMyStores;
