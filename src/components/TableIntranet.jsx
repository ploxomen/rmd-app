import React from 'react'

function TableIntranet({columns,children}) {
  return (
    <table className="w-full table-auto text-sm mb-3 text-left text-gray-500 dark:text-gray-400 min-w-[500px]">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                {columns.map((column,key) => (
                    <th scope="col" className="py-3 px-6 text-center" key={key}>{column}</th>
                ))}
            </tr>
        </thead>
        <tbody>
            {children}
        </tbody>
    </table>
  )
}

export default TableIntranet