import { db } from "@/lib/db";

// post

export async function POST(req: Request) {
  const body = await req.json();
  const res = await db.category.create({
    data: body,
  });

  return Response.json(res);
}

// get

export async function GET() {
  const res = await db.category.findMany();
  return Response.json(res);
}
