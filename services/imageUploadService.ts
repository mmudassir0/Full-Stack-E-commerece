import cloudinary from "@/lib/cloudinary";
import { v4 as uuidv4 } from "uuid";

export class ImageUploadService {
  private static VALID_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ];
  private static MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  static async uploadImage(imageFile: File) {
    // Validate image type and size
    this.validateImage(imageFile);

    // Convert to base64
    const fileBuffer = await imageFile.arrayBuffer();
    const mimeType = imageFile.type;
    const base64Data = Buffer.from(fileBuffer).toString("base64");
    const fileUri = `data:${mimeType};base64,${base64Data}`;

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(fileUri, {
      folder: "product-images",
      public_id: `product-${uuidv4()}`,
      transformation: [
        { width: 800, crop: "limit" },
        { quality: "auto" },
        { fetch_format: "auto" },
      ],
      resource_type: "auto",
    });

    return {
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    };
  }

  private static validateImage(imageFile: File) {
    if (!this.VALID_IMAGE_TYPES.includes(imageFile.type)) {
      throw new Error("Invalid image type");
    }

    if (imageFile.size > this.MAX_FILE_SIZE) {
      throw new Error("Image size too large");
    }
  }
}
