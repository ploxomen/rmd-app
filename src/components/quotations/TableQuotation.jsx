import React from 'react'
import TableIntranet from '../TableIntranet'
import { ButtonDangerSm } from '../Buttons'
import { PencilIcon, PlusCircleIcon, TrashIcon } from '@heroicons/react/24/solid'
import { parseMoney } from '@/helpers/utilities'
import { InputDetailsSm } from '../Inputs'

function TableQuotation({ products, formatMoney, handleDetailChange, handleDeleteDetail, dataTotal, handleVerifNull, includeIgv, handleChangeDiscount, handleDetails,handleChangeTypeAmmount}) {
    const columns = [
        'Item',
        'Descripción',
        'T. Costo',
        'Cant.',
        'P. Unit.',
        'P. Adic.',
        'Importe',
        'Eliminar'
    ]
    return (
        <TableIntranet columns={columns}>
            {
                !products.length ? <tr className="bg-white dark:bg-gray-800"><td colSpan="100%" className='text-center font-bold'>No se agregaron productos</td></tr> : products.map((product, key) => (
                    <tr className="bg-white dark:bg-gray-800" key={product.id}>
                        <td className="py-2 px-2 max-w-3 w-3 text-center">{key + 1}</td>
                        <td className="py-2 px-2">
                            <div className="flex items-center gap-1">
                                <button type='button' className={!product.details ? 'text-green-500' : 'text-blue-500'} title={!product.details ? 'Agregar descripción' : 'Editar descripción'} onClick={e => handleDetails(product.id)}>
                                    {
                                        !product.details ? <PlusCircleIcon className='w-5 h-5' /> : <PencilIcon className='w-5 h-5' />
                                    }
                                </button>
                                {product.description}
                            </div>

                        </td>
                        <td className="py-2 px-2 min-w-36 w-36">
                            <select className='border border-gray-300 text-placeholder text-sm rounded-lg block w-full p-1.5 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-500' value={product.type_ammount} onChange={e => handleChangeTypeAmmount(e.target.value,product.id)}>
                                <option value="P. P. Cliente">P. P. Cliente</option>   
                                <option value="P. Distribuidor">P. Distribuidor</option>   
                            </select>
                        </td>
                        <td className="py-2 px-2 w-12">{<InputDetailsSm value={product.quantity} name="quantity" type="number" step="0.01" min="0" onChange={e => handleDetailChange(e.target.value, product.id, 'quantity')} onBlur={e => handleVerifNull(e.target.value, product.id, 'quantity')} />}</td>
                        <td className="py-2 px-2 max-w-8 w-14">{parseMoney(product.price_unit, formatMoney)}</td>
                        <td className="py-2 px-2 w-12">{<InputDetailsSm value={product.price_aditional} name="price_aditional" step="0.01" type="number" min="0" onChange={e => handleDetailChange(e.target.value, product.id, 'price_aditional')} onBlur={e => handleVerifNull(e.target.value, product.id, 'price_aditional')} />}</td>
                        <td className="py-2 px-2 max-w-8 w-6">{parseMoney(((parseFloat(product.price_aditional) || 0) + parseFloat(product.price_unit)) * product.quantity, formatMoney)}</td>
                        <td className="py-2 px-2 max-w-8 w-6">
                            <div className='flex gap-1 flex-wrap justify-center'>
                                <ButtonDangerSm text="Eliminar" onClick={e => handleDeleteDetail(product.id)} icon={<TrashIcon className='w-4 h-4' />} />
                            </div>
                        </td>
                    </tr>
                ))
            }
            <tr className="bg-white dark:bg-gray-800">
                <th colSpan={columns.length - 1} className='text-end'>SUBTOTAL</th>
                <td className="py-2 px-2 max-w-8 w-6">{parseMoney(dataTotal.amount, formatMoney)}</td>
            </tr>
            <tr className="bg-white dark:bg-gray-800">
                <th colSpan={columns.length - 1} className='text-end'>DESCUENTO</th>
                <td className="py-2 px-2 max-w-8 w-6"><InputDetailsSm value={dataTotal.discount || ""} name="quotation_discount" type="number" min="0" step="0.01" onChange={handleChangeDiscount} /></td>
            </tr>
            {
                includeIgv ? <tr className="bg-white dark:bg-gray-800">
                    <th colSpan={columns.length - 1} className='text-end'>I.G.V</th>
                    <td className="py-2 px-2 max-w-8 w-6">{parseMoney(dataTotal.igv, formatMoney)}</td>
                </tr> : null
            }
            <tr className="bg-white dark:bg-gray-800">
                <th colSpan={columns.length - 1} className='text-end'>TOTAL</th>
                <td className="py-2 px-2 max-w-8 w-6">{parseMoney(dataTotal.total, formatMoney)}</td>
            </tr>
        </TableIntranet>
    )
}

export default TableQuotation