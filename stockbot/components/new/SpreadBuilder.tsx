import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Toggle } from "@/components/ui/toggle"
import { Plus, Minus } from 'lucide-react'
import { GreekDisplay } from './GreekDisplay'

interface SpreadBuilderProps {
  onCancel: () => void
  onViewSpread: (spread: any[]) => void
  onExecuteOrder: (spread: any[], orderType: string, limitPrice: string) => void
  spread: any[]
  addToSpread: (instrument: any) => void
}

const SpreadBuilder: React.FC<SpreadBuilderProps> = ({ 
  onCancel, 
  onViewSpread, 
  onExecuteOrder, 
  spread, 
  addToSpread 
}) => {
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

export default SpreadBuilder