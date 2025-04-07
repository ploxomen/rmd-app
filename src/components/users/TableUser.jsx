import React from 'react'
import TableIntranet from '../TableIntranet'
import { ButtonDangerSm, ButtonPrimarySm, ButtonSecondarySm } from '../Buttons'
import { HomeModernIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/solid'

const status = ["Eliminado","Activo","Por artivar"];
function TableUser({users,getUser,modelReset,deleteUser}) {
    const columns = [
        'Código',
        'Nombres y Apellidos',
        'Celular',
        'Correo',
        'Estado',
        'Acciones'
    ]

  return (
        <TableIntranet columns={columns}>
            {
                !users.length ? <tr className="bg-white dark:bg-gray-800"><td colSpan="100%" className='text-center font-bold'>No se registraron usuarios</td></tr> :
                users.map(user => (
                    <tr className="bg-white dark:bg-gray-800" key={user.id}>
                        <td  className="py-2 px-4 text-center">{user.id.toString().padStart(4,'0')}</td>
                        <td className="py-2 px-4">{user.user_name + ' ' +user.user_last_name}</td>
                        <td className="py-2 px-4">{user.user_cell_phone ? user.user_cell_phone : 'No establecido'}</td>
                        <td className="py-2 px-4">{user.user_email}</td>
                        <td className="py-2 px-4 text-blue-600 font-bold">{status[user.user_status]}</td>
                        <td className="py-2 px-4">
                            <div className='flex gap-1 flex-wrap justify-center'>
                                <ButtonPrimarySm text="Editar" onClick={e=>getUser(user.id)} icon={<PencilIcon className='w-4 h-4'/>}/>
                                <ButtonSecondarySm text="Resetear" onClick={e => modelReset(user.id)} icon={<HomeModernIcon className='w-4 h-4'/>}/>
                                <ButtonDangerSm text="Eliminar" onClick={e => deleteUser(user.id)} icon={<TrashIcon className='w-4 h-4'/>}/>
                            </div>
                        </td>
                    </tr>
                ))
            }
        </TableIntranet>
  )
}

export default TableUser