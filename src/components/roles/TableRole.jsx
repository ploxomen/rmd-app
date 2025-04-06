import React from 'react'
import TableIntranet from '../TableIntranet'
import { ButtonDangerSm, ButtonPrimarySm, ButtonSecondarySm } from '../Buttons'
import { HomeModernIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/solid'

function TableRole({roles,setDataToEdit,getModules,deleteRole}) {
    const columns = [
        'Código',
        'Nombre',
        'Acciones'
    ]

  return (
        <TableIntranet columns={columns}>
            {
                roles.map(role => (
                    <tr className="bg-white dark:bg-gray-800" key={role.id}>
                        <td  className="py-2 px-4 text-center">{role.id.toString().padStart(2,'0')}</td>
                        <td className="py-2 px-4">{role.rol_name}</td>
                        <td className="py-2 px-4">
                            <div className='flex gap-1 flex-wrap justify-center'>
                                <ButtonPrimarySm text="Editar" onClick={e=>setDataToEdit(role)} icon={<PencilIcon className='w-4 h-4'/>}/>
                                <ButtonSecondarySm text="Modulos" onClick={e => getModules(role.id)} icon={<HomeModernIcon className='w-4 h-4'/>}/>
                                <ButtonDangerSm text="Eliminar" onClick={e => deleteRole(role.id)} icon={<TrashIcon className='w-4 h-4'/>}/>
                            </div>
                        </td>
                    </tr>
                ))
            }
        </TableIntranet>
  )
}

export default TableRole
