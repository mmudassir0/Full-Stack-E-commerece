import { db } from "@/lib/db";

async function main() {
  // Seed categories
  await db.category.createMany({
    data: [
      { id: "cat1", name: "Electronics" },
      { id: "cat2", name: "Fashion" },
      { id: "cat3", name: "Home Appliances" },
    ],
  });

  // Seed users
  await db.user.create({
    data: {
      email: "test@example.com",
      password: "hashedpassword", // Always hash passwords!
      name: "Test",
    },
  });
}

main()
  .catch((e) => console.error(e))
  .finally(() => db.$disconnect());
