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
      folder: "images",
      public_id: `${uuidv4()}`,
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

  public static validateImage(imageFile: File) {
    if (!this.VALID_IMAGE_TYPES.includes(imageFile.type)) {
      throw new Error("Invalid image type");
    }

    if (imageFile.size > this.MAX_FILE_SIZE) {
      throw new Error("Image size too large");
    }
  }

  static async deleteImage(publicId: string) {
    try {
      if (!publicId) return;

      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === "ok";
    } catch (error) {
      console.error("[CLOUDINARY_DELETE_ERROR]:", error);
      throw new Error("Failed to delete previous image");
    }
  }
  // Helper to extract publicId from URL
  static getPublicIdFromUrl(url: string): string | null {
    try {
      const urlParts = url.split("/");
      const imagesPart = urlParts.findIndex((part) => part === "images");
      if (imagesPart === -1) return null;

      const fileNameWithExtension = urlParts[imagesPart + 1];
      return `images/${fileNameWithExtension.split(".")[0]}`;
    } catch {
      return null;
    }
  }
}
