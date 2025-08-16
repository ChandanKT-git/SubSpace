import { ApolloClient, InMemoryCache, createHttpLink, split } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { createClient } from 'graphql-ws'

// HTTP link for queries and mutations
const httpLink = createHttpLink({
  uri: process.env.REACT_APP_HASURA_GRAPHQL_URL || 'https://wsyhhjiocamicltpcfdd.hasura.ap-south-1.nhost.run/v1/graphql'
})

// WebSocket link for subscriptions
const wsLink = new GraphQLWsLink(
  createClient({
    url: process.env.REACT_APP_HASURA_GRAPHQL_WS_URL || 'wss://wsyhhjiocamicltpcfdd.hasura.ap-south-1.run/v1/graphql',
    connectionParams: () => {
      const token = localStorage.getItem('nhostAccessToken')
      return {
        headers: {
          Authorization: token ? `Bearer ${token}` : ''
        }
      }
    }
  })
)

// Auth link to add authorization header
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('nhostAccessToken')
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
      'x-hasura-role': 'user'
    }
  }
})

// Split link to route queries/mutations to HTTP and subscriptions to WebSocket
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  authLink.concat(httpLink)
)

// Apollo Client instance
export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache({
    typePolicies: {
      chats: {
        fields: {
          messages: {
            merge(existing = [], incoming) {
              return incoming
            }
          }
        }
      }
    }
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all'
    },
    query: {
      errorPolicy: 'all'
    }
  }
})

export default apolloClient

