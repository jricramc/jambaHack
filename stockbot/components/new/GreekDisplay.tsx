import React from 'react'

interface Greeks {
  delta?: number
  gamma?: number
  theta?: number
  vega?: number
}

interface GreekDisplayProps {
  greeks: Greeks
}

export const GreekDisplay: React.FC<GreekDisplayProps> = ({ greeks }) => (
  <div className="grid grid-cols-4 gap-1 text-xs text-right">
    <span>{greeks.delta !== undefined ? greeks.delta.toFixed(2) : 'N/A'}</span>
    <span>{greeks.gamma !== undefined ? greeks.gamma.toFixed(3) : 'N/A'}</span>
    <span>{greeks.theta !== undefined ? greeks.theta.toFixed(2) : 'N/A'}</span>
    <span>{greeks.vega !== undefined ? greeks.vega.toFixed(2) : 'N/A'}</span>
  </div>
)