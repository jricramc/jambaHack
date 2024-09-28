'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

interface SkewViewProps {
  symbol: string
  expiration: string
  data: Array<{ strike: number; callIV: number; putIV: number }>
}

const SkewView: React.FC<SkewViewProps> = ({ symbol, expiration, data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Volatility Skew - {symbol} ({expiration})</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="strike" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="callIV" name="Call IV" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="putIV" name="Put IV" stroke="#82ca9d" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default SkewView