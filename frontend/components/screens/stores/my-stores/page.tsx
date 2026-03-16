"use client"

import MainNav from "@/components/MainNav"
import { Button } from "@/components/ui/button"
import useGetMyStores from "@/hooks/stores/my-stores"
import { ChevronRight, Plus, Settings, Store } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

function MyStoresScreen() {
    const { myStoresList, myStoresListLoading } = useGetMyStores()

    const router = useRouter()
    if (myStoresList.length === 0) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center space-y-3">
                <p className="text-2xl">📦</p>
                <p className="font-medium">Stores not found</p>
                <div className="space-x-4 space-y-4">
                    <Link href="/create-store">
                        <Button>Create a store</Button>
                    </Link>
                    <Link href="/">
                        <Button variant="outline">Back to home</Button>
                    </Link>
                </div>
            </div>
        </div>
    )
    return (
        <>
            <MainNav />
            <div className="h-[calc(100vh-64px)]">
                <div className="orders-header">
                    <div className="text-gray-100">My Stores</div>
                    <div className="header-sub">Track and manage your stores</div>
                </div>

                <div className="px-4 py-6 max-w-4xl mx-auto">
                <Button className="my-3 flex ms-auto" onClick={()=> router.push("/create-store")}>Add a store</Button>
                    {myStoresListLoading ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-white rounded-xl border border-[#E5E4DF] overflow-hidden animate-pulse">
                                    <div className="h-28 bg-slate-100" />
                                    <div className="p-4 space-y-2">
                                        <div className="h-4 bg-slate-100 rounded w-2/3" />
                                        <div className="h-3 bg-slate-100 rounded w-1/2" />
                                        <div className="h-3 bg-slate-100 rounded w-full" />
                                    </div>
                                    <div className="px-4 pb-4">
                                        <div className="h-9 bg-slate-100 rounded-lg" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : myStoresList.length === 0 ? (
                        <div className="py-20 text-center">
                            <div className="text-5xl mb-3">📦</div>
                            <p className="text-base text-gray-400">No stores found</p>
                            <Link href="/stores/create" className="mt-4 inline-block">
                                <Button className="gap-2 bg-[#F86624] hover:bg-[#F15025]">
                                    <Plus className="h-4 w-4" />
                                    Create store
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {myStoresList.map((store) => (
                                <div key={store.id} className="bg-white rounded-xl border border-[#E5E4DF] overflow-hidden hover:shadow-md transition-shadow">
                                    <Link href={`/stores/${store.slug}`} className="block">
                                        <div className="p-4">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0">
                                                    <h3 className="font-semibold text-[#191919] truncate">{store.name}</h3>
                                                    <p className="text-xs text-[#999] mt-0.5 truncate">/stores/{store.slug}</p>
                                                </div>
                                                <ChevronRight className="h-4 w-4 text-[#999] shrink-0 mt-0.5" />
                                            </div>
                                            {store.description && (
                                                <p className="text-sm text-[#666] mt-2 line-clamp-2">{store.description}</p>
                                            )}
                                        </div>
                                    </Link>
                                    <div className="px-4 pb-4">
                                        <Link href={`/dashboard/stores/${store.slug}`}>
                                            <Button variant="outline" size="sm" className="w-full gap-2">
                                                <Settings className="h-3.5 w-3.5" />
                                                Manage store
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default MyStoresScreen