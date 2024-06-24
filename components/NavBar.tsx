import NavLink from "./NavLink";
import { getUserFromSession } from "@/lib/auth";
import SignOutButton from "./SignOutButton";

export default async function NavBar() {
  const user = await getUserFromSession();
  return (
    <nav>
      <ul className="flex gap-2">
        <li>
          <NavLink href="/">Indie Gamer</NavLink>
        </li>
        <li className="ml-auto">
          <NavLink href="/reviews">Reviews</NavLink>
        </li>
        <li>
          <NavLink href="/about" prefetch={false}>
            About
          </NavLink>
        </li>
        {user ? (
          <SignOutButton />
        ) : (
          <li>
            <NavLink href="/sign-in">Sign in</NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}
