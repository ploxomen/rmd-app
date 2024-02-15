import React from 'react'
import TableIntranet from '../TableIntranet'
import { ButtonDangerSm } from '../Buttons'
import { TrashIcon } from '@heroicons/react/24/solid'
import { parseMoney } from '@/helpers/utilities'
import { InputDetailsSm } from '../Inputs'

function TableQuotation({products,formatMoney,handleDetailChange,handleDeleteDetail,dataTotal,includeIgv,handleChangeDiscount}) {
    const columns = [
        'Item',
        'Descripción',
        'Cant.',
        'P. Unit.',
        'P. Adic.',
        'Importe',
        'Eliminar'
    ]
  return (
    <TableIntranet columns={columns}>
        {
            !products.length ? <tr className="bg-white dark:bg-gray-800"><td colSpan="100%" className='text-center font-bold'>No se agregaron productos</td></tr> : products.map((product,key) => (
                <tr className="bg-white dark:bg-gray-800" key={product.id}>
                    <td className="py-2 px-2 max-w-3 w-3 text-center">{key + 1}</td>
                    <td className="py-2 px-2">{product.description}</td>
                    <td className="py-2 px-2 w-12">{<InputDetailsSm value={product.quantity} name="quantity" type="number" min="0" onChange={ e => handleDetailChange(e.target.value,product.id,'quantity')}/>}</td>
                    <td className="py-2 px-2 max-w-8 w-14">{parseMoney(product.price_unit,formatMoney)}</td>
                    <td className="py-2 px-2 w-12">{<InputDetailsSm value={product.price_aditional} name="price_aditional" step="0.01" type="number" min="0" onChange={ e => handleDetailChange(e.target.value,product.id,'price_aditional')}/>}</td>
                    <td className="py-2 px-2 max-w-8 w-6">{parseMoney((parseFloat(product.price_aditional) + parseFloat(product.price_unit)) * product.quantity,formatMoney)}</td>
                    <td className="py-2 px-2 max-w-8 w-6">
                        <div className='flex gap-1 flex-wrap justify-center'>
                            <ButtonDangerSm text="Eliminar" onClick={e => handleDeleteDetail(product.id)} icon={<TrashIcon className='w-4 h-4'/>}/>
                        </div>
                    </td>
                </tr>
            ))
        }
        <tr className="bg-white dark:bg-gray-800">
            <th colSpan={6} className='text-end'>SUBTOTAL</th>
            <td className="py-2 px-2 max-w-8 w-6">{parseMoney(dataTotal.amount,formatMoney)}</td>
        </tr>
        <tr className="bg-white dark:bg-gray-800">
            <th colSpan={6} className='text-end'>DESCUENTO</th>
            <td className="py-2 px-2 max-w-8 w-6"><InputDetailsSm value={dataTotal.discount||""} name="quotation_discount" type="number" min="0" step="0.01" onChange={handleChangeDiscount}/></td>
        </tr>
        {
            includeIgv ? <tr className="bg-white dark:bg-gray-800">
                <th colSpan={6} className='text-end'>I.G.V</th>
                <td className="py-2 px-2 max-w-8 w-6">{parseMoney(dataTotal.igv,formatMoney)}</td>
            </tr> : null
        }
        <tr className="bg-white dark:bg-gray-800">
            <th colSpan={6} className='text-end'>TOTAL</th>
            <td className="py-2 px-2 max-w-8 w-6">{parseMoney(dataTotal.total,formatMoney)}</td>
        </tr>
    </TableIntranet>
  )
}

export default TableQuotation