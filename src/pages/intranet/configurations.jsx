import '@/app/globals.css';
import apiAxios from '@/axios';
import BanerModule from '@/components/BanerModule';
import { ButtonPrimary } from '@/components/Buttons';
import EditorText from '@/components/EditorText';
import { InputPrimary, TextareaPrimary } from '@/components/Inputs';
import LoyoutIntranet from '@/components/LoyoutIntranet';
import SeccionForm from '@/components/SeccionForm';
import { sweetAlert } from '@/helpers/getAlert';
import { getCookie } from '@/helpers/getCookie';
import { verifUser } from '@/helpers/verifUser';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
export async function getServerSideProps(context) {
    const userCookie = context.req.cookies;
    return await verifUser(userCookie,'/configurations');
}
const initialForm = {
    business_name:"",
    business_ruc:"",
    business_address:"",
    business_cell_phone:"",
    business_phone:"",
    business_email:"",
    business_page:"",
    business_bank:""
}
function Configurations({dataRoles,dataUser,dataModules}) {
    const [form,setForm] = useState(initialForm);
    const eidtorRefBanks = useRef();
    const editorConditions = useRef();
    const attentionHours = useRef();
    const editorObservations = useRef();
    const editorRefWarrantyColumn1 = useRef(null);
    const editorRefWarrantyColumn2 = useRef(null);
    const route = useRouter();
    const headers = getCookie();
    useEffect(() => {
        const getData = async () => {
            try {
                const resp = await apiAxios.get('/my-business',{headers})
                if(resp.data.redirect !== null){
                    return route.replace(resp.data.redirect);
                }
                const configuration = resp.data.data;
                const dataReplace = {};
                configuration.forEach(config => {
                    dataReplace[config.description] = config.value;
                });
                setForm({
                    ...dataReplace
                })
            } catch (error) {
                console.error(error)
                sweetAlert({title : "Error", text: "Ocurrió un error al obtener los datos del negocio", icon : "error"});
            }
        }
        getData()
    },[])
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const resp = await apiAxios.put('/my-business',{...form,
                business_bank:eidtorRefBanks.current.getContent(),
                quotation_conditions:editorConditions.current.getContent(),
                quotation_observations:editorObservations.current.getContent(),
                attention_hours: attentionHours.current.getContent(),
                quotation_warranty_1: editorRefWarrantyColumn1.current.getContent(),
                quotation_warranty_2: editorRefWarrantyColumn2.current.getContent(),
            },{headers});
            if(resp.data.redirect !== null){
                return route.replace(resp.data.redirect);
            }
            if(resp.data.error){
                resp.data.data.forEach(error => {
                    sweetAlert({title : "Alerta", text: error, icon : "warning"});
                });
                return
            }
            sweetAlert({title : "Exitoso", text: resp.data.message, icon : "success"});
        } catch (error) {
            console.error(error)
            sweetAlert({title : "Error", text: "Ocurrió un error al actualizar los datos del negocio", icon : "error"});
        }
    }
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name] : e.target.value
        })
    }
  return (
    <LoyoutIntranet title="Mi negocio" description="Configuración de mi intranet" user={dataUser} modules={dataModules} roles={dataRoles}>
        <BanerModule imageBanner='/baners/Group 11.jpg' title="Configuración de mi negocio"/>
        <form id='form-quotation' onSubmit={handleSubmit}>
            <div className='w-full p-6 mb-4 bg-white rounded-md shadow grid grid-cols-12 gap-x-3 gap-y-0'>
                <div className="col-span-full">
                    <SeccionForm title="Datos de la empresa"/>
                </div>
                <div className="col-span-full md:col-span-6 lg:col-span-2">
                    <InputPrimary label="RUC" type='text' inputRequired='required' name="business_ruc" value={form.business_ruc||''} onChange={handleChange}/>
                </div>
                <div className="col-span-full md:col-span-6 lg:col-span-10">
                    <InputPrimary label="Razon social" name="business_name" type='text' inputRequired='required' value={form.business_name||''} onChange={handleChange}/>
                </div>
                <div className="col-span-full md:col-span-6 lg:col-span-6">
                    <InputPrimary label="Cel." name="business_cell_phone" type='text' value={form.business_cell_phone||''} onChange={handleChange}/>
                </div>
                <div className="col-span-full md:col-span-6 lg:col-span-6">
                    <InputPrimary label="Correo" name="business_email" type='text' value={form.business_email||''} onChange={handleChange}/>
                </div>
                <div className="col-span-full">
                    <InputPrimary label="Dirección" inputRequired='required' name="business_address" type='text' value={form.business_address||''} onChange={handleChange}/>
                </div>
                <div className="col-span-full">
                    <TextareaPrimary name="business_page" label="Páginas" value={form.business_page||''} onChange={handleChange}/>
                </div>
            </div>
            <div className='w-full p-6 mb-4 bg-white rounded-md shadow grid grid-cols-12 gap-x-3 gap-y-0'>
                <div className="col-span-full">
                    <SeccionForm title="Datos adicionales"/>
                </div>
                <div className="col-span-full mb-2">
                    <EditorText label="Datos bancarios" initialValue={form.business_bank} id="configuration_bank" editorRef={eidtorRefBanks}/>
                </div>
                <div className="col-span-full mb-2">
                    <EditorText label="Garantía - Primera columna" initialValue={form.quotation_warranty_1} id="quotation_warranty_1" editorRef={editorRefWarrantyColumn1}/>
                </div>
                <div className="col-span-full mb-2">
                    <EditorText label="Garantía - Segunda columna" initialValue={form.quotation_warranty_2} id="quotation_warranty_2" editorRef={editorRefWarrantyColumn2}/>
                </div>
                <div className="col-span-full mb-2">
                    <EditorText label="Cotización observaciones" initialValue={form.quotation_observations} id="configuration_observations" editorRef={editorObservations}/>
                </div>
                <div className="col-span-full mb-2">
                    <EditorText label="Cotización condiciones" initialValue={form.quotation_conditions} id="configurations_conditions" editorRef={editorConditions}/>
                </div>
                <div className="col-span-full mb-2">
                    <EditorText label="Horarios de atención" initialValue={form.attention_hours} id="attention_hours" editorRef={attentionHours}/>
                </div>
                <div className="col-span-full text-center">
                    <ButtonPrimary text="Guardar" type='submit' icon={<PaperAirplaneIcon className='w-5 h-5'/>}/>
                </div>
            </div> 
            
        </form>
    </LoyoutIntranet> 
  )
}

export default Configurations