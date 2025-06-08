export const uploadToCloudinary = async (file: File): Promise<{ url: string, publicId: string }> => {
    const formData = new FormData();
    formData.append('upload_preset', 'product_images');
    formData.append('file', file);

    try {
        const response = await fetch('https://api.cloudinary.com/v1_1/ddeolv1ol/image/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to upload image');
        }

        const data = await response.json();
        return {
            url: data.secure_url,
            publicId: data.public_id
        };
    } catch (error:any) {
        console.error('Upload error:', error.message);
        throw error;
    }
};
