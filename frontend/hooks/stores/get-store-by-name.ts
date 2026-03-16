import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
type TStores = {
    id: number;
    name: string;
    slug: string;
    products: {
        id: number;
        name: string;
        description: string;
        category: string;
        sale_price: number;
        main_image: string;
        slug: string;
    }[];
};

const useGetStoreByName = (
    store: string | string[] | any,
    queryString: string | string[],
) => {
    const [storeData, setData] = useState<TStores | null>(null);
    const [storeListLoading, setStoreListLoading] = useState(true);
    const fetchStore = async () => {
        if (!store) return;
        try {
            setStoreListLoading(true);
            const { data } = await axios.get(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/stores/${store}?${queryString}`,
                {
                    withCredentials: true,
                },
            );
            if (data) {
                console.log(
                    "API response products order:",
                    data.products.map((p: any) => ({
                        name: p.name,
                        price: p.sale_price,
                    })),
                );
                setData(data);
            }
            return data;
        } catch (error: any) {
            console.error(error);
            if (error) toast.error(error?.response?.data?.error);
        } finally {
            setStoreListLoading(false);
        }
    };
    const totalProductsByStore =
        storeData?.products?.reduce((sum, item) => sum + 1, 0) ?? 0;
    useEffect(() => {
        fetchStore();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [store, queryString]);
    return { storeData, storeListLoading, totalProductsByStore };
};
export default useGetStoreByName;
