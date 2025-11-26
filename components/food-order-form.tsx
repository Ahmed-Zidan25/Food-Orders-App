"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import QuantityInput from "@/components/quantity-input"

interface FoodOrderFormProps {
  foodItems: string[]
  onAddOrder: (name: string, items: Record<string, number>) => void
}

const foodImages: Record<string, string> = {
  فول: "/foul.jpeg",
  طعمية: "/taamia.jpeg",
  بطاطس: "/bataas.jpeg",
}

export default function FoodOrderForm({ foodItems, onAddOrder }: FoodOrderFormProps) {
  const [name, setName] = useState("")
  const [quantities, setQuantities] = useState<Record<string, number>>(
    foodItems.reduce((acc, item) => ({ ...acc, [item]: 0 }), {}),
  )

  const handleQuantityChange = (item: string, value: number) => {
    setQuantities((prev) => ({
      ...prev,
      [item]: Math.max(0, value),
    }))
  }

  const handleSubmit = () => {
    if (!name.trim()) {
      alert("يا عم دخل إسمك الأول")
      return
    }

    if (Object.values(quantities).every((q) => q === 0)) {
      alert("هو أنت أخترت حاجه عشان ت submit")
      return
    }

    onAddOrder(name, quantities)
    setName("")
    setQuantities(foodItems.reduce((acc, item) => ({ ...acc, [item]: 0 }), {}))
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-gradient-to-r from-secondary/20 to-accent/20 border-b">
        <CardTitle>Add New Order</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Name Input */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-foreground">Name</label>
          <Input
            placeholder="Enter your name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-base"
          />
        </div>

        {/* Food Items with Images */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-foreground">Select Items</label>
          {foodItems.map((item) => (
            <div
              key={item}
              className="flex items-center gap-4 p-3 bg-muted rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-background">
                <Image
                  src={foodImages[item] || "/placeholder.svg"}
                  alt={item}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                  priority={false}
                />
              </div>
              <div className="flex-1 flex items-center justify-between">
                <span className="font-medium text-foreground text-lg">{item}</span>
                <QuantityInput value={quantities[item]} onChange={(value) => handleQuantityChange(item, value)} />
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-6 text-lg"
        >
          Add Order
        </Button>
      </CardContent>
    </Card>
  )
}
