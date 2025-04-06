import '@/app/globals.css';
import apiAxios from '@/axios';
import BanerModule from '@/components/BanerModule';
import { ButtonPrimary } from '@/components/Buttons';
import { InputPrimary } from '@/components/Inputs';
import LoyoutIntranet from '@/components/LoyoutIntranet';
import PaginationTable from '@/components/PaginationTable';
import TableReport from '@/components/quotations/TableReport';
import { SelectPrimary } from '@/components/Selects';
import { getCookie } from '@/helpers/getCookie';
import { statusQuotations } from '@/helpers/statusQuotations';
import { verifUser } from '@/helpers/verifUser';
import { DocumentArrowDownIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
export async function getServerSideProps(context) {
    const userCookie = context.req.cookies;
    return await verifUser(userCookie,'/quotation/report');
}
const quantityRowData = 25;
function Report({dataUser,dataModules,dataRoles}) {
    const headers = getCookie();
    const route = useRouter();
    let date = new Date();
    date.setMonth(-3);
    const [quotations,setQuotations] = useState([]);
    const [pagination,setPagination] = useState({quantityRowData,totalPages:0});
    const [dataChange,setDataChange] = useState({
        current:1,
        search:"",
        type:"data",
        reload:false,
        filter_initial:date.toISOString().split('T')[0],
        filter_final:new Date().toISOString().split('T')[0],
        order: 0
    });

    const handleFilter = (e) => {
        setDataChange({
            ...dataChange,
            type:"data",
            [e.target.name] : e.target.value
        })
    }
    useEffect(()=>{
        const getData = async () => {
            try {
                const resp = await apiAxios.get('/quotation-extra/report',{
                    params: {
                        show:pagination.quantityRowData,
                        page:dataChange.current,
                        typeInformation:dataChange.type,
                        startDate:dataChange.filter_initial,
                        finalDate:dataChange.filter_final,
                        order: dataChange.order
                    },
                    responseType:dataChange.type == "data" ? 'json' : 'blob',
                    headers
                });
                if(dataChange.type == "data" && resp.data.redirect !== null){
                    return route.replace(resp.data.redirect);
                }
                if(dataChange.type == "data" && resp.data.error){
                    return sweetAlert({title : "Alerta", text: resp.data.message, icon : "warning"});
                }
                if(dataChange.type == "excel"){
                    const url = window.URL.createObjectURL(new Blob([resp.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', 'cotizaciones_reporte.xlsx');
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    return
                }
                setPagination({
                    ...pagination,
                    totalPages:resp.data.totalQuotations
                })
                setQuotations(resp.data.data);
            } catch (error) {
                console.log(error);
                sweetAlert({title : "Error", text: "Error al obtener las cotizaciones", icon : "error"});
            }
        }
        getData();
    },[dataChange])
    const handleChangePage = (number)=>{
        if(!number){
            return
        }
        setDataChange({...dataChange,current:number});
    }
    const handleDownloadExcel = () =>{
        setDataChange({
            ...dataChange,
            type:"excel"
        })
    }
  return (
    <LoyoutIntranet title="Reporte cotización" description="Reportes de cotizaciones" user={dataUser} modules={dataModules} roles={dataRoles}>
        <BanerModule imageBanner='/baners/Group 14.jpg' title="Reporte cotización"/>
        <div className='w-full p-6 bg-white rounded-md shadow mb-4'>
            <div className="flex flex-auto flex-wrap gap-x-2">
                <div className='max-w-48'>
                    <InputPrimary type='date' value={dataChange.filter_initial} name="filter_initial" label="Fecha inicio" onChange={handleFilter}/>
                </div>
                <div className='max-w-48'>
                    <InputPrimary type='date' value={dataChange.filter_final} name="filter_final" label="Fecha final" onChange={handleFilter}/>
                </div>
                <div className='max-w-52 w-full'>
                    <SelectPrimary label="Pedido" name="order" value={dataChange.order || ''} onChange={handleFilter}>
                        <option value="0">Sin excepción</option>
                        <option value="1">Con pedido</option>
                        <option value="2">Sin pedido</option>
                    </SelectPrimary>
                </div>
            </div>
        </div>
        <div className='w-full p-6 bg-white rounded-md shadow overflow-x-auto'>
            <ButtonPrimary text="Exportar" icon={<DocumentArrowDownIcon className='w-5 h-5'/>} onClick={handleDownloadExcel}/>
            <TableReport quotations={quotations} status={statusQuotations}/>
            <PaginationTable currentPage={dataChange.current} quantityRow={pagination.quantityRowData} totalData={pagination.totalPages} handleChangePage={handleChangePage}/>
        </div>
    </LoyoutIntranet>
  )
}

export default Report