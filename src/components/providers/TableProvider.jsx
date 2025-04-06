import React from 'react'
import TableIntranet from '../TableIntranet'
import { ButtonDangerSm, ButtonPrimarySm, ButtonSecondarySm } from '../Buttons'
import { HomeModernIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/solid'

function TableProvider({customers,getCustomer,deleteCustomer}) {
    const columns = [
        'Código',
        'Departamento',
        'Tipo documento',
        'Número documento',
        'Razón social / Nombres',
        'Usuario creador',
        'Acciones'
    ]
  return (
        <TableIntranet columns={columns}>
            {
                !customers.length ? <tr className="bg-white dark:bg-gray-800"><td colSpan="100%" className='text-center font-bold'>No se registraron clientes</td></tr> : customers.map(customer => (
                    <tr className="bg-white dark:bg-gray-800" key={customer.id}>
                        <td  className="py-2 px-4 text-center">{customer.id.toString().padStart(3,'0')}</td>
                        <td className="py-2 px-4">{customer.departament_name}</td>
                        <td className="py-2 px-4">{customer.document_name}</td>
                        <td className="py-2 px-4">{customer.provider_number_document}</td>
                        <td className="py-2 px-4">{customer.provider_name}</td>
                        <td className="py-2 px-4">{customer.user_creator}</td>
                        <td className="py-2 px-4">
                            <div className='flex gap-1 flex-wrap justify-center'>
                                <ButtonPrimarySm title="Editar" onClick={e=> getCustomer(customer.id)} icon={<PencilIcon className='w-4 h-4'/>}/>
                                <ButtonDangerSm title="Eliminar" onClick={e => deleteCustomer(customer.id)} icon={<TrashIcon className='w-4 h-4'/>}/>
                            </div>
                        </td>
                    </tr>
                ))
            }
        </TableIntranet>
  )
}

export default TableProvider
