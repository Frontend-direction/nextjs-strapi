"use client";

import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { useIsClient } from "@/lib/hook";
import { CheckIcon } from "@heroicons/react/20/solid";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SearchableReview, searchReviews } from "@/lib/reviews";
import { useDebounce } from "use-debounce";

export default function SearchBox() {
  const router = useRouter();
  const isClient = useIsClient();
  const [query, setQuery] = useState("");
  const [reviews, setReviews] = useState<SearchableReview[]>([]);
  const [debouncedQuery] = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.length > 1) {
      const controller = new AbortController();

      (async () => {
        const url = "/api/search?query=" + encodeURIComponent(debouncedQuery);
        const response = await fetch(url, { signal: controller.signal });
        const reviews = await response.json();
        setReviews(reviews);
      })();

      return () => controller.abort();
    } else {
      setReviews([]);
    }
  }, [debouncedQuery]);

  if (!isClient) return null;

  const handleChange = (review: any) => {
    router.push(`/reviews/${review.slug}`);
  };

  return (
    <Combobox onChange={handleChange} onClose={() => setQuery("")}>
      <ComboboxInput
        className="border px-2 py-1 rounded"
        aria-label="Assignee"
        displayValue={(review: any) => review?.title}
        onChange={(event) => setQuery(event.target.value)}
      />
      <ComboboxOptions anchor="bottom" className="empty:hidden w-48">
        {reviews.map((review) => (
          <ComboboxOption
            key={review.slug}
            value={review}
            className="group flex gap-2 bg-white data-[focus]:bg-blue-100"
          >
            <CheckIcon className="invisible size-5 group-data-[selected]:visible" />
            <span className="block truncate w-48">{review.title}</span>
          </ComboboxOption>
        ))}
      </ComboboxOptions>
    </Combobox>
  );
}
