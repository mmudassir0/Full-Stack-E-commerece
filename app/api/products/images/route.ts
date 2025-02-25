import { db } from "@/lib/db";
import { uploadToCloudinary } from "./upload";

export async function POST(req: Request) {
  // your auth check here if required

  const formData = await req.formData();

  const file = formData.get("file") as File;

  const fileBuffer = await file.arrayBuffer();

  const mimeType = file.type;
  const encoding = "base64";
  const base64Data = Buffer.from(fileBuffer).toString("base64");

  const fileUri = "data:" + mimeType + ";" + encoding + "," + base64Data;

  const res = await uploadToCloudinary(fileUri, file.name);
  if (res.success && res.result) {
    await db.productImage.create({
      data: {
        url: res.result.secure_url,
        alt: "myimage",
        productId: "1345678765432",
      },
    });
    return Response.json({
      message: "success",
      imgUrl: res.result.secure_url,
    });
  } else return Response.json({ message: "failure" });
}
