import apiAxios from '@/axios';
import { sweetAlert } from '@/helpers/getAlert';
import { getCookie } from '@/helpers/getCookie';
import { useEffect, useState } from 'react';
import { useModal } from '../useModal';
import axios from 'axios';
const defaultValues = {
  guide_issue_date: new Date().toISOString().split('T')[0],
  guide_customer_id: '',
  guide_issue_number: '',
  guide_address_destination: '',
  guide_justification: '',
};
const headers = getCookie();
export const useGuideReferral = (reloadPage = () => {}) => {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(defaultValues);
  const { modal, handleCloseModal, handleOpenModal } = useModal('hidden');
  const [details, setDetails] = useState([]);
  useEffect(() => {
    const getData = async () => {
      try {
        const all = await axios.all([
          apiAxios.get('/product-extra/finaly'),
          apiAxios.get('/quotation-extra/customers'),
        ]);
        setProducts(all[0].data.products);
        setCustomers(all[1].data.data);
      } catch (error) {
        console.log(error);
        sweetAlert({
          title: 'Error',
          text: 'Error al obtener los clientes',
          icon: 'error',
        });
      }
    };
    getData();
  }, []);
  const handleDeleteDetail = (id) => {
    setDetails(details.filter((deta) => deta.detail_id != id));
  };
  const handleChangeMaterial = (type, val, id) => {
    if (!details.length) {
      return false;
    }
    let newValue = {};
    newValue[type] = val;
    if (type === 'detail_store') {
      newValue.detail_product_id = '';
    }
    setDetails(
      details.map((value) =>
        value.detail_id === id ? { ...value, ...newValue } : value
      )
    );
  };
  const responseRequest = (response) => {
    if (!response.error) {
      handleCloseModal();
      reloadPage();
    }
  };
  const deleteGuide = async (idGuia) => {
    const question = await sweetAlert({
      title: 'Mensaje',
      text: '¿Deseas eliminar está guía de remisión?',
      icon: 'question',
      showCancelButton: true,
    });
    if (!question.isConfirmed) {
      return;
    }
    setLoading(true);
    try {
      const { data } = await apiAxios.delete(
        `/billing/guide-referral/${idGuia}`
      );
      if (!data.error) {
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
        text: 'Error al eliminar la guía de remisión',
        icon: 'error',
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const closeModal = () => {
    setFormData(defaultValues);
    setDetails([]);
    handleCloseModal();
  };
  const getGuide = async (guideId) => {
    if (!guideId) {
      return handleOpenModal();
    }
    setLoading(true);
    try {
      const { data } = await apiAxios.get(
        `/billing/guide-referral/${guideId}`
      );
      if (!data.error) {
        setFormData(data.data);
        setDetails(data.details);
      }
      handleOpenModal();
    } catch (error) {
      console.error(error);
      sweetAlert({
        title: 'Error',
        text: 'Error al obtener el detalle de la guia de remisión',
        icon: 'error',
      });
    } finally {
      setLoading(false);
    }
  };
  const handleAddDetail = () => {
    setDetails((value) => [
      ...value,
      {
        detail_store: 'MATERIA PRIMA',
        detail_product_id: '',
        detail_stock: 0,
        detail_id: crypto.randomUUID(),
        detail_type: 'new',
      },
    ]);
  };
  return {
    deleteGuide,
    getGuide,
    customers,
    formData,
    modal,
    closeModal,
    products,
    details,
    handleAddDetail,
    handleDeleteDetail,
    handleChangeMaterial,
    responseRequest,
    loading,
  };
};
