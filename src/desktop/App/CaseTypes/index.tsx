import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import BigNumber from 'bignumber.js'
import React, { useMemo } from 'react'
import { Table } from '../Table'

type Props = {
  caseTitle: string
  records: any[]
  members: string[]
}

export const CaseTypes = ({ caseTitle, records, members }: Props) => {
  const props = {
    records: records,
    members: members,
  }
  switch (caseTitle) {
    case 'ウラン':
      return <UranTable {...props} />
    case 'フォロー':
      return <FollowTable {...props} />
    case '特命':
      return <SpecialFollowTable {...props} />
    default:
      return <></>
  }
}

const UranTable = ({ records, members }: { records: any[]; members: string[] }) => {
  type TableData = {
    operator: string
    totalCount: number
    review: number
    complete: number
    get: number
    getRate?: string
  }

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

      const getRate = obj.get ? new BigNumber((obj.get / obj.complete) * 100).dp(1) : 0
      obj.getRate = getRate + '%'
      return obj
    })
  }, [])

  const tableProps = {
    data: tableDatas,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  }

  return <Table {...tableProps} />
}

const FollowTable = ({ records, members }: { records: any[]; members: string[] }) => {
  type TableData = {
    operator: string
    totalCount: number
    review: number
    complete: number
    get: number
    getRate?: string
  }

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
        if (caseName != 'フォローコール' || manager != op) return
        const status = record.完了ステータス.value
        const detail = record.完了詳細.value
        const isGet = detail === 'ログイン案内済み' || detail === '更新・修正了承（登録）'
        obj.totalCount++
        status === '完了' ? obj.complete++ : obj.review++
        obj.get += isGet ? 1 : 0
      })

      const getRate = obj.get ? new BigNumber((obj.get / obj.complete) * 100).dp(1) : 0
      obj.getRate = getRate + '%'
      return obj
    })
  }, [])

  const tableProps = {
    data: tableDatas,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  }

  return <Table {...tableProps} />
}

const SpecialFollowTable = ({ records, members }: { records: any[]; members: string[] }) => {
  type TableData = {
    operator: string
    totalCount: number
    review: number
    complete: number
    get: number
    getRate?: string
  }

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
        if (caseName != '特命フォロー' || manager != op) return
        const status = record.完了ステータス.value
        const detail = record.完了詳細.value
        const isGet = detail === 'ログイン案内済み' || detail === '更新・修正了承（登録）'
        obj.totalCount++
        status === '完了' ? obj.complete++ : obj.review++
        obj.get += isGet ? 1 : 0
      })

      const getRate = obj.get ? new BigNumber((obj.get / obj.complete) * 100).dp(1) : 0
      obj.getRate = getRate + '%'
      return obj
    })
  }, [])

  const tableProps = {
    data: tableDatas,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  }

  return <Table {...tableProps} />
}
