import "dotenv/config";
import { getRedisClient } from "../../config/redis.js";
import pool from "../../db.js";
import datetime from "../../utils/datetime.js";

const redis = await getRedisClient();
const CART_CACHE_TTL = 60 * 30;
const addToCart = async (req, res) => {
    const { product_id, quantity } = req.body;
    const { id: userId } = req.user;

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (!product_id || !quantity || quantity < 1) {
        return res.status(400).json({ message: "Invalid product or quantity" });
    }

    const redisKey = `product:${product_id}:stock`;

    const luaScript = `
        local stock = tonumber(redis.call('GET', KEYS[1]))
        if stock == nil then return -2 end
        if stock < tonumber(ARGV[1]) then return -1 end
        return redis.call('DECRBY', KEYS[1], ARGV[1])
    `;

    try {
        // Ensure stock is cached in Redis
        let stock = await redis.get(redisKey);
        if (stock === null) {
            const { rows } = await pool.query(
                "SELECT stock_quantity FROM products WHERE id = $1",
                [product_id],
            );

            if (!rows.length || rows[0].stock_quantity <= 0) {
                return res.status(409).json({ message: "Out of stock" });
            }

            stock = rows[0].stock_quantity;
            await redis.set(redisKey, stock);
        }

        // Atomically reserve stock via Lua
        const result = await redis.eval(luaScript, {
            keys: [redisKey],
            arguments: [String(quantity)],
        });

        if (result === -2) {
            return res.status(409).json({ message: "Out of stock" });
        }
        if (result === -1) {
            return res.status(409).json({ message: "Not enough stock" });
        }

        // Find or create active cart
        let cartId;
        const cartResult = await pool.query(
            "SELECT id FROM carts WHERE user_id = $1 AND status = 'active' LIMIT 1",
            [userId],
        );

        if (cartResult.rows.length > 0) {
            cartId = cartResult.rows[0].id;
        } else {
            const { rows } = await pool.query(
                "INSERT INTO carts (user_id) VALUES ($1) RETURNING id",
                [userId],
            );
            cartId = rows[0].id;
        }

        // Insert or update cart item
        try {
            await pool.query(
                `INSERT INTO cart_items (cart_id, product_id, quantity, created_at)
                 VALUES ($1, $2, $3, now())
                 ON CONFLICT (cart_id, product_id)
                 DO UPDATE SET
                     quantity = cart_items.quantity + EXCLUDED.quantity,
                     updated_at = now()`,
                [cartId, product_id, quantity],
            );
        } catch (dbError) {
            await redis.incrBy(redisKey, quantity);
            throw dbError;
        }

        // Fetch updated cart
        const { rows: cartRows } = await pool.query(
            `SELECT
                c.id AS cart_id,
                c.status,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'product_id',   p.id,
                            'name',         p.name,
                            'slug',         p.slug,
                            'price',        p.sale_price,
                            'quantity',     ci.quantity,
                            'image',        p.main_image,
                            'out_of_stock', p.stock_quantity < ci.quantity
                        )
                    ) FILTER (WHERE ci.id IS NOT NULL),
                    '[]'::json
                ) AS items
             FROM carts c
             LEFT JOIN cart_items ci ON ci.cart_id = c.id
             LEFT JOIN products p    ON p.id = ci.product_id
             WHERE c.user_id = $1 AND c.status = 'active'
             GROUP BY c.id, c.status`,
            [userId],
        );

        const cart = cartRows[0] ?? null;

        if (cart) {
            await redis.set(`cart:user:${userId}`, JSON.stringify(cart), {
                EX: CART_CACHE_TTL,
            });
        }

        return res.status(201).json({ message: "Added to cart", cart });
    } catch (error) {
        console.error("addToCart error:", error);
        return res.status(500).json({ message: "Could not add to cart" });
    }
};
export default addToCart;
