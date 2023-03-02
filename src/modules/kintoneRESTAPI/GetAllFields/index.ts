import { getKintoneRestAPIClient } from '../GetKintoneAPIClient'

export const getAllFields = async () => {
  const appId = kintone.app.getId() as number
  const params = { app: appId }
  const client = await getKintoneRestAPIClient()

  const formLayout = await client.app.getFormLayout(params)
  const layout = formLayout.layout
  const formFields = await client.app.getFormFields(params)
  const appFields = formFields.properties

  let result: any[] = []

  for (let row of layout) {
    if (!('fields' in row)) continue
    const { fields } = row
    for (let field of fields) {
      if (!('code' in field)) continue
      const { code } = field
      result = [...result, appFields[code]]
    }
  }

  return result
}
