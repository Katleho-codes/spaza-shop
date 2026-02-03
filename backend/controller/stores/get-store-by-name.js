// will get store by name (slug)
// this is for when user clicks one of the store cards on the ui
// this will then bring them to the stores items
// also available without auth
//  should also fetch the stores products

import pool from "../../db.js";

const getStoreByName = async (req, res) => {
    const { slug } = req.params;
    try {
        const { rows } = await pool.query(
            `SELECT
  s.id,
  s.name,
  s.slug,
  COALESCE(
    json_agg(
      json_build_object(
        'id', p.id,
        'name', p.name,
        'description', p.description,
        'sku', p.sku,
        'sale_price', p.sale_price,
        'main_image', p.main_image,
        'image_two', p.image_two,
        'slug', p.slug
      )
    ) FILTER (WHERE p.id IS NOT NULL),
    '[]'
  ) AS products
FROM stores s
LEFT JOIN products p
  ON s.id = p.store_id
  where s.slug = $1
GROUP BY s.id;

            `,
            [slug],
        );
        return res.status(200).json(rows);
    } catch (error) {
        console.log("get-store-by-name.js error", error);
        return res.status(500).json({
            message: "Internal server error",
            error:
                process.env.NODE_ENV === "production"
                    ? undefined
                    : error.message, // Hide detailed error message in production
        });
    }
};

export default getStoreByName;
