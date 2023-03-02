import React, { useEffect, useState } from 'react'
import { getKintoneRestAPIClient } from '../../modules'
import { CallLogTable } from './CallLogTable'
import { CaseTypes } from './CaseTypes'

const HeadStyle: React.CSSProperties = {
  marginLeft: '5%',
  width: '70%',
  fontSize: 26,
  fontWeight: 'bold',
  textAlign: 'center',
  backgroundColor: '#eee',
  alignItems: 'center',
}
export const App = () => {
  const [members, setMembers] = useState<string[]>()
  const [callLog, setCallLog] = useState<any[]>()

  useEffect(() => {
    const getCallLog = async () => {
      const client = await getKintoneRestAPIClient()
      const logs = await client.record.getAllRecords({ app: 427, condition: '日付 >= "2023-03-02"' })
      setCallLog(logs)

      const appId = kintone.app.getId() as number
      const records = await client.record.getAllRecords({ app: appId })
      const members: string[] = [...records]
        .sort((a, b) => Number(a.sort.value) - Number(b.sort.value))
        .map((record: any) => record.operator.value[0].name)
      setMembers(members)
    }
    getCallLog()
  }, [])

  return callLog && members ? (
    <div>
      <h2 style={HeadStyle}>当日コール集計</h2>
      <CallLogTable records={callLog} members={members} />
      <br />
      <h2 style={HeadStyle}>ウラン集計</h2>
      <CaseTypes records={callLog} members={members} />
    </div>
  ) : (
    <h1>読み込み中...</h1>
  )
}
