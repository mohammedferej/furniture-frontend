import { OrderTable } from "@/components/order-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

interface OrderApiResponse {
  count: number
  next: string | null
  previous: string | null
  results: any[]
}

async function getOrders(page: number = 1, pageSize: number = 10) {
  const res = await fetch(`http://localhost:8000/api/orders/?page=${page}&page_size=${pageSize}`, {
    cache: "no-store", // so data is always fresh
  })
  if (!res.ok) {
    throw new Error("Failed to fetch orders")
  }
  return res.json()
}

interface OrdersPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function OrdersPage({
  searchParams,
}: OrdersPageProps) {
  // Await searchParams here!
  const resolvedSearchParams = searchParams ? await searchParams : {}

  const pageParam = Array.isArray(resolvedSearchParams.page)
    ? resolvedSearchParams.page[0]
    : resolvedSearchParams.page

  const page = pageParam ? parseInt(pageParam) : 1
  const pageSize = 10

  const ordersData: OrderApiResponse = await getOrders(page, pageSize)
  const pageCount = Math.ceil(ordersData.count / pageSize)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Orders</h1>
        <Button asChild variant="brand">
          <Link href="/orders/create">
            <Plus className="mr-2 h-4 w-4" />
            New Order
          </Link>
        </Button>
      </div>

      <OrderTable
        orders={ordersData.results}
        pageCount={pageCount}
        currentPage={page}
      />
    </div>
  )
}
