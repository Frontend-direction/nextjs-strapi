import { readdir, readFile } from "node:fs/promises";
import matter from "gray-matter";
import { marked } from "marked";

export interface Review {
  slug: string;
  title: string;
  date: string;
  image: string;
  body: string | Promise<string>;
}

export async function getFeaturedReview(): Promise<Review> {
  const [firstReview] = await getReviews();

  return firstReview;
}

export async function getReview(slug: string): Promise<Review> {
  const text = await readFile(`./content/reviews/${slug}.md`, "utf8");
  const {
    content,
    data: { title, date, image },
  } = matter(text);
  const body = marked(content);
  return { title, date, image, body, slug };
}

export async function getReviews(): Promise<Review[]> {
  const slugs = await getSlugs();
  const reviews: Review[] = [];
  for (const slug of slugs) {
    const review = await getReview(slug);
    reviews.push(review);
  }
  return reviews.sort((a, b) => a.date.localeCompare(b.date));
}

export async function getSlugs(): Promise<string[]> {
  const files = await readdir("./content/reviews");
  return files
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.slice(0, -".md".length));
}
