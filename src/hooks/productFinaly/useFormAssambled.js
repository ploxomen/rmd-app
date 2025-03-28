import { useState } from 'react';
import { useModal } from '../useModal';
import { sweetAlert } from '@/helpers/getAlert';
import { getCookie } from '@/helpers/getCookie';
import apiAxios from '@/axios';
const form = {
  product_finaly_id: null,
  product_name: '',
  product_id: '',
  product_finaly_created: new Date().toISOString().split('T')[0],
  product_finaly_description: '',
  product_finaly_amount: '',
  product_price_client: '',
};
export const useFormAssambled = (reloadPage = () => {}) => {
  const headers = getCookie();
  const [loading, setLoading] = useState(false);
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
  const handleGetHistory = async (id) =>{
    setLoading(true);
    try {
      const { data } = await apiAxios.get(`/product-finaly-extra/history/assembled/${id}`, { headers });
      if(!data.error){
        setData(data.data);
        setDetails(data.details);
      }
      handleOpenModal();
    } catch (error) {
      console.error(error);
      sweetAlert({
        title: "Error",
        text: "Error al obtener el detalle del historial",
        icon: "error",
      }); 
    }finally{
      setLoading(false);
    }
}
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
      `/product-finaly-extra/history/assembled/${historyId}`,
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
}
const responseRequest = (response) => {
  if (!response.error) {
    handleCloseModal();
    reloadPage();
  }
}
  return {
    handleAddDetail,
    handleNewForm,
    data,
    responseRequest,
    loading,
    handleDeleteHistory,
    details,
    modal,
    handleCloseModal,
    handleDeleteDetail,
    handleChangeMaterial,
    handleGetHistory
  };
};
