import React from 'react'

export interface Position {
  id: string
  name: string
  type: 'stock' | 'option'
  symbol: string
  quantity: number
  tradePrice: number
  fv: number
  delta?: number
  gamma?: number
  theta?: number
  vega?: number
  expiry?: string
  strike?: number
  optionType?: 'Call' | 'Put'
}

export interface Folder {
  id: string
  name: string
  items: (Folder | Position)[]
}

export const initialPositions: Folder[] = [
  {
    id: 'technology',
    name: 'Technology',
    items: [
      {
        id: 'aapl',
        name: 'AAPL',
        items: [
          {
            id: 'aapl-stock',
            name: 'AAPL',
            type: 'stock',
            symbol: 'AAPL',
            quantity: 100,
            tradePrice: 150,
            fv: 155,
            delta: 1,
            gamma: 0,
            theta: 0,
            vega: 0
          },
          {
            id: 'aapl-option-1',
            name: 'AAPL 160C',
            type: 'option',
            symbol: 'AAPL',
            quantity: 1,
            tradePrice: 5,
            fv: 5.5,
            delta: 0.6,
            gamma: 0.02,
            theta: -0.5,
            vega: 0.1,
            expiry: '2023-12-15',
            strike: 160,
            optionType: 'Call'
          }
        ]
      },
      {
        id: 'googl',
        name: 'GOOGL',
        items: [
          {
            id: 'googl-stock',
            name: 'GOOGL',
            type: 'stock',
            symbol: 'GOOGL',
            quantity: 50,
            tradePrice: 2800,
            fv: 2850,
            delta: 1,
            gamma: 0,
            theta: 0,
            vega: 0
          }
        ]
      }
    ]
  },
  {
    id: 'finance',
    name: 'Finance',
    items: [
      {
        id: 'jpm',
        name: 'JPM',
        items: [
          {
            id: 'jpm-stock',
            name: 'JPM',
            type: 'stock',
            symbol: 'JPM',
            quantity: 75,
            tradePrice: 140,
            fv: 142,
            delta: 1,
            gamma: 0,
            theta: 0,
            vega: 0
          }
        ]
      }
    ]
  }
]

const InitialPositions: React.FC = () => {
  // This component doesn't render anything, it's just a container for the data
  return null
}

export default InitialPositions