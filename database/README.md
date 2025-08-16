# Database Setup Guide

This guide explains how to set up the Hasura GraphQL database for the AI Chatbot application.

## Prerequisites

- Nhost account or local Hasura setup
- PostgreSQL database
- Hasura GraphQL Engine

## Database Schema Setup

### 1. Apply the SQL Schema

Execute the `schema.sql` file in your PostgreSQL database:

```bash
psql -h your-db-host -U your-username -d your-database -f schema.sql
```

This will create:
- `chats` table with user relationships
- `messages` table with chat relationships
- Proper indexes for performance
- Row Level Security (RLS) policies
- Update triggers for `updated_at` columns

### 2. Configure Hasura Permissions

In the Hasura Console:

1. Go to the Data tab
2. Track the `chats` and `messages` tables
3. Set up relationships as defined in `hasura-permissions.yaml`
4. Configure permissions for the `user` role using the settings in the YAML file

### 3. Set up Hasura Actions

1. Go to the Actions tab in Hasura Console
2. Create a new action called `sendMessage`
3. Use the configuration from `hasura-actions.yaml`
4. Set the webhook URL to your n8n instance

## Table Structures

### Chats Table
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to auth.users)
- `title` (VARCHAR, Default: "New Chat")
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

### Messages Table
- `id` (UUID, Primary Key)
- `chat_id` (UUID, Foreign Key to chats)
- `user_id` (UUID, Foreign Key to auth.users, nullable for bot messages)
- `content` (TEXT)
- `is_bot` (BOOLEAN, Default: false)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

## Row Level Security (RLS)

The database implements strict RLS policies:

### Chats
- Users can only view, insert, update, and delete their own chats
- All operations are filtered by `user_id = auth.uid()`

### Messages
- Users can only access messages from chats they own
- All operations check that the message's chat belongs to the authenticated user

## GraphQL Operations

### Queries
- `chats`: Get all chats for the current user
- `chats_by_pk`: Get a specific chat with messages
- `messages`: Get messages for a specific chat

### Mutations
- `insert_chats_one`: Create a new chat
- `update_chats_by_pk`: Update chat title
- `delete_chats_by_pk`: Delete a chat
- `insert_messages_one`: Insert a new message
- `sendMessage`: Action to trigger chatbot response

### Subscriptions
- Real-time updates for chats and messages
- Automatically filtered by user permissions

## Environment Variables

Set these environment variables in your Nhost/Hasura setup:

```
HASURA_GRAPHQL_ADMIN_SECRET=your-admin-secret
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/chatbot
```

## Testing the Setup

1. Create a test user through Nhost Auth
2. Use the GraphQL playground to test queries and mutations
3. Verify that RLS policies prevent unauthorized access
4. Test the `sendMessage` action with a mock n8n webhook

## Security Considerations

- All database access is protected by RLS policies
- Users can only access their own data
- Bot messages are inserted with `user_id = null`
- The `sendMessage` action validates user ownership of the chat
- All GraphQL operations require authentication

