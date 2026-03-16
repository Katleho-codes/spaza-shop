"use client"

import { Filters } from "@/components/FilterSidebar";
import MainNav from "@/components/MainNav";
import ProductsDisplay from "@/components/ProductsDisplay";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import useCart from "@/hooks/carts/useCart";
import useGetStoreByName from "@/hooks/stores/get-store-by-name";
import { useSession } from "@/lib/auth-client";
import { formatCurrency } from "@/lib/utils";
import { Link, ShoppingBasketIcon } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type SortContentProps = {
    sortItem: string;
    handleSortItemChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};
type FilterContentProps = {
    brand: string;
    handleBrandChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    category: string;
    handleCategoryChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};
function ViewStoreScreen() {
    const params = useParams(); // Fetch URL parameters
    const { name } = params;
    const {
        data: session,
        isPending, //loading state
        error, //error object
        refetch //refetch the session
    } = useSession()




    const { cart, addToCart, removeFromCart, clearCart } = useCart()
    const handleAddToCart = (product: {
        id: number;
        name: string;
        sale_price: number;
        main_image: string;
        slug: string;
    }) => {
        addToCart({
            product_id: product.id,
            name: product.name,
            price: product.sale_price,
            quantity: 1,
            image: product.main_image,
            slug: product.slug
        });
    };

    const router = useRouter();
    const searchParams = useSearchParams();

    const {
        storeData, storeListLoading, totalProductsByStore
    } = useGetStoreByName(name, searchParams.toString());

    const [sheetOpen, setSheetOpen] = useState(false);
    const [sheetView, setSheetView] = useState<"filter" | "sort" | null>(null);


    const [sortItem, setSortItem] = useState(searchParams.get("sort") ?? "");
    const [category, setCategory] = useState(searchParams.get("category") ?? "");
    const [brand, setBrand] = useState(searchParams.get("brand") ?? "");
    // Keep local state in sync if user navigates back/forward
    useEffect(() => {
        setSortItem(searchParams.get("sort") ?? "");
        setCategory(searchParams.get("category") ?? "");
        setBrand(searchParams.get("brand") ?? "");
    }, [searchParams]);

    const handleBrandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBrand(e.target.value);
    };
    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCategory(e.target.value);
    };
    const handleSortChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setSortItem(e.target.value);
    };


    const applyParams = (e: React.SyntheticEvent) => {
        e.preventDefault();

        const next = new URLSearchParams(searchParams.toString());

        // Set or remove sort
        if (sortItem) {
            next.set("sort", sortItem);
        } else {
            next.delete("sort");
        }

        // Set or remove filter
        if (category) {
            next.set("category", category);
        } else {
            next.delete("category");
        }
        if (brand) {
            next.set("brand", brand);
        } else {
            next.delete("brand");
        }

        // Reset to page 1 whenever sort/filter changes
        next.set("page", "1");

        router.push(`?${next.toString()}`);
        setSheetOpen(false)
    };

    const clearParams = () => {
        setSortItem("");
        setCategory("");
        setBrand("");
        router.push("?"); // back to original data, no query string
        setSheetOpen(false)
    };

    if (storeData?.products.length === 0) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center space-y-3">
                <p className="text-2xl">📦</p>
                <p className="font-medium">Store has no products currently</p>
                <Button variant="outline" onClick={() => router.push("/")}>Back to home</Button>
            </div>
        </div>
    )
    if (storeListLoading) return <p>Loading store...</p>

    return (
        <>
            <MainNav />
            <div className="lg:mx-auto lg:container max-w-7xl mx-auto px-6 lg:px-8 h-[calc(100vh-88px)] mt-22">


                <h1>{storeData?.name}</h1>
                <div className="flex justify-between">
                    <p>{totalProductsByStore} items</p>

                    <div className="space-x-2">


                        <Button
                            className=""
                            onClick={() => {
                                setSheetView("sort");
                                setSheetOpen(true);
                            }}
                        >
                            Sort
                        </Button>
                        <Button
                            className=""
                            onClick={() => {
                                setSheetView("filter");
                                setSheetOpen(true);
                            }}
                        >
                            Filter
                        </Button>
                    </div>
                </div>

                <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {storeData?.products?.map((product) => (



                        <div
                            key={product.id}
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
                                <h3 className="mb-2 font-semibold text-neutral-900 truncate">
                                    {product.name}
                                </h3>
                                <p className='text-sm truncate'>{name}</p>


                                <p className="font-bold text-neutral-900">
                                    {formatCurrency.format(product.sale_price)}
                                </p>
                                {!session ? <Button disabled className="w-full my-2">Login to add to cart</Button> : <Button className="w-full my-2" onClick={() => handleAddToCart(product)}><ShoppingBasketIcon className="w-6 h-6" />Add to cart</Button>
                                }
                            </div>

                        </div>


                    ))}

                </section>

                <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                    <SheetContent className="px-1" side="left">
                        <SheetHeader>
                            {sheetView === "sort" && <SheetTitle>Sort</SheetTitle>}
                            {sheetView === "filter" && <SheetTitle>Filter</SheetTitle>}
                            <SheetDescription>This action cannot be undone.</SheetDescription>
                        </SheetHeader>
                        {sheetView === "sort" && <SortContent sortItem={sortItem} handleSortItemChange={handleSortChange} />}
                        {sheetView === "filter" && <FilterContent category={category} handleCategoryChange={handleCategoryChange} brand={brand} handleBrandChange={handleBrandChange} />}

                        <SheetFooter>
                            <div className="flex items-center gap-2">
                                <Button className="block flex-1" variant="outline" type="button" onClick={clearParams}>Clear</Button>
                                <Button className="block flex-1" type="button" onClick={applyParams}>Show results</Button>
                            </div>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </div>

        </>

    )
}

const SortContent = ({
    sortItem,
    handleSortItemChange,
}: SortContentProps) => {
    return (
        <div className="px-2">
            <div>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="radio"
                        name="sort_items"
                        value="newest"
                        checked={sortItem === 'newest'}
                        onChange={handleSortItemChange}
                    /> Newest
                </label>
            </div>
            <div>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="radio"
                        name="sort_items"
                        value="lowest"
                        checked={sortItem === 'lowest'}
                        onChange={handleSortItemChange}
                    /> Lowest price
                </label>
            </div>
            <div>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="radio"
                        name="sort_items"
                        value="highest"
                        checked={sortItem === 'highest'}
                        onChange={handleSortItemChange}
                    /> Highest price
                </label>
            </div>
        </div>
    )
}
const FilterContent = ({
    category,
    handleCategoryChange, brand, handleBrandChange
}: FilterContentProps) => {
    return (

        <>
            {/* Category filter */}
            <select value={category} onChange={handleCategoryChange}>
                <option value="">All Categories</option>
                <option value="Household">Household</option>
                <option value="Food">Food</option>
                <option value="Beverages">Beverages</option>
            </select>

            {/* Brand filter */}
            <input
                type="text"
                placeholder="Filter by brand..."
                value={brand}
                onChange={handleBrandChange}
            />
        </>
    )

}
export default ViewStoreScreen