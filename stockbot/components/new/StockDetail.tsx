'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { stocksData } from '@/data/stocksData'
import { optionsData } from '@/data/optionsData'
import { format } from 'date-fns'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"

const generateHistoricalData = (symbol, days = 30) => {
  const data = []
  let price = stocksData.find(stock => stock.symbol === symbol)?.price || 100
  for (let i = days; i > 0; i--) {
    price += (Math.random() - 0.5) * 5
    data.push({
      date: format(new Date(Date.now() - i * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
      price: Number(price.toFixed(2))
    })
  }
  return data
}

const OptionsTable = ({ data, onSelectExpiration, onSelectOption }) => {
  return (
    <ScrollArea className="h-[400px]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="sticky top-0 bg-background">Strike</TableHead>
            {Object.keys(data).map(exp => (
              <React.Fragment key={exp}>
                <TableHead
                  className="sticky top-0 bg-background text-center cursor-pointer hover:bg-muted/50"
                  colSpan={2}
                  onClick={() => onSelectExpiration(exp)}
                >
                  {exp}
                </TableHead>
              </React.Fragment>
            ))}
          </TableRow>
          <TableRow>
            <TableHead className="sticky top-8 bg-background"></TableHead>
            {Object.keys(data).map(exp => (
              <React.Fragment key={exp}>
                <TableHead className="sticky top-8 bg-background text-center">Call</TableHead>
                <TableHead className="sticky top-8 bg-background text-center">Put</TableHead>
              </React.Fragment>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.keys(data[Object.keys(data)[0]].strikes).map(strike => (
            <TableRow key={strike}>
              <TableCell>{strike}</TableCell>
              {Object.keys(data).map(exp => (
                <React.Fragment key={exp}>
                  <TableCell 
                    className="text-center cursor-pointer hover:bg-muted/50" 
                    onClick={() => onSelectOption(Number(strike), 'Call', exp)}
                  >
                    {data[exp].strikes[strike].call.price.toFixed(2)}
                  </TableCell>
                  <TableCell 
                    className="text-center cursor-pointer hover:bg-muted/50"
                    onClick={() => onSelectOption(Number(strike), 'Put', exp)}
                  >
                    {data[exp].strikes[strike].put.price.toFixed(2)}
                  </TableCell>
                </React.Fragment>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  )
}

const StockDetail = ({ stock, onSelectExpiration, onBackClick, onSelectOption }) => {
  if (!stock) {
    return (
      <div>
        <Button onClick={onBackClick} variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Overview
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>Stock Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Sorry, we couldn't find the details for this stock.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const historicalData = generateHistoricalData(stock.symbol)
  const options = optionsData[stock.symbol]

  return (
    <div>
      <Button onClick={onBackClick} variant="ghost" className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Overview
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>{stock.name} ({stock.symbol})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="text-2xl font-bold">${stock.price.toFixed(2)}</p>
            <p className={`text-sm ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)}%
            </p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={['auto', 'auto']} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="price" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Options Chain</h3>
            {options ? (
              <OptionsTable 
                data={options.expirations} 
                onSelectExpiration={onSelectExpiration} 
                onSelectOption={onSelectOption}
              />
            ) : (
              <p>No options data available for this stock.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default StockDetail