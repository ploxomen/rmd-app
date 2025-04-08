import { useState } from 'react';
import { useModal } from '../useModal';
import apiAxios from '@/axios';
import { getCookie } from '@/helpers/getCookie';
import { sweetAlert } from '@/helpers/getAlert';
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
export const useFormFinaly = (reloadPage = () => {}) => {
  const { modal, handleCloseModal, handleOpenModal } = useModal('hidden');
  const [data, setData] = useState(form);
  const headers = getCookie();
  const [loading, setLoading] = useState(false);
  const handleNewForm = ({
    product_name,
    product_finaly_unit_measurement,
    product_finaly_type_change,
    product_id,
  }) => {
    setData((val) => ({
      ...val,
      product_name,
      product_finaly_unit_measurement,
      product_finaly_type_change,
      product_id,
    }));
    handleOpenModal();
  };
  const handleGetHistory = async (historyId) => {
    setLoading(true);
    try {
      const { data } = await apiAxios.get(
        `/product-finaly-extra/history/imported/${historyId}`,
        { headers }
      );
      setData(data.data);
      handleOpenModal();
    } catch (error) {
      sweetAlert({
        title: 'Error',
        text: 'Error al obtener el historial',
        icon: 'error',
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteHistory = async (historyId) => {
    const question = await sweetAlert({
      title: 'Mensaje',
      text: '¿Deseas eliminar este historial?',
      icon: 'question',
      showCancelButton: true,
    });
    if (!question.isConfirmed) {
      return;
    }
    setLoading(true);
    try {
      const { data } = await apiAxios.delete(
        `/product-finaly-extra/history/imported/${historyId}`,
        { headers }
      );
      if(!data.error){
        sweetAlert({
          title: 'Mensaje',
          text: data.message,
          icon: 'success',
        });
        reloadPage();
      }
    } catch (error) {
      sweetAlert({
        title: 'Error',
        text: 'Error al obtener el historial',
        icon: 'error',
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteAllHistory = async (productFinaly) => {
    const question = await sweetAlert({
      title: 'Mensaje',
      text: '¿Deseas eliminar todo el historial de este producto final?',
      icon: 'question',
      showCancelButton: true,
    });
    if (!question.isConfirmed) {
      return;
    }
    setLoading(true);
    try {
      const { data } = await apiAxios.delete(
        `/products-finaly/${productFinaly}`,
        { headers }
      );
      if(!data.error){
        sweetAlert({
          title: 'Mensaje',
          text: data.success,
          icon: 'success',
        });
        reloadPage();
      }
    } catch (error) {
      sweetAlert({
        title: 'Error',
        text: 'Error al eliminar los historiales',
        icon: 'error',
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  const responseRequest = (response) => {
    if (!response.error) {
      handleCloseModal();
      reloadPage();
    }
  };
  return {
    handleNewForm,
    data,
    modal,
    loading,
    handleGetHistory,
    handleCloseModal,
    responseRequest,
    handleDeleteHistory,
    handleDeleteAllHistory
  };
};
