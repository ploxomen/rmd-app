import React from 'react'
import TableIntranet from '../TableIntranet'
import { ButtonDangerSm, ButtonPrimarySm, ButtonSecondarySm } from '../Buttons'
import { HomeModernIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/solid'

function TableCustomer({customers,getCustomer,deleteCustomer}) {
    const columns = [
        'Código',
        'Tipo documento',
        'Número documento',
        'Razón social / Nombres',
        'Celular',
        'Correo',
        'Acciones'
    ]
  return (
        <TableIntranet columns={columns}>
            {
                !customers.length ? <tr className="bg-white dark:bg-gray-800"><td colSpan="100%" className='text-center font-bold'>No se registraron clientes</td></tr> : customers.map(customer => (
                    <tr className="bg-white dark:bg-gray-800" key={customer.id}>
                        <td  className="py-2 px-4 text-center">{customer.id.toString().padStart(3,'0')}</td>
                        <td className="py-2 px-4">{customer.name_document}</td>
                        <td className="py-2 px-4">{customer.customer_number_document}</td>
                        <td className="py-2 px-4">{customer.customer_name}</td>
                        <td className="py-2 px-4">{customer.customer_cell_phone}</td>
                        <td className="py-2 px-4">{customer.customer_email}</td>
                        <td className="py-2 px-4">
                            <div className='flex gap-1 flex-wrap justify-center'>
                                <ButtonPrimarySm text="Editar" onClick={e=> getCustomer(customer.id)} icon={<PencilIcon className='w-4 h-4'/>}/>
                                <ButtonDangerSm text="Eliminar" onClick={e => deleteCustomer(customer.id)} icon={<TrashIcon className='w-4 h-4'/>}/>
                            </div>
                        </td>
                    </tr>
                ))
            }
        </TableIntranet>
  )
}

export default TableCustomer
