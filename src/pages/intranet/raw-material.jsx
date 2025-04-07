import apiAxios from "@/axios";
import BanerModule from "@/components/BanerModule";
import { ButtonPrimarySm } from "@/components/Buttons";
import { InputSearch } from "@/components/Inputs";
import LoyoutIntranet from "@/components/LoyoutIntranet";
import PaginationTable from "@/components/PaginationTable";
import { SelectPrimary } from "@/components/Selects";
import FormMoney from "@/components/stores/FormMoney";
import FormRawMaterials from "@/components/stores/FormRawMaterials";
import TableRawMaterial from "@/components/stores/TableRawMaterial";
import { sweetAlert } from "@/helpers/getAlert";
import { getCookie } from "@/helpers/getCookie";
import { listStores } from "@/helpers/listStores";
import { parseMoney } from "@/helpers/utilities";
import { verifUser } from "@/helpers/verifUser";
import { useModal } from "@/hooks/useModal";
import { PencilIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import React, { useEffect, useState } from "react";
export async function getServerSideProps(context) {
  return await verifUser(context, "/raw-material");
}
const initialMoneyChange = {
  money: 0,
  attempt: 0,
};
const quantityRowData = 25;
function RawMaterial({ dataModules, dataUser, dataRoles }) {
  const [products, setProducts] = useState([]);
  const [productsForm, setProductsForm] = useState([]);
  const [editProduct, setEditProduct] = useState({});
  const [providers, setProviders] = useState([]);
  const [moneyChange, setMoneyChange] = useState(initialMoneyChange);
  const [filterStores, setFilterStores] = useState([]);
  const { modal, handleOpenModal, handleCloseModal } = useModal("hidden");
  const {
    modal: modalMoney,
    handleOpenModal: openModalMoney,
    handleCloseModal: closeModalMoney,
  } = useModal("hidden");
  const headers = getCookie();
  const [dataChange, setDataChange] = useState({
    current: 1,
    search: "",
    reload: false,
    label: "",
  });
  const closeModal = () => {
    setProductsForm(
      productsForm.map((proForm) => {
        return { ...proForm, isDisabled: false };
      })
    );
    setEditProduct({});
    handleCloseModal();
  };
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
      if (!resp.data.error) {
        handleCloseModal();
        setEditProduct({});
        setProductsForm(
          productsForm.map((proForm) => {
            return { ...proForm, isDisabled: false };
          })
        );
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
    if (!codeBill) {
      setProductsForm(
        productsForm.map((proForm) => {
          return { ...proForm, isDisabled: false };
        })
      );
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
  const deleteHistory = async (idHistory) => {
    const question = await sweetAlert({
      title: "Mensaje",
      text: "¿Deseas eliminar el historial de este producto?",
      icon: "question",
      showCancelButton: true,
    });
    if (!question.isConfirmed) {
      return;
    }
    try {
      const resp = await apiAxios.delete(`/raw-material/${idHistory}`, {
        headers,
      });
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
            subStore: dataChange.label,
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
          apiAxios.get("money/change", { headers }),
          apiAxios.get("/raw-material/providers/list", { headers }),
        ]);
        setProviders(all[2].data.providers);
        setFilterStores(listStores.find(value => value.label === "MATERIA PRIMA").options);
        setProductsForm(all[0].data.data);
        if (all[1].data.value === null) {
          return openModalMoney();
        }
        setMoneyChange({
          attempt: all[1].data.value.change_attempts,
          money: all[1].data.value.change_soles,
        });
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
        <div className="w-full p-6 bg-white rounded-md shadow">
          <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
            <div className="flex items-center gap-x-4 flex-wrap mb-2">
              <div style={{ width: "350px" }}>
                <SelectPrimary
                  name="customer"
                  label="Etiquetas"
                  inputRequired="required"
                  value={dataChange.label}
                  onChange={(e) =>
                    setDataChange({ ...dataChange, label: e.target.value })
                  }
                >
                  <option value="">TODOS</option>
                  {filterStores.map((store) => (
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
                  {
                    moneyChange.attempt !== 2 && <ButtonPrimarySm onClick={openModalMoney} icon={<PencilIcon className="size-4" />} title='Editar tipo de cambio' />
                  }
                </div>
                <small className="text-red-500">
                  Intentos: {moneyChange.attempt}
                </small>
              </div>
            </div>
            <div style={{ width: "300px" }}>
              <InputSearch
                placeholder="¿Que estas buscando?"
                onInput={searchCustomer}
              />
            </div>
          </div>
          <div className="overflow-x-auto mb-2">
          <TableRawMaterial
            money={moneyChange.money}
            products={products}
            addHistory={addHistory}
            deleteHistory={deleteHistory}
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
      <FormRawMaterials
        valueMoney={moneyChange}
        statusModal={modal}
        listProviders={providers}
        listProduct={productsForm}
        handleCloseModal={closeModal}
        handleValidProduct={handleValidProduct}
        handleSaveHistory={handleSaveHistory}
        productEdit={editProduct}
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

export default RawMaterial;
