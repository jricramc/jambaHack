import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

// Mock data for stocks
const stocksData = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'FB', name: 'Meta Platforms Inc.' },
  { symbol: 'TSLA', name: 'Tesla, Inc.' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation' },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.' },
  { symbol: 'JNJ', name: 'Johnson & Johnson' },
  { symbol: 'V', name: 'Visa Inc.' },
]

const SignUpScreen = ({ onSignUp }) => {
  const [selectedStocks, setSelectedStocks] = useState([])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleStockToggle = (symbol) => {
    setSelectedStocks(prev => 
      prev.includes(symbol)
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol].slice(0, 10)
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSignUp({ email, password, selectedStocks })
  }

  return (
    <div className="flex items-center justify-center">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select up to 10 stocks to trade</label>
          <div className="grid grid-cols-2 gap-2">
            {stocksData.map(stock => (
              <div key={stock.symbol} className="flex items-center">
                <Checkbox
                  id={stock.symbol}
                  checked={selectedStocks.includes(stock.symbol)}
                  onCheckedChange={() => handleStockToggle(stock.symbol)}
                />
                <label htmlFor={stock.symbol} className="ml-2 text-sm">{stock.symbol}</label>
              </div>
            ))}
          </div>
        </div>
        <Button type="submit" className="w-full">Sign Up</Button>
      </form>
    </div>
  )
}

export default SignUpScreen