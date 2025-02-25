import HomePage from "@/components/home";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();
  console.log(session, "session");
  return (
    <div>
      <HomePage />
    </div>
  );
}
