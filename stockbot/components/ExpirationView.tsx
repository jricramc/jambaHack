'use client'

import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react'

const ExpirationView = ({ stock, expiry, onBack, onSelectOption }) => {
  // Mock data for options chain
  const optionsChain = [
    { strike: 95, callBid: 5.10, callAsk: 5.20, putBid: 0.15, putAsk: 0.20 },
    { strike: 100, callBid: 2.50, callAsk: 2.60, putBid: 0.50, putAsk: 0.55 },
    { strike: 105, callBid: 0.80, callAsk: 0.85, putBid: 1.80, putAsk: 1.85 },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <h2 className="text-2xl font-bold">{stock.symbol} - {expiry}</h2>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Strike</TableHead>
            <TableHead>Call Bid</TableHead>
            <TableHead>Call Ask</TableHead>
            <TableHead>Put Bid</TableHead>
            <TableHead>Put Ask</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {optionsChain.map((option) => (
            <TableRow key={option.strike}>
              <TableCell>{option.strike}</TableCell>
              <TableCell className="cursor-pointer hover:bg-muted/50" onClick={() => onSelectOption('call', option.strike, option.callAsk)}>
                {option.callBid.toFixed(2)}
              </TableCell>
              <TableCell className="cursor-pointer hover:bg-muted/50" onClick={() => onSelectOption('call', option.strike, option.callAsk)}>
                {option.callAsk.toFixed(2)}
              </TableCell>
              <TableCell className="cursor-pointer hover:bg-muted/50" onClick={() => onSelectOption('put', option.strike, option.putAsk)}>
                {option.putBid.toFixed(2)}
              </TableCell>
              <TableCell className="cursor-pointer hover:bg-muted/50" onClick={() => onSelectOption('put', option.strike, option.putAsk)}>
                {option.putAsk.toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default ExpirationView