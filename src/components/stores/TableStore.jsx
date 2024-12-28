import React from 'react'
import TableIntranet from '../TableIntranet'
import { ButtonDangerSm, ButtonPrimarySm } from '../Buttons'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid'
import Badge from '../Badge'
function TableStore({stores,getStore,deleteStore}) {
    const columns = [
        'Código',
        'Almacen',
        'Descripción',
        'Sub almacenes',
        'Acciones'
    ]
  return (
    <TableIntranet columns={columns}>
        {
                !stores.length ? <tr className="bg-white dark:bg-gray-800"><td colSpan="100%" className='text-center font-bold'>No se registraron almacenes</td></tr> : stores.map(store => (
                    <tr className="bg-white dark:bg-gray-800" key={store.id}>
                        <td  className="py-2 px-4 text-center">{store.id.toString().padStart(3,'0')}</td>
                        <td className="py-2 px-4">{store.store_name}</td>
                        <td className="py-2 px-4">{store.store_description}</td>
                        <td className="py-2 px-4">
                            <div className='flex gap-1 flex-wrap'>
                                {
                                    JSON.parse(store.substores).map(element => <Badge colors='bg-green-100 text-green-800 text-xs' text={element.name} key={element.id}/>)                            
                                }
                            </div>
                        </td>
                        <td className="py-2 px-4">
                            <div className='flex gap-1 flex-wrap justify-center'>
                                <ButtonPrimarySm text="Editar" onClick={e=> getStore(store.id)} icon={<PencilIcon className='w-4 h-4'/>}/>
                                <ButtonDangerSm text="Eliminar" onClick={e => deleteStore(store.id)} icon={<TrashIcon className='w-4 h-4'/>}/>
                            </div>
                        </td>
                    </tr>
                ))
            }
    </TableIntranet>
  )
}

export default TableStore