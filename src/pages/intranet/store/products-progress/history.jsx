import apiAxios from "@/axios";
import BanerModule from "@/components/BanerModule";
import { InputSearch } from "@/components/Inputs";
import LoyoutIntranet from "@/components/LoyoutIntranet";
import PaginationTable from "@/components/PaginationTable";
import FormProductProgress from "@/components/stores/FormProductProgress";
import TableHistoryProgress from "@/components/stores/TableHistoryProgress";
import { sweetAlert } from "@/helpers/getAlert";
import { getCookie } from "@/helpers/getCookie";
import { verifUser } from "@/helpers/verifUser";
import { useModal } from "@/hooks/useModal";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useEffect, useState } from "react";

export async function getServerSideProps(context) {
  const { query } = context;
  const valid = await verifUser(context, "/store/product-progress");
  const headers = {
    Cookie: context.req.headers.cookie,
    Origin: process.env.APP_URL,
  };
  let infoProduct = {
    nameProduct: null,
    idProductProgress: null,
    idProduct: null,
  };
  try {
    const { data } = await apiAxios.get(
      "/product-progress-extra/history/" + query.product_progress,
      {
        headers,
      }
    );
    infoProduct = data.data;
  } catch (error) {
    infoProduct = null;
  }
  return {
    props: {
      ...valid.props,
      ...infoProduct,
    },
  };
}
const quantityRowData = 25;
export default function ProductProgressHistory({
  dataModules,
  dataUser,
  dataRoles,
  nameProduct,
  idProductProgress,
  idProduct,
}) {
  const headers = getCookie();
  const [dataChange, setDataChange] = useState({
    current: 1,
    search: "",
    reload: false,
  });
  
  const handleChangePage = (number) => {
    if (!number) {
      return;
    }
    setDataChange({ ...dataChange, current: number });
  };
  const [histories, setHistories] = useState([]);
  const { modal, handleOpenModal, handleCloseModal } = useModal("hidden");
  const [editProduct, setEditProduct] = useState({});
//   const addHistory = () => {
//     setEditProduct({...formProductProgress, product_id: idProduct, idProductProgress});
//   };
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
        "/product-progress/history-one/" + dataForm.idHistory,
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
        `/product-progress/history-list/${idHistory}`,
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
        "/product-progress/history-one/" + idHistory,
        {
          headers,
        }
      );
      if (resp.data.redirect !== null) {
        return route.replace(resp.data.redirect);
      }
      setEditProduct({...resp.data.data, idHistory});
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
      if (!idProductProgress) {
        return false;
      }
      try {
        const resp = await apiAxios.get(
          "/product-progress/history-list/" + idProductProgress,
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
  return (
    <>
      <LoyoutIntranet
        title="Productos en curso - Movimientos"
        description="Movimientos de los productos en curso"
        user={dataUser}
        modules={dataModules}
        roles={dataRoles}
      >
        <BanerModule
          imageBanner="/baners/Group 18.jpg"
          title="Movimientos de los productos en curso"
        />
        {!idProductProgress ? (
          <h1 className="text-red-500 text-center text-2xl font-bold">
            No existe ningún historial relacionado
          </h1>
        ) : (
          <div className="w-full p-6 bg-white rounded-md shadow">
            <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
              <div style={{ width: "190px" }}>
                <Link
                  href="general"
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
                  {/* <ButtonPrimarySm
                    title="Agregar"
                    onClick={(e) => addHistory()}
                    icon={<PlusIcon className="size-4" />}
                  /> */}
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
              <TableHistoryProgress
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
      <FormProductProgress
        products={[{product_id: idProduct ,product_name: nameProduct}]}
        statusModal={modal}
        editProductRaw={editProduct}
        handleSaveHistory={handleSaveHistory}
        handleCloseModal={closeModal}
        isEdit={true}
      />
    </>
  );
}
