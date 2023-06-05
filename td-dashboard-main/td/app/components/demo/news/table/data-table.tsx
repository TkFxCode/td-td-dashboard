'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  VisibilityState,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
  SortingState,
} from '@tanstack/react-table';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { useUser } from '@/app/appwrite/useUser';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import { Card } from '@/app/components/ui/card';
import { createOrUpdateUserNewsDocument } from '@/app/appwrite/services/NewsService';
import { RefreshNewsContext } from '../RefreshNewsContext';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const { user } = useUser();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [selectedColumn, setSelectedColumn] = React.useState('title');
  const [rowSelection, setRowSelection] = React.useState<
    Record<string, boolean>
  >({});

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const table = useReactTable({
    data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  const selectedRowData = Object.keys(rowSelection)
    .filter((k) => rowSelection[k])
    .map((id) => data[parseInt(id)]);

  const refreshNews = React.useContext(RefreshNewsContext);
  const handleOnSubmit = async () => {
    console.log(selectedRowData);

    // Assuming you have the userId in a variable named user.$id
    await createOrUpdateUserNewsDocument(user.$id, selectedRowData);

    setRowSelection({});
    refreshNews();
  };

  return (
    <div className="">
      <div className="flex flex-col lg:flex-row items-center py-4">
        <Card className="flex  flex-col lg:flex-row w-full">
          <Input
            placeholder={`Filter ${selectedColumn}...`}
            value={
              (table.getColumn(selectedColumn)?.getFilterValue() as string) ??
              ''
            }
            onChange={(event) =>
              table
                .getColumn(selectedColumn)
                ?.setFilterValue(event.target.value)
            }
            className="w-auto lg:max-w-sm m-2 "
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="m-2">
                Filter Column
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.id === selectedColumn}
                      onCheckedChange={(value) => {
                        if (value) setSelectedColumn(column.id);
                      }}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="lg:ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className=" flex justify-stretch">
                  <Button variant="outline" className=" m-2  w-full">
                    Edit Columns
                  </Button>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Card>
      </div>
      {selectedRowData.length > 0 && (
        <div className="flex flex-row justify-center ">
          {/* Displaying number of selections */}
          <div className="m-2 w-full ">
            <p className="h-full flex justify-center items-center">
              Number of selections: {selectedRowData.length}
            </p>
          </div>

          {/* Button to submit selections to database */}
          <Button
            onClick={handleOnSubmit}
            className="m-2 w-full flex justify-center"
          >
            Submit to Database
          </Button>
        </div>
      )}

      <div className="rounded-md border ">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead className="h-[90px] xl:h-auto" key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="h-full"
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
