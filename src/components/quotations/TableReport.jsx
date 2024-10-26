import React from 'react'
import TableIntranet from '../TableIntranet'

function TableReport({quotations,status}) {
    const columns = [
        'Código Cotización',
        'Fecha Cotización',
        'Fecha Pedido',
        'Código Pedido',
        'Vendedor',
        'Razon Social',
        'País',
        'Departamento',
        'Estado'
    ]
  return (
    <TableIntranet columns={columns}>
        {
            !quotations.length ? <tr className="bg-white dark:bg-gray-800"><td colSpan="100%" className='text-center font-bold'>No se encontraron cotizaciones</td></tr> : quotations.map(quotation => (
                <tr className="bg-white dark:bg-gray-800" key={quotation.id}>
                    <td  className="py-2 px-4 text-center">{quotation.quotation_code}</td>
                    <td className="py-2 px-4">{quotation.quotation_date_issue}</td>
                    <td className="py-2 px-4">{quotation.order_create}</td>
                    <td className="py-2 px-4">{quotation.order_code}</td>
                    <td className="py-2 px-4">{quotation.user_name + ' ' + quotation.user_last_name}</td>
                    <td className="py-2 px-4">{quotation.customer_name}</td>
                    <td className="py-2 px-4">{quotation.contrie}</td>
                    <td className="py-2 px-4">{quotation.departament_name}</td>
                    <td className="py-2 px-4">{status[quotation.quotation_status].element}</td>
                </tr>
            ))
        }
    </TableIntranet>
  )
}
export default TableReport;