import { ColumnDef, flexRender, getCoreRowModel, Table, useReactTable } from '@tanstack/react-table'
import React, { useEffect, useMemo, useState } from 'react'
import { getKintoneRestAPIClient } from '../../modules'

export const App = () => {
  const [members, setMembers] = useState<string[]>([])
  const [callLog, setCallLog] = useState<any[]>([])

  useEffect(() => {
    const getCallLog = async () => {
      const client = await getKintoneRestAPIClient()
      const logs = await client.record.getAllRecords({ app: 427, condition: '日付 >= TODAY()' })
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

  return (
    <div>
      {callLog.length ? (
        <div>
          <h2 style={HeadStyle}>当日コール集計</h2>
          <CallLogTable records={callLog} members={members} />
          <br />
        </div>
      ) : (
        <h1>読み込み中...</h1>
      )}
    </div>
  )
}

type TableData = {
  col1: string
  col2?: number
  col3?: number
  col4?: number
  col5?: number
  col6?: number
  col7?: number
  col8?: number
  col9?: number
  col10?: number
  col11?: number
}

function CallLogTable({ records, members }: { records: any[]; members: string[] }) {
  const tableData = useMemo(() => {
    const obj: any = {}
    const times: number[] = []
    records.forEach(record => {
      const manager = record.MG担当者.value[0].name
      const time = Number(record.時刻.value.slice(0, 2))
      if (!times.includes(time)) times.push(time)
      if (!(manager in obj)) obj[manager] = {}
      if (!(time in obj[manager])) {
        obj[manager][time] = 1
        return
      }
      obj[manager][time]++
    })
    times.sort((a, b) => a - b)
    const Columns: ColumnDef<any>[] = [
      {
        header: 'オペレーター',
        accessorKey: 'col1',
      },
      {
        header: '総数',
        accessorKey: 'col2',
      },
    ]
    times.forEach((time, index) => Columns.push({ header: time + ':00', accessorKey: 'col' + (index + 3) }))
    const datas: TableData[] = []
    for (let operator in obj) {
      let totalCount = 0
      const log = obj[operator]
      const data: TableData = {
        col1: operator,
      }
      times.forEach((time, index) => {
        const count = (log[time] ??= 0)
        const key = ('col' + (index + 3)) as 'col3' | 'col4' | 'col5' | 'col6' | 'col7' | 'col8' | 'col9' | 'col10'
        totalCount += count
        data[key] = count
      })
      data.col2 = totalCount
      datas.push(data)
    }
    const sortDatas = [...datas].sort((a, b) => {
      return members.indexOf(a.col1) - members.indexOf(b.col1)
    })

    return { data: sortDatas, columns: Columns, getCoreRowModel: getCoreRowModel() }
  }, [])

  const table = useReactTable(tableData)

  return (
    <table style={TableStyles.table}>
      <thead style={TableStyles.thead}>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th style={TableStyles.th} key={header.id} colSpan={header.colSpan}>
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody style={TableStyles.tbody}>
        {table.getRowModel().rows.map(row => {
          return (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell, index) => {
                return (
                  <td style={index > 0 ? TableStyles.tfootth2 : TableStyles.tfootth} key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

type Styles = {
  table: React.CSSProperties
  thead: React.CSSProperties
  tbody: React.CSSProperties
  th: React.CSSProperties
  td: React.CSSProperties
  tfootth: React.CSSProperties
  tfootth2: React.CSSProperties
}
const TableStyles: Styles = {
  table: {
    border: '1px solid lightgray',
    padding: 10,
    fontSize: 16,
    marginLeft: 'auto',
    marginRight: 'auto',
    minWidth: 120,
  },
  thead: {
    margin: 10,
  },
  tbody: {
    border: '1px solid lightgray',
    padding: 10,
  },
  th: {
    border: '1px solid lightgray',
    padding: 10,
    minWidth: 60,
  },
  td: {
    border: '1px solid lightgray',
    padding: 10,
    fontWeight: 'normal',
  },
  tfootth: {
    border: '1px solid lightgray',
    padding: 10,
  },
  tfootth2: {
    border: '1px solid lightgray',
    padding: 10,
    fontWeight: 'normal',
    textAlign: 'right',
  },
}

const HeadStyle: React.CSSProperties = {
  fontSize: 26,
  fontWeight: 'bold',
  textAlign: 'center',
}
