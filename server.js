const cloudinary = require('cloudinary').v2,
    { createHash } = require('node:crypto');

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
    } catch (err) {
        console.log(err);
        return null;
    };
};

async function popFromCloudinary(path, mediaType) {
    try {
        const generateSHA1 = data => {
            const hash = createHash("sha1");
            hash.update(data);
            return hash.digest("hex");
        };

        const data = new FormData();
        data.append('public_id', path);
        data.append('signature', generateSHA1(`public_id=${path}&timestamp=${new Date().getTime()}${process.env.CLOUDINARY_API_SECRET}`));
        data.append('api_key', process.env.CLOUDINARY_API_KEY);
        data.append('timestamp', new Date().getTime());

        const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/${mediaType}/destroy`, { method: 'post', body: data })

        return res.ok ? true : false;
    } catch (err) {
        console.log(err);
        return false;
    };
};

module.exports = { pushToCloudinary, popFromCloudinary };