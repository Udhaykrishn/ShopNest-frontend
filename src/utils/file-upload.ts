import { supabaseClient } from '@/lib/supbase-client';
import { v4 as uuidv4 } from 'uuid';

const BUCKET_NAME = 'first-project';

export const uploadToSupabase = async (file: any): Promise<{ url: string, path: string }> => {
    console.log("Uploading file:", {
        name: file.name,
        type: file.type,
        size: file.size,
    });

    const fileType = file.type.toLowerCase();
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];

    console.log("File type for the image is:", fileType);
    if (!fileType || !allowedTypes.includes(fileType)) {
        throw new Error('Only PNG, JPG, and JPEG formats are supported.');
    }

    const fileExt = file.name.split('.').pop()?.toLowerCase() || fileType.split('/')[1];
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error } = await supabaseClient.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
            contentType: fileType,
        });

    if (error) {
        throw new Error(`Upload failed: ${error.message}`);
    }

    const { data } = supabaseClient.storage.from(BUCKET_NAME).getPublicUrl(filePath);
    const publicUrl = data?.publicUrl || '';

    console.log("Uploaded successfully. Public URL:", publicUrl);
    return {
        url: publicUrl,
        path: filePath
    };
};