"use client"
import useGetUserOrder from '@/hooks/orders/get-user-orders';
import React, { useEffect, useState } from 'react'

const PRESETS = [
    { label: "All", value: "all" },
    { label: "3 Months", value: "3_months" },
    { label: "6 Months", value: "6_months" },
    { label: "This Year", value: "this_year" },
    { label: "Last Year", value: "last_year" },
    { label: "Custom", value: "custom" },
];


const STATUS_COLORS = {
    delivered: { bg: "#e6f4ec", text: "#1a7a3e", dot: "#2ecc71" },
    pending: { bg: "#fff7e6", text: "#a06000", dot: "#f39c12" },
    processing: { bg: "#e8f0fe", text: "#1a4fbb", dot: "#4a7dff" },
    cancelled: { bg: "#fdecea", text: "#a01e1e", dot: "#e74c3c" },
    shipped: { bg: "#f0eaff", text: "#5a1aaa", dot: "#9b59b6" },
};
function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-ZA", {
        day: "2-digit", month: "short", year: "numeric",
    });
}

function formatZAR(amount: number) {
    return `R ${Number(amount).toFixed(2)}`;
}

export default function OrdersScreen() {
    const [filter, setFilter] = useState("all");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [page, setPage] = useState(1);
    const [expandedId, setExpandedId] = useState(null);
    const [animate, setAnimate] = useState(false);
    const {
        userOrdersList,
        userOrdersListLoading,
        currentUserOrderPage,
        totalUserOrderPages,
    } = useGetUserOrder();


    useEffect(() => {
        setAnimate(false);
        const t = setTimeout(() => setAnimate(true), 50);
        return () => clearTimeout(t);
    }, [filter, page]);

    const filtered = userOrdersList?.filter(o => {
        const d = new Date(o.created_at);
        const now = new Date();
        if (filter === "3_months") return d >= new Date(now - 90 * 864e5);
        if (filter === "6_months") return d >= new Date(now - 180 * 864e5);
        if (filter === "this_year") return d.getFullYear() === now.getFullYear();
        if (filter === "last_year") return d.getFullYear() === now.getFullYear() - 1;
        if (filter === "custom") {
            if (from && d < new Date(from)) return false;
            if (to && d > new Date(to + "T23:59:59")) return false;
        }
        return true;
    });

    return (
        <div className=' bg-[#faf6ef] h-screen'>


            {/* Header */}
            <div className="orders-header">
                <div className="header-label">My Account</div>
                <div className="header-title">Order History</div>
                <div className="header-sub">Track and manage your purchases</div>
            </div>

            {/* Filters */}
            <div className="filter-section">
                <div className="preset-pills">
                    {PRESETS.map(p => (
                        <button
                            key={p.value}
                            className={`pill ${filter === p.value ? "active" : ""}`}
                            onClick={() => { setFilter(p.value); setPage(1); }}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>

                {filter === "custom" && (
                    <div className="date-range">
                        <div className="date-input-wrap">
                            <span className="date-label">From</span>
                            <input
                                type="date"
                                className="date-input"
                                value={from}
                                onChange={e => { setFrom(e.target.value); setPage(1); }}
                            />
                        </div>
                        <div style={{ color: "#c4b49a", fontFamily: "DM Sans, sans-serif", fontSize: 18, marginTop: 18 }}>→</div>
                        <div className="date-input-wrap">
                            <span className="date-label">To</span>
                            <input
                                type="date"
                                className="date-input"
                                value={to}
                                onChange={e => { setTo(e.target.value); setPage(1); }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Results count */}
            <div className="results-count">
                {filtered.length} order{filtered.length !== 1 ? "s" : ""} found
            </div>

            {/* Orders */}
            <div className="orders-list">
                {filtered.length === 0 ? (
                    <div className="px-6 py-15 text-center">
                        <div className="text-[48px] mb-[12px]">📦</div>
                        <div className="text-[1rem]">No orders found for this period</div>
                    </div>
                ) : (
                    filtered.map((order, i) => {
                        const statusStyle = STATUS_COLORS[order?.status] || STATUS_COLORS.pending;
                        const isOpen = expandedId === order.order_id;
                        return (
                            <div
                                key={order.order_id}
                                className="order-card"
                                style={{ animationDelay: `${i * 60}ms` }}
                            >
                                <div className="card-main" onClick={() => setExpandedId(isOpen ? null : order?.order_id)}>
                                    {/* Product image */}
                                    <div className="product-img">
                                        <img
                                            src={order.product_image}
                                            alt={order.product_name}
                                            style={{ width: "100%", height: "100%", borderRadius: 8, objectFit: "cover" }}
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="card-info">
                                        <div className="card-number">{order.order_number}</div>
                                        <div className="card-name">{order.product_name}</div>
                                        <div className="card-meta">{formatDate(order.created_at)} · Qty {order.quantity}</div>
                                    </div>

                                    {/* Right */}
                                    <div className="card-right">
                                        <div className="card-amount">{formatZAR(order.total_amount)}</div>
                                        <div className="status-badge" style={{ background: statusStyle.bg, color: statusStyle.text }}>
                                            <div className="status-dot" style={{ background: statusStyle.dot }} />
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </div>
                                    </div>

                                    {/* Chevron */}
                                    <svg className={`chevron ${isOpen ? "open" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </div>

                                {/* Expanded */}
                                {isOpen && (
                                    <div className="card-expanded">
                                        <div className="expand-row">
                                            <span className="expand-key">Unit Price</span>
                                            <span className="expand-val">{formatZAR(order.product_price)}</span>
                                        </div>
                                        <div className="expand-row">
                                            <span className="expand-key">Quantity</span>
                                            <span className="expand-val">{order.quantity}</span>
                                        </div>
                                        <div className="expand-row">
                                            <span className="expand-key">Total</span>
                                            <span className="expand-val">{formatZAR(order.total_amount)}</span>
                                        </div>
                                        <div className="expand-row">
                                            <span className="expand-key">Order Date</span>
                                            <span className="expand-val">{formatDate(order.created_at)}</span>
                                        </div>
                                        <div className="expand-row">
                                            <span className="expand-key">Status</span>
                                            <span className="expand-val" style={{ color: statusStyle.text }}>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Pagination */}
            {filtered.length > 0 && (
                <div className="pagination">
                    <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
                    <span className="page-info">Page {page}</span>
                    <button className="page-btn" onClick={() => setPage(p => p + 1)}>›</button>
                </div>
            )}
        </div>
    )
}
