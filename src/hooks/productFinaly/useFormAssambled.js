import { useState } from 'react';
import { useModal } from '../useModal';
const form = {
  product_finaly_id: null,
  product_name: '',
  product_id: '',
  product_finaly_created: new Date().toISOString().split('T')[0],
  product_finaly_description: '',
  product_finaly_amount: '',
  product_price_client: '',
};
export const useFormAssambled = (products) => {
  const { modal, handleCloseModal, handleOpenModal } = useModal('hidden');
  const [data, setData] = useState(form);
  const [details, setDetails] = useState([]);
  const handleNewForm = ({
    product_name,
    product_price_client,
    product_id,
  }) => {
    setDetails([]);
    setData((val) => ({
      ...val,
      product_name,
      product_id,
      product_price_client,
    }));
    handleOpenModal();
  };
  const handleAddDetail = () => {
    setDetails((value) => [
      ...value,
      { detail_store : "MATERIA PRIMA", detail_product_id : "", detail_stock : 0, detail_id: crypto.randomUUID(), detail_type: 'new' },
    ]);
  };
  const handleDeleteDetail = (id) => {
    setDetails(details.filter(deta => deta.detail_id != id));
  };
  const handleChangeMaterial = (type, val, id) => {
    if (!details.length) {
      return false;
    }
    let newValue = {}
    newValue[type] = val;
    if(type === "detail_store"){
        newValue.detail_product_id = "";
    }
    setDetails(
      details.map(value => value.detail_id === id ? { ...value, ...newValue } : value)
    );
  };

  return {
    handleAddDetail,
    handleNewForm,
    data,
    details,
    modal,
    handleCloseModal,
    handleDeleteDetail,
    handleChangeMaterial,
  };
};
