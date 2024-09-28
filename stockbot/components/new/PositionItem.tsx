import React from 'react'
import { Draggable } from 'react-beautiful-dnd'

const formatNumber = (num: number | undefined) => {
  if (num === undefined) return 'N/A'
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'k'
  return num.toFixed(1)
}

const GreekDisplay = ({ greeks }) => (
  <div className="grid grid-cols-4 gap-2 text-xs text-right">
    <span>{greeks.delta !== undefined ? greeks.delta.toFixed(2) : 'N/A'}</span>
    <span>{greeks.gamma !== undefined ? greeks.gamma.toFixed(3) : 'N/A'}</span>
    <span>{greeks.theta !== undefined ? greeks.theta.toFixed(2) : 'N/A'}</span>
    <span>{greeks.vega !== undefined ? greeks.vega.toFixed(2) : 'N/A'}</span>
  </div>
)

const PnLDisplay = ({ item }) => (
  <div className="grid grid-cols-4 gap-2 text-xs text-right">
    <span>${formatNumber(item.tradePrice)}</span>
    <span>{item.quantity}</span>
    <span>{item.tradePrice ? ((item.fv / item.tradePrice - 1) * 100).toFixed(1) : 'N/A'}%</span>
    <span>${formatNumber(item.fv * item.quantity)}</span>
  </div>
)

const PositionItem = ({ item, index, onSelectInstrument, showGreeks, depth = 0 }) => {
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

  const handleClick = () => {
    if (item.type === 'stock' || item.type === 'option') {
      onSelectInstrument({
        symbol: item.symbol,
        type: item.type,
        strike: item.strike,
        optionType: item.optionType,
        expiry: item.expiry
      })
    }
  }

  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="flex items-center py-1 cursor-pointer hover:bg-muted/50 text-xs"
          onClick={handleClick}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
        >
          <div className="flex-grow overflow-hidden whitespace-nowrap text-ellipsis pr-2">
            <span>{getDisplayName()}</span>
          </div>
          <div className="flex-shrink-0 w-52 pr-4">
            {showGreeks ? <GreekDisplay greeks={item} /> : <PnLDisplay item={item} />}
          </div>
        </div>
      )}
    </Draggable>
  )
}

export default PositionItem