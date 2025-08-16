import { NhostClient } from '@nhost/nhost-js'

// Note: In a real application, these would come from environment variables
// For this demo, we'll use placeholder values that need to be configured
export const nhost = new NhostClient({
  subdomain: process.env.REACT_APP_NHOST_SUBDOMAIN || 'your-nhost-subdomain',
  region: process.env.REACT_APP_NHOST_REGION || 'us-east-1',
  // For development, you might want to use local Nhost
  // subdomain: 'localhost',
  // region: undefined,
  // adminSecret: 'nhost-admin-secret'
})

export default nhost

