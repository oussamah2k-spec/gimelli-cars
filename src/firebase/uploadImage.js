const CLOUD_NAME = 'dsotm14mm';
const UPLOAD_PRESET = 'unsigned_upload';
const UPLOAD_FOLDER = 'client2-cars';

function getUploadEndpoint() {
  return `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
}

export function getCloudinaryConfigStatus() {
  return {
    cloudName: CLOUD_NAME,
    uploadPreset: UPLOAD_PRESET,
    folder: UPLOAD_FOLDER,
    isConfigured: true,
  };
}

export async function uploadImages(files = []) {
  if (!Array.isArray(files) || files.length === 0) {
    return [];
  }

  const uploads = await Promise.all(
    files.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);
      formData.append('folder', UPLOAD_FOLDER);

      const response = await fetch(getUploadEndpoint(), {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Image upload failed with status ${response.status}.`);
      }

      const result = await response.json();

      return {
        url: result.secure_url,
        publicId: result.public_id,
      };
    })
  );

  return uploads;
}