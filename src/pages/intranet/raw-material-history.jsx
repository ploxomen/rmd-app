import apiAxios from "@/axios";
import { verifUser } from "@/helpers/verifUser";
import React, { useEffect, useState } from "react";
import { getCookie } from "@/helpers/getCookie";
import LoyoutIntranet from "@/components/LoyoutIntranet";
import BanerModule from "@/components/BanerModule";
import { InputSearch } from "@/components/Inputs";
import PaginationTable from "@/components/PaginationTable";
import { sweetAlert } from "@/helpers/getAlert";
import TableHistoryMaterial from "@/components/stores/TableHistoryMaterial";
import FormRawMaterials from "@/components/stores/FormRawMaterials";
import { useModal } from "@/hooks/useModal";
import Link from "next/link";
import { ArrowUturnLeftIcon, PlusIcon } from "@heroicons/react/24/solid";
import { ButtonPrimarySm } from "@/components/Buttons";
import axios from "axios";
export async function getServerSideProps(context) {
  const { query } = context;
  const valid = await verifUser(context, "/raw-material");
  let infoProduct = {
    nameProduct: null,
    idRawMaterial: null,
    measurementProduct: null,
    idProduct: null
  };
  const headers = {
    Cookie: context.req.headers.cookie,
    Origin: process.env.APP_URL,
  };
  try {
    const response = await apiAxios.get(
      "/raw-material/history/" + query.raw_material,
      {
        headers
      }
    );
    infoProduct.idRawMaterial = response.data.data.idMaterial;
    infoProduct.nameProduct = response.data.data.nameMaterial;
    infoProduct.measurementProduct = response.data.data.measurementProduct;
    infoProduct.idProduct = response.data.data.idProduct;

  } catch (error) {
    infoProduct.idRawMaterial = null;
    infoProduct.nameProduct = null;
    infoProduct.measurementProduct = null;
    infoProduct.idProduct = null;

  }

  return {
    props: {
      ...valid.props,
      ...infoProduct,
    },
  };
}
const quantityRowData = 25;
function RawMaterialHistory({
  dataModules,
  dataUser,
  dataRoles,
  nameProduct,
  idProduct,
  idRawMaterial,
  measurementProduct,
}) {
  const headers = getCookie();
  const [dataChange, setDataChange] = useState({
    current: 1,
    search: "",
    reload: false,
  });
  const handleSaveHistoryAdd = async (dataForm) => {
    try {
      const resp = await apiAxios.post("/raw-material", {...dataForm,product_id:idProduct}, { headers });
      if (resp.data.redirect !== null) {
        return route.replace(resp.data.redirect);
      }
      sweetAlert({
        title: "Mensaje",
        text: resp.data.message,
        icon: resp.data.error ? "error" : "success",
      });
      if (!resp.data.error) {
        handleCloseModal();
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
  const handleChangePage = (number) => {
    if (!number) {
      return;
    }
    setDataChange({ ...dataChange, current: number });
  };
  const [histories, setHistories] = useState([]);
    const [providers, setProviders] = useState([]);
  const { modal, handleOpenModal, handleCloseModal } = useModal("hidden");
  const [editProduct, setEditProduct] = useState({});
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
      if(resp.data.data.material_hist_total_type_change === null){
        return sweetAlert({
          title: "Alerta",
          text: "No se ha establecido el tipo de cambio para el día de hoy",
          icon: "warning",
        });
      }
      setEditProduct({...resp.data.data,material_hist_money: "PEN"});
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
  const [pagination, setPagination] = useState({
    quantityRowData,
    totalPages: 0,
  });
  const closeModal = () => {
    setEditProduct({});
    handleCloseModal();
  };
  const handleSaveHistory = async (dataForm) => {
    try {
      const resp = await apiAxios.put(
        "/raw-material/history-one/" + dataForm.history_id,
        dataForm,
        { headers }
      );
      if (resp.data.redirect !== null) {
        return route.replace(resp.data.redirect);
      }
      sweetAlert({
        title: "Mensaje",
        text: resp.data.message,
        icon: resp.data.error ? "error" : "success",
      });
      if (!resp.data.error) {
        handleCloseModal();
        setEditProduct({});
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
  const deleteHistory = async (idHistory) => {
    const question = await sweetAlert({
      title: "Mensaje",
      text:
        "¿Deseas eliminar este registro del historial de " + nameProduct + "?",
      icon: "question",
      showCancelButton: true,
    });
    if (!question.isConfirmed) {
      return;
    }
    try {
      const resp = await apiAxios.delete(
        `/raw-material/history-list/${idHistory}`,
        {
          headers,
        }
      );
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
        text: "Error al eliminar el registro",
        icon: "error",
      });
    }
  };
  const viewHistory = async (idHistory) => {
    try {
      const resp = await apiAxios.get(
        "/raw-material/history-one/" + idHistory,
        {
          headers,
        }
      );
      if (resp.data.redirect !== null) {
        return route.replace(resp.data.redirect);
      }
      setEditProduct({
        ...resp.data.data,
        material_hist_total_buy:
          resp.data.data.material_hist_money === "PEN"
            ? resp.data.data.material_hist_total_buy_pen
            : resp.data.data.material_hist_total_buy_usd,
        material_hist_igv: resp.data.data.material_hist_igv == 0 ? false : true,
        material_hist_name_product: nameProduct,
        material_hist_unit_measurement: measurementProduct,
      });
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
  let timer = null;
  const searchCustomer = (e) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      setDataChange({ ...dataChange, current: 1, search: e.target.value });
    }, 500);
  };
  useEffect(() => {
    const getData = async () => {
      if (!idRawMaterial) {
        return false;
      }
      try {
        const resp = await apiAxios.get(
          "/raw-material/history-list/" + idRawMaterial,
          {
            headers,
            params: {
              show: pagination.quantityRowData,
              page: dataChange.current,
              search: dataChange.search,
            },
          }
        );
        if (resp.data.redirect !== null) {
          return route.replace(resp.data.redirect);
        }
        setPagination({
          ...pagination,
          totalPages: resp.data.total,
        });
        setHistories(resp.data.data);
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
          apiAxios.get("/raw-material/providers/list", { headers }),
        ]);
        setProviders(all[0].data.providers);
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
        title="Materia Prima Historial"
        description="Historial de Materia Prima"
        user={dataUser}
        modules={dataModules}
        roles={dataRoles}
      >
        <BanerModule
          imageBanner="/baners/Group 18.jpg"
          title="Historial del producto"
        />
        {!idRawMaterial ? (
          <h1 className="text-red-500 text-center text-2xl font-bold">
            No existe ningún historial relacionado
          </h1>
        ) : (
          <div className="w-full p-6 bg-white rounded-md shadow">
            <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
              <div style={{ width: "190px" }}>
                <Link
                  href="/intranet/raw-material"
                  className="rounded-md overflow-hidden relative inline-flex group items-center justify-center px-3.5 py-2 m-1 cursor-pointer border-b-4 border-l-2 hover:bg-red-600 font-semibold transition-all ease-in-out shadow-lg bg-gradient-to-tr bg-red-500 text-white"
                >
                  <div className="flex justify-center items-center gap-0.5">
                    <ArrowUturnLeftIcon className="size-4" />
                    <span className="relative">Regresar</span>
                  </div>
                </Link>
              </div>
              <div className="flex-1">
                <div className="flex gap-1 justify-center">
                  <h2 className="text-center text-lg font-bold text-green-500">
                    {nameProduct}
                  </h2>
                  <ButtonPrimarySm title='Agregar' onClick={ e => addHistory(idProduct)} icon={<PlusIcon className="size-4"/>}/>
                </div>
              </div>
              <div style={{ width: "300px" }}>
                <InputSearch
                  placeholder="¿Que estas buscando?"
                  onInput={searchCustomer}
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <TableHistoryMaterial
                histories={histories}
                deleteHistory={deleteHistory}
                viewHistory={viewHistory}
              />
            </div>

            <PaginationTable
              currentPage={dataChange.current}
              quantityRow={pagination.quantityRowData}
              totalData={pagination.totalPages}
              handleChangePage={handleChangePage}
            />
          </div>
        )}
      </LoyoutIntranet>
      <FormRawMaterials
        valueMoney={0}
        statusModal={modal}
        listProduct={[]}
        listProviders={providers}
        handleCloseModal={closeModal}
        handleValidProduct={() => {}}
        handleSaveHistory={editProduct.history_id ? handleSaveHistory : handleSaveHistoryAdd}
        productEdit={editProduct}
        elemetHistory={true}
      />
    </>
  );
}

export default RawMaterialHistory;
