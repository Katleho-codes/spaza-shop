import pool from "../../db.js";
import { getRedisClient } from "../../config/redis.js";

const redis = await getRedisClient();

const updateCart = async (req, res) => {
    const { user_id, product_id, quantity } = req.body;

    if (quantity < 0) {
        return res.status(400).json({ message: "Invalid quantity" });
    }

    try {
 
        const cartRes = await pool.query(
            `SELECT id FROM carts WHERE user_id = $1 AND status = 'active'`,
            [user_id],
        );

        if (cartRes.rows.length === 0) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const cart_id = cartRes.rows[0].id;


        if (quantity === 0) {
            await pool.query(
                `DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2`,
                [cart_id, product_id],
            );
        } else {
            await pool.query(
                `
                UPDATE cart_items
                SET quantity = $1, updated_at = NOW()
                WHERE cart_id = $2 AND product_id = $3
                `,
                [quantity, cart_id, product_id],
            );
        }

      
        await redis.del(`cart:user:${user_id}`);

        return res.status(200).json({ message: "Cart updated" });
    } catch (error) {
        console.error("updateCart error", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default updateCart;
