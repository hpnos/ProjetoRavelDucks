import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/lib/firebase/storage";

export type UploadFolder = "cards" | "ducks" | "ducks/gifs" | "packs";

interface UploadImageInput {
  file: File;
  folder: UploadFolder;
  fileName: string;
}

export interface UploadImageResult {
  imageUrl: string;
  imagePath: string;
}

export async function uploadImage(
  input: UploadImageInput
): Promise<UploadImageResult> {
  const extension = input.file.name.split(".").pop() ?? "png";

  const safeFileName = input.fileName
    .trim()
    .toLowerCase()
    .replaceAll(" ", "-")
    .replaceAll("/", "-");

  const imagePath = `${input.folder}/${safeFileName}.${extension}`;

  const imageRef = ref(storage, imagePath);

  await uploadBytes(imageRef, input.file);

  const imageUrl = await getDownloadURL(imageRef);

  return {
    imageUrl,
    imagePath,
  };
}
