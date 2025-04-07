import React from 'react'
import TableIntranet from '../TableIntranet'
import { ButtonDangerSm, ButtonPrimarySm } from '../Buttons'
import { HomeModernIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/solid'

function TableCategorie({categories,getCategorie,deleteCategorie}) {
    const columns = [
        'Código',
        'Nombre',
        'Cantidad de subcategorías',
        'Acciones'
    ]
  return (
        <TableIntranet columns={columns}>
            {
                !categories.length ? <tr className="bg-white dark:bg-gray-800"><td colSpan="100%" className='text-center font-bold'>No se registraron categorías</td></tr> : categories.map(categorie => (
                    <tr className="bg-white dark:bg-gray-800" key={categorie.id}>
                        <td  className="py-2 px-4 text-center">{categorie.id.toString().padStart(3,'0')}</td>
                        <td className="py-2 px-4">{categorie.categorie_name}</td>
                        <td className="py-2 px-4 text-center">{categorie.subcategorie_quantity}</td>
                        <td className="py-2 px-4">
                            <div className='flex gap-1 flex-wrap justify-center'>
                                <ButtonPrimarySm text="Editar" onClick={e=> getCategorie(categorie.id)} icon={<PencilIcon className='w-4 h-4'/>}/>
                                <ButtonDangerSm text="Eliminar" onClick={e => deleteCategorie(categorie.id)} icon={<TrashIcon className='w-4 h-4'/>}/>
                            </div>
                        </td>
                    </tr>
                ))
            }
        </TableIntranet>
  )
}

export default TableCategorie
