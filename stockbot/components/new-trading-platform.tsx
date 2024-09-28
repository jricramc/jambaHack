'use client'

import React, { useState, useRef, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ArrowLeft, MessageSquare, ChevronRight, ChevronDown, Send, Plus, Minus, User, ChevronLeft, ChevronUp } from 'lucide-react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Toggle } from "@/components/ui/toggle"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'

// Mock data for stocks
const stocksData = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 150.25, change: 2.5 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 2750.80, change: -0.3 },
  { symbol: 'MSFT', name: 'Microsoft Corporation', price: 305.15, change: 1.2 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 3380.50, change: -1.5 },
  { symbol: 'FB', name: 'Meta Platforms Inc.', price: 330.75, change: 0.8 },
  { symbol: 'TSLA', name: 'Tesla, Inc.', price: 735.72, change: 3.2 },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 223.87, change: 1.8 },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', price: 151.78, change: -0.5 },
  { symbol: 'JNJ', name: 'Johnson & Johnson', price: 170.55, change: 0.3 },
  { symbol: 'V', name: 'Visa Inc.', price: 231.23, change: 0.9 },
]

// Mock data for options
const optionsData = stocksData.reduce((acc, stock) => {
  acc[stock.symbol] = {
    expirations: ['2023-07-21', '2023-08-18', '2023-09-15', '2023-10-20', '2023-11-17'],
    strikes: [
      Math.round(stock.price * 0.8),
      Math.round(stock.price * 0.9),
      Math.round(stock.price * 0.95),
      Math.round(stock.price),
      Math.round(stock.price * 1.05),
      Math.round(stock.price * 1.1),
      Math.round(stock.price * 1.2),
    ],
    prices: {
      '2023-07-21': {},
      '2023-08-18': {},
      '2023-09-15': {},
      '2023-10-20': {},
      '2023-11-17': {},
    }
  }

  acc[stock.symbol].strikes.forEach(strike => {
    acc[stock.symbol].expirations.forEach(exp => {
      acc[stock.symbol].prices[exp][strike] = {
        call: {
          price: Number((Math.random() * 10 + 5).toFixed(2)),
          delta: Number((Math.random() * 0.5 + 0.25).toFixed(2)),
          gamma: Number((Math.random() * 0.05).toFixed(3)),
          theta: Number((-Math.random() * 0.5).toFixed(2)),
          vega: Number((Math.random() * 0.5).toFixed(2)),
          volume: Math.floor(Math.random() * 1000) + 100,
          openInterest: Math.floor(Math.random() * 5000) + 1000,
        },
        put: {
          price: Number((Math.random() * 10 + 5).toFixed(2)),
          delta: Number((-Math.random() * 0.5 - 0.25).toFixed(2)),
          gamma: Number((Math.random() * 0.05).toFixed(3)),
          theta: Number((-Math.random() * 0.5).toFixed(2)),
          vega: Number((Math.random() * 0.5).toFixed(2)),
          volume: Math.floor(Math.random() * 1000) + 100,
          openInterest: Math.floor(Math.random() * 5000) + 1000,
        },
      }
    })
  })

  return acc
}, {})

// Mock data for the positions with Greek parameters
const initialPositions = [
  {
    id: 'tech',
    name: 'Technology',
    items: [
      {
        id: 'AAPL',
        name: 'AAPL',
        type: 'folder',
        items: [
          { id: 'AAPL1', name: 'Stock', type: 'stock', quantity: 100, delta: 100, gamma: 0, theta: 0, vega: 0, fv: 15025, tradePrice: 150.25 },
          { id: 'AAPL2', name: '(8/18 160C)', type: 'option', optionType: 'Call', strike: 160, expiry: '2023-08-18', quantity: 2, delta: 0.6, gamma: 0.001, theta: -1.5, vega: 0.3, fv: 300, tradePrice: 150 },
        ],
      },
      {
        id: 'GOOGL',
        name: 'GOOGL',
        type: 'folder',
        items: [
          { id: 'GOOGL1', name: '(8/18 2800C)', type: 'option', optionType: 'Call', strike: 2800, expiry: '2023-08-18', quantity: 1, delta: 0.6, gamma: 0.001, theta: -1.5, vega: 0.3, fv: 150, tradePrice: 150 },
        ],
      },
      {
        id: 'MSFT',
        name: 'MSFT',
        type: 'folder',
        items: [
          { id: 'MSFT1', name: 'Stock', type: 'stock', quantity: 50, delta: 50, gamma: 0, theta: 0, vega: 0, fv: 15257.5, tradePrice: 305.15 },
        ],
      },
    ],
  },
  {
    id: 'finance',
    name: 'Finance',
    items: [
      {
        id: 'JPM',
        name: 'JPM',
        type: 'folder',
        items: [
          { id: 'JPM1', name: 'Stock', type: 'stock', quantity: 75, delta: 75, gamma: 0, theta: 0, vega: 0, fv: 11647.5, tradePrice: 155.30 },
        ],
      },
      {
        id: 'GS',
        name: 'GS',
        type: 'folder',
        items: [
          { id: 'GS1', name: '(10/20 350C)', type: 'option', optionType: 'Call', strike: 350, expiry: '2023-10-20', quantity: 1, delta: 0.5, gamma: 0.001, theta: -1.2, vega: 0.25, fv: 180, tradePrice: 180 },
        ],
      },
      {
        id: 'BAC',
        name: 'BAC',
        type: 'folder',
        items: [
          { id: 'BAC1', name: 'Stock', type: 'stock', quantity: 100, delta: 100, gamma: 0, theta: 0, vega: 0, fv: 3000, tradePrice: 30.00 },
        ],
      },
    ],
  },
]

