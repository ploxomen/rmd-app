import '@/app/globals.css';
import apiAxios from '@/axios';
import BanerModule from '@/components/BanerModule';
import LoyoutIntranet from '@/components/LoyoutIntranet'
import { SelectPrimary } from '@/components/Selects';
import { verifUser } from '@/helpers/verifUser';
import React, { useEffect, useState } from 'react'
import { getCookie } from '@/helpers/getCookie';
import TableOrder from '@/components/orders/TableOrder';
import { sweetAlert } from '@/helpers/getAlert';
import SeccionForm from '@/components/SeccionForm';
import { ButtonPrimary, ButtonSecondarySm } from '@/components/Buttons';
import { ArrowPathIcon, PaperAirplaneIcon } from '@heroicons/react/24/solid';
import Select from 'react-select';
import { useRouter } from 'next/navigation';
import { InputFile, InputPrimary } from '@/components/Inputs';
import axios from 'axios';
import { getProvinces } from '@/helpers/getProvinces';
import { getDistrics } from '@/helpers/getDistrics';
import { optionsConditionsPayOrder } from '@/helpers/optionsConditionsPayOrder';
import Label from '@/components/Label';
export async function getServerSideProps(context) {
  const userCookie = context.req.cookies;
  return await verifUser(userCookie, '/order/new');
}
const initialFilter = {
  money: "PEN",
  customer: "",
  reload: false,
  includeIgv: 1
}
const initialForm = {
  order_departament: "",
  order_district: "",
  order_province: "",
  order_conditions_pay: "",
  order_conditions_delivery: "",
  order_address: "",
  order_os: "",
  order_retaining_customer: "",
  order_date_issue: new Date().toISOString().split('T')[0]
}
function OrderNew({ dataUser, dataModules, dataRoles }) {
  const [customers, setCustomers] = useState([]);
  const [includeIgv, setIncludeIgv] = useState(1);
  const [quotations, setQuotations] = useState([]);
  const [departaments, setDepartaments] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const route = useRouter();
  const selectAllQuotations = quotations.length > 0 && quotations.filter(quotation => quotation.checked == 1).length == quotations.length
  const [filter, setFilter] = useState(initialFilter);
  const headers = getCookie();
  useEffect(() => {
    const getData = async () => {
      try {
        const all = await axios.all([
          apiAxios.get('/departaments', { headers }),
          apiAxios.get('/quotation-extra/customers', { headers }),
        ]);
        setDepartaments(all[0].data.data);
        setCustomers(all[1].data.data);
      } catch (error) {
        sweetAlert({ title: "Error", text: "Error al obtener los datos", icon: "error" });
      }
    }
    getData();
  }, []);
  const handleChangeForm = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }
  useEffect(() => {
    const getData = async () => {
      setQuotations([]);
      if (filter.customer == "") {
        setIncludeIgv(1);
        return
      }
      try {
        const resq = await apiAxios.get('order-extra/quotations', { params: filter, headers });
        setQuotations(resq.data.data);
        setIncludeIgv(resq.data.includeIgv);
      } catch (error) {
        sweetAlert({ title: "Error", text: "Error al obtener las cotizaciones", icon: "error" });
      }
    }
    getData();
  }, [filter])
  const handleChangeFilter = async (e) => {
    setFilter({
      ...filter,
      [e.label ? 'customer' : e.target.name]: e.label ? e.value : e.target.value
    })
  }
  const handleSelectAll = () => {
    setQuotations(quotations.map(quotation => ({ ...quotation, checked: quotation.checked === 1 ? 0 : 1 })));
  }
  const handleCheck = (id) => {
    setQuotations(quotations.map(quotation => quotation.id == id ? { ...quotation, checked: quotation.checked === 1 ? 0 : 1 } : quotation));
  }
  const handleDepartaments = async (e) => {
    handleChangeForm(e);
    setProvinces(await getProvinces(e.target.value));
  }
  const handleProvinces = async (e) => {
    handleChangeForm(e);
    setDistricts(await getDistrics(e.target.value));
  }
  const handleChangeDocument = (e) => {
    setForm({
      ...form,
      order_os: e.target.files[0]
    })
  }
  const handleUpdateQuotations = (e) => {
    setFilter({
      ...filter,
      reload: !filter.reload
    });
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const quotationsActive = quotations.filter(quotation => quotation.checked === 1);
    if (!quotationsActive.length) {
      return sweetAlert({ title: "Alerta", text: "Debe elegir al menos una cotización", icon: "warning" });
    }
    for (let i = 0; i < quotationsActive.length; i++) {
      if (i === 0) {
        continue;
      }
      if (quotationsActive[i - 1].quotation_project !== quotationsActive[i].quotation_project) {
        return sweetAlert({ title: "Alerta", text: "Las cotizaciones deben tener el mismo proyecto", icon: "warning" });
      }
      if (quotationsActive[i - 1].contact_name !== quotationsActive[i].contact_name) {
        return sweetAlert({ title: "Alerta", text: "Las cotizaciones deben tener el mismo contacto", icon: "warning" });
      }
      if (quotationsActive[i - 1].contact_email !== quotationsActive[i].contact_email) {
        return sweetAlert({ title: "Alerta", text: "Las cotizaciones deben tener el mismo email", icon: "warning" });
      }
      if (quotationsActive[i - 1].contact_number !== quotationsActive[i].contact_number) {
        return sweetAlert({ title: "Alerta", text: "Las cotizaciones deben tener el mismo teléfono", icon: "warning" });
      }
    }
    const question = await sweetAlert({ title: "Mensaje", text: "¿Deseas generar un nuevo pedido?", icon: "question", showCancelButton: true });
    if (!question.isConfirmed) {
      return
    }
    const formData = new FormData();
    // Recorrer el objeto form y añadir dinámicamente los campos de texto
    Object.keys(form).forEach((key) => {
      if (key !== 'order_os') {
        formData.append(key, form[key]);
      }
    });
    // Añadimos el archivo a FormData si existe
    if (form.order_os) {
      formData.append('order_os', form.order_os);
    }
    formData.append('order_project', quotationsActive[0].quotation_project);
    formData.append('order_contact_email', quotationsActive[0].contact_email);
    formData.append('order_contact_telephone', quotationsActive[0].contact_number);
    formData.append('order_contact_name', quotationsActive[0].contact_name);
    formData.append('order_money', filter.money);
    formData.append('order_igv', filter.includeIgv);
    formData.append('customer_id', filter.customer);
    formData.append('quotations', JSON.stringify(quotationsActive));
    try {
      const resp = await apiAxios.post('order', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...headers
        }
      });
      if (resp.data.redirect !== null) {
        return route.replace(resp.data.redirect);
      }
      sweetAlert({
        title: "Exitoso", text: "Pedido generado correctamente", icon: "success"
      }).then(result => {
        setTimeout(() => {
          document.getElementById('content-page').scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
          });
        }, 500);
      });
      setFilter(initialFilter)
      setForm(initialForm);
      if (form.order_os) {
        document.getElementById("idorder_os").value = '';
      }
    } catch (error) {
      console.error(error);
      sweetAlert({ title: "Error", text: "Error al generar un nuevo pedido", icon: "error" });
    }
  }
  return (
    <LoyoutIntranet title="Nuevo pedido" description="Creaciones de nuevos pedidos" user={dataUser} modules={dataModules} roles={dataRoles}>
      <BanerModule imageBanner='/baners/Group 15.jpg' title="Nuevo pedido" />
      <div className='w-full p-6 mb-4 bg-white rounded-md shadow grid grid-cols-12 gap-x-3 gap-y-0'>
        <div className="col-span-full md:col-span-6 lg:col-span-8 mb-3">
          <Label text='Cliente' htmlFor='customer' required/>
          <Select instanceId='customer' placeholder="Seleccione un cliente" name='customer' options={customers} onChange={handleChangeFilter} menuPosition='fixed' value={filter.customer == '' ? [] : customers.find(customer => customer.value == filter.customer)} />
        </div>
        <div className="col-span-full md:col-span-3 lg:col-span-2">
          <SelectPrimary label="Tipo moneda" inputRequired='required' name="money" value={filter.money || ''} onChange={handleChangeFilter}>
            <option value="PEN">Soles (S/)</option>
            <option value="USD">Dolares ($)</option>
          </SelectPrimary>
        </div>
        <div className="col-span-full md:col-span-3 lg:col-span-2">
          <SelectPrimary label="Incluir I.G.V" inputRequired='required' name="includeIgv" value={filter.includeIgv || ''} onChange={handleChangeFilter}>
            <option value="1">SI</option>
            <option value="0">NO</option>
          </SelectPrimary>
        </div>
        <div className="col-span-full">
          {
            !includeIgv && <p className='text-sm text-red-600 my-2'>Solo se visualizan las cotizaciones sin IGV debido a que el cliente <strong className='font-bold'>NO ES DE PERÚ</strong></p>
          }
        </div>
      </div>
      <div className='w-full p-6 bg-white rounded-md shadow overflow-x-auto mb-4'>
        <div className='flex gap-2'>
          <SeccionForm title="Lista de cotizaciones" />
          <ButtonSecondarySm title="Actualizar cotizaciones" onClick={handleUpdateQuotations} icon={<ArrowPathIcon className='text-white size-4 font-bold' />} />
        </div>
        <TableOrder quotations={quotations} typeMoney={filter.money} selectQuotation={selectAllQuotations} changeChecked={handleCheck} changeAll={handleSelectAll} />
      </div>
      <form onSubmit={handleSubmit} className='w-full p-6 mb-4 bg-white rounded-md shadow grid grid-cols-12 gap-x-3 gap-y-0'>
        <div className="col-span-full">
          <SeccionForm title="Detalles" />
        </div>
        <div className='col-span-full md:col-span-6 lg:col-span-4'>
          <InputPrimary label='Condiciones de pago' inputRequired='required' name='order_conditions_pay' value={form.order_conditions_pay} onChange={handleChangeForm} />
        </div>
        <div className='col-span-full md:col-span-6 lg:col-span-3'>
          <InputPrimary label='Fecha entrega' type='date' inputRequired='required' name="order_date_issue" value={form.order_date_issue} onChange={handleChangeForm} />
        </div>
        <div className="col-span-full md:col-span-6 lg:col-span-5">
          <SelectPrimary label="Condiciones de entrega" inputRequired='required' name="order_conditions_delivery" value={form.order_conditions_delivery} onChange={handleChangeForm}>
            <option value="" hidden>Seleccione una condición de entrega</option>
            {
              optionsConditionsPayOrder.map((option, keyOption) => <option key={keyOption} value={option.value}>{option.label}</option>)
            }
          </SelectPrimary>
        </div>
        <div className='col-span-full'>
          <InputPrimary label='Dirección de entrega' name="order_address" value={form.order_address} onChange={handleChangeForm} inputRequired='required' />
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
          <SelectPrimary label="Provincia" name="order_province" inputRequired={'required'} value={form.order_province || ''} onChange={handleProvinces}>
            <option value="">Ninguno</option>
            {
              provinces.map(province => <option value={province.id} key={province.id}>{province.province_name || ''}</option>)
            }
          </SelectPrimary>
        </div>
        <div className="col-span-full md:col-span-6 lg:col-span-4">
          <SelectPrimary label="Distrito" inputRequired={'required'} name="order_district" value={form.order_district || ''} onChange={handleChangeForm}>
            <option value="">Ninguno</option>
            {
              districts.map(district => <option value={district.id} key={district.id}>{district.district_name}</option>)
            }
          </SelectPrimary>
        </div>
        <div className='col-span-full md:col-span-6 lg:col-span-4'>
          <SelectPrimary label="Empresa retenedora" inputRequired={'required'} name="order_retaining_customer" value={form.order_retaining_customer || ''} onChange={handleChangeForm}>
            <option value="">Ninguno</option>
            <option value="SI">SI</option>
            <option value="NO">NO</option>
          </SelectPrimary>
        </div>
        <div className='col-span-full mb-3x'>
          <InputFile label='Cargar OC' name='order_os' inputRequired={true} onChange={handleChangeDocument} />
        </div>
        <div className="col-span-full text-center">
          <ButtonPrimary text="Generar" type='submit' icon={<PaperAirplaneIcon className='w-5 h-5' />} />
        </div>
      </form>
    </LoyoutIntranet>
  )
}

export default OrderNew