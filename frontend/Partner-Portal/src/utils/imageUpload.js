/**
 * Utility to upload images to ImgBB (Free alternative to Firebase Storage)
 * Get your API key from https://imgbb.com/
 */

const IMGBB_API_KEY = '4089d40c1092211a727063c9f886972a'; // User's API key

export const uploadImageToImgBB = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      return data.data.url;
    } else {
      throw new Error(data.error.message || 'ImgBB upload failed');
    }
  } catch (error) {
    console.error('Error uploading to ImgBB:', error);
    throw error;
  }
};
