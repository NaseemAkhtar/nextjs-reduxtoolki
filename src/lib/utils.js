import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import moment from "moment";
import axios from "axios";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function dateFormat(str, format="MMMM Do YYYY"){
  let time = moment(str)
  let formatedTime = time.format(format)
  return formatedTime
}


export async function uploadPhoto(photo){
  console.log("cloud error", photo)
  if(!photo) return

  const formData = new FormData()
  formData.append("file", photo)
  formData.append("upload_preset", process.env.NEXT_PUBLIC_UPLOAD_PRESET)

  try{
      let res = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDE_NAME}/image/upload`, formData)
      console.log("res img", res)
      const data = await res.data
      let image = {
          id: data["public_id"],
          url: data["secure_url"]
      }
      return image
  }catch(err){
      console.log("Cloudinary error ",err)
  }
}

export function serializeDoc(doc) {
  if (doc == null) return doc;

  // If it's an array, serialize each item
  if (Array.isArray(doc)) {
    return doc.map(serializeDoc);
  }

  // If it's an object
  if (typeof doc === 'object') {
    const serialized= {};

    for (const [key, value] of Object.entries(doc)) {
      if (key === '_id' && value && typeof value === 'object' && value.toString) {
        serialized._id = value.toString();
      } else if (value instanceof Date) {
        serialized[key] = value.toISOString();
      } else if (typeof value === 'object') {
        serialized[key] = serializeDoc(value);
      } else {
        serialized[key] = value;
      }
    }

    return serialized;
  }

  return doc;
}