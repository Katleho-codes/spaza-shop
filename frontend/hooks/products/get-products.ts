import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
export type TProducts = {
    category: string;
    products: {
        id: number;
        name: string;
        sale_price: number;
        main_image: string;
        slug: string;
    }[];
};

const useGetProducts = () => {
    const [productList, setData] = useState<TProducts[]>([]);
    const [productListLoading, setStoreListLoading] = useState(false);
    const [currentProductPage, setCurrentPage] = useState(1);
    const [totalProductPages, setTotalPages] = useState(1);

    const fetchProducts = async (page = 1, limit = 10) => {
        try {
            setStoreListLoading(true);

            const { data } = await axios.get(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/products?page=${page}&limit=${limit}`,
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

    const resetProducts = async () => {
        setData([]); // clear list immediately
        setCurrentPage(1); // reset page
        await fetchProducts(1); // refetch first page
    };

    useEffect(() => {
        fetchProducts(1);
    }, []);

    return {
        productList,
        fetchProducts,
        resetProducts,
        currentProductPage,
        totalProductPages,
        productListLoading,
    };
};

export default useGetProducts;
