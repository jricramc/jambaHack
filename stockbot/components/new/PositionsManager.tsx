'use client'

import React, { useState, useEffect } from 'react'
import PositionsPanel from '@/components/new/PositionsPanel'
import { stocksData } from '@/data/stocksData'
import { initialPositions } from '@/components/new/InitialPositions'
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from 'lucide-react'

const PositionsManager = ({ onSelectInstrument, onShowRiskManager }) => {
  const [positions, setPositions] = useState(initialPositions)
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    // You can fetch positions from an API here if needed
  }, [])

  const onDragEnd = (result) => {
    const { source, destination } = result
    if (!destination) return

    const newPositions = [...positions]
    let draggedItem

    // Find and remove dragged item
    for (const sector of newPositions) {
      for (const stock of sector.items) {
        const itemIndex = stock.items.findIndex(item => item.id === result.draggableId)
        if (itemIndex !== -1) {
          draggedItem = stock.items[itemIndex]
          stock.items.splice(itemIndex, 1)
          break
        }
      }
      if (draggedItem) break
    }

    // Add dragged item to new position
    for (const sector of newPositions) {
      const stockIndex = sector.items.findIndex(stock => stock.id === destination.droppableId)
      if (stockIndex !== -1) {
        sector.items[stockIndex].items.splice(destination.index, 0, draggedItem)
        break
      }
    }

    setPositions(newPositions)
  }

  const handleSelectInstrument = (item) => {
    if (item.type === 'stock') {
      onSelectInstrument({ symbol: item.symbol, type: 'stock' })
    } else if (item.type === 'option') {
      onSelectInstrument({
        symbol: item.symbol,
        type: 'option',
        strike: item.strike,
        optionType: item.optionType,
        expiry: item.expiry
      })
    }
  }

  return (
    <div className={`h-full flex flex-col transition-all duration-300 ${isCollapsed ? 'w-12' : 'w-[360px]'}`}>
      <div className="flex justify-between items-center p-2">
        <h2 className={`font-bold ${isCollapsed ? 'hidden' : ''}`}>Positions</h2>
        <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>
      <div className="flex-1 overflow-hidden">
        {!isCollapsed && (
          <PositionsPanel
            positions={positions}
            onDragEnd={onDragEnd}
            onSelectInstrument={handleSelectInstrument}
            onShowRiskManager={onShowRiskManager}
            stocksData={stocksData}
          />
        )}
      </div>
    </div>
  )
}

export default PositionsManager