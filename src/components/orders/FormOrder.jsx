import React, { useEffect, useRef, useState } from 'react'
import { InputPrimary, SubmitForm } from '../Inputs';
import SeccionForm from '../SeccionForm';
import { SelectPrimary } from '../Selects';
import Modal from '../Modal';
import TableOrderEdit from './TableOrderEdit';
import { sweetAlert } from '@/helpers/getAlert';
import apiAxios from '@/axios';
import { getCookie } from '@/helpers/getCookie';
import { useRouter } from 'next/navigation';
import Select from 'react-select';
import { getProvinces } from '@/helpers/getProvinces';
import { getDistrics } from '@/helpers/getDistrics';
import { ButtonPrimary, ButtonSecondarySm } from '../Buttons';
import { ArrowPathIcon } from '@heroicons/react/24/solid';

const initalForm = {
    id: null,
    customer_id: "",
    order_address: 0,
    order_conditions_delivery: "",
    order_conditions_pay: "",
    order_contact_email: "",
    order_contact_name: "",
    order_contact_telephone: "",
    order_date_issue: "",
    order_departament: "",
    order_district: "",
    order_file_name: "",
    order_igv: "",
    order_money: "",
    order_project: "",
    order_province: "",
    order_status: "",
    quotations_total: 0,
    order_file_update: ""
}