// Mock historical data for stocks
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

const Header = () => (
  <header className="flex items-center justify-between px-6 py-4 bg-background border-b">
    <nav className="flex items-center space-x-8 flex-1 justify-between">
      <Link href="/trade" className="text-lg font-light hover:text-primary">trade</Link>
      <Link href="/learn" className="text-lg font-light hover:text-primary">learn</Link>
      <div className="flex-shrink-0">
        <Image src="/placeholder.svg?height=40&width=120" alt="Logo" width={120} height={40} />
      </div>
      <Link href="/hire" className="text-lg font-light hover:text-primary">hire</Link>
      <Link href="/about" className="text-lg font-light hover:text-primary">about</Link>
      <Link href="/profile" className="text-lg hover:text-primary">
        <User className="h-6 w-6" />
        <span className="sr-only">Profile</span>
      </Link>
    </nav>
  </header>
)

const formatNumber = (num: number | undefined) => {
  if (num === undefined || isNaN(num)) return '0.00'
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'k'
  return num.toFixed(2)
}

const GreekDisplay = ({ greeks }) => (
  <div className="grid grid-cols-4 gap-1 text-xs text-right">
    <span>{greeks.delta !== undefined ? greeks.delta.toFixed(2) : '0.00'}</span>
    <span>{greeks.gamma !== undefined ? greeks.gamma.toFixed(3) : '0.000'}</span>
    <span>{greeks.theta !== undefined ? greeks.theta.toFixed(2) : '0.00'}</span>
    <span>{greeks.vega !== undefined ? greeks.vega.toFixed(2) : '0.00'}</span>
  </div>
)

const PnLDisplay = ({ item }) => (
  <div className="grid grid-cols-4 gap-1 text-xs text-right">
    <span>${formatNumber(item.tradePrice)}</span>
    <span>{item.quantity}</span>
    <span>{item.tradePrice ? ((item.fv / item.tradePrice - 1) * 100).toFixed(2) : '0.00'}%</span>
    <span>${formatNumber(item.fv * item.quantity)}</span>
  </div>
)

const PositionItem = ({ item, index, onSelectInstrument, showGreeks }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const getDisplayName = () => {
    if (item.type === 'stock') {
      return item.name;
    } else if (item.type === 'option') {
      const formattedDate = formatDate(item.expiry);
      const optionType = item.optionType === 'Call' ? 'C' : 'P';
      return `(${formattedDate} ${item.strike}${optionType})`;
    }
    return item.name;
  };

  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="flex items-center py-1 pl-4 cursor-pointer hover:bg-muted/50 text-xs"
          onClick={() => onSelectInstrument(item)}
        >
          <div className="flex-grow overflow-hidden whitespace-nowrap">
            <span className="mr-2">{getDisplayName()}</span>
          </div>
          <div className="flex-shrink-0 w-48">
            {showGreeks ? <GreekDisplay greeks={item} /> : <PnLDisplay item={item} />}
          </div>
        </div>
      )}
    </Draggable>
  )
}

