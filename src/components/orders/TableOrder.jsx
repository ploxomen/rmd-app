import React from 'react'
import { Checkbox } from '../Inputs'
import { parseMoney } from '@/helpers/utilities'

function TableOrder({quotations,typeMoney,selectQuotation,changeChecked,changeAll}) {
    return (
    <table className="w-full table-auto text-sm mb-3 text-left text-gray-500 dark:text-gray-400 min-w-[500px]">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" className="py-3 px-6 text-center">
                    <Checkbox name="all" checked={selectQuotation} onChange={changeAll}/>
                </th>
                <th scope="col" className="py-3 px-6 text-center">Código</th>
                <th scope="col" className="py-3 px-6 text-center">Fecha Emisión</th>
                <th scope="col" className="py-3 px-6 text-center">Proyecto</th>
                <th scope="col" className="py-3 px-6 text-center">Contacto</th>
                <th scope="col" className="py-3 px-6 text-center">Email</th>
                <th scope="col" className="py-3 px-6 text-center">Tel.</th>
                <th scope="col" className="py-3 px-6 text-center">Total</th>
            </tr>
        </thead>
        <tbody>
            {
                !quotations.length ? <tr className="bg-white dark:bg-gray-800"><td colSpan="100%" className='text-center font-bold'>No se encontraron cotizaciones</td></tr> : quotations.map(quotation => (
                    <tr className="bg-white dark:bg-gray-800" key={quotation.id}>
                        <td className="py-2 px-4 text-center">
                            <Checkbox name={"quotation_check_" + quotation.id} checked={quotation.checked === 1 ? true : false} onChange={e => changeChecked(quotation.id)}/>
                        </td>
                        <td className="py-2 px-4 text-center">{quotation.quotation_code}</td>
                        <td className="py-2 px-4">{quotation.date_issue}</td>
                        <td className="py-2 px-4">{quotation.quotation_project}</td>
                        <td className="py-2 px-4">{quotation.contact_name}</td>
                        <td className="py-2 px-4">{quotation.contact_email}</td>
                        <td className="py-2 px-4">{quotation.contact_number}</td>
                        <td className="py-2 px-4">{parseMoney(quotation.quotation_total,typeMoney)}</td>
                    </tr>
                ))
            }
        </tbody>
    </table>
  )
}

export default TableOrder