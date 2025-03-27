import apiAxios from '@/axios';
import { sweetAlert } from '@/helpers/getAlert';
import { getCookie } from '@/helpers/getCookie';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const useFormData = ({
  url = '',
  method = 'post',
  data = {},
  idSubmit = null,
  callbackResponse = () => {},
}) => {
  const route = useRouter();
  const headers = getCookie();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(data);
  const [errors, setErrors] = useState([]);
  const setFormulario = (e) => {
    setForm((value) => ({ ...value, [e.target.name]: e.target.value }));
  };
  const setFormManual = (key, value) => {
    setForm((val) => ({ ...val, [key]: value }));
  };
  const setFormObject = (object) => {
    setForm((val) => ({ ...val, ...object }));
  };
  const handleClickSubmit = () => {
    if (!idSubmit || !document.getElementById(idSubmit)) {
      return;
    }
    document.getElementById(idSubmit).click();
  };
  const handleSubmitParam = async (params) => {
    setLoading(true);
    try {
      const resp = await apiAxios[method](url, params, { headers });
      if (resp.data.redirect !== null) {
        return route.replace(resp.data.redirect);
      }
      sweetAlert({
        title: 'Mensaje',
        text: resp.data.message,
        icon: resp.data.error ? 'error' : 'success',
      });
      callbackResponse(resp.data);
    } catch (error) {
        if(error?.response?.status === 422){
            for (const key in error.response.data.errors) {
                if (Object.prototype.hasOwnProperty.call(error.response.data.errors, key)) {
                    const element = error.response.data.errors[key];
                    setErrors((error) => ({...error, [key] : element}))
                }
            }
        }
      sweetAlert({
        title: 'Error',
        text: error?.response?.data?.message || 'Error al guardar los datos',
        icon: 'error',
      });
    } finally {
      setLoading(false);
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const resp = await apiAxios[method](url, form, { headers });
      if (resp.data.redirect !== null) {
        return route.replace(resp.data.redirect);
      }
      sweetAlert({
        title: 'Mensaje',
        text: resp.data.message,
        icon: resp.data.error ? 'error' : 'success',
      });
      callbackResponse(resp.data);
    } catch (error) {
        if(error?.response?.status === 422){
            for (const key in error.response.data.errors) {
                if (Object.prototype.hasOwnProperty.call(error.response.data.errors, key)) {
                    const element = error.response.data.errors[key];
                    setErrors((error) => ({...error, [key] : element}))
                }
            }
        }
      sweetAlert({
        title: 'Error',
        text: error?.response?.data?.message || 'Error al guardar los datos',
        icon: 'error',
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    setFormObject(data)
  },[data])
  return {
    handleSubmit,
    setFormManual,
    setFormulario,
    setFormObject,
    form,
    loading,
    handleSubmitParam,
    handleClickSubmit,
    errors
  };
};
