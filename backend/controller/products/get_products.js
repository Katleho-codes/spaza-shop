import { getRedisClient } from "../../config/redis.js";
import pool from "../../db.js";
// this gets all products (used for public view)
// with redis cache

const redis = await getRedisClient();

const getProducts = async (req, res) => {
    let { page = 1, limit = 20 } = req.query;

    // Parse and validate `page` and `limit`
    page = Math.max(parseInt(page, 20), 1); // Ensure `page` is at least 1
    limit = Math.max(parseInt(limit, 20), 1); // Ensure `limit` is at least 1
    const offset = (page - 1) * limit;

    const cacheKey = `products:page:${page}:limit:${limit}`;

    try {
        // try cache
        const cached = await redis.get(cacheKey);
        if (cached) return res.status(200).json(JSON.parse(cached));

        const { rows } = await pool.query(
            `SELECT
  p.category,
  json_agg(
    json_build_object(
      'id', p.id,
      'name', p.name,
      'sale_price', p.sale_price,
      'main_image', p.main_image,
      'slug', p.slug
    )
  ) AS products
FROM products p
GROUP BY p.category
ORDER BY p.category DESC LIMIT $1 OFFSET $2`,
            [limit, offset],
        );

        // Fetch the total count of products
        const total = await pool.query("SELECT COUNT(*) FROM products");
        const totalStores = parseInt(total.rows[0].count, 10);

        const response = {
            data: rows,
            meta: {
                currentPage: page,
                totalPages: Math.ceil(totalStores / limit),
                totalStores,
            },
        };

        // cache result
        // this expires
        await redis.setEx(cacheKey, 60, JSON.stringify(response));
        return res.status(200).json(response);
    } catch (error) {
        console.log("get-products.js error", error);
        return res.status(500).json({
            message: "Internal server error",
            error:
                process.env.NODE_ENV === "production"
                    ? undefined
                    : error.message, // Hide detailed error message in production
        });
    }
};

export default getProducts;
