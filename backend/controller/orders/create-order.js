import pool from "../../db.js";
import * as Yup from "yup";
import "dotenv/config";
import crypto from "crypto";
import datetime from "../../utils/datetime.js";
import { getRedisClient } from "../../config/redis.js";
import { Resend } from "resend";

const createOrderSchema = Yup.object({
    quantity: Yup.number("Cannot be less than 0"),
});
const redis = await getRedisClient();
const resend = new Resend(process.env.RESEND_TOKEN);

const createOrder = async (req, res) => {
    const { product_id, total_amount, quantity } = req.body;
    const { user_id } = req.user;
    const created_at = datetime;
    const orderStatus = "pending";
    const orderRef =
        "ORD-" + crypto.randomBytes(4).toString("hex").toUpperCase();

    // every order will be free shipping when over or equal to 500
    // minimum than that will be 50

    try {
        await createOrderSchema.validate(req.body, { abortEarly: false });

        // reserve stock FIRST
        // redis doesn’t stop negative numbers
        //  we decrement first to lock stock atomically
        const remainingStock = await redis.decrBy(
            `product:${product_id}:stock`,
            quantity,
        );

        // If stock goes negative, then rollback
        // preventing overselling
        if (remainingStock < 0) {
            await redis.incrBy(`product:${product_id}:stock`, quantity);
            return res.status(409).json({ message: "Out of stock" });
        }

        // create order
        const { rows } = await pool.query(
            `
            BEGIN;
            insert into orders (created_at, user_id, product_id, total_amount, quantity, status, order_number) values ($1, $2, $3, $4, $5, $6, $7) returning id, created_at, user_id, product_id, total_amount, quantity, status, currency, order_number
            COMMIT;
            `,
            [
                created_at,
                user_id,
                product_id,
                total_amount,
                quantity,
                orderStatus,
                orderRef,
            ],
        );

        // quantity =  6
        // in stock is 4

        // if quantity requested does not match stocki hand, flag 'out of stock'
        // then update db table products

        const productName = await pool.query(
            "select name from products where id = $1 limit 1",
            [product_id],
        );
        // low-stock alert (AFTER decrement)
        const lowThreshold = await redis.get(`product:${product_id}:threshold`);
        if (lowThreshold && remainingStock <= Number(lowThreshold)) {
            const { rows } = await pool.query(
                `select email from "user" where id = $1`,
                [user_id],
            );
            const { data, error } = await resend.emails.send({
                from: "Deliva <onboarding@resend.dev>",
                to: [rows[0]?.email],
                subject: "Stock threshold met",
                html: `<p>The product '<strong>${productName?.rows[0]?.name}</strong>' Almost out of stock. Threshold met</p>`,
            });

            if (error) {
                return res.status(400).json({ error });
            }
        }

        // cache order
        await redis.set(`order:${rows[0].id}`, JSON.stringify(rows[0]), {
            EX: 60 * 60,
        });

        return res.status(201).json({
            message: "Order successfuly created",
            rows: rows[0],
        });
    } catch (error) {
        await client.query("ROLLBACK");
        process.env.NODE_ENV === "development"
            ? console.log("add order error", error)
            : null;
        // Handle validation or other errors
        const errors = {};
        if (error.inner) {
            error.inner.forEach((err) => {
                errors[err.path] = err.message; // Collect field validation errors
            });
            return res.status(400).json({ errors });
        }
        res.status(500).json({ message: "Order not added, try again" });
    }
};

export default createOrder;
