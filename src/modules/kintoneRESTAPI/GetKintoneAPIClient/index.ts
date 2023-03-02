import { KintoneRestAPIClient } from '@kintone/rest-api-client'
import { getSpaceId } from '../'

export const getKintoneRestAPIClient = async (token?: string) => {
  const isGuestSpace = await getSpaceId()
  const options: apiclient.Options = {}
  if (token) options.auth = { apiToken: token }
  if (isGuestSpace) options.guestSpaceId = isGuestSpace
  return new KintoneRestAPIClient(options)
}
