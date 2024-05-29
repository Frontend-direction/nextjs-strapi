import type { ReactNode } from "react";
import Heading from "../components/Heading";
import Link from "next/link";
import Image from "next/image";
import { getReviews } from "@/lib/reviews";

interface LayoutProps {
  children: ReactNode;
}

export default async function HomePage() {
  const { reviews } = await getReviews(3);

  return (
    <>
      <Heading>Indie Gamer</Heading>
      <p className="pb-3">Only the best indie games, reviewed for you.</p>
      <ul className="flex gap-3 flex-col">
        {reviews.map((review, index) => {
          return (
            <li
              key={review.slug}
              className="bg-white border rounded shadow w-80
                            hover:shadow-xl sm:w-full"
            >
              <Link
                href={`/reviews/${review.slug}`}
                className="flex flex-col sm:flex-row"
              >
                <Image
                  priority={index === 0}
                  src={review.image}
                  alt=""
                  width="320"
                  height="180"
                  className="rounded-t sm:rounded-l sm:rounded-r-none"
                />
                <div className="px-2 py-1 text-center sm:text-left">
                  <h2 className="font-orbitron font-semibold">
                    {review.title}
                  </h2>
                  <p className="hidden pt-2 sm:block">{review.subtitle}</p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
