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

const getCaseTitle = (caseName: any): string => {
  if (typeof caseName != 'string') return ''
  if (caseName.includes('特命')) return '特命'
  if (caseName.includes('フォロー')) return 'フォロー'
  if (caseName.includes('事前')) return '事前'
  if (caseName.includes('売上調査')) return 'ウラン'
  return ''
}
export const App = () => {
  const [members, setMembers] = useState<string[]>()
  const [callLog, setCallLog] = useState<any[]>()
  const [cases, setCases] = useState<string[]>([])

  useEffect(() => {
    const getCallLog = async () => {
      const client = await getKintoneRestAPIClient()
      const logs = await client.record.getAllRecords({ app: 427, condition: '日付 = TODAY()' })
      setCallLog(logs)

      const caseNames: string[] = []
      for (let log of logs) {
        const caseName = log.案件名.value as string
        if (caseNames.includes(caseName) || !caseName) continue
        caseNames.push(caseName)
      }
      setCases(prevCases => [...prevCases, ...caseNames])

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
      {cases.map(caseTitle => (
        <React.Fragment key={caseTitle}>
          <h2 style={HeadStyle}>{getCaseTitle(caseTitle) + '集計'}</h2>
          <CaseTypes caseName={caseTitle} records={callLog} members={members} />
        </React.Fragment>
      ))}
      <div style={{ marginTop: 36 }} />
    </div>
  ) : (
    <h1>読み込み中...</h1>
  )
}
