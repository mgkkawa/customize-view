import React from 'react'
import { flexRender, getCoreRowModel, TableOptions, useReactTable } from '@tanstack/react-table'
import './Table.scss'

export const Table = ({ data, columns }: TableOptions<any>) => {
  const table = useReactTable({ data: data, columns: columns, getCoreRowModel: getCoreRowModel() })
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
                  <td style={index > 1 ? TableStyles.tfootth : TableStyles.tfootth2} key={cell.id}>
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
