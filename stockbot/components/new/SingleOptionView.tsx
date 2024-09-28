'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react'
import { optionsData, OptionDetails } from '@/data/optionsData'

const SingleOptionView = ({ symbol, expiration, strike, optionType, onBack, role }: {
  symbol: string;
  expiration: string;
  strike: number;
  optionType: 'call' | 'put';
  onBack: () => void;
  role: string;
}) => {
  const option = optionsData[symbol]?.expirations?.[expiration]?.strikes?.[strike]?.[optionType.toLowerCase()] as OptionDetails | undefined

  if (!option) {
    return <div>Option not found</div>
  }

  return (
    <div>
      <Button onClick={onBack} variant="ghost" className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Expiration View
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>{symbol} {optionType} {strike} - Expiration: {expiration}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Price</p>
              <p>Price: ${option?.price.toFixed(2)}</p>
            </div>
            <div>
              <p className="font-semibold">Volume</p>
              <p>{option.volume}</p>
            </div>
            <div>
              <p className="font-semibold">Open Interest</p>
              <p>{option.openInterest}</p>
            </div>
            {role !== 'Junior Trader' && (
              <>
                <div>
                  <p className="font-semibold">Delta</p>
                  <p>{option.delta.toFixed(2)}</p>
                </div>
                <div>
                  <p className="font-semibold">Gamma</p>
                  <p>{option.gamma.toFixed(3)}</p>
                </div>
                <div>
                  <p className="font-semibold">Theta</p>
                  <p>{option.theta.toFixed(2)}</p>
                </div>
                <div>
                  <p className="font-semibold">Vega</p>
                  <p>{option.vega.toFixed(2)}</p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SingleOptionView