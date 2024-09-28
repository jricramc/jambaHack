import React, { useState } from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight } from 'lucide-react'
import PositionItem from '@/components/new/PositionItem'

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

const calculateTotals = (items) => {
  return items.reduce((acc, item) => {
    if (item.items) {
      const subTotals = calculateTotals(item.items);
      return {
        delta: acc.delta + subTotals.delta,
        gamma: acc.gamma + subTotals.gamma,
        theta: acc.theta + subTotals.theta,
        vega: acc.vega + subTotals.vega,
        fv: acc.fv + subTotals.fv,
        quantity: acc.quantity + subTotals.quantity,
        tradePrice: acc.tradePrice + subTotals.tradePrice,
      };
    } else {
      return {
        delta: acc.delta + (item.delta || 0) * item.quantity,
        gamma: acc.gamma + (item.gamma || 0) * item.quantity,
        theta: acc.theta + (item.theta || 0) * item.quantity,
        vega: acc.vega + (item.vega || 0) * item.quantity,
        fv: acc.fv + (item.fv || 0) * item.quantity,
        quantity: acc.quantity + item.quantity,
        tradePrice: acc.tradePrice + (item.tradePrice || 0) * item.quantity,
      };
    }
  }, { delta: 0, gamma: 0, theta: 0, vega: 0, fv: 0, quantity: 0, tradePrice: 0 });
};

const FolderItem = ({ folder, index, onSelectInstrument, showGreeks, depth = 0 }) => {
  const [isOpen, setIsOpen] = useState(true)

  const totals = calculateTotals(folder.items)

  return (
    <div>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex items-center w-full py-1 hover:bg-muted/50 text-xs">
          <div className="flex-grow flex items-center overflow-hidden" style={{ paddingLeft: `${depth * 16}px` }}>
            {isOpen ? <ChevronDown className="w-3 h-3 mr-1 flex-shrink-0" /> : <ChevronRight className="w-3 h-3 mr-1 flex-shrink-0" />}
            <span className="truncate font-medium">{folder.name}</span>
          </div>
          <div className="flex-shrink-0 w-52 pr-4">
            {showGreeks ? <GreekDisplay greeks={totals} /> : <PnLDisplay item={totals} />}
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          {folder.items.map((item, itemIndex) => (
            item.items ? (
              <Droppable key={item.id} droppableId={item.id}>
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    <FolderItem
                      folder={item}
                      index={itemIndex}
                      onSelectInstrument={onSelectInstrument}
                      showGreeks={showGreeks}
                      depth={depth + 1}
                    />
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ) : (
              <PositionItem
                key={item.id}
                item={item}
                index={itemIndex}
                onSelectInstrument={onSelectInstrument}
                showGreeks={showGreeks}
                depth={depth + 1}
              />
            )
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

export default FolderItem