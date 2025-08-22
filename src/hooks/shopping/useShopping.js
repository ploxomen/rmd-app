import { useEffect, useState } from "react";
import { useModal } from "../useModal";
import axios from "axios";
import apiAxios from "@/axios";
import { sweetAlert } from "@/helpers/getAlert";

const INITIAL_FORM = {
  buy_date: new Date().toISOString().split("T")[0],
  buy_date_invoice: "",
  buy_provider: "",
  buy_number_invoice: "",
  buy_number_guide: "",
  buy_type: "NACIONAL",
  buy_type_money: "PEN",
  buy_provider_number_document: "",
  imported_nro_dam: "",
  imported_expenses_cost: "",
  imported_flete_cost: "",
  imported_insurance_cost: "",
  imported_destination_cost: "",
};
const INITIAL_DETAIL = {
  detail_type: "new",
  detail_store: "MATERIA PRIMA",
  detail_product_id: "",
  detail_stock: "",
  datail_price_unit: "",
};
export const useShopping = (reloadPage = () => {}) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [details, setDetails] = useState([]);
  const [providers, setProviders] = useState([]);
  const [products, setProducts] = useState([]);
  const { modal, handleCloseModal, handleOpenModal } = useModal("hidden");

  useEffect(() => {
    const getData = async () => {
      try {
        const all = await axios.all([
          apiAxios.get("/product-extra/finaly"),
          apiAxios.get("/raw-material/providers/list"),
        ]);
        setProviders(all[1].data.providers);
        setProducts(all[0].data.products);
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
  const handleAddShopping = () => {
    setForm({ ...INITIAL_FORM });
    setDetails([]);
    handleOpenModal();
  };
  const handleAddDetail = () => {
    setDetails((detail) => [...detail, { ...INITIAL_DETAIL, detail_id: crypto.randomUUID() }]);
  };
  const handleDeleteDetail = (id) => {
    setDetails(details.filter((detail) => detail.detail_id !== id));
  };
  const responseRequest = (response) => {
    if (!response.error) {
      handleCloseModal();
      reloadPage();
    }
  };
  const handleDeleteBuy = (id) => {};
  const handleViewBuy = (id) => {};
  const handleChangeValueDetail = (type, val, id) => {
    if (!details.length) {
      return false;
    }
    let newValue = {};
    newValue[type] = val;
    if (type === "detail_store") {
      newValue.detail_product_id = "";
    }
    setDetails(
      details.map((value) =>
        value.detail_id === id ? { ...value, ...newValue } : value
      )
    );
  };
  return {
    form,
    details,
    handleAddDetail,
    providers,
    products,
    handleDeleteDetail,
    handleAddShopping,
    modal,
    handleChangeValueDetail,
    handleCloseModal,
    handleDeleteBuy,
    handleViewBuy,
    responseRequest
  };
};
