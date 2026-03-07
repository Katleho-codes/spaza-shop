import pool from "../../db.js";
import { getRedisClient } from "../../config/redis.js";

const redis = await getRedisClient();

const getThisUsersOrders = async (req, res) => {
    const { id } = req.user;
    if (!id) return;
    try {
        let {
            page = 1,
            limit = 20,
            filter = "all",
            from = null,
            to = null,
        } = req.query;

        page = Math.max(parseInt(page, 10), 1);
        limit = Math.max(parseInt(limit, 10), 1);
        const offset = (page - 1) * limit;

        const cacheKey = `orders-user:${id}:page:${page}:limit:${limit}:filter:${filter}:from:${from}:to:${to}`;

        const cached = await redis.get(cacheKey);
        if (cached) return res.status(200).json(JSON.parse(cached));

        const query = `
            SELECT
                o.id AS order_id,
                o.order_number,
                o.created_at,
                o.status,
                o.total_amount,
                p.id           AS product_id,
                p.name         AS product_name,
                p.main_image   AS product_image,
                p.sale_price   AS product_price,
                oi.quantity,
                COUNT(*) OVER() AS total_count
            FROM orders o
            JOIN order_items oi ON oi.order_id = o.id
            JOIN products p     ON p.id = oi.product_id
            WHERE o.user_id = $1
              AND (
                  ($2 = '3_months'  AND o.created_at >= NOW() - INTERVAL '3 months')  OR
                  ($2 = '6_months'  AND o.created_at >= NOW() - INTERVAL '6 months')  OR
                  ($2 = 'last_year' AND o.created_at >= DATE_TRUNC('year', NOW() - INTERVAL '1 year')
                                    AND o.created_at <  DATE_TRUNC('year', NOW()))     OR
                  ($2 = 'this_year' AND o.created_at >= DATE_TRUNC('year', NOW()))     OR
                  ($2 = 'custom'
                      AND ($3::date IS NULL OR o.created_at >= $3::date)
                      AND ($4::date IS NULL OR o.created_at < ($4::date + INTERVAL '1 day'))) OR
                  ($2 IS NULL OR $2 = 'all')
              )
            ORDER BY o.created_at DESC
            LIMIT $5 OFFSET $6
        `;

        const { rows } = await pool.query(query, [
            id,
            filter,
            from,
            to,
            limit,
            offset,
        ]);

        const totalCount =
            rows.length > 0 ? parseInt(rows[0].total_count, 10) : 0;

        const response = {
            data: rows.map(({ total_count, ...order }) => order), // strip total_count from each row
            meta: {
                currentPage: page,
                perPage: limit,
                totalCount,
                totalPages: Math.ceil(totalCount / limit),
            },
        };

        await redis.set(cacheKey, JSON.stringify(response), { EX: 60 });
        return res.status(200).json(response);
    } catch (error) {
        console.log("get-user-orders.js error", error);
    }
};

export default getThisUsersOrders;
