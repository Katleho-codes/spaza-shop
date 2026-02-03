import pool from "../../db.js";
import * as Yup from "yup";
import "dotenv/config";
import datetime from "../../utils/datetime.js";
import crypto from "crypto";
import { getRedisClient } from "../../config/redis.js";

const createProductSchema = Yup.object({
    name: Yup.string()
        .required("The name is required")
        .min(3, "Cannot be less than 3 characters")
        .max(100, "Cannot be more than 100 characters"),
    description: Yup.string().required("The description is required"),
    cost_price: Yup.number().required("The cost price is required"),

    sale_price: Yup.number()
        .required()
        .test(
            "sale-greater-than-cost",
            "Sale price must be greater than or equal to cost price",
            function (value) {
                const { cost_price } = this.parent;

                // if one is missing, skip this test
                if (value == null || cost_price == null) return true;

                return value >= cost_price;
            },
        ),
    stock_quantity: Yup.number().required("The stock quantity is required"),
    main_image: Yup.string(),
    image_two: Yup.string(),
    category: Yup.string(),
    low_stock_threshold: Yup.number().required(
        "The low stock threshold is required",
    ),
});

const redis = await getRedisClient();

const createProduct = async (req, res) => {
    const {
        name,
        description,
        cost_price,
        sale_price,
        stock_quantity,
        main_image,
        image_two,
        category,
        store_id,
        low_stock_threshold,
    } = req.body;

    const created_at = datetime;
    const sku = "SKU-" + crypto.randomBytes(4).toString("hex").toUpperCase();
    const publicId = "PID" + crypto.randomInt(10_000_000, 100_000_000);
    const slug = name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "") // remove special chars
        .replace(/\s+/g, "-") // spaces → hyphens
        .replace(/-+/g, "-"); // collapse dashes

    try {
        await createProductSchema.validate(req.body, { abortEarly: false });
        const { rows } = await pool.query(
            "insert into products (created_at, name, description, sku, cost_price, sale_price, stock_quantity, main_image, image_two, category, slug, public_id, store_id, low_stock_threshold) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) returning id, created_at, name, description, sku, cost_price, sale_price, stock_quantity, main_image, image_two, category, slug, public_id, store_id, low_stock_threshold",
            [
                created_at,
                name,
                description,
                sku,
                cost_price,
                sale_price,
                stock_quantity,
                main_image,
                image_two,
                category,
                slug,
                publicId,
                store_id,
                low_stock_threshold,
            ],
        );
        const product = rows[0];
        // Store product metadata (NO stock mutation here)
        await redis.set(
            `product:${product.id}:data`,
            JSON.stringify({
                id: product.id,
                name: product.name,
                description: product.description,
                sku: product.sku,
                sale_price: product.sale_price,
                main_image: product.main_image,
                image_two: product.image_two,
                category: product.category,
                slug: product.slug,
                public_id: product.public_id,
                store_id: product.store_id,
            }),
        );
        // Store stock as atomic integer
        await redis.set(`product:${product.id}:stock`, product.stock_quantity);
        await redis.set(
            `product:${product.id}:threshold`,
            product.low_stock_threshold,
        );
        return res.status(201).json({
            message: "Product successfuly created",
            rows: rows[0],
        });
    } catch (error) {
        process.env.NODE_ENV === "development"
            ? console.log("add product error", error)
            : null;
        // Handle validation or other errors
        const errors = {};
        if (error.inner) {
            error.inner.forEach((err) => {
                errors[err.path] = err.message; // Collect field validation errors
            });
            return res.status(400).json({ errors });
        }
        res.status(500).json({ message: "Product not added, try again" });
    }
};

export default createProduct;
