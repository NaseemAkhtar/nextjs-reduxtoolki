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
  let seen = new WeakSet()
  if (doc == null) return doc;

  if (typeof doc !== 'object') return doc;

  if (seen.has(doc)) {
    // Stop infinite recursion for circular refs
    return undefined;
  }

  seen.add(doc);

  if (Array.isArray(doc)) {
    return doc.map((item) => serializeDoc(item));
  }

  const serialized = {};
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
