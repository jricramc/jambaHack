import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { stocksData as initialStocksData } from '@/data/stocksData'

export interface Stock {
  symbol: string
  name: string
  price: number
  change: number
  // Add other properties as needed
}

interface StockUniverseContextType {
  stocks: Stock[]
  addStock: (stock: Stock) => void
  removeStock: (symbol: string) => void
  getStock: (symbol: string) => Stock | undefined
}

const StockUniverseContext = createContext<StockUniverseContextType | undefined>(undefined)

export const useStockUniverse = () => {
  const context = useContext(StockUniverseContext)
  if (!context) {
    throw new Error('useStockUniverse must be used within a StockUniverseProvider')
  }
  return context
}

interface StockUniverseProviderProps {
  children: ReactNode;
}

export const StockUniverseProvider: React.FC<StockUniverseProviderProps> = ({ children }) => {
  const [stocks, setStocks] = useState<Stock[]>(initialStocksData)

  useEffect(() => {
    // Here you could fetch the user's selected stocks from an API
    // For now, we'll use the initial stocks data
  }, [])

  const addStock = (stock: Stock) => {
    setStocks(prevStocks => [...prevStocks, stock])
  }

  const removeStock = (symbol: string) => {
    setStocks(prevStocks => prevStocks.filter(stock => stock.symbol !== symbol))
  }

  const getStock = (symbol: string) => {
    return stocks.find(stock => stock.symbol === symbol)
  }

  return (
    <StockUniverseContext.Provider value={{ stocks, addStock, removeStock, getStock }}>
      {children}
    </StockUniverseContext.Provider>
  )
}