const cloudinary = require('cloudinary').v2;

cloudinary.config({
    secure: true,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const pushToCloudinary = async ({ resource_type, folder, content }) => {
    try {
        const result = await cloudinary.uploader.upload(content, { resource_type, folder, chunk_size: 6000000 });
        if (result) {
            const { public_id } = result;
            return public_id;
        };
        throw new Error("Failed to push to Cloudinary");
    } catch (err) { console.log(err) };
};

async function popFromCloudinary(public_id, resource_type) {
    try {
        const result = await cloudinary.uploader.destroy(public_id, { resource_type });
        return result?.result === 'ok';
    } catch (err) { console.log(err) };
};

module.exports = { pushToCloudinary, popFromCloudinary };