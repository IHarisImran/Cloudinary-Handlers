import crypto from "crypto";

function createFormData(params) {
    const data = new FormData();

    data.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET);
    data.append('folder', params.folder);
    data.append('file', params.file);

    return data;
};

async function pushCloudinary(params) {
    try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/${params.mediaType}/upload`, { method: 'post', body: createFormData(params) });
        if (res.ok) {
            const data = await res.json();
            return data.public_id;
        } else { return null };
    } catch (err) { return null };
};

async function deleteCloudinary(path, mediaType) {
    try {
        const generateSHA1 = data => {
            const hash = crypto.createHash("sha1");
            hash.update(data);
            return hash.digest("hex");
        };

        const data = new FormData();
        data.append('public_id', path);
        data.append('signature', generateSHA1(`public_id=${path}&timestamp=${new Date().getTime()}${process.env.CLOUDINARY_API_SECRET}`));
        data.append('api_key', process.env.CLOUDINARY_API_KEY);
        data.append('timestamp', new Date().getTime());

        const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/${mediaType}/destroy`, { method: 'post', body: data })

        if (res.ok) { return true }
        else { return null };
    } catch (err) { return null };
};

export { pushCloudinary, deleteCloudinary };