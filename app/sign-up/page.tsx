import type { Metadata } from "next";
import Link from "next/link";
import Heading from "@/components/Heading";
import SignUpForm from "@/components/SignUpForm";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function SignUpPage() {
  return (
    <>
      <Heading>Sign Up</Heading>
      <SignUpForm />
      <div className="py-3">
        Already registered?{" "}
        <Link href="/sign-in" className="text-orange-800 hover:underline">
          Sign in
        </Link>{" "}
        instead
      </div>
    </>
  );
}
