import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'
import React from 'react'

function PaginationTable({quantityRow,totalData,currentPage,handleChangePage}) {
    const page = Math.ceil(totalData/quantityRow);
    const startRow = !totalData ? 0 : ((currentPage - 1) * quantityRow) + 1;
    let viewRows = currentPage * quantityRow;
    viewRows = !totalData ? 0 : (viewRows > totalData) ? totalData : viewRows
    let numerPage = [];
    for (let i = 0; i < page; i++) {
        numerPage.push(i+1);
    }
    let currentPagination = currentPage;
  return (
    <div className='flex justify-between flex-wrap items-center gap-2'>
        <div>
            <span>Mostrando {startRow} a {viewRows} de {totalData} registros</span>
        </div>
        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                onClick={e => handleChangePage(currentPagination == 1 ? 0 : currentPagination - 1)}
            >
                <span className="sr-only">Previous</span>
                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            {
                numerPage.map(number => (
                    number != currentPagination ? <button
                    key={number}
                    className="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex"
                    onClick={e => handleChangePage(number)}>
                    {number}
                    </button>:
                    <button
                    aria-current="page"
                    key={number}
                    className="relative z-10 inline-flex items-center bg-green-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                    >
                        {number}
                    </button>
                ))
            }
            {/* <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                ...
            </span> */}
            <button
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                onClick={e => handleChangePage(currentPagination == page ? 0 : currentPagination + 1)}
            >
                <span className="sr-only">Next</span>
                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
        </nav>
    </div>
  )
}

export default PaginationTable