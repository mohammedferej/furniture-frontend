'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import MejlisFormParentUpdate from '@/components/MejlisFormParentUpdate'
import { transformOrderToFormData } from '@/lib/transformOrderToFormData'

export default function EditOrderPageClient({ orderId }: { orderId: string }) {
  const [initialData, setInitialData] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadOrderData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/orders/${orderId}/`)
        if (!response.ok) throw new Error(`Failed to fetch order ${orderId}`)

        const orderData = await response.json()
        const formData = transformOrderToFormData(orderData)
        setInitialData(formData)
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error'
        setError(msg)
        toast.error('Failed to load order', { description: msg })
      } finally {
        setLoading(false)
      }
    }

    loadOrderData()
  }, [orderId])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return initialData ? (
    <MejlisFormParentUpdate initialData={initialData} orderId={orderId} />
  ) : (
    <div>No order data available</div>
  )
}
