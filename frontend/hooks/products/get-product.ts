import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
export type TProduct = {
    id: number;
    created_at: string;
    name: string;
    description: string;
    sku: string;
    price: number;
    main_image: string;
    category: string;
    slug: string;
    brand: string | null;
    stock_quantity: number;
    discount?: null | string;
    store_name: string;
    store_slug: string;
    image_two?: string;
};

const useGetProduct = (slug?: string) => {
    const [product, setData] = useState<TProduct | null>(null);
    const [productLoading, setProductLoading] = useState(false);

    const fetchProduct = async () => {
        if (!slug) return;
        try {
            setProductLoading(true);

            const { data } = await axios.get(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/products/${slug}`,
            );

            if (data) {
                setData(data);
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.error);
        } finally {
            setProductLoading(false);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [slug]);

    return {
        product,
        productLoading,
    };
};

export default useGetProduct;
