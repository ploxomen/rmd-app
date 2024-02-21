import BanerModule from '@/components/BanerModule'
import LoyoutIntranet from '@/components/LoyoutIntranet'
import { statusOrders } from '@/helpers/statusQuotations';
import React from 'react'
const initialStateFilters = {
    customers:[],
    status:statusOrders
}
const initialStateValueFilters = {
    customer:"",
    status:"",
    quoter:"",
    current:1,
    search:"",
    reload:false
}
function OrderAll({dataUser,dataModules,dataRoles}) {
    const [filters,setFilters] = useState(initialStateFilters);
    const [dataChange,setDataChange] = useState(initialStateValueFilters);

  return (
    <>
        <LoyoutIntranet title="Mis pedidos" description="Mis pedidos" user={dataUser} modules={dataModules} roles={dataRoles}>
            <BanerModule imageBanner='/baners/Group 17.jpg' title="Administración de pedidos"/>
            <div className='w-full p-6 bg-white rounded-md shadow mb-4'>
                <div className='max-w-48 w-full'>
                    <SelectPrimary name="customer" label="Clientes" value={filter.role} onChange={handleChangeFilter}>
                    {
                        state.roles.map(role => <option value={role.id} key={role.id}>{role.rol_name}</option>)
                    }
                    </SelectPrimary>
                </div>
            </div>
            <div className='w-full p-6 bg-white rounded-md shadow overflow-x-auto'>
                <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                    <ButtonPrimary text="Agregar" icon={<PlusCircleIcon className='w-5 h-5'/>} onClick={e => openModalNew()}/>
                    <div style={{width:"300px"}}>
                        <InputSearch placeholder='¿Que estas buscando?' onInput={searchCustomer}/>
                    </div>
                </div>
                <TableUser users={state.users} getUser={getUser}  modelReset={openModalReset} deleteUser={deleteUser}/>
                <PaginationTable currentPage={dataChange.current} quantityRow={pagination.quantityRowData} totalData={pagination.totalPages} handleChangePage={handleChangePage}/>
            </div>
        </LoyoutIntranet>
        <FormUser rolesData={state.roles} typeDocumentsData={state.typeDocuments} statusModal={modal} saveUser={saveUser} dataUser={state.userEdit} dataUserRol={state.rolesEdit} closeModal={closeModal}/>
        <FormResetPasswordUser statusModalReset={modelReset} closeModal={closeModalReset} resetPassword={resetPassword}/>
    </>
  )
}

export default OrderAll