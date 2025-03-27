import { useState } from 'react';
import { useModal } from '../useModal';
const form = {
  product_finaly_id: null,
  product_finaly_hist_bill: '',
  product_finaly_hist_guide: '',
  product_id: '',
  product_name: '',
  product_finaly_provider: '',
  product_finaly_money: 'PEN',
  product_finaly_type_change: '',
  product_finaly_unit_measurement: '',
  product_finaly_amount: '',
  product_finaly_price_buy: '',
  product_finaly_total_buy: '',
};
export const useFormFinaly = () => {
  const { modal, handleCloseModal, handleOpenModal } = useModal('hidden');
  const [data, setData] = useState(form);

  const handleNewForm = ({
    product_name,
    product_finaly_unit_measurement,
    product_finaly_type_change,
    product_id
  }) => {
    setData((val) => ({
      ...val,
      product_name,
      product_finaly_unit_measurement,
      product_finaly_type_change,
      product_id
    }));
    handleOpenModal();
  };
  const handleViewHistory = (productFinalyId) => {
    
  }
  const responseRequest = (response) => {
    
  }
  return {handleNewForm,data,modal,handleViewHistory,handleCloseModal, responseRequest}
};
