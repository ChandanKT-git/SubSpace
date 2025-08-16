# n8n Workflow Setup Guide

This guide explains how to set up the n8n workflow for the AI Chatbot application that integrates with Hasura Actions and OpenRouter API.

## Prerequisites

- n8n instance (cloud or self-hosted)
- OpenRouter API account and API key
- Hasura GraphQL endpoint with admin secret
- Hasura Actions configured

## Workflow Overview

The n8n workflow handles the following process:

1. **Webhook Trigger**: Receives requests from Hasura Actions
2. **Request Validation**: Validates incoming data and extracts user information
3. **Chat Ownership Verification**: Ensures the user owns the chat they're messaging
4. **OpenRouter API Call**: Sends the user message to the AI model
5. **Response Processing**: Processes the AI response
6. **Database Update**: Saves the bot response back to Hasura
7. **Response Return**: Returns the result to the Hasura Action

## Setup Instructions

### 1. Import the Workflow

1. Open your n8n instance
2. Go to Workflows
3. Click "Import from File"
4. Upload the `chatbot-workflow.json` file
5. The workflow will be imported with all nodes configured

### 2. Configure Credentials

#### OpenRouter API Credentials
1. Go to Settings > Credentials
2. Create new credential of type "HTTP Request Auth"
3. Name it "openRouterApi"
4. Configure:
   - Authentication: Header Auth
   - Name: Authorization
   - Value: Bearer YOUR_OPENROUTER_API_KEY

#### Hasura API Credentials
1. Create new credential of type "HTTP Request Auth"
2. Name it "hasuraApi"
3. Configure:
   - Authentication: Header Auth
   - Name: x-hasura-admin-secret
   - Value: YOUR_HASURA_ADMIN_SECRET

### 3. Configure Webhook URL

1. Click on the "Webhook Trigger" node
2. Copy the webhook URL (it will look like: `https://your-n8n-instance.com/webhook/chatbot`)
3. Use this URL in your Hasura Action configuration

### 4. Update Environment Variables

Update the following in your Hasura environment:

```env
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/chatbot
```

### 5. Test the Workflow

1. Activate the workflow in n8n
2. Send a test request from your frontend application
3. Check the execution history in n8n to verify all steps complete successfully

## Workflow Nodes Explained

### Webhook Trigger
- **Purpose**: Receives POST requests from Hasura Actions
- **Path**: `/webhook/chatbot`
- **Expected Payload**:
  ```json
  {
    "input": {
      "chatId": "uuid",
      "message": "string"
    },
    "session_variables": {
      "x-hasura-user-id": "uuid",
      "x-hasura-role": "user"
    }
  }
  ```

### Validate Request
- **Purpose**: Extracts and validates incoming data
- **Validation**: Ensures user is authenticated
- **Output**: Structured data for subsequent nodes

### Verify Chat Ownership
- **Purpose**: Queries Hasura to get chat details
- **Security**: Prevents unauthorized access to chats
- **GraphQL Query**:
  ```graphql
  query GetChat($chatId: uuid!) {
    chats_by_pk(id: $chatId) {
      id
      user_id
      title
    }
  }
  ```

### Check Ownership
- **Purpose**: Validates that the authenticated user owns the chat
- **Security**: Critical security check to prevent cross-user access

### Call OpenRouter API
- **Purpose**: Sends user message to AI model
- **Model**: Uses `meta-llama/llama-3.2-3b-instruct:free` (free tier)
- **Configuration**:
  - Max tokens: 500
  - Temperature: 0.7
  - System prompt: "You are a helpful AI assistant"

### Process AI Response
- **Purpose**: Extracts and cleans the AI response
- **Error Handling**: Provides fallback message if API fails

### Save Bot Message
- **Purpose**: Saves AI response to database
- **GraphQL Mutation**:
  ```graphql
  mutation InsertBotMessage($chatId: uuid!, $content: String!) {
    insert_messages_one(object: {
      chat_id: $chatId,
      content: $content,
      is_bot: true,
      user_id: null
    }) {
      id
      content
      is_bot
      created_at
    }
  }
  ```

### Webhook Response
- **Purpose**: Returns success response to Hasura Action
- **Response Format**:
  ```json
  {
    "success": true,
    "message": "Message processed successfully",
    "botResponse": "AI response text"
  }
  ```

## Security Features

1. **User Authentication**: Validates Hasura session variables
2. **Chat Ownership**: Ensures users can only message their own chats
3. **Input Validation**: Validates all incoming data
4. **Error Handling**: Graceful error responses
5. **Admin Secret**: Uses Hasura admin secret for database operations

## Error Handling

The workflow includes comprehensive error handling:

- Invalid requests return 400 status
- Unauthorized access attempts are blocked
- API failures are handled gracefully
- All errors are logged in n8n execution history

## Monitoring and Debugging

1. **Execution History**: View all workflow executions in n8n
2. **Error Logs**: Check failed executions for debugging
3. **Webhook Logs**: Monitor incoming requests
4. **Performance**: Track execution times and success rates

## Scaling Considerations

- **Rate Limiting**: Consider implementing rate limits for API calls
- **Caching**: Cache frequent responses to reduce API costs
- **Load Balancing**: Use multiple n8n instances for high traffic
- **Database Optimization**: Ensure proper indexing for chat queries

## Cost Optimization

- **Free Models**: Uses free OpenRouter models to minimize costs
- **Token Limits**: Limits response length to control costs
- **Error Prevention**: Validates requests to avoid unnecessary API calls

