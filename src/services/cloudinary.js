import axios from 'axios'

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

/**
 * Uploads a single image file to Cloudinary using an unsigned upload
 * preset and returns its hosted URL.
 *
 * Not called anywhere yet — complaint submission (and its use of this
 * function) is a later milestone. This just wires up the service.
 */
export async function uploadImage(file) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)

  const { data } = await axios.post(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    formData
  )

  return data.secure_url
}
