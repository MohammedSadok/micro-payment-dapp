"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Wifi } from 'lucide-react'

interface CreditCardProps {
  balance: number
  cardNumber: string
}

export function CreditCard({ balance, cardNumber }: CreditCardProps) {
  return (
    <Card className="w-full bg-gradient-to-br from-blue-600 to-blue-700 text-white">
      <CardContent className="p-6 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm opacity-75 mb-1">Current Balance</p>
            <h2 className="text-3xl font-bold">${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2>
          </div>
          <Wifi className="h-6 w-6 rotate-90" />
        </div>
        <div className="pt-4">
          <p className="text-lg tracking-wider">{cardNumber}</p>
        </div>
      </CardContent>
    </Card>
  )
}

