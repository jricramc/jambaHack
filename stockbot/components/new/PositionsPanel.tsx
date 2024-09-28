import React, { useState } from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import FolderItem from '@/components/new/FolderItem'
import { stocksData } from '@/data/stocksData'

const formatNumber = (num: number | undefined) => {
  if (num === undefined) return 'N/A'
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'k'
  return num.toFixed(1)
}

const PositionsPanel = ({ positions, onDragEnd, onSelectInstrument, onShowRiskManager }) => {
  const [showGreeks, setShowGreeks] = useState(false)

  const calculatePnL = () => {
    return positions.reduce((total, folder) => {
      return total + folder.items.reduce((folderTotal, subFolder) => {
        return folderTotal + subFolder.items.reduce((subFolderTotal, item) => {
          const currentPrice = stocksData.find(stock => stock.symbol === subFolder.name)?.price || item.tradePrice
          const pnl = item.quantity * (currentPrice - item.tradePrice)
          return subFolderTotal + pnl
        }, 0)
      }, 0)
    }, 0)
  }

  const calculateAccountValue = () => {
    return positions.reduce((total, folder) => {
      return total + folder.items.reduce((folderTotal, subFolder) => {
        return folderTotal + subFolder.items.reduce((subFolderTotal, item) => {
          return subFolderTotal + item.quantity * item.fv
        }, 0)
      }, 0)
    }, 0)
  }

  const pnl = calculatePnL()
  const accountValue = calculateAccountValue()
  const pnlPercentage = (pnl / accountValue) * 100

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 mb-4 p-4">
        <div 
          className="text-sm mb-4 cursor-pointer bg-muted rounded-lg p-4"
          onClick={onShowRiskManager}
        >
          <div className="font-semibold mb-1">Paper Account:</div>
          <div className="text-xl font-bold">${formatNumber(accountValue)}</div>
          <div className={`text-sm ${pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {pnlPercentage >= 0 ? '+' : ''}{pnlPercentage.toFixed(2)}%
          </div>
        </div>
        <div className="flex justify-between mb-4 space-x-2">
          <Button 
            variant={showGreeks ? "outline" : "default"} 
            size="sm" 
            onClick={() => setShowGreeks(false)}
            className="flex-1"
          >
            Performance
          </Button>
          <Button 
            variant={showGreeks ? "default" : "outline"} 
            size="sm" 
            onClick={() => setShowGreeks(true)}
            className="flex-1"
          >
            Risk
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-grow px-4">
        <div className="mb-2 flex items-center text-xs font-medium text-muted-foreground">
          <div className="flex-grow"></div>
          <div className="flex-shrink-0 w-52 grid grid-cols-4 gap-2 text-right pr-4">
            {showGreeks ? (
              <>
                <span className="pr-1">Δ</span>
                <span className="pr-1">Γ</span>
                <span className="pr-1">Θ</span>
                <span className="pr-1">V</span>
              </>
            ) : (
              <>
                <span className="pr-1">Price</span>
                <span className="pr-1">#</span>
                <span className="pr-1">%</span>
                <span className="pr-1">Value</span>
              </>
            )}
          </div>
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          {positions.map((folder, index) => (
            <FolderItem 
              key={folder.id} 
              folder={folder} 
              index={index} 
              onSelectInstrument={onSelectInstrument} 
              showGreeks={showGreeks} 
            />
          ))}
        </DragDropContext>
      </ScrollArea>
    </div>
  )
}

export default PositionsPanel