import apiAxios from "@/axios";
import BanerModule from "@/components/BanerModule";
import { ButtonDanger } from "@/components/Buttons";
import { InputSearch } from "@/components/Inputs";
import Label from "@/components/Label";
import LoyoutIntranet from "@/components/LoyoutIntranet";
import PaginationTable from "@/components/PaginationTable";
import FormRawMaterials from "@/components/stores/FormRawMaterials";
import TableRawMaterial from "@/components/stores/TableRawMaterial";
import { sweetAlert } from "@/helpers/getAlert";
import { getCookie } from "@/helpers/getCookie";
import { verifUser } from "@/helpers/verifUser";
import { useModal } from "@/hooks/useModal";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Select from "react-select";
export async function getServerSideProps(context) {
  const userCookie = context.req.cookies;
  return await verifUser(userCookie, "/raw-material");
}
const quantityRowData = 25;
function RawMaterial({ dataModules, dataUser, dataRoles }) {
  const [products, setProducts] = useState([]);
  const [productsForm, setProductsForm] = useState([]);
  const [editProduct, setEditProduct] = useState({});
  const [filterStores, setFilterStores] = useState([]);
  const { modal, handleOpenModal, handleCloseModal } = useModal("hidden");
  const headers = getCookie();
  const [dataChange, setDataChange] = useState({
    current: 1,
    search: "",
    reload: false,
  });
  const closeModal = () => {
    setProductsForm(productsForm.map(proForm => {return {...proForm, isDisabled: false} }));
    setEditProduct({});
    handleCloseModal();
  }
  const [pagination, setPagination] = useState({
    quantityRowData,
    totalPages: 0,
  });
  const handleSaveHistory = async (dataForm) => {
    try {
      const resp = await apiAxios.post("/raw-material", dataForm, { headers });
      if (resp.data.redirect !== null) {
        return route.replace(resp.data.redirect);
      }
      sweetAlert({
          title: "Mensaje",
          text: resp.data.message,
          icon: resp.data.error ? "error" : "success",
        });
        if(!resp.data.error){
            handleCloseModal();
            setEditProduct({});
            setProductsForm(productsForm.map(proForm => {return {...proForm, isDisabled: false} }));
            setDataChange({
                ...dataChange,
                reload: !dataChange.reload,
            });
        }
    } catch (error) {
      sweetAlert({
        title: "Error",
        text: "Error al obtener los datos",
        icon: "error",
      });
      console.error(error);
    }
  };
  const handleValidProduct = async (codeBill) => {
    if(!codeBill){
        setProductsForm(productsForm.map(proForm => {return {...proForm, isDisabled: false} }));
        return false;
    }
    try {
      const resp = await apiAxios.get(
        "/raw-material/valid-product/" + codeBill,
        {
          headers,
        }
      );
      if (resp.data.redirect !== null) {
        return route.replace(resp.data.redirect);
      }
      if (resp.data.data.length) {
        let dataProduct = productsForm;
        resp.data.data.forEach((product) => {
          const productExist = dataProduct.findIndex(
            (pro) => product.product_id === pro.value
          );
          if (productExist) {
            dataProduct[productExist]["isDisabled"] = true;
          }
        });
        setProductsForm(dataProduct);
      }
    } catch (error) {
      sweetAlert({
        title: "Error",
        text: "Error al obtener los datos",
        icon: "error",
      });
      console.error(error);
    }
  };
  const viewHistory = (idProduct) => {};
  const deleteHistory = async (idHistory) => {
    const question = await sweetAlert({title : "Mensaje", text: "¿Deseas eliminar los registro de la materia prima de este producto?", icon : "question",showCancelButton:true});
    if(!question.isConfirmed){
      return
    }
    try {
        const resp = await apiAxios.delete(`/raw-material/${idHistory}`,{headers});
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
        sweetAlert({title : "Error", text:'Error al eliminar el registro', icon : "error"});
        
    }
  };
  const addHistory = async (idProduct) => {
    try {
      const resp = await apiAxios.get(
        "/raw-material/product-add/" + idProduct,
        {
          headers,
        }
      );
      if (resp.data.redirect !== null) {
        return route.replace(resp.data.redirect);
      }
      setEditProduct(resp.data.data);
      handleOpenModal();
    } catch (error) {
      sweetAlert({
        title: "Error",
        text: "Error al obtener los datos",
        icon: "error",
      });
      console.error(error);
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
  useEffect(() => {
    const getData = async () => {
      try {
        const resp = await apiAxios.get("/raw-material", {
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
        setProducts(resp.data.data);
      } catch (error) {
        sweetAlert({
          title: "Error",
          text: "Error al obtener los datos",
          icon: "error",
        });
        console.error(error);
      }
    };
    getData();
  }, [dataChange]);
  useEffect(() => {
    const getData = async () => {
      try {
        const all = await axios.all([
          apiAxios.get("/quotation-extra/products", { headers }),
          apiAxios.get("/product-store", { headers }),
        ]);
        setFilterStores(all[1].data.data);
        setProductsForm(all[0].data.data);
      } catch (error) {
        console.error(error);
        sweetAlert({
          title: "Error",
          text: "Error al obtener los datos",
          icon: "error",
        });
      }
    };
    getData();
  }, []);
  return (
    <>
      <LoyoutIntranet
        title="Materia Prima"
        description="Administracion de materiales de materia prima"
        user={dataUser}
        modules={dataModules}
        roles={dataRoles}
      >
        <BanerModule
          imageBanner="/baners/Group 17.jpg"
          title="Almacén Materia Prima"
        />
        <div className="w-full p-6 bg-white rounded-md shadow overflow-x-auto">
          <div className="flex w-full items-center justify-between gap-2 flex-wrap mb-2">
            <div style={{ width: "350px" }}>
              <Label text="Almacen" htmlFor="filter_stores" />
              <Select
                instanceId="filter_stores"
                placeholder="Seleccione una opción"
                name="product_substore"
                options={filterStores}
                menuPosition="fixed"
              />
            </div>
            <div style={{ width: "300px" }}>
              <InputSearch
                placeholder="¿Que estas buscando?"
                onInput={searchCustomer}
              />
            </div>
          </div>
          <div className="block lg:flex lg:justify-end mb-2">
            <ButtonDanger
              text="Agregar"
              icon={<PlusCircleIcon className="w-5 h-5" />}
              onClick={handleOpenModal}
            />
          </div>
          <TableRawMaterial
            products={products}
            addHistory={addHistory}
            viewHistory={viewHistory}
            deleteHistory={deleteHistory}
          />
          <PaginationTable
            currentPage={dataChange.current}
            quantityRow={pagination.quantityRowData}
            totalData={pagination.totalPages}
            handleChangePage={handleChangePage}
          />
        </div>
      </LoyoutIntranet>
      <FormRawMaterials
        statusModal={modal}
        listProduct={productsForm}
        handleCloseModal={closeModal}
        handleValidProduct={handleValidProduct}
        handleSaveHistory={handleSaveHistory}
        productEdit={editProduct}
      />
    </>
  );
}

export default RawMaterial;
