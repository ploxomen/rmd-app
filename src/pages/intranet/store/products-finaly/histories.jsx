import apiAxios from "@/axios";
import BanerModule from "@/components/BanerModule";
import { InputSearch } from "@/components/Inputs";
import LoyoutIntranet from "@/components/LoyoutIntranet";
import PaginationTable from "@/components/PaginationTable";
import FormProductFinalyAssem from "@/components/stores/FormProductFinalyAssem";
import FormProductFinalyImport from "@/components/stores/FormProductFinalyImport";
import TableHistoriesProductFinaly from "@/components/stores/TableHistoriesProductFinaly";
import TableHistoriesProductFinAssem from "@/components/stores/TableHistoriesProductFinAssem";
import { sweetAlert } from "@/helpers/getAlert";
import { getCookie } from "@/helpers/getCookie";
import { verifUser } from "@/helpers/verifUser";
import { useFormAssambled } from "@/hooks/productFinaly/useFormAssambled";
import { useFormFinaly } from "@/hooks/productFinaly/useFormFinaly";
import { useDataList } from "@/hooks/useDataList";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
export async function getServerSideProps(context) {
  const { query } = context;
  const valid = await verifUser(context, "/store/products-finaly");
  const headers = {
    Cookie: context.req.headers.cookie,
    Origin: process.env.APP_URL,
  };
  let infoProduct = {
    nameProduct: null,
    idProductFinaly: null,
    typeProductFinaly: null,
  };
  try {
    const { data } = await apiAxios.get(
      "/product-finaly-extra/history/verif/" + query.product_finaly,
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
export default function ProductFinalyHistories({
  dataModules,
  dataUser,
  dataRoles,
  nameProduct,
  idProductFinaly,
  typeProductFinaly,
}) {
  const headers = getCookie();
  const { dataTotal, data , reloadPage , filters, serchInfomation, changeFilter } =
    useDataList({
      url: `/products-finaly/${idProductFinaly}`,
    });
  const {
    handleGetHistory: getAssembled,
    handleDeleteHistory: deleteAssembled,
    details: assembleDetails,
    data: assembleForm,
    handleCloseModal: handleCloseModalAssem,
    handleDeleteDetail,
    modal : assembleModal,
    responseRequest: reponseRequestAssem,
    handleAddDetail,
    handleChangeMaterial,
  } = useFormAssambled(reloadPage);
  const {
    handleGetHistory: getImport,
    handleDeleteHistory: deleteImport,
    data: formFinalyData,
    modal: modalFinalyData,
    handleCloseModal: handleCloseModalFinaly,
    responseRequest: reponseRequestImport,
  } = useFormFinaly(reloadPage);
  const [providers, setProviders] = useState([]);
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    const getData = async () => {
      try {
        const all = await axios.all([
          apiAxios.get("/product-extra/raw-process", { headers }),
          apiAxios.get("/raw-material/providers/list", { headers }),
        ]);
        setProducts(all[0].data.products);
        setProviders(all[1].data.providers);
      } catch (error) {
        console.error(error);
        sweetAlert({
          title: "Error",
          text: "Error al obtener los datos del proveedor",
          icon: "error",
        });
      }
    };
    getData();
  }, []);
  return (
    <>
      <LoyoutIntranet
        title="Productos terminados - Historial"
        description="Historial de movimientos"
        user={dataUser}
        modules={dataModules}
        roles={dataRoles}
      >
        <BanerModule
          imageBanner="/baners/Group 18.jpg"
          title="Historial de movimientos"
        />
        {!idProductFinaly ? (
          <h1 className="text-red-500 text-center text-2xl font-bold">
            No existe ningún historial relacionado
          </h1>
        ) : (
          <div className="w-full p-6 bg-white rounded-md shadow">
            <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
              <div style={{ width: "190px" }}>
                <Link
                  href="/intranet/store/products-finaly"
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
                  onInput={serchInfomation}
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              {typeProductFinaly == "IMPORTADO" ? (
                <TableHistoriesProductFinaly
                  histories={data}
                  getHistory={getImport}
                  deleteHistory={deleteImport}
                />
              ) : (
                <TableHistoriesProductFinAssem
                  histories={data}
                  getHistory={getAssembled}
                  deleteHistory={deleteAssembled}
                />
              )}
            </div>
            <PaginationTable
              currentPage={filters.page}
              quantityRow={filters.show}
              totalData={dataTotal}
              handleChangePage={(number) => changeFilter("page", number)}
            />
          </div>
        )}
      </LoyoutIntranet>
      {typeProductFinaly == "IMPORTADO" ? (
        <FormProductFinalyImport
          formData={formFinalyData}
          viewModal={modalFinalyData}
          listProviders={providers}
          callbackResponse={reponseRequestImport}
          handleClose={handleCloseModalFinaly}
        />
      ) : (
        <FormProductFinalyAssem
          formData={assembleForm}
          handleClose={handleCloseModalAssem}
          detailsProducts={assembleDetails}
          callbackResponse={reponseRequestAssem}
          handleDeleteDetail={handleDeleteDetail}
          handleAddDetail={handleAddDetail}
          viewModal={assembleModal}
          handleChangeMaterial={handleChangeMaterial}
          products={products}
        />
      )}
    </>
  );
}
