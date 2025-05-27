import apiAxios from '@/axios';
import { sweetAlert } from '@/helpers/getAlert';
import { useEffect, useState } from 'react';
import { useModal } from '../useModal';

export const useConfiguration = () => {
  const [data, setData] = useState({});
  const {modal,handleOpenModal,handleCloseModal} = useModal("hidden");
  const [formData, setFormData] = useState({
    calculator_price_num_workers: "",
    calculator_price_num_supervisor: "",
    calculator_price_num_day_building: "",
    calculator_included_hours_extra_worker: true,
    calculator_included_hours_extra_supervition: true,
    calculator_price_hours_extra_worker: 3,
    calculator_price_hours_extra_supervition: 3,
    calculator_included_visit_site: true,
    calculator_num_visit_site: 4,
    calculator_included_exam_medical: false,
    calculator_included_food: false,
    calculator_included_pernoctar: false,
    calculator_km_desplacement: "",
  });
  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await apiAxios.get('/calculator/configuration');
        setData(Object.assign({}, ...data.configuration));
      } catch (error) {
        console.error(error);
      }
    };
    getData();
  }, []);
  const handleChangeData = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleChangeFormDataToogle = (e) => {
    const { name, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  };
  const handleChangeFormData = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: parseFloat(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiAxios.put('/calculator/configuration', data);
      sweetAlert({
        title: 'Mensaje',
        text: response.data.message,
        icon: response.data.error ? 'error' : 'success',
      });
    } catch (error) {
      console.error(error);
    }
  };
  return {
    data,
    handleChangeData,
    handleSubmit,
    handleOpenModal,
    formData,
    modal,
    handleCloseModal,
    handleChangeFormData,
    handleChangeFormDataToogle,
  };
};
