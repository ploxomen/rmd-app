import { useState } from "react";
import { useModal } from "../useModal";
const form = {
  commodi_hist_bill: '',
  name_product: '',
  product_id: '',
  commodi_hist_price_buy: '',
  commodi_hist_guide: '2',
  commodi_hist_total_buy: '',
  commodi_hist_type_change: '',
  commodity_provider: '',
  commodi_hist_date: new Date().toISOString().split('T')[0],
  commodi_hist_money: 'PEN',
  commodi_hist_unit_measurement: '',
  commodi_hist_amount: '',
};
export const useCommodity = (reloadData = () => {}) => {
    const {modal, handleCloseModal, handleOpenModal} = useModal(true);
    const [data, setData] = useState(form);
    const callbackResponse = () =>{
        handleCloseModal();
        reloadData();
    }
    const handleDeleteAllHistory = () => {

    }
    const handleAddHistory = (idProduct,nameProduct,unit) => {
        setData({...form,product_id:idProduct, name_product: nameProduct, commodi_hist_unit_measurement: unit});
        handleOpenModal();
    }
    return {
        handleAddHistory,
        modal,
        callbackResponse,
        handleCloseModal,
        data,
        handleDeleteAllHistory
    }
}