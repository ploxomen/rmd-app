import { useState } from "react";
import { useModal } from "../useModal";
import apiAxios from "@/axios";
import { sweetAlert } from "@/helpers/getAlert";
const form = {
  commodi_hist_bill: "",
  name_product: "",
  product_id: "",
  commodi_hist_price_buy: "",
  commodi_hist_guide: "",
  commodi_hist_total_buy: "",
  commodi_hist_type_change: "",
  commodity_provider: "",
  commodi_hist_date: new Date().toISOString().split("T")[0],
  commodi_hist_money: "PEN",
  commodi_hist_unit_measurement: "",
  commodi_hist_amount: "",
};
export const useCommodity = (reloadData = () => {}) => {
  const { modal, handleCloseModal, handleOpenModal } = useModal(true);
  const [data, setData] = useState(form);
  const callbackResponse = () => {
    handleCloseModal();
    reloadData();
  };
  const handleDeleteAllHistory = () => {};
  const handleDeleteHistory = () => {};
  const handleShowHistory = async (idHistory) => {
    try {
      const resp = await apiAxios.get(
        "/store-commodity/history-one/" + idHistory
      );
      if (resp.data.redirect !== null) {
        return route.replace(resp.data.redirect);
      }
      setData({
        ...resp.data.data,
        name_product: resp.data.name_product,
        commodi_hist_unit_measurement: resp.data.measurement_product,
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
  
  const handleAddHistory = (idProduct, nameProduct, unit) => {
    setData({
      ...form,
      product_id: idProduct,
      name_product: nameProduct,
      commodi_hist_unit_measurement: unit,
    });
    handleOpenModal();
  };
  return {
    handleAddHistory,
    modal,
    handleDeleteHistory,
    callbackResponse,
    handleShowHistory,
    handleCloseModal,
    data,
    handleDeleteAllHistory,
  };
};
