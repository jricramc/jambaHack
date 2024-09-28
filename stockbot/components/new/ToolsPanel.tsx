'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import SpreadBuilder from '@/components/new/SpreadBuilder'

const ToolsPanel = ({ 
  isCollapsed, 
  onToggleCollapse, 
  isTrading, 
  onStartTrading, 
  onCancelTrading, 
  onViewSpread, 
  onExecuteOrder, 
  spread, 
  addToSpread, 
  selectedStock, 
  isAuthenticated, 
  onLogin, 
  onLogout 
}) => {
  return (
    <div className={`transition-all duration-300 ${isCollapsed ? 'w-12' : 'w-64'}`}>
      <div className="p-4 flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-lg font-semibold ${isCollapsed ? 'hidden' : ''}`}>Tools</h2>
          <Button variant="ghost" size="sm" onClick={onToggleCollapse}>
            {isCollapsed ? <ChevronLeft /> : <ChevronRight />}
          </Button>
        </div>
        {!isCollapsed && (
          <ScrollArea className="flex-grow mb-4">
            {isTrading ? (
              <SpreadBuilder
                onCancel={onCancelTrading}
                onViewSpread={onViewSpread}
                onExecuteOrder={onExecuteOrder}
                spread={spread}
                addToSpread={addToSpread}
              />
            ) : (
              <div className="space-y-4">
                {selectedStock && (
                  <Button className="w-full" onClick={onStartTrading}>Trade {selectedStock}</Button>
                )}
                <Button className="w-full">Option Calculator</Button>
                <Button className="w-full">Market Scanner</Button>
                {isAuthenticated ? (
                  <Button className="w-full" onClick={onLogout}>Logout</Button>
                ) : (
                  <Button className="w-full" onClick={onLogin}>Login</Button>
                )}
              </div>
            )}
          </ScrollArea>
        )}
      </div>
    </div>
  )
}

export default ToolsPanel