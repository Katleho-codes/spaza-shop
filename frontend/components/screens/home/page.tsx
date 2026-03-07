"use client"
import MainNav from "@/components/MainNav";
import ProductsDisplay from "@/components/ProductsDisplay";
import StoresSlider from "@/components/StoresSlider";
import useCart from "@/hooks/carts/useCart";
import { authClient, useSession } from "@/lib/auth-client";


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
  const handleAddToCart = (product: {
    product_id: number;
    name: string;
    sale_price: number;
    main_image: string;
    slug: string;
  }) => {
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
      <div className="lg:mx-auto lg:container max-w-7xl mx-auto px-6 lg:px-8 h-[calc(100vh-88px)] mt-22">

        {/* <div className='my-2'>
          <h2 className="font-semibold py-3 text-gray-800">Shop by store</h2>
          <StoresSlider />
        </div> */}
        <div>
          {session && <h2 className="truncate">Hi {session?.user?.name}</h2>}
          <div>
            <h2 className="font-semibold py-3 text-gray-800">Explore popular categories</h2>
          </div>
          <ProductsDisplay handleAddToCart={handleAddToCart} />
        </div>
      </div>
    </>
  )
}
