'use client'

import React, { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Header from '@/components/new/Header'
import StockTable from '@/components/new/StockTable'
import StockDetail from '@/components/new/StockDetail'
import ExpirationView from '@/components/new/ExpirationView'
import SingleOptionView from '@/components/new/SingleOptionView'
import SpreadView from '@/components/new/SpreadView'
import RiskManagerOverview from '@/components/new/RiskManagerOverview'
import DeskChat from '@/components/new/DeskChat'
import AgentChat from '@/components/new/AgentChat'
import LoginDialog from '@/components/new/LoginDialog'
import SignUpDialog from '@/components/new/SignUpDialog'
import AlertComponent from '@/components/new/AlertComponent'
import RoleLegend from '@/components/new/RoleLegend'
import PositionsManager from '@/components/new/PositionsManager'
import { stocksData } from '@/data/stocksData'

const SpreadBuilder = ({ onCancel, onViewSpread, onExecuteOrder, spread, addToSpread }) => {
  // Implement SpreadBuilder component
  return (
    <div>
      {/* SpreadBuilder implementation */}
    </div>
  )
}

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
  onLogout, 
  roles, 
  selectedRole,
  onSelectAgent
}) => {
  return (
    <aside className={`border-l transition-all duration-300 flex flex-col ${isCollapsed ? 'w-12' : 'w-64'}`}>
      <div className="p-4 flex-grow overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-lg font-semibold ${isCollapsed ? 'hidden' : ''}`}>Tools</h2>
          <Button variant="ghost" size="sm" onClick={onToggleCollapse}>
            {isCollapsed ? <ChevronLeft /> : <ChevronRight />}
          </Button>
        </div>
        {!isCollapsed && (
          <ScrollArea className="h-full">
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
      {!isCollapsed && (
        <div className="mt-auto p-4 border-t">
          <RoleLegend roles={roles} onSelectAgent={onSelectAgent} />
        </div>
      )}
    </aside>
  )
}

export default function TradingPlatform() {
  const devMode = true;
  const [selectedStock, setSelectedStock] = useState(null)
  const [selectedExpiration, setSelectedExpiration] = useState(null)
  const [selectedOption, setSelectedOption] = useState(null)
  const [isTrading, setIsTrading] = useState(false)
  const [currentSpread, setCurrentSpread] = useState([])
  const [viewingSpread, setViewingSpread] = useState(false)
  const [selectedRole, setSelectedRole] = useState('Deskhead')
  const [deskChatMessages, setDeskChatMessages] = useState([
    { sender: 'Junior Trader', content: 'Hey team, I\'m seeing some unusual activity in AAPL options. Anyone else noticing this?' },
    { sender: 'Risk Manager', content: 'Thanks for the heads up. Can you provide more details on what you\'re seeing?' },
    { sender: 'Researcher', content: 'I\'ve been analyzing AAPL\'s recent earnings report. There might be some correlation.' },
    { sender: 'Junior Trader', content: 'The implied volatility for near-term options has spiked in the last hour.' },
    { sender: 'Risk Manager', content: 'Interesting. Let\'s keep a close eye on this. Junior Trader, can you prepare a quick report on the IV changes?' },
    { sender: 'Researcher', content: 'I\'ll look into any recent news or events that might be causing this. Will update the team shortly.' },
  ])
  const [selectedAgent, setSelectedAgent] = useState(null)
  const [agentChats, setAgentChats] = useState({
    'Junior Trader': [],
    'Risk Manager': [],
    'Researcher': [],
  })
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
  const [companyForRiskAnalysis, setCompanyForRiskAnalysis] = useState('')
  const [riskAnalysis, setRiskAnalysis] = useState('');
  const [researchAnalysis, setResearchAnalysis] = useState('');
  const [companyForResearch, setCompanyForResearch] = useState('');


  const handleRiskAnalysis = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/risk-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ company: companyForRiskAnalysis }),
      });

      if (response.ok) {
        const data = await response.json();
        const { analysis } = data;
        // Handle the analysis data as needed (e.g., display it, update state, etc.)
        setRiskAnalysis(analysis);
        console.log('Risk analysis:', analysis);
      } else {
        console.error('Error fetching risk analysis');
        setRiskAnalysis('Error fetching risk analysis');
      }
    } catch (error) {
      console.error('Error:', error);
      setRiskAnalysis('An error occurred');
    }
  };

  const handleResearchAnalysis = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/research-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ company: companyForResearch }),
      });
  
      if (response.ok) {
        const data = await response.json();
        const { analysis } = data;
        setResearchAnalysis(analysis);
        console.log('Research analysis:', analysis);
      } else {
        console.error('Error fetching research analysis');
        setResearchAnalysis('Error fetching research analysis');
      }
    } catch (error) {
      console.error('Error:', error);
      setResearchAnalysis('An error occurred');
    }
  };

  const [positions, setPositions] = useState([])
  const [accountValue, setAccountValue] = useState(1000000) // Example initial value
  const [pnlPercentage, setPnlPercentage] = useState(0)

  const roles = [
    { name: 'Deskhead', color: '#4CAF50' },
    { name: 'Junior Trader', color: '#2196F3' },
    { name: 'Risk Manager', color: '#FFC107' },
    { name: 'Researcher', color: '#9C27B0' },
  ]

  const handleSelectInstrument = (item) => {
    if (!hasAccount && !devMode) {
      setShowLoginDialog(true)
      return
    }
    if (isTrading) {
      addToSpread({ ...item, fv: Math.random() * 10 + 5 })
    } else {
      if (item.type === 'stock') {
        setSelectedStock(item.symbol)
        setSelectedExpiration(null)
        setSelectedOption(null)
      } else if (item.type === 'option') {
        setSelectedStock(item.symbol)
        setSelectedExpiration(item.expiry)
        setSelectedOption({ strike: item.strike, optionType: item.optionType })
      }
    }
  }

  const handleSelectExpiration = (expiration) => {
    if (!hasAccount && !devMode) {
      setShowLoginDialog(true)
      return
    }
    setSelectedExpiration(expiration)
    setSelectedOption(null)
  }

  const handleSelectOption = (strike, optionType, expiration) => {
    if (!hasAccount && !devMode) {
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

  const addToSpread = (instrument) => {
    setCurrentSpread([...currentSpread, instrument])
  }

  const removeFromSpread = (index) => {
    const newSpread = [...currentSpread]
    newSpread.splice(index, 1)
    setCurrentSpread(newSpread)
  }

  const handleDeskChatMessage = (message) => {
    setDeskChatMessages([...deskChatMessages, { sender: 'User', content: message }])
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

  const handleSendAgentMessage = (agent, content) => {
    setAgentChats(prevChats => ({
      ...prevChats,
      [agent]: [...prevChats[agent], { sender: 'User', content }]
    }))
    if (isAgentChatCollapsed) {
      setUnreadAgentChatCount(prevCount => prevCount + 1)
    }
    // Simulated AI response
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

  const handleDeskChatMessageClick = (message) => {
    setSelectedAgent(message.sender)
  }

  const handleLogin = (credentials) => {
    // Mock login process
    console.log('Login attempt with:', credentials)
    setIsAuthenticated(true)
    setHasAccount(true)
    setShowLoginDialog(false)
    setAlerts([...alerts, { type: 'success', message: 'Successfully logged in!' }])
  }

  const handleSignUp = (userData) => {
    // Mock sign up process
    console.log('Sign up attempt with:', userData)
    setIsAuthenticated(true)
    setHasAccount(true)
    setShowSignUpDialog(false)
    setAlerts([...alerts, { type: 'success', message: 'Account created successfully!' }])
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
    setAlerts([...alerts, { type: 'success', message: 'Order executed successfully' }])
    setIsTrading(false)
    setCurrentSpread([])
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setHasAccount(false)
    setAlerts([...alerts, { type: 'info', message: 'Logged out successfully' }])
    // Optional: Clear user-specific data
    setSelectedStock(null)
    setSelectedExpiration(null)
    setSelectedOption(null)
    setCurrentSpread([])
    setIsTrading(false)
  }

  const handleSelectAgent = (agent) => {
    setSelectedAgent(agent)
  }

  const renderMainContent = () => {
    if (selectedStock && selectedExpiration && selectedOption) {
      return (
        <SingleOptionView
          stock={selectedStock}
          expiration={selectedExpiration}
          strike={selectedOption.strike}
          optionType={selectedOption.optionType}
          onBackClick={handleBackToExpirationView}
          isTrading={isTrading}
          onAddToSpread={addToSpread}
        />
      )
    } else if (selectedStock && selectedExpiration) {
      return (
        <ExpirationView
          stock={selectedStock}
          expiration={selectedExpiration}
          onSelectOption={handleSelectOption}
          onBackClick={handleBackToStockDetail}
        />
      )
    } else if (selectedStock) {
      const stockData = stocksData.find(s => s.symbol === selectedStock)
      return (
        <StockDetail
          stock={stockData}
          onSelectExpiration={handleSelectExpiration}
          onBackClick={handleBackToOverview}
          onSelectOption={handleSelectOption}
        />
      )
    } else if (viewingSpread) {
      return (
        <SpreadView
          spread={currentSpread}
          onRemoveFromSpread={removeFromSpread}
          onClose={() => setViewingSpread(false)}
        />
      )
    }
    //  else if (selectedRole === 'Risk Manager') {
    //   return <RiskManagerOverview accountValue={accountValue} pnlPercentage={pnlPercentage} />
    // } 

    else if (selectedRole === 'Risk Manager') {
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
          // return <RiskManagerOverview accountValue={accountValue} pnlPercentage={pnlPercentage} />
          return (
            <div>
              <RiskManagerOverview accountValue={accountValue} pnlPercentage={pnlPercentage} />
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Enter company name"
                  value={companyForRiskAnalysis}
                  onChange={(e) => setCompanyForRiskAnalysis(e.target.value)}
                  className="border border-gray-300 rounded-md px-2 py-1"
                />
                <Button onClick={handleRiskAnalysis} className="ml-2">
                  Get Risk Analysis
                </Button>
              </div>
              {riskAnalysis && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Risk Analysis</h3>
                <div className="bg-gray-100 rounded-md p-4">
                  {/* <pre className="whitespace-pre-wrap">{riskAnalysis}</pre> */}
                  <ReactMarkdown>{riskAnalysis}</ReactMarkdown>

                </div>
              </div>
            )}
            </div>
          );
        }

        else if (selectedRole === 'Researcher') {
      return (
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Market Overview (Researcher View)</CardTitle>
            </CardHeader>
            <CardContent>
            <StockTable stocks={stocksData} onSelectStock={handleSelectInstrument} />
            </CardContent>
          </Card>
          <div className="mt-4">
            <input
              type="text"
              placeholder="Enter company name"
              value={companyForResearch}
              onChange={(e) => setCompanyForResearch(e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1"
            />
            <Button onClick={handleResearchAnalysis} className="ml-2">
              Get Research Analysis
            </Button>
          </div>
          {researchAnalysis && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Research Analysis</h3>
              <div className="bg-gray-100 rounded-md p-4">
                {/* <pre className="whitespace-pre-wrap">{researchAnalysis}</pre> */}
                <ReactMarkdown>{researchAnalysis}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      );
    }
    
    
    
    
    
    else {
      return (
        <>
        <h2 className="text-2xl font-bold mb-4">Market Overview ({selectedRole} View)</h2>
        <StockTable stocks={stocksData} onSelectStock={handleSelectInstrument} />
      </>
    )
  }
}

return (
  <div className="flex h-screen bg-background text-foreground">
    {/* Left sidebar - Positions */}
    <PositionsManager
      onSelectInstrument={handleSelectInstrument}
      onShowRiskManager={() => setSelectedRole('Risk Manager')}
      className="w-64 flex-shrink-0 overflow-auto border-r"
    />

    <main className="flex-1 flex flex-col min-w-0">
      {/* Role selector tabs */}
      <Tabs value={selectedRole} onValueChange={setSelectedRole} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="Deskhead">Deskhead</TabsTrigger>
          <TabsTrigger value="Junior Trader">Junior Trader</TabsTrigger>
          <TabsTrigger value="Risk Manager">Risk Manager</TabsTrigger>
          <TabsTrigger value="Researcher">Researcher</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Central panel - Stocks and Details */}
      <div className="flex-1 overflow-auto p-4">
        {renderMainContent()}
      </div>

      {/* Chat windows */}
      <div className="h-48 flex border-t">
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
          className="flex-1 border-r"
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
            className="flex-1"
          />
        )}
      </div>
    </main>

    {/* Right sidebar - Tools */}
    <ToolsPanel
      isCollapsed={isToolsPanelCollapsed}
      onToggleCollapse={() => setIsToolsPanelCollapsed(!isToolsPanelCollapsed)}
      isTrading={isTrading}
      onStartTrading={() => setIsTrading(true)}
      onCancelTrading={() => setIsTrading(false)}
      onViewSpread={() => setViewingSpread(true)}
      onExecuteOrder={handleExecuteOrder}
      spread={currentSpread}
      addToSpread={addToSpread}
      selectedStock={selectedStock}
      isAuthenticated={isAuthenticated}
      onLogin={() => setShowLoginDialog(true)}
      onLogout={handleLogout}
      roles={roles}
      selectedRole={selectedRole}
      onSelectAgent={handleSelectAgent}
      className="w-64 flex-shrink-0 border-l"
    />

    {/* Login Dialog */}
    <LoginDialog
      open={showLoginDialog}
      onOpenChange={setShowLoginDialog}
      onLogin={handleLogin}
      onSignUp={() => { setShowLoginDialog(false); setShowSignUpDialog(true); }}
    />

    {/* Sign Up Dialog */}
    <SignUpDialog
      open={showSignUpDialog}
      onOpenChange={setShowSignUpDialog}
      onSignUp={handleSignUp}
    />

    {/* Alerts */}
    <div className="fixed bottom-4 right-4 space-y-2">
      {alerts.map((alert, index) => (
        <AlertComponent key={index} type={alert.type} message={alert.message} />
      ))}
    </div>
  </div>
)
}