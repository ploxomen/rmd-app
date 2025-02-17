import apiAxios from "@/axios";
import BanerModule from "@/components/BanerModule";
import { ButtonPrimary } from "@/components/Buttons";
import { InputPrimary, InputSearch } from "@/components/Inputs";
import LoyoutIntranet from "@/components/LoyoutIntranet";
import PaginationTable from "@/components/PaginationTable";
import TableProductProgress from "@/components/stores/TableProductProgress";
import { sweetAlert } from "@/helpers/getAlert";
import { getCookie } from "@/helpers/getCookie";
import { verifUser } from "@/helpers/verifUser";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";
export async function getServerSideProps(context) {
  const userCookie = context.req.cookies;
  return await verifUser(userCookie, "/store/product-progress");
}
const quantityRowData = 25;
export default function ProductProgressCreate({
  dataModules,
  dataUser,
  dataRoles,
}) {
  let date = new Date();
  date.setMonth(-1);
  const [pagination, setPagination] = useState({
    quantityRowData,
    totalPages: 0,
  });
  const [products, setProducts] = useState([]);
  const [productsRaw, setProductsRaw] = useState([]);

  const headers = getCookie();
  const [dataChange, setDataChange] = useState({
    current: 1,
    search: "",
    reload: false,
    filter_initial:date.toISOString().split('T')[0],
    filter_final:new Date().toISOString().split('T')[0],
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
            filter_final: dataChange.filter_final
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
        const resp = await apiAxios.get("/product-progress-extra/raw-materials", {
          headers
        });
        if (resp.data.redirect !== null) {
          return route.replace(resp.data.redirect);
        }
        setProductsRaw(resp.data.data);
      } catch (error) {
        sweetAlert({
          title: "Error",
          text: "Error al obtener los datos de los productos",
          icon: "error",
        });
        console.error(error);
      }
    };
    getData();
  },[])
  const addHistory = () => {};
  const deleteHistory = () => {};
  const handleChangePage = (number) => {
    if (!number) {
      return;
    }
    setDataChange({ ...dataChange, current: number });
  };
  return (
    <LoyoutIntranet
      title="Crear - Productos en curso"
      description="Creacion de productos en curso"
      user={dataUser}
      modules={dataModules}
      roles={dataRoles}
    >
      <BanerModule
        imageBanner="/baners/Group 10.jpg"
        title="Creación de productos en curso"
      />
      <div className="w-full p-6 bg-white rounded-md shadow overflow-x-auto">
        <div className="flex gap-2">
          <div className="w-full max-w-52">
            <InputPrimary type="date" inputRequired={true} value={dataChange.filter_initial} onChange={e => setDataChange({...dataChange, filter_initial: e.target.value})} label="Fecha Inicio" name="filtroInicio"/>
          </div>
          <div className="w-full max-w-52">
            <InputPrimary type="date" inputRequired={true} value={dataChange.filter_final} onChange={e => setDataChange({...dataChange,filter_final: e.target.value})} label="Fecha Final" name="filtroFinal"/>
          </div>
          <div className="w-full max-w-52">
            <ButtonPrimary text="Agregar" icon={<PlusCircleIcon className='w-5 h-5'/>} onClick={handleOpenModal}/>
          </div>
        </div>
        <div className="lg:ml-auto w-full max-w-80 mb-2">
          <InputSearch
            placeholder="¿Que estas buscando?"
            onInput={serchInfomation}
          />
        </div>
        <TableProductProgress
          columns={['fecha','codigo','producto','cantidad','acciones']}
          products={products}
          addHistory={addHistory}
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
  );
}
