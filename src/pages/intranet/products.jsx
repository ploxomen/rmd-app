import "@/app/globals.css";
import apiAxios from "@/axios";
import BanerModule from "@/components/BanerModule";
import { ButtonDanger, ButtonPrimary } from "@/components/Buttons";
import { InputSearch } from "@/components/Inputs";
import LoyoutIntranet from "@/components/LoyoutIntranet";
import PaginationTable from "@/components/PaginationTable";
import FormProduct from "@/components/products/FormProduct";
import TableProduct from "@/components/products/TableProduct";
import { downloadFiles } from "@/helpers/downloadFiles";
import { sweetAlert } from "@/helpers/getAlert";
import { getCookie } from "@/helpers/getCookie";
import { verifUser } from "@/helpers/verifUser";
import { useModal } from "@/hooks/useModal";
import {
  TYPES_PRODUCTS,
  initialStateProduct,
  reducerProducts,
} from "@/reducers/crudProducts";
import {
  DocumentArrowDownIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useReducer, useState } from "react";
const quantityRowData = 25;
export async function getServerSideProps(context) {
  return await verifUser(context, "/products");
}
function products({ dataModules, dataUser, dataRoles }) {
  const [state, dispatch] = useReducer(reducerProducts, initialStateProduct);
  const headers = getCookie();
  const route = useRouter();
  const [dataChange, setDataChange] = useState({
    current: 1,
    search: "",
    reload: false,
  });
  const [pagination, setPagination] = useState({
    quantityRowData,
    totalPages: 0,
  });
  const { modal, handleOpenModal, handleCloseModal } = useModal("hidden");
  useEffect(() => {
    const getData = async () => {
      try {
        const resq = await axios.all([
          apiAxios.get("product-categorie", { headers }),
        ]);
        dispatch({
          type: TYPES_PRODUCTS.ALL_CATEGORIES,
          payload: resq[0].data.data,
        });
      } catch (error) {
        dispatch({ type: TYPES_PRODUCTS.NO_PRODUCTS });
        sweetAlert({
          title: "Error",
          text: "Error al obtener los datos",
          icon: "error",
        });
      }
    };
    getData();
  }, []);
  useEffect(() => {
    const getData = async () => {
      try {
        const resp = await apiAxios.get("/product", {
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
          totalPages: resp.data.totalProducts,
        });
        dispatch({
          type: TYPES_PRODUCTS.ALL_PRODUCTS,
          payload: resp.data.data,
        });
      } catch (error) {
        dispatch({ type: TYPES_PRODUCTS.NO_PRODUCTS });
        console.error(error);
      }
    };
    getData();
  }, [dataChange]);
  const closeModal = async () => {
    document.querySelector("#upload-file").value = "";
    dispatch({ type: TYPES_PRODUCTS.RESET_EDIT });
    handleCloseModal();
  };
  const saveProduct = async (data) => {
    try {
      const headerApi = {
        headers: {
          "Content-Type": "multipart/form-data",
          ...headers,
        },
      };
      const resp = !data.has("id")
        ? await apiAxios.post("/product", data, headerApi)
        : await apiAxios.post("/product/" + data.get("id"), data, headerApi);
      if (resp.data.redirect !== null) {
        return route.replace(resp.data.redirect);
      }
      if (resp.data.error) {
        if (resp.data.message) {
          throw new Error(resp.data.message);
        }
        resp.data.data.forEach((error) => {
          sweetAlert({ title: "Alerta", text: error, icon: "warning" });
        });
        return;
      }
      setDataChange({
        ...dataChange,
        reload: !dataChange.reload,
      });
      sweetAlert({
        title: "Exitoso",
        text: resp.data.message,
        icon: "success",
      });
      closeModal();
    } catch (error) {
      console.error(error);
      sweetAlert({
        title: "Error",
        text: error || "Error al guardar el producto",
        icon: "error",
      });
    }
  };
  const getProduct = async (idProduct) => {
    try {
      const resp = await apiAxios.get(`/product/${idProduct}`, { headers });
      if (resp.data.redirect !== null) {
        return route.replace(resp.data.redirect);
      }
      if (resp.data.error) {
        return sweetAlert({
          title: "Alerta",
          text: resp.data.message,
          icon: "warning",
        });
      }
      dispatch({
        type: TYPES_PRODUCTS.GET_PRODUCT,
        payload: {
          product: resp.data.data.product,
          url: resp.data.data.url,
          subcategories: resp.data.data.subcategories,
          categorieId: resp.data.data.categorieId,
          editStock: resp.data.data.updateStockInitial,
        },
      });
      handleOpenModal();
    } catch (error) {
      dispatch({ type: TYPES_PRODUCTS.NO_PRODUCTS });
      console.error(error);
    }
  };
  let timer = null;
  const searchCustomer = (e) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      setDataChange({ ...dataChange, current: 1, search: e.target.value });
    }, 500);
  };
  const handleChangePage = (number) => {
    if (!number) {
      return;
    }
    setDataChange({ ...dataChange, current: number });
  };
  const deleteProduct = async (idProduct) => {
    const question = await sweetAlert({
      title: "Mensaje",
      text: "¿Deseas eliminar esta producto?",
      icon: "question",
      showCancelButton: true,
    });
    if (!question.isConfirmed) {
      return;
    }
    try {
      const resp = await apiAxios.delete(`/product/${idProduct}`, { headers });
      if (resp.data.redirect !== null) {
        return route.replace(resp.data.redirect);
      }
      if (resp.data.error) {
        return sweetAlert({
          title: "Alerta",
          text: resp.data.message,
          icon: "warning",
        });
      }
      setDataChange({
        ...dataChange,
        reload: !dataChange.reload,
      });
      sweetAlert({
        title: "Exitoso",
        text: resp.data.message,
        icon: "success",
      });
    } catch (error) {
      sweetAlert({
        title: "Error",
        text: "Error al eliminar el producto",
        icon: "error",
      });
      dispatch({ type: TYPES_PRODUCTS.NO_PRODUCTS });
    }
  };
  const exportProducts = async () => {
    downloadFiles("/product-export", "productos");
  };
  return (
    <>
      <LoyoutIntranet
        title="Productos"
        description="Administracion de productos"
        user={dataUser}
        modules={dataModules}
        roles={dataRoles}
      >
        <BanerModule
          imageBanner="/baners/Group 14.jpg"
          title="Administración de productos"
        />
        <div className="w-full p-6 bg-white rounded-md shadow overflow-x-auto">
          <div className="flex w-full items-center justify-between gap-2 flex-wrap mb-2">
            <div>
              <ButtonDanger
                text="Agregar"
                icon={<PlusCircleIcon className="w-5 h-5" />}
                onClick={handleOpenModal}
              />
              <ButtonPrimary
                text="Exportar"
                icon={<DocumentArrowDownIcon className="w-5 h-5" />}
                onClick={exportProducts}
              />
            </div>
            <div style={{ width: "300px" }}>
              <InputSearch
                placeholder="¿Que estas buscando?"
                onInput={searchCustomer}
              />
            </div>
          </div>
          <div className="overflow-x-auto mb-4">
            <TableProduct
              products={state.products}
              getProduct={getProduct}
              deleteProduct={deleteProduct}
            />
          </div>

          <PaginationTable
            currentPage={dataChange.current}
            quantityRow={pagination.quantityRowData}
            totalData={pagination.totalPages}
            handleChangePage={handleChangePage}
          />
        </div>
      </LoyoutIntranet>
      <FormProduct
        categories={state.categories}
        statusModal={modal}
        closeModal={closeModal}
        handleSave={saveProduct}
        productEdit={state.productEdit}
        subcategoriesData={state.subcategories}
        editStock={state.editStock}
      />
    </>
  );
}

export default products;
