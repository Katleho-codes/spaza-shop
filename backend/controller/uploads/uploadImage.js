import obs from "../../config/obs.js";
import crypto from "crypto";
import pool from "../../db.js";
import path from "path";
import "dotenv/config";
const uploadStoreImage = async (req, res) => {
    const { id: userId } = req.user;
    try {
        if (!req.file)
            return res.status(400).json({ error: "No file provided" });

        const { type, id } = req.query;

        if (!type || !id) {
            return res.status(400).json({ error: "type and id are required" });
        }

        const ext =
            path.extname(req.file.originalname).slice(1).toLowerCase() ||
            req.file.mimetype.split("/")[1];

        // use filename as the key — consistent between upload and URL
        const filename = `${type}s/${id}/${crypto.randomBytes(8).toString("hex")}.${ext}`;


        // upload to OBS
        await new Promise((resolve, reject) => {
            obs.putObject(
                {
                    Bucket: process.env.OBS_BUCKET,
                    Key: filename, // consistent key
                    Body: req.file.buffer,
                    ContentType: req.file.mimetype,
                    ACL: obs.enums.AclPublicRead,
                    ContentDisposition: "inline",
                },
                (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    if (result.CommonMsg.Status >= 300) {
                        return reject(
                            new Error(`OBS error: ${result.CommonMsg.Message}`),
                        );
                    }
                    resolve(result);
                },
            );
            // obs.close() removed — was killing connection mid-upload
        });

        // strip protocol from endpoint in case it's included
        const endpoint = process.env.OBS_ENDPOINT.replace(
            "https://",
            "",
        ).replace("http://", "");

        const imageUrl = `https://${process.env.OBS_BUCKET}.${endpoint}/${filename}`;


        if (type === "product") {
            await pool.query(
                `UPDATE products SET main_image = $1 WHERE id = $2`,
                [imageUrl, id],
            );
        } else if (type === "store") {
            await pool.query(
                `UPDATE stores SET banner_url = $1 WHERE id = $2`,
                [imageUrl, id],
            );
        }

        return res.status(200).json({ url: imageUrl });
    } catch (err) {
        console.error("Upload error:", err);
        return res.status(500).json({ error: err.message });
    }
};
export default uploadStoreImage;
