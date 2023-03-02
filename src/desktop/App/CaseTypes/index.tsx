import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import React, { useMemo } from 'react'
import BigNumber from 'bignumber.js'

const BaseStyle: React.CSSProperties = {}
type TableData = {
  operator: string
  totalCount: number
  review: number
  complete: number
  get: number
  getRate?: string
}

export const CaseTypes = ({ records, members }: { records: any[]; members: string[] }) => {
  const columns: ColumnDef<any>[] = useMemo(() => {
    return [
      {
        header: 'オペレーター',
        accessorKey: 'operator',
      },
      {
        header: '総数',
        accessorKey: 'totalCount',
      },
      {
        header: '確認中',
        accessorKey: 'review',
      },
      {
        header: '完了',
        accessorKey: 'complete',
      },
      {
        header: '取得',
        accessorKey: 'get',
      },
      {
        header: '取得率',
        accessorKey: 'getRate',
      },
    ]
  }, [])
  const tableDatas: TableData[] = useMemo(() => {
    const currentMembers = records
      .map(record => record.MG担当者.value[0].name)
      .filter((op, index, arr) => arr.indexOf(op) === index)
      .sort((a, b) => members.indexOf(a) - members.indexOf(b))
    return currentMembers.map(op => {
      const obj: TableData = {
        operator: op,
        totalCount: 0,
        review: 0,
        complete: 0,
        get: 0,
      }
      records.forEach(record => {
        const manager = record.MG担当者.value[0].name
        const caseName = record.案件名.value
        if (caseName != '売上調査コール' || manager != op) return
        const status = record.完了ステータス.value
        const detail = record.完了詳細.value
        const isGet = detail === '取得OK'
        obj.totalCount++
        status === '完了' ? obj.complete++ : obj.review++
        obj.get += isGet ? 1 : 0
      })

      const getRate = obj.get ? new BigNumber(obj.complete / obj.get).dp(2) : 0
      obj.getRate = getRate + '%'
      return obj
    })
  }, [])
  const table = useReactTable({ data: tableDatas, columns: columns, getCoreRowModel: getCoreRowModel() })

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
