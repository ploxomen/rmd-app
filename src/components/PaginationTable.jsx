import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import React from "react";
import ButtonNavPag from "./ButtonNavPag";

function PaginationTable({
  quantityRow,
  totalData,
  currentPage,
  handleChangePage,
}) {
  const page = Math.ceil(totalData / quantityRow);
  const startRow = !totalData ? 0 : (currentPage - 1) * quantityRow + 1;
  let viewRows = currentPage * quantityRow;
  viewRows = !totalData ? 0 : viewRows > totalData ? totalData : viewRows;
  let numerPage = [];
  if (page < 6) {
    for (let i = 1; i <= page; i++) {
      numerPage.push(
        <ButtonNavPag
          key={i}
          number={i}
          currentPagination={currentPage}
          handleChangePage={handleChangePage}
        />
      );
    }
  } else {
    if (currentPage > 3) {
      numerPage.push(
        <ButtonNavPag
         key={1}
          number={1}
          currentPagination={currentPage}
          handleChangePage={handleChangePage}
        />
      );
    }
    if (currentPage > 4) {
      numerPage.push(
        <span key={'P1'} className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
          ...
        </span>
      );
    }
    for (
      let i = currentPage <= 2 ? 1 : currentPage - 2;
      i <= currentPage + 2 && page >= i;
      i++
    ) {
      numerPage.push(
        <ButtonNavPag
        key={i}
          number={i}
          currentPagination={currentPage}
          handleChangePage={handleChangePage}
        />
      );
    }
    if (currentPage <= page - 4) {
      numerPage.push(
        <span key={'P2'} className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
          ...
        </span>
      );
    }
    if (currentPage <= page - 3) {
      numerPage.push(
        <ButtonNavPag
            key={page}
          number={page}
          currentPagination={currentPage}
          handleChangePage={handleChangePage}
        />
      );
    }
  }
  return (
    <div className="flex justify-between flex-wrap items-center gap-2">
      <div>
        <span>
          Mostrando {startRow} a {viewRows} de {totalData} registros
        </span>
      </div>
      <nav
        className="isolate inline-flex -space-x-px rounded-md shadow-sm"
        aria-label="Pagination"
      >
        <button
          className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
          onClick={(e) =>
            handleChangePage(currentPage == 1 ? 0 : currentPage - 1)
          }
        >
          <span className="sr-only">Previous</span>
          <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        {numerPage}
        <button
          className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
          onClick={(e) =>
            handleChangePage(currentPage == page ? 0 : currentPage + 1)
          }
        >
          <span className="sr-only">Next</span>
          <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </nav>
    </div>
  );
}

export default PaginationTable;
