import apiAxios from "@/axios";
import BanerModule from "@/components/BanerModule";
import { InputPrimary, InputSearch } from "@/components/Inputs";
import LoyoutIntranet from "@/components/LoyoutIntranet";
import PaginationTable from "@/components/PaginationTable";
import TableProductProgress from "@/components/stores/TableProductProgress";
import { sweetAlert } from "@/helpers/getAlert";
import { getCookie } from "@/helpers/getCookie";
import { verifUser } from "@/helpers/verifUser";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import React, { useEffect, useState } from "react";
export async function getServerSideProps(context) {
  return await verifUser(context, "/store/product-progress");
}
const quantityRowData = 25;
export default function ProductProgressList({
  dataModules,
  dataUser,
  dataRoles,
}) {
  const [pagination, setPagination] = useState({
    quantityRowData,
    totalPages: 0,
  });
  const [products, setProducts] = useState([]);
  const headers = getCookie();
  const [dataChange, setDataChange] = useState({
    current: 1,
    search: "",
    reload: false,
    filter_initial: "",
    filter_final: "",
  });
  let timer = null;
  const serchInfomation = (e) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      setDataChange({ ...dataChange, current: 1, search: e.target.value });
    }, 500);
  };
  useEffect(() => {
    const getData = async () => {
      try {
        const resp = await apiAxios.get("/product-progress", {
          headers,
          params: {
            show: pagination.quantityRowData,
            page: dataChange.current,
            search: dataChange.search,
            filter_initial: dataChange.filter_initial,
            agroup: true,
            filter_final: dataChange.filter_final,
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
  const handleChangePage = (number) => {
    if (!number) {
      return;
    }
    setDataChange({ ...dataChange, current: number });
  };

  return (
    <>
      <LoyoutIntranet
        title="Lista - Productos en curso"
        description="List de los productos en curso"
        user={dataUser}
        modules={dataModules}
        roles={dataRoles}
      >
        <BanerModule
          imageBanner="/baners/Group 10.jpg"
          title="Resumen Almacen PC"
        />
        <div className="w-full p-6 bg-white rounded-md shadow overflow-x-auto">
          <div className="mb-2">
            <Link
              href="../product-progress"
              className="rounded-md overflow-hidden relative inline-flex group items-center justify-center px-3.5 py-2 cursor-pointer border-b-4 border-l-2 hover:bg-red-600 font-semibold transition-all ease-in-out shadow-lg bg-gradient-to-tr bg-red-500 text-white"
            >
              <div className="flex justify-center items-center gap-0.5">
                <ArrowUturnLeftIcon className="size-4" />
                <span className="relative">Regresar</span>
              </div>
            </Link>
          </div>
          <div className="mb-2 flex justify-between items-center flex-wrap">
            <div className="flex gap-2">
              <div className="w-full max-w-52">
                <InputPrimary
                  type="date"
                  inputRequired={true}
                  value={dataChange.filter_initial}
                  onChange={(e) =>
                    setDataChange({
                      ...dataChange,
                      filter_initial: e.target.value,
                    })
                  }
                  label="Fecha Inicio"
                  name="filtroInicio"
                />
              </div>
              <div className="w-full max-w-52">
                <InputPrimary
                  type="date"
                  inputRequired={true}
                  value={dataChange.filter_final}
                  onChange={(e) =>
                    setDataChange({
                      ...dataChange,
                      filter_final: e.target.value,
                    })
                  }
                  label="Fecha Final"
                  name="filtroFinal"
                />
              </div>
            </div>
            <div className="lg:ml-auto w-full max-w-80 mb-2">
              <InputSearch
                placeholder="¿Que estas buscando?"
                onInput={serchInfomation}
              />
            </div>
          </div>
          <TableProductProgress
            columns={["codigo", "producto", "unidad de medida", "cantidad","acciones"]}
            products={products}
            type="reduce"
          />
          <PaginationTable
            currentPage={dataChange.current}
            quantityRow={pagination.quantityRowData}
            totalData={pagination.totalPages}
            handleChangePage={handleChangePage}
          />
        </div>
      </LoyoutIntranet>
    </>
  );
}
