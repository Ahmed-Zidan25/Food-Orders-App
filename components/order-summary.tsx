"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface Order {
  name: string
  items: Record<string, number>
}

interface OrderSummaryProps {
  orders: Order[]
  foodItems: string[]
  onRemoveOrder: (name: string) => void
}

export default function OrderSummary({ orders, foodItems, onRemoveOrder }: OrderSummaryProps) {
  // Calculate totals for each food item
  const totals = foodItems.reduce(
    (acc, item) => {
      acc[item] = orders.reduce((sum, order) => sum + (order.items[item] || 0), 0)
      return acc
    },
    {} as Record<string, number>,
  )

  const totalOrders = orders.length
  const totalItems = Object.values(totals).reduce((sum, val) => sum + val, 0)

  return (
    <div className="space-y-4">
      {/* Summary Card */}
      <Card className="shadow-lg bg-gradient-to-br from-accent/5 to-secondary/5 border-2 border-accent/20">
        <CardHeader>
          <CardTitle className="text-lg">Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-primary/10 rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Total People</p>
              <p className="text-3xl font-bold text-primary mt-1">{totalOrders}</p>
            </div>
            <div className="bg-accent/10 rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Total Items</p>
              <p className="text-3xl font-bold text-accent mt-1">{totalItems}</p>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-sm font-semibold text-foreground mb-3">Item Totals</p>
            <div className="space-y-2">
              {foodItems.map((item) => (
                <div key={item} className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">{item}</span>
                  <span className="font-bold text-foreground text-lg">{totals[item]}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      {orders.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {orders.map((order) => (
                <div
                  key={order.name}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{order.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {Object.entries(order.items)
                        .filter(([_, qty]) => qty > 0)
                        .map(([item, qty]) => `${item}: ${qty}`)
                        .join(", ")}
                    </p>
                  </div>
                  <Button
                    onClick={() => onRemoveOrder(order.name)}
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
