"use client"
import MainNav from "@/components/MainNav";
import ProductsDisplay from "@/components/ProductsDisplay";
import useCart from "@/hooks/carts/useCart";
import { authClient, useSession } from "@/lib/auth-client";
import useSocket from "@/hooks/useSocket";
import SearchBar from "@/components/search/page";

export default function HomeScreen() {
  const {
    data: session,
    isPending, //loading state
    error, //error object
    refetch //refetch the session
  } = useSession()

  const logout = async () => {
    await authClient.signOut();
  }

  const { cart, addToCart, removeFromCart, clearCart } = useCart()
  const handleAddToCart = (e: React.SyntheticEvent, product: {
    product_id: number;
    name: string;
    sale_price: number;
    main_image: string;
    slug: string;
  }) => {
    e.stopPropagation()
    addToCart({
      product_id: product.product_id,
      name: product.name,
      price: product.sale_price,
      quantity: 1,
      image: product.main_image,
      slug: product.slug
    });
  };

  return (
    <>

      <MainNav />
      <div className="lg:mx-auto lg:container max-w-7xl mx-auto px-6 lg:px-8 h-[calc(100vh-64px)]">

        {/* <div className='my-2'>
          <h2 className="font-semibold py-3 text-gray-800">Shop by store</h2>
          <StoresSlider />
        </div> */}
        <div>
          {session && (
            <h2 className="truncate font-regular">
              Hi <span className="font-medium">{session.user.name}</span>
            </h2>
          )}
          <div className="py-8 px-4">
            <SearchBar />
          </div>
          <ProductsDisplay handleAddToCart={handleAddToCart} />
        </div>
      </div>
    </>
  )
}
