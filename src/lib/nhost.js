import { NhostClient } from '@nhost/react'

export const nhost = new NhostClient({
  subdomain: process.env.REACT_APP_NHOST_SUBDOMAIN || 'wsyhhjiocamicltpcfdd',
  region: process.env.REACT_APP_NHOST_REGION || 'ap-south-1'
})

export default nhost

