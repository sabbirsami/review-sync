'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
}: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    return params.toString();
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pe-16">
      <div className="text-sm text-gray-600">
        Showing {startItem}-{endItem} of {totalItems} reviews
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            router.push(pathname + '?' + createQueryString('page', (currentPage - 1).toString()));
          }}
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  router.push(pathname + '?' + createQueryString('page', pageNum.toString()));
                }}
              >
                {pageNum}
              </Button>
            );
          })}

          {totalPages > 5 && currentPage < totalPages - 2 && <span className="px-2">...</span>}

          {totalPages > 5 && currentPage < totalPages - 2 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                router.push(pathname + '?' + createQueryString('page', totalPages.toString()));
              }}
            >
              {totalPages}
            </Button>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            router.push(pathname + '?' + createQueryString('page', (currentPage + 1).toString()));
          }}
          disabled={currentPage >= totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
