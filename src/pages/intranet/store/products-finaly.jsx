import apiAxios from "@/axios";
import BanerModule from "@/components/BanerModule";
import { ButtonPrimarySm } from "@/components/Buttons";
import { InputSearch } from "@/components/Inputs";
import LoyoutIntranet from "@/components/LoyoutIntranet";
import PaginationTable from "@/components/PaginationTable";
import { SelectPrimary } from "@/components/Selects";
import FormMoney from "@/components/stores/FormMoney";
import FormProductFinalyAssem from "@/components/stores/FormProductFinalyAssem";
import FormProductFinalyImport from "@/components/stores/FormProductFinalyImport";
import TableProductsFinaly from "@/components/stores/TableProductsFinaly";
import { sweetAlert } from "@/helpers/getAlert";
import { getCookie } from "@/helpers/getCookie";
import { listStores } from "@/helpers/listStores";
import { parseMoney } from "@/helpers/utilities";
import { verifUser } from "@/helpers/verifUser";
import { useFormAssambled } from "@/hooks/productFinaly/useFormAssambled";
import { useFormFinaly } from "@/hooks/productFinaly/useFormFinaly";
import { useDataList } from "@/hooks/useDataList";
import { useMoney } from "@/hooks/useMoney";
import { PencilIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import React, { useEffect, useState } from "react";
export async function getServerSideProps(context) {
  const userCookie = context.req.cookies;
  return await verifUser(userCookie, "/store/products-finaly");
}
export default function ProductFinalyGeneral({
  dataModules,
  dataRoles,
  dataUser,
}) {
  const headers = getCookie();
  const [providers, setProviders] = useState([]);
  const [products, setProducts] = useState([]);
  const {
    moneyChange,
    setMoneyChange,
    modal: modalMoney,
    handleCloseModal: closeModalMoney,
    handleOpenModal: openModalMoney,
  } = useMoney();
  const { filters, dataTotal, data, serchInfomation, changeFilter } =
    useDataList({
      url: "/products-finaly",
      params: { tipo: "" },
    });
  const {
    handleNewForm: handleNewProductFinaly,
    data: formFinalyData,
    responseRequest: reponseRequestImport,
    modal: modalFinalyData,
    handleCloseModal: handleCloseModalFinaly,
  } = useFormFinaly();
  const {
    details: assembleDetails,
    responseRequest: reponseRequestAssem,
    data: assembleForm,
    modal: assembleModal,
    handleNewForm: handleAssetNewForm,
    handleDeleteDetail,
    handleAddDetail,
    handleChangeMaterial,
    handleCloseModal: handleCloseModalAssem,
  } = useFormAssambled();

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
        title="Productos terminados"
        description="Lista de los productos terminados"
        user={dataUser}
        modules={dataModules}
        roles={dataRoles}
      >
        <BanerModule
          imageBanner="/baners/Group 17.jpg"
          title="Almacén Productos Terminados"
        />
        <div className="w-full p-6 bg-white rounded-md shadow overflow-x-auto">
          <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
            <div className="flex items-center gap-x-4 flex-wrap mb-2">
              <div style={{ width: "350px" }}>
                <SelectPrimary
                  name="tipo"
                  label="Tipo"
                  inputRequired="required"
                  value={filters.tipo}
                  onChange={(e) => changeFilter("tipo", e.target.value)}
                >
                  <option value="">TODOS</option>
                  {listStores
                    .find((store) => store.label === "PRODUCTO TERMINADO")
                    .options.map((store) => (
                      <option value={store.value} key={store.value}>
                        {store.label}
                      </option>
                    ))}
                </SelectPrimary>
              </div>
              <div style={{ width: "200px" }}>
                <div className="flex gap-3">
                  <div className="text-sm">
                    <span className="text-sm block dark:text-white text-placeholder">
                      Tipo de cambio
                    </span>
                    <span className="text-slate-600 font-semibold">
                      {parseMoney(moneyChange.money, "PEN")}
                    </span>
                  </div>
                  {moneyChange.attempt !== 2 && (
                    <ButtonPrimarySm
                      onClick={openModalMoney}
                      icon={<PencilIcon className="size-4" />}
                      title="Editar tipo de cambio"
                    />
                  )}
                </div>
                <small className="text-red-500">
                  Intentos: {moneyChange.attempt}
                </small>
              </div>
            </div>
            <div style={{ width: "300px" }}>
              <InputSearch
                placeholder="¿Que estas buscando?"
                onInput={serchInfomation}
              />
            </div>
          </div>

          <TableProductsFinaly
            products={data}
            money={moneyChange.money}
            addHistoryImport={handleNewProductFinaly}
            addHistoryAssembled={handleAssetNewForm}
          />
          <PaginationTable
            currentPage={filters.page}
            quantityRow={filters.show}
            totalData={dataTotal}
            handleChangePage={(number) => changeFilter("page", number)}
          />
        </div>
      </LoyoutIntranet>
      <FormProductFinalyAssem
        formData={assembleForm}
        handleClose={handleCloseModalAssem}
        detailsProducts={assembleDetails}
        handleDeleteDetail={handleDeleteDetail}
        handleAddDetail={handleAddDetail}
        viewModal={assembleModal}
        callbackResponse={reponseRequestAssem}
        handleChangeMaterial={handleChangeMaterial}
        products={products}
      />
      <FormProductFinalyImport
        formData={formFinalyData}
        callbackResponse={reponseRequestImport}
        viewModal={modalFinalyData}
        listProviders={providers}
        handleClose={handleCloseModalFinaly}
      />
      <FormMoney
        status={modalMoney}
        valueMoney={moneyChange}
        changeMoney={setMoneyChange}
        closeModal={closeModalMoney}
      />
    </>
  );
}
