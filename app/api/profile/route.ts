import { db } from "@/lib/db";
import { ImageUploadService } from "@/services/imageUploadService";

export const POST = async (req: Request) => {
  try {
    const formData = await req.formData();

    const userId = formData.get("userId") as string;
    const imageFile = formData.get("image") as File;

    // Get current user profile to find previous image
    const currentProfile = await db.profile.findUnique({
      where: { userId },
      select: { profileImageUrl: true },
    });

    const uploadedImage = await ImageUploadService.uploadImage(imageFile);

    if (currentProfile?.profileImageUrl) {
      const previousImageId = ImageUploadService.getPublicIdFromUrl(
        currentProfile.profileImageUrl
      );
      if (previousImageId) {
        await ImageUploadService.deleteImage(previousImageId);
      }
    }

    // Update profile with new image
    await db.profile.update({
      where: { userId },
      data: { profileImageUrl: uploadedImage.url },
    });
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (error) {
    console.log(error, " upload image failed");
    return new Response(
      JSON.stringify({
        error: "upload image failed " + (error as Error).message,
      }),
      {
        status: 200,
      }
    );
  }
};
