import pool from "../../db.js";
import { io } from "../../services/io.js";

const cancelOrder = async (req, res) => {
    const { id: orderId } = req.params;
    const { id } = req.user;
    const { status } = req.body;
    if (!id) return;
    try {
        const findOrder = await pool.query(
            "select id from orders where id = $1",
            [orderId],
        );
        if (findOrder.rows.length === 0) {
            return res.status(404).json({ message: "Order not found" });
        }
        const updateOrderStatus = await pool.query(
            "update orders set status = $1 where id = $2 and user_id = $3 returning id as order_id, status",
            [status, orderId, id],
        );
        // emit updated cart to user's room
        io.to(`user:${id}`).emit("order:canceled", updateOrderStatus.rows[0]);
        return res.status(201).json({ message: "Order canceled" });
    } catch (error) {
        console.error("cancelOrder error", error);
        return res.status(500).json({ message: "Could not cancel order" });
    }
};

export default cancelOrder;
