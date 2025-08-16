import { useState } from 'react'
import { useAuth } from '../../contexts/MockAuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { LogOut, Send, Plus } from 'lucide-react'

const MockChatInterface = () => {
  const { user, signOut } = useAuth()
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])

  const handleSignOut = () => {
    signOut()
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!message.trim()) return

    // Add user message
    const newMessage = {
      id: Date.now(),
      content: message,
      user_id: user.id,
      created_at: new Date().toISOString(),
      is_bot: false
    }

    setMessages(prev => [...prev, newMessage])
    setMessage('')

    // Simulate bot response
    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        content: `I received your message: "${message}". This is a placeholder response. The actual chatbot will be connected later through Hasura Actions and n8n.`,
        user_id: 'bot',
        created_at: new Date().toISOString(),
        is_bot: true
      }
      setMessages(prev => [...prev, botMessage])
    }, 1000)
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b p-4 flex justify-between items-center bg-white">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold">AI Chatbot</h1>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Welcome, {user?.email}
          </span>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex bg-gray-50">
        {/* Sidebar - Chat List */}
        <div className="w-64 border-r p-4 bg-white">
          <h2 className="font-semibold mb-4">Chats</h2>
          <div className="space-y-2">
            <Card className="p-3 cursor-pointer hover:bg-gray-50">
              <p className="text-sm font-medium">Current Chat</p>
              <p className="text-xs text-gray-500">Just now</p>
            </Card>
          </div>
        </div>

        {/* Main Chat */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <p>No messages yet. Start a conversation!</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.is_bot ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.is_bot
                          ? 'bg-gray-100 text-gray-900'
                          : 'bg-blue-500 text-white'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-xs mt-1 ${
                        msg.is_bot ? 'text-gray-500' : 'text-blue-100'
                      }`}>
                        {new Date(msg.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="border-t p-4 bg-white">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button type="submit" disabled={!message.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MockChatInterface

