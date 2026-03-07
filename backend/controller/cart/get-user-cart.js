import { getRedisClient } from "../../config/redis.js";
import pool from "../../db.js";
const CART_CACHE_TTL = 60 * 30;
const redis = await getRedisClient();
const getUserCart = async (req, res) => {
    const { id } = req.user;
    if (!id) return;
    const cacheKey = `cart:user:${id}`;

    try {
        /* Try Redis first */
        const cachedCart = await redis.get(cacheKey);
        if (cachedCart) {
            // console.log(
            //     "get-user-cart.js from cache",
            //     JSON.stringify(cachedCart),
            // );
            return res.status(200).json(JSON.parse(cachedCart));
        }

        /* Fallback to DB */
        const { rows } = await pool.query(
            `
          SELECT
    c.id AS cart_id,
    c.status,
    COALESCE(
        json_agg(
            json_build_object(
                'product_id', p.id,
                'name', p.name,
                'slug', p.slug,
                'price', p.sale_price,
                'quantity', ci.quantity,
                'image', p.main_image
            )
            ORDER BY ci.created_at
        ) FILTER (WHERE ci.id IS NOT NULL),
        '[]'::json
    ) AS items
FROM carts c
LEFT JOIN cart_items ci ON ci.cart_id = c.id
LEFT JOIN products p ON p.id = ci.product_id
WHERE c.user_id = $1
  AND c.status = 'active'
GROUP BY c.id, c.status;

            `,
            [id],
        );

        // console.log("get-user-cart.js cart", JSON.stringify(rows));
        const cart =
            rows.length === 0
                ? { cart_id: null, status: "empty", items: [] }
                : rows[0];

        /* Store in Redis (TTL optional) */
        await redis.set(cacheKey, JSON.stringify(cart), { EX: CART_CACHE_TTL });
        // console.log("get-user-cart.js", JSON.stringify(rows));
        return res.status(200).json(cart);
    } catch (error) {
        console.error("getUserCart error", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export default getUserCart;
