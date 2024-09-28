import { stocksData } from '@/data/stocksData'

export type OptionDetails = {
  price: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  volume: number;
  openInterest: number;
  impliedVolatility: number;
  bid: number;
  ask: number;
  lastPrice: number;
  change: number;
  percentChange: number;
}

type StrikeData = {
  [strike: number]: {
    call: OptionDetails;
    put: OptionDetails;
  }
}

type ExpirationData = {
  [expiration: string]: {
    strikes: StrikeData;
  }
}

type OptionsData = {
  [symbol: string]: {
    expirations: ExpirationData;
  }
}

export const optionsData: OptionsData = stocksData.reduce((acc, stock) => {
  acc[stock.symbol] = {
    expirations: ['2023-07-21', '2023-08-18', '2023-09-15', '2023-10-20', '2023-11-17'].reduce((expAcc, expiration) => {
      expAcc[expiration] = {
        strikes: [0.8, 0.9, 0.95, 1, 1.05, 1.1, 1.2].map(multiplier => {
          const strike = Math.round(stock.price * multiplier)
          return {
            [strike]: {
              call: {
                price: Number((Math.random() * 10 + 5).toFixed(2)),
                delta: Number((Math.random() * 0.5 + 0.25).toFixed(2)),
                gamma: Number((Math.random() * 0.05).toFixed(3)),
                theta: Number((-Math.random() * 0.5).toFixed(2)),
                vega: Number((Math.random() * 0.5).toFixed(2)),
                volume: Math.floor(Math.random() * 1000) + 100,
                openInterest: Math.floor(Math.random() * 5000) + 1000,
                impliedVolatility: Number((Math.random() * 0.3 + 0.1).toFixed(2)),
                bid: Number((Math.random() * 9 + 5).toFixed(2)),
                ask: Number((Math.random() * 11 + 5).toFixed(2)),
                lastPrice: Number((Math.random() * 10 + 5).toFixed(2)),
                change: Number((Math.random() * 2 - 1).toFixed(2)),
                percentChange: Number((Math.random() * 20 - 10).toFixed(2)),
              },
              put: {
                price: Number((Math.random() * 10 + 5).toFixed(2)),
                delta: Number((-Math.random() * 0.5 - 0.25).toFixed(2)),
                gamma: Number((Math.random() * 0.05).toFixed(3)),
                theta: Number((-Math.random() * 0.5).toFixed(2)),
                vega: Number((Math.random() * 0.5).toFixed(2)),
                volume: Math.floor(Math.random() * 1000) + 100,
                openInterest: Math.floor(Math.random() * 5000) + 1000,
                impliedVolatility: Number((Math.random() * 0.3 + 0.1).toFixed(2)),
                bid: Number((Math.random() * 9 + 5).toFixed(2)),
                ask: Number((Math.random() * 11 + 5).toFixed(2)),
                lastPrice: Number((Math.random() * 10 + 5).toFixed(2)),
                change: Number((Math.random() * 2 - 1).toFixed(2)),
                percentChange: Number((Math.random() * 20 - 10).toFixed(2)),
              }
            }
          }
        }).reduce((strikeAcc, strike) => ({ ...strikeAcc, ...strike }), {})
      }
      return expAcc
    }, {})
  }
  return acc
}, {} as OptionsData)