import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function HomePage() {
  return (
    <>
      <h1>Indie Gamer</h1>
      <p>Only the best indie games, reviewed for you.</p>
    </>
  );
}
