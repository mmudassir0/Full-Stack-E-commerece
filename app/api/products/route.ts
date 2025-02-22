import { db } from "@/lib/db";
import { ProductQuerySchema } from "@/types/product";
import { z } from "zod";
import { createProduct } from "@/services/productService";

//  --------------------------------------post request-----------------------------------------------------------

export async function POST(req: Request) {
  try {
    // const session = await auth();
    // if (!(session?.user?.role === "ADMIN")) {
    //   return new Response(JSON.stringify({ message: "Unauthorized" }), {
    //     status: 403,
    //   });
    // }

    const formData = await req.formData();
    const product = await createProduct(formData);
    return new Response(JSON.stringify(product), { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          error: "Validation failed",
          details: error.errors,
        }),
        { status: 400 }
      );
    }
    console.error("Error in product creation:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred while creating the product" }),
      { status: 500 }
    );
  }
}

// -------------------------------------------GET Method---------------------------------------------------

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const {
      page,
      limit,
      search,
      category,
      minPrice,
      maxPrice,
      inStock,
      sortBy,
      sortOrder,
    } = ProductQuerySchema.parse(queryParams);

    // calculate pagination
    const offset = (page - 1) * limit;

    // build where clause

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereClause: any = {};

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { brand: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category) {
      whereClause.categories = {
        some: { id: category },
      };
    }
    if (minPrice !== undefined) {
      whereClause.basePrice = { gte: minPrice };
    }
    if (maxPrice !== undefined) {
      whereClause.basePrice = {
        ...whereClause.basePrice,
        lte: maxPrice,
      };
    }

    if (inStock !== undefined) {
      whereClause.isInStock = inStock;
    }

    const [products, totalCount] = await Promise.all([
      db.product.findMany({
        where: whereClause,
        include: {
          categories: true,
          productImages: {
            where: { isPrimary: true },
            take: 1,
          },
          variants: {
            select: {
              color: true,
              size: true,
              stockQuantity: true,
            },
          },
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip: offset,
        take: limit,
      }),
      db.product.count({ where: whereClause }),
    ]);
    const totalPages = Math.ceil(totalCount / limit);

    return Response.json({
      data: products,
      meta: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
    // const res = await db.product.findMany({
    //   include: { categories: true, productImages: true, variants: true },
    //   orderBy: {
    //     createdAt: "desc",
    //   },
    // });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        {
          error: "invalid query parameters",
          details: error.errors,
        },
        { status: 400 }
      );
    }
    console.error("Error fetching products");

    return Response.json(
      {
        error: "Failed to fetch products",
      },
      { status: 500 }
    );
  }
}
