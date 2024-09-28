'use client';

import React, { useEffect, useState } from 'react';
import AlpacaClient from '@alpacahq/alpaca-trade-api';

interface Stock {
  symbol: string;
  lastPrice: number;
  change: number;
}

const DynamicStockList: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);

  useEffect(() => {
    // ... (rest of your existing useEffect code)
  }, []);

  return (
    <ul>
      {stocks.map((stock) => (
        <li key={stock.symbol} className="mb-2">
          <span className="font-bold">{stock.symbol}</span>:
          <span className="ml-2">${stock.lastPrice.toFixed(2)}</span>
          <span className={`ml-2 ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            ({stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%)
          </span>
        </li>
      ))}
    </ul>
  );
};

export default DynamicStockList;