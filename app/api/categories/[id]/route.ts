import { db } from "@/lib/db";

// update

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const { name } = await req.json();

  const res = await db.category.update({
    where: {
      id,
    },
    data: { name },
  });
  console.log(params, "params");
  return Response.json(res);
}

//delete

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const res = await db.category.delete({
    where: { id },
  });

  return Response.json({ message: "deelted successfully", res });
}
