import { useState, useEffect } from 'react'
import { useQuery, useMutation, useSubscription } from '@apollo/client'
import { useAuth } from '../../contexts/MockAuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { LogOut, Send, Plus, Loader2 } from 'lucide-react'
import { 
  GET_CHATS, 
  GET_CHAT_WITH_MESSAGES, 
  MESSAGES_SUBSCRIPTION 
} from '../../graphql/queries'
import { 
  CREATE_CHAT, 
  INSERT_MESSAGE, 
  SEND_MESSAGE_TO_BOT 
} from '../../graphql/mutations'

const GraphQLChatInterface = () => {
  const { user, signOut } = useAuth()
  const [message, setMessage] = useState('')
  const [selectedChatId, setSelectedChatId] = useState(null)

  // GraphQL queries and mutations
  const { data: chatsData, loading: chatsLoading } = useQuery(GET_CHATS)
  
  const { data: chatData, loading: chatLoading } = useQuery(GET_CHAT_WITH_MESSAGES, {
    variables: { chatId: selectedChatId },
    skip: !selectedChatId
  })

  const { data: messagesData } = useSubscription(MESSAGES_SUBSCRIPTION, {
    variables: { chatId: selectedChatId },
    skip: !selectedChatId
  })

  const [createChat] = useMutation(CREATE_CHAT, {
    refetchQueries: [GET_CHATS]
  })

  const [insertMessage] = useMutation(INSERT_MESSAGE)
  const [sendMessageToBot] = useMutation(SEND_MESSAGE_TO_BOT)

  // Auto-select first chat if none selected
  useEffect(() => {
    if (chatsData?.chats?.length > 0 && !selectedChatId) {
      setSelectedChatId(chatsData.chats[0].id)
    }
  }, [chatsData, selectedChatId])

  const handleSignOut = () => {
    signOut()
  }

  const handleCreateChat = async () => {
    try {
      const result = await createChat({
        variables: { title: 'New Chat' }
      })
      if (result.data?.insert_chats_one) {
        setSelectedChatId(result.data.insert_chats_one.id)
      }
    } catch (error) {
      console.error('Error creating chat:', error)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!message.trim() || !selectedChatId) return

    try {
      // Insert user message
      await insertMessage({
        variables: {
          chatId: selectedChatId,
          content: message
        }
      })

      const userMessage = message
      setMessage('')

      // Send message to bot via Hasura Action
      await sendMessageToBot({
        variables: {
          chatId: selectedChatId,
          message: userMessage
        }
      })
    } catch (error) {
      console.error('Error sending message:', error)
      // For demo purposes, add a mock bot response
      setTimeout(() => {
        insertMessage({
          variables: {
            chatId: selectedChatId,
            content: `Mock bot response to: "${userMessage}". In production, this would come from the n8n workflow.`
          }
        })
      }, 1000)
    }
  }

  const messages = messagesData?.messages || chatData?.chats_by_pk?.messages || []
  const chats = chatsData?.chats || []

  if (chatsLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading chats...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b p-4 flex justify-between items-center bg-white">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold">AI Chatbot</h1>
          <Button variant="outline" size="sm" onClick={handleCreateChat}>
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
            {chats.map((chat) => (
              <Card 
                key={chat.id}
                className={`p-3 cursor-pointer hover:bg-gray-50 ${
                  selectedChatId === chat.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedChatId(chat.id)}
              >
                <p className="text-sm font-medium truncate">{chat.title}</p>
                <p className="text-xs text-gray-500">
                  {new Date(chat.updated_at).toLocaleDateString()}
                </p>
              </Card>
            ))}
            {chats.length === 0 && (
              <p className="text-sm text-gray-500">No chats yet. Create one to get started!</p>
            )}
          </div>
        </div>

        {/* Main Chat */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedChatId ? (
            <>
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                {chatLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
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
                )}
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

export default GraphQLChatInterface

