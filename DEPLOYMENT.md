# AI Chatbot Application - Complete Deployment Guide

This guide provides step-by-step instructions for deploying the complete AI Chatbot application with Nhost Auth, Hasura GraphQL, n8n workflow, and OpenRouter integration.

## Architecture Overview

```
Frontend (React) → Nhost Auth → Hasura GraphQL → Hasura Actions → n8n → OpenRouter API
                                      ↓
                                PostgreSQL Database
```

## Prerequisites

- Nhost account (or Hasura Cloud + PostgreSQL)
- n8n Cloud account (or self-hosted n8n)
- OpenRouter API account
- Netlify account (for frontend deployment)
- Domain name (optional)

## Phase 1: Database and Backend Setup

### 1.1 Set Up Nhost Project

1. Go to [Nhost Console](https://app.nhost.io/)
2. Create a new project
3. Note down your:
   - Subdomain
   - Region
   - GraphQL endpoint
   - Admin secret

### 1.2 Configure Database Schema

1. Go to Nhost Console > Database
2. Run the SQL from `database/schema.sql`
3. Verify tables are created: `chats`, `messages`
4. Check that RLS policies are applied

### 1.3 Set Up Hasura Permissions

1. Go to Nhost Console > Hasura
2. Track the `chats` and `messages` tables
3. Configure relationships:
   - `chats.messages` → array relationship
   - `messages.chat` → object relationship
4. Set up permissions for `user` role using `database/hasura-permissions.yaml`

### 1.4 Create Hasura Action

1. Go to Actions tab in Hasura Console
2. Create new action: `sendMessage`
3. Use configuration from `database/hasura-action-config.yaml`
4. Set handler URL to `https://chandankt.app.n8n.cloud/webhook/chatbot`

## Phase 2: n8n Workflow Setup

### 2.1 Set Up n8n Instance

**Option A: n8n Cloud**
1. Sign up at [n8n.cloud](https://n8n.cloud/)
2. Create a new workflow

**Option B: Self-hosted**
1. Deploy n8n using Docker:
   ```bash
   docker run -d --name n8n -p 5678:5678 n8nio/n8n
   ```

### 2.2 Import Workflow

1. Import `n8n/chatbot-workflow.json`
2. Configure credentials:
   - **OpenRouter API**: Create HTTP Auth credential with Bearer token
   - **Hasura API**: Create HTTP Auth credential with admin secret

### 2.3 Configure Webhook

1. Activate the workflow
2. Copy the webhook URL from the trigger node
3. Update Hasura Action handler URL

## Phase 3: OpenRouter API Setup

### 3.1 Get API Key

1. Sign up at [OpenRouter](https://openrouter.ai/)
2. Go to API Keys section
3. Create a new API key
4. Add credits to your account (or use free models)

### 3.2 Configure in n8n

1. Update the OpenRouter credential in n8n
2. Test the API connection
3. Adjust model settings if needed (currently using free Llama model)

## Phase 4: Frontend Configuration

### 4.1 Environment Variables

Create `.env` file in the React app:

```env
REACT_APP_NHOST_SUBDOMAIN=wsyhhjiocamicltpcfdd
REACT_APP_NHOST_REGION=ap-south-1
REACT_APP_HASURA_GRAPHQL_URL=https://wsyhhjiocamicltpcfdd.hasura.ap-south-1.nhost.run/v1/graphql
REACT_APP_HASURA_GRAPHQL_WS_URL=wss://wsyhhjiocamicltpcfdd.hasura.ap-south-1.run/v1/graphql
```

### 4.2 Update Nhost Configuration

Update `src/lib/nhost.js`:

```javascript
export const nhost = new NhostClient({
  subdomain: process.env.REACT_APP_NHOST_SUBDOMAIN,
  region: process.env.REACT_APP_NHOST_REGION
})
```


## Phase 5: Testing

### 5.1 Local Testing

1. Start the React development server:
   ```bash
   npm run dev
   ```

2. Test the complete flow:
   - User registration/login
   - Chat creation
   - Message sending
   - AI responses

### 5.2 Integration Testing

1. Verify Hasura permissions work correctly
2. Test n8n workflow execution
3. Check OpenRouter API responses
4. Validate database updates

## Phase 6: Production Deployment

### 6.1 Build Frontend

```bash
npm run build
```

### 6.2 Deploy to Netlify

**Option A: Netlify CLI**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**Option B: Git Integration**
1. Push code to GitHub
2. Connect repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variables in Netlify dashboard

### 6.3 Configure Environment Variables in Netlify

Add the following environment variables:
- `REACT_APP_NHOST_SUBDOMAIN`
- `REACT_APP_NHOST_REGION`
- `REACT_APP_HASURA_GRAPHQL_URL`
- `REACT_APP_HASURA_GRAPHQL_WS_URL`

### 6.4 Update CORS Settings

1. In Nhost Console, go to Settings > CORS
2. Add your Netlify domain to allowed origins
3. Update n8n webhook security if needed

## Security Checklist

- [ ] RLS policies are properly configured
- [ ] User roles and permissions are set correctly
- [ ] API keys are stored securely
- [ ] CORS is configured for production domains
- [ ] Webhook endpoints are secured
- [ ] Input validation is implemented
- [ ] Rate limiting is configured (optional)

## Monitoring and Maintenance

### Application Monitoring

1. **Nhost Dashboard**: Monitor database performance and auth metrics
2. **n8n Execution History**: Track workflow success/failure rates
3. **OpenRouter Usage**: Monitor API usage and costs
4. **Netlify Analytics**: Track frontend performance

### Regular Maintenance

1. **Database Cleanup**: Archive old messages if needed
2. **API Key Rotation**: Rotate OpenRouter API keys periodically
3. **Dependency Updates**: Keep npm packages updated
4. **Security Patches**: Apply security updates promptly

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Check Nhost configuration
   - Verify JWT tokens are being passed correctly

2. **GraphQL Errors**
   - Validate permissions in Hasura
   - Check RLS policies

3. **n8n Workflow Failures**
   - Check execution history
   - Verify credentials are configured
   - Test API endpoints manually

4. **OpenRouter API Errors**
   - Check API key validity
   - Verify account has sufficient credits
   - Review rate limits

### Debug Mode

Enable debug mode in development:

```env
REACT_APP_DEBUG=true
```

This will show additional logging in the browser console.

## Cost Optimization

1. **Use Free Models**: Stick to free OpenRouter models for development
2. **Implement Caching**: Cache frequent responses
3. **Rate Limiting**: Prevent abuse and excessive API calls
4. **Database Optimization**: Regular cleanup of old data
5. **CDN Usage**: Use Netlify's CDN for static assets

## Scaling Considerations

1. **Database**: Consider read replicas for high traffic
2. **n8n**: Use multiple instances for redundancy
3. **Caching**: Implement Redis for session management
4. **Load Balancing**: Use multiple Hasura instances if needed

## Support and Resources

- [Nhost Documentation](https://docs.nhost.io/)
- [Hasura Documentation](https://hasura.io/docs/)
- [n8n Documentation](https://docs.n8n.io/)
- [OpenRouter API Documentation](https://openrouter.ai/docs)
- [React Documentation](https://react.dev/)

## License

This project is licensed under the MIT License. See LICENSE file for details.

