import { ColumnDef, getCoreRowModel } from '@tanstack/react-table'
import React, { useMemo } from 'react'
import { Table } from '../Table'

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

export function CallLogTable({ records, members }: { records: any[]; members: string[] }) {
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

  return <Table {...tableData} />
}

const TableStyles = {
  table: {
    border: '1px solid lightgray',
    padding: 10,
    fontSize: 16,
    marginLeft: '2%',
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
