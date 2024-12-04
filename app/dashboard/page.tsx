import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">
        Welcome, {session.user?.name || session.user?.email}
      </h1>
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button
          type="submit"
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </form>
    </div>
  );
}
