"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface QuantityInputProps {
  value: number
  onChange: (value: number) => void
}

export default function QuantityInput({ value, onChange }: QuantityInputProps) {
  return (
    <div className="flex items-center gap-2">
      <Button onClick={() => onChange(value - 1)} size="sm" variant="outline" className="w-8 h-8 p-0">
        −
      </Button>
      <Input
        type="number"
        value={value}
        onChange={(e) => onChange(Number.parseInt(e.target.value) || 0)}
        className="w-16 text-center text-base"
        min="0"
      />
      <Button onClick={() => onChange(value + 1)} size="sm" variant="outline" className="w-8 h-8 p-0">
        +
      </Button>
    </div>
  )
}
