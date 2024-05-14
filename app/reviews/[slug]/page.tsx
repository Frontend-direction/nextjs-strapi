import { Metadata } from "next";
import Image from "next/image";
import { getReview, getSlugs } from "@/lib/reviews";
import Heading from "../../../components/Heading";
import ShareLinkButton from "@/components/ShareLinkButton";

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
    </>
  );
}
