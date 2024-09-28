'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const RiskManagerOverview = ({ accountValue = 0, pnlPercentage = 0 }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Manager Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">Account Value</p>
            <p className="text-2xl">${accountValue.toFixed(2)}</p>
          </div>
          <div>
            <p className="font-semibold">P&L</p>
            <p className={`text-2xl ${pnlPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {pnlPercentage >= 0 ? '+' : ''}{pnlPercentage.toFixed(2)}%
            </p>
          </div>
          {/* Add more risk metrics here */}
        </div>
      </CardContent>
    </Card>
  )
}

export default RiskManagerOverview