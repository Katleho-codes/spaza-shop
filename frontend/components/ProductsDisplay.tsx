"use client"
import useGetProducts, { TProducts } from '@/hooks/products/get-products'
import { Button } from './ui/button'
import { formatCurrency } from '@/lib/utils'
import { ShoppingBasketIcon } from 'lucide-react'
import { useSession } from '@/lib/auth-client'

type TProductDataToSendToBackend = {
    product_id: number;
    name: string;
    sale_price: number;
    main_image: string;
    slug: string;
}
type THandleAddToCart = {
    handleAddToCart: (data: TProductDataToSendToBackend) => void;
}
export default function ProductsDisplay({ handleAddToCart }: THandleAddToCart) {

    const {
        productList,
        fetchProducts,
        resetProducts,
        currentProductPage,
        totalProductPages,
        productListLoading,
    } = useGetProducts()

    const {
        data: session,
        isPending, //loading state
        error, //error object
        refetch //refetch the session
    } = useSession()


    return (
        <>
            <div className="space-y-8">
                {productList?.map((group, idx) => (
                    <section key={`${group.category}-${idx}`}>
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">
                            {group.category}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {group.products.map((product) => (
                                <div
                                    key={product.product_id}
                                    className="group overflow-hidden rounded-xl bg-white border border-sm border-[#eee]"
                                >
                                    <div className="relative h-64 w-full overflow-hidden bg-neutral-100 p-5">
                                        <img
                                            src={product.main_image}
                                            alt={product.name}
                                            className="h-full w-full object-contain"

                                        />
                                    </div>
                                    {/* Content */}
                                    <div className="p-6">
                                        <h3 className="mb-2 font-semibold text-gray-800 truncate">
                                            {product.name}
                                        </h3>
                                        <p className='text-sm truncate'>{product.store_name}</p>


                                        <p className="font-bold text-gray-800">
                                            {formatCurrency.format(product.sale_price)}
                                        </p>
                                        {!session ? <Button disabled className="w-full my-2">Login to add to cart</Button> : <Button className="w-full my-2" onClick={() => handleAddToCart(product)}><ShoppingBasketIcon className="w-6 h-6" />Add to cart</Button>
                                        }
                                    </div>

                                </div>
                            ))}
                        </div>

                    </section>
                ))}
            </div>


            <div className="flex gap-2 justify-center my-4">
                {currentProductPage < totalProductPages && (
                    <Button
                        onClick={() => fetchProducts(currentProductPage + 1)}
                        disabled={productListLoading}
                    >
                        {productListLoading ? "Loading..." : "See more items"}
                    </Button>
                )}

                {currentProductPage > 1 && (
                    <Button
                        variant="outline"
                        onClick={resetProducts}
                    >
                        Reset
                    </Button>
                )}
            </div>
        </>
    )
}
