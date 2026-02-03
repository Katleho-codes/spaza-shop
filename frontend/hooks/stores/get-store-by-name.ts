import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
type TStores = {
    
};

const useGetStoreByName = (store: string | string[] | any) => {
    const [storeList, setData] = useState<TStores[]>([]);
    const [storeListLoading, setStoreListLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const fetchStores = async (page: number) => {
        if (!store) return;
        try {
            setStoreListLoading(true);
            const { data } = await axios.get(
                `${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/v1/store/${store}`,
                {
                    withCredentials: true,
                },
            );
            if (data) {
                setData(data?.data);
                setCurrentPage(data?.meta.totalPages);
                setTotalPages(data?.meta.currentPage);
            }
            return data;
        } catch (error: any) {
            if (error) toast.error(error?.response?.data?.error);
        } finally {
            setStoreListLoading(false);
        }
    };

    useEffect(() => {
        fetchStores(currentPage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [store, currentPage]);
    return { storeList, fetchStores, storeListLoading, totalPages };
};
export default useGetStoreByName;
