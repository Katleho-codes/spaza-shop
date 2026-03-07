"use client"

import useGetStores from "@/hooks/stores/get-stores";
import { sliderSettings } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight, MapPin, Phone } from "lucide-react";
import { useState, useEffect } from "react";



function getSlidesToShow(count: number): number {
    if (typeof window === "undefined") return 1;
    const w = window.innerWidth;
    if (w < 640) return 1;
    if (w < 1024) return Math.min(count, 2);
    if (w < 1280) return Math.min(count, 3);
    return Math.min(count, 4);
}


function PrevArrow({ onClick }: { onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            aria-label="Previous"
            className="
        absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10
        w-9 h-9 flex items-center justify-center
        rounded-full border border-stone-200 bg-white
        text-stone-500 shadow-sm
        hover:border-stone-400 hover:text-stone-900 hover:shadow-md
        transition-all duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400
      "
        >
            <ChevronLeft size={16} strokeWidth={2} />
        </button>
    );
}

function NextArrow({ onClick }: { onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            aria-label="Next"
            className="
        absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10
        w-9 h-9 flex items-center justify-center
        rounded-full border border-stone-200 bg-white
        text-stone-500 shadow-sm
        hover:border-stone-400 hover:text-stone-900 hover:shadow-md
        transition-all duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400
      "
        >
            <ChevronRight size={16} strokeWidth={2} />
        </button>
    );
}

function StoreCard({ store, onClick }: { store: any; onClick: () => void }) {
    return (
        <div
            onClick={onClick}
            className="
        mx-2 cursor-pointer
        rounded-xl border border-stone-100 bg-white
        p-5 flex flex-col gap-3
        shadow-sm hover:shadow-md hover:border-stone-300
        transition-all duration-200 hover:-translate-y-0.5
        group
      "
        >
            <div className="w-10 h-10 rounded-lg bg-stone-50 border border-stone-100 flex items-center justify-center group-hover:bg-stone-100 transition-colors">
                <MapPin size={18} className="text-stone-400 group-hover:text-stone-600 transition-colors" />
            </div>
            <div>
                <p className="font-semibold text-stone-900 text-sm leading-snug truncate">{store?.name}</p>
                {store?.address && (
                    <p className="text-xs text-stone-400 mt-0.5 truncate">{store?.address}</p>
                )}
            </div>
            {store?.phone && (
                <div className="flex items-center gap-1.5 mt-auto">
                    <Phone size={12} className="text-stone-300 shrink-0" />
                    <p className="text-xs text-stone-400 truncate">{store?.phone}</p>
                </div>
            )}
        </div>
    );
}
function SkeletonCard() {
    return (
        <div className="mx-2 rounded-xl border border-stone-100 bg-white p-5 flex flex-col gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-stone-100 animate-pulse" />
            <div className="space-y-2">
                <div className="h-3 w-3/4 bg-stone-100 rounded animate-pulse" />
                <div className="h-3 w-1/2 bg-stone-100 rounded animate-pulse" />
            </div>
        </div>
    );
}


export default function StoresSlider() {

    const {
        storeList
    } = useGetStores();
    const router = useRouter()
    const pathname = usePathname();
    const searchParams = useSearchParams();


    const count = storeList?.length ?? 0;

    // KEY FIX: Don't render react-slick until the client has mounted.
    //
    // react-slick measures the container width synchronously during its first
    // render to compute each slide's pixel width. When Next.js pre-renders on
    // the server (or the component hydrates before layout), the container has
    // no real width → react-slick computes (containerWidth / slidesToShow) = Infinity.
    //
    // By gating on `mounted`, we guarantee:
    //  1. window.innerWidth is readable → getSlidesToShow() returns the correct
    //     breakpoint value for the actual device on first render.
    //  2. The DOM is laid out → container has a real pixel width → no Infinity.
    //  3. Mobile hard-refresh works because the correct slidesToShow is used
    //     from the very first client paint, not derived from a later resize event.
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    const slidesToShow = getSlidesToShow(count);

    const sliderSettings = {
        dots: true,
        infinite: count > slidesToShow,
        speed: 400,
        slidesToShow,
        slidesToScroll: 1,
        swipeToSlide: true,
        prevArrow: <PrevArrow />,
        nextArrow: <NextArrow />,
        appendDots: (dots: React.ReactNode) => (
            <div style={{ bottom: "-28px" }}>
                <ul className="flex items-center justify-center gap-1.5 m-0 p-0">
                    {dots}
                </ul>
            </div>
        ),
        customPaging: () => (
            <div className="w-1.5 h-1.5 rounded-full bg-stone-300 hover:bg-stone-500 transition-colors cursor-pointer" />
        ),
        responsive: [
            { breakpoint: 1280, settings: { slidesToShow: Math.min(count, 3) } },
            { breakpoint: 1024, settings: { slidesToShow: Math.min(count, 2) } },
            { breakpoint: 640, settings: { slidesToShow: 1, arrows: false } },
        ],
    };

    if (!mounted) {
        return (
            <div className="px-6">
                <div className="flex">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="w-1/4 hidden xl:block"><SkeletonCard /></div>
                    ))}
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="w-1/3 hidden lg:block xl:hidden"><SkeletonCard /></div>
                    ))}
                    {Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="w-1/2 hidden sm:block lg:hidden"><SkeletonCard /></div>
                    ))}
                    <div className="w-full sm:hidden"><SkeletonCard /></div>
                </div>
            </div>
        );
    }
    return (
        <div className="">
            {/* Fix: overflow-hidden prevents cards from spilling outside bounds;
          padding gives space for the custom arrows on left/right */}
            <div className="relative">
                <Slider {...sliderSettings}>
                    {storeList?.map((store: any) => (
                        <StoreCard
                            key={store.id}
                            store={store}
                            onClick={() => router.push(`/stores/${store?.slug}`)}
                        />
                    ))}
                </Slider>
            </div>

            {/* Fix: reserve space for dots below the slider */}
            <div className="h-8" />

            {/* Scoped CSS fixes for react-slick internals */}
            <style jsx global>{`
        .slick-list {
          overflow: hidden;
          margin: 0;
          padding: 4px 0 !important;
        }
        .slick-track {
          display: flex !important;
          align-items: stretch;
        }
        .slick-slide {
          float: left;
          min-height: 1px;
          height: auto !important;
        }
        .slick-slide > div {
          display: block;
          height: 100%;
        }
        .slick-dots li { margin: 0; width: auto; height: auto; }
        .slick-dots li button { padding: 0; width: auto; height: auto; }
        .slick-dots li button::before { display: none; }
        .slick-dots li.slick-active div {
          background-color: #44403c;
          width: 16px;
          border-radius: 9999px;
          transition: width 0.2s ease, background-color 0.2s ease;
        }
      `}</style>
        </div>
    )
}
