import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronUp, ChevronDown, Send } from 'lucide-react'

interface Role {
  name: string;
  color: string;
}

interface DeskChatProps {
  messages: Array<{ sender: string; content: string; unread?: boolean }>;
  onSendMessage: (message: string) => void;
  onMessageClick: (message: { sender: string; content: string }) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  unreadCount: number;
  roles: Role[];
}

const DeskChat: React.FC<DeskChatProps> = ({ 
  messages, 
  onSendMessage, 
  onMessageClick, 
  isCollapsed, 
  onToggleCollapse, 
  unreadCount, 
  roles 
}) => {
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input)
      setInput('')
    }
  }

  return (
    <div className={`flex flex-col transition-all duration-300 ${isCollapsed ? 'h-12' : 'h-80'} w-1/2 border-r`}>
      <div className="flex items-center justify-between p-2 bg-muted">
        <h3 className="text-sm font-semibold">Desk Chat</h3>
        <div className="flex items-center">
          {isCollapsed && unreadCount > 0 && (
            <div className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2">
              {unreadCount}
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={onToggleCollapse}>
            {isCollapsed ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </div>
      </div>
      {!isCollapsed && (
        <>
          <ScrollArea className="flex-grow">
            <div className="space-y-2 p-2">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex flex-col p-1.5 rounded-lg cursor-pointer text-xs ${
                    message.sender === 'User' ? 'bg-primary text-primary-foreground ml-auto' : 'bg-muted'
                  }`}
                  onClick={() => onMessageClick(message)}
                >
                  <span className="font-semibold text-xs">{message.sender}</span>
                  <span className="text-xs">{message.content}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="flex p-4">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow mr-2"
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button onClick={handleSend}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

export default DeskChat