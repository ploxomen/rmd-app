import { useState } from "react";
import { useModal } from "../useModal";
const form = {
  commodi_hist_bill: '',
  name_product: '',
  product_id: '',
  commodi_hist_price_buy: '',
  commodi_hist_total_buy: '',
  commodi_hist_type_change: '',
  commodity_provider: '',
  commod_hist_date: new Date().toISOString().split('T')[0],
  commodi_hist_money: 'PEN',
  commodi_hist_unit_measurement: '',
  commodi_hist_amount: '',
};
export const useCommodity = () => {
    const {modal, handleCloseModal, handleOpenModal} = useModal(true);
    const [data, setData] = useState(form);
    const handleDeleteAllHistory = () => {

    }
    const handleAddHistory = (idProduct,nameProduct) => {
        setData({...form,product_id:idProduct, name_product: nameProduct});
        handleOpenModal();
    }
    return {
        handleAddHistory,
        modal,
        data,
        handleDeleteAllHistory
    }
}