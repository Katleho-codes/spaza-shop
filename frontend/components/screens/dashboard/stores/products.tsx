"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import axios from "axios"
import toast from "react-hot-toast"
import { Plus, Pencil, Trash2, Search, Package, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatCurrency } from "@/lib/utils"
import socket from "@/hooks/socket"

type Product = {
    id: number
    name: string
    slug: string
    sku: string
    sale_price: string
    cost_price: string
    stock_quantity: number
    category: string
    status: string
    brand: string
    main_image: string
    discount: number
    low_stock_threshold: number
}
interface AddProductErrorMessages {
    name?: string;
    description?: string;
    cost_price?: string;
    sale_price?: string;
    stock_quantity?: string;
    low_stock_threshold?: string;
}
const CATEGORIES = ["Food", "Beverages", "Household", "Personal Care", "Snacks", "Dairy", "Frozen", "Other"]
const STATUSES = ["active", "inactive", "out_of_stock"]

const emptyForm = {
    name: "", description: "", cost_price: "",
    sale_price: "", discount: "", stock_quantity: "",
    category: "", status: "active", brand: "",
    low_stock_threshold: "5"
}

export default function StoreProductsPage() {
    const { slug } = useParams()
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalCount, setTotalCount] = useState(0)
    const [errors, setErrors] = useState<AddProductErrorMessages>({}); // Explicitly typed
    // drawer state
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [form, setForm] = useState(emptyForm)
    const [saving, setSaving] = useState(false)
    const [deletingId, setDeletingId] = useState<number | null>(null)
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

    const fetchProducts = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({ page: String(page), limit: "20" })
            if (search) params.set("search", search)

            const { data } = await axios.get(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/dashboard/stores/${slug}/products?${params}`,
                { withCredentials: true }
            )
            setProducts(data.data)
            setTotalPages(data.meta.totalPages)
            setTotalCount(data.meta.totalCount)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchProducts() }, [slug, page])

    // realtime products updates via socket
    useEffect(() => {
        socket.on("product:added", (addedProduct: Product) => {
            setProducts(prev => [addedProduct, ...prev]) // prepend to top of list
        })

        return () => {
            socket.off("product:added");
        };
    }, []);

    // debounced search
    useEffect(() => {
        const timer = setTimeout(() => { setPage(1); fetchProducts() }, 400)
        return () => clearTimeout(timer)
    }, [search])

    const openCreate = () => {
        setEditingProduct(null)
        setForm(emptyForm)
        setDrawerOpen(true)
    }

    const openEdit = (product: Product) => {
        setEditingProduct(product)
        setForm({
            name: product.name ?? "",
            description: "",
            cost_price: product.cost_price ?? "",
            sale_price: product.sale_price ?? "",
            discount: String(product.discount ?? ""),
            stock_quantity: String(product.stock_quantity ?? ""),
            category: product.category ?? "",
            status: product.status ?? "active",
            brand: product.brand ?? "",
            low_stock_threshold: String(product.low_stock_threshold ?? "5"),
        })
        setDrawerOpen(true)
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        try {
            if (editingProduct) {
                await axios.put(
                    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/products/${editingProduct.id}`,
                    form,
                    { withCredentials: true }
                )
                toast.success("Product updated")
            } else {
                try {
                    await axios.post(
                        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/products`,
                        { ...form, store_slug: slug },
                        { withCredentials: true }
                    )
                    toast.success("Product created")
                } catch (error: any) {
                    if (error?.response) {
                        toast.error(`${error?.response.data?.message}`);
                        setErrors(error.response.data.errors);
                    }
                }
            }
            setDrawerOpen(false)
            fetchProducts()
        } catch (err: any) {
            toast.error(err?.response?.data?.message ?? "Could not save product")
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id: number) => {
        setDeletingId(id)
        try {
            await axios.delete(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/products/${id}`,
                { withCredentials: true }
            )
            toast.success("Product deleted")
            setDeleteConfirm(null)
            setProducts(prev => prev.filter(p => p.id !== id))
        } catch (err: any) {
            toast.error(err?.response?.data?.message ?? "Could not delete product")
        } finally {
            setDeletingId(null)
        }
    }

    const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setForm(prev => ({ ...prev, [key]: e.target.value }))

    const stockColor = (qty: number, threshold: number) => {
        if (qty === 0) return "text-red-500"
        if (qty <= threshold) return "text-orange-500"
        return "text-green-600"
    }

    return (
        <div className="space-y-5">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#F86624]">Store</p>
                    <h1 className="text-2xl font-light mt-1">
                        Products <span className="text-[#999] text-lg">({totalCount})</span>
                    </h1>
                </div>
                <Button onClick={openCreate} className="gap-2 shrink-0">
                    <Plus className="h-4 w-4" /> Add product
                </Button>
            </div>

            {/* search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#999]" />
                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search products..."
                    className="pl-9"
                />
            </div>

            {/* table */}
            <div className="bg-white rounded-xl border border-[#E5E4DF] overflow-hidden">
                {/* header */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 border-b border-[#E5E4DF] bg-[#FAFAF8]">
                    <p className="col-span-4 text-xs font-semibold text-[#999] uppercase tracking-wide">Product</p>
                    <p className="col-span-2 text-xs font-semibold text-[#999] uppercase tracking-wide">SKU</p>
                    <p className="col-span-2 text-xs font-semibold text-[#999] uppercase tracking-wide">Price</p>
                    <p className="col-span-2 text-xs font-semibold text-[#999] uppercase tracking-wide">Stock</p>
                    <p className="col-span-2 text-xs font-semibold text-[#999] uppercase tracking-wide">Actions</p>
                </div>

                {loading ? (
                    <div className="divide-y divide-[#E5E4DF]">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="px-5 py-4 flex items-center gap-4 animate-pulse">
                                <div className="w-10 h-10 bg-slate-100 rounded-lg shrink-0" />
                                <div className="flex-1 space-y-1.5">
                                    <div className="h-4 bg-slate-100 rounded w-40" />
                                    <div className="h-3 bg-slate-100 rounded w-24" />
                                </div>
                                <div className="h-4 bg-slate-100 rounded w-16" />
                            </div>
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="py-16 text-center">
                        <Package className="h-10 w-10 text-[#999] mx-auto mb-3" />
                        <p className="text-sm font-medium text-[#191919]">No products yet</p>
                        <p className="text-xs text-[#999] mt-1">Add your first product to get started</p>
                        <Button onClick={openCreate} className="mt-4 gap-2">
                            <Plus className="h-4 w-4" /> Add product
                        </Button>
                    </div>
                ) : (
                    <div className="divide-y divide-[#E5E4DF]">
                        {products.map(product => (
                            <div key={product.id} className="grid grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-[#FAFAF8] transition-colors">
                                {/* product */}
                                <div className="col-span-12 md:col-span-4 flex items-center gap-3 min-w-0">
                                    {product.main_image ? (
                                        <img src={product.main_image} alt={product.name}
                                            className="w-10 h-10 rounded-lg object-contain border border-[#E5E4DF] shrink-0" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-lg bg-[#F5F4F0] flex items-center justify-center shrink-0">
                                            <Package className="h-4 w-4 text-[#999]" />
                                        </div>
                                    )}
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-[#191919] truncate">{product.name}</p>
                                        <p className="text-xs text-[#999] truncate">{product.category} {product.brand ? `· ${product.brand}` : ""}</p>
                                    </div>
                                </div>

                                {/* sku */}
                                <p className="hidden md:block col-span-2 text-xs text-[#666] font-mono truncate">{product.sku ?? "—"}</p>

                                {/* price */}
                                <div className="hidden md:block col-span-2">
                                    <p className="text-sm font-medium text-[#191919]">{formatCurrency.format(Number(product.sale_price))}</p>
                                    {product.discount > 0 && (
                                        <p className="text-xs text-green-600">{product.discount}% off</p>
                                    )}
                                </div>

                                {/* stock */}
                                <div className="hidden md:block col-span-2">
                                    <p className={`text-sm font-semibold ${stockColor(product.stock_quantity, product.low_stock_threshold ?? 5)}`}>
                                        {product.stock_quantity}
                                    </p>
                                    <p className="text-xs text-[#999]">units</p>
                                </div>

                                {/* actions */}
                                <div className="col-span-12 md:col-span-2 flex items-center gap-2">
                                    <button
                                        onClick={() => openEdit(product)}
                                        className="p-1.5 rounded-lg hover:bg-[#F5F4F0] text-[#666] hover:text-[#191919] transition-colors"
                                    >
                                        <Pencil className="h-3.5 w-3.5" />
                                    </button>

                                    {deleteConfirm === product.id ? (
                                        <div className="flex items-center gap-1.5">
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                disabled={deletingId === product.id}
                                                className="text-xs px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
                                            >
                                                {deletingId === product.id ? "..." : "Confirm"}
                                            </button>
                                            <button
                                                onClick={() => setDeleteConfirm(null)}
                                                className="text-xs px-2 py-1 border border-[#E5E4DF] rounded-md hover:border-[#999]"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setDeleteConfirm(product.id)}
                                            className="p-1.5 rounded-lg hover:bg-red-50 text-[#999] hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                        className="px-3 py-1.5 text-xs border border-[#E5E4DF] rounded-lg disabled:opacity-40 hover:border-[#999] transition-colors">
                        Previous
                    </button>
                    <span className="text-xs text-[#999]">Page {page} of {totalPages}</span>
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                        className="px-3 py-1.5 text-xs border border-[#E5E4DF] rounded-lg disabled:opacity-40 hover:border-[#999] transition-colors">
                        Next
                    </button>
                </div>
            )}

            {/* drawer */}
            {drawerOpen && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div className="absolute inset-0 bg-black/30" onClick={() => setDrawerOpen(false)} />
                    <div className="relative w-full max-w-md bg-white h-full overflow-y-auto shadow-xl flex flex-col">
                        {/* drawer header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E4DF] shrink-0">
                            <h2 className="text-base font-semibold text-[#191919]">
                                {editingProduct ? "Edit product" : "Add product"}
                            </h2>
                            <button onClick={() => setDrawerOpen(false)} className="text-[#999] hover:text-[#191919]">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* drawer form */}
                        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
                            <div className="space-y-1">
                                <Label>Name *</Label>
                                <Input value={form.name} onChange={set("name")} />
                            </div>
                            {errors.name && <p className="text-sm text-red-500 font-medium">{errors.name}</p>}
                            <div className="space-y-1">
                                <Label>Description *</Label>
                                <textarea
                                    value={form.description}
                                    onChange={set("description")}
                                    rows={3}
                                    className="w-full rounded-md border border-input px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#F86624]"
                                />
                            </div>
                            {errors.description && <p className="text-sm text-red-500 font-medium">{errors.description}</p>}
                            <div className="grid grid-cols-1 gap-3">

                                <div className="space-y-1">
                                    <Label>Brand</Label>
                                    <Input value={form.brand} onChange={set("brand")} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label>Cost price *</Label>
                                    <Input type="number" step="0.01" value={form.cost_price} onChange={set("cost_price")} />
                                    {errors.cost_price && <p className="text-sm text-red-500 font-medium">{errors.cost_price}</p>}
                                </div>


                                <div className="space-y-1">
                                    <Label>Sale price *</Label>
                                    <Input type="number" step="0.01" value={form.sale_price} onChange={set("sale_price")} />
                                    {errors.cost_price && <p className="text-sm text-red-500 font-medium">{errors.cost_price}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label>Stock quantity *</Label>
                                    <Input type="number" value={form.stock_quantity} onChange={set("stock_quantity")} />
                                </div>
                                <div className="space-y-1">
                                    <Label>Low stock alert *</Label>
                                    <Input type="number" value={form.low_stock_threshold} onChange={set("low_stock_threshold")} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label>Category</Label>
                                    <select value={form.category} onChange={set("category")}
                                        className="w-full h-10 rounded-md border border-input px-3 text-sm bg-background">
                                        <option value="">Select</option>
                                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <Label>Status</Label>
                                    <select value={form.status} onChange={set("status")}
                                        className="w-full h-10 rounded-md border border-input px-3 text-sm bg-background">
                                        {STATUSES.map(s => <option key={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="pt-2 border-t border-[#E5E4DF] flex gap-3">
                                <Button type="button" variant="outline" className="flex-1" onClick={() => setDrawerOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={saving} className="flex-1">
                                    {saving ? "Saving..." : editingProduct ? "Save changes" : "Add product"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}