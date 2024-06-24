import type { Metadata } from "next";
import Link from "next/link";
import Heading from "@/components/Heading";
import SignInForm from "@/components/SignInForm";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function SignInPage() {
  return (
    <>
      <Heading>Sign In</Heading>
      <SignInForm />
      <div className="py-3">
        Not yet registered?{" "}
        <Link href="/sign-up" className="text-orange-800 hover:underline">
          Sign up
        </Link>{" "}
        instead
      </div>
    </>
  );
}
