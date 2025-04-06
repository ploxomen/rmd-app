import React from 'react'
import TableIntranet from '../TableIntranet'
import { ButtonDangerSm, ButtonPrimarySm } from '../Buttons'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid'

export default function TableHistoryProgress({histories,deleteHistory,viewHistory}) {
    const columns = [
        'codigo',
        'fecha',
        'producto',
        'cantidad',
        'justificacion',
        'acciones'
    ]
  return (
    <TableIntranet columns={columns}>
    {!histories.length ? (
      <tr className="bg-white dark:bg-gray-800">
        <td colSpan="100%" className="text-center font-bold">
          No se registraron movimientos
        </td>
      </tr>
    ) : (
      histories.map((history) => (
        <tr className="bg-white dark:bg-gray-800 text-xs" key={history.id}>
          <td className="p-1 text-center">
            {history.id.toString().padStart(3, "0")}
          </td>
          <td className="p-1 text-center">{history.product_progress_history_date}</td>
          <td className="p-1 text-center">{history.product_name}</td>
          <td className="p-1 text-center">{history.product_progress_history_stock}</td>
          <td className="p-1 text-center">{history.product_progress_history_description}</td>        
          <td className="p-1">
            <div className="flex gap-1 flex-wrap justify-center">
              <ButtonPrimarySm
                onClick={(e) => viewHistory(history.id)}
                icon={<PencilIcon className="w-4 h-4" />}
                title='Editar historial'
              />
              <ButtonDangerSm
                onClick={(e) => deleteHistory(history.id)}
                title='Eliminar historial'
                icon={<TrashIcon className="w-4 h-4" />}
              />
            </div>
          </td>
        </tr>
      ))
    )}
  </TableIntranet>
  )
}
