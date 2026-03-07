import pool from "../../db.js";
// PATCH /api/orders/:orderId/shipping
const addShippingToOrder = async (req, res) => {
    const { orderId } = req.params;
    const { id } = req.user;
    const {
        first_name,
        last_name,
        address,
        province,
        postal_code,
        email,
        phone,
        status,
    } = req.body;

    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        // save shipping address
        const shippingRes = await client.query(
            `INSERT INTO shipping_addresses (user_id, first_name, last_name, address, province, postal_code, email, phone)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
            [
                id,
                first_name,
                last_name,
                address,
                province,
                postal_code,
                email,
                phone,
            ],
        );

        // link it to the order
        // since the shipping address add, and payfast are triggered by the same functions
        // its safe to say we can update the status of the order here to 'awaiting payment'
        await client.query(
            `UPDATE orders SET shipping_address_id = $1, status = $2 WHERE id = $3 AND user_id = $4`,
            [shippingRes.rows[0].id, status, orderId, id],
        );

        await client.query("COMMIT");
        return res.status(200).json({ message: "Shipping saved" });
    } catch (err) {
        await client.query("ROLLBACK");
        console.error("add shpping to order error", err);
        return res.status(400).json({ error: err.message });
    } finally {
        client.release();
    }
};

export default addShippingToOrder;
