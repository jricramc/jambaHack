'use client'

import React, { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Header from '@/components/new/Header'
import PositionsPanel from '@/components/new/PositionsPanel'
import StockTable from '@/components/new/StockTable'
import StockDetail from '@/components/new/StockDetail'
import ExpirationView from '@/components/new/ExpirationView'
import SingleOptionView from '@/components/new/SingleOptionView'
import SpreadView from '@/components/new/SpreadView'
import RiskManagerOverview from '@/components/new/RiskManagerOverview'
import DeskChat from '@/components/new/DeskChat'
import AgentChat from '@/components/new/AgentChat'
import ToolsPanel from '@/components/new/ToolsPanel'
import LoginDialog from '@/components/new/LoginDialog'
import SignUpDialog from '@/components/new/SignUpDialog'
import AlertComponent from '@/components/new/AlertComponent'
import RoleLegend from '@/components/new/RoleLegend'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

// Mock data (you might want to move this to a separate file)
const stocksData = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 150.25, change: 2.5 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 2750.80, change: -0.3 },
  // Add more mock stocks as needed
]

// Mock historical data for stocks
const generateHistoricalData = (symbol, days = 30) => {
  const data = []
  let price = stocksData.find(stock => stock.symbol === symbol)?.price || 100
  for (let i = days; i > 0; i--) {
    price += (Math.random() - 0.5) * 5
    data.push({
      date: format(new Date(Date.now() - i * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
      price: Number(price.toFixed(2))
    })
  }
  return data
}

export default function TradingPlatform() {
  const [positions, setPositions] = useState([])
  const [selectedStock, setSelectedStock] = useState(null)
  const [selectedExpiration, setSelectedExpiration] = useState(null)
  const [selectedOption, setSelectedOption] = useState(null)
  const [isTrading, setIsTrading] = useState(false)
  const [currentSpread, setCurrentSpread] = useState([])
  const [viewingSpread, setViewingSpread] = useState(false)
  const [selectedRole, setSelectedRole] = useState('Deskhead')
  const [deskChatMessages, setDeskChatMessages] = useState([])
  const [agentChats, setAgentChats] = useState({})
  const [selectedAgent, setSelectedAgent] = useState(null)
  const [isDeskChatCollapsed, setIsDeskChatCollapsed] = useState(false)
  const [isAgentChatCollapsed, setIsAgentChatCollapsed] = useState(false)
  const [unreadDeskChatCount, setUnreadDeskChatCount] = useState(0)
  const [unreadAgentChatCount, setUnreadAgentChatCount] = useState(0)
  const [isToolsPanelCollapsed, setIsToolsPanelCollapsed] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [hasAccount, setHasAccount] = useState(false)
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [showSignUpDialog, setShowSignUpDialog] = useState(false)
  const [alerts, setAlerts] = useState([])

  const roles = [
    { name: 'Deskhead', color: '#4CAF50' },
    { name: 'Junior Trader', color: '#2196F3' },
    { name: 'Risk Manager', color: '#FFC107' },
    { name: 'Researcher', color: '#9C27B0' },
  ]

  useEffect(() => {
    // Fetch initial data
    fetchPositions()
  }, [])

  const fetchPositions = () => {
    // Mock fetching positions
    setPositions([
      {
        id: 'folder1',
        name: 'Stocks',
        items: [
          {
            id: 'subfolder1',
            name: 'AAPL',
            items: [
              { id: 'position1', symbol: 'AAPL', type: 'stock', quantity: 100, tradePrice: 150, fv: 155 }
            ]
          }
        ]
      },
      {
        id: 'folder2',
        name: 'Options',
        items: [
          {
            id: 'subfolder2',
            name: 'GOOGL',
            items: [
              { id: 'position2', symbol: 'GOOGL', type: 'option', strike: 2800, optionType: 'Call', expiry: '2023-12-15', quantity: 10, tradePrice: 50, fv: 55, delta: 0.6, gamma: 0.02, theta: -0.5, vega: 0.1 }
            ]
          }
        ]
      }
    ])
  }

  const onDragEnd = (result) => {
    const { source, destination } = result
    if (!destination) return

    const sourceFolder = positions.find(folder => folder.id === source.droppableId)
    const destFolder = positions.find(folder => folder.id === destination.droppableId)

    if (sourceFolder === destFolder) {
      const newItems = Array.from(sourceFolder.items)
      const [reorderedItem] = newItems.splice(source.index, 1)
      newItems.splice(destination.index, 0, reorderedItem)

      const newPositions = positions.map(folder =>
        folder.id === sourceFolder.id ? { ...folder, items: newItems } : folder
      )

      setPositions(newPositions)
    }
  }

  const handleSelectStock = (symbol) => {
    if (!hasAccount) {
      setShowLoginDialog(true)
      return
    }
    setSelectedStock(symbol)
    setSelectedExpiration(null)
    setSelectedOption(null)
  }

  const handleSelectExpiration = (expiration) => {
    if (!hasAccount) {
      setShowLoginDialog(true)
      return
    }
    setSelectedExpiration(expiration)
    setSelectedOption(null)
  }

  const handleSelectOption = (strike, optionType, expiration) => {
    if (!hasAccount) {
      setShowLoginDialog(true)
      return
    }
    if (isTrading) {
      const newInstrument = {
        symbol: selectedStock,
        type: 'option',
        strike,
        optionType,
        expiry: expiration,
        delta: Math.random() * 0.5 + 0.25,
        gamma: Math.random() * 0.05,
        theta: -Math.random() * 0.5,
        vega: Math.random() * 0.5,
        fv: Math.random() * 10 + 5,
      }
      addToSpread(newInstrument)
    } else {
      setSelectedOption({ strike, optionType })
      setSelectedExpiration(expiration)
    }
  }

  const handleBackToOverview = () => {
    setSelectedStock(null)
    setSelectedExpiration(null)
    setSelectedOption(null)
  }

  const handleBackToStockDetail = () => {
    setSelectedExpiration(null)
    setSelectedOption(null)
  }

  const handleBackToExpirationView = () => {
    setSelectedOption(null)
  }

  const handleSelectInstrument = (instrument) => {
    if (!hasAccount) {
      setShowLoginDialog(true)
      return
    }
    if (isTrading) {
      addToSpread({ ...instrument, fv: Math.random() * 10 + 5 })
    } else {
      if (instrument.type === 'stock') {
        handleSelectStock(instrument.name)
      } else if (instrument.type === 'option') {
        handleSelectStock(instrument.name)
        handleSelectExpiration(instrument.expiry)
        handleSelectOption(instrument.strike, instrument.optionType, instrument.expiry)
      }
    }
  }

  const handleStartTrading = () => {
    if (!hasAccount) {
      setShowLoginDialog(true)
      return
    }
    setIsTrading(true)
    setCurrentSpread([])
  }

  const handleCancelTrading = () => {
    setIsTrading(false)
    setCurrentSpread([])
  }

  const handleViewSpread = (spread) => {
    setViewingSpread(true)
  }

  const handleExecuteOrder = (spread, orderType, limitPrice) => {
    const newPositions = [...positions]
    spread.forEach(item => {
      const folderIndex = newPositions.findIndex(folder => 
        folder.items.some(subFolder => subFolder.name === item.symbol)
      )
      if (folderIndex !== -1) {
        const subFolderIndex = newPositions[folderIndex].items.findIndex(subFolder => subFolder.name === item.symbol)
        if (subFolderIndex !== -1) {
          const itemIndex = newPositions[folderIndex].items[subFolderIndex].items.findIndex(position => 
            position.type === item.type &&
            position.strike === item.strike &&
            position.expiry === item.expiry &&
            position.optionType === item.optionType
          )
          if (itemIndex !== -1) {
            newPositions[folderIndex].items[subFolderIndex].items[itemIndex].quantity += item.quantity
          } else {
            newPositions[folderIndex].items[subFolderIndex].items.push({
              id: `${item.symbol}${Date.now()}`,
              ...item
            })
          }
        }
      }
    })
    setPositions(newPositions)
    setAlerts(prevAlerts => [...prevAlerts, { type: 'success', message: 'Order executed successfully' }])
    setIsTrading(false)
    setCurrentSpread([])
  }

  const addToSpread = (instrument) => {
    setCurrentSpread(prevSpread => {
      const existingIndex = prevSpread.findIndex(item => 
        item.symbol === instrument.symbol && 
        item.type === instrument.type &&
        item.strike === instrument.strike &&
        item.expiry === instrument.expiry &&
        item.optionType === instrument.optionType
      )

      if (existingIndex !== -1) {
        const newSpread = [...prevSpread]
        newSpread[existingIndex].quantity += 1
        return newSpread
      } else {
        return [...prevSpread, { ...instrument, quantity: 1 }]
      }
    })
  }

  const handleLogin = (credentials) => {
    setIsAuthenticated(true)
    setHasAccount(true)
    setShowLoginDialog(false)
    setAlerts(prevAlerts => [...prevAlerts, { type: 'success', message: 'Logged in successfully' }])
    setTimeout(() => {
      setAlerts([])
    }, 3000)
  }

  const handleSignUp = (userData) => {
    setIsAuthenticated(true)
    setHasAccount(true)
    setShowSignUpDialog(false)
    setAlerts(prevAlerts => [...prevAlerts, { type: 'success', message: 'Account created successfully' }])
    setTimeout(() => {
      setAlerts([])
    }, 3000)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setHasAccount(false)
    setAlerts(prevAlerts => [...prevAlerts, { type: 'info', message: 'Logged out successfully' }])
    setTimeout(() => {
      setAlerts([])
    }, 3000)
  }

  const handleDeskChatMessage = (message) => {
    setDeskChatMessages(prevMessages => [...prevMessages, { sender: 'User', content: message }])
    if (isDeskChatCollapsed) {
      setUnreadDeskChatCount(prevCount => prevCount + 1)
    }
    // Simulated response
    setTimeout(() => {
      setDeskChatMessages(prevMessages => [...prevMessages, { sender: 'AI Assistant', content: 'This is a simulated response to your message.' }])
      if (isDeskChatCollapsed) {
        setUnreadDeskChatCount(prevCount => prevCount + 1)
      }
    }, 1000)
  }

  const handleDeskChatMessageClick = (message) => {
    setSelectedAgent(message.sender)
  }

  const handleSendAgentMessage = (agent, message) => {
    setAgentChats(prevChats => ({
      ...prevChats,
      [agent]: [...(prevChats[agent] || []), { sender: 'User', content: message }]
    }))
    if (isAgentChatCollapsed) {
      setUnreadAgentChatCount(prevCount => prevCount + 1)
    }
    // Simulated response
    setTimeout(() => {
      setAgentChats(prevChats => ({
        ...prevChats,
        [agent]: [...prevChats[agent], { sender: agent, content: `This is a simulated response from ${agent}.` }]
      }))
      if (isAgentChatCollapsed) {
        setUnreadAgentChatCount(prevCount => prevCount + 1)
      }
    }, 1000)
  }

  const handleSelectAgent = (agent) => {
    setSelectedAgent(agent)
  }

  const renderMainContent = () => {
    if (viewingSpread) {
      return <SpreadView spread={currentSpread} onBack={() => setViewingSpread(false)} />
    } else if (selectedStock) {
      if (selectedExpiration) {
        if (selectedOption) {
          return (
            <SingleOptionView
              symbol={selectedStock}
              expiration={selectedExpiration}
              strike={selectedOption.strike}
              optionType={selectedOption.optionType}
              onBack={handleBackToExpirationView}
              role={selectedRole}
            />
          )
        } else {
          return (
            <ExpirationView
              symbol={selectedStock}
              expiration={selectedExpiration}
              onBack={handleBackToStockDetail}
              onSelectOption={handleSelectOption}
              role={selectedRole}
            />
          )
        }
      } else {
        return (
          <StockDetail
            symbol={selectedStock}
            onSelectExpiration={handleSelectExpiration}
            onBack={handleBackToOverview}
            onSelectOption={handleSelectOption}
            role={selectedRole}
          />
        )
      }
    } else if (selectedRole === 'Risk Manager') {
      const accountValue = positions.reduce((total, folder) => {
        return total + folder.items.reduce((folderTotal, subFolder) => {
          return folderTotal + subFolder.items.reduce((subFolderTotal, item) => {
            return subFolderTotal + item.quantity * item.fv
          }, 0)
        }, 0)
      }, 0)
      const pnl = positions.reduce((total, folder) => {
        return total + folder.items.reduce((folderTotal, subFolder) => {
          return folderTotal + subFolder.items.reduce((subFolderTotal, item) => {
            const currentPrice = stocksData.find(stock => stock.symbol === subFolder.name)?.price || item.tradePrice
            return subFolderTotal + item.quantity * (currentPrice - item.tradePrice)
          }, 0)
        }, 0)
      }, 0)
      const pnlPercentage = (pnl / accountValue) * 100
      return <RiskManagerOverview accountValue={accountValue} pnlPercentage={pnlPercentage} />
    } else {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Market Overview ({selectedRole} View)</CardTitle>
          </CardHeader>
          <CardContent>
            <StockTable stocks={stocksData} onSelectStock={handleSelectStock} />
          </CardContent>
        </Card>
      )
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <PositionsPanel 
          positions={positions} 
          onDragEnd={onDragEnd} 
          onSelectInstrument={handleSelectInstrument}
          onShowRiskManager={() => setSelectedRole('Risk Manager')}
        />
        <main className="flex-1 flex flex-col overflow-hidden">
          <Tabs value={selectedRole} onValueChange={setSelectedRole} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="Deskhead">Deskhead</TabsTrigger>
              <TabsTrigger value="Junior Trader">Junior Trader</TabsTrigger>
              <TabsTrigger value="Risk Manager">Risk Manager</TabsTrigger>
              <TabsTrigger value="Researcher">Researcher</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="flex-1 p-4 overflow-auto">
              {renderMainContent()}
            </div>
            <div className="h-56 flex"> {/* Fixed height for chat area */}
              <DeskChat 
                messages={deskChatMessages} 
                onSendMessage={handleDeskChatMessage} 
                onMessageClick={handleDeskChatMessageClick}
                isCollapsed={isDeskChatCollapsed}
                onToggleCollapse={() => {
                  setIsDeskChatCollapsed(!isDeskChatCollapsed)
                  if (isDeskChatCollapsed) {
                    setUnreadDeskChatCount(0)
                  }
                }}
                unreadCount={unreadDeskChatCount}
              />
              {selectedAgent && (
                <AgentChat
                  agent={selectedAgent}
                  messages={agentChats[selectedAgent] || []}
                  onSendMessage={(message) => handleSendAgentMessage(selectedAgent, message)}
                  isCollapsed={isAgentChatCollapsed}
                  onToggleCollapse={() => {
                    setIsAgentChatCollapsed(!isAgentChatCollapsed)
                    if (isAgentChatCollapsed) {
                      setUnreadAgentChatCount(0)
                    }
                  }}
                  unreadCount={unreadAgentChatCount}
                />
              )}
            </div>
          </div>
        </main>
        <aside className={`border-l transition-all duration-300 ${isToolsPanelCollapsed ? 'w-12' : 'w-64'}`}>
          <div className="p-4 flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-lg font-semibold ${isToolsPanelCollapsed ? 'hidden' : ''}`}>Tools</h2>
              <Button variant="ghost" size="sm" onClick={() => setIsToolsPanelCollapsed(!isToolsPanelCollapsed)}>
                {isToolsPanelCollapsed ? <ChevronLeft /> : <ChevronRight />}
              </Button>
            </div>
            {!isToolsPanelCollapsed && (
              <ScrollArea className="flex-grow mb-4">
                <ToolsPanel
                  isCollapsed={isToolsPanelCollapsed}
                  onToggleCollapse={() => setIsToolsPanelCollapsed(!isToolsPanelCollapsed)}
                  isTrading={isTrading}
                  onStartTrading={handleStartTrading}
                  onCancelTrading={handleCancelTrading}
                  onViewSpread={handleViewSpread}
                  onExecuteOrder={handleExecuteOrder}
                  spread={currentSpread}
                  addToSpread={addToSpread}
                  selectedStock={selectedStock}
                  isAuthenticated={isAuthenticated}
                  onLogin={() => setShowLoginDialog(true)}
                  onLogout={handleLogout}
                />
              </ScrollArea>
            )}
            {!isToolsPanelCollapsed && (
              <RoleLegend roles={roles} onSelectAgent={handleSelectAgent} />
            )}
          </div>
        </aside>
      </div>
      <AlertComponent alerts={alerts} />
      <LoginDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
        onLogin={handleLogin}
        onSignUp={() => { setShowLoginDialog(false); setShowSignUpDialog(true); }}
      />
      <SignUpDialog
        open={showSignUpDialog}
        onOpenChange={setShowSignUpDialog}
        onSignUp={handleSignUp}
      />
    </div>
  )
}
            