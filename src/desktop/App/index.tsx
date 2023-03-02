import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import React, { useEffect, useState } from 'react'
import { getKintoneRestAPIClient } from '../../modules'

export const App = () => {
  const [callLog, setCallLog] = useState<any[]>([])

  useEffect(() => {
    const getCallLog = async () => {
      const client = await getKintoneRestAPIClient()
      const records = await client.record.getAllRecords({ app: 427, condition: '日付 >= TODAY()' })
      setCallLog(records)
    }
    getCallLog()
  }, [])

  return <div>{callLog.length ? <CallLogTable records={callLog} /> : 'hage'}</div>
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

function CallLogTable({ records }: { records: any[] }) {
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
  times.forEach((time, index) => Columns.push({ header: '' + time, accessorKey: 'col' + (index + 3) }))
  const datas: TableData[] = []
  for (let operator in obj) {
    const log = obj[operator]
    const data: TableData = {
      col1: operator,
    }
    times.forEach(
      (time, index) =>
        (data[('col' + (index + 3)) as 'col3' | 'col4' | 'col5' | 'col6' | 'col7' | 'col8' | 'col9' | 'col10'] = log[
          time
        ] ??=
          0),
    )
    datas.push(data)
  }
  console.log(datas)

  const table = useReactTable({ data: datas, columns: Columns, getCoreRowModel: getCoreRowModel() })
  return (
    <table style={TableStyles.table}>
      <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th key={header.id} colSpan={header.colSpan}>
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
              {row.getVisibleCells().map(cell => {
                return (
                  <td style={TableStyles.th} key={cell.id}>
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
  tbody: React.CSSProperties
  th: React.CSSProperties
  td: React.CSSProperties
  tfoot: React.CSSProperties
}
const TableStyles: Styles = {
  table: {
    border: '1px solid lightgray',
    padding: '1px',
  },
  tbody: {
    border: '1px solid lightgray',
  },
  th: {
    border: '1px solid lightgray',
    padding: 4,
    fontWeight: 'normal',
  },
  td: {
    padding: 4,
  },
  tfoot: {
    color: 'gray',
    fontWeight: 'normal',
  },
}
