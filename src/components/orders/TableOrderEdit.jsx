import React from 'react'
import TableIntranet from '../TableIntranet'
import { ButtonDangerSm } from '../Buttons'
import { TrashIcon } from '@heroicons/react/24/solid'
import { parseMoney } from '@/helpers/utilities'

function TableOrderEdit({quotations,typeMoney,handleDelete}) {
    const columns = [
        'Item',
        'Cotización',
        'Fecha Emisión',
        'Total',
        'Eliminar'
    ]
  return (
    <TableIntranet columns={columns}>
        {
            !quotations.length ? <tr className="bg-white dark:bg-gray-800"><td colSpan="100%" className='text-center font-bold'>No se agregaron cotizaciones</td></tr> : quotations.map(function (quotation,key)
                {
                    return quotation.close === 0 && 
                    <tr className="bg-white dark:bg-gray-800" key={quotation.id}>
                        <td className="py-2 px-2 max-w-3 w-3 text-center">{key + 1}</td>
                        <td className="py-2 px-4">{quotation.id.toString().padStart(5,'0')}</td>
                        <td className="py-2 px-4">{quotation.date_issue}</td>
                        <td className="py-2 px-4">{parseMoney(quotation.quotation_total,typeMoney)}</td>
                        <td className="py-2 px-2 max-w-8 w-6">
                            <div className='flex gap-1 flex-wrap justify-center'>
                                <ButtonDangerSm text="Eliminar" onClick={e => handleDelete(quotation.id)} icon={<TrashIcon className='w-4 h-4'/>}/>
                            </div>
                        </td>
                    </tr>
                }
            )
        }
    </TableIntranet>
  )
}

export default TableOrderEdit