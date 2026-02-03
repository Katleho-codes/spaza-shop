"use client"
import CompanyCard from "@/components/CompanyCard";
import MainNav from "@/components/MainNav";
import { Button } from "@/components/ui/button";
import useGetProducts from "@/hooks/products/get-products";
import useGetStores from "@/hooks/stores/get-stores";
import useCart, { CartItem } from "@/hooks/useCart";
import { authClient, useSession } from "@/lib/auth-client";
import { fakerEN_ZA } from '@faker-js/faker';
import axios from "axios";
import { ShoppingBasketIcon } from "lucide-react";
import { useState } from "react";
import Slider from "react-slick";


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
  const formatter = new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
  });
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };
  const {
    storeList,
    storeListLoading,
    currentPage,
    totalPages,
    fetchStores,
    resetStores
  } = useGetStores();
  const {
    productList,
    fetchProducts,
    resetProducts,
    currentProductPage,
    totalProductPages,
    productListLoading,
  } = useGetProducts()

  const generateStore = async (ownerId: number) => {
    const theName = `${fakerEN_ZA.person.lastName()} Spaza Shop`
    const values = {
      name: theName,
      created_at: fakerEN_ZA.date.recent().toLocaleString("en-ZA"),
      updated_at: fakerEN_ZA.date.recent().toLocaleString("en-ZA"),

      description: fakerEN_ZA.company.catchPhrase(),

      email: fakerEN_ZA.internet.email({ provider: "spazashop.co.za" }).toLowerCase(),
      phone: fakerEN_ZA.phone
        .number()
        ?.replaceAll(" ", "")   // remove everything except digits
        .slice(0, 10),         // take first 10 digits only

      logo: fakerEN_ZA.image.urlPicsumPhotos(),

      slug: fakerEN_ZA.helpers.slugify(theName).toLowerCase(),

      owner_id: ownerId,

      address_line1: `${fakerEN_ZA.number.int({ min: 1, max: 999 })} ${fakerEN_ZA.location.street()}`,
      address_line2: fakerEN_ZA.helpers.arrayElement(["Zone 1", "Zone 2", "Zone 3", "Ext 4"]),

      city: fakerEN_ZA.helpers.arrayElement([
        "Soweto",
        "Tembisa",
        "Alexandra",
        "Katlehong",
        "Mamelodi",
      ]),

      province: fakerEN_ZA.helpers.arrayElement([
        "Gauteng",
        "KwaZulu-Natal",
        "Western Cape",
        "Eastern Cape",
      ]),

      postal_code: fakerEN_ZA.location.zipCode("####"),
      country: "South Africa",

      is_active: fakerEN_ZA.datatype.boolean(),
      is_verified: fakerEN_ZA.datatype.boolean(),

      banner_url: fakerEN_ZA.image.urlLoremFlickr({
        category: "shop",
        width: 1200,
        height: 300,
      })


    };

    try {
      const response = await axios.post("http://localhost:8000/api/stores", values);
      console.log("generate fake store data response", response)
    } catch (error) {
      console.error("generate fake stores error", error)
    }

  }
  const generateProduct = async () => {
    const values = {
      name: 'Twinsaver 1 Ply Toilet Roll',
      description: 'Enjoy everyday comfort and confidence with Twinsaver 1 Ply Toilet Roll. Dermatologically tested for soft strength, it\'s the affordable, quality essential your family deserves.',
      cost_price: 6.99,
      sale_price: 9.99,
      main_image: 'https://www.shoprite.co.za/medias/10143409EA-checkers515Wx515H.webp?context=bWFzdGVyfGltYWdlc3w0MjA4NHxpbWFnZS93ZWJwfGltYWdlcy9oZTYvaDQ0LzEwMDI1OTUwMzE0NTI2LndlYnB8MjE3YTRlMzgwYjc3NDhjMTA4NmI1MTI2YTYyMDlhMmJmNTE4ZTEyZDYxNjNmZDBiYzgzNjUzY2VhZGI2MTA4Ng',
      category: 'Toiletries',
      stock_quantity: fakerEN_ZA.number.int({ min: 1, max: 30 }),
      image_two: '',
      low_stock_threshold: fakerEN_ZA.number.int({ min: 10, max: 10 }),
      store_id: fakerEN_ZA.number.int({ min: 4, max: 102 })
    }
    try {
      const response = await axios.post("http://localhost:8000/api/products", values);
      console.log("generate fake product data response", response)
    } catch (error) {
      console.error("generate fake product error", error)
    }
  }
  const { cart, addToCart, removeFromCart, clearCart } = useCart()

  const handleAddToCart = (product: {
    id: number;
    name: string;
    sale_price: number;
    main_image: string;
    slug: string;
  }) => {
    addToCart({
      id: product.id,
      name: product.name,
      sale_price: product.sale_price,
      quantity: 1,
      main_image: product.main_image,
      slug: product.slug
    });
  };

  return (
    <>
      <MainNav />
      <div className="mx-auto container mt-20">
        {/* <p>Welcome {session?.user.name}</p> */}


        {/* {
          session ? <Button onClick={logout}>Log out</Button> : null
        }


        <Button onClick={() => generateStore(12)}>Create store</Button>
        <Button onClick={() => generateProduct()}>Create product</Button> */}
   
        <div className='w-full my-2'>
          <h2>Shop by store</h2>
          <div className="slider-container">
            <Slider {...sliderSettings}>
              {storeList?.map((x: any, idx: number) => (

                <div key={x.id} className="border rounded-md p-3 grid place-items-center justify-center">
                  <p className="text-center font-bold">{x?.name}</p>
                  <p className="text-center font-regular">{x?.phone}</p>
                </div>
              ))}
            </Slider>
          </div>
        </div>
        <div>
          <div>
            <h2>Explore popular categories</h2>
          </div>
          <div className="space-y-8">
            {productList?.map((group, idx) => (
              <section key={`${group.category}-${idx}`}>
                <h2 className="text-xl font-semibold mb-4">
                  {group.category}
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {group.products.map((product) => (
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

                        <p className="font-bold text-neutral-900">
                          {formatter.format(product.sale_price)}
                        </p>
                        <Button className="w-full my-2" onClick={() => handleAddToCart(product)}><ShoppingBasketIcon className="w-6 h-6" />Add to cart</Button>

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


        </div>
      </div>
    </>
  )
}
