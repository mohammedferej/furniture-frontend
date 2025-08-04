// components/orders-pagination.tsx
'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function OrdersPagination({
  pageCount,
  currentPage,
}: {
  pageCount: number
  currentPage: number
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', newPage.toString())
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const renderPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    let startPage, endPage

    if (pageCount <= maxVisiblePages) {
      startPage = 1
      endPage = pageCount
    } else {
      const maxPagesBeforeCurrent = Math.floor(maxVisiblePages / 2)
      const maxPagesAfterCurrent = Math.ceil(maxVisiblePages / 2) - 1

      if (currentPage <= maxPagesBeforeCurrent) {
        startPage = 1
        endPage = maxVisiblePages
      } else if (currentPage + maxPagesAfterCurrent >= pageCount) {
        startPage = pageCount - maxVisiblePages + 1
        endPage = pageCount
      } else {
        startPage = currentPage - maxPagesBeforeCurrent
        endPage = currentPage + maxPagesAfterCurrent
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={i === currentPage ? 'default' : 'outline'}
          size="sm"
          onClick={() => handlePageChange(i)}
          className="min-w-10 p-0"
        >
          {i}
        </Button>
      )
    }

    return pages
  }

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="gap-1 pl-2.5"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>
      </div>

      <div className="flex items-center gap-1">
        {renderPageNumbers()}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= pageCount}
          className="gap-1 pr-2.5"
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}