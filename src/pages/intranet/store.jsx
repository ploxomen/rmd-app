import apiAxios from "@/axios";
import BanerModule from "@/components/BanerModule";
import { ButtonDanger } from "@/components/Buttons";
import { InputSearch } from "@/components/Inputs";
import LoyoutIntranet from "@/components/LoyoutIntranet";
import PaginationTable from "@/components/PaginationTable";
import FormStore from "@/components/stores/FormStore";
import TableStore from "@/components/stores/TableStore";
import { sweetAlert } from "@/helpers/getAlert";
import { getCookie } from "@/helpers/getCookie";
import { verifUser } from "@/helpers/verifUser";
import { useModal } from "@/hooks/useModal";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
export async function getServerSideProps(context) {
  const userCookie = context.req.cookies;
  return await verifUser(userCookie, "/store");
}
const quantityRowData = 25;
function Store({ dataModules, dataUser, dataRoles }) {
  const headers = getCookie();
  const route = useRouter();

  const { modal, handleOpenModal, handleCloseModal } = useModal("hidden");
  const [dataChange, setDataChange] = useState({
    current: 1,
    search: "",
    reload: false,
  });
  const [pagination, setPagination] = useState({
    quantityRowData,
    totalPages: 0,
  });
  const [stores, setStores] = useState([]);
  const [storeEdit, setStoreEdit] = useState({});
  const getStore = async (idStore) => {
    try {
      const resp = await apiAxios.get("/store/" + idStore, {
        headers,
      });
      if (resp.data.redirect !== null) {
        return route.replace(resp.data.redirect);
      }
      setStoreEdit({
        ...resp.data.data.store,
        listSubStore: resp.data.data.subStores,
      });
      handleOpenModal();
    } catch (error) {
      sweetAlert({
        title: "Error",
        text: "Error al obtener los datos del almacen",
        icon: "error",
      });
      console.error(error);
    }
  };
  const deleteStore = async (idStore) => {
    const question = await sweetAlert({title : "Mensaje", text: "¿Deseas eliminar este almacen?", icon : "question",showCancelButton:true});
    if(!question.isConfirmed){
      return
    }
    try {
        const resp = await apiAxios.delete(`/store/${idStore}`,{headers});
        if(resp.data.redirect !== null){
            return route.replace(resp.data.redirect);
        }
        if(resp.data.error){
          return sweetAlert({title : "Alerta", text: resp.data.message, icon : "warning"});
        }
        setDataChange({
            ...dataChange,
            reload:!dataChange.reload
        })
        sweetAlert({title : "Exitoso", text: resp.data.message, icon : "success"});
    } catch (error) {
        sweetAlert({title : "Error", text:'Error al eliminar el producto', icon : "error"});
        dispatch({type:TYPES_PRODUCTS.NO_PRODUCTS});
    }
  };
  const handleChangePage = (number) => {
    if (!number) {
      return;
    }
    setDataChange({ ...dataChange, current: number });
  };
  let timer = null;
  const searchCustomer = (e) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      setDataChange({ ...dataChange, current: 1, search: e.target.value });
    }, 500);
  };
  const handleSubmit = async (form) => {
    try {
      const response = form.id
        ? await apiAxios.put("store/" + form.id, form, { headers })
        : await apiAxios.post("store", form, { headers });
      if (response.data.redirect !== null) {
        return route.replace(response.data.redirect);
      }
      setDataChange({
        ...dataChange,
        reload: !dataChange.reload,
      });
      sweetAlert({
        title: "Exitoso",
        text: response.data.message,
        icon: "success",
      });
      setStoreEdit({});
      handleCloseModal();
    } catch (error) {
      sweetAlert({
        title: "Error",
        text: "Error al guardar los datos del almacen",
        icon: "error",
      });
      console.error(error);
    }
  };
  useEffect(() => {
    const getData = async () => {
      try {
        const resp = await apiAxios.get("/store", {
          headers,
          params: {
            show: pagination.quantityRowData,
            page: dataChange.current,
            search: dataChange.search,
          },
        });
        if (resp.data.redirect !== null) {
          return route.replace(resp.data.redirect);
        }
        setPagination({
          ...pagination,
          totalPages: resp.data.total,
        });
        setStores(resp.data.data);
      } catch (error) {
        sweetAlert({
          title: "Error",
          text: "Error al obtener los datos del almacen",
          icon: "error",
        });
        console.error(error);
      }
    };
    getData();
  }, [dataChange]);
  return (
    <>
      <LoyoutIntranet
        title="Almacenes"
        description="Administracion de almacenes"
        user={dataUser}
        modules={dataModules}
        roles={dataRoles}
      >
        <BanerModule
          imageBanner="/baners/Group 18.jpg"
          title="Administración de almacenes"
        />
        <div className="w-full p-6 bg-white rounded-md shadow overflow-x-auto">
          <div className="flex w-full items-center justify-between gap-2 flex-wrap mb-2">
            <div>
              <ButtonDanger
                text="Agregar"
                icon={<PlusCircleIcon className="w-5 h-5" />}
                onClick={handleOpenModal}
              />
            </div>
            <div style={{ width: "300px" }}>
              <InputSearch
                placeholder="¿Que estas buscando?"
                onInput={searchCustomer}
              />
            </div>
          </div>
          <TableStore
            stores={stores}
            getStore={getStore}
            deleteStore={deleteStore}
          />
          <PaginationTable
            currentPage={dataChange.current}
            quantityRow={pagination.quantityRowData}
            totalData={pagination.totalPages}
            handleChangePage={handleChangePage}
          />
        </div>
      </LoyoutIntranet>
      <FormStore
        statusModal={modal}
        closeModal={handleCloseModal}
        storeEdit={storeEdit}
        handleSubmitForm={handleSubmit}
      />
      {/* <FormProduct categories={state.categories} statusModal={modal} closeModal={closeModal} handleSave={saveProduct} productEdit={state.productEdit} subcategoriesData={state.subcategories} stores={state.stores}/> */}
    </>
  );
}

export default Store;
