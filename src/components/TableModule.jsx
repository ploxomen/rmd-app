import React from 'react'
import { ButtonPrimarySm } from './Buttons'
import TableIntranet from './TableIntranet'
import { PencilIcon } from '@heroicons/react/24/solid'

function TableModule({modules,getRoles}) {
    const columns = [
        "Código",
        "Nombre",
        "Descripción",
        "Acciones"
    ]
    return (
        <TableIntranet columns={columns}>
            {
                modules.map(module => (
                    <tr className="bg-white dark:bg-gray-800" key={module.id}>
                        <td  className="py-2 px-4 text-center">{module.id.toString().padStart(2,'0')}</td>
                        <td className="py-2 px-4">{module.module_title}</td>
                        <td className="py-2 px-4">{module.module_description ? module.module_description : 'No establecido'}</td>
                        <td className="py-2 px-4">
                            <div className='flex gap-1 flex-wrap justify-center'>
                                <ButtonPrimarySm text="Editar" onClick={e => getRoles(module.id)} icon={<PencilIcon className='w-4 h-4'/>}/>
                            </div>
                        </td>
                    </tr>
                ))
            }
        </TableIntranet>
  )
}

export default TableModule