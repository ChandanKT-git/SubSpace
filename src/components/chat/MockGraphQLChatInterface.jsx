import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/MockAuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { LogOut, Send, Plus, Loader2 } from 'lucide-react'

// Mock data to simulate GraphQL responses
const mockChats = [
  {
    id: '1',
    title: 'General Chat',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    messages: []
  }
]

const MockGraphQLChatInterface = () => {
  const { user, signOut } = useAuth()
  const [message, setMessage] = useState('')
  const [selectedChatId, setSelectedChatId] = useState('1')
  const [chats, setChats] = useState(mockChats)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSignOut = () => {
    signOut()
  }

  const handleCreateChat = async () => {
    setLoading(true)
    // Simulate GraphQL mutation
    setTimeout(() => {
      const newChat = {
        id: Date.now().toString(),
        title: `Chat ${chats.length + 1}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        messages: []
      }
      setChats(prev => [newChat, ...prev])
      setSelectedChatId(newChat.id)
      setMessages([])
      setLoading(false)
    }, 500)
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!message.trim() || !selectedChatId) return

    const userMessage = {
      id: Date.now().toString(),
      content: message,
      is_bot: false,
      created_at: new Date().toISOString(),
      user_id: user.id
    }

    // Add user message immediately
    setMessages(prev => [...prev, userMessage])
    setMessage('')

    // Simulate GraphQL mutation and Hasura Action
    setTimeout(() => {
      const botMessage = {
        id: (Date.now() + 1).toString(),
        content: `This is a mock GraphQL response to: "${userMessage.content}". In the real application, this would be processed through Hasura Actions → n8n → OpenRouter → back to Hasura.`,
        is_bot: true,
        created_at: new Date().toISOString(),
        user_id: null
      }
      setMessages(prev => [...prev, botMessage])
      
      // Update chat's updated_at timestamp
      setChats(prev => prev.map(chat => 
        chat.id === selectedChatId 
          ? { ...chat, updated_at: new Date().toISOString() }
          : chat
      ))
    }, 1500)
  }

  const handleChatSelect = (chatId) => {
    setSelectedChatId(chatId)
    // In real app, this would trigger a GraphQL query
    // For now, reset messages for demo
    setMessages([])
  }

  const selectedChat = chats.find(chat => chat.id === selectedChatId)

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b p-4 flex justify-between items-center bg-white">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold">AI Chatbot (GraphQL Mode)</h1>
          <Button variant="outline" size="sm" onClick={handleCreateChat} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
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
            {chats.map((chat) => (
              <Card 
                key={chat.id}
                className={`p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedChatId === chat.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => handleChatSelect(chat.id)}
              >
                <p className="text-sm font-medium truncate">{chat.title}</p>
                <p className="text-xs text-gray-500">
                  {new Date(chat.updated_at).toLocaleDateString()}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Main Chat */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="border-b p-4">
                <h3 className="font-medium">{selectedChat.title}</h3>
                <p className="text-sm text-gray-500">
                  GraphQL-enabled chat with real-time subscriptions
                </p>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 mt-8">
                      <p>No messages yet. Start a conversation!</p>
                      <p className="text-xs mt-2">
                        This interface demonstrates GraphQL queries, mutations, and subscriptions
                      </p>
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
                    placeholder="Type your message... (GraphQL mutation will be triggered)"
                    className="flex-1"
                  />
                  <Button type="submit" disabled={!message.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <p className="mb-4">Select a chat to start messaging</p>
                <Button onClick={handleCreateChat}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Chat
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MockGraphQLChatInterface

