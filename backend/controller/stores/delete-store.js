import pool from "../../db.js";
import { getRedisClient } from "../../config/redis.js";

const redis = await getRedisClient();
const deleteStore = async (req, res) => {
    const storeId = req.store.id;
    const { id: userId } = req.user;

    try {
        // double check — only owner can delete
        if (req.store.owner_id !== userId) {
            return res.status(403).json({
                message: "Only the store owner can delete this store",
            });
        }

        await pool.query(`DELETE FROM stores WHERE id = $1`, [storeId]);

        // clear all related cache
        await redis.del(`store:${req.params.slug}`);
        await redis.del(`stores:user:${userId}`);

        return res.json({ message: "Store deleted" });
    } catch (err) {
        console.error("deleteStore error:", err);
        return res.status(500).json({ message: "Could not delete store" });
    }
};

export default deleteStore;
