import React from 'react'
import TableIntranet from '../TableIntranet'
import { parseMoney } from '@/helpers/utilities'
import { ButtonDangerSm, ButtonPrimarySm } from '../Buttons'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid'

function TableOrderAll({orders,deleteOrder,getOrder,status}) {
    const columns = [
        'Código',
        'Fecha',
        'Cliente',
        'Subtotal',
        'IGV',
        'Total',
        'Estado',
        'Acciones'
    ]
    return (
        <TableIntranet columns={columns}>
            {
                !orders.length ? <tr className="bg-white dark:bg-gray-800"><td colSpan="100%" className='text-center font-bold'>No se encontraron pedidos</td></tr> : orders.map(order => (
                    <tr className="bg-white dark:bg-gray-800" key={order.id}>
                        <td className="py-2 px-4">{order.id.toString().padStart(5,'0')}</td>
                        <td className="py-2 px-4">{order.date_issue}</td>
                        <td className="py-2 px-4">{order.customer_name}</td>
                        <td className="py-2 px-4">{parseMoney(order.order_mount,order.order_money)}</td>
                        <td className="py-2 px-4">{parseMoney(order.order_mount_igv,order.order_money)}</td>
                        <td className="py-2 px-4">{parseMoney(order.order_total,order.order_money)}</td>
                        <td className="py-2 px-4">{status[order.order_status].element}</td>
                        <td className="py-2 px-4">
                            {
                                order.order_status > 0 ? <div className='flex gap-1 flex-wrap justify-center'>
                                    <ButtonPrimarySm text="Editar" onClick={e=> getOrder(order.id)} icon={<PencilIcon className='w-4 h-4'/>}/>
                                    <ButtonDangerSm text="Eliminar" onClick={e => deleteOrder(order.id)} icon={<TrashIcon className='w-4 h-4'/>}/>
                                </div> : <strong className='text-red-500'>Sin acciones</strong>
                            }
                            
                        </td>
                    </tr>
                ))
            }
        </TableIntranet>
  )
}

export default TableOrderAll