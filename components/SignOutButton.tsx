import { deleteSessionCookie } from "@/lib/auth";

export default function SignOutButton() {
  async function action() {
    "use server";
    deleteSessionCookie();
  }

  return (
    <form action={action}>
      <button type="submit" className="text-orange-800 hover:underline">
        Sign out
      </button>
    </form>
  );
}
