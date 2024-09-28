'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Import or define optionsData
import { optionsData } from '@/data/optionsData'

// Define formatNumber function
const formatNumber = (num: number | undefined) => {
  if (num === undefined) return 'N/A'
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'k'
  return num.toFixed(1)
}

const ExpirationView = ({ symbol, expiration, onBack, onSelectOption, role }) => {
  const options = optionsData[symbol].prices[expiration]

  return (
    <div>
      <Button onClick={onBack} variant="ghost" className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Stock Detail
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>{symbol} Options - Expiration: {expiration}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Strike</TableHead>
                <TableHead>Call Price</TableHead>
                <TableHead>Put Price</TableHead>
                {role === 'Risk Manager' && (
                  <>
                    <TableHead>Call Delta</TableHead>
                    <TableHead>Put Delta</TableHead>
                  </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(options).map(([strike, { call, put }]) => (
                <TableRow key={strike}>
                  <TableCell>{strike}</TableCell>
                  <TableCell 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => onSelectOption(Number(strike), 'Call', expiration)}
                  >
                    ${formatNumber(call.price)}
                  </TableCell>
                  <TableCell 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => onSelectOption(Number(strike), 'Put', expiration)}
                  >
                    ${formatNumber(put.price)}
                  </TableCell>
                  {role === 'Risk Manager' && (
                    <>
                      <TableCell>{formatNumber(call.delta)}</TableCell>
                      <TableCell>{formatNumber(put.delta)}</TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default ExpirationView