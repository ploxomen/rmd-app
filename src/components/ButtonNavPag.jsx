import React from "react";

function ButtonNavPag({ number, currentPagination, handleChangePage }) {
  return number != currentPagination ? (
    <button
      key={number}
      className="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex"
      onClick={(e) => handleChangePage(number)}
    >
      {number}
    </button>
  ) : (
    <button
      aria-current="page"
      key={number}
      className="relative z-10 inline-flex items-center bg-green-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
    >
      {number}
    </button>
  );
}

export default ButtonNavPag;
