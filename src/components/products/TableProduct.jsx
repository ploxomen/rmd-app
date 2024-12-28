import React from 'react'
import TableIntranet from '../TableIntranet'
import { ButtonDangerSm, ButtonPrimarySm } from '../Buttons'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid'
import { parseMoney } from '@/helpers/utilities'

function TableProduct({products,getProduct,deleteProduct}) {
    const columns = [
        'Código',
        'Producto',
        'Categoría',
        'Subcategoría',
        'P. Producción',
        'P. P. Cliente',
        'P. Distribuidor',
        'Almacen',
        'Sub Almacen',
        'Acciones'
    ]
  return (
        <TableIntranet columns={columns}>
            {
                !products.length ? <tr className="bg-white dark:bg-gray-800"><td colSpan="100%" className='text-center font-bold'>No se registraron productos</td></tr> : products.map(product => (
                    <tr className="bg-white dark:bg-gray-800" key={product.id}>
                        <td  className="py-2 px-4 text-center">{product.product_code.toString().padStart(3,'0')}</td>
                        <td className="py-2 px-4">{product.product_name}</td>
                        <td className="py-2 px-4">{product.categorie_name}</td>
                        <td className="py-2 px-4">{product.sub_categorie_name}</td>
                        <td className="py-2 px-4">{parseMoney(product.product_buy,'PEN')}</td>
                        <td className="py-2 px-4">{parseMoney(product.product_public_customer,'PEN')}</td>
                        <td className="py-2 px-4">{parseMoney(product.product_distributor,'PEN')}</td>
                        <td className="py-2 px-4">{product.store_name}</td>
                        <td className="py-2 px-4">{product.store_sub_name}</td>
                        <td className="py-2 px-4">
                            <div className='flex gap-1 flex-wrap justify-center'>
                                <ButtonPrimarySm text="Editar" onClick={e=> getProduct(product.id)} icon={<PencilIcon className='w-4 h-4'/>}/>
                                <ButtonDangerSm text="Eliminar" onClick={e => deleteProduct(product.id)} icon={<TrashIcon className='w-4 h-4'/>}/>
                            </div>
                        </td>
                    </tr>
                ))
            }
        </TableIntranet>
  )
}

export default TableProduct
