// components/order-table.tsx
'use client'

import { useState } from 'react'
import { PdfViewerModal } from './pdf-viewer-modal'
import { OrdersPagination } from './orders-pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, Pencil } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Order {
  id: string
  order_code: string
  receive_order_at: string
  total_price: number 
  remaining_payment: number 
  document_path: string | null
  customer: {
    name: string
    phone: string
  }
}

interface OrderTableProps {
  orders: Order[]
  pageCount?: number
  currentPage?: number
}

export function OrderTable({ 
  orders = [], 
  pageCount = 1, 
  currentPage = 1 
}: OrderTableProps) {
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null)
  const router = useRouter()

  const formatPrice = (price: number | string): string => {
    const num = typeof price === 'string' ? parseFloat(price) : price
    return `$${num.toFixed(2)}`
  }

  const handleUpdate = (orderId: string) => {
    router.push(`/order-mejlis/${orderId}/edit`)
  }

  if (!Array.isArray(orders)) {
    return (
      <div className="rounded-md border p-4 text-center text-muted-foreground">
        No orders found or invalid data format
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-md border p-4 text-center text-muted-foreground">
        No orders available
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order Code</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.order_code}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{order.customer.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {order.customer.phone}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(order.receive_order_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  {formatPrice(order.total_price)}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={order.remaining_payment > 0 ? "secondary" : "default"}
                    className={order.remaining_payment > 0 ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"}
                  >
                    {order.remaining_payment > 0 ? "Pending" : "Completed"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleUpdate(order.id)}
                      className="flex items-center gap-2"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </Button>
                    {order.document_path && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedPdf(order.document_path)}
                        className="flex items-center gap-2"
                      >
                        <FileText className="h-4 w-4" />
                        PDF
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {pageCount > 1 && (
        <div className="flex justify-center">
          <OrdersPagination 
            pageCount={pageCount} 
            currentPage={currentPage} 
          />
        </div>
      )}

      <PdfViewerModal
        pdfUrl={selectedPdf || ''}
        open={!!selectedPdf}
        onOpenChange={(open) => !open && setSelectedPdf(null)}
      />
    </div>
  )
}