import apiAxios from "@/axios";
import BanerModule from "@/components/BanerModule";
import { ButtonPrimarySm } from "@/components/Buttons";
import { InputSearch } from "@/components/Inputs";
import LoyoutIntranet from "@/components/LoyoutIntranet";
import PaginationTable from "@/components/PaginationTable";
import FormCommodity from "@/components/stores/FormCommodity";
import TableHistoryCommodities from "@/components/stores/TableHistoryCommodities";
import { verifUser } from "@/helpers/verifUser";
import { useCommodity } from "@/hooks/commodity/useCommodity";
import { useApi } from "@/hooks/useApi";
import { useDataList } from "@/hooks/useDataList";
import { useMoney } from "@/hooks/useMoney";
import { ArrowUturnLeftIcon, PlusIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import React from "react";
export async function getServerSideProps(context) {
  const { query } = context;
  const valid = await verifUser(context, "/store/commodity/general");
  let infoProduct = {
    nameProduct: null,
    idCommodity: null,
    measurementProduct: null,
    idProduct: null,
  };
  const headers = {
    Cookie: context.req.headers.cookie,
    Origin: process.env.APP_URL,
  };
  try {
    const response = await apiAxios.get("/store-commodity/" + query.commodity, {
      headers,
    });
    console.log(response.data);
    infoProduct.idCommodity = response.data.data.idCommodity;
    infoProduct.nameProduct = response.data.data.nameProduct;
    infoProduct.measurementProduct = response.data.data.measurementProduct;
    infoProduct.idProduct = response.data.data.idProduct;
  } catch (error) {
    console.log(error);
    infoProduct.idCommodity = null;
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
export default function CommodityHistories({
  dataModules,
  dataUser,
  dataRoles,
  nameProduct,
  idProduct,
  idCommodity,
  measurementProduct,
}) {
  const { data: providers } = useApi("raw-material/providers/list");
  const {
    filters,
    dataTotal,
    data: histories,
    serchInfomation,
    changeFilter,
    reloadPage,
  } = useDataList({
    url: "/store-commodity/histories/" + idCommodity,
  });
  const {
    data: form,
    handleDeleteHistory,
    handleAddHistory,
    handleShowHistory,
    callbackResponse,
    modal,
    handleCloseModal: modalCloseCommodity,
  } = useCommodity(reloadPage);
  const { moneyChange } = useMoney();
  return (
    <>
      <LoyoutIntranet
        title="Almacen mercadería Historial"
        description="Historial de mercadería"
        user={dataUser}
        modules={dataModules}
        roles={dataRoles}
      >
        <BanerModule
          imageBanner="/baners/Group 18.jpg"
          title="Historial de mercadería"
        />
        {!idCommodity ? (
          <h1 className="text-red-500 text-center text-2xl font-bold">
            No existe ningún historial relacionado
          </h1>
        ) : (
          <div className="w-full p-6 bg-white rounded-md shadow">
            <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
              <div style={{ width: "190px" }}>
                <Link
                  href="/intranet/store/commodity/general"
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
                  <ButtonPrimarySm
                    title="Agregar"
                    onClick={(e) =>
                      handleAddHistory(
                        idProduct,
                        nameProduct,
                        measurementProduct
                      )
                    }
                    icon={<PlusIcon className="size-4" />}
                  />
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
              <TableHistoryCommodities
                histories={histories}
                deleteHistory={handleDeleteHistory}
                viewHistory={handleShowHistory}
              />
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
      <FormCommodity
        handleCloseModal={modalCloseCommodity}
        callbackResponse={callbackResponse}
        modal={modal}
        data={form}
        listProviders={providers.providers}
        moneyChange={moneyChange}
      />
    </>
  );
}