const FolderItem = ({ folder, index, onSelectInstrument, showGreeks }) => {
  const [isOpen, setIsOpen] = useState(true)

  const totalGreeks = folder.items.reduce((acc, item) => ({
    delta: acc.delta + (item.delta || 0) * item.quantity,
    gamma: acc.gamma + (item.gamma || 0) * item.quantity,
    theta: acc.theta + (item.theta || 0) * item.quantity,
    vega: acc.vega + (item.vega || 0) * item.quantity,
    fv: acc.fv + (item.fv || 0) * item.quantity,
  }), { delta: 0, gamma: 0, theta: 0, vega: 0, fv: 0 })

  const totalPnL = folder.items.reduce((acc, item) => ({
    tradePrice: acc.tradePrice + (item.tradePrice || 0) * item.quantity,
    quantity: acc.quantity + item.quantity,
    fv: acc.fv + (item.fv || 0) * item.quantity,
  }), { tradePrice: 0, quantity: 0, fv: 0 })

  return (
    <div>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex items-center w-full py-1 hover:bg-muted/50 text-xs">
          <div className="flex-grow flex items-center overflow-hidden">
            {isOpen ? <ChevronDown className="w-3 h-3 mr-1 flex-shrink-0" /> : <ChevronRight className="w-3 h-3 mr-1 flex-shrink-0" />}
            <span className="truncate font-medium">{folder.name}</span>
          </div>
          <div className="flex-shrink-0 w-48">
            {showGreeks ? <GreekDisplay greeks={totalGreeks} /> : <PnLDisplay item={totalPnL} />}
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Droppable droppableId={folder.id}>
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {folder.items.map((item, itemIndex) => (
                  <PositionItem key={item.id} item={item} index={itemIndex} onSelectInstrument={onSelectInstrument} showGreeks={showGreeks} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

const PositionsPanel = ({ positions, onDragEnd, onSelectInstrument, isCollapsed, onToggleCollapse, onShowRiskManager }) => {
  const [showGreeks, setShowGreeks] = useState(false)

  const calculatePnL = () => {
    return positions.reduce((total, folder) => {
      return total + folder.items.reduce((folderTotal, subFolder) => {
        return folderTotal + subFolder.items.reduce((subFolderTotal, item) => {
          const currentPrice = stocksData.find(stock => stock.symbol === subFolder.name)?.price || item.tradePrice
          const pnl = item.quantity * (currentPrice - item.tradePrice)
          return subFolderTotal + pnl
        }, 0)
      }, 0)
    }, 0)
  }

  const calculateAccountValue = () => {
    return positions.reduce((total, folder) => {
      return total + folder.items.reduce((folderTotal, subFolder) => {
        return folderTotal + subFolder.items.reduce((subFolderTotal, item) => {
          return subFolderTotal + item.quantity * item.fv
        }, 0)
      }, 0)
    }, 0)
  }

  const pnl = calculatePnL()
  const accountValue = calculateAccountValue()
  const pnlPercentage = (pnl / accountValue) * 100

  return (
    <div className={`transition-all duration-300 ${isCollapsed ? 'w-12' : 'w-80'}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-lg font-semibold ${isCollapsed ? 'hidden' : ''}`}>Positions</h2>
        <Button variant="ghost" size="sm" onClick={onToggleCollapse}>
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>
      {!isCollapsed && (
        <>
          <div 
            className="text-sm mb-4 cursor-pointer bg-muted rounded-lg p-3"
            onClick={onShowRiskManager}
          >
            <div className="font-semibold mb-1">Paper Account:</div>
            <div className="text-lg font-bold">${formatNumber(accountValue)}</div>
            <div className={`text-sm ${pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {pnlPercentage >= 0 ? '+' : ''}{pnlPercentage.toFixed(2)}%
            </div>
          </div>
          <div className="flex justify-between mb-4">
            <Button 
              variant={showGreeks ? "outline" : "default"} 
              size="sm" 
              onClick={() => setShowGreeks(false)}
            >
              Performance
            </Button>
            <Button 
              variant={showGreeks ? "default" : "outline"} 
              size="sm" 
              onClick={() => setShowGreeks(true)}
            >
              Risk
            </Button>
          </div>
          <ScrollArea className="h-[calc(100vh-16rem)]">
            <div className="mb-2 flex items-center text-xs font-medium text-muted-foreground">
              <div className="flex-grow"></div>
              <div className="flex-shrink-0 w-48 grid grid-cols-4 gap-1 text-right">
                {showGreeks ? (
                  <>
                    <span>Δ</span>
                    <span>Γ</span>
                    <span>Θ</span>
                    <span>V</span>
                  </>
                ) : (
                  <>
                    <span>Price</span>
                    <span>#</span>
                    <span>%</span>
                    <span>Value</span>
                  </>
                )}
              </div>
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
              {positions.map((folder, index) => (
                <FolderItem key={folder.id} folder={folder} index={index} onSelectInstrument={onSelectInstrument} showGreeks={showGreeks} />
              ))}
            </DragDropContext>
          </ScrollArea>
        </>
      )}
    </div>
  )
}

const StockTable = ({ stocks, onSelectStock }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Symbol</TableHead>
        <TableHead>Name</TableHead>
        <TableHead>Price</TableHead>
        <TableHead>Change</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {stocks.map((stock) => (
        <TableRow key={stock.symbol} className="cursor-pointer hover:bg-muted/50" onClick={() => onSelectStock(stock.symbol)}>
          <TableCell>{stock.symbol}</TableCell>
          <TableCell>{stock.name}</TableCell>
          <TableCell>${stock.price.toFixed(2)}</TableCell>
          <TableCell className={stock.change >= 0 ? 'text-green-600' : 'text-red-600'}>
            {stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)}%
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
)

const OptionsTable = ({ data, onSelectExpiration, onSelectOption }) => {
  return (
    <ScrollArea className="h-[400px]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="sticky top-0 bg-background">Strike</TableHead>
            {data.expirations.map(exp => (
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
            {data.expirations.map(exp => (
              <React.Fragment key={exp}>
                <TableHead className="sticky top-8 bg-background text-center">Call</TableHead>
                <TableHead className="sticky top-8 bg-background text-center">Put</TableHead>
              </React.Fragment>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.strikes.map(strike => (
            <TableRow key={strike}>
              <TableCell>{strike}</TableCell>
              {data.expirations.map(exp => (
                <React.Fragment key={exp}>
                  <TableCell 
                    className="text-center cursor-pointer hover:bg-muted/50" 
                    onClick={() => onSelectOption(strike, 'Call', exp)}
                  >
                    {data.prices[exp][strike].call.price.toFixed(2)}
                  </TableCell>
                  <TableCell 
                    className="text-center cursor-pointer hover:bg-muted/50"
                    onClick={() => onSelectOption(strike, 'Put', exp)}
                  >
                    {data.prices[exp][strike].put.price.toFixed(2)}
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

const StockDetail = ({ symbol, onSelectExpiration, onBack, onSelectOption, role }) => {
  const options = optionsData[symbol] || { expirations: [], strikes: [], prices: {} }
  const stockPriceData = generateHistoricalData(symbol)

  return (
    <div className="space-y-4">
      <Button onClick={onBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Overview
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>{symbol} Stock Price ({role} View)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={stockPriceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="price" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{symbol} Options Prices</CardTitle>
        </CardHeader>
        <CardContent>
          <OptionsTable data={options} onSelectExpiration={onSelectExpiration} onSelectOption={onSelectOption} />
        </CardContent>
      </Card>
    </div>
  )
}

const SkewView = ({ symbol, expiration, onSelectOption }) => {
  const skewData = optionsData[symbol].strikes.map(strike => ({
    strike,
    callIV: optionsData[symbol].prices[expiration][strike].call.vega,
    putIV: optionsData[symbol].prices[expiration][strike].put.vega,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Volatility Skew - {symbol} ({expiration})</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={skewData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
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

const ProbabilityDistributionView = ({ symbol, expiration, onSelectOption }) => {
  const stock = stocksData.find(s => s.symbol === symbol)
  const currentPrice = stock ? stock.price : 100
  const distributionData = Array.from({ length: 21 }, (_, i) => {
    const price = currentPrice * (0.8 + i * 0.02)
    const normalizedDiff = (price - currentPrice) / (currentPrice * 0.2)
    const probability = Math.exp(-normalizedDiff * normalizedDiff / 2) / Math.sqrt(2 * Math.PI)
    return { price: price.toFixed(2), probability: probability.toFixed(4) }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Probability Distribution - {symbol} ({expiration})</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={distributionData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
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

const SingleOptionView = ({ symbol, expiration, strike, optionType, onBack, role }) => {
  const optionDetails = optionsData[symbol].prices[expiration][strike][optionType.toLowerCase()]

  return (
    <div className="space-y-4">
      <Button onClick={onBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Expiration View
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>{symbol} {optionType} Option - Strike: {strike}, Expiration: {expiration} ({role} View)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Option Details</h3>
              <div className="space-y-2">
                <p>Price: ${optionDetails.price.toFixed(2)}</p>
                <p>Volume: {optionDetails.volume.toLocaleString()}</p>
                <p>Open Interest: {optionDetails.openInterest.toLocaleString()}</p>
                <p>Implied Volatility: {(optionDetails.vega * 100).toFixed(2)}%</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Greeks</h3>
              <div className="space-y-2">
                <p>Delta: {optionDetails.delta.toFixed(3)}</p>
                <p>Gamma: {optionDetails.gamma.toFixed(3)}</p>
                <p>Theta: {optionDetails.theta.toFixed(3)}</p>
                <p>Vega: {optionDetails.vega.toFixed(3)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const ExpirationView = ({ symbol, expiration, onBack, onSelectOption, role }) => {
  return (
    <div className="space-y-4">
      <Button onClick={onBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />Back to {symbol} Overview
      </Button>
      <div className="space-y-4">
        <SkewView symbol={symbol} expiration={expiration} onSelectOption={onSelectOption} />
        <ProbabilityDistributionView symbol={symbol} expiration={expiration} onSelectOption={onSelectOption} />
      </div>
    </div>
  )
}

const SpreadBuilder = ({ onCancel, onViewSpread, onExecuteOrder, spread, addToSpread }) => {
  const [isBuyMode, setIsBuyMode] = useState(true)
  const [orderType, setOrderType] = useState('market')
  const [limitPrice, setLimitPrice] = useState('')

  const calculateNetGreeks = () => {
    return spread.reduce((acc, item) => ({
      delta: acc.delta + (item.delta || 0) * item.quantity,
      gamma: acc.gamma + (item.gamma || 0) * item.quantity,
      theta: acc.theta + (item.theta || 0) * item.quantity,
      vega: acc.vega + (item.vega || 0) * item.quantity,
      fv: acc.fv + (item.fv || 0) * item.quantity,
    }), { delta: 0, gamma: 0, theta: 0, vega: 0, fv: 0 })
  }

  const calculateNetTheoreticalValue = () => {
    return spread.reduce((acc, item) => acc + (item.fv || 0) * item.quantity, 0)
  }

  const netGreeks = calculateNetGreeks()
  const netTheoreticalValue = calculateNetTheoreticalValue()

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Spread Builder</h3>
      <div className="flex items-center space-x-2 mb-4">
        <Toggle pressed={isBuyMode} onPressedChange={setIsBuyMode}>
          {isBuyMode ? <Plus className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
        </Toggle>
        <span>{isBuyMode ? 'Buy' : 'Sell'} Mode</span>
      </div>
      <div className="space-y-2">
        {spread.map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <span>{item.symbol} {item.type === 'option' ? `${item.optionType} ${item.strike} ${item.expiry}` : ''}</span>
            <span>{item.quantity > 0 ? '+' : ''}{item.quantity}</span>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <p>Net Greeks:</p>
        <GreekDisplay greeks={netGreeks} />
        <p>Net Theoretical Value: ${netTheoreticalValue.toFixed(2)}</p>
      </div>
      <div className="space-y-2">
        <Select value={orderType} onValueChange={setOrderType}>
          <SelectTrigger>
            <SelectValue placeholder="Select order type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="market">Market Order</SelectItem>
            <SelectItem value="limit">Limit Order</SelectItem>
          </SelectContent>
        </Select>
        {orderType === 'limit' && (
          <Input
            type="number"
            placeholder="Limit Price"
            value={limitPrice}
            onChange={(e) => setLimitPrice(e.target.value)}
          />
        )}
      </div>
      <div className="flex space-x-2">
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onViewSpread(spread)}>View Spread</Button>
        <Button onClick={() => onExecuteOrder(spread, orderType, limitPrice)}>Execute Order</Button>
      </div>
    </div>
  )
}

const SpreadView = ({ spread, onBack }) => {
  return (
    <div className="space-y-4">
      <Button onClick={onBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Spread Builder
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Spread Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Instrument</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Delta</TableHead>
                <TableHead>Gamma</TableHead>
                <TableHead>Theta</TableHead>
                <TableHead>Vega</TableHead>
                <TableHead>Fair Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {spread.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.symbol} {item.type === 'option' ? `${item.optionType} ${item.strike} ${item.expiry}` : ''}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.quantity > 0 ? 'Buy' : 'Sell'}</TableCell>
                  <TableCell>{item.delta !== undefined ? item.delta.toFixed(2) : '0.00'}</TableCell>
                  <TableCell>{item.gamma !== undefined ? item.gamma.toFixed(3) : '0.000'}</TableCell>
                  <TableCell>{item.theta !== undefined ? item.theta.toFixed(2) : '0.00'}</TableCell>
                  <TableCell>{item.vega !== undefined ? item.vega.toFixed(2) : '0.00'}</TableCell>
                  <TableCell>${(item.fv * item.quantity).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

const LoginScreen = ({ onLogin, onSignUp }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login to Deskhead</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); onLogin({ email, password }); }} className="space-y-4">
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
            <Button type="submit" className="w-full">Login</Button>
          </form>
          <div className="mt-4 text-center">
            <p>Don't have an account? <Button variant="link" onClick={onSignUp}>Sign up</Button></p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

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
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Sign Up for Deskhead</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  )
}

const DeskChat = ({ messages, onSendMessage, onMessageClick, isCollapsed, onToggleCollapse, unreadCount }) => {
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input)
      setInput('')
    }
  }

  return (
    <div className={`flex flex-col transition-all duration-300 ${isCollapsed ? 'h-12' : 'h-64'} w-1/2 border-r`}>
      <div className="flex items-center justify-between p-2 bg-muted">
        <h3 className="text-sm font-semibold">Desk Chat</h3>
        <div className="flex items-center">
          {isCollapsed && unreadCount > 0 && (
            <div className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2">
              {unreadCount}
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={onToggleCollapse}>
            {isCollapsed ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </div>
      </div>
      {!isCollapsed && (
        <>
          <ScrollArea className="flex-grow">
            <div className="space-y-4 p-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex flex-col p-2 rounded-lg cursor-pointer ${
                    message.sender === 'User' ? 'bg-primary text-primary-foreground ml-auto' : 'bg-muted'
                  }`}
                  onClick={() => onMessageClick(message)}
                >
                  <span className="font-semibold">{message.sender}</span>
                  <span>{message.content}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="flex p-4">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow mr-2"
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button onClick={handleSend}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

const AgentChat = ({ agent, messages, onSendMessage, isCollapsed, onToggleCollapse, unreadCount }) => {
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(agent, input)
      setInput('')
    }
  }

  return (
    <div className={`flex flex-col transition-all duration-300 ${isCollapsed ? 'h-12' : 'h-64'} w-1/2`}>
      <div className="flex items-center justify-between p-2 bg-muted">
        <h3 className="text-sm font-semibold">{agent}</h3>
        <div className="flex items-center">
          {isCollapsed && unreadCount > 0 && (
            <div className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2">
              {unreadCount}
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={onToggleCollapse}>
            {isCollapsed ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </div>
      </div>
      {!isCollapsed && (
        <>
          <ScrollArea className="flex-grow">
            <div className="space-y-4 p-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex flex-col p-2 rounded-lg ${
                    message.sender === 'User' ? 'bg-primary text-primary-foreground ml-auto' : 'bg-muted'
                  }`}
                >
                  <span className="font-semibold">{message.sender}</span>
                  <span>{message.content}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="flex p-4">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow mr-2"
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button onClick={handleSend}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

const RiskManagerOverview = ({ accountValue, pnlPercentage }) => {
  const pnlData = [
    { date: '2023-01-01', pnl: 0 },
    { date: '2023-02-01', pnl: 2 },
    { date: '2023-03-01', pnl: -1 },
    { date: '2023-04-01', pnl: 3 },
    { date: '2023-05-01', pnl: 5 },
    { date: '2023-06-01', pnl: pnlPercentage },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Manager Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Account Performance</h3>
            <p>Account Value: ${accountValue.toFixed(2)}</p>
            <p className={pnlPercentage >= 0 ? 'text-green-500' : 'text-red-500'}>
              PnL: {pnlPercentage >= 0 ? '+' : ''}{pnlPercentage.toFixed(2)}%
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">PnL Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={pnlData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="pnl" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Risk Metrics</h3>
            <p>Portfolio Beta: 1.2</p>
            <p>Value at Risk (VaR): $10,000</p>
            <p>Sharpe Ratio: 1.5</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const RoleLegend = ({ roles, onSelectRole, selectedRole }) => {
  return (
    <div className="bg-muted p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Roles</h3>
      <ul className="space-y-2">
        {roles.map((role) => (
          <li 
            key={role.name} 
            className={`flex items-center cursor-pointer p-2 rounded-md ${selectedRole === role.name ? 'bg-muted-foreground/20' : 'hover:bg-muted-foreground/10'}`}
            onClick={() => onSelectRole(role.name)}
          >
            <div className={`w-4 h-4 rounded-full mr-2`} style={{ backgroundColor: role.color }}></div>
            <span>{role.name}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Component() {
  const [positions, setPositions] = useState(initialPositions)
  const [selectedStock, setSelectedStock] = useState(null)
  const [selectedExpiration, setSelectedExpiration] = useState(null)
  const [selectedOption, setSelectedOption] = useState(null)
  const [isTrading, setIsTrading] = useState(false)
  const [currentSpread, setCurrentSpread] = useState([])
  const [viewingSpread, setViewingSpread] = useState(false)
  const [alerts, setAlerts] = useState([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [hasAccount, setHasAccount] = useState(false)
  const [selectedRole, setSelectedRole] = useState('Deskhead')
  const [deskChatMessages, setDeskChatMessages] = useState([
    { sender: 'Junior Trader', content: 'Hey team, I\'m seeing some unusual activity in AAPL options. The are above the 2 standard deviations above the 10 day average' },
    { sender: 'Risk Manager', content: 'Thanks for the heads up. Can you provide more details on what you\'re seeing?' },
    { sender: 'Researcher', content: 'I\'ve been analyzing AAPL\'s recent earnings report. There might be some correlation.' },
    { sender: 'Junior Trader', content: 'The implied volatility for near-term options has spiked in the last hour.' },
    { sender: 'Risk Manager', content: 'Interesting. Let\'s keep a close eye on this. Junior Trader, can you prepare a quick report on the IV changes?' },
    { sender: 'Researcher', content: 'I\'ll look into any recent news or events that might be causing this. Will update the team shortly.' },
  ])
  const [selectedAgent, setSelectedAgent] = useState(null)
  const [agentChats, setAgentChats] = useState({
    'Junior Trader': [],
    'Risk Manager': [],
    'Researcher': [],
  })
  const [isPositionsPanelCollapsed, setIsPositionsPanelCollapsed] = useState(false)
  const [isToolsPanelCollapsed, setIsToolsPanelCollapsed] = useState(false)
  const [isDeskChatCollapsed, setIsDeskChatCollapsed] = useState(false)
  const [isAgentChatCollapsed, setIsAgentChatCollapsed] = useState(false)
  const [unreadDeskChatCount, setUnreadDeskChatCount] = useState(0)
  const [unreadAgentChatCount, setUnreadAgentChatCount] = useState(0)
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [showSignUpDialog, setShowSignUpDialog] = useState(false)

  const roles = [
    { name: 'Deskhead', color: '#4CAF50' },
    { name: 'Junior Trader', color: '#2196F3' },
    { name: 'Risk Manager', color: '#FFC107' },
    { name: 'Researcher', color: '#9C27B0' },
  ]

  const onDragEnd = (result) => {
    const { source, destination } = result
    if (!destination) return

    const sourceFolder = positions.find(folder => folder.id === source.droppableId)
    const destFolder = positions.find(folder => folder.id === destination.droppableId)

    if (sourceFolder === destFolder) {
      const newItems = Array.from(sourceFolder.items)
      const [reorderedItem] = newItems.splice(source.index, 1)
      newItems.splice(destination.index, 0, reorderedItem)

      const newPositions = positions.map(folder =>
        folder.id === sourceFolder.id ? { ...folder, items: newItems } : folder
      )

      setPositions(newPositions)
    }
  }

  const handleSelectStock = (symbol) => {
    if (!hasAccount) {
      setShowLoginDialog(true)
      return
    }
    setSelectedStock(symbol)
    setSelectedExpiration(null)
    setSelectedOption(null)
  }

  const handleSelectExpiration = (expiration) => {
    if (!hasAccount) {
      setShowLoginDialog(true)
      return
    }
    setSelectedExpiration(expiration)
    setSelectedOption(null)
  }

  const handleSelectOption = (strike, optionType, expiration) => {
    if (!hasAccount) {
      setShowLoginDialog(true)
      return
    }
    if (isTrading) {
      const newInstrument = {
        symbol: selectedStock,
        type: 'option',
        strike,
        optionType,
        expiry: expiration,
        delta: Math.random() * 0.5 + 0.25,
        gamma: Math.random() * 0.05,
        theta: -Math.random() * 0.5,
        vega: Math.random() * 0.5,
        fv: Math.random() * 10 + 5,
      }
      addToSpread(newInstrument)
    } else {
      setSelectedOption({ strike, optionType })
      setSelectedExpiration(expiration)
    }
  }

  const handleBackToOverview = () => {
    setSelectedStock(null)
    setSelectedExpiration(null)
    setSelectedOption(null)
  }

  const handleBackToStockDetail = () => {
    setSelectedExpiration(null)
    setSelectedOption(null)
  }

  const handleBackToExpirationView = () => {
    setSelectedOption(null)
  }

  const handleSelectInstrument = (instrument) => {
    if (!hasAccount) {
      setShowLoginDialog(true)
      return
    }
    if (isTrading) {
      addToSpread({ ...instrument, fv: Math.random() * 10 + 5 })
    } else {
      if (instrument.type === 'stock') {
        handleSelectStock(instrument.name)
      } else if (instrument.type === 'option') {
        handleSelectStock(instrument.name)
        handleSelectExpiration(instrument.expiry)
        handleSelectOption(instrument.strike, instrument.optionType, instrument.expiry)
      }
    }
  }

  const handleStartTrading = () => {
    if (!hasAccount) {
      setShowLoginDialog(true)
      return
    }
    setIsTrading(true)
    setCurrentSpread([])
  }

  const handleCancelTrading = () => {
    setIsTrading(false)
    setCurrentSpread([])
  }

  const handleViewSpread = (spread) => {
    setViewingSpread(true)
  }

  const handleExecuteOrder = (spread, orderType, limitPrice) => {
    const newPositions = [...positions]
    spread.forEach(item => {
      const folderIndex = newPositions.findIndex(folder => 
        folder.items.some(subFolder => subFolder.name === item.symbol)
      )
      if (folderIndex !== -1) {
        const subFolderIndex = newPositions[folderIndex].items.findIndex(subFolder => subFolder.name === item.symbol)
        if (subFolderIndex !== -1) {
          const itemIndex = newPositions[folderIndex].items[subFolderIndex].items.findIndex(position => 
            position.type === item.type &&
            position.strike === item.strike &&
            position.expiry === item.expiry &&
            position.optionType === item.optionType
          )
          if (itemIndex !== -1) {
            newPositions[folderIndex].items[subFolderIndex].items[itemIndex].quantity += item.quantity
          } else {
            newPositions[folderIndex].items[subFolderIndex].items.push({
              id: `${item.symbol}${Date.now()}`,
              ...item
            })
          }
        }
      }
    })
    setPositions(newPositions)
    setAlerts(prevAlerts => [...prevAlerts, { type: 'success', message: 'Order executed successfully' }])
    setIsTrading(false)
    setCurrentSpread([])
  }

  const addToSpread = (instrument) => {
    setCurrentSpread(prevSpread => {
      const existingIndex = prevSpread.findIndex(item => 
        item.symbol === instrument.symbol && 
        item.type === instrument.type &&
        item.strike === instrument.strike &&
        item.expiry === instrument.expiry &&
        item.optionType === instrument.optionType
      )

      if (existingIndex !== -1) {
        const newSpread = [...prevSpread]
        newSpread[existingIndex].quantity += 1
        return newSpread
      } else {
        return [...prevSpread, { ...instrument, quantity: 1 }]
      }
    })
  }

  const handleLogin = (credentials) => {
    setIsAuthenticated(true)
    setHasAccount(true)
    setShowLoginDialog(false)
    setAlerts(prevAlerts => [...prevAlerts, { type: 'success', message: 'Logged in successfully' }])
    setTimeout(() => {
      setAlerts([])
    }, 3000)
  }

  const handleSignUp = (userData) => {
    setIsAuthenticated(true)
    setHasAccount(true)
    setShowSignUpDialog(false)
    setAlerts(prevAlerts => [...prevAlerts, { type: 'success', message: 'Account created successfully' }])
    setTimeout(() => {
      setAlerts([])
    }, 3000)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setHasAccount(false)
    setAlerts(prevAlerts => [...prevAlerts, { type: 'info', message: 'Logged out successfully' }])
    setTimeout(() => {
      setAlerts([])
    }, 3000)
  }

  const handleDeskChatMessage = (message) => {
    setDeskChatMessages(prevMessages => [...prevMessages, { sender: 'User', content: message }])
    if (isDeskChatCollapsed) {
      setUnreadDeskChatCount(prevCount => prevCount + 1)
    }
    // Simulated response
    setTimeout(() => {
      setDeskChatMessages(prevMessages => [...prevMessages, { sender: 'AI Assistant', content: 'This is a simulated response to your message.' }])
      if (isDeskChatCollapsed) {
        setUnreadDeskChatCount(prevCount => prevCount + 1)
      }
    }, 1000)
  }

  const handleDeskChatMessageClick = (message) => {
    setSelectedAgent(message.sender)
  }

  const handleSendAgentMessage = (agent, content) => {
    setAgentChats(prevChats => ({
      ...prevChats,
      [agent]: [...prevChats[agent], { sender: 'User', content }]
    }))
    if (isAgentChatCollapsed) {
      setUnreadAgentChatCount(prevCount => prevCount + 1)
    }
    // Simulated AI response
    setTimeout(() => {
      setAgentChats(prevChats => ({
        ...prevChats,
        [agent]: [...prevChats[agent], { sender: agent, content: `This is a simulated response from ${agent}.` }]
      }))
      if (isAgentChatCollapsed) {
        setUnreadAgentChatCount(prevCount => prevCount + 1)
      }
    }, 1000)
  }

  const handleShowRiskManager = () => {
    if (!hasAccount) {
      setShowLoginDialog(true)
      return
    }
    setSelectedRole('Risk Manager')
  }

  const renderMainContent = () => {
    if (viewingSpread) {
      return <SpreadView spread={currentSpread} onBack={() => setViewingSpread(false)} />
    } else if (selectedStock) {
      if (selectedExpiration) {
        if (selectedOption) {
          return (
            <SingleOptionView
              symbol={selectedStock}
              expiration={selectedExpiration}
              strike={selectedOption.strike}
              optionType={selectedOption.optionType}
              onBack={handleBackToExpirationView}
              role={selectedRole}
            />
          )
        } else {
          return (
            <ExpirationView
              symbol={selectedStock}
              expiration={selectedExpiration}
              onBack={handleBackToStockDetail}
              onSelectOption={handleSelectOption}
              role={selectedRole}
            />
          )
        }
      } else {
        return (
          <StockDetail
            symbol={selectedStock}
            onSelectExpiration={handleSelectExpiration}
            onBack={handleBackToOverview}
            onSelectOption={handleSelectOption}
            role={selectedRole}
          />
        )
      }
    } else if (selectedRole === 'Risk Manager') {
      const accountValue = positions.reduce((total, folder) => {
        return total + folder.items.reduce((folderTotal, subFolder) => {
          return folderTotal + subFolder.items.reduce((subFolderTotal, item) => {
            return subFolderTotal + item.quantity * item.fv
          }, 0)
        }, 0)
      }, 0)
      const pnl = positions.reduce((total, folder) => {
        return total + folder.items.reduce((folderTotal, subFolder) => {
          return folderTotal + subFolder.items.reduce((subFolderTotal, item) => {
            const currentPrice = stocksData.find(stock => stock.symbol === subFolder.name)?.price || item.tradePrice
            return subFolderTotal + item.quantity * (currentPrice - item.tradePrice)
          }, 0)
        }, 0)
      }, 0)
      const pnlPercentage = (pnl / accountValue) * 100
      return <RiskManagerOverview accountValue={accountValue} pnlPercentage={pnlPercentage} />
    } else {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Market Overview ({selectedRole} View)</CardTitle>
          </CardHeader>
          <CardContent>
            <StockTable stocks={stocksData} onSelectStock={handleSelectStock} />
          </CardContent>
        </Card>
      )
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar - Positions */}
        <aside className="border-r">
          <PositionsPanel 
            positions={positions} 
            onDragEnd={onDragEnd} 
            onSelectInstrument={handleSelectInstrument}
            isCollapsed={isPositionsPanelCollapsed}
            onToggleCollapse={() => setIsPositionsPanelCollapsed(!isPositionsPanelCollapsed)}
            onShowRiskManager={handleShowRiskManager}
          />
        </aside>

        {/* Main content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Role selector tabs */}
          <Tabs value={selectedRole} onValueChange={setSelectedRole} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="Deskhead">Deskhead</TabsTrigger>
              <TabsTrigger value="Junior Trader">Junior Trader</TabsTrigger>
              <TabsTrigger value="Risk Manager">Risk Manager</TabsTrigger>
              <TabsTrigger value="Researcher">Researcher</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Central panel - Stocks and Details */}
          <div className="flex-1 p-4 overflow-auto">
            {renderMainContent()}
          </div>

          {/* Chat windows */}
          <div className="flex border-t">
            <DeskChat 
              messages={deskChatMessages} 
              onSendMessage={handleDeskChatMessage} 
              onMessageClick={handleDeskChatMessageClick}
              isCollapsed={isDeskChatCollapsed}
              onToggleCollapse={() => {
                setIsDeskChatCollapsed(!isDeskChatCollapsed)
                if (isDeskChatCollapsed) {
                  setUnreadDeskChatCount(0)
                }
              }}
              unreadCount={unreadDeskChatCount}
            />
            {selectedAgent && (
              <AgentChat
                agent={selectedAgent}
                messages={agentChats[selectedAgent]}
                onSendMessage={handleSendAgentMessage}
                isCollapsed={isAgentChatCollapsed}
                onToggleCollapse={() => {
                  setIsAgentChatCollapsed(!isAgentChatCollapsed)
                  if (isAgentChatCollapsed) {
                    setUnreadAgentChatCount(0)
                  }
                }}
                unreadCount={unreadAgentChatCount}
              />
            )}
          </div>
        </main>

        {/* Right sidebar - Tools */}
        <aside className={`border-l transition-all duration-300 ${isToolsPanelCollapsed ? 'w-12' : 'w-64'}`}>
          <div className="p-4 flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-lg font-semibold ${isToolsPanelCollapsed ? 'hidden' : ''}`}>Tools</h2>
              <Button variant="ghost" size="sm" onClick={() => setIsToolsPanelCollapsed(!isToolsPanelCollapsed)}>
                {isToolsPanelCollapsed ? <ChevronLeft /> : <ChevronRight />}
              </Button>
            </div>
            {!isToolsPanelCollapsed && (
              <ScrollArea className="flex-grow mb-4">
                {isTrading ? (
                  <SpreadBuilder
                    onCancel={handleCancelTrading}
                    onViewSpread={handleViewSpread}
                    onExecuteOrder={handleExecuteOrder}
                    spread={currentSpread}
                    addToSpread={addToSpread}
                  />
                ) : (
                  <div className="space-y-4">
                    {selectedStock && !viewingSpread && (
                      <Button className="w-full" onClick={handleStartTrading}>Trade {selectedStock}</Button>
                    )}
                    <Button className="w-full">Option Calculator</Button>
                    <Button className="w-full">Market Scanner</Button>
                    {isAuthenticated ? (
                      <Button className="w-full" onClick={handleLogout}>Logout</Button>
                    ) : (
                      <Button className="w-full" onClick={() => setShowLoginDialog(true)}>Login</Button>
                    )}
                  </div>
                )}
              </ScrollArea>
            )}
            <RoleLegend roles={roles} onSelectRole={setSelectedRole} selectedRole={selectedRole} />
          </div>
        </aside>

        {/* Alerts */}
        <div className="fixed bottom-4 right-4 space-y-2">
          {alerts.map((alert, index) => (
            <Alert key={index} variant={alert.type}>
              <AlertTitle>{alert.type === 'error' ? 'Error' : 'Success'}</AlertTitle>
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          ))}
        </div>
      </div>

      {/* Login Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login to Deskhead</DialogTitle>
            <DialogDescription>
              Enter your credentials to access all features.
            </DialogDescription>
          </DialogHeader>
          <LoginScreen onLogin={handleLogin} onSignUp={() => { setShowLoginDialog(false); setShowSignUpDialog(true); }} />
        </DialogContent>
      </Dialog>

      {/* Sign Up Dialog */}
      <Dialog open={showSignUpDialog} onOpenChange={setShowSignUpDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign Up for Deskhead</DialogTitle>
            <DialogDescription>
              Create an account to access all features.
            </DialogDescription>
          </DialogHeader>
          <SignUpScreen onSignUp={handleSignUp} />
        </DialogContent>
      </Dialog>
    </div>
  )
}