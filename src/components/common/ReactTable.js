import React, { useEffect, useMemo, useState } from 'react';
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
  useRowSelect,
} from 'react-table';
import { ReactTableCheckbox } from './ReactTableCheckbox';

const ReactTable = ({
  columns,
  data,
  totalCount,
  onSelectionChange,
  setSelection,
  showCheckbox = true,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    state,
    setGlobalFilter,
    page,
    selectedFlatRows,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: currentPage },
      manualPagination: true,
      pageCount: totalPages,
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,

    (hooks) => {
      showCheckbox &&
        hooks.visibleColumns.push((columns) => [
          {
            id: 'selection',
            Header: ({ getToggleAllRowsSelectedProps }) => (
              <ReactTableCheckbox {...getToggleAllRowsSelectedProps()} />
            ),
            Cell: ({ row }) => (
              <ReactTableCheckbox {...row.getToggleRowSelectedProps()} />
            ),
          },
          ...columns,
        ]);
    },
  );

  const { globalFilter } = state;

  const handleInputChange = (e) => {
    const value = e.target.value || undefined;
    setGlobalFilter(value);
  };

  const paginatedData = useMemo(() => {
    return page;
  }, [page]);

  useEffect(() => {
    onSelectionChange(selectedFlatRows.map((row) => row.original));
  }, [selectedFlatRows, onSelectionChange]);

  return (
    <div className='short-data-table'>
      <input
        style={{ display: 'none' }}
        value={globalFilter || ''}
        onChange={handleInputChange}
        placeholder='Search...'
      />
      {data.length === 0 ? (
        <div className='no-data-message'>
          <p>No data available</p>
        </div>
      ) : (
        <div>
          <table {...getTableProps()} className='ptk-table dataTable no-footer'>
            <thead>
              {headerGroups.map((headerGroup, index) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                  {headerGroup.headers.map((column, index) => (
                    <th key={index}
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className='sorting'
                      style={{ width: column.width }}
                      aria-label={column.Header}
                    >
                      {column.render('Header')}
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? ' 🔽'
                            : ' 🔼'
                          : ''}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {paginatedData.map((row, index) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} key={index}>
                    {row.cells.map((cell, index) => (
                      <td key={index}
                        {...cell.getCellProps()}
                        className='short-data-table-cell'
                      >
                        {cell.column.id === 'yourColumnId' ? (
                          <a className='your-link-class' href={cell.value}>
                            {cell.render('Cell')}
                          </a>
                        ) : (
                          cell.render('Cell')
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReactTable;
