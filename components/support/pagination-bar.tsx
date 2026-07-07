"use client";

import { Pagination } from "@heroui/react";
import { cn } from "@/lib/utils";

interface PaginationBarProps {
  page: number;
  total: number;
  onChange: (page: number) => void;
  className?: string;
}

/**
 * PaginationBar — wraps the HeroUI v3 compound Pagination API.
 * Only renders if there is more than 1 page.
 */
export function PaginationBar({ page, total, onChange, className }: PaginationBarProps) {
  if (total <= 1) return null;

  // Build page numbers with ellipsis
  const getPages = () => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: (number | "ellipsis")[] = [1];
    if (page > 3) pages.push("ellipsis");
    for (let i = Math.max(2, page - 1); i <= Math.min(total - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < total - 2) pages.push("ellipsis");
    pages.push(total);
    return pages;
  };

  const pages = getPages();

  return (
    <Pagination className={cn("flex justify-center", className)}>
      <Pagination.Content>
        <Pagination.Item>
          <Pagination.Previous isDisabled={page === 1} onPress={() => onChange(page - 1)}>
            <Pagination.PreviousIcon />
          </Pagination.Previous>
        </Pagination.Item>
        
        {pages.map((p, i) =>
          p === "ellipsis" ? (
            <Pagination.Item key={`ellipsis-${i}`}>
              <span className="flex items-center justify-center w-8 h-8 text-[#a1a1aa] tracking-[0.2em] font-medium pb-1">...</span>
            </Pagination.Item>
          ) : (
            <Pagination.Item key={p}>
              <Pagination.Link isActive={p === page} onPress={() => onChange(p as number)}>
                {p}
              </Pagination.Link>
            </Pagination.Item>
          )
        )}

        <Pagination.Item>
          <Pagination.Next isDisabled={page === total} onPress={() => onChange(page + 1)}>
            <Pagination.NextIcon />
          </Pagination.Next>
        </Pagination.Item>
      </Pagination.Content>
    </Pagination>
  );
}
