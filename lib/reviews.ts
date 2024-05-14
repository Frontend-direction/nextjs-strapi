import { readdir } from "node:fs/promises";
import { marked } from "marked";
import qs from "qs";

const CMS_URL = "http://localhost:1337";

interface CmsItem {
  id: number;
  attributes: any;
}

export interface Review {
  slug: string;
  title: string;
  date: string;
  image: string;
  subtitle: string;
}

export interface FullReview extends Review {
  body: string | Promise<string>;
}

export async function getReview(slug: string): Promise<FullReview> {
  const { data } = await fetchReviews({
    filters: { slug: { $eq: slug } },
    fields: ["slug", "title", "subtitle", "publishedAt", "body"],
    populate: { image: { fields: ["url"] } },
    pagination: { pageSize: 1, withCount: false },
  });
  const { attributes } = data[0];
  return {
    ...toReview(data[0]),
    body: marked(attributes.body),
  };
}

export async function getReviews(pageSize: number): Promise<Review[]> {
  const { data } = await fetchReviews({
    fields: ["slug", "title", "subtitle", "publishedAt"],
    populate: { image: { fields: ["url"] } },
    sort: ["publishedAt:desc"],
    pagination: { pageSize },
  });

  return data.map(toReview);
}

async function fetchReviews(parameters: any) {
  const url =
    `${CMS_URL}/api/reviews?` +
    qs.stringify(parameters, { encodeValuesOnly: true });
  console.log("[fetchReviews]:", url);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`CMS returned ${response.status} for ${url}`);
  }
  return await response.json();
}

export async function getSlugs(): Promise<string[]> {
  // const files = await readdir("./content/reviews");
  // return files
  //   .filter((file) => file.endsWith(".md"))
  //   .map((file) => file.slice(0, -".md".length));
  const { data } = await fetchReviews({
    fields: ["slug"],
    sort: ["publishedAt:desc"],
    pagination: { pageSize: 100 },
  });
  return data.map((item: CmsItem) => item.attributes.slug);
}

function toReview(item: CmsItem): Review {
  const { attributes } = item;

  return {
    slug: attributes.slug,
    title: attributes.title,
    subtitle: attributes.subtitle,
    date: attributes.publishedAt.slice(0, "yyyy-mm-dd".length),
    image: CMS_URL + attributes.image.data.attributes.url,
  };
}
