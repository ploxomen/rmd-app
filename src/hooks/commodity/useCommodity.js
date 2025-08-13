import { useState } from "react";
import { useModal } from "../useModal";
const form = {
  product_finaly_id: null,
  product_name: '',
  product_id: '',
  product_finaly_created: new Date().toISOString().split('T')[0],
  product_finaly_description: '',
  product_finaly_amount: '',
  product_price_client: '',
};
export const useCommodity = () => {
    const {modal, handleCloseModal, handleOpenModal} = useModal();
    const [data, setData] = useState(form);
    const handleDeleteAllHistory = () => {

    }
    const handleAddHistory = () => {
        setData(form);
        handleOpenModal();
    }
    return {
        handleAddHistory,
        modal,
        data,
        handleDeleteAllHistory
    }
}