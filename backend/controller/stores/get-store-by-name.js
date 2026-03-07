import pool from "../../db.js";

const getStoreByName = async (req, res) => {
    const { slug } = req.params;
    const {
        category = null,
        brand = null,
        sort = "newest",
        page = 1,
        limit = 12,
    } = req.query;

    const offset = (page - 1) * limit;

    // Map sort param to column + direction
    const sortMap = {
        price_asc: { col: "p.sale_price", dir: "ASC" },
        price_desc: { col: "p.sale_price", dir: "DESC" },
        lowest: { col: "p.sale_price", dir: "ASC" },
        highest: { col: "p.sale_price", dir: "DESC" },
        newest: { col: "p.created_at", dir: "DESC" },
        oldest: { col: "p.created_at", dir: "ASC" },
    };
    const { dir } = sortMap[sort] ?? sortMap["newest"];

    const query = `
    SELECT
        s.id,
        s.name,
        s.slug,
        COALESCE(
            json_agg(p ORDER BY p.sale_price ${dir})
            FILTER (WHERE p.id IS NOT NULL),
            '[]'
        ) AS products,
        COUNT(p.id) AS total_products
    FROM stores s
    LEFT JOIN (
        SELECT
            id, created_at, updated_at, name, description, sku,
            cost_price, sale_price, stock_quantity, main_image,
            image_two, category, status, slug, public_id,
            store_id, low_stock_threshold, discount, created_by, brand
        FROM products
        WHERE store_id = (SELECT id FROM stores WHERE slug = $1)
          AND ($2::text IS NULL OR category = $2::text)
          AND ($3::text IS NULL OR brand = $3::text)
        LIMIT  $4
        OFFSET $5
    ) p ON s.id = p.store_id
    WHERE s.slug = $1
    GROUP BY s.id;
`;

    const { rows } = await pool.query(query, [
        slug,
        category,
        brand,
        limit,
        offset,
    ]);

    if (!rows[0]) return res.status(404).json({ error: "Store not found" });

    // console.log("filtered rows", rows[0].products.length);
    res.json(rows[0]);
};

export default getStoreByName;
