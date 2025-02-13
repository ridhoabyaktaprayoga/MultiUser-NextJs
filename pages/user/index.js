import { useSession } from "next-auth/react";

export default function UserPage() {
  const { data: session } = useSession();

  return (
    <div>
      <h1>User Page</h1>
      <p>Welcome, {session?.user?.name}</p>
    </div>
  );
}
