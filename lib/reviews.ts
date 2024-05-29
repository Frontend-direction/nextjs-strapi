import { readdir } from "node:fs/promises";
import { marked } from "marked";
import qs from "qs";

const CMS_URL = "http://localhost:1337";

export const CACHE_TAG_REVIEWS = "reviews";

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

export interface PaginatedReviews {
  pageCount: number;
  reviews: Review[];
}

export async function getReview(slug: string): Promise<FullReview> {
  const { data } = await fetchReviews({
    filters: { slug: { $eq: slug } },
    fields: ["slug", "title", "subtitle", "publishedAt", "body"],
    populate: { image: { fields: ["url"] } },
    pagination: { pageSize: 1, withCount: false },
  });

  if (data.length === 0) {
    return null;
  }

  const { attributes } = data[0];
  return {
    ...toReview(data[0]),
    body: marked(attributes.body),
  };
}

export async function getReviews(
  pageSize: number,
  page = 1
): Promise<PaginatedReviews> {
  const { data, meta } = await fetchReviews({
    fields: ["slug", "title", "subtitle", "publishedAt"],
    populate: { image: { fields: ["url"] } },
    sort: ["publishedAt:desc"],
    pagination: { pageSize, page },
  });

  return {
    pageCount: meta.pagination.pageCount,
    reviews: data.map(toReview),
  };
}

async function fetchReviews(parameters: any) {
  const url =
    `${CMS_URL}/api/reviews?` +
    qs.stringify(parameters, { encodeValuesOnly: true });

  const response = await fetch(url, {
    next: {
      tags: [CACHE_TAG_REVIEWS],
    },
  });
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
