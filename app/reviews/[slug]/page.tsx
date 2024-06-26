import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getReview, getSlugs } from "@/lib/reviews";
import Heading from "../../../components/Heading";
import ShareLinkButton from "@/components/ShareLinkButton";
import { ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/outline";
import CommentList from "@/components/CommentList";
import CommentForm from "@/components/CommentForm";
import { Suspense } from "react";
import CommentListSkeleton from "@/components/CommentListSkeleton";
import { getUserFromSession } from "@/lib/auth";
import Link from "next/link";

interface ReviewPageParams {
  slug: string;
}

interface ReviewPageProps {
  params: ReviewPageParams;
}

export async function generateMetadata({
  params: { slug },
}: ReviewPageProps): Promise<Metadata> {
  const review = await getReview(slug);

  if (!review) {
    notFound();
  }

  return {
    title: review.title,
  };
}

export async function generateStaticParams(): Promise<ReviewPageParams[]> {
  const slugs = await getSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function StardewValleyPage({
  params: { slug },
}: ReviewPageProps) {
  const review = await getReview(slug);
  const user = await getUserFromSession();

  if (!review) {
    notFound();
  }

  return (
    <>
      <Heading>{review.title}</Heading>
      <p className="font-semibold pb-3">{review.subtitle}</p>
      <div className="flex gap-3 items-baseline">
        <p className="italic pb-2">{review.date}</p>
        <ShareLinkButton />
      </div>
      <Image
        src={review.image}
        alt=""
        width="640"
        height="360"
        className="mb-2 rounded"
        priority
      />
      <article
        className="max-w-screen-sm prose prose-slate"
        dangerouslySetInnerHTML={{ __html: review.body }}
      />

      <section className="border-dashed border-t max-w-screen-sm mt-3 py-3">
        <h2 className="font-bold flex gap-2 items-center text-xl">
          <ChatBubbleBottomCenterTextIcon className="h-6 w-6" />
          Comments
        </h2>
        {user ? (
          <CommentForm slug={slug} title={review.title} userName={user.name} />
        ) : (
          <div className="border bg-white mt-3 px-3 py-3 rounded">
            <Link href="/sign-in" className="text-orange-800 hover:underline">
              Sign in
            </Link>{" "}
            to have your say!
          </div>
        )}
        <Suspense fallback={<CommentListSkeleton />}>
          <CommentList slug={slug} />
        </Suspense>
      </section>
    </>
  );
}
