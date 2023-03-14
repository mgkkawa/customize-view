import { ColumnDef, getCoreRowModel } from '@tanstack/react-table'
import BigNumber from 'bignumber.js'
import React from 'react'
import { Table } from '../Table'

type Props = {
  caseName: string
  records: any[]
  members: string[]
}

type TableData = {
  operator: string
  totalCount: number
  review: number
  complete: number
  get: number
  getRate?: string
}

const columns: ColumnDef<TableData>[] = [
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

export const CaseTypes = (props: Props) => {
  return <Table {...getTableDatas(props)} />
}

type GetTableDatasProps = {
  caseName: string
  records: any[]
  members: string[]
}

const getTableDatas = (props: GetTableDatasProps) => {
  const { caseName, records, members } = props
  const currentMembers = records
    .map(record => record.MG担当者.value[0].name)
    .filter((op, index, arr) => arr.indexOf(op) === index)
    .sort((a, b) => members.indexOf(a) - members.indexOf(b))

  const tableDatas: TableData[] = currentMembers
    .map(op => {
      const obj: TableData = {
        operator: op,
        totalCount: 0,
        review: 0,
        complete: 0,
        get: 0,
      }
      records.forEach(record => {
        const currentCaseName = record.案件名.value
        if (caseName != currentCaseName) return
        getTableDataObject(obj, record)
      })

      const getRate = obj.get ? new BigNumber((obj.get / obj.complete) * 100).dp(1) : 0
      obj.getRate = getRate + '%'
      return obj
    })
    .filter(obj => obj.totalCount)

  return {
    data: tableDatas,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  }
}

const getTableDataObject = (obj: TableData, record: any) => {
  const operator = obj.operator
  const user = record.MG担当者.value[0].name
  if (user != operator) return
  const caseName = record.案件名.value
  const status = record.完了ステータス.value
  const detail = record.完了詳細.value
  const isGet = getIsGet(caseName, detail)
  obj.totalCount++
  status === '完了' ? obj.complete++ : obj.review++
  obj.get += isGet ? 1 : 0
}

const getIsGet = (caseName: string, detail: string): boolean => {
  switch (caseName) {
    case '売上調査コール':
      return detail === '取得OK'
    case 'フォローコール':
    case '特命フォロー':
      return detail === 'ログイン案内済み' || detail === '更新・修正了承（登録）'
    case '事前コール':
      return detail === '送付了承'
  }
  return false
}
