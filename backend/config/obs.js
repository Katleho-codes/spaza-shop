import ObsClient from "esdk-obs-nodejs";
import "dotenv/config";

const obs = new ObsClient({
    access_key_id: process.env.OBS_ACCESS_KEY,
    secret_access_key: process.env.OBS_SECRET_KEY,
    server: process.env.OBS_ENDPOINT, // e.g. https://obs.af-south-1.myhuaweicloud.com
});

export default obs;
