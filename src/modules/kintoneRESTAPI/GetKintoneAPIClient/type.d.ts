declare namespace apiclient {
  type Options = {
    baseUrl?: string
    auth?: any
    guestSpaceId?: number | string
    basicAuth?: any
    proxy?: any
    httpsAgent?: any
    clientCertAuth?:
      | {
          pfx: Buffer
          password: string
        }
      | {
          pfxFilePath: string
          password: string
        }
    featureFlags?: {
      enableAbortSearchError: boolean
    }
    userAgent?: string
  }
}
