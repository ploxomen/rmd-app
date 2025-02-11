import React from 'react'
import TableIntranet from '../TableIntranet'
import { parseMoney } from '@/helpers/utilities'
import { ButtonDangerSm, ButtonLight, ButtonPrimarySm } from '../Buttons'
import { ArrowDownTrayIcon, EllipsisVerticalIcon, EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/solid'
import { Dropdown } from '../Dropdown'
import Link from 'next/link'
import { sweetAlert } from '@/helpers/getAlert'
import apiAxios from '@/axios'
import { getCookie } from '@/helpers/getCookie'

function TableOrderAll({ orders, deleteOrder, getOrder, status }) {
    const columns = [
        'Código',
        'Fecha pedido',
        'Fecha entrega',
        'Cliente',
        'Subcategoría',
        'Subtotal',
        'IGV',
        'Total',
        'Responsable',
        'Estado',
        'Acciones'
    ]
    const downloadFileOs = async (idOrder, fileName) => {
        const headers = getCookie();
        try {
            const response = await apiAxios.get(`order-extra/download-os/${idOrder}`, {
                responseType: 'blob',
                headers
            })
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            if(error.response.status === 404){
                sweetAlert({ title: "Error", text: 'El archivo de la OS no fue encontrado', icon: "error" });
            }
            console.error('Error al descargar el archivo:', error);
        }
    };

    const downloadPdf = async (id, fileName) => {
        const headers = getCookie();
        try {
            const resp = await apiAxios.get('order-extra/download/' + id, {
                responseType: 'blob',
                headers
            })
            const url = window.URL.createObjectURL(new Blob([resp.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            return
        } catch (error) {
            console.log(error);
            sweetAlert({ title: "Error", text: 'Error al descargar el pedido', icon: "error" });
        }
    }
    return (
        <TableIntranet columns={columns}>
            {
                !orders.length ? <tr className="bg-white dark:bg-gray-800"><td colSpan="100%" className='text-center font-bold'>No se encontraron pedidos</td></tr> : orders.map(order => (
                    <tr className="bg-white dark:bg-gray-800" key={order.id}>
                        <td className="p-1 text-center">{order.order_code}</td>
                        <td className="p-1 text-center">{order.date_created}</td>
                        <td className="p-1 text-center">{order.date_issue}</td>
                        <td className="p-1">{order.customer_name}</td>
                        <td className="p-1 text-center">{order.sub_categorie_name}</td>
                        <td className="p-1">{parseMoney(order.order_mount, order.order_money)}</td>
                        <td className="p-1">{parseMoney(order.order_mount_igv, order.order_money)}</td>
                        <td className="p-1">{parseMoney(order.order_total, order.order_money)}</td>
                        <td className="p-1">{order.responsable_usuario}</td>
                        <td className="p-1">{status[order.order_status].element}</td>
                        <td className="p-1 text-center">
                            {
                                order.order_status > 0 ? <div className='flex gap-1 flex-wrap justify-center'>
                                    <ButtonPrimarySm title="Editar" onClick={e => getOrder(order.id)} icon={<PencilIcon className='w-4 h-4' />} />
                                    <ButtonDangerSm title="Descargar PDF" icon={<ArrowDownTrayIcon className='w-4 h-4' />} onClick={e => downloadPdf(order.id, `${order.order_code}_${order.customer_name.replace(/ /g, '_').toUpperCase()}.pdf`)} />
                                    <Dropdown Button={
                                        <ButtonLight icon={<EllipsisVerticalIcon className='w-4 h-4' />} />
                                    } options={[
                                        <Link href={{
                                            pathname: '/intranet/order/view/' + order.id,
                                            query: {
                                                fileName: `${order.order_code}_${order.customer_name.replace(/ /g, '_').toUpperCase()}.pdf`
                                            }
                                        }} target='_blank' className='block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-left'>
                                            Ver PDF
                                        </Link>,
                                        <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={e => downloadFileOs(order.id, order.order_file_name)}>Descargar OS</button>,
                                        <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={e => deleteOrder(order.id)}>Anular</button>
                                    ]} />
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