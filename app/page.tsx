"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import FoodOrderForm from "@/components/food-order-form"
import OrderSummary from "@/components/order-summary"

interface Order {
  _id?: string
  name: string
  items: Record<string, number>
}

const FOOD_ITEMS = ["فول", "طعمية", "بطاطس"]

export default function Page() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders")
        if (response.ok) {
          const data = await response.json()
          setOrders(data)
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const handleAddOrder = async (name: string, items: Record<string, number>) => {
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, items }),
      })

      if (response.ok) {
        const newOrder = await response.json()
        setOrders((prev) => {
          const existingIndex = prev.findIndex((order) => order.name === name)
          if (existingIndex >= 0) {
            const updated = [...prev]
            updated[existingIndex] = newOrder
            return updated
          }
          return [...prev, newOrder]
        })
      }
    } catch (error) {
      console.error("Failed to add order:", error)
      alert("Failed to save order")
    }
  }

  const handleRemoveOrder = async (name: string) => {
    try {
      const order = orders.find((o) => o.name === name)
      if (!order?._id) return

      const response = await fetch(`/api/orders/${order._id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setOrders((prev) => prev.filter((order) => order.name !== name))
      }
    } catch (error) {
      console.error("Failed to remove order:", error)
      alert("Failed to delete order")
    }
  }

  return (
    <main
      className="min-h-screen p-6"
      style={{
        backgroundImage: "url(/food-bg.jpg)",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">إن خلص الفول أنا مش مسئول</h1>
          <p className="text-white/90 text-lg"> الطلبات من الساعه 9 لحد الساعه 12 </p>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Column */}
          <div className="lg:col-span-1">
            <FoodOrderForm foodItems={FOOD_ITEMS} onAddOrder={handleAddOrder} />
          </div>

          {/* Summary Column */}
          <div className="lg:col-span-2">
            {loading ? (
              <Card className="bg-white/95 border-none shadow-lg">
                <CardContent className="pt-12 pb-12 text-center">
                  <p className="text-foreground">جاري التحميل...</p>
                </CardContent>
              </Card>
            ) : (
              <OrderSummary orders={orders} foodItems={FOOD_ITEMS} onRemoveOrder={handleRemoveOrder} />
            )}
          </div>
        </div>

        {/* Empty State */}
        {orders.length === 0 && !loading && (
          <div className="mt-12 text-center">
            <Card className="bg-white/95 border-none shadow-lg">
              <CardContent className="pt-12 pb-12">
                <p className="text-foreground text-lg">لم تتم إضافة أي طلبات بعد</p>
                <p className="text-muted-foreground text-sm mt-2">ابدأ بإضافة طلبك من الجانب</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  )
}
