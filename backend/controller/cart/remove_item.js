import pool from "../../db.js";
import { getRedisClient } from "../../config/redis.js";

const redis = await getRedisClient();

// DELETE /api/carts/item/:productId
const removeFromCart = async (req, res) => {
    const { id: productId } = req.params;
    const { id: userId } = req.user;


    try {
        const cartResult = await pool.query(
            `SELECT id FROM carts WHERE user_id = $1 AND status = 'active' LIMIT 1`,
            [userId],
        );

        if (!cartResult.rows.length) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const cartId = cartResult.rows[0].id;

        await pool.query(
            `DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2`,
            [cartId, productId],
        );

        // restore stock in redis
        await redis.incrBy(`product:${productId}:stock`, 1);

        // invalidate cart cache
        await redis.del(`cart:user:${userId}`);

        return res.status(200).json({ message: "Item removed" });
    } catch (error) {
        console.error("removeFromCart error:", error);
        return res.status(500).json({ message: "Could not remove item" });
    }
};

export default removeFromCart;