function FormOrder({ statusModal, orderEdit, quotationsNew, departaments, districsAll, provincesAll, customers, quotationsEdit, handleCloseModal, handleSaveModalClose }) {
    const [form, setForm] = useState({});
    const [quotations, setQuotations] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [quotationsNews, setQuotationsNew] = useState([]);
    const refUploadFile = useRef(null);
    const route = useRouter();
    const headers = getCookie();
    const disabledEdit = quotations.length > 0;
    const { id, customer_id, order_igv, order_money, order_project, order_contact_email, order_contact_name, order_contact_telephone } = form;

    useEffect(() => {
        setForm(Object.keys(orderEdit).length ? orderEdit : initalForm);
    }, [orderEdit])
    useEffect(() => {
        setProvinces(provincesAll);
        setDistricts(districsAll);
        setQuotationsNew(quotationsNew);
    }, [provincesAll, districsAll, quotationsNew])
    useEffect(() => {
        setQuotations(quotationsEdit.length ? quotationsEdit : []);
    }, [quotationsEdit])
    const handleDeleteQuotation = async (idQuotation) => {
        try {
            const response = await apiAxios.put('order-extra/delete-quotation/' + idQuotation, { 'orderId': form.id }, { headers })
            setQuotations(
                quotations.filter(quotation => quotation.id !== idQuotation)
            )
            setQuotationsNew(quotationsNewFunction => [...quotationsNewFunction, response.data.data])
        } catch (error) {
            console.error(error);
            return sweetAlert({ title: "Error", text: "Error al eliminar la cotización", icon: "error" });;
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        // Recorrer el objeto form y añadir dinámicamente los campos de texto
        Object.keys(form).forEach((key) => {
            if (key !== 'order_file_update') {
                formData.append(key, form[key]);
            }
        });
        // Añadimos el archivo a FormData si existe
        if (form.order_file_update) {
            formData.append('order_file_update', form.order_file_update);
        }
        formData.append('_method', 'put');
        try {
            const resp = await apiAxios.post('order/' + form.id, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    ...headers
                }
            })
            if (resp.data.redirect !== null) {
                return route.replace(resp.data.redirect);
            }
            if (resp.data.error) {
                resp.data.data.forEach(error => {
                    sweetAlert({ title: "Alerta", text: error, icon: "warning" });
                });
                return
            }
            sweetAlert({ title: "Mensaje", text: resp.data.message, icon: "success" });
            handleSaveModalClose();
        } catch (error) {
            console.error(error);
            sweetAlert({ title: "Mensaje", text: 'Error al actualizar el pedido', icon: "error" });
        }
    }
    const handleSaveModal = () => {
        const formOrder = document.querySelector("#form-order-submit");
        formOrder.click();
    }
    const handleDepartaments = async (e) => {
        handleForm(e);
        setProvinces(await getProvinces(e.target.value));
    }
    const handleForm = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }
    const handleProvinces = async (e) => {
        handleForm(e);
        setDistricts(await getDistrics(e.target.value));
    }
    const handleUploadFile = (e) => {
        setForm({
            ...form,
            order_file_update: e.target.files.length ? e.target.files[0] : null
        })
    }
    const handleAddQuotation = async (e) => {
        try {
            const resp = await apiAxios.put('order-extra/add-quotation/' + e.value, {
                id,
                customer_id,
                order_igv,
                order_money,
                order_project,
                order_contact_email,
                order_contact_name,
                order_contact_telephone
            }, { headers })
            if (resp.data.alert) {
                return sweetAlert({ title: "Alerta", text: resp.data.message, icon: "warning" });
            }
            setQuotations([
                ...quotations,
                resp.data.data
            ])
            setQuotationsNew(
                quotationsNews.filter(quotation => quotation.value !== e.value)
            )
        } catch (error) {
            console.error(error);
            return sweetAlert({ title: "Error", text: "Error al agregar la cotización", icon: "error" });;
        }
    }
    const handleUpdateQuotationsNew = async () => {
        try {
            const response = await apiAxios.get('order-extra/reload-quotations', {
                headers,
                params: {
                    customer_id,
                    order_igv,
                    order_money,
                    order_project,
                    order_contact_email,
                    order_contact_name,
                    order_contact_telephone
                }
            })
            setQuotationsNew(response.data.data);
        } catch (error) {
            console.error(error);
            return sweetAlert({ title: "Error", text: "Error al actualizar las cotizaciones disponibles", icon: "error" });;
        }
    }
    const handleClickUpload = () => {
        refUploadFile.current.click();
    }
    return (
        <Modal status={statusModal} title="Editar Pedido" onSave={handleSaveModal} handleCloseModal={handleCloseModal} maxWidth='max-w-3xl'>
            <form className='grid grid-cols-12 gap-x-2' onSubmit={handleSubmit}>
                <div className="col-span-full">
                    <SeccionForm title="Datos de la cotizacion" />
                </div>
                <div className="col-span-full md:col-span-6">
                    <SelectPrimary label="Tipo moneda" disabled={disabledEdit} inputRequired='required' name="money" value={form.order_money} onChange={e => !disabledEdit && handleForm(e)}>
                        <option value="PEN">Soles (S/)</option>
                        <option value="USD">Dolares ($)</option>
                    </SelectPrimary>
                </div>
                <div className="col-span-full md:col-span-6">
                    <SelectPrimary label="Incluir I.G.V" disabled={disabledEdit} inputRequired='required' name="includeIgv" value={form.order_igv} onChange={e => !disabledEdit && handleForm(e)}>
                        <option value="1">SI</option>
                        <option value="0">NO</option>
                    </SelectPrimary>
                </div>
                <div className="col-span-full md:col-span-6">
                    <InputPrimary label="Nombre proyecto" inputRequired='required' name="order_project" value={form.order_project} onChange={e => !disabledEdit && handleForm(e)} disabled={disabledEdit} />
                </div>
                <div className="col-span-full">
                    <SeccionForm title="Datos del cliente" />
                </div>
                <div className="col-span-full md:col-span-6">
                    <label htmlFor="customer" className="text-placeholder text-sm mb-1 block dark:text-white">Cliente<span className="text-red-500 font-bold pl-1">*</span></label>
                    <Select instanceId='customer' isDisabled={disabledEdit} placeholder="Seleccione un cliente" name='customer' options={customers} menuPosition='fixed' value={customers.filter(customer => customer.value === form.customer_id)} />
                </div>
                <div className="col-span-full md:col-span-6">
                    <InputPrimary label="Nombre contacto" inputRequired='required' name="order_contact_name" value={form.order_contact_name} onChange={e => !disabledEdit && handleForm(e)} disabled={disabledEdit} />
                </div>
                <div className="col-span-full md:col-span-6">
                    <InputPrimary label="Email contacto" inputRequired='required' name="order_contact_email" value={form.order_contact_email} onChange={e => !disabledEdit && handleForm(e)} disabled={disabledEdit} />
                </div>
                <div className="col-span-full md:col-span-6">
                    <InputPrimary label="Telef. contacto" inputRequired='required' name="order_contact_telephone" value={form.order_contact_telephone} onChange={e => !disabledEdit && handleForm(e)} disabled={disabledEdit} />
                </div>
                <div className="col-span-full">
                    <SeccionForm title="Cotizaciones para agregar" />
                </div>
                <div className="col-span-full mb-2">
                    <div className='flex gap-2'>
                        <div className='w-full'>
                            <Select instanceId='quotationsNew' value='' placeholder="Seleccione una cotización" name='quotations_new' options={quotationsNews} menuPosition='fixed' onChange={handleAddQuotation} />
                        </div>
                        <ButtonSecondarySm title="Actualizar cotizaciones" onClick={handleUpdateQuotationsNew} icon={<ArrowPathIcon className='text-white size-4 font-bold' />} />
                    </div>
                </div>
                <div className="col-span-full">
                    <SeccionForm title="Lista de cotizaciones del pedido" />
                </div>
                <div className="col-span-full overflow-x-auto">
                    <TableOrderEdit quotations={quotations} typeMoney={form.order_money} handleDelete={handleDeleteQuotation} />
                </div>
                <div className="col-span-full">
                    <SeccionForm title="Detalle" />
                </div>
                <div className='col-span-full md:col-span-6 lg:col-span-4'>
                    <InputPrimary label='Condiciones de pago' inputRequired='required' name='order_conditions_pay' value={form.order_conditions_pay} onChange={handleForm} />
                </div>
                <div className='col-span-full md:col-span-6 lg:col-span-3'>
                    <InputPrimary label='Fecha entrega' type='date' inputRequired='required' name="order_date_issue" value={form.order_date_issue} onChange={handleForm} />
                </div>
                <div className="col-span-full md:col-span-6 lg:col-span-5">
                    <SelectPrimary label="Condiciones de entrega" inputRequired='required' name="order_conditions_delivery" value={form.order_conditions_delivery} onChange={handleForm}>
                        <option value="DAP">ENTREGA EN LUGAR SIN COSTO (DAP)</option>
                        <option value="DAP(PC)">ENTREGA EN LUGAR ACORDADO CON COSTO (DAP(PC))</option>
                        <option value="FOB CALLAO">FOB CALLAO</option>
                    </SelectPrimary>
                </div>
                <div className='col-span-full'>
                    <InputPrimary label='Dirección de entrega' name="order_address" value={form.order_address} onChange={handleForm} inputRequired='required' />
                </div>
                <div className="col-span-full md:col-span-6 lg:col-span-4">
                    <SelectPrimary label="Departamento" name="order_departament" value={form.order_departament} inputRequired={'required'} onChange={handleDepartaments}>
                        <option value="">Ninguno</option>
                        {
                            departaments.map(departament => <option value={departament.id} key={departament.id}>{departament.departament_name}</option>)
                        }
                    </SelectPrimary>
                </div>
                <div className="col-span-full md:col-span-6 lg:col-span-4">
                    <SelectPrimary label="Provincia" name="order_province" inputRequired={'required'} value={form.order_province} onChange={handleProvinces}>
                        <option value="">Ninguno</option>
                        {
                            provinces.map(province => <option value={province.id} key={province.id}>{province.province_name}</option>)
                        }
                    </SelectPrimary>
                </div>
                <div className="col-span-full md:col-span-6 lg:col-span-4">
                    <SelectPrimary label="Distrito" inputRequired={'required'} name="order_district" value={form.order_district} onChange={handleForm}>
                        <option value="">Ninguno</option>
                        {
                            districts.map(district => <option value={district.id} key={district.id}>{district.district_name}</option>)
                        }
                    </SelectPrimary>
                </div>
                <div className='col-span-full'>
                    <input ref={refUploadFile} type="file" hidden onChange={handleUploadFile} />
                    <ButtonPrimary text="Actualizar OS" onClick={handleClickUpload} icon={<ArrowPathIcon className='text-white size-4 font-bold' />} />
                    <span className='text-slate-400'>{form.order_file_update ? form.order_file_update.name : form.order_file_name}</span>
                </div>
                <SubmitForm id="form-order-submit" />
            </form>
        </Modal>
    )
}

export default FormOrder