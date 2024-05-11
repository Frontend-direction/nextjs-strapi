import type { ReactNode } from "react";
import Heading from "../components/Heading";

interface LayoutProps {
  children: ReactNode;
}

export default function HomePage() {
  return (
    <>
      <Heading>Indie Gamer</Heading>
      <p>Only the best indie games, reviewed for you.</p>
    </>
  );
}
