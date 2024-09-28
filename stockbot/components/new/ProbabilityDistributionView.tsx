'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

interface ProbabilityDistributionViewProps {
  symbol: string
  expiration: string
  data: Array<{ price: string; probability: string }>
}

const ProbabilityDistributionView: React.FC<ProbabilityDistributionViewProps> = ({ symbol, expiration, data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Probability Distribution - {symbol} ({expiration})</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="price" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="probability" name="Probability" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default ProbabilityDistributionView