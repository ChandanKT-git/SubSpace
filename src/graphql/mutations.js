import { gql } from '@apollo/client'

// Create a new chat
export const CREATE_CHAT = gql`
  mutation CreateChat($title: String = "New Chat") {
    insert_chats_one(object: { title: $title }) {
      id
      title
      created_at
      updated_at
    }
  }
`

// Update chat title
export const UPDATE_CHAT_TITLE = gql`
  mutation UpdateChatTitle($chatId: uuid!, $title: String!) {
    update_chats_by_pk(pk_columns: { id: $chatId }, _set: { title: $title }) {
      id
      title
      updated_at
    }
  }
`

// Delete a chat
export const DELETE_CHAT = gql`
  mutation DeleteChat($chatId: uuid!) {
    delete_chats_by_pk(id: $chatId) {
      id
    }
  }
`

// Insert a user message
export const INSERT_MESSAGE = gql`
  mutation InsertMessage($chatId: uuid!, $content: String!) {
    insert_messages_one(
      object: { 
        chat_id: $chatId, 
        content: $content, 
        is_bot: false 
      }
    ) {
      id
      content
      is_bot
      created_at
      user_id
    }
  }
`

// Insert a bot message (used by n8n workflow)
export const INSERT_BOT_MESSAGE = gql`
  mutation InsertBotMessage($chatId: uuid!, $content: String!) {
    insert_messages_one(
      object: { 
        chat_id: $chatId, 
        content: $content, 
        is_bot: true,
        user_id: null
      }
    ) {
      id
      content
      is_bot
      created_at
      user_id
    }
  }
`

// Update message content
export const UPDATE_MESSAGE = gql`
  mutation UpdateMessage($messageId: uuid!, $content: String!) {
    update_messages_by_pk(
      pk_columns: { id: $messageId }, 
      _set: { content: $content }
    ) {
      id
      content
      updated_at
    }
  }
`

// Delete a message
export const DELETE_MESSAGE = gql`
  mutation DeleteMessage($messageId: uuid!) {
    delete_messages_by_pk(id: $messageId) {
      id
    }
  }
`

// Hasura Action: Send message to chatbot
export const SEND_MESSAGE_TO_BOT = gql`
  mutation SendMessageToBot($chatId: uuid!, $message: String!) {
    sendMessage(chatId: $chatId, message: $message) {
      success
      message
      botResponse
    }
  }
`

