import Link from "next/link";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/20/solid";

interface Props {
  href: string;
  page: number;
  pageCount: number;
}
export default async function PaginationBar({ href, page, pageCount }: Props) {
  return (
    <>
      <div className="flex gap-2 pb-3">
        <PaginationLink href={`${href}?page=${page - 1}`} enabled={page > 1}>
          <ChevronLeftIcon className="h-5 w-5" />
          <span className="sr-only">Previous Page</span>
        </PaginationLink>
        <span>
          Page {page} of {pageCount}
        </span>
        <PaginationLink
          href={`${href}?page=${page + 1}`}
          enabled={page < pageCount}
        >
          <ChevronRightIcon className="h-5 w-5" />
        </PaginationLink>
      </div>
    </>
  );
}

function PaginationLink({ children, href, enabled }: any) {
  if (!enabled) {
    return (
      <span className="cursor-not-allowed border rounded text-slate-300 text-sm">
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className="border rounded text-slate-500 text-sm
    hover:bg-orange-100 hover:text-slate-700"
    >
      {children}
    </Link>
  );
}
