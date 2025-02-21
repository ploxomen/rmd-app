import React from 'react'
import TableIntranet from '../TableIntranet'
import { parseMoney } from '@/helpers/utilities'
import { ButtonDangerSm, ButtonPrimarySm, ButtonSecondarySm } from '../Buttons'
import { ArrowDownTrayIcon, EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'

function TableAllQuotation({quotations,status,getQuotation,deleteQuotation,downloadPdf}) {
    const columns = [
        'Código',
        'Fecha',
        'Cliente',
        'Cotizador',
        'Subcategoria',
        'Total',
        'Estado',
        'Acciones'
    ]
    return (
        <TableIntranet columns={columns}>
            {
                !quotations.length ? <tr className="bg-white dark:bg-gray-800"><td colSpan="100%" className='text-center font-bold'>No se registraron cotizaciones</td></tr> : quotations.map(quotation => (
                    <tr className="bg-white dark:bg-gray-800 text-sm" key={quotation.id}>
                        <td  className="py-2 px-4 text-center">{quotation.quotation_code}</td>
                        <td className="py-2 px-4">{quotation.date_issue}</td>
                        <td className="py-2 px-4">{quotation.customer_name}</td>
                        <td className="py-2 px-4">{quotation.name_quoter}</td>
                        <td className="py-2 px-4">{quotation.sub_categorie_name}</td>
                        <td className="py-2 px-4">{parseMoney(quotation.quotation_total,quotation.quotation_type_money)}</td>
                        <td className="py-2 px-4">{status[quotation.quotation_status].element}</td>
                        <td className="py-2 px-4">
                            {
                                quotation.quotation_status !== 0 ?
                                <div className='flex gap-1 flex-wrap justify-center'>
                                    <Link href={{
                                        pathname: '/intranet/quotation/view/' + quotation.id,
                                        query: {
                                            fileName:`FP_${quotation.quotation_code.replace('/','_')}_${quotation.customer_name.replace(/ /g,'_').toUpperCase()}.pdf`
                                        }
                                    }} target='_blank' title="Ver PDF">
                                        <ButtonSecondarySm icon={<EyeIcon className='w-4 h-4'/>}/>
                                    </Link>
                                    <ButtonDangerSm title="Descargar PDF" onClick={e=> downloadPdf(quotation.id,`FP_${quotation.quotation_code.replace('/','_')}_${quotation.customer_name.replace(/ /g,'_').toUpperCase()}.pdf`)} icon={<ArrowDownTrayIcon className='w-4 h-4'/>}/>
                                    <ButtonPrimarySm title="Editar" onClick={e=> getQuotation(quotation.id)} icon={<PencilIcon className='w-4 h-4'/>}/>
                                    <ButtonDangerSm title="Anular" onClick={e => deleteQuotation(quotation.id)} icon={<TrashIcon className='w-4 h-4'/>}/>
                                </div> : <strong className='text-red-500 font-bold block text-center'>Sin acciones</strong>
                            }
                        </td>
                    </tr>
                ))
            }
        </TableIntranet>
  )
}

export default TableAllQuotation