import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
export type TStores = {
    id: number;
    name: string;
    description: string;
    email: string;
    slug: string;
    phone: string;
    logo: string;
    address_line1: string;
    address_line2: string | null;
    city: string;
    province: string;
    postal_code: string;
};

const useGetStores = () => {
    const [storeList, setData] = useState<TStores[]>([]);
    const [storeListLoading, setStoreListLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchStores = async (page = 1, limit = 10) => {
        try {
            setStoreListLoading(true);

            const { data } = await axios.get(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/stores?page=${page}&limit=${limit}`,
            );

            if (data) {
                setData((prev) =>
                    page === 1 ? data.data : [...prev, ...data.data],
                );
                setCurrentPage(data.meta.currentPage);
                setTotalPages(data.meta.totalPages);
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.error);
        } finally {
            setStoreListLoading(false);
        }
    };

    const resetStores = async () => {
        setData([]); // clear list immediately
        setCurrentPage(1); // reset page
        await fetchStores(1); // refetch first page
    };

    useEffect(() => {
        fetchStores(1);
    }, []);

    return {
        storeList,
        fetchStores,
        resetStores,
        currentPage,
        totalPages,
        storeListLoading,
    };
};



export default useGetStores;
